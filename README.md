# 💅 Bliss Nails - Salon za Nokte

Moderna web aplikacija za rezervaciju termina u salonu za nokte sa admin panelom i real-time upravljanjem terminima.

## 🌟 Features

- 📅 **Online rezervacije** - Klijenti mogu rezervirati termine 24/7
- 👨‍💼 **Admin Dashboard** - Potvrda, prebacivanje i upravljanje terminima
- 🎨 **Dva stupca prikaz** - Potvrđeni termini vs. Termini na čekanju
- ✨ **Smooth animacije** - Elegantne slide animacije između statusa
- 📱 **Responsive design** - Radi na svim uređajima
- 🌙 **Dark mode** - Automatska detekcija ili manuelni toggle
- ⏰ **Real-time validacija** - Sprječava preklapanje termina
- 🔐 **Admin autentifikacija** - Siguran pristup admin panelu

---

## 🏗️ Arhitektura

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

## 🚀 Deployment

### Quick Deploy
```bash
# 1. Pokreni migracije na Neon
./migrate-neon-db.bat  # ili .sh na Mac/Linux

# 2. Seed demo podatke
./seed-neon-db.bat

# 3. Commit i push
git add .
git commit -m "Production ready"
git push origin master

# 4. Deploy na Vercel (automatski ili manual)
```

Detaljne instrukcije: [DEPLOY-NOW.md](./DEPLOY-NOW.md)

### Deployment Stack
- **Frontend**: Vercel (automatski CI/CD sa GitHub)
- **Database**: Neon PostgreSQL (serverless)
- **API**: Next.js API Routes (serverless na Vercel)

---

## 🔐 Admin Pristup

```
URL: /admin/login
Email: admin@nokti.com
Password: admin123
```

**⚠️ VAŽNO**: Promijeni credentials u produkciji!

---

## 📊 Database Schema

### Appointment
- `id` - UUID
- `serviceId` - FK na Service
- `customerName`, `customerEmail`, `customerPhone`
- `date`, `time` - Datum i vrijeme termina
- `status` - pending | approved | completed | cancelled
- `notes` - Dodatne informacije

### Service
- `id` - UUID
- `name` - Naziv usluge
- `description` - Opis
- `duration` - Trajanje u minutama
- `price` - Cijena u EUR
- `categoryId` - FK na ServiceCategory

### ServiceCategory
- `id` - UUID
- `name` - Kategorija (Manikir, Pedikir, Noktića...)

---

## 🎨 Ključne Features

### Admin Dashboard
- **Kalendar** - Vizualni prikaz zauzetih termina
- **Današnji termini** - Quick access na današnje bookinge
- **Dual Column View** - Potvrđeni vs. Pending termini side-by-side
- **Prebacivanje termina** - Drag & drop reschedule (vizualno)
- **Status tracking** - Trenutni, nadolazeći, prošli termini

### Booking Flow
1. Klijent odabere uslugu, datum i vrijeme
2. Unese kontakt podatke
3. Rezervacija ide na **pending** status
4. Admin vidi u žutom stupcu
5. Admin potvrdi → termin **slide-a** u zeleni stupac
6. Email notifikacija (TODO)

---

## 🐛 Troubleshooting

### Prisma Client nije generiran
```bash
cd client
npx prisma generate
```

### Database connection errors
```bash
# Test connection
npx prisma studio
```

### Build errors na Vercel
- Provjeri Environment Variables u Vercel Dashboard
- Provjeri da je `DATABASE_URL` ispravno postavljen

---

## 📝 TODO Features

- [ ] Email notifikacije za klijente
- [ ] SMS notifikacije (Twilio)
- [ ] Google Calendar sync
- [ ] Multi-admin system
- [ ] Customer accounts & history
- [ ] Online plaćanje (Stripe)
- [ ] Review system
- [ ] Photo gallery uploads

---

## 🤝 Contributing

1. Fork repository
2. Kreiraj feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit promjene (`git commit -m 'Add some AmazingFeature'`)
4. Push na branch (`git push origin feature/AmazingFeature`)
5. Otvori Pull Request

---

## 📄 License

Ovaj projekt je licenciran pod MIT licencom.

---

## 👨‍💻 Developer

**GitHub**: [BluPika3269](https://github.com/BluPika3269)
**Repository**: [NoktiSalon](https://github.com/BluPika3269/NoktiSalon)

---

## 🎉 Hvala!

Ako ti se sviđa ovaj projekt, daj ⭐ na GitHub!
