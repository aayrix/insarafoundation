# INSARA Foundation Website

A premium, modern, fully responsive multi-page website for INSARA Foundation —
a newly established nonprofit based in Mianwali, Punjab, Pakistan.

**Tagline:** *Inspired by Humanity. Driven by Compassion.*

---

## 📁 Project Structure

```
insara-foundation/
│
├── index.html          → Home page
├── about.html           → About, Mission & Vision, Core Values, Mianwali section
├── projects.html        → Focus Areas + Future Initiatives ("Planned Initiative" cards)
├── volunteer.html       → Founding Volunteer invitation + application form
├── donate.html          → Support / Donate page (no fake totals shown)
├── gallery.html         → Gallery placeholders + News & Updates
├── contact.html         → Contact form, details, and embedded map
│
├── css/
│   ├── style.css         → All design tokens, layout & component styles
│   └── responsive.css    → Mobile / tablet breakpoints
│
├── js/
│   └── script.js         → Mobile menu, dark mode, scroll reveal, forms
│
├── images/
│   ├── logo.png           → Full logo (300×300)
│   ├── logo-sm.png         → Small logo used in the nav/footer (120×120)
│   ├── favicon.png         → Browser tab icon
│   ├── hero.jpg             → Real photo used across hero sections
│   └── about.jpg             → Real photo used in About / Home sections
│
├── assets/
│   ├── icons/            → (empty — reserved for any custom icon files you add)
│   └── fonts/             → (empty — reserved if you want to self-host fonts)
│
└── README.md
```

Every page shares the same header/footer markup, `css/style.css`,
`css/responsive.css`, and `js/script.js`, so a design change in one place
updates the whole site — just edit the shared files.

---

## 🎨 How to Customize

**Colors, fonts, spacing** — open `css/style.css` and edit the CSS variables
at the very top (`:root { ... }`):

```css
--color-primary:   #0057B8;  /* blue   */
--color-secondary: #00A86B;  /* green  */
--color-accent:    #F4B400;  /* gold   */
```

**Text content** — every page is plain, readable HTML. Search for the
section you want (e.g. `id="mission"`) and edit the text directly.

**Adding a new page** — copy any existing page, keep the `<header>` and
`<footer>` blocks as-is (for consistent navigation), and replace the content
between them. Then add a link to it in the `<nav class="main-nav">` and
`<div class="mobile-nav">` blocks on **every** page (or use a simple
find-and-replace across files).

**Images** — replace files inside `images/` with your own (keep the same
filenames, or update the `src` attributes if you rename them). Some Mianwali
landmark photos on the About page are loaded from Wikimedia Commons URLs;
replace those `<img src="https://...">` links with local files in `images/`
any time you have your own verified photos.

---

## 🌐 Deploying Online (so it works for everyone)

This is a **static site** — plain HTML/CSS/JS with no build step or server
required. Any of the following work and are free to start with:

1. **Netlify / Vercel** — drag and drop the `insara-foundation` folder onto
   the Netlify "Deploy" page, or connect it to a GitHub repo. You'll get a
   live public URL in seconds.
2. **GitHub Pages** — push this folder to a GitHub repository, then enable
   Pages in the repo settings (Settings → Pages → Deploy from branch).
3. **Any shared hosting (cPanel/Hostinger/GoDaddy, etc.)** — upload the
   entire `insara-foundation` folder to `public_html` via FTP or the file
   manager. `index.html` will load automatically as the homepage.

Because every link (`css/style.css`, `js/script.js`, `images/logo.png`, page
links like `about.html`) uses a **relative path**, the site works identically
wherever you host it — no code changes needed. Just keep the folder
structure intact when you upload it.

---

## ✅ Notes on Honesty & Content

Per the organization's request, this site intentionally does **not** include:
- Fabricated donation totals or volunteer counts
- Fake testimonials or completed-project claims
- Fake partner/sponsor logos

Every "Future Initiatives" card is explicitly labeled **Planned Initiative**,
and the Gallery/News sections are honest placeholders until real content is
available.

---

## 🛠 Built With

- HTML5 / CSS3 (custom, no framework — easy to read and modify)
- Vanilla JavaScript (no dependencies)
- [Font Awesome 6](https://fontawesome.com/) for icons (via CDN)
- [Google Fonts](https://fonts.google.com/) — Poppins & Fraunces (via CDN)
- OpenStreetMap embed for the contact page map (no API key required)

Copyright © 2026 INSARA Foundation. All Rights Reserved.
