# RenoRate

**Get the rate before you renovate!**

**Website**: [renorate.net](https://renorate.net)

The industry standard for transparent renovation pricing, standardized estimates, and clear project scope—so decisions are made before construction begins. Built with Next.js 14, TypeScript, TailwindCSS, Prisma, and SQLite.

## Features

- 🏠 **Estimate Builder**: Create detailed estimates with automatic cost calculations
- 💾 **Save Estimates**: Store and manage all your estimates
- 📄 **PDF Export**: Generate client-ready PDF estimates
- ⚙️ **Settings**: Customize markup percentage, labor rates, and permit fees
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npm run db:migrate
```

3. Seed the database with sample data (optional):
```bash
npm run db:seed
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Commands

- **Run migrations**: `npm run db:migrate`
- **Seed database**: `npm run db:seed`
- **Open Prisma Studio**: `npm run db:studio`

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables:
   - `DATABASE_URL`: Your database connection string
4. Vercel will automatically build and deploy your app

### Switching to PostgreSQL for Production

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update your `.env` file with a PostgreSQL connection string:
```
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

3. Run migrations:
```bash
npm run db:migrate
```

4. Regenerate Prisma Client:
```bash
npx prisma generate
```

## Project Structure

```
renorate/
├── app/                    # Next.js App Router pages
│   ├── estimate/          # Estimate pages
│   ├── estimates/         # Estimates list page
│   ├── settings/          # Settings page
│   └── actions.ts         # Server actions
├── components/            # React components
├── lib/                   # Utility functions
│   ├── calculations.ts    # Cost calculation logic
│   ├── pdf.ts             # PDF generation
│   └── prisma.ts          # Prisma client
└── prisma/                # Database schema and migrations
```

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Prisma** - Database ORM
- **SQLite** - Development database
- **jsPDF** - PDF generation
- **Zod** - Form validation

## License

MIT
