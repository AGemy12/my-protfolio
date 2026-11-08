import { profile } from "@/data/portfolio";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line pb-11 pt-9 text-[14.5px] text-muted">
      <div className="mx-auto flex max-w-[1120px] flex-wrap justify-between gap-4 px-[18px] sm:px-6">
        <span>
          © {year} {profile.name}
        </span>
        <nav aria-label="Footer" className="flex gap-[22px]">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-fg"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-fg"
          >
            LinkedIn
          </a>
          <a href="#top" className="transition-colors hover:text-fg">
            Back to top ↑
          </a>
        </nav>
      </div>
    </footer>
  );
}
