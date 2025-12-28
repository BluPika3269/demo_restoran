# 🍴 Demo Restoran - Restaurant Booking System

Modern restaurant reservation system with table management, admin panel, and real-time availability checking.

## 🌟 Features

- 📅 **Online Table Reservations** - Guests can book tables 24/7
- 🗺️ **Interactive Table Plan** - Visual table selection and management
- 👨‍💼 **Admin Dashboard** - Manage reservations, assign tables, view calendar
- 📱 **Responsive Design** - Works perfectly on all devices
- ⏰ **Real-time Availability** - Prevents double bookings
- 🔐 **Secure Admin Panel** - Protected admin access
- 🍽️ **Menu Gallery** - Showcase your dishes

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or Neon)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BluPika3269/demo_restoran.git
   cd demo_restoran
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your database credentials and business information.

4. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📦 Project Structure

```
demo_restoran/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities and configs
│   ├── prisma/            # Database schema and migrations
│   └── public/            # Static assets
└── README.md
```

## 🔐 Admin Access

```
URL: /admin/login
Email: admin@restoran.hr
Password: admin123
```

**⚠️ IMPORTANT**: Change credentials in production!

## 🎨 Environment Variables

Key variables in `.env.local`:

```env
# Restaurant Information
NEXT_PUBLIC_BUSINESS_NAME="Your Restaurant Name"
NEXT_PUBLIC_ADDRESS="Your Address"
NEXT_PUBLIC_PHONE="+385 1 234 5678"
NEXT_PUBLIC_EMAIL="info@restaurant.hr"

# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Database

Use [Neon](https://neon.tech) for serverless PostgreSQL:
- Free tier available
- Automatic backups
- Built-in connection pooling

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Animations**: Framer Motion
- **UI Components**: Radix UI

## 📄 License

MIT License - feel free to use for your restaurant!

## 👨‍💻 Developer

**GitHub**: [BluPika3269](https://github.com/BluPika3269)

---

Made with ❤️ for restaurants
