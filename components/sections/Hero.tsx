import Image from "next/image";
import Button from "@/components/ui/Button";
import { heroFacts, profile } from "@/data/portfolio";

export default function Hero() {
  return (
    <div className="pb-14 pt-14 md:pb-[72px] md:pt-[88px]">
      <div className="mx-auto max-w-[1120px] px-[18px] sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] md:gap-[72px]">
          <div>
            <p className="flex animate-fade-in flex-wrap items-center gap-2.5 text-[15.5px] text-muted">
              <span className="inline-flex items-center gap-2 text-fg">
                <i className="h-[7px] w-[7px] rounded-full bg-success" />
                Available for work
              </span>
              <span aria-hidden="true">·</span>
              <span>{profile.role}</span>
              <span aria-hidden="true">·</span>
              <span>Egypt, remote</span>
            </p>

            <h1 className="mt-[22px] max-w-[14em] animate-fade-in text-[clamp(2.6rem,5.6vw,4.2rem)] [animation-delay:80ms]">
              I build clear, reliable web products{" "}
              <span className="italic text-accent">from idea to launch.</span>
            </h1>

            <p className="mt-6 max-w-[33em] animate-fade-in text-[clamp(1.05rem,1.6vw,1.18rem)] text-muted [animation-delay:160ms]">
              I&apos;m Ahmad, a full stack developer with more than three years
              of experience. I design the data, build secure APIs with NestJS,
              and create fast, easy-to-use interfaces with Next.js.
            </p>

            <div className="mt-9 flex animate-fade-in flex-wrap gap-3 [animation-delay:240ms]">
              <Button href="#work" arrow>
                View my work
              </Button>
              <Button href="#contact" variant="quiet">
                Contact me
              </Button>
            </div>
          </div>

          <div className="relative aspect-square w-full max-w-[320px] animate-fade-in overflow-hidden rounded-[14px] bg-panel [animation-delay:160ms] md:aspect-[4/5] md:max-w-none">
            <Image
              src="/assets/media/my-photo.png"
              alt="Portrait of Ahmad Marzouk"
              fill
              priority
              sizes="(max-width: 768px) 320px, 360px"
              className="object-contain object-bottom"
            />
          </div>
        </div>

        <div className="mt-14 grid animate-fade-in border-t border-line [animation-delay:320ms] sm:grid-cols-3 md:mt-20">
          {heroFacts.map((fact, index) => (
            <div
              key={fact.value}
              className={`py-[18px] sm:pb-0 sm:pt-6 ${
                index > 0
                  ? "border-t border-line sm:border-l sm:border-t-0 sm:pl-6"
                  : "sm:pr-6"
              }`}
            >
              <b className="block font-head text-[2.15rem] font-normal leading-[1.1] tracking-[-0.015em] tabular-nums">
                {fact.value}
              </b>
              <span className="text-[14.5px] text-muted">{fact.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
