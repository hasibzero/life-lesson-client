# 💡 Digital Life Lessons — Frontend Client

Digital Life Lessons is a modern, high-performance web platform designed for sharing, discovering, and managing personal life lessons. Built with **Next.js 16**, **React 19**, **HeroUI**, and **Better Auth**, it offers a premium user experience with responsive design, smooth animations, and a powerful admin dashboard.

---

## 🌐 Live URL

- **Frontend**: [https://digital-life-lessons.vercel.app](https://digital-life-lessons.vercel.app)
- **Backend API**: [https://life-lesson-server-hasib.vercel.app](https://life-lesson-server-hasib.vercel.app)

---

## ✨ Key Features

- 🔐 **Authentication & Session Management** — Better Auth integration with Google OAuth, email/password sign-in, and persistent session handling across pages.
- 📝 **Lesson Creation & Management** — Users can create, edit, and manage personal life lessons with rich metadata (category, emotional tone, visibility, access level, and cover images).
- 🔍 **Advanced Search & Discovery** — Full-text search, category/tone filters, and sort options (newest, oldest, popular) for exploring public lessons.
- ❤️ **Engagement & Interaction** — Like, bookmark, comment on, and share lessons with real-time UI feedback and toast notifications.
- 🚨 **Report System** — Users can report inappropriate content with detailed reason and description for admin moderation.
- 🛡️ **Admin Dashboard** — Full admin panel with platform overview stats, lesson review pipeline, user management (role changes, banning), and report resolution.
- 👤 **User Profiles** — Public profile pages with avatar, bio, social links, and authored lesson history with optimised image loading.
- 🎨 **Premium UI & Animations** — HeroUI components, Framer Motion micro-animations, Swiper carousels, and dark/light mode toggle via `next-themes`.
- 💳 **Stripe Integration** — Payment processing ready with `@stripe/stripe-js` and server-side `stripe` SDK.
- 📱 **Fully Responsive** — Optimised for desktop, tablet, and mobile with Tailwind CSS v4 utility-first styling.

---

## 📦 NPM Packages Used

| Package | Purpose |
|---------|---------|
| **next** | React framework for SSR, routing, and API routes |
| **react** & **react-dom** | Core UI library (v19) |
| **better-auth** | Authentication system with OAuth and session management |
| **@better-auth/mongo-adapter** | MongoDB adapter for Better Auth |
| **@heroui/react** & **@heroui/styles** | Premium UI component library |
| **framer-motion** | Smooth animations and micro-interactions |
| **tailwindcss** | Utility-first CSS framework (v4) |
| **next-themes** | Dark/light theme toggle |
| **react-hot-toast** | Toast notifications for user feedback |
| **react-hook-form** | Performant form handling and validation |
| **react-share** | Social sharing buttons |
| **swiper** | Touch-friendly carousel/slider component |
| **lucide-react** | Modern icon library |
| **mongodb** | Native MongoDB driver |
| **@stripe/stripe-js** & **stripe** | Payment processing integration |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/hasibzero/digital-life-lessons.git

# Install dependencies
npm install

# Create .env.local with your credentials
# MONGODB_URI=your_mongodb_connection_string
# BETTER_AUTH_SECRET=your_secret
# NEXT_PUBLIC_SERVER_URL=your_backend_url

# Start development server
npm run dev
```