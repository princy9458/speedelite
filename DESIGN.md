# Design System Document

## 1. Overview & Creative North Star: "The Obsidian Gala"
This design system is engineered to evoke the atmosphere of an exclusive, high-stakes evening event. Our Creative North Star, **"The Obsidian Gala,"** focuses on the tension between deep, mysterious voids and the sharp, warm brilliance of champagne gold. 

We move beyond the "standard dark mode" by treating the interface as a physical space. This is achieved through **intentional asymmetry**, where content isn't always boxed in perfectly centered grids, but flows with an editorial rhythm. Large-scale typography acts as a structural element, and "breathing room" (negative space) is treated as a luxury asset, not a wasted area.

---

## 2. Colors: Tonal Depth & Liquid Gold
Our palette is rooted in a rich, dark core, accented by sophisticated metallics.

### Palette Highlights
- **Base Surface:** `#131313` (The Foundation)
- **Primary Accent:** `#D4AF37` / `#F2CA50` (Champagne Gold)
- **Surface Tiers:** From `#0E0E0E` (Lowest) to `#353534` (Highest)
- **On-Surface:** `#E5E2E1` (Warm Off-White)

### The "No-Line" Rule
To maintain a high-end editorial feel, **1px solid borders for sectioning are strictly prohibited.** Do not use lines to separate the header from the body or to divide sidebars. Boundaries must be defined solely through background color shifts. For example, a "Summary" sidebar should use `surface_container_low` against the `surface` background.

### The "Glass & Gradient" Rule
Standard flat buttons are insufficient. Main CTAs must use a subtle linear gradient (from `primary` to `primary_container`) to mimic the way light hits polished metal. For floating overlays or navigation, use semi-transparent surface colors with a `backdrop-blur` of 12px to 20px, creating a "frosted obsidian" effect.

---

## 3. Typography: Sophisticated Contrast
We utilize a two-font system to balance authoritative structure with modern readability.

- **Display & Headlines (Manrope):** Chosen for its geometric precision. Use `display-lg` (3.5rem) with tighter letter-spacing (-0.02em) for hero sections to create a bold, "statement" look.
- **Body & Labels (Plus Jakarta Sans):** A contemporary sans-serif with a high x-height, ensuring legibility even at `body-sm` (0.75rem) within dark, low-contrast environments.

**Hierarchy Strategy:** 
Large headlines should feel like titles in a premium fashion magazine—unapologetically large and providing a clear entry point into the content.

---

## 4. Elevation & Depth: Tonal Layering
In "The Obsidian Gala," depth is felt, not seen. We ignore traditional drop shadows in favor of light-based physics.

- **The Layering Principle:** Stacking determines importance. A card using `surface_container_highest` naturally sits "above" a background of `surface_dim`.
- **Ambient Shadows:** When an element must float (e.g., a modal or tool-tip), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6)`. The shadow should never be harsh; it should feel like a soft glow in reverse.
- **The "Ghost Border" Fallback:** If accessibility requires a container boundary, use the `outline_variant` token at **15% opacity**. This creates a "glint" on the edge rather than a solid cage.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `on_primary` text. Use `xl` (0.75rem) roundedness.
- **Secondary (Ghost):** `outline_variant` (at 20% opacity) border with `primary` colored text.
- **Tertiary:** No background, underline on hover, using `label-md` typography.

### Input Fields
Forms must feel integrated into the "void." 
- **Style:** Dark backgrounds (`surface_container_low`), `xl` roundedness, and a 1px ghost border. 
- **Focus State:** The border transitions to 100% opacity `primary` gold with a subtle outer glow.

### Progress Indicators
Progress must be minimalist and rhythmic. Use thin lines in `outline_variant` with `primary` gold nodes. Completed steps should utilize the checkmark icon in a `primary` circle to provide a sense of achievement.

### Cards & Lists
**Forbid the use of divider lines.** Separate event cards or list items using the `8` (2rem) or `10` (2.5rem) spacing scale. Use "Surface Container" nesting to group related items (e.g., an event summary sitting in a `surface_container_low` box).

---

## 6. Do's and Don'ts

### Do
- **DO** use asymmetry. Place images off-center or overlapping container edges to break the "boxed" feel.
- **DO** use `surface_bright` sparingly for hover states to create a subtle "lighting up" effect.
- **DO** ensure the gold accents (`#D4AF37`) are only used for the most important actions to maintain their "premium" value.

### Don't
- **DON'T** use pure black (`#000000`) for large surfaces; it kills the depth. Use `surface` or `surface_dim`.
- **DON'T** use high-contrast white text. Use `on_surface` (`#E5E2E1`) to reduce eye strain and maintain the "warm" dark atmosphere.
- **DON'T** use default "Material" shadows. If it looks like a standard app, it has failed the "Gala" test.