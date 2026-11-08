import { defaultPalette, palettes, type PaletteId } from "@/data/portfolio";

/**
 * Runs before hydration (see app/[locale]/layout.tsx) so the saved theme and
 * palette are applied before the first paint, without a flash. Visitors who
 * haven't picked a palette get the site default chosen in the dashboard.
 *
 * Kept out of ThemeContext.tsx because that file is a client module, and the
 * server layout has to call this.
 */
export const appearanceScript = (fallback: PaletteId) => {
  const ids = palettes.map((p) => p.id);
  const initial = ids.includes(fallback) ? fallback : defaultPalette;
  return `
(function () {
  try {
    var d = document.documentElement;
    var t = localStorage.getItem('theme');
    if (t === 'dark' || ((!t || t === 'system') && matchMedia('(prefers-color-scheme: dark)').matches)) d.classList.add('dark');
    var p = localStorage.getItem('palette');
    if (!p || !/^(${ids.join("|")})$/.test(p)) p = ${JSON.stringify(initial)};
    d.setAttribute('data-palette', p);
  } catch (_) {}
})();
`;
};
