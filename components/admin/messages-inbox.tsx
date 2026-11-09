"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Mail, MailOpen, MessageCircle, Reply, Trash } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { deleteMessage, setMessageRead } from "@/lib/actions/content";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useConfirmDelete } from "@/components/confirm-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, PageHeader } from "./ui";
import { useActionToast } from "./resource-form";

export function MessagesInbox({ messages: initial }: { messages: Message[] }) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const router = useRouter();
  const notify = useActionToast();
  const confirmDelete = useConfirmDelete();
  const [messages, setMessages] = useState(initial);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [openId, setOpenId] = useState("");
  const [, start] = useTransition();
  const fmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", { dateStyle: "medium", timeStyle: "short" });

  const unread = messages.filter((m) => !m.read).length;
  const shown = filter === "unread" ? messages.filter((m) => !m.read) : messages;

  const markRead = (m: Message, read: boolean) => {
    setMessages((list) => list.map((x) => (x._id === m._id ? { ...x, read } : x)));
    start(async () => {
      const r = await setMessageRead(m._id, read);
      if (!r.ok) notify(r);
      router.refresh();
    });
  };

  const onOpenChange = (id: string) => {
    setOpenId(id);
    const m = messages.find((x) => x._id === id);
    if (m && !m.read) markRead(m, true);
  };

  const remove = async (m: Message) => {
    if (!(await confirmDelete())) return;
    setMessages((list) => list.filter((x) => x._id !== m._id));
    start(async () => {
      notify(await deleteMessage(m._id));
      router.refresh();
    });
  };

  return (
    <>
      <PageHeader
        title={t("messages.title")}
        actions={
          <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")}>
            <TabsList>
              <TabsTrigger value="all">{t("messages.all")}</TabsTrigger>
              <TabsTrigger value="unread">
                {t("messages.unread")}
                <Badge variant={unread ? "brand" : "secondary"} className="ms-1 px-1.5 font-mono">
                  {unread}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />
      {shown.length === 0 ? (
        <EmptyState>{t("messages.empty")}</EmptyState>
      ) : (
        <Card className="gap-0 overflow-hidden py-0">
          <Accordion type="single" collapsible value={openId} onValueChange={onOpenChange}>
            {shown.map((m) => (
              <AccordionItem key={m._id} value={m._id} className={cn(!m.read && "bg-brand-soft/40")}>
                <AccordionTrigger className="items-start gap-3 rounded-none px-4 font-normal hover:no-underline">
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", m.read ? "bg-transparent" : "bg-brand")} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className={cn("truncate text-base", !m.read && "font-semibold")}>
                        {m.name}{" "}
                        <span className="text-sm font-normal text-muted-foreground" dir="ltr">
                          &lt;{m.email}&gt;
                        </span>
                      </p>
                      <time className="text-xs text-muted-foreground">{fmt.format(new Date(m.createdAt))}</time>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {m.subject && (
                        <Badge variant="secondary" className="me-1.5">
                          {m.subject}
                        </Badge>
                      )}
                      {openId === m._id ? "" : m.message}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 ps-9">
                  <p className="rounded-md border bg-background p-4 text-sm leading-relaxed whitespace-pre-wrap" dir="auto">
                    {m.message}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject || ""))}`}>
                        <Reply className="rtl:-scale-x-100" /> {t("messages.reply")}
                      </a>
                    </Button>
                    {m.whatsapp && (
                      <Button asChild size="sm" variant="outline">
                        <a href={`https://wa.me/${m.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle /> {t("messages.replyWhatsapp")}
                          <span className="font-mono text-xs text-muted-foreground" dir="ltr">
                            {m.whatsapp}
                          </span>
                        </a>
                      </Button>
                    )}
                    <Button type="button" variant="outline" size="sm" onClick={() => markRead(m, !m.read)}>
                      {m.read ? <Mail /> : <MailOpen />}
                      {m.read ? t("messages.markUnread") : t("messages.markRead")}
                    </Button>
                    <Button type="button" variant="ghost-destructive" size="sm" onClick={() => remove(m)}>
                      <Trash /> {t("common.delete")}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      )}
    </>
  );
}
