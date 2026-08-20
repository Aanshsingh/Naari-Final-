---
name: Naari
colors:
  surface: '#111319'
  surface-dim: '#111319'
  surface-bright: '#373940'
  surface-container-lowest: '#0c0e14'
  surface-container-low: '#191b21'
  surface-container: '#1d1f26'
  surface-container-high: '#282a30'
  surface-container-highest: '#33353b'
  on-surface: '#e2e2ea'
  on-surface-variant: '#d3c4b0'
  inverse-surface: '#e2e2ea'
  inverse-on-surface: '#2e3037'
  outline: '#9c8f7c'
  outline-variant: '#4f4536'
  surface-tint: '#f5bd53'
  primary: '#f5bd53'
  on-primary: '#422d00'
  primary-container: '#c9962f'
  on-primary-container: '#493200'
  inverse-primary: '#7c5800'
  secondary: '#dec57a'
  on-secondary: '#3c2f00'
  secondary-container: '#564505'
  on-secondary-container: '#cbb36b'
  tertiary: '#c4c6d0'
  on-tertiary: '#2d3038'
  tertiary-container: '#9c9ea8'
  on-tertiary-container: '#33363e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdea8'
  primary-fixed-dim: '#f5bd53'
  on-primary-fixed: '#271900'
  on-primary-fixed-variant: '#5e4200'
  secondary-fixed: '#fbe194'
  secondary-fixed-dim: '#dec57a'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#564505'
  tertiary-fixed: '#e0e2ed'
  tertiary-fixed-dim: '#c4c6d0'
  on-tertiary-fixed: '#181b23'
  on-tertiary-fixed-variant: '#44474f'
  background: '#111319'
  on-background: '#e2e2ea'
  surface-variant: '#33353b'
typography:
  display-brand:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '300'
    lineHeight: '1.4'
    letterSpacing: 0.15em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.1em
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '300'
    lineHeight: '1.3'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 120px
---

## Brand & Style
The design system embodies "Festive Luxury"—a sophisticated blend of traditional Indian heritage and high-end modern e-commerce. The aesthetic is rooted in a dark-mode-first experience that mimics the ambiance of a premium boutique at night, where soft lighting catches the metallic glint of gold embroidery.

The style leverages **Minimalism** with **Tactile/Skeuomorphic** accents. While the layout remains clean and structured, the use of gold gradients and fine-line borders provides a physical, jewelry-like quality to the interface. The emotional response is one of exclusivity, warmth, and curated elegance, targeting a discerning audience looking for high-quality ethnic wear.

## Colors
The palette is centered on a high-contrast relationship between deep, atmospheric neutrals and metallic gold highlights.

- **Primary & Secondary:** A gold spectrum ranging from a deep, antique brass (#C9962F) to a bright, champagne gold (#F0D68A). These should be applied as subtle gradients for buttons and active states to simulate the sheen of metallic silk or jewelry.
- **Backgrounds:** Use the Graphite (#2B2E36) to Deep Charcoal (#1A1C22) gradient. This creates a stage that allows the vibrant colors of the clothing photography to pop.
- **Accents:** Use gold exclusively for calls to action, headings, and delicate outlines.

## Typography
Typography is used to establish hierarchy and a sense of premium space. 

- **Brand Voice:** Plus Jakarta Sans is used for the primary brand marks and main display headings, providing a soft, modern, and feminine touch.
- **Editorial Voice:** Manrope is utilized for all secondary headings and taglines. These must be set with generous letter-spacing (tracking) and in uppercase to evoke the feel of luxury fashion mastheads.
- **Readability:** Body text remains in Manrope with a lighter weight (400) to maintain a clean, airy feel against the dark background. Ensure line height is generous (1.6x) to facilitate a relaxed browsing experience.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to maintain an editorial, "lookbook" feel, while transitioning to a fluid model on mobile.

- **Desktop:** 12-column grid with wide 64px margins. This "whitespace" (which is actually deep charcoal space) is essential to the luxury feel.
- **Vertical Rhythm:** Use large section gaps (120px+) between different collections or product categories to give the content room to breathe.
- **Mobile:** 4-column grid with 20px margins. Product cards should primarily be displayed in a single or staggered two-column layout to emphasize imagery.

## Elevation & Depth
Depth is created through **Tonal Layers** and **Gold Outlining** rather than traditional heavy shadows.

- **Surfaces:** Secondary containers use a slightly lighter shade of charcoal (#353942) to lift them off the base background.
- **Shadows:** Use extremely soft, large-radius shadows with a slight gold tint (e.g., `rgba(201, 150, 47, 0.05)`) to create a warm glow effect behind featured products.
- **Glints:** Apply 1px gold gradients as borders for cards. This creates a "frame" effect that feels high-end and structural.
- **Backdrop:** Use subtle background blurs (10px - 20px) on navigation bars and overlays to maintain the sense of depth without losing the rich background color.

## Shapes
The shape language is **Soft (0.25rem)**. 

While the brand is feminine, the luxury positioning requires a level of architectural precision. Sharp edges feel too aggressive, but fully rounded "pill" shapes feel too casual. The 0.25rem (4px) radius provides a subtle softening of the corners on buttons and cards that feels modern and refined. 

Iconography should be "Line-art" style with thin 1px strokes, incorporating floral or mehendi-inspired curves to balance the geometric layout of the containers.

## Components

- **Primary Buttons:** High-contrast gold gradient backgrounds with dark charcoal text. Use uppercase Manrope with 0.1em letter spacing for the label.
- **Product Cards:** No background (transparent) or a very subtle dark tint. Must feature a 1px gold-outlined border and a soft "gold glow" hover state. 
- **Input Fields:** Bottom-border only (minimalist style) in a muted gold color. Labels should float above the line in uppercase 12px Manrope.
- **Chips/Filters:** Outlined in gold when active; muted graphite when inactive. Use "Soft" 4px rounding.
- **Line-Art Icons:** Custom icons for "Favorites" (Heart), "Cart" (Bag), and "Profile" using delicate, floral-inflected line work in gold.
- **Collection Banners:** High-quality photography with a dark vignette to ensure gold typography overlays remain legible.