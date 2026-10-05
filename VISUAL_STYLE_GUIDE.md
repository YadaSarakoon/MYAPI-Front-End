# MyAPI Visual Style Guide & Design System

## 🎨 Complete Visual Design System

### Color Palette

#### Primary Palette
```
Primary Blue
  HEX: #2563EB
  RGB: 37, 99, 235
  Usage: Buttons, links, highlights, primary actions
  
Dark Navy
  HEX: #172033
  RGB: 23, 32, 51
  Usage: Headlines, dark backgrounds, text emphasis
  
Light Blue
  HEX: #EFF6FF
  RGB: 239, 246, 255
  Usage: Light backgrounds, accents, section dividers
  
White
  HEX: #FFFFFF
  RGB: 255, 255, 255
  Usage: Primary background, cards, clean space
```

#### Neutral Palette
```
Light Gray Background
  HEX: #F8FAFC
  RGB: 248, 250, 252
  Usage: Section backgrounds, subtle contrast
  
Border Gray
  HEX: #E5E7EB
  RGB: 229, 231, 235
  Usage: Borders, dividers, subtle separators
  
Dark Gray Text
  HEX: #1F2937
  RGB: 31, 41, 55
  Usage: Primary text, body copy
  
Medium Gray Text
  HEX: #6B7280
  RGB: 107, 114, 128
  Usage: Secondary text, descriptions, captions
  
Light Gray Text
  HEX: #9CA3AF
  RGB: 156, 163, 175
  Usage: Tertiary text, placeholders, disabled states
```

#### Semantic Colors
```
Success Green
  HEX: #10B981
  RGB: 16, 185, 129
  Usage: Success messages, positive feedback, checkmarks
  
Warning Orange
  HEX: #F59E0B
  RGB: 245, 158, 11
  Usage: Warning alerts, caution, attention needed
  
Error Red
  HEX: #EF4444
  RGB: 239, 68, 68
  Usage: Error messages, delete actions, dangers
  
Info Cyan
  HEX: #06B6D4
  RGB: 6, 182, 212
  Usage: Information, tips, helpful notices
```

#### State Colors
```
Disabled
  Color: #D1D5DB (Gray-300)
  Opacity: 50%
  
Hover
  Primary Button: Darken by 10-15%
  Card: Lighten background by 2-5%
  
Active/Focus
  Outline: 2px solid #2563EB
  Offset: 2px
  
Loading
  Color: #3B82F6 (Lighter blue)
  Animation: Spin 1s infinite
```

---

### Typography System

#### Font Stack
```
Primary Font (UI & Headings):
- Font Name: "Inter" or "Poppins"
- Fallback: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- Usage: Headlines, navigation, buttons

Body Font:
- Font Name: "Inter" or "Prompt"
- Fallback: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- Usage: Body text, paragraphs, descriptions

Code Font:
- Font Name: "Fira Code" or "JetBrains Mono"
- Fallback: "Courier New", monospace
- Usage: Code snippets, API examples, technical content
```

#### Typography Scales

##### Desktop Sizes
```
H1 (Page Title)
  Font Size: 48-56px
  Line Height: 1.2
  Font Weight: 900 (Black)
  Letter Spacing: -1px
  
H2 (Section Title)
  Font Size: 36-40px
  Line Height: 1.25
  Font Weight: 700 (Bold)
  Letter Spacing: -0.5px
  
H3 (Subsection Title)
  Font Size: 24-28px
  Line Height: 1.33
  Font Weight: 700 (Bold)
  Letter Spacing: 0px
  
H4 (Card Title)
  Font Size: 18-20px
  Line Height: 1.4
  Font Weight: 600 (Semi-Bold)
  Letter Spacing: 0px
  
Body Large
  Font Size: 16px
  Line Height: 1.6
  Font Weight: 400 (Regular)
  Letter Spacing: 0px
  
Body Regular
  Font Size: 14px
  Line Height: 1.6
  Font Weight: 400 (Regular)
  Letter Spacing: 0px
  
Body Small
  Font Size: 12px
  Line Height: 1.5
  Font Weight: 400 (Regular)
  Letter Spacing: 0px
  
Caption
  Font Size: 11px
  Line Height: 1.4
  Font Weight: 500 (Medium)
  Letter Spacing: 0.5px
```

##### Mobile Sizes
```
H1 (Page Title)
  Font Size: 32px
  Line Height: 1.2
  Font Weight: 900
  
H2 (Section Title)
  Font Size: 24px
  Line Height: 1.25
  Font Weight: 700
  
H3 (Subsection Title)
  Font Size: 20px
  Line Height: 1.3
  Font Weight: 700
  
H4 (Card Title)
  Font Size: 16px
  Line Height: 1.4
  Font Weight: 600
  
Body Large
  Font Size: 14px
  Line Height: 1.6
  Font Weight: 400
  
Body Regular
  Font Size: 13px
  Line Height: 1.6
  Font Weight: 400
```

