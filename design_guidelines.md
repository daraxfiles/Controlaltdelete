# Creative Media Production Bootcamp - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from modern educational platforms (Khan Academy, Codecademy) combined with youth-oriented design patterns (Scratch, Google for Education) to create an engaging yet credible research-focused experience.

**Core Principle**: Balance playful engagement for 12-15 year-olds with educational credibility for parents and researchers. Avoid overly childish aesthetics while maintaining energy and approachability.

---

## Typography

**Font Stack**:
- Primary: Inter (headings, UI elements) - clean, modern, highly readable
- Secondary: Source Sans Pro (body text) - friendly, approachable for younger audiences
- Accent: Space Grotesk (callouts, statistics) - contemporary, attention-grabbing

**Hierarchy**:
- Hero Headlines: 3xl-5xl, bold weight, tight line-height
- Section Headers: 2xl-3xl, semibold
- Subheadings: xl-2xl, medium weight
- Body Text: base-lg, regular weight, generous line-height (1.7)
- UI Labels/Buttons: sm-base, medium-semibold weight
- Captions/Meta: sm, regular weight

---

## Layout System

**Spacing Units**: Use Tailwind units of **4, 6, 8, 12, 16** for consistent rhythm
- Component padding: p-6 to p-12
- Section spacing: py-16 to py-24 (desktop), py-12 (mobile)
- Card gaps: gap-6 to gap-8
- Element margins: m-4 to m-8

**Grid Structure**:
- Maximum container width: max-w-7xl
- Content sections: max-w-6xl
- Text-heavy sections: max-w-4xl
- Multi-column grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

---

## Component Library

### Navigation
- Sticky header with logo, horizontal nav links
- Prominent "Register" CTA button (top-right)
- Mobile: Hamburger menu with slide-out drawer
- Include "Participant Info" and "Contact Researchers" links

### Hero Section
- **Large hero image**: Students collaborating on media project in classroom/lab setting (authentic, diverse middle schoolers)
- Overlaid heading + 2-sentence description with blurred-background buttons
- Dual CTAs: "Learn About the Study" and "View Daily Schedule"
- Stats bar below hero: "6 Weeks | Grades 6-8 | Media Literacy"

### Daily Schedule Component
- Accordion-style expandable days (Day 1 through Day 12)
- Each accordion header: Day number, theme, duration
- Expanded view: Activity breakdown with time allocations, objectives, game/video icons
- Progress indicators showing week groupings (Week 1-2, Week 3, Week 4-5)

### Activity Cards
- Cards for games (Fake it to Make it, Lamboozled) with playful icons
- Activity type badges: "Game", "Video", "Discussion", "Creation"
- Estimated time + skills practiced (e.g., "Critical Thinking, Collaboration")

### Project Creation Workspace
- Step-by-step wizard with numbered progress indicator (1-8)
- Each step: Large step number, clear instruction heading, form fields/prompts
- Side panel with "Tips for Success" relevant to current step
- Example prompts in light callout boxes
- "Save Progress" and "Next Step" action buttons at bottom

### Media Format Selection
- Large icon cards for format types: Video Essay, Podcast, Photo Story, Infographic, Digital Story, Meme/Ad
- Click to select with visual confirmation (border highlight, checkmark)
- Brief description and example under each option

### Portfolio Gallery
- Masonry grid layout for showcased student projects
- Project cards with thumbnail, title, student name (or team), issue theme tag
- Filter by media type and societal issue tags

### Resource Cards
- Tool recommendations with icon, name, difficulty badge (Beginner/Intermediate), platform icons
- "Learn More" expandable sections for videos on media credibility, deconstruction, construction

---

## Page-Specific Layouts

### Homepage
- Hero section (as described above)
- "What You'll Learn" grid: 3 columns featuring Media Literacy, Misinformation Detection, Creative Production with icons
- "6-Week Journey" timeline visualization with week groupings
- "Meet the Researchers" section with photos, names, contact info
- "Ready to Join?" CTA section with registration details

### About the Bootcamp
- Two-column split: Left (program details), Right (key facts sidebar with study duration, location, researcher info)
- Accordion for "What Students Gain" and "What Parents Should Know"
- Program branding prominent

### Learning Modules (Weeks Breakdown)
- Week cards arranged horizontally, each showing focus area and key activities
- Click to expand for detailed daily breakdown

### Interactive Workspace
- Full-width layout with left sidebar navigation showing all 8 steps
- Central workspace area for current step's form/content
- Right sidebar for tips, examples, resources (collapsible on mobile)
- Persistent "Your Progress" bar at top

---

## Images

**Hero Image**: Authentic photo of diverse middle school students (12-15 years old) collaborating around laptops/tablets, creating media content in a bright, modern classroom setting. Should convey energy, creativity, and teamwork.

**Section Images**:
- Learning Modules: Icons/illustrations for technobiography, fact-checking, media creation
- Games Section: Stylized screenshots or logos for "Fake it to Make it" and "Lamboozled"
- Portfolio: Student-created work thumbnails (video stills, podcast cover art, infographic previews)
- Researcher Photos: Professional headshots of study investigators

**Image Treatment**: Rounded corners (rounded-lg to rounded-xl), subtle shadows for depth, consistent aspect ratios within sections

---

## Accessibility & UX

- High contrast text on all backgrounds
- Form inputs with clear labels, helper text, validation states
- Keyboard navigation throughout with visible focus states
- Alt text for all images, ARIA labels for interactive elements
- Progress indicators for multi-step processes
- "Exit ticket" survey forms with radio buttons, textareas, clear submit states

---

## Interactive Elements

- Smooth accordion animations (no excessive motion)
- Hover states: Subtle scale (1.02) and shadow increase on cards
- Button interactions: Slight darkening, no elaborate effects
- Form validation: Inline feedback with icons (checkmark/warning)
- Step completion: Visual checkmarks and progress bar fill

---

## Unique Design Touches

- **Week badges**: Colorful pill-shaped badges categorizing activities by week theme
- **Skill tags**: Small rounded tags showing skills practiced (e.g., "Collaboration", "Fact-Checking")
- **Timeline visualization**: Connected dots/nodes showing 6-week progression with 12 sessions
- **Game cards**: Playful card designs with distinct styling for interactive games
- **Student voice callouts**: Pull quotes or example reflections in highlighted boxes