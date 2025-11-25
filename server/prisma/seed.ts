import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Delete all existing data (prvo appointmente, pa services, pa categories)
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  console.log('🗑️  Cleared existing data');

  // Reset auto-increment sequences to start from 1
  await prisma.$executeRaw`ALTER SEQUENCE appointments_id_seq RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE service_categories_id_seq RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE services_id_seq RESTART WITH 1`;
  console.log('🔄 Reset ID sequences to start from 1');

  // ==================== KATEGORIJE ====================
  
  const dopunaNoktiju = await prisma.serviceCategory.create({
    data: { name: 'Dopuna noktiju' }
  });

  const gellak = await prisma.serviceCategory.create({
    data: { name: 'Gellak' }
  });

  const ugradnjaNoktiju = await prisma.serviceCategory.create({
    data: { name: 'Ugradnja noktiju' }
  });

  const geliranjePrirodne = await prisma.serviceCategory.create({
    data: { name: 'Geliranje prirodne dužine' }
  });

  const njegaNoktiju = await prisma.serviceCategory.create({
    data: { name: 'Njega noktiju' }
  });

  const depilacija = await prisma.serviceCategory.create({
    data: { name: 'Depilacija' }
  });

  const njegaNogu = await prisma.serviceCategory.create({
    data: { name: 'Njega nogu' }
  });

  const sminkanje = await prisma.serviceCategory.create({
    data: { name: 'Šminkanje' }
  });

  const keratinskiTretmani = await prisma.serviceCategory.create({
    data: { name: 'Keratinski tretmani' }
  });

  const mikropigmentacija = await prisma.serviceCategory.create({
    data: { name: 'Mikropigmentacija' }
  });

  const tretmaniLica = await prisma.serviceCategory.create({
    data: { name: 'Tretmani lica' }
  });

  const ostaliTretmani = await prisma.serviceCategory.create({
    data: { name: 'Ostali tretmani' }
  });

  console.log('✅ Created 12 categories');

  // ==================== USLUGE - TOČNO SA ZOYYA ====================
  
  // 1. DOPUNA NOKTIJU (8 usluga)
  await prisma.service.createMany({
    data: [
      { name: 'Cover', description: '', price: 29.00, duration: 60, image: '', categoryId: dopunaNoktiju.id },
      { name: 'Boja', description: '', price: 30.00, duration: 90, image: '', categoryId: dopunaNoktiju.id },
      { name: 'French', description: '', price: 31.00, duration: 90, image: '', categoryId: dopunaNoktiju.id },
      { name: 'BabyBoomer', description: '', price: 34.00, duration: 90, image: '', categoryId: dopunaNoktiju.id },
      { name: 'Dodatno iscrtavanje, ombre, chrome', description: '', price: 7.00, duration: 30, image: '', categoryId: dopunaNoktiju.id },
      { name: 'L dužina noktiju', description: '', price: 5.00, duration: 30, image: '', categoryId: dopunaNoktiju.id },
      { name: 'XL dužina noktiju', description: '', price: 9.00, duration: 30, image: '', categoryId: dopunaNoktiju.id },
      { name: 'Ne znam što ću, radi šta hoćeš', description: '', price: 35.00, duration: 120, image: '', categoryId: dopunaNoktiju.id }
    ]
  });

  // 2. GELLAK (6 usluga)
  await prisma.service.createMany({
    data: [
      { name: 'Cover gellak', description: 'Trajni lak boje kože.', price: 29.00, duration: 60, image: '', categoryId: gellak.id },
      { name: 'Boja gellak', description: 'Trajni lak u boji.', price: 30.00, duration: 60, image: '', categoryId: gellak.id },
      { name: 'French gellak', description: 'Trajni lak francuska manikura.', price: 31.00, duration: 60, image: '', categoryId: gellak.id },
      { name: 'BabyBoomer gellak', description: 'Trajni lak ombre tehnika bijelo i cover.', price: 34.00, duration: 60, image: '', categoryId: gellak.id },
      { name: 'Dodatno iscrtavanje, ombre, chrome', description: '', price: 7.00, duration: 30, image: '', categoryId: gellak.id },
      { name: 'Ne znam šta ću, radi šta hoćeš', description: '', price: 40.00, duration: 120, image: '', categoryId: gellak.id }
    ]
  });

  // 3. UGRADNJA NOKTIJU (9 usluga)
  await prisma.service.createMany({
    data: [
      { name: 'Cover', description: 'Nokti boje kože s produživanjem dužine.', price: 39.00, duration: 60, image: '', categoryId: ugradnjaNoktiju.id },
      { name: 'French', description: 'Francuska manikura s produživanjem dužine.', price: 41.00, duration: 90, image: '', categoryId: ugradnjaNoktiju.id },
      { name: 'Boja', description: 'Nokti u boji s produživanjem dužine.', price: 40.00, duration: 90, image: '', categoryId: ugradnjaNoktiju.id },
      { name: 'BabyBoomer', description: 'Ombre nokti bijelo i cover s produživanjem dužine.', price: 44.00, duration: 90, image: '', categoryId: ugradnjaNoktiju.id },
      { name: 'L dužina', description: '', price: 5.00, duration: 30, image: '', categoryId: ugradnjaNoktiju.id },
      { name: 'XL dužina', description: '', price: 9.00, duration: 30, image: '', categoryId: ugradnjaNoktiju.id },
      { name: 'Buildani french', description: 'Francuska manikura s umetanjem materijala u vrh nokta, oštra tehnika zida.', price: 60.00, duration: 180, image: '', categoryId: ugradnjaNoktiju.id },
      { name: 'Dodatno iscrtavanje, ombre efekt, extreme dužine', description: 'Nokti s posebnim motivima, nail artom na više noktiju. Cijena je informativnog karaktera.', price: 7.00, duration: 30, image: '', categoryId: ugradnjaNoktiju.id },
      { name: 'Ne znam šta ću, radi što hoćeš', description: '', price: 50.00, duration: 150, image: '', categoryId: ugradnjaNoktiju.id }
    ]
  });

  // 4. GELIRANJE PRIRODNE DUŽINE (6 usluga)
  await prisma.service.createMany({
    data: [
      { name: 'Cover', description: 'Nokti boje kože na prirodnu dužinu noktiju.', price: 29.00, duration: 60, image: '', categoryId: geliranjePrirodne.id },
      { name: 'Boja', description: 'Nokti u boji na prirodnu dužinu noktiju.', price: 30.00, duration: 60, image: '', categoryId: geliranjePrirodne.id },
      { name: 'French', description: 'Francuska manikura na prirodnu dužinu noktiju.', price: 31.00, duration: 90, image: '', categoryId: geliranjePrirodne.id },
      { name: 'BabyBoomer', description: 'Ombre bijelo i cover na prirodnu dužinu noktiju.', price: 34.00, duration: 90, image: '', categoryId: geliranjePrirodne.id },
      { name: 'Dodatno iscrtavanje, ombre, chrome', description: '', price: 7.00, duration: 30, image: '', categoryId: geliranjePrirodne.id },
      { name: 'Ne znam šta ću, radi što hoćeš', description: '', price: 40.00, duration: 120, image: '', categoryId: geliranjePrirodne.id }
    ]
  });

  // 5. NJEGA NOKTIJU (4 usluge)
  await prisma.service.createMany({
    data: [
      { name: 'Parafinska kupka', description: '', price: 7.00, duration: 30, image: '', categoryId: njegaNoktiju.id },
      { name: 'Njega ruku i noktiju', description: 'Peeling i maska ruku, oblikovanje i čišćenje prirodnih noktiju, masaža dlanova.', price: 20.00, duration: 60, image: '', categoryId: njegaNoktiju.id },
      { name: 'Suha kombinirana manikura', description: 'Uklanjanje kožice oko noktiju suhom tehnikom - brusilica i škarice.', price: 10.00, duration: 30, image: '', categoryId: njegaNoktiju.id },
      { name: 'Popravak nokta', description: 'Popravak se obračunava po 1 noktu.', price: 3.00, duration: 30, image: '', categoryId: njegaNoktiju.id },
      { name: 'Skidanje gela', description: '', price: 8.00, duration: 30, image: '', categoryId: njegaNoktiju.id }
    ]
  });

  // 6. DEPILACIJA (14 usluga)
  await prisma.service.createMany({
    data: [
      { name: 'Anestetik u spreju', description: '', price: 7.00, duration: 10, image: '', categoryId: depilacija.id },
      { name: 'Anestetik u kremi', description: '', price: 10.00, duration: 15, image: '', categoryId: depilacija.id },
      { name: 'Potkoljenice', description: '', price: 12.00, duration: 30, image: '', categoryId: depilacija.id },
      { name: 'Cijele noge', description: 'Depilacija čitavih nogu.', price: 22.00, duration: 30, image: '', categoryId: depilacija.id },
      { name: 'Natkoljenice', description: '', price: 13.00, duration: 30, image: '', categoryId: depilacija.id },
      { name: 'Bikini', description: 'Depilacija do područja gaćica.', price: 10.00, duration: 30, image: '', categoryId: depilacija.id },
      { name: 'Duboki bikini', description: '', price: 13.00, duration: 30, image: '', categoryId: depilacija.id },
      { name: 'Brazilka', description: 'Depilacija vagine.', price: 20.00, duration: 30, image: '', categoryId: depilacija.id },
      { name: 'Brazilka+anus', description: '', price: 27.00, duration: 30, image: '', categoryId: depilacija.id },
      { name: 'Nadusnice', description: 'Depilacija područja iznad usnica.', price: 6.00, duration: 30, image: '', categoryId: depilacija.id },
      { name: 'Obrve', description: 'Depilacija obrva (iznad, ispod i među obrvama)', price: 7.00, duration: 30, image: '', categoryId: depilacija.id },
      { name: 'Leđa', description: 'Depilacija leđa. (muški)', price: 20.00, duration: 30, image: '', categoryId: depilacija.id },
      { name: 'Prsa', description: 'Depilacija prsa. (muški)', price: 20.00, duration: 30, image: '', categoryId: depilacija.id },
      { name: 'Podlaktice', description: 'Depilacija od lakta do nadlanica.', price: 8.00, duration: 30, image: '', categoryId: depilacija.id },
      { name: 'Nadlaktice', description: 'Depilacija od lakta do ramena.', price: 9.00, duration: 30, image: '', categoryId: depilacija.id },
      { name: 'Cijele ruke', description: 'Depilacija čitavih ruku (od nadlanica do ramena)', price: 16.00, duration: 30, image: '', categoryId: depilacija.id },
      { name: 'Pazusi', description: '', price: 8.00, duration: 30, image: '', categoryId: depilacija.id }
    ]
  });

  // 7. NJEGA NOGU (5 usluga)
  await prisma.service.createMany({
    data: [
      { name: 'Ruska njega nogu(suha pedikura)', description: 'Estetska pedikura, sređivanje stopala bez upotrebe skalpela. Na tretmanu ležite i uživate.', price: 22.00, duration: 15, image: '', categoryId: njegaNogu.id },
      { name: 'Trajni lak noge (COVER ILI BOJA)', description: 'Trajni lak na nokte na nogama.', price: 27.00, duration: 60, image: '', categoryId: njegaNogu.id },
      { name: 'Trajni lak noge FRENCH', description: '', price: 29.00, duration: 60, image: '', categoryId: njegaNogu.id },
      { name: 'Parafinska kupka', description: '', price: 10.00, duration: 30, image: '', categoryId: njegaNogu.id },
      { name: 'Protetika palca nožnog', description: 'Produžavanje nokta palca koji je uslijed traume stradao, ili raste krivo.', price: 20.00, duration: 30, image: '', categoryId: njegaNogu.id },
      { name: 'Suha pedikura s masažom stopala i pakungom', description: 'Pedikura stopala bez upotrebe skalpela s masažom stopala od 20 minuta.', price: 31.00, duration: 40, image: '', categoryId: njegaNogu.id }
    ]
  });

  // 8. ŠMINKANJE (3 usluge)
  await prisma.service.createMany({
    data: [
      { name: 'Make up bez aplikacije umjetnih trepavica', description: '', price: 34.00, duration: 60, image: '', categoryId: sminkanje.id },
      { name: 'Make up s aplikacijom parcijalnih trepavica', description: '', price: 40.00, duration: 60, image: '', categoryId: sminkanje.id },
      { name: 'Šminkanje (teren-dolazak k vama)', description: 'Minimalno 5 osoba je moguće naručiti. Sve ispod toga zahtjev neće biti prihvaćen jer za manji broj osoba ne izlazim na teren. Više od 8 osoba nije moguće zbog vremenskog okvira.', price: 50.00, duration: 45, image: '', categoryId: sminkanje.id }
    ]
  });

  // 9. KERATINSKI TRETMANI (6 usluga)
  await prisma.service.createMany({
    data: [
      { name: 'Lash lift', description: '', price: 27.00, duration: 60, image: '', categoryId: keratinskiTretmani.id },
      { name: 'Lash lift i bojanje trepavica', description: '', price: 32.00, duration: 90, image: '', categoryId: keratinskiTretmani.id },
      { name: 'Brow lift', description: '', price: 24.00, duration: 60, image: '', categoryId: keratinskiTretmani.id },
      { name: 'Brow lift i bojanje obrva', description: '', price: 29.00, duration: 90, image: '', categoryId: keratinskiTretmani.id },
      { name: 'Čupanje pincetom uz tretman', description: 'Čupanje samo viška dlačica ukoliko već imate definirani oblik.', price: 5.00, duration: 15, image: '', categoryId: keratinskiTretmani.id },
      { name: 'Botox/3d filler', description: 'Punjenje dlake kako bi ista bila vizualno deblja.', price: 6.00, duration: 30, image: '', categoryId: keratinskiTretmani.id }
    ]
  });

  // 10. MIKROPIGMENTACIJA (4 usluge)
  await prisma.service.createMany({
    data: [
      { name: 'Puder obrve (prvi dolazak)', description: '', price: 160.00, duration: 120, image: '', categoryId: mikropigmentacija.id },
      { name: 'Puder obrve (prva korekcija nakon 1 mj)', description: '', price: 50.00, duration: 60, image: '', categoryId: mikropigmentacija.id },
      { name: 'Puder obrve (osvježenje polugodišnje)', description: 'Polugodišnje osvježenje je većinom potrebno za osobe koje imaju extra masnu kožu.', price: 70.00, duration: 60, image: '', categoryId: mikropigmentacija.id },
      { name: 'Puder obrve (osvježenje nakon 1+ godinu)', description: '', price: 130.00, duration: 60, image: '', categoryId: mikropigmentacija.id }
    ]
  });

  // 11. TRETMANI LICA (3 usluge)
  await prisma.service.createMany({
    data: [
      { name: 'Masaža i RF lica s njegom', description: '', price: 25.00, duration: 45, image: '', categoryId: tretmaniLica.id },
      { name: 'Queen tretman lica', description: 'Čišćenje, dubinska njega i hidratacija prema Vašem tipu kože.', price: 41.00, duration: 90, image: '', categoryId: tretmaniLica.id },
      { name: 'Queen+ tretman lica', description: '', price: 55.00, duration: 90, image: '', categoryId: tretmaniLica.id }
    ]
  });

  // 12. OSTALI TRETMANI (5 usluga)
  await prisma.service.createMany({
    data: [
      { name: 'Threading obrva', description: 'Čupanje koncem.', price: 12.00, duration: 30, image: '', categoryId: ostaliTretmani.id },
      { name: 'Threading nadusnica', description: 'Čupanje koncem.', price: 7.00, duration: 30, image: '', categoryId: ostaliTretmani.id },
      { name: 'Bojanje obrva/trepavica', description: '', price: 10.00, duration: 30, image: '', categoryId: ostaliTretmani.id },
      { name: 'Čupanje obrva pincetom', description: 'Mjesečno održavanje čupanja obrva.', price: 7.00, duration: 30, image: '', categoryId: ostaliTretmani.id },
      { name: 'Mapiranje obrva i izrada oblika', description: '', price: 8.00, duration: 30, image: '', categoryId: ostaliTretmani.id }
    ]
  });

  const totalServices = await prisma.service.count();
  console.log(`✅ Created ${totalServices} services across 12 categories`);

  // ==================== DODAVANJE APPOINTMENTA ====================
  // Studeni 2025, Prosinac 2025, Siječanj 2026
  // Izbjegavamo nedjelje i praznike

  const prazniciHrvatska = [
    '2025-11-01', // Svi sveti
    '2025-11-18', // Dan sjećanja na žrtve Domovinskog rata
    '2025-12-25', // Božić
    '2025-12-26', // Sv. Stjepan
    '2026-01-01', // Nova godina
    '2026-01-06'  // Bogojavljenje
  ];

  const radnoVrijeme = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const imenaPrezimena = [
    { ime: 'Ana Marić', email: 'ana.maric@example.com', telefon: '091-234-5678' },
    { ime: 'Petra Kovač', email: 'petra.kovac@example.com', telefon: '092-345-6789' },
    { ime: 'Maja Horvat', email: 'maja.horvat@example.com', telefon: '098-456-7890' },
    { ime: 'Ivana Babić', email: 'ivana.babic@example.com', telefon: '091-567-8901' },
    { ime: 'Lana Novak', email: 'lana.novak@example.com', telefon: '099-678-9012' },
    { ime: 'Sara Jurić', email: 'sara.juric@example.com', telefon: '091-789-0123' },
    { ime: 'Ema Filipović', email: 'ema.filipovic@example.com', telefon: '095-890-1234' },
    { ime: 'Lucija Knežević', email: 'lucija.knezevic@example.com', telefon: '092-901-2345' },
    { ime: 'Marta Pavlović', email: 'marta.pavlovic@example.com', telefon: '098-012-3456' },
    { ime: 'Nikolina Tomić', email: 'nikolina.tomic@example.com', telefon: '091-123-4567' }
  ];

  const designs = [
    'francuski',
    'baby boomer',
    'jednobojno - nude',
    'jednobojno - crno',
    'ombre effect',
    'chrome finish',
    'cvjetni motivi',
    'geometrijski dizajn',
    'minimalistički',
    'bez dizajna - cover'
  ];

  const sizes = ['S', 'M', 'L', ''];
  const statuses = ['approved', 'approved', 'approved', 'pending', 'completed'];

  // Dohvaćanje usluga za appointmente (fokus na nokte)
  const servicesForAppointments = await prisma.service.findMany({
    where: {
      OR: [
        { categoryId: dopunaNoktiju.id },
        { categoryId: gellak.id },
        { categoryId: ugradnjaNoktiju.id },
        { categoryId: geliranjePrirodne.id }
      ]
    }
  });

  // Funkcija za provjeru je li datum nedjela
  function isNedjela(datum: Date): boolean {
    return datum.getDay() === 0; // 0 = nedjela
  }

  // Funkcija za formatiranje datuma u YYYY-MM-DD
  function formatDatum(datum: Date): string {
    return datum.toISOString().split('T')[0];
  }

  // Generiranje appointmenta za studeni, prosinac i siječanj
  const appointmentsData = [];
  
  // Dani koji trebaju biti full puni (demo scenario - nema slobodnih termina)
  const fullPuniDani = [
    '2025-11-27', // Srijeda - pun dan
    '2025-12-05', // Petak - pun dan
    '2025-12-20', // Subota prije Božića - pun dan
    '2026-01-09'  // Petak - pun dan
  ];

  // Studeni 2025 (od 25.11. do kraja mjeseca)
  for (let day = 25; day <= 30; day++) {
    const datum = new Date(2025, 10, day); // mjesec 10 = studeni
    const datumStr = formatDatum(datum);
    
    if (isNedjela(datum) || prazniciHrvatska.includes(datumStr)) continue;

    // Ako je full pun dan, dodaj sve termine
    const isFullPun = fullPuniDani.includes(datumStr);
    
    if (!isFullPun) {
      // 40% šansa da dan bude prazan (bez termina)
      if (Math.random() < 0.4) continue;
    }

    // Full puni dani dobivaju više appointmenta, ostali 2-4
    const brojAppointmenta = isFullPun ? 7 : (Math.floor(Math.random() * 3) + 2);
    
    // Prati zauzeta vremena za ovaj dan
    const zauzeteSlotove: Array<{start: number, end: number}> = [];
    
    for (let i = 0; i < brojAppointmenta; i++) {
      const randomService = servicesForAppointments[Math.floor(Math.random() * servicesForAppointments.length)];
      
      // Nađi slobodan slot
      let slobodanSlot: string | null = null;
      const shuffledVrijeme = [...radnoVrijeme].sort(() => Math.random() - 0.5);
      
      for (const vrijeme of shuffledVrijeme) {
        const [hours, minutes] = vrijeme.split(':').map(Number);
        const slotStart = hours * 60 + minutes;
        const slotEnd = slotStart + randomService.duration;
        
        // Provjeri da li je slot slobodan
        const isSlobodan = !zauzeteSlotove.some(slot => {
          return (slotStart < slot.end && slotEnd > slot.start);
        });
        
        if (isSlobodan && slotEnd <= 18 * 60) { // Ne prelazi 18:00
          slobodanSlot = vrijeme;
          zauzeteSlotove.push({ start: slotStart, end: slotEnd });
          break;
        }
      }
      
      // Ako nema slobodnog slota, preskoči
      if (!slobodanSlot) continue;
      
      const randomKlijent = imenaPrezimena[Math.floor(Math.random() * imenaPrezimena.length)];
      const randomDesign = designs[Math.floor(Math.random() * designs.length)];
      const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      appointmentsData.push({
        serviceId: randomService.id,
        size: randomSize,
        design: randomDesign,
        date: datum,
        time: slobodanSlot,
        customerName: randomKlijent.ime,
        customerPhone: randomKlijent.telefon,
        customerEmail: randomKlijent.email,
        status: randomStatus,
        notes: Math.random() > 0.7 ? 'Alergična na određene materijale' : null
      });
    }
  }

  // Prosinac 2025
  for (let day = 1; day <= 31; day++) {
    const datum = new Date(2025, 11, day); // mjesec 11 = prosinac
    const datumStr = formatDatum(datum);
    
    if (isNedjela(datum) || prazniciHrvatska.includes(datumStr)) continue;

    const isFullPun = fullPuniDani.includes(datumStr);
    
    if (!isFullPun) {
      // 40% šansa da dan bude prazan (bez termina)
      if (Math.random() < 0.4) continue;
    }

    const brojAppointmenta = isFullPun ? 7 : (Math.floor(Math.random() * 3) + 2);
    
    // Prati zauzeta vremena za ovaj dan
    const zauzeteSlotove: Array<{start: number, end: number}> = [];
    
    for (let i = 0; i < brojAppointmenta; i++) {
      const randomService = servicesForAppointments[Math.floor(Math.random() * servicesForAppointments.length)];
      
      // Nađi slobodan slot
      let slobodanSlot: string | null = null;
      const shuffledVrijeme = [...radnoVrijeme].sort(() => Math.random() - 0.5);
      
      for (const vrijeme of shuffledVrijeme) {
        const [hours, minutes] = vrijeme.split(':').map(Number);
        const slotStart = hours * 60 + minutes;
        const slotEnd = slotStart + randomService.duration;
        
        // Provjeri da li je slot slobodan
        const isSlobodan = !zauzeteSlotove.some(slot => {
          return (slotStart < slot.end && slotEnd > slot.start);
        });
        
        if (isSlobodan && slotEnd <= 18 * 60) {
          slobodanSlot = vrijeme;
          zauzeteSlotove.push({ start: slotStart, end: slotEnd });
          break;
        }
      }
      
      if (!slobodanSlot) continue;
      
      const randomKlijent = imenaPrezimena[Math.floor(Math.random() * imenaPrezimena.length)];
      const randomDesign = designs[Math.floor(Math.random() * designs.length)];
      const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      appointmentsData.push({
        serviceId: randomService.id,
        size: randomSize,
        design: randomDesign,
        date: datum,
        time: slobodanSlot,
        customerName: randomKlijent.ime,
        customerPhone: randomKlijent.telefon,
        customerEmail: randomKlijent.email,
        status: randomStatus,
        notes: Math.random() > 0.7 ? 'Dolazim prvi put' : null
      });
    }
  }

  // Siječanj 2026
  for (let day = 1; day <= 31; day++) {
    const datum = new Date(2026, 0, day); // mjesec 0 = siječanj
    const datumStr = formatDatum(datum);
    
    if (isNedjela(datum) || prazniciHrvatska.includes(datumStr)) continue;

    const isFullPun = fullPuniDani.includes(datumStr);
    
    if (!isFullPun) {
      // 40% šansa da dan bude prazan (bez termina)
      if (Math.random() < 0.4) continue;
    }

    const brojAppointmenta = isFullPun ? 7 : (Math.floor(Math.random() * 3) + 2);
    
    // Prati zauzeta vremena za ovaj dan
    const zauzeteSlotove: Array<{start: number, end: number}> = [];
    
    for (let i = 0; i < brojAppointmenta; i++) {
      const randomService = servicesForAppointments[Math.floor(Math.random() * servicesForAppointments.length)];
      
      // Nađi slobodan slot
      let slobodanSlot: string | null = null;
      const shuffledVrijeme = [...radnoVrijeme].sort(() => Math.random() - 0.5);
      
      for (const vrijeme of shuffledVrijeme) {
        const [hours, minutes] = vrijeme.split(':').map(Number);
        const slotStart = hours * 60 + minutes;
        const slotEnd = slotStart + randomService.duration;
        
        // Provjeri da li je slot slobodan
        const isSlobodan = !zauzeteSlotove.some(slot => {
          return (slotStart < slot.end && slotEnd > slot.start);
        });
        
        if (isSlobodan && slotEnd <= 18 * 60) {
          slobodanSlot = vrijeme;
          zauzeteSlotove.push({ start: slotStart, end: slotEnd });
          break;
        }
      }
      
      if (!slobodanSlot) continue;
      
      const randomKlijent = imenaPrezimena[Math.floor(Math.random() * imenaPrezimena.length)];
      const randomDesign = designs[Math.floor(Math.random() * designs.length)];
      const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      appointmentsData.push({
        serviceId: randomService.id,
        size: randomSize,
        design: randomDesign,
        date: datum,
        time: slobodanSlot,
        customerName: randomKlijent.ime,
        customerPhone: randomKlijent.telefon,
        customerEmail: randomKlijent.email,
        status: randomStatus,
        notes: Math.random() > 0.7 ? 'Hitno -SpecijalnaE prigoda' : null
      });
    }
  }

  // Kreiranje appointmenta u bazi
  await prisma.appointment.createMany({
    data: appointmentsData
  });

  const totalAppointments = await prisma.appointment.count();
  console.log(`✅ Created ${totalAppointments} appointments (Nov, Dec 2025, Jan 2026)`);
  console.log('🎉 Database seeding completed with Zoyya data!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
