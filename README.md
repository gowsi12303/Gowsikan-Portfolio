# Gowsikan LV — Developer Portfolio

**Build • Solve • Create**

I'm Gowsikan LV, a Software Developer focused on full-stack web development with **Python, Django REST Framework, React.js and SQL**, using AI-assisted development tools to plan, write and debug code. This repository contains the source code for my personal portfolio — a single-page site presenting my background, skills, experience and projects.

## 🌐 Live Portfolio

https://gowsikan-portfolio-ivory.vercel.app/

## ✨ Portfolio Sections

- Hero
- About
- Skills
- Experience
- Featured Project — NOSTRA
- More Projects — SocialMediaDB
- Education
- Certifications
- Contact

## 🚀 Featured Project — NOSTRA

**NOSTRA — Fashion E-commerce Backend (REST API)**

A full-stack fashion e-commerce platform with a Django REST Framework backend and a React 19 frontend, supporting customer shopping and admin management workflows.

**Status:** Functionally complete — not yet production-hardened or deployed. Runs locally with SQLite as the development database.

**Tech:** Python · Django · Django REST Framework · React 19 · REST API · JWT · SQLite

**Customer storefront**
- Product browsing and product details
- Pagination, filtering and sorting
- Cart and wishlist
- Address management
- Checkout, order history and order cancellation
- Payment-attempt flows

**Admin panel**
- Dashboard, categories, products, variants/inventory, orders, customers and payments

**Backend**
- JWT authentication and product/category APIs
- Ownership-based access control for user-specific resources
- Stock-aware cart and checkout logic using database transactions and row-level locking
- Query optimization with `select_related` / `prefetch_related`
- 407 automated backend tests covering models, serializers, views, authentication and API behavior

GitHub: https://github.com/gowsi12303/NOSTRA

> There is no live demo of NOSTRA yet — the source code and test suite are available on GitHub.

## 🗄️ More Projects — SocialMediaDB

**SocialMediaDB — Social Media Database Design (SQL)**

**Tech:** MySQL · SQL

- Normalized (3NF) relational database with 5 tables: Users, Posts, Comments, Likes and Followers
- Primary and foreign keys, including a self-referencing followers relationship
- INNER, LEFT, RIGHT, CROSS and self joins, GROUP BY / HAVING aggregations, and string/date functions
- 8 views, 3 stored procedures and an AFTER INSERT trigger for user audit logging
- COMMIT, ROLLBACK and SAVEPOINT transactions
- Window functions (ROW_NUMBER, RANK, NTILE), CTEs, and single/composite indexes

## 🛠️ Skills

- **Programming Languages:** Python, JavaScript (ES6+), HTML5, CSS3, SQL
- **Frontend:** React.js, Bootstrap, Responsive Web Design
- **Backend & API:** RESTful APIs, Django Framework, Node.js (Core Concepts)
- **Databases:** MySQL / Relational Databases
- **Cloud & DevOps:** AWS & Docker (Basics)
- **AI-Assisted Workflows:** Cursor IDE, Claude, OpenAI Codex, Prompt Engineering Basics
- **Core Concepts:** Data Structures & Algorithms (DSA)

## 💼 Experience

**Software Developer Intern** — Soruban Technology Private Limited, Coimbatore · *Apr 2026 – Jun 2026*
- Developed responsive web applications using HTML, CSS and JavaScript.
- Used AI-assisted development tools including Claude, ChatGPT, Cursor, Copilot, Gemini and OpenAI Codex to support coding and development workflows.
- Used Git and GitHub for version control and project collaboration.

**Test Automation Engineer Intern** — Indium Software, Chennai · *Jun 2025 – Nov 2025*
- Created and worked with test cases for web applications.
- Used Selenium WebDriver for QA automation testing.
- Performed accessibility testing based on WCAG guidelines.

## 🎓 Education

**Master of Computer Applications (MCA) – ODL** — Alagappa University, Karaikudi · *2025 – Present*

**Bachelor of Science in Computer Science (B.Sc. CS)** — Bishop Heber College, Tiruchirappalli · *2022 – 2025*

## 📜 Certifications

- One Million Prompters Program — Dubai Future Foundation
- Accessibility Testing (WCAG) — Indium Software
- Quality Engineering Internship — Indium Software
- Employability Skills Certification — Bishop Heber College

## 📬 Contact

- **Email:** gowsikanlakshmanan@gmail.com
- **GitHub:** [github.com/gowsi12303](https://github.com/gowsi12303)
- **LinkedIn:** [linkedin.com/in/gowsikan-lv-08431725a](https://www.linkedin.com/in/gowsikan-lv-08431725a/)
- **Portfolio:** [gowsikan-portfolio-ivory.vercel.app](https://gowsikan-portfolio-ivory.vercel.app/)

## 📄 Resume

My latest resume can be downloaded from the portfolio's **Resume** button, or directly from [`assets/Gowsikan_LV_Resume.pdf`](assets/Gowsikan_LV_Resume.pdf).

## 📁 Project Structure

```
Gowsikan-Portfolio/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── avatar.png
│   └── Gowsikan_LV_Resume.pdf
├── Avatar.png
├── favicon.svg
├── robots.txt
└── README.md
```

## 🧑‍💻 About This Portfolio

Built with plain HTML, CSS and JavaScript — no frameworks or build step.

- Responsive layout from mobile to wide desktop
- Accessible: semantic sections, skip link, keyboard focus states
- SEO metadata and Open Graph tags
- Respects `prefers-reduced-motion`
- Subtle animated interactions

## 📌 Status

- **Portfolio:** Live
- **NOSTRA:** Functionally complete — not yet production-hardened or deployed
