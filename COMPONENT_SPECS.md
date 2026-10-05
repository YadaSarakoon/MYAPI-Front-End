# MyAPI Website - UI Component Architecture & Layout Specifications

## 🏗️ Homepage Layout Structure (From Top to Bottom)

```
┌─────────────────────────────────────────┐
│        Navigation Bar (Sticky)          │
│  Logo | Nav Links | Auth Buttons        │
├─────────────────────────────────────────┤
│                                         │
│     1. HERO SECTION                     │
│  (Headline + Subheadline + CTAs)        │
│  (Background: Gradient or Image)        │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  2. FEATURE HIGHLIGHTS (4 Cards)        │
│  [Card] [Card] [Card] [Card]            │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  3. HOW IT WORKS (5 Steps)              │
│  Step1 → Step2 → Step3 → Step4 → Step5  │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  4. API PRODUCTS (Tabs + Details)       │
│  [Tab1] [Tab2] [Tab3] [Tab4]            │
│  Product Details + Code Snippet         │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  5. WHY CHOOSE MYAPI (6 Features)       │
│  [Feature] [Feature] [Feature]          │
│  [Feature] [Feature] [Feature]          │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  6. USE CASES (Grid of 4-6 Cards)       │
│  [Case] [Case] [Case]                   │
│  [Case] [Case] [Case]                   │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  7. SECURITY & RELIABILITY              │
│  Features Grid + Trust Badges           │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  8. PARTNERS/INTEGRATIONS               │
│  Logo Carousel                          │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  9. FAQ (Accordion)                     │
│  [Q] [Q] [Q] [Q] [Q]                    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  10. FINAL CTA                          │
│  (Call to Action Banner)                │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│          FOOTER                         │
│  Links | Resources | Legal | Social     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎨 Detailed Component Specifications

### 1. NAVIGATION BAR

**Structure:**
```
[Logo] [Products] [Docs] [Pricing] [Blog] [Support] ... [Sign In] [Sign Up]
```

**Design:**
- Height: 64px (desktop), 56px (mobile)
- Background: White with subtle shadow
- Sticky: Top 0, z-index high
- Responsive: Hamburger menu on mobile

**Elements:**
- Logo: 32px height
- Nav links: 14px font, spacing 24px
- Auth buttons: Sign In (text), Sign Up (filled blue button)
- Mobile: Hamburger icon → offcanvas menu

**Color:**
- Background: #FFFFFF
- Text: #1F2937
- Hover: #2563EB
- Border: #E5E7EB (bottom border)

---

### 2. HERO SECTION

**Layout:** Full-width section

**Content Areas:**
```
┌────────────────────────────────────────┐
│                                        │
│  Left (60%):                Right (40%)│
│  ├─ Headline                ├─ Image   │
│  ├─ Subheadline             ├─ or      │
│  ├─ Description             ├─ Graphic │
│  └─ CTAs                    └─ Anim.   │
│                                        │
└────────────────────────────────────────┘
```

**Specifications:**
- Height: 600px (desktop), auto (mobile)
- Background: White or gradient (white → light blue #EFF6FF)
- Padding: 60px horizontal, 80px vertical (desktop)
- Text alignment: Left

**Typography:**
- Headline: 48-56px, bold, navy (#172033)
- Key words: Blue (#2563EB)
- Subheadline: 18-20px, regular, dark gray (#4B5563)
- Description: 16px, regular, light gray (#6B7280)

**CTAs:**
- Primary Button: Blue background, white text, 44px height
- Secondary Button: Outline, blue border, 44px height
- Spacing: 16px between buttons

**Visual Elements:**
- Hero image/graphic on the right
- Subtle animation: parallax scroll or fade-in
- No overwhelming visuals (keep it clean)

---

### 3. FEATURE HIGHLIGHTS SECTION

**Layout:** 4-column grid on desktop, 1-2 columns on tablet, 1 column on mobile

```
┌──────────┬──────────┬──────────┬──────────┐
│ Feature1 │ Feature2 │ Feature3 │ Feature4 │
└──────────┴──────────┴──────────┴──────────┘
```

**Card Structure:**
```
┌─────────────────┐
│   [Icon] (48px) │
│                 │
│   Title (18px)  │
│   Bold, Navy    │
│                 │
│ Description     │
│ (14px, Gray)    │
│ Line height 1.6 │
│                 │
└─────────────────┘
```

**Card Specifications:**
- Width: 100% of column
- Padding: 32px
- Background: White
- Border: 1px #E5E7EB
- Border radius: 12px
- Shadow: Soft (0 4px 6px rgba(0,0,0,0.07))
- Hover: Slight lift effect, border becomes blue

**Icon:**
- Size: 48px x 48px
- Color: Blue (#2563EB)
- Margin bottom: 16px

**Section Styling:**
- Background: #F8FAFC or white
- Padding: 80px horizontal, 80px vertical
- Gap between cards: 24px
- Max width: 1200px, centered

---

### 4. HOW IT WORKS SECTION

**Layout:** 5-step horizontal flow (responsive)

```
Desktop:
┌───┐    ┌───┐    ┌───┐    ┌───┐    ┌───┐
│ 1 │───→│ 2 │───→│ 3 │───→│ 4 │───→│ 5 │
└───┘    └───┘    └───┘    └───┘    └───┘

