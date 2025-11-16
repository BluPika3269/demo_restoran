import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Delete all existing data
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  console.log('🗑️  Cleared existing data');

  // Reset auto-increment sequences to start from 1
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
    data: { name: 'Geliranje prirodne duljine' }
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
      { name: 'L duljina noktiju', description: '', price: 5.00, duration: 30, image: '', categoryId: dopunaNoktiju.id },
      { name: 'XL duljina noktiju', description: '', price: 9.00, duration: 30, image: '', categoryId: dopunaNoktiju.id },
      { name: 'Ne znam što ću, radi što želiš', description: '', price: 35.00, duration: 120, image: '', categoryId: dopunaNoktiju.id }
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
      { name: 'Ne znam što ću, radi što želiš', description: '', price: 40.00, duration: 120, image: '', categoryId: gellak.id }
    ]
  });

  // 3. UGRADNJA NOKTIJU (9 usluga)
  await prisma.service.createMany({
    data: [
      { name: 'Cover', description: 'Nokti boje kože s produljivanjem duljine.', price: 39.00, duration: 60, image: '', categoryId: ugradnjaNoktiju.id },
      { name: 'French', description: 'Francuska manikura s produljivanjem duljine.', price: 41.00, duration: 90, image: '', categoryId: ugradnjaNoktiju.id },
      { name: 'Boja', description: 'Nokti u boji s produljivanjem duljine.', price: 40.00, duration: 90, image: '', categoryId: ugradnjaNoktiju.id },
      { name: 'BabyBoomer', description: 'Ombre nokti bijelo i cover s produljivanjem duljine.', price: 44.00, duration: 90, image: '', categoryId: ugradnjaNoktiju.id },
      { name: 'L duljina', description: '', price: 5.00, duration: 30, image: '', categoryId: ugradnjaNoktiju.id },
      { name: 'XL duljina', description: '', price: 9.00, duration: 30, image: '', categoryId: ugradnjaNoktiju.id },
      { name: 'Buildani french', description: 'Francuska manikura s umetanjem materijala u vrh nokta, oštra tehnika zida.', price: 60.00, duration: 180, image: '', categoryId: ugradnjaNoktiju.id },
      { name: 'Dodatno iscrtavanje, ombre efekt, extreme duljine', description: 'Nokti s posebnim motivima, nail artom na više noktiju. Cijena je informativnog karaktera.', price: 7.00, duration: 30, image: '', categoryId: ugradnjaNoktiju.id },
      { name: 'Ne znam što ću, radi što želiš', description: '', price: 50.00, duration: 150, image: '', categoryId: ugradnjaNoktiju.id }
    ]
  });

  // 4. GELIRANJE PRIRODNE DULJINE (6 usluga)
  await prisma.service.createMany({
    data: [
      { name: 'Cover', description: 'Nokti boje kože na prirodnu duljinu noktiju.', price: 29.00, duration: 60, image: '', categoryId: geliranjePrirodne.id },
      { name: 'Boja', description: 'Nokti u boji na prirodnu duljinu noktiju.', price: 30.00, duration: 60, image: '', categoryId: geliranjePrirodne.id },
      { name: 'French', description: 'Francuska manikura na prirodnu duljinu noktiju.', price: 31.00, duration: 90, image: '', categoryId: geliranjePrirodne.id },
      { name: 'BabyBoomer', description: 'Ombre bijelo i cover na prirodnu duljinu noktiju.', price: 34.00, duration: 90, image: '', categoryId: geliranjePrirodne.id },
      { name: 'Dodatno iscrtavanje, ombre, chrome', description: '', price: 7.00, duration: 30, image: '', categoryId: geliranjePrirodne.id },
      { name: 'Ne znam što ću, radi što želiš', description: '', price: 40.00, duration: 120, image: '', categoryId: geliranjePrirodne.id }
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

  // 10. MIKROPIGMENTACIJA (4 usluga)
  await prisma.service.createMany({
    data: [
      { name: 'Puder obrve (prvi dolazak)', description: '', price: 160.00, duration: 120, image: '', categoryId: mikropigmentacija.id },
      { name: 'Puder obrve (prva korekcija nakon 1 mj)', description: '', price: 50.00, duration: 60, image: '', categoryId: mikropigmentacija.id },
      { name: 'Puder obrve (osvježenje polugodišnje)', description: 'Polugodišnje osvježenje je većinom potrebno za osobe koje imaju ekstra masnu kožu.', price: 70.00, duration: 60, image: '', categoryId: mikropigmentacija.id },
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

  // ==================== DEMO APPOINTMENTI ====================
  
  // Dobij sve usluge za random termine
  const allServices = await prisma.service.findMany();
  
  // Demo appointmenti za novembar i decembar 2024
  const demoAppointments = [
    // Novembar 2024 - nekoliko termina
    { serviceId: allServices[0].id, size: 'M', design: 'French', date: new Date('2024-11-18T10:00:00'), time: '10:00', customerName: 'Ana Marić', customerPhone: '+385911234567', customerEmail: 'ana.maric@example.com', status: 'confirmed' },
    { serviceId: allServices[1].id, size: 'S', design: null, date: new Date('2024-11-18T14:00:00'), time: '14:00', customerName: 'Petra Horvat', customerPhone: '+385912345678', customerEmail: 'petra.horvat@example.com', status: 'confirmed' },
    { serviceId: allServices[14].id, size: 'L', design: 'Ombre', date: new Date('2024-11-19T09:00:00'), time: '09:00', customerName: 'Marija Kovač', customerPhone: '+385913456789', customerEmail: 'marija.kovac@example.com', status: 'pending' },
    { serviceId: allServices[8].id, size: 'M', design: 'Baby Boomer', date: new Date('2024-11-20T11:00:00'), time: '11:00', customerName: 'Ivana Novak', customerPhone: '+385914567890', customerEmail: 'ivana.novak@example.com', status: 'confirmed' },
    { serviceId: allServices[2].id, size: 'S', design: null, date: new Date('2024-11-21T15:00:00'), time: '15:00', customerName: 'Lucija Babić', customerPhone: '+385915678901', customerEmail: 'lucija.babic@example.com', status: 'completed' },
    { serviceId: allServices[15].id, size: 'M', design: 'Gel lak', date: new Date('2024-11-22T10:30:00'), time: '10:30', customerName: 'Sara Jurić', customerPhone: '+385916789012', customerEmail: 'sara.juric@example.com', status: 'confirmed' },
    { serviceId: allServices[3].id, size: 'L', design: 'Chrome', date: new Date('2024-11-25T13:00:00'), time: '13:00', customerName: 'Maja Božić', customerPhone: '+385917890123', customerEmail: 'maja.bozic@example.com', status: 'pending' },
    { serviceId: allServices[9].id, size: 'M', design: null, date: new Date('2024-11-26T09:30:00'), time: '09:30', customerName: 'Dora Matić', customerPhone: '+385918901234', customerEmail: 'dora.matic@example.com', status: 'confirmed' },
    { serviceId: allServices[16].id, size: 'S', design: 'French', date: new Date('2024-11-27T14:30:00'), time: '14:30', customerName: 'Ela Pavić', customerPhone: '+385919012345', customerEmail: 'ela.pavic@example.com', status: 'completed' },
    { serviceId: allServices[4].id, size: 'M', design: null, date: new Date('2024-11-28T11:30:00'), time: '11:30', customerName: 'Nina Tomić', customerPhone: '+385910123456', customerEmail: 'nina.tomic@example.com', status: 'confirmed' },
    
    // Decembar 2024 - nekoliko termina
    { serviceId: allServices[10].id, size: 'L', design: 'Ombre efekt', date: new Date('2024-12-02T10:00:00'), time: '10:00', customerName: 'Ana Šimić', customerPhone: '+385921234567', customerEmail: 'ana.simic@example.com', status: 'pending' },
    { serviceId: allServices[5].id, size: 'M', design: null, date: new Date('2024-12-03T13:00:00'), time: '13:00', customerName: 'Klara Vuković', customerPhone: '+385922345678', customerEmail: 'klara.vukovic@example.com', status: 'confirmed' },
    { serviceId: allServices[17].id, size: 'S', design: 'Gel lak', date: new Date('2024-12-04T09:00:00'), time: '09:00', customerName: 'Lana Knežević', customerPhone: '+385923456789', customerEmail: 'lana.knezevic@example.com', status: 'confirmed' },
    { serviceId: allServices[6].id, size: 'M', design: 'Baby Boomer', date: new Date('2024-12-05T15:00:00'), time: '15:00', customerName: 'Mia Barić', customerPhone: '+385924567890', customerEmail: 'mia.baric@example.com', status: 'completed' },
    { serviceId: allServices[11].id, size: 'L', design: null, date: new Date('2024-12-06T10:30:00'), time: '10:30', customerName: 'Tea Petrović', customerPhone: '+385925678901', customerEmail: 'tea.petrovic@example.com', status: 'confirmed' },
    { serviceId: allServices[18].id, size: 'S', design: 'French', date: new Date('2024-12-09T14:00:00'), time: '14:00', customerName: 'Nika Popović', customerPhone: '+385926789012', customerEmail: 'nika.popovic@example.com', status: 'pending' },
    { serviceId: allServices[7].id, size: 'M', design: 'Chrome', date: new Date('2024-12-10T11:00:00'), time: '11:00', customerName: 'Luna Đurić', customerPhone: '+385927890123', customerEmail: 'luna.djuric@example.com', status: 'confirmed' },
    { serviceId: allServices[12].id, size: 'L', design: null, date: new Date('2024-12-11T09:30:00'), time: '09:30', customerName: 'Ema Radić', customerPhone: '+385928901234', customerEmail: 'ema.radic@example.com', status: 'confirmed' },
    { serviceId: allServices[19].id, size: 'M', design: 'Gel lak', date: new Date('2024-12-12T13:30:00'), time: '13:30', customerName: 'Sofia Bašić', customerPhone: '+385929012345', customerEmail: 'sofia.basic@example.com', status: 'completed' },
    { serviceId: allServices[13].id, size: 'S', design: null, date: new Date('2024-12-13T10:00:00'), time: '10:00', customerName: 'Lara Kranjčec', customerPhone: '+385920123456', customerEmail: 'lara.kranjcec@example.com', status: 'confirmed' },
    { serviceId: allServices[20].id, size: 'M', design: 'Ombre', date: new Date('2024-12-16T15:00:00'), time: '15:00', customerName: 'Iva Mihaljević', customerPhone: '+385931234567', customerEmail: 'iva.mihaljevic@example.com', status: 'pending' },
    { serviceId: allServices[21].id, size: 'L', design: null, date: new Date('2024-12-17T11:30:00'), time: '11:30', customerName: 'Hana Filipović', customerPhone: '+385932345678', customerEmail: 'hana.filipovic@example.com', status: 'confirmed' },
    { serviceId: allServices[22].id, size: 'S', design: 'Baby Boomer', date: new Date('2024-12-18T09:00:00'), time: '09:00', customerName: 'Tara Grgić', customerPhone: '+385933456789', customerEmail: 'tara.grgic@example.com', status: 'confirmed' },
    { serviceId: allServices[23].id, size: 'M', design: null, date: new Date('2024-12-19T14:00:00'), time: '14:00', customerName: 'Nika Nikolić', customerPhone: '+385934567890', customerEmail: 'nika.nikolic@example.com', status: 'completed' },
    { serviceId: allServices[24].id, size: 'L', design: 'French', date: new Date('2024-12-20T10:30:00'), time: '10:30', customerName: 'Petra Blažević', customerPhone: '+385935678901', customerEmail: 'petra.blazevic@example.com', status: 'confirmed' },
    { serviceId: allServices[0].id, size: 'M', design: null, date: new Date('2024-12-23T13:00:00'), time: '13:00', customerName: 'Ana Lovrić', customerPhone: '+385936789012', customerEmail: 'ana.lovric@example.com', status: 'pending' },
    { serviceId: allServices[25].id, size: 'S', design: 'Chrome', date: new Date('2024-12-26T09:30:00'), time: '09:30', customerName: 'Marta Marković', customerPhone: '+385937890123', customerEmail: 'marta.markovic@example.com', status: 'confirmed' },
    { serviceId: allServices[1].id, size: 'M', design: null, date: new Date('2024-12-27T15:00:00'), time: '15:00', customerName: 'Laura Ivančić', customerPhone: '+385938901234', customerEmail: 'laura.ivancic@example.com', status: 'confirmed' },
    { serviceId: allServices[26].id, size: 'L', design: 'Gel lak', date: new Date('2024-12-30T11:00:00'), time: '11:00', customerName: 'Eva Pavlović', customerPhone: '+385939012345', customerEmail: 'eva.pavlovic@example.com', status: 'completed' }
  ];

  await prisma.appointment.createMany({
    data: demoAppointments
  });

  const totalAppointments = await prisma.appointment.count();
  console.log(`✅ Created ${totalAppointments} demo appointments for November and December 2024`);
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
