# 📚 DOKUMENTACIJA - 9. Novembar 2025

## 🎯 Brz Start:

### Hoćeš samo deployati?
→ Čitaj: **[FIX-SUMMARY.md](./FIX-SUMMARY.md)** ⭐

### Hoćeš vidjeti što je fiksirano?
→ Čitaj: **[DIAGNOSTICS.md](./DIAGNOSTICS.md)**

### Hoćeš detaljne deployment upute?
→ Čitaj: **[DEPLOYMENT-FIX.md](./DEPLOYMENT-FIX.md)**

---

## 📝 Dokumenti:

1. **FIX-SUMMARY.md** - Sažetak šta je urađeno i što ti treba uraditi
2. **DIAGNOSTICS.md** - Dijagnoza problema (3 glavna problema)
3. **DEPLOYMENT-FIX.md** - Kompletan deployment guide
4. **check-deployment.js** - Skripta za provjeru prije deploya

---

## ⚡ Brzi Deployment (TL;DR):

```bash
# 1. Dobij Neon DATABASE_URL sa https://console.neon.tech/

# 2. Deploy
vercel
vercel env add DATABASE_URL production
# (paste Neon URL)
vercel --prod

# 3. Ako baza prazna
cd client
npx prisma migrate deploy
npx prisma db seed
```

**Gotovo!** 🎉

---

## 🔍 Što je promijenjeno:

### Frontend:
- `client/src/app/order/page.tsx` - API_URL → `/api`
- `client/src/app/admin/dashboard/page.tsx` - API_URL → `/api`

### Backend (novi API routes):
- `client/src/app/api/availability/route.ts` - NOVO
- `client/src/app/api/admin/appointments/route.ts` - NOVO
- `client/src/app/api/admin/appointments/[id]/route.ts` - NOVO
- `client/src/app/api/appointments/route.ts` - Ažurirano

### Config:
- `vercel.json` - Uklonjen proxy, dodan prisma generate
- `.env.production` - Očišćen od \r\n

---

## ❓ Pomoć:

Ako nešto ne radi:
1. Pokreni: `node check-deployment.js`
2. Provjeri Vercel logs
3. Provjeri Neon dashboard (je li baza aktivna)
