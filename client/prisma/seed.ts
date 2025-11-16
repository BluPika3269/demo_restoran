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
