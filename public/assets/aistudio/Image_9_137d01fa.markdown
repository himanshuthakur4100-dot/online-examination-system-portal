---
name: Academic Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#44474e'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#4a5f84'
  primary: '#001635'
  on-primary: '#ffffff'
  primary-container: '#142b4d'
  on-primary-container: '#7e93bb'
  inverse-primary: '#b2c7f1'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#001a20'
  on-tertiary: '#ffffff'
  tertiary-container: '#003039'
  on-tertiary-container: '#00a0bb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#b2c7f1'
  on-primary-fixed: '#011b3d'
  on-primary-fixed-variant: '#32476b'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  timer-display:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-mobile: 1rem
  margin-tablet: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The brand persona balances uncompromising institutional authority with calm, modern ergonomics. Designed for educational enterprise administrators, proctors, educators, and high-stakes test takers, the emotional goal is psychological clarity, focus, and trust under pressure.

The design language fuses **Corporate Modern** with **Tactile Functionalism**:
- High-clarity layouts engineered to minimize test anxiety and operational friction.
- Distraction-free content zones with high contrast between test materials and interface chrome.
- Visual cues engineered for immediate parsing: unambiguous state signaling, robust countdown timers, and crisp spatial hierarchy.

## Colors

The palette uses a controlled spectrum tailored for institutional security, assessment analytics, and active exam-taking modes:

- **Primary (`#142B4D` - Deep Navy):** Represents structural authority, used for primary navigation bars, active exam frame chrome, master headers, and heavy typography.
- **Secondary (`#2563EB` - Royal Blue):** Used for forward-moving calls to action, selected states, question palette active borders, and primary interactive links.
- **Tertiary / Accent (`#06B6D4` - Cyan):** Highlight color reserved for real-time telemetry, active countdown timers, live proctoring indicators, and progress meters.
- **Neutral Palette:**
  - Canvas Background: `#F8FAFC` (Slate 50) creates an anti-glare canvas.
  - Surface Containers: Pure `#FFFFFF` cards, sidebars, and question modules.
  - Borders: `#E2E8F0` (Slate 200) for standard layout divisions; `#CBD5E1` (Slate 300) for unselected inputs and table borders.
  - Text: Primary `#0F172A`, Muted `#475569`, Supporting `#94A3B8`.

### Semantic Status Tokens
- **Answered / Passed:** `#059669` (Emerald 600) with `#ECFDF5` surface.
- **Review / Flagged:** `#D97706` (Amber 600) with `#FFFBEB` surface.
- **Pending / Unvisited:** `#64748B` (Slate 500) with `#F1F5F9` surface.
- **Failed / Critical / Violation:** `#DC2626` (Red 600) with `#FEF2F2` surface.

## Typography

Typography relies on `Inter` across all functional touchpoints to guarantee extreme micro-legibility and rendering consistency across platforms.

- **Exam Content Body:** Questions default to `body-lg` (18px) to reduce eye fatigue across multi-hour testing windows.
- **Numbers and Timers:** Numeric indicators, countdown blocks, and question palette counters must use tabular figures (`font-variant-numeric: tabular-nums`) to prevent horizontal jitter during second-by-second countdowns.
- **Case Conventions:** Status tags and section caps use sentence case or upper case with explicit spacing (`letter-spacing: 0.05em`) when set at `label-sm`.

## Layout & Spacing

The layout philosophy follows a **structured fluid grid system** with fixed structural sidebars:

- **Desktop (Admin & Live Exam):**
  - **Admin Workspace:** 12-column layout with 24px (`1.5rem`) gutters and a fixed 260px administrative navigation drawer.
  - **Live Exam Console:** Asymmetric split view. An 8-to-9 column primary viewport for the question stage, paired with a fixed 320px right-hand panel for question status palettes, candidate webcam feeds, and remaining time telemetry.
- **Tablet / Split View (768px - 1024px):**
  - The right-hand exam palette moves to an off-canvas drawer or collapsible right-hand dock with 16px (`1rem`) gutters.
- **Mobile (< 768px):**
  - Single-column linear stack. Outer margin drops to 16px (`1rem`). The question palette transforms into a floating bottom sheet triggered via a compact persistent bottom status bar.

## Elevation & Depth

Visual hierarchy uses crisp, structured separation rather than excessive depth:

- **Base Surfaces:** Placed on canvas `#F8FAFC` using a pure white background `#FFFFFF` enclosed in a 1px border (`#E2E8F0`).
- **Low Elevation (Cards, Question Modules, Data Rows):**
  - `box-shadow: 0 1px 3px 0 rgba(20, 43, 77, 0.05), 0 1px 2px -1px rgba(20, 43, 77, 0.03)` with a solid `#E2E8F0` border.
- **Mid Elevation (Sticky Action Headers, Flyout Question Navigators):**
  - `box-shadow: 0 4px 6px -1px rgba(20, 43, 77, 0.07), 0 2px 4px -2px rgba(20, 43, 77, 0.04)` combined with a 1px `#CBD5E1` border.
- **High Elevation (Modals, Integrity Alert Overlays, Dropdowns):**
  - `box-shadow: 0 20px 25px -5px rgba(20, 43, 77, 0.12), 0 8px 10px -6px rgba(20, 43, 77, 0.08)`.
- **Proctor Glass Overlays:** For live video monitoring widgets overlaying content, apply `backdrop-filter: blur(8px)` with `background: rgba(255, 255, 255, 0.85)` and `#E2E8F0` border.

## Shapes

The interface balances institutional discipline with software ergonomics:

- **Standard Containers & Cards:** `rounded-lg` (16px / `1rem`) for main test panels, dashboard analytical widgets, and modal frames.
- **Interactive Controls:** `rounded-md` (8px / `0.5rem`) for standard inputs, primary buttons, dropdown selects, and data table wrappers.
- **Question Palette Tiles:** `rounded-md` (8px / `0.5rem`) for balanced grid density.
- **Status Badges & Pill Indicators:** Fully rounded (`rounded-full` / 9999px) to visually distinguish them from actionable buttons and interactive data elements.

## Components

### Buttons
- **Primary:** Background `#2563EB`, text `#FFFFFF`, hover `#1D4ED8`, active `#1E40AF`. Focused with an outer 2px ring offset in `#06B6D4`.
- **Secondary / Utility:** Background `#FFFFFF`, border 1px solid `#CBD5E1`, text `#142B4D`. Hover `#F8FAFC`.
- **Destructive / Finish Exam:** Background `#DC2626`, text `#FFFFFF`. Requires double confirmation modal.

### Status Indicators & Badges
- **Format:** Inset pill (`padding: 2px 10px`, `rounded-full`, text `label-sm`).
  - **Answered:** Surface `#ECFDF5`, text `#047857`, border `#A7F3D0`.
  - **Marked for Review:** Surface `#FFFBEB`, text `#B45309`, border `#FDE68A`.
  - **Pending / Unvisited:** Surface `#F1F5F9`, text `#475569`, border `#E2E8F0`.
  - **Passed:** Surface `#F0FDF4`, text `#15803D`, border `#BBF7D0`.
  - **Failed:** Surface `#FEF2F2`, text `#B91C1C`, border `#FECACA`.

### Question Grid Palette
- A high-density grid (`repeat(auto-fill, minmax(40px, 1fr))`, gap `8px`).
- Matrix tiles are 40x40px, `rounded-md`, center-aligned, with `label-sm` weights:
  - **Current active:** Border 2px solid `#2563EB`, surface `#EFF6FF`, text `#2563EB`.
  - **Answered:** Solid `#059669`, text `#FFFFFF`.
  - **Review:** Solid `#D97706`, text `#FFFFFF`.
  - **Answered + Review:** Solid `#D97706`, text `#FFFFFF` with a secondary top-right corner dot in `#059669`.
  - **Unvisited:** Surface `#F8FAFC`, border 1px solid `#CBD5E1`, text `#64748B`.

### Countdown Timer
- Fixed contextual widget encased in a 1px `#E2E8F0` pill or card.
- Incorporates an SVG circular progress ring using `#06B6D4` (Cyan).
- Switches color dynamically: Normal `#142B4D`, under 10 minutes `#D97706`, under 2 minutes flashing `#DC2626`.

### Inputs, Checkboxes & Radio Elements
- **Options (MCQs):** Full-width card containers (padding `16px`, `rounded-lg`, border 1.5px solid `#E2E8F0`). Selection changes card border to `#2563EB` with `#EFF6FF` background.
- **Radio / Checkbox Glyphs:** Sized at 20px. Selected state fills with `#2563EB` and renders a crisp white interior glyph.

### Structured Data Tables
- Header row with background `#F8FAFC`, uppercase `label-sm` labels, border-bottom 1px solid `#CBD5E1`.
- Rows contain interactive hover states (`#F1F5F9/50`), cell vertical padding of `14px`, and integrated action slots on the far right.