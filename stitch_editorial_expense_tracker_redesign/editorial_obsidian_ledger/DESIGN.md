---
name: Editorial Obsidian Ledger
colors:
  surface: '#111417'
  surface-dim: '#111417'
  surface-bright: '#37393d'
  surface-container-lowest: '#0b0e11'
  surface-container-low: '#191c1f'
  surface-container: '#1d2023'
  surface-container-high: '#272a2d'
  surface-container-highest: '#323538'
  on-surface: '#e1e2e7'
  on-surface-variant: '#dbc2b0'
  inverse-surface: '#e1e2e7'
  inverse-on-surface: '#2e3134'
  outline: '#a38c7c'
  outline-variant: '#554336'
  surface-tint: '#ffb77d'
  primary: '#ffb77d'
  on-primary: '#4d2600'
  primary-container: '#d97707'
  on-primary-container: '#432100'
  inverse-primary: '#904d00'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb2b7'
  on-tertiary: '#67001b'
  tertiary-container: '#ff516a'
  on-tertiary-container: '#5b0017'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcc3'
  primary-fixed-dim: '#ffb77d'
  on-primary-fixed: '#2f1500'
  on-primary-fixed-variant: '#6e3900'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#111417'
  on-background: '#e1e2e7'
  surface-variant: '#323538'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 22px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  stat-lg:
    fontFamily: JetBrains Mono
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 32px
  stat-lg-mobile:
    fontFamily: JetBrains Mono
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 26px
  stat-md:
    fontFamily: JetBrains Mono
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 20px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  label-sans:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes a quiet, introspective financial tool inspired by the distilled utility of Linear, the editorial warmth of Notion, and the personal intimacy of Copilot Money. It moves decisively away from generic, high-saturation dashboard blue and electric neon gradients, substituting them with high-discipline dark architecture, natural slate neutrals, and balanced data density.

The brand persona is calm, analytical, and uncompromisingly precise. It targets operators, freelancers, and independent professionals who review their economics not as a loud event, but as a deliberate daily practice. The aesthetic is modern editorial minimalism: quiet matte charcoal foundations, razor-sharp 1px hairline dividers, precise typography hierarchy with tabular alignment, and disciplined accent usage where color is strictly reserved for status meaning and key actions.

## Colors

The palette is engineered around dark obsidian slate with warm undertones, avoiding cold, generic ink or pitch black.

- **Background Foundations:** Canvas background is `#0B0D0F`, stepping up into `#121518` for elevated card containers and `#181C20` for nested wells, input fields, and hover states.
- **Hairlines & Dividers:** Border tokens strictly use `#232830` at 1px thickness to define structural edges without visual noise.
- **Typography Tones:** Primary high-readability text uses `#F1F3F5` (chalk white). Secondary data, table headers, and metadata use `#94A0B8` (muted cool slate). Muted hints and placeholder states rely on `#4B5565`.
- **Primary Accent:** Warm amber/ochre (`#D97706`) serves as the brand anchor for focused interactions, primary buttons, and selected tabs.
- **Directional Financial Signals:**
  - **Inflow (Credits / Earnings):** Emerald Sage (`#10B981`) paired with a dark muted tint background (`rgba(16, 185, 129, 0.08)`).
  - **Outflow (Debits / Expenses):** Burnt Coral Crimson (`#F43F5E`) paired with an understated tinted background (`rgba(244, 63, 94, 0.08)`).
- **Rule of Restraint:** Color is never applied as radiant halos or high-contrast drop-shadow glows. Badges, tags, and amounts receive matte, desaturated treatments to maintain a calm baseline.

## Typography

The type system blends structured Grotesque proportions with monospaced precision to establish instant financial clarity.

- **Primary Sans (`Geist`):** Delivers clean neutral legibility for layout navigation, modal framing, input fields, and explanatory captions.
- **Tabular Mono (`JetBrains Mono`):** Dedicated to all metric visualizations, transaction amounts, timestamps, badges, and percentage shifts. All numerical figures must use tabular figures (`font-variant-numeric: tabular-nums`) so decimal points and currency denominations align flush along tabular axes.
- **Scale Hierarchy:** Metric summaries (`stat-lg`) balance medium weight with restrained vertical height. Field labels and column headers are locked to micro-uppercase treatments using `label-mono` with deliberate positive tracking (`letterSpacing: +0.06em`).

## Layout & Spacing

The layout model is anchored on an 8-point structural system, maintaining balance between high-density data tables and generous canvas breathing room.

