# Deployment Guide

## 🎯 Quick Deploy to Vercel

### Step 1: Push to GitHub

1. Create new repository on GitHub named `demo_restoran`
2. Run these commands:

```bash
cd "d:\Projects\PRIVATNO\Web stranice\Restorani"
git add .
git commit -m "Initial commit - Restaurant booking system"
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/demo_restoran.git
git push -u origin master
```

### Step 2: Setup Neon Database

1. Go to [https://neon.tech](https://neon.tech)
2. Create free account
3. Create new project: `demo_restoran`
4. Copy connection string (looks like: `postgresql://...@...neon.tech/...`)

### Step 3: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your `demo_restoran` repository
4. Configure:
   - **Project Name**: `demo-restorani`
   - **Root Directory**: `client`
   - **Framework Preset**: Next.js

5. Add Environment Variables (click "Environment Variables"):

```env
# Database
DATABASE_URL=postgresql://...your-neon-connection-string...

# Restaurant Info
NEXT_PUBLIC_BUSINESS_NAME=Restoran Gourmet
NEXT_PUBLIC_BUSINESS_TAGLINE=Gdje se okusi spajaju sa tradicijom
NEXT_PUBLIC_ADDRESS=Trg bana Jelačića 1, 10000 Zagreb
NEXT_PUBLIC_PHONE=+385 1 234 5678
NEXT_PUBLIC_EMAIL=info@restoran-gourmet.hr

# Auth
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=https://demo-restorani.vercel.app
```

6. Click "Deploy"

### Step 4: Setup Database Tables

After deployment:

```bash
cd client
npx prisma generate
npx prisma db push --accept-data-loss
npx prisma db seed
```

Or use Vercel CLI:
```bash
vercel env pull .env.local
npx prisma generate
npx prisma db push
npx prisma db seed
```

### Step 5: Test

1. Visit your app: `https://demo-restorani.vercel.app`
2. Login to admin: `/admin/login`
   - Email: `admin@restoran.hr`
   - Password: `admin123`

## 🔧 Troubleshooting

### Database Connection Issues

If you get Prisma errors:
1. Check DATABASE_URL in Vercel settings
2. Make sure it includes `?sslmode=require`
3. Redeploy

### Admin Login Not Working

1. Check NEXTAUTH_SECRET is set
2. Check NEXTAUTH_URL matches your domain
3. Clear cookies and try again

### Images Not Loading

1. Check Next.js image domains in `next.config.ts`
2. Vercel automatically optimizes images

## 📝 Post-Deployment

1. **Change admin password** in database
2. **Add your restaurant info** via environment variables
3. **Upload real images** to replace placeholder images
4. **Test booking flow** thoroughly

## 🎉 Done!

Your restaurant booking system is now live at:
- **Frontend**: https://demo-restorani.vercel.app
- **Admin**: https://demo-restorani.vercel.app/admin/login