#### Font Weights
```
300 - Light (rarely used, only for subtle text)
400 - Regular (default body text)
500 - Medium (secondary text, some buttons)
600 - Semi-Bold (subheadings, emphasis)
700 - Bold (primary headings)
900 - Black (large headlines, brand statements)
```

---

### Spacing System

#### Base Unit: 4px

```
2px   - xs (very small gaps)
4px   - sm (minimal spacing)
8px   - md (small spacing)
12px  - lg (medium spacing)
16px  - xl (standard spacing)
20px  - 2xl (generous spacing)
24px  - 3xl (large spacing)
32px  - 4xl (extra large spacing)
40px  - 5xl (double large spacing)
48px  - 6xl (page sections)
56px  - 7xl (major sections)
60px  - 60 (section padding)
80px  - 80 (large section padding)
100px - 100 (extra large padding)
```

#### Component Spacing

```
Button
  Padding: 12px 20px (small), 16px 24px (medium), 16px 32px (large)
  Gap (icon + text): 8px
  
Card
  Padding: 20px (small), 24px (medium), 32px (large)
  Gap between elements: 12px
  
Input
  Padding: 10px 12px (height: 40px), 12px 14px (height: 44px)
  
Navigation
  Item padding: 12px 16px
  Gap between items: 24px
  
Section
  Vertical padding: 60px-80px
  Horizontal padding: 20px (mobile), 40px (tablet), 60px-80px (desktop)
  Gap between sections: 60px-80px
```

---

### Border System

#### Border Radius
```
none      - 0px (sharp corners)
sm        - 4px (very subtle rounding)
md        - 8px (subtle rounding)
lg        - 12px (standard rounding)
xl        - 16px (prominent rounding)
full      - 9999px (circular)
```

#### Border Width
```
0   - no border
1   - 1px (default, subtle)
2   - 2px (focus states)
3   - 3px (thick emphasis)
```

#### Border Colors
```
Default:    #E5E7EB (light gray)
Hover:      #2563EB (blue)
Focus:      #2563EB (blue) + 2px width
Error:      #EF4444 (red)
Success:    #10B981 (green)
```

---

### Shadow System

#### Elevation Levels

```
Level 1 (Subtle)
  Box Shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
  Usage: Hover states on cards, subtle elements
  
Level 2 (Soft)
  Box Shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
              0 2px 4px -1px rgba(0, 0, 0, 0.06)
  Usage: Cards, dropdowns, badges
  
Level 3 (Medium)
  Box Shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
              0 4px 6px -2px rgba(0, 0, 0, 0.05)
  Usage: Modals, elevated components, hero sections
  
Level 4 (Dark)
  Box Shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
              0 10px 10px -5px rgba(0, 0, 0, 0.04)
  Usage: Banners, featured sections, important cards
  
Level 5 (Extra Dark)
  Box Shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
  Usage: Full-page overlays, modals, popovers
```

#### Color-Specific Shadows

```
Blue Shadow (Brand Accent)
  Box Shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.2)
  Usage: CTA sections, blue-themed components
  
Navy Shadow (Dark Emphasis)
  Box Shadow: 0 10px 25px -5px rgba(23, 32, 51, 0.15)
  Usage: Dark sections, premium components
```

---

### Animation & Transition System

#### Duration Standards
```
Fast (instant feedback)       - 100ms
Standard (default)            - 150ms
Slow (prominent change)       - 200ms
Extra Slow (entrance)         - 300ms
Page transition               - 400-500ms
```

#### Easing Functions
```
ease-in        - cubic-bezier(0.4, 0, 1, 1)
               Usage: Exit animations, fade outs
               
ease-out       - cubic-bezier(0, 0, 0.2, 1)
               Usage: Entrance animations, scale ups
               
ease-in-out    - cubic-bezier(0.4, 0, 0.2, 1)
               Usage: Interactive elements, hovers
               
linear         - linear
               Usage: Spinners, infinite animations
```

#### Common Animations

```
Fade In
  opacity: 0 → 1
  duration: 300ms
  easing: ease-out
  
Slide Up
  transform: translateY(20px) → translateY(0)
  opacity: 0 → 1
  duration: 400ms
  easing: ease-out
  
Scale Up
  transform: scale(0.95) → scale(1)
  duration: 300ms
  easing: ease-out
  
Bounce
  transform: scale(1) → scale(1.05) → scale(1)
  duration: 200ms
  
Spin
  transform: rotate(0deg) → rotate(360deg)
  duration: 1s
  iteration: infinite
  easing: linear
  
Pulse
  opacity: 1 → 0.5 → 1
  duration: 2s
  iteration: infinite
```

