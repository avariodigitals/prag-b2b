# Bundled site fonts

These variable WOFF2 files preserve the site's Onest, Space Grotesk, and DM Sans
families. The root layout loads them with `next/font/local`, avoiding Google
Fonts requests during production builds. Existing CSS variables, weights
(400–700), preloading, and `display: swap` remain in use.

Source: https://github.com/google/fonts/tree/66928797f271fed5ee428544e7229685e2d90127/ofl

- `onest/Onest[wght].ttf` → `onest.woff2`
- `spacegrotesk/SpaceGrotesk[wght].ttf` → `space-grotesk.woff2`
- `dmsans/DMSans[opsz,wght].ttf` → `dm-sans.woff2`

Converted to WOFF2 with FontTools, preserving the full glyph sets and variation
axes. The accompanying OFL files contain each font's redistribution license.