Mobile (Vertical):
┌───┐
│ 1 │
│ ↓ │
│ 2 │
│ ↓ │
│ 3 │
│ ↓ │
│ 4 │
│ ↓ │
│ 5 │
└───┘
```

**Step Card:**
```
┌──────────────────┐
│  Step Number     │ (32px circle, blue bg)
│  or Icon         │
│                  │
│  Step Title      │ (16px, bold)
│                  │
│  Description     │ (14px, gray)
│                  │
└──────────────────┘
```

**Spacing:**
- Vertical gap: 40px
- Arrow/connector: Visible on desktop, hidden on mobile
- Connector color: #E5E7EB

**Section Styling:**
- Background: White or light gray
- Padding: 80px
- Text alignment: Center
- Max width: 1200px

---

### 5. API PRODUCTS SECTION

**Layout:** Tabs + Details Panel

```
Tab Navigation:
┌────────────┬────────────┬────────────┬────────────┐
│  Product1  │  Product2  │  Product3  │  Product4  │
└────────────┴────────────┴────────────┴────────────┘

Content Panel (2 Columns on Desktop):
┌──────────────────────┬──────────────────────┐
│                      │                      │
│  Description         │  Code Snippet        │
│  & Details           │  Live JSON Response  │
│                      │                      │
└──────────────────────┴──────────────────────┘
```

**Tab Bar:**
- Background: White
- Tab item padding: 16px 24px
- Active tab: Blue background, white text
- Inactive: Gray text, hover: light background
- Border bottom: 2px blue indicator on active

**Content Panel:**
- Left (50%): Text content
- Right (50%): Code block
- Gap: 40px
- Responsive: Stack vertically on tablet/mobile

**Code Block:**
- Background: #1F2937 (dark)
- Text: Monospace, syntax highlighted
- Language indicators: JavaScript, Python, etc.
- Copy button: Top right corner
- Border radius: 8px
- Padding: 20px

**Section Styling:**
- Background: #F8FAFC
- Padding: 80px
- Max width: 1200px
- Border top: 1px #E5E7EB

---

### 6. WHY CHOOSE MYAPI SECTION

**Layout:** 3-column grid (2 on tablet, 1 on mobile)

```
┌──────────────┬──────────────┬──────────────┐
│  Feature 1   │  Feature 2   │  Feature 3   │
├──────────────┼──────────────┼──────────────┤
│  Feature 4   │  Feature 5   │  Feature 6   │
└──────────────┴──────────────┴──────────────┘
```

**Feature Item:**
```
┌────────────────────┐
│ Icon (32px)        │
│                    │
│ Title (18px, bold) │
│                    │
│ Description        │
│ (14px, gray)       │
│                    │
└────────────────────┘
```

**Section Styling:**
- Background: White
- Padding: 80px
- Max width: 1200px
- Gap: 32px
- Centered

---

### 7. USE CASES SECTION

**Layout:** 3-2 grid or 2x2 grid on desktop

```
┌──────────────┬──────────────┬──────────────┐
│  Use Case 1  │  Use Case 2  │  Use Case 3  │
├──────────────┼──────────────┼──────────────┤
│  Use Case 4  │  Use Case 5  │  Use Case 6  │
└──────────────┴──────────────┴──────────────┘
```

**Use Case Card:**
```
┌─────────────────────────┐
│ Industry Icon (48px)    │
│                         │
│ Use Case Title (18px)   │
│ Bold, Navy              │
│                         │
│ Description (14px)      │
│ 2-3 lines of text       │
│                         │
│ "Learn More" Link       │
│ with arrow icon         │
│                         │
└─────────────────────────┘
```

**Card Styling:**
- Width: 100% of column
- Padding: 32px
- Background: White
- Border: 1px #E5E7EB
- Border radius: 12px
- Hover: Lift + blue border
- Shadow: Soft

**Section Styling:**
- Background: #F8FAFC
- Padding: 80px
- Max width: 1200px
- Gap: 24px

---

### 8. SECURITY & RELIABILITY SECTION

**Layout:** 2-column or single column

```
Left Column:
├─ Icon + Title + Description
├─ Feature list (6 items)
└─ Trust badges