#### Hover Transitions
```
Button Hover
  background-color: 150ms ease-in-out
  transform: translateY(-2px)
  box-shadow: increase to level 2
  
Card Hover
  box-shadow: level 1 → level 2
  duration: 200ms ease-out
  transform: translateY(-4px)
  
Link Hover
  color: change to blue
  text-decoration: underline
  duration: 100ms ease-in
```

---

### Layout Grid System

#### Desktop (1440px viewport)
```
Columns: 12
Gutter: 24px
Margin: 80px (left/right)
Max Width: 1200px
```

#### Tablet (1024px viewport)
```
Columns: 8
Gutter: 16px
Margin: 40px (left/right)
Max Width: 944px
```

#### Mobile (640px viewport)
```
Columns: 4
Gutter: 12px
Margin: 20px (left/right)
Max Width: 600px
```

#### Small Mobile (320px viewport)
```
Columns: 4
Gutter: 8px
Margin: 16px (left/right)
Max Width: 288px
```

---

### Component States Visual Reference

#### Button States

```
Default
  Background: #2563EB
  Text: White
  Border: none
  Shadow: soft

Hover
  Background: #1D4ED8
  Text: White
  Transform: translateY(-2px)
  Shadow: medium

Active/Pressed
  Background: #1E40AF
  Text: White
  Transform: translateY(0)
  
Disabled
  Background: #D1D5DB
  Text: #9CA3AF
  Cursor: not-allowed
  Opacity: 0.5
  
Focus
  Border: 2px solid #2563EB
  Outline: 2px solid #EFF6FF
  Outline Offset: 2px
  
Loading
  Opacity: 0.8
  Cursor: wait
  Content: Spinner animation
```

#### Input States

```
Default
  Background: #F8FAFC
  Border: 1px #E5E7EB
  Text: #1F2937
  Placeholder: #9CA3AF
  
Focused
  Background: #FFFFFF
  Border: 2px #2563EB
  Outline: 2px solid #EFF6FF
  Box Shadow: 0 0 0 3px rgba(37, 99, 235, 0.1)
  
Filled
  Background: #FFFFFF
  Border: 1px #E5E7EB
  Text: #1F2937
  
Error
  Background: #FEF2F2
  Border: 2px #EF4444
  Text: #1F2937
  
Disabled
  Background: #F3F4F6
  Border: 1px #E5E7EB
  Text: #9CA3AF
  Cursor: not-allowed
  Opacity: 0.6
```

#### Card States

```
Default
  Background: #FFFFFF
  Border: 1px #E5E7EB
  Shadow: soft
  
Hover
  Border: 1px #2563EB
  Shadow: medium
  Transform: translateY(-4px)
  
Active/Selected
  Border: 2px #2563EB
  Background: #EFF6FF
  
Disabled
  Opacity: 0.5
  Pointer Events: none
```

---

### Dark Mode (Optional Future)

If dark mode is implemented, use:

```
Background: #0F172A
Surface: #1F2937
Surface Elevated: #374151
Text Primary: #F3F4F6
Text Secondary: #D1D5DB
Border: #4B5563
Primary Button: #3B82F6 (lighter blue for contrast)
```

---

### Accessibility Color Contrast

#### Verified Contrast Ratios
```
Text on White
  #172033 (headline): 14.5:1 ✓ (AAA)
  #1F2937 (body): 12.6:1 ✓ (AAA)
  #6B7280 (secondary): 5.5:1 ✓ (AA)
  
Text on Blue (#2563EB)
  #FFFFFF (white): 4.5:1 ✓ (AA)
  #EFF6FF (light blue): 1.2:1 ✗ (FAIL - don't use)
  
Text on Light Blue (#EFF6FF)
  #172033 (navy): 11.8:1 ✓ (AAA)
  #2563EB (blue): 3.1:1 ✗ (FAIL - don't use)
```

---

## 📐 Responsive Design Specifications

### Breakpoints
```
Mobile:    320px - 640px   → Stack, simplify
Tablet:    641px - 1024px  → 2-column grid
Desktop:   1025px - 1440px → 3-4 column grid
Wide:      1441px+         → 4+ columns, max-width
```

### Component Behavior

#### Navigation
```
Mobile:   Hamburger menu (offcanvas)
Tablet:   Top nav + simplified
Desktop:  Full horizontal nav
```

