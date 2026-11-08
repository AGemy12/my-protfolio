"use client";

import { palettes, type PaletteId } from "@/data/portfolio";
import {
  AddButton,
  Card,
  ItemCard,
  ItemList,
  LocalizedLines,
  LocalizedText,
  LOCALES,
  PlainField,
  UploadField,
  useEditor,
} from "./editor";

/** Title shown on a list item: its Arabic text, or the English one. */
function useItemTitle() {
  const { content } = useEditor();
  return (path: (string | number)[]) => {
    const read = (locale: "ar" | "en") =>
      path.reduce<unknown>((node, key) => (node as Record<string | number, unknown>)?.[key], content.messages[locale]);
    return String(read("ar") || read("en") || "");
  };
}

// ---------------------------------------------------------------------------

export function GeneralTab() {
  return (
    <>
      <Card title="محركات البحث (SEO)" description="العنوان والوصف اللذان يظهران في نتائج البحث وعند مشاركة الرابط.">
        <LocalizedText path={["meta", "title"]} label="عنوان الموقع" />
        <LocalizedText path={["meta", "description"]} label="الوصف" long hint="يُفضّل بين 120 و160 حرفاً." />
        <LocalizedText path={["meta", "ogDescription"]} label="وصف المشاركة على الشبكات الاجتماعية" long />
      </Card>

      <Card title="القائمة العلوية">
        <LocalizedText path={["nav", "name"]} label="الاسم بجانب الشعار" />
        <LocalizedText path={["nav", "work"]} label="رابط: الأعمال" />
        <LocalizedText path={["nav", "services"]} label="رابط: الخدمات" />
        <LocalizedText path={["nav", "about"]} label="رابط: نبذة" />
        <LocalizedText path={["nav", "experience"]} label="رابط: الخبرات" />
        <LocalizedText path={["nav", "contact"]} label="رابط: تواصل" />
        <LocalizedText path={["nav", "cta"]} label="زر التواصل" />
      </Card>

      <Card title="التذييل">
        <LocalizedText path={["footer", "rights"]} label="حقوق النشر" hint="{year} تُستبدل تلقائياً بالسنة الحالية." />
        <LocalizedText path={["footer", "top"]} label="رابط العودة للأعلى" />
      </Card>

      <Card
        title="نصوص لقارئات الشاشة"
        description="لا تظهر على الصفحة، لكن تقرؤها برامج قراءة الشاشة لمن يعتمد عليها."
      >
        <LocalizedText path={["nav", "label"]} label="اسم القائمة الرئيسية" />
        <LocalizedText path={["nav", "openMenu"]} label="فتح القائمة (الجوال)" />
        <LocalizedText path={["nav", "closeMenu"]} label="إغلاق القائمة (الجوال)" />
        <LocalizedText path={["nav", "language"]} label="اختيار اللغة" />
        <LocalizedText path={["nav", "toDark"]} label="التبديل للوضع الداكن" />
        <LocalizedText path={["nav", "toLight"]} label="التبديل للوضع الفاتح" />
        <LocalizedText path={["nav", "palette"]} label="اختيار الألوان" />
        <LocalizedText path={["footer", "label"]} label="اسم روابط التذييل" />
      </Card>
    </>
  );
}

// ---------------------------------------------------------------------------

export function HeroTab() {
  const { content, edit } = useEditor();
  const title = useItemTitle();
  return (
    <>
      <Card title="الصورة والسيرة الذاتية">
        <UploadField
          kind="image"
          label="الصورة الشخصية"
          hint="يُفضّل PNG بخلفية شفافة وبنسبة طولية."
          previewClassName="aspect-[4/5] max-w-[220px]! object-contain object-bottom"
          value={content.profile.photo}
          onChange={(url) => edit((d) => void (d.profile.photo = url))}
        />
        <LocalizedText path={["hero", "portraitAlt"]} label="وصف الصورة (لقارئات الشاشة)" />
        <UploadField
          kind="pdf"
          label="ملف السيرة الذاتية (PDF)"
          value={content.profile.cv}
          onChange={(url) => edit((d) => void (d.profile.cv = url))}
        />
      </Card>

      <Card title="النصوص">
        <LocalizedText path={["hero", "available"]} label="شارة التوفر" />
        <LocalizedText path={["hero", "role"]} label="المسمى الوظيفي" />
        <LocalizedText path={["hero", "location"]} label="المكان" />
        <LocalizedText path={["hero", "titleStart"]} label="العنوان الرئيسي" />
        <LocalizedText path={["hero", "titleEnd"]} label="نهاية العنوان (بلون مميز)" />
        <LocalizedText path={["hero", "intro"]} label="التعريف" long />
        <LocalizedText path={["hero", "viewWork"]} label="زر: الأعمال" />
        <LocalizedText path={["hero", "downloadCv"]} label="زر: تحميل السيرة الذاتية" />
      </Card>

      <Card title="الأرقام" description="الأرقام التي تظهر أسفل الواجهة الرئيسية.">
        <ItemList
          path={["hero", "facts"]}
          label="العناصر"
          addLabel="إضافة رقم"
          itemTitle={(i) => title(["hero", "facts", i, "value"])}
          newItem={() => ({ value: "", label: "" })}
        >
          {(i) => (
            <>
              <LocalizedText path={["hero", "facts", i, "value"]} label="الرقم" />
              <LocalizedText path={["hero", "facts", i, "label"]} label="الوصف" />
            </>
          )}
        </ItemList>
      </Card>
    </>
  );
}

// ---------------------------------------------------------------------------

export function WorkTab() {
  const { content, edit } = useEditor();
  const { projects } = content;

  const move = (from: number, to: number) =>
    edit((d) => {
      const [item] = d.projects.splice(from, 1);
      d.projects.splice(to, 0, item);
    });

  const remove = (index: number) =>
    edit((d) => {
      const [removed] = d.projects.splice(index, 1);
      LOCALES.forEach((l) => delete d.messages[l.id].work.projects[removed.id]);
    });

  const add = () =>
    edit((d) => {
      const id = `p${Date.now().toString(36)}`;
      d.projects.push({ id, image: "", link: "" });
      LOCALES.forEach((l) => (d.messages[l.id].work.projects[id] = { title: "", description: "", tags: [] }));
    });

  return (
    <>
      <Card title="المشاريع" description="الترتيب هنا هو ترتيب ظهورها على الموقع.">
        {projects.map((project, index) => {
          const text = (l: "ar" | "en") => content.messages[l].work.projects[project.id];
          const base = ["work", "projects", project.id];
          return (
            <ItemCard
              key={project.id}
              index={index}
              count={projects.length}
              title={text("ar")?.title || text("en")?.title || "مشروع جديد"}
              onMove={(to) => move(index, to)}
              onRemove={() => remove(index)}
            >
              <UploadField
                kind="image"
                label="صورة المشروع"
                hint="لقطة شاشة للصفحة الرئيسية، يُعرض الجزء العلوي منها."
                value={project.image}
                onChange={(url) => edit((d) => void (d.projects[index].image = url))}
              />
              <PlainField
                label="رابط المشروع"
                type="url"
                placeholder="https://"
                value={project.link}
                onChange={(link) => edit((d) => void (d.projects[index].link = link))}
              />
              <LocalizedText path={[...base, "title"]} label="الاسم" />
              <LocalizedText path={[...base, "description"]} label="الوصف" long />
              <LocalizedLines path={[...base, "tags"]} label="التقنيات" hint="سطر لكل تقنية، مثل Next.js" />
            </ItemCard>
          );
        })}
        <AddButton onClick={add}>إضافة مشروع</AddButton>
      </Card>

      <Card title="نصوص القسم">
        <LocalizedText path={["work", "eyebrow"]} label="العنوان الصغير" />
        <LocalizedText path={["work", "title"]} label="العنوان" />
        <LocalizedText path={["work", "intro"]} label="المقدمة" long />
        <LocalizedText path={["work", "github"]} label="رابط GitHub" />
        <LocalizedText path={["work", "visit"]} label="زيارة الموقع (لقارئات الشاشة)" />
      </Card>

      <Card title="الأعمال الخاصة" description="السطر الذي يظهر أسفل المشاريع.">
        <LocalizedText path={["work", "privateLabel"]} label="العنوان" />
        <LocalizedText path={["work", "private"]} label="النص" long />
        <LocalizedText path={["work", "privateNote"]} label="ملاحظة" />
      </Card>
    </>
  );
}

// ---------------------------------------------------------------------------

