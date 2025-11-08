# Salon za Nokte - Fullstack Aplikacija

Ovaj projekt je podijeljen na **client** (frontend) i **server** (backend) za bolju organizaciju i skalabilnost.

## Struktura Projekta

```
nokti-fullstack/
├── client/          # Next.js frontend aplikacija
│   ├── src/
│   │   ├── app/     # Next.js app router
│   │   └── components/
│   └── package.json
├── server/          # Express.js backend API
│   ├── src/
│   ├── prisma/      # Baza podataka
│   └── package.json
└── package.json     # Root skripte za pokretanje
```

## Pokretanje Projekta

### 1. Instalacija Dependencies

```bash
# Instaliraj root dependencies
npm install

# Instaliraj client dependencies
npm run install:client

# Instaliraj server dependencies
npm run install:server

# Ili sve odjednom:
npm run install:all
```

### 2. Pokretanje u Development modu

```bash
# Pokreni i client i server paralelno
npm run dev

# Ili pokreni odvojeno:
npm run dev:client  # Frontend na http://localhost:3000
npm run dev:server  # Backend API na http://localhost:5000
```

### 3. Baza podataka

```bash
# Generiši Prisma client
cd server && npm run db:generate

# Pokreni migracije
cd server && npm run db:migrate

# Seed-aj podatke
cd server && npm run db:seed
```

### 4. Build za Production

```bash
# Build client i server
npm run build

# Pokreni u production modu
npm run start
```

## Environment Variables

### Client (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Server (.env)
```
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/nokti_db"
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## API Endpoints

- `GET /api/health` - Health check
- Dodatni endpointi će biti dodani po potrebi

## Tehnologije

### Frontend (Client)
- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

### Backend (Server)
- **Express.js** - Web framework
- **Prisma** - ORM za bazu podataka
- **PostgreSQL** - Baza podataka
- **NextAuth.js** - Autentifikacija
- **TypeScript** - Type safety

## Development

- Frontend se pokreće na `http://localhost:3000`
- Backend API se pokreće na `http://localhost:5000`
- Hot reload je omogućen za oba dijela

## Deployment

Za deployment možete koristiti:
- **Vercel** za frontend
- **Railway/Heroku** za backend
- **Neon/Supabase** za bazu podataka