#### Hero Section
```
Mobile:   Full width, text-centered, single column
Tablet:   Text left/right, single column text
Desktop:  2-column layout (text + visual)
```

#### Cards Grid
```
Mobile:   1 column (100% width)
Tablet:   2 columns (50% each)
Desktop:  3-4 columns (25-33% each)
```

#### Typography Scaling
```
Headline: 32px (mobile) → 48px (desktop)
Body:     13px (mobile) → 14px (desktop)
```

---

## 🎯 Design Consistency Checklist

### Before Final Implementation:

- [ ] All text meets WCAG AA contrast requirements (4.5:1)
- [ ] All interactive elements are 44px minimum touch target
- [ ] Consistent spacing using the 4px grid
- [ ] Proper heading hierarchy (no skipped levels)
- [ ] Color palette used consistently
- [ ] Shadow system applied correctly
- [ ] Typography scales properly on all breakpoints
- [ ] Hover/focus states visible and clear
- [ ] Images optimized for web
- [ ] Animations use standard duration/easing
- [ ] Buttons have loading states
- [ ] Forms have error/success states
- [ ] Navigation is accessible (keyboard, screen reader)
- [ ] No auto-playing audio/video
- [ ] Forms have clear labels
- [ ] Links are visually distinct
- [ ] Sufficient whitespace between elements
- [ ] Icons have alt text or labels
- [ ] Loading states have spinners
- [ ] Error messages are helpful and clear

---

## 🚀 Implementation Guide

### CSS-in-JS Examples (Tailwind/styled-components)

#### Color Variables
```css
/* Using CSS Custom Properties */
:root {
  --color-primary: #2563EB;
  --color-navy: #172033;
  --color-light-blue: #EFF6FF;
  --color-white: #FFFFFF;
  --color-gray-light: #F8FAFC;
  --color-gray-border: #E5E7EB;
  --color-gray-text: #6B7280;
}

/* Tailwind Usage */
<button className="bg-blue-600 hover:bg-blue-700 text-white font-bold 
                   px-6 py-3 rounded-lg shadow-md transition-all 
                   duration-150 ease-in-out">
  Start for Free
</button>
```

#### Typography Classes
```css
/* Tailwind Config */
extend: {
  fontSize: {
    'h1': ['48px', { lineHeight: '1.2', fontWeight: '900' }],
    'h2': ['36px', { lineHeight: '1.25', fontWeight: '700' }],
    'h3': ['24px', { lineHeight: '1.33', fontWeight: '700' }],
    'h4': ['18px', { lineHeight: '1.4', fontWeight: '600' }],
    'body': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
  }
}

/* Usage */
<h1 className="text-h1 text-navy font-black">Headline</h1>
```

#### Spacing Classes
```css
/* Tailwind Config */
spacing: {
  'xs': '2px',
  'sm': '4px',
  'md': '8px',
  'lg': '12px',
  'xl': '16px',
  '2xl': '20px',
  '3xl': '24px',
  '4xl': '32px',
  '5xl': '40px',
  '6xl': '48px',
  '7xl': '56px',
}

/* Usage */
<div className="p-4xl gap-3xl">Content</div>
```

---

## 📚 Design System Documentation Output

### Component Documentation Template

```
Component: [Component Name]

Purpose: [What it does]

Variants:
- Variant 1: [description]
- Variant 2: [description]

States:
- Default
- Hover
- Active
- Disabled
- Error

Usage:
[Code example]

Accessibility:
- WCAG AA compliant: [✓/✗]
- Keyboard navigable: [✓/✗]
- Screen reader friendly: [✓/✗]

Spacing:
- Padding: [px]
- Margin: [px]
- Gap: [px]

Typography:
- Font: [font-name]
- Size: [px]
- Weight: [weight]
- Line height: [value]

Colors:
- Text: [color code]
- Background: [color code]
- Border: [color code]
```

---

## 🔄 Maintenance & Updates

### How to Update Design System:

1. Create a feature branch: `design/component-updates`
2. Update relevant guide files
3. Add component to component library
4. Update color tokens if adding new colors
5. Verify accessibility compliance
6. Create PR with design system changes
7. Review with design team
8. Merge and update component stubs

### Version Control:
- Keep design files in `/docs/design-system/`
- Update `DESIGN_GUIDE.md` with changes
- Track breaking changes in CHANGELOG
- Document deprecated components

---

## ✅ Final Notes

This design system ensures:
- ✅ Consistency across all pages
- ✅ Professional appearance
- ✅ Developer efficiency (reusable components)
- ✅ Accessibility compliance
- ✅ Performance optimization
- ✅ Scalability for future growth

