"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, ChevronDown } from "lucide-react";
import PhoneInputWithCountry, {
  type Country,
  type Value,
} from "react-phone-number-input";
import { getCountryCallingCode } from "libphonenumber-js";
import ar from "react-phone-number-input/locale/ar.json";
import en from "react-phone-number-input/locale/en.json";
import {
  FALLBACK_COUNTRY,
  SUGGESTED_COUNTRIES,
  flagSrc,
  guessCountry,
  smartInternational,
} from "@/lib/phone";
import { useMounted } from "@/lib/use-mounted";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function Flag({
  country,
  className,
}: {
  country?: Country;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-3.5 w-5 shrink-0 overflow-hidden rounded-[3px] bg-muted ring-1 ring-foreground/10",
        className,
      )}
    >
      {country && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={flagSrc(country)}
          alt=""
          width={20}
          height={14}
          loading="lazy"
          className="size-full object-cover"
        />
      )}
    </span>
  );
}

type Option = { value?: Country; label: string; divider?: boolean };

type CountrySelectProps = {
  value?: Country;
  onChange: (country?: Country) => void;
  options: Option[];
  disabled?: boolean;
  readOnly?: boolean;
  /** Our own, passed through `countrySelectProps`. */
  suggested: Country[];
  invalid?: boolean;
};

/** Flag + dial code button that opens a searchable list of every country. */
function CountrySelect({
  value,
  onChange,
  options,
  disabled,
  readOnly,
  suggested,
  invalid,
}: CountrySelectProps) {
  const t = useTranslations("contact.phone");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const countries = options.filter(
    (o): o is Option & { value: Country } => Boolean(o.value) && !o.divider,
  );
  const top = suggested
    .map((c) => countries.find((o) => o.value === c))
    .filter((o): o is Option & { value: Country } => Boolean(o));

  const item = (o: Option & { value: Country }, group: string) => {
    const code = `+${getCountryCallingCode(o.value)}`;
    return (
      <CommandItem
        key={`${group}-${o.value}`}
        value={`${group}-${o.value}`}
        keywords={[o.label, code, code.slice(1), o.value]}
        onSelect={() => {
          onChange(o.value);
          setOpen(false);
        }}
        className="gap-3 py-2"
      >
        <Flag country={o.value} />
        <span className="min-w-0 flex-1 truncate">{o.label}</span>
        <span
          dir="ltr"
          className="font-mono text-xs text-muted-foreground tabular-nums"
        >
          {code}
        </span>
        <Check
          className={cn(
            "size-4 text-brand",
            o.value === value ? "opacity-100" : "opacity-0",
          )}
        />
      </CommandItem>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled || readOnly}
          aria-label={t("country")}
          data-invalid={invalid || undefined}
          className={cn(
            // sits inside the field's frame: only a hairline separates it from the number
            "flex shrink-0 items-center gap-2 border-e border-input ps-3.5 pe-3 text-sm transition-colors outline-none",
            "hover:bg-accent/60 focus-visible:bg-accent/60 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <Flag country={value} />
          {value && (
            <span className="font-mono text-[13px] text-muted-foreground tabular-nums">
              +{getCountryCallingCode(value)}
            </span>
          )}
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-80 p-0"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <Command>
          <CommandInput placeholder={t("search")} />
          <CommandList className="max-h-72">
            <CommandEmpty>{t("empty")}</CommandEmpty>
            {top.length > 0 && (
              <>
                <CommandGroup>{top.map((o) => item(o, "top"))}</CommandGroup>
                <CommandSeparator />
              </>
            )}
            <CommandGroup>{countries.map((o) => item(o, "all"))}</CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/** The number box. Digits typed without "+" that start with a country code get one (see smartInternational). */
function NumberInput({
  smartCountry,
  onChange,
  ...props
}: React.ComponentProps<typeof Input> & { smartCountry?: Country }) {
  return (
    <Input
      {...props}
      type="tel"
      inputMode="tel"
      onChange={(e) => {
        const next = smartInternational(e.target.value, smartCountry);
        if (next !== e.target.value) e.target.value = next;
        onChange?.(e);
      }}
    />
  );
}

/**
 * International phone field: pick a country (searchable, in Arabic or English),
 * then type the number, which is formatted as you go and capped at that
 * country's length. The value is E.164, e.g. "+201001234567".
 */
export function PhoneInput({
  id,
  value,
  onChange,
  onBlur,
  invalid,
  describedBy,
  className,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  describedBy?: string;
  className?: string;
}) {
  const locale = useLocale();
  const mounted = useMounted();
  // The server can't know the visitor's country, so it renders the fallback and the browser refines it.
  const defaultCountry = mounted ? guessCountry() : FALLBACK_COUNTRY;
  const [country, setCountry] = useState<Country | undefined>();
  const current = country ?? defaultCountry;
  const suggested = [
    ...new Set<Country>([defaultCountry, ...SUGGESTED_COUNTRIES]),
  ];

  return (
    <PhoneInputWithCountry
      dir="ltr"
      value={(value || undefined) as Value | undefined}
      onChange={(v) => onChange(v ?? "")}
      onCountryChange={setCountry}
      onBlur={onBlur}
      defaultCountry={defaultCountry}
      labels={locale === "ar" ? ar : en}
      addInternationalOption={false}
      limitMaxLength
      countrySelectComponent={CountrySelect}
      countrySelectProps={{ suggested, invalid }}
      inputComponent={NumberInput}
      // the plain input reads what NumberInput hands it, so the added "+" is never lost
      smartCaret={false}
      id={id}
      autoComplete="tel"
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      // One frame around picker and number, with a single focus ring, so they read as one field.
      className={cn(
        "flex h-11 w-full overflow-hidden rounded-md border border-input bg-background shadow-xs transition-[color,box-shadow]",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        "has-aria-invalid:border-destructive has-aria-invalid:focus-within:ring-destructive/20",
        className,
      )}
      // numbers read left to right in both languages, flag first
      containerComponentProps={{ dir: "ltr" }}
      numberInputProps={{
        smartCountry: current,
        className:
          "h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-3.5 font-mono tracking-wide shadow-none focus-visible:ring-0 dark:bg-transparent",
      }}
    />
  );
}
