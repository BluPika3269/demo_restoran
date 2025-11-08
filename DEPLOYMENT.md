# Deployment Guide - Nokti Salon

## Korak 1: Kreiranje Neon baze

1. Idi na https://neon.tech
2. Sign up sa Gmail accountom (damjan.mitrovic.job@gmail.com)
3. Kreiraj novi projekt "nokti-salon"
4. Kopiraj Database connection string (izgleda kao: `postgresql://user:pass@ep-xxx.neon.tech/dbname`)
5. Sačuvaj ga za kasnije

## Korak 2: Setup Prisma za Neon

U `server` folderu:

```bash
cd server
npm install @prisma/client prisma
```

U `server/.env` dodaj:
```
DATABASE_URL="tvoj-neon-connection-string"
```

Pokreni migracije:
```bash
npx prisma migrate deploy
npx prisma db seed
```

## Korak 3: Deploy Backend na Vercel

1. Idi na https://vercel.com/dashboard
2. Klikni "Add New" → "Project"
3. Import tvoj GitHub repo (SlatkojosSlade)
4. **Settings za backend**:
   - Framework Preset: Other
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Environment Variables**:
   - `DATABASE_URL` = tvoj Neon connection string
   - `PORT` = 5000

6. Deploy backend

7. Kopiraj backend URL (npr. `https://nokti-server.vercel.app`)

## Korak 4: Deploy Frontend na Vercel

1. Klikni "Add New" → "Project" opet
2. Import isti GitHub repo
3. **Settings za frontend**:
   - Framework Preset: Next.js
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Output Directory: `.next`

4. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL` = `https://tvoj-backend-url.vercel.app/api`

5. Deploy frontend

## Korak 5: Testiranje

1. Poseti frontend URL
2. Login prompt: 
   - Username: `demo1`
   - Password: `Salon`
3. Testiraj rezervacije i ostale funkcije

## Za lokalni development:

U `client/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

U `server/.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/nokti
```

Pokreni oba:
```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
```

## Troubleshooting:

- Ako backend ne radi, proveri logs na Vercel
- Ako baza ne radi, proveri connection string
- Ako frontend ne vidi backend, proveri NEXT_PUBLIC_API_URL
