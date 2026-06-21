---
version: alpha
name: BulkBlitz
description: Premium Glassmorphism meets high-contrast fintech dashboard.
colors:
  primary: "#FF6B00"
  primary-hover: "#E65C00"
  bg-black: "#050505"
  bg-card: "rgba(15, 15, 15, 0.72)"
  border-default: "rgba(255, 255, 255, 0.07)"
  border-orange: "rgba(255, 107, 0, 0.22)"
  text-primary: "#FFFFFF"
  text-secondary: "#94A3B8"
  text-tertiary: "#64748B"
  accent-success: "#22C55E"
  accent-danger: "#EF4444"
  accent-premium: "#8B5CF6"
typography:
  h1:
    fontFamily: Kanit
    fontSize: 2.2rem
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: 6px
  md: 10px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  card:
    backgroundColor: "{colors.bg-card}"
    rounded: "{rounded.lg}"
    padding: 24px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
---

## Overview

BulkBlitz visual identity is defined by a high-contrast dark theme combined with vibrant orange interactive accents and modern glassmorphism. It is built to evoke trust, urgency, and premium quality for Indian group-buy manufacturing.

## Colors

- **Primary (#FF6B00):** Vibrant orange accent color used for primary actions, active states, progress indicators, and focus outlines.
- **Background Black (#050505):** Rich absolute near-black backdrop representing premium visual space.
- **Glass Card Background (rgba(15, 15, 15, 0.72)):** High-transparency dark glass base layer to structure content.
- **Border Default (rgba(255, 255, 255, 0.07)):** Fine border framing for frosted card elements.
- **Border Orange (rgba(255, 107, 0, 0.22)):** Orange outline highlight applied on hover.

## Typography

- **Kanit (Display):** Bold, geometric sans-serif typeface used for headlines, page titles, and numeric savings highlights.
- **Inter (Body):** Clean, highly legible sans-serif typeface used for paragraphs, details, labels, and forms.

## Layout

A modular dashboard bento-grid structure is utilized to pack rich information (graphs, charts, KPIs) cleanly without clutter. Content is separated by relative spacing from 8px to 32px.

## Elevation & Depth

Frosted glass layers create visual hierarchy. Multiple cards use backdrop filters with 16px to 24px blurs, combined with ambient orange glow shadows on hover or focus to emphasize interaction.

## Shapes

Organic roundness with 16px corners (`--radius-lg`) for major visual containers, 10px corners (`--radius-md`) for buttons and form elements, and fully pill-shaped roundness for tags and chips.

## Components

- **Glass Cards:** High-transparency card body with subtle borders.
- **Primary Buttons:** Bold orange-gradient actions that elevate on hover with glowing orange shadows.
- **Dark Glass Inputs:** Clean input fields with 5% white opacity, transitioning to orange outline rings on active focus.

## Do's and Don'ts

- **Do** keep typography hierarchy clean and compact.
- **Do** use `tabular-nums` for prices and quantities in tables.
- **Don't** use standard solid gray backgrounds for dashboards.
- **Don't** use bright neon colors other than orange, success green, and error red.