- **Grid Structure:** A 12-column responsive fluid grid across desktop (`1280px+`), collapsing into 6 columns on tablet, and single/dual-column modular cards on mobile devices.
- **Margins & Gutter Logic:** Global outer canvas uses responsive margins starting at `1rem` on mobile, scaling to `3rem` on widescreen displays. Inner grid gutters transition from `1rem` up to `1.5rem`.
- **Card Padding Protocol:** Component padding is strictly uniform. Financial KPI summary blocks employ `space-lg` (`1.5rem`) on desktop and `space-md` (`1rem`) on compact views to preserve vertical scanning speed.
- **Section Rhythm:** Sibling panels and major sections are separated by `space-xl` (`2.5rem`), while related micro-inputs and form groups observe tight `space-sm` (`0.5rem`) to `space-md` (`1rem`) gaps.

## Elevation & Depth

Visual hierarchy is constructed through tonal surface stacking and 1px crisp borders, strictly avoiding diffused neon drop shadows, colored ambient glows, and heavy blurs.

- **Surface Tiers:**
  - **Level 0 (Canvas):** `#0B0D0F` (Base background).
  - **Level 1 (Card & Module Foundation):** `#121518` bounded by a 1px solid hairline (`#232830`).
  - **Level 2 (Active/Nested Fields & Controls):** `#181C20` border `#2A313C`.
  - **Level 3 (Flyouts, Popovers, & Dropdowns):** `#1C2127` with crisp boundary lines (`#323A46`) and a subtle, non-colored dark falloff (`box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45)`).
- **Hairline Dividers:** Horizontal rules and table rows use standard hairline separators (`1px solid #1E232B`).
- **Focus & States:** Hover states brighten the border token rather than generating elevation changes or drop shadows.

## Shapes

The geometric vocabulary prioritizes geometric stability and subtle curvature without leaning into bulbous, playful forms.

- **Corner Radii Hierarchy:**
  - **Cards, Panels, & Form Blocks:** Standardized at `0.5rem` (8px) or `0.75rem` (12px) for large containers.
  - **Interactive Inputs & Buttons:** Fixed at `0.375rem` (6px) to `0.5rem` (8px) to feel crisp and tactile.
  - **Badges & Inline Status Chips:** Utilize a full pill treatment (`9999px`) to immediately distinguish contextual metadata from square input fields.
  - **Dividers & Checkboxes:** Micro-radii at `0.25rem` (4px) for micro-controls.

## Components

### Metric & KPI Cards
- Base container: `#121518` background, 1px `#232830` border, `1rem` to `1.5rem` internal padding, rounded-lg (`8px-12px`).
- Header: Label in `label-mono` uppercase with `#94A0B8`, paired with a minimalist monochromatic or directional arrow icon (16px, hairline stroke).
- Value Display: Bold tabular monospaced numerals (`stat-lg`) in `#F1F3F5`.
- Delta/Trend Indicator: Micro pill badge with low-opacity emerald sage or burnt crimson background; no bright glowing box-shadows.

### Buttons & Interactive Triggers
- **Primary:** Solid amber tone (`#D97706`), bold dark chalk text (`#0B0D0F` or `#FFFFFF`), rounded-md (`6px-8px`), active state transitions to `#B45309`.
- **Secondary / Ghost:** Transparent or `#181C20` base, 1px `#232830` hairline border, `#F1F3F5` text, subtle hover lift to `#20252C`.
- **Destructive:** Bordered crimson accent (`#F43F5E`) with low-alpha tint backdrop (`rgba(244, 63, 94, 0.08)`).

### Form Inputs & Select Controls
- Surface: `#121518` or `#181C20` with 1px border `#232830`.
- Text & Placeholder: `#F1F3F5` for entered text, `#4B5565` for placeholder copy.
- Focus: 1px active outline transition in `#D97706` (primary amber) with zero glow dispersion.
- Suffix Units: Currency labels ("PKR", "$") and measurement qualifiers ("km / Liter") aligned using `label-mono` in muted slate.

### Transaction Tables & Row Lists
- Header Row: `#0E1013` subtle striping with `label-mono` headers (`#94A0B8`), border-bottom 1px solid `#232830`.
- Data Cells: Border-bottom 1px solid `#1A1E24`, tabular layout spacing, hover transition to `#15181D`.
- Transaction Flow Chips:
  - **Inflow:** Emerald text (`#10B981`) over translucent pill (`rgba(16, 185, 129, 0.08)`), directional icon `↗`.
  - **Outflow:** Crimson text (`#F43F5E`) over translucent pill (`rgba(244, 63, 94, 0.08)`), directional icon `↘`.

### Charts & Analytics Frames
- Visual styling: Clean minimalist axis lines (`#232830`), minimal dash frequency, bar fills rendered in muted slate-copper or warm ochre rather than generic electric blue.
- Tooltips: `#181C20` surface with hairline `#2A313C` border and monospaced data values.