# Pro6 - Next.js Website with Firebase CMS

A modern Next.js 14 website for Pro6, migrated from a static HTML/CSS/JS site with a Firebase-powered CMS.

## Features

- **Next.js 14** with App Router
- **Firebase Integration** for content management
- **Preserved Original Styles** - all CSS from the original site
- **GSAP Animations** - smooth scroll and parallax effects
- **Admin CMS** - manage pages, projects, and media
- **Responsive Design** - works on all devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project (for CMS functionality)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Fill in your Firebase credentials in .env.local
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
npm run build
```

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Firebase Storage
4. Enable Authentication (Email/Password)
5. Copy your Firebase config to `.env.local`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### DirectAdmin (Static Export)

For DirectAdmin hosting, you can export the site as static HTML:

1. Uncomment `output: 'export'` in `next.config.mjs`
2. Run `npm run build`
3. Upload the `out/` folder to DirectAdmin

**Note:** Static export works for the public pages. The CMS will still work because Firebase is client-side, but you won't have server-side features like API routes.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # CMS admin pages
│   ├── contact/           # Contact page
│   ├── over-ons/          # About page
│   ├── projecten/         # Projects pages
│   └── page.tsx           # Homepage
├── components/
│   ├── admin/             # CMS components
│   ├── layout/            # Header, Footer, etc.
│   └── sections/          # Page sections
├── hooks/                 # React hooks (GSAP, etc.)
├── lib/
│   └── firebase/          # Firebase configuration
├── styles/                # CSS files
└── types/                 # TypeScript types
```

## CMS Pages

- `/admin` - Dashboard
- `/admin/pages` - Manage pages
- `/admin/projects` - Manage projects
- `/admin/media` - Media library
- `/admin/settings` - Site settings

## Environment Variables

Create a `.env.local` file in the root directory with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCG6JDLCtpWu1vH56t6tR5EY0dxC9hvy7s
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pro6-cms.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pro6-cms
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pro6-cms.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=979394716324
NEXT_PUBLIC_FIREBASE_APP_ID=1:979394716324:web:0e570a14c09d0ce3b9bc31
```

**Important:** Never commit `.env.local` to git! Use `.env.example` as a template for other developers.

## License

Private - Pro6 Vastgoed