Right Column:
└─ Security features grid
   or visual chart
```

**Security Feature Item:**
```
✓ Feature name
  Brief description
```

**Trust Badges:**
- Display: Flex, horizontal
- Icons: Security cert, ISO, GDPR, etc.
- Size: 48x48px
- Spacing: 16px

**Section Styling:**
- Background: White
- Padding: 80px
- Max width: 1200px
- Grid columns: 2 on desktop, 1 on mobile

---

### 9. PARTNERS/INTEGRATIONS SECTION

**Layout:** Logo carousel or grid

```
[Logo] [Logo] [Logo] [Logo] [Logo]
[Logo] [Logo] [Logo] [Logo] [Logo]
```

**Logo Item:**
- Size: 120x60px or fit to content
- Grayscale by default
- Hover: Color reveal or slight scale-up
- Opacity: 80% default, 100% on hover

**Section Styling:**
- Background: #F8FAFC
- Padding: 60px 80px
- Max width: 1200px
- Text align: Center
- Tagline: "Trusted by leading companies" (14px, gray)

---

### 10. FAQ SECTION

**Layout:** Single column, accordion-style

```
┌─────────────────────────────────────┐
│ Q: Question?                    [+] │
└─────────────────────────────────────┘
  Answer content (hidden by default)

┌─────────────────────────────────────┐
│ Q: Question?                    [+] │
└─────────────────────────────────────┘
```

**FAQ Item (Closed):**
- Height: 56px
- Padding: 16px 20px
- Background: White
- Border: 1px #E5E7EB
- Border radius: 8px
- Cursor: Pointer
- Hover: Background light blue

**FAQ Item (Open):**
- Expand smoothly
- Answer padding: 20px
- Answer color: #6B7280
- Answer line height: 1.6
- Border color: Blue (#2563EB)

**Section Styling:**
- Background: White
- Padding: 80px
- Max width: 800px, centered
- Gap: 12px between items

---

### 11. FINAL CTA SECTION

**Layout:** Single large banner

```
┌──────────────────────────────────┐
│                                  │
│  Headline                        │
│  (32px, bold, white)             │
│                                  │
│  Subheadline                     │
│  (16px, light, white)            │
│                                  │
│  [Primary CTA Button]            │
│  [Secondary CTA Button]          │
│                                  │
└──────────────────────────────────┘
```

**Banner Styling:**
- Background: Blue (#2563EB) or gradient
- Height: 300px
- Padding: 60px
- Text color: White
- Text align: Center
- Border radius: 16px
- Box shadow: 0 10px 25px rgba(37, 99, 235, 0.2)

**Button in CTA:**
- Primary: White background, blue text
- Secondary: Outline (white border, transparent bg)
- Spacing: 16px
- Size: 44px height

**Section Styling:**
- Padding: 80px
- Max width: 1200px
- Centered

---

### 12. FOOTER

**Layout:** 5-6 columns on desktop, 2 columns on tablet, 1 column on mobile

```
┌────────┬────────┬────────┬────────┬────────┐
│Company │Products│Devlper │Support │Connect │
└────────┴────────┴────────┴────────┴────────┘
```

**Column Structure:**
```
Column Title (14px, bold, white)
- Link 1 (12px, gray)
- Link 2 (12px, gray)
- Link 3 (12px, gray)
- Link 4 (12px, gray)
```

**Footer Styling:**
- Background: #0F172A or #1F2937 (dark navy)
- Text color: #9CA3AF (light gray)
- Padding: 60px 40px
- Link hover: White (#FFFFFF)

**Bottom Footer:**
```
├─ Copyright text (left)
├─ Privacy | Terms | Cookies (center)
└─ Social icons (right)
```

**Social Icons:**
- Size: 24x24px
- Color: Gray
- Hover: Blue (#2563EB)
- Spacing: 16px
- Display: Flex

---

## 🎯 Color Usage Guidelines

### Text Elements
- Headline: #172033 (Dark Navy)
- Subheadline: #4B5563 (Dark Gray)
- Body text: #6B7280 (Medium Gray)
- Light text: #9CA3AF (Light Gray)
- Link text: #2563EB (Blue)
- Link hover: #1D4ED8 (Darker Blue)

### Background Elements
- Primary sections: #FFFFFF (White)
- Secondary sections: #F8FAFC (Light Gray)
- Accent sections: #EFF6FF (Light Blue)
- Dark sections: #0F172A or #1F2937

### Interactive Elements
- Primary button: #2563EB (Blue)
- Button hover: #1D4ED8 (Dark Blue)
- Button active: #1E40AF (Darker Blue)
- Danger button: #EF4444 (Red)
- Success: #10B981 (Green)
- Warning: #F59E0B (Orange)

### Borders & Dividers
- Default border: #E5E7EB (Light Gray)
- Hover border: #2563EB (Blue)
- Subtle divider: #F3F4F6 (Very Light Gray)

---

## 📦 Component Library (Reusable)

### Button Component
```
Variants:
- Primary (blue background)
- Secondary (outline)
- Tertiary (text only)
- Danger (red)

Sizes:
- Small (36px)
- Medium (44px)
- Large (52px)

States:
- Default
- Hover
- Active
- Disabled
- Loading
```

### Card Component
```
Variants:
- Basic (simple white card)
- Elevated (with shadow)
- Bordered (with border)
- Filled (with background color)

Content:
- Icon area
- Title
- Description
- Footer (link or button)
```

### Badge Component
```
Variants:
- Primary
- Success
- Warning
- Error
- Info

Sizes:
- Small (compact)
- Medium (default)
```

### Input Component
```
Variants:
- Text input
- Email input
- Number input
- Textarea

States:
- Default
- Focus
- Filled
- Error
- Disabled
```

### Section Component
```
Padding presets:
- Small (40px)
- Medium (60px)
- Large (80px)
- Extra Large (100px)

Background:
- White
- Light Gray
- Light Blue
- Custom
```

---

## 🔄 Animation & Transition Guidelines

### Page Load Animations
- Fade in: 300-400ms
- Slide from top: 400-500ms
- Scale in: 300-400ms
- Staggered children: 50-100ms delay between items

### Hover Effects
- Button: 150ms ease-in-out
- Card: 200ms ease-out (lift effect)
- Link: 100ms ease-in
- Icon: 150ms ease-in-out

### Scroll Animations
- Fade in on scroll: 300ms
- Slide up on scroll: 400ms
- Parallax effect: Subtle, 0.3 speed factor

### Interaction Feedback
- Click: 50ms press down, 100ms bounce back
- Loading spinner: 1s rotation loop
- Error animation: 300ms shake effect
- Success animation: 400ms check mark animate

### Performance
- Use transform and opacity for animations (GPU-accelerated)
- Avoid animating layout properties (width, height)
- Use will-change for heavy animations
- Debounce scroll events

---

## 📱 Mobile-First Breakpoints

### Mobile: 320px - 640px
- Single column layouts
- Hamburger navigation
- Full-width cards
- Larger touch targets
- Simplified code snippets
- Simplified hero section (text only)
- Vertical step indicators (How It Works)

### Tablet: 641px - 1024px
- 2-column grids
- Side navigation or top nav
- Larger cards
- Adjusted spacing
- Half-size hero section
- Simplified forms

### Desktop: 1025px - 1440px
- 3-4 column grids
- Full navigation
- Larger elements
- Full spacing
- Complete hero section
- Multi-column layouts

### Wide: 1441px+
- 4+ column grids
- Max width constraints (1200-1400px)
- Enhanced spacing
- Sidebar navigation option

---

## ✅ Accessibility Checklist

- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Focus indicators visible
- [ ] Keyboard navigation supported
- [ ] Alt text for all images
- [ ] Semantic HTML structure
- [ ] ARIA labels where needed
- [ ] Form labels associated with inputs
- [ ] Skip navigation link
- [ ] Proper heading hierarchy (h1, h2, h3...)
- [ ] No auto-playing audio/video
- [ ] Sufficient target size (44px minimum)
- [ ] Error messages clear and helpful

---

## 🚀 Performance Optimization

- Image optimization: WebP with fallback
- Lazy loading: Images and sections
- Code splitting: Load non-critical JS later
- CSS optimization: Minify and critical CSS inline
- Font loading: System fonts or optimized Google Fonts
- Reduce animations on slow devices
- Implement critical rendering path
- Monitor Core Web Vitals
- CDN for static assets

