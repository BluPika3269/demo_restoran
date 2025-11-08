# 🚀 FINALNI DEPLOYMENT GUIDE - NOKTI SALON
**Datum fix-a: 9. Novembar 2025**

## ✅ ŠTO JE FIKSIRANO:

### 1. **Arhitektura pojednostavljena**
- ❌ Uklonjen zaseban backend server
- ✅ Sve API endpointe sada rade kroz Next.js API Routes
- ✅ Frontend više ne zavisi od eksternog servera

### 2. **API Endpointi ažurirani**
Kreirani novi endpointi:
- `GET/POST /api/appointments` - Lista i kreiranje appointmenta
- `GET /api/services` - Lista usluga
- `GET /api/categories` - Lista kategorija
- `GET /api/availability` - Slobodni termini
- `GET/POST /api/admin/appointments` - Admin lista appointmenta
- `PATCH /api/admin/appointments/[id]` - Update status
- `DELETE /api/admin/appointments/[id]` - Brisanje appointmenta

### 3. **Frontend ažuriran**
- `client/src/app/order/page.tsx` - Sada koristi `/api` umjesto eksternog servera
- `client/src/app/admin/dashboard/page.tsx` - Sada koristi `/api` umjesto eksternog servera

### 4. **Environment varijable**
- ❌ Uklonjen `NEXT_PUBLIC_API_URL` (više nije potreban)
- ⚠️ `DATABASE_URL` treba ažurirati sa novim Neon credentials

---

## 📋 KORACI ZA DEPLOY:

### **Korak 1: Dobij novi Neon Database URL**

1. Idi na: https://console.neon.tech/
2. Loguj se sa: **damjan.mitrovic.job@gmail.com**
3. Otvori projekt "nokti-salon" (ili kreiraj novi ako ne postoji)
4. Klikni na "Connection Details"
5. Kopiraj **Pooled Connection String** (izgleda kao):
   ```
   postgresql://username:password@ep-xxx-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

### **Korak 2: Setup Prisma na Neon bazi**

Ako je nova baza, pokreni migracije lokalno:

```bash
cd client

# Postavi DATABASE_URL u .env fajl
echo "DATABASE_URL='tvoj-neon-url'" > .env

# Generiši Prisma Client
npx prisma generate

# Pokreni migracije
npx prisma migrate deploy

# Seed bazu sa podacima (usluge i kategorije)
npx prisma db seed
```

### **Korak 3: Deploy na Vercel**

#### Opcija A: Kroz Vercel Dashboard (PREPORUČENO)

1. Idi na: https://vercel.com/dashboard
2. Klikni "Add New" → "Project"
3. Import GitHub repo: **BluPika3269/SlatkojosSlade**

4. **Project Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

5. **Environment Variables:**
   Dodaj SAMO:
   ```
   DATABASE_URL = tvoj-neon-connection-string-iz-koraka-1
   ```

6. Klikni **"Deploy"**

#### Opcija B: Kroz Vercel CLI

```bash
# Instaliraj Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (iz root foldera projekta)
vercel

# Postavi environment varijablu
vercel env add DATABASE_URL production
# Unesi Neon connection string kada zatraži

# Production deployment
vercel --prod
```

### **Korak 4: Verifikuj Deployment**

Nakon što deployment završi, Vercel će ti dati production URL (npr. `https://nokti-salon.vercel.app`)

Test endpointe:
```bash
# Services
curl https://tvoj-url.vercel.app/api/services

# Categories
curl https://tvoj-url.vercel.app/api/categories

# Appointments
curl https://tvoj-url.vercel.app/api/appointments
```

---

## 🔧 TROUBLESHOOTING:

### Problem: "Module not found: Can't resolve '@prisma/client'"
**Rješenje:** Build command mora sadržavati `npx prisma generate`

### Problem: "Environment variable not found: DATABASE_URL"
**Rješenje:** Provjeri da li si dodao DATABASE_URL u Vercel Environment Variables

### Problem: "PrismaClient is unable to connect to database"
**Rješenje:** 
1. Provjeri da li je DATABASE_URL tačan
2. Provjeri da li Neon baza radi (možda je u sleep mode)
3. U Neon dashboardu aktiviraj "Connection pooling"

### Problem: API vraća prazne liste
**Rješenje:** Baza je prazna, treba seed-ovati:
```bash
cd client
npx prisma db seed
```

---

## 📝 NAPOMENE:

### Što više NIJE potrebno:
- ❌ Zaseban backend server deployment
- ❌ `NEXT_PUBLIC_API_URL` environment varijabla
- ❌ API proxy u vercel.json

### Što JE potrebno:
- ✅ Samo client folder deployment
- ✅ Samo `DATABASE_URL` environment varijabla
- ✅ Prisma generate u build command

### Prisma Seed (ako baza ne sadrži podatke):

```typescript
// client/prisma/seed.ts već postoji sa:
// - ServiceCategory (Manikir, Pedikir, Gel lak, itd.)
// - Service (razne usluge sa cijenama)
```

---

## 🎯 FINALNI CHECKLIST:

- [ ] Dobio novi Neon connection string
- [ ] Postavio DATABASE_URL u Vercel Environment Variables
- [ ] Deploy završio uspješno
- [ ] `/api/services` vraća listu usluga
- [ ] `/api/categories` vraća kategorije
- [ ] Frontend se učitava bez grešaka
- [ ] Moguće je kreirati appointment
- [ ] Admin dashboard prikazuje appointmente

---

## 📞 KONTAKT:

Ako nešto ne radi, provjeri:
1. Vercel Deployment Logs
2. Browser Console za frontend greške
3. Neon dashboard za database status