export function ServicesTab() {
  const title = useItemTitle();
  return (
    <>
      <Card title="نصوص القسم">
        <LocalizedText path={["services", "eyebrow"]} label="العنوان الصغير" />
        <LocalizedText path={["services", "title"]} label="العنوان" />
        <LocalizedText path={["services", "intro"]} label="المقدمة" long />
      </Card>
      <Card title="الخدمات" description="الأيقونات تتكرر بالترتيب: تطبيق، قاعدة بيانات، لوحة تحكم، موقع.">
        <ItemList
          path={["services", "items"]}
          label="العناصر"
          addLabel="إضافة خدمة"
          itemTitle={(i) => title(["services", "items", i, "title"])}
          newItem={() => ({ title: "", description: "" })}
        >
          {(i) => (
            <>
              <LocalizedText path={["services", "items", i, "title"]} label="الاسم" />
              <LocalizedText path={["services", "items", i, "description"]} label="الوصف" long />
            </>
          )}
        </ItemList>
      </Card>
    </>
  );
}

// ---------------------------------------------------------------------------

export function AboutTab() {
  const title = useItemTitle();
  return (
    <>
      <Card title="النصوص">
        <LocalizedText path={["about", "eyebrow"]} label="العنوان الصغير" />
        <LocalizedText path={["about", "title"]} label="العنوان" long />
        <LocalizedText path={["about", "lead"]} label="الفقرة الأولى" long />
        <LocalizedText path={["about", "body"]} label="الفقرة الثانية" long />
      </Card>

      <Card title="معلومات شخصية">
        <ItemList
          path={["about", "details"]}
          label="العناصر"
          addLabel="إضافة معلومة"
          itemTitle={(i) => title(["about", "details", i, "term"])}
          newItem={() => ({ term: "", value: "" })}
        >
          {(i) => (
            <>
              <LocalizedText path={["about", "details", i, "term"]} label="العنوان" />
              <LocalizedText path={["about", "details", i, "value"]} label="القيمة" />
            </>
          )}
        </ItemList>
      </Card>

      <Card title="المهارات والأدوات">
        <LocalizedText path={["about", "toolkit"]} label="عنوان القائمة" />
        <ItemList
          path={["about", "groups"]}
          label="المجموعات"
          addLabel="إضافة مجموعة"
          itemTitle={(i) => title(["about", "groups", i, "name"])}
          newItem={() => ({ name: "", items: [] })}
        >
          {(i) => (
            <>
              <LocalizedText path={["about", "groups", i, "name"]} label="اسم المجموعة" />
              <LocalizedLines path={["about", "groups", i, "items"]} label="المهارات" hint="سطر لكل مهارة." />
            </>
          )}
        </ItemList>
      </Card>
    </>
  );
}

// ---------------------------------------------------------------------------

export function ExperienceTab() {
  const title = useItemTitle();
  return (
    <>
      <Card title="نصوص القسم">
        <LocalizedText path={["experience", "eyebrow"]} label="العنوان الصغير" />
        <LocalizedText path={["experience", "title"]} label="العنوان" />
        <LocalizedText path={["experience", "projectsLabel"]} label="عنوان سطر المشاريع" />
      </Card>
      <Card title="الخبرات والتعليم" description="الحقول الفارغة لا تظهر على الموقع.">
        <ItemList
          path={["experience", "roles"]}
          label="العناصر"
          addLabel="إضافة خبرة"
          itemTitle={(i) => title(["experience", "roles", i, "title"])}
          newItem={() => ({ period: "", title: "", org: "", points: [], projects: "" })}
        >
          {(i) => (
            <>
              <LocalizedText path={["experience", "roles", i, "title"]} label="المسمى" />
              <LocalizedText path={["experience", "roles", i, "org"]} label="الجهة" />
              <LocalizedText path={["experience", "roles", i, "period"]} label="الفترة" />
              <LocalizedLines path={["experience", "roles", i, "points"]} label="المهام" hint="سطر لكل نقطة." />
              <LocalizedText path={["experience", "roles", i, "projects"]} label="المشاريع" />
            </>
          )}
        </ItemList>
      </Card>
    </>
  );
}

// ---------------------------------------------------------------------------

export function ContactTab() {
  const { content, edit } = useEditor();
  const { profile } = content;
  const set = (key: keyof typeof profile) => (value: string) =>
    edit((d) => void (d.profile[key] = value));

  return (
    <>
      <Card title="بيانات التواصل" description="تظهر في قسم التواصل والتذييل.">
        <PlainField label="البريد الإلكتروني" type="email" value={profile.email} onChange={set("email")} />
        <PlainField label="رقم الهاتف" value={profile.phone} onChange={set("phone")} />
        <PlainField
          label="رابط واتساب"
          type="url"
          hint="بالصيغة https://wa.me/ ثم الرقم بدون + أو مسافات."
          value={profile.whatsapp}
          onChange={set("whatsapp")}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <PlainField label="رابط LinkedIn" type="url" value={profile.linkedin} onChange={set("linkedin")} />
          <PlainField label="الاسم الظاهر على LinkedIn" value={profile.linkedinName} onChange={set("linkedinName")} />
          <PlainField label="رابط GitHub" type="url" value={profile.github} onChange={set("github")} />
          <PlainField label="اسم المستخدم على GitHub" value={profile.githubUser} onChange={set("githubUser")} />
        </div>
      </Card>

      <Card title="نصوص القسم">
        <LocalizedText path={["contact", "eyebrow"]} label="العنوان الصغير" />
        <LocalizedText path={["contact", "title"]} label="العنوان" />
        <LocalizedText path={["contact", "intro"]} label="المقدمة" long />
        <LocalizedText path={["contact", "email"]} label="عنوان: البريد" />
        <LocalizedText path={["contact", "phone"]} label="عنوان: الهاتف" />
        <LocalizedText path={["contact", "copy"]} label="زر النسخ" />
        <LocalizedText path={["contact", "copied"]} label="بعد النسخ" />
        <LocalizedText path={["contact", "copyLabel"]} label="زر النسخ (لقارئات الشاشة)" hint="{value} تُستبدل بالنص المنسوخ." />
      </Card>

      <Card title="نموذج المراسلة">
        <LocalizedText path={["contact", "form", "name"]} label="حقل الاسم" />
        <LocalizedText path={["contact", "form", "namePlaceholder"]} label="مثال داخل حقل الاسم" />
        <LocalizedText path={["contact", "form", "email"]} label="حقل البريد" />
        <LocalizedText path={["contact", "form", "message"]} label="حقل الرسالة" />
        <LocalizedText path={["contact", "form", "messagePlaceholder"]} label="مثال داخل حقل الرسالة" />
        <LocalizedText path={["contact", "form", "send"]} label="زر الإرسال" />
        <LocalizedText path={["contact", "form", "sending"]} label="أثناء الإرسال" />
        <LocalizedText path={["contact", "form", "invalid"]} label="رسالة: بيانات ناقصة" />
        <LocalizedText path={["contact", "form", "success"]} label="رسالة: تم الإرسال" hint="{name} يُستبدل باسم المرسل." />
        <LocalizedText path={["contact", "form", "error"]} label="رسالة: فشل الإرسال" />
      </Card>
    </>
  );
}

// ---------------------------------------------------------------------------

export function AppearanceTab() {
  const { content, edit } = useEditor();
  const choose = (id: PaletteId) => edit((d) => void (d.defaultPalette = id));

  return (
    <>
      <Card
        title="الألوان الافتراضية"
        description="ما يراه الزائر أول مرة. يستطيع كل زائر تغييرها من الموقع، ويُحفظ اختياره على جهازه."
      >
        <div role="radiogroup" aria-label="الألوان الافتراضية" className="grid gap-3 sm:grid-cols-2">
          {palettes.map((palette) => {
            const active = content.defaultPalette === palette.id;
            return (
              <button
                key={palette.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => choose(palette.id)}
                className={`flex items-center gap-3.5 rounded-2xl border p-4 text-start transition-colors ${
                  active ? "border-accent bg-accent-soft" : "border-line hover:border-muted"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-line"
                  style={{ background: palette.bg }}
                >
                  <span className="absolute inset-y-0 end-0 w-1/2" style={{ background: palette.accent }} />
                </span>
                <span className="grid">
                  <span className="font-medium">{content.messages.ar.palettes[palette.id]}</span>
                  <span className="text-[13px] text-faint" dir="ltr">
                    {content.messages.en.palettes[palette.id]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="أسماء الألوان" description="تظهر في قائمة اختيار الألوان على الموقع.">
        {palettes.map((palette) => (
          <LocalizedText key={palette.id} path={["palettes", palette.id]} label={palette.id} />
        ))}
      </Card>
    </>
  );
}
