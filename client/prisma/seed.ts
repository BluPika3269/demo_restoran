import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting restaurant database seed...');

  await prisma.reservation.deleteMany();
  await prisma.table.deleteMany();
  console.log('Cleared existing data');

  const tables = [
    // Red 1 - Manji kapaciteti (2-4 osobe)
    { number: 1, capacity: 2, x: 130, y: 120, shape: 'round' },
    { number: 2, capacity: 2, x: 260, y: 120, shape: 'round' },
    { number: 5, capacity: 4, x: 420, y: 120, shape: 'rectangle' },
    { number: 6, capacity: 4, x: 580, y: 120, shape: 'rectangle' },
    
    // Red 2 - Srednji kapaciteti (4-6 osoba)
    { number: 3, capacity: 4, x: 130, y: 280, shape: 'round' },
    { number: 4, capacity: 4, x: 260, y: 280, shape: 'round' },
    { number: 7, capacity: 6, x: 420, y: 280, shape: 'rectangle' },
    { number: 8, capacity: 6, x: 580, y: 280, shape: 'rectangle' },
    
    // Red 3 - Manji i veći kapaciteti (2-8 osoba)
    { number: 11, capacity: 2, x: 130, y: 440, shape: 'round' },
    { number: 12, capacity: 2, x: 260, y: 440, shape: 'round' },
    { number: 9, capacity: 6, x: 420, y: 440, shape: 'rectangle' },
    { number: 10, capacity: 8, x: 580, y: 440, shape: 'rectangle' },
  ];

  const createdTables = [];
  for (const table of tables) {
    const created = await prisma.table.create({ data: table });
    createdTables.push(created);
  }

  console.log('Created ' + tables.length + ' tables');

  const reservations = [
    { tableId: createdTables[0].id, date: new Date('2026-01-03'), time: '19:00', numberOfGuests: 2, customerName: 'Marko Horvat', customerEmail: 'marko.horvat@example.com', customerPhone: '+385911234567', status: 'approved', notes: 'Prozor molim' },
    { tableId: createdTables[4].id, date: new Date('2026-01-03'), time: '20:00', numberOfGuests: 4, customerName: 'Ana Kovacic', customerEmail: 'ana.kovacic@example.com', customerPhone: '+385912345678', status: 'approved', notes: null },
    { tableId: createdTables[6].id, date: new Date('2026-01-05'), time: '18:30', numberOfGuests: 6, customerName: 'Petar Novak', customerEmail: 'petar.novak@example.com', customerPhone: '+385913456789', status: 'approved', notes: 'Vegetarijanska opcija' },
    { tableId: null, date: new Date('2026-01-05'), time: '19:30', numberOfGuests: 2, customerName: 'Ivana Babic', customerEmail: 'ivana.babic@example.com', customerPhone: '+385914567890', status: 'pending', notes: null },
    { tableId: null, date: new Date('2026-01-05'), time: '19:00', numberOfGuests: 4, customerName: 'Stjepan Radic', customerEmail: 'stjepan.radic@example.com', customerPhone: '+385931234567', status: 'pending', notes: 'Kod prozora ako moze' },
    { tableId: null, date: new Date('2026-01-05'), time: '20:00', numberOfGuests: 6, customerName: 'Katarina Lovric', customerEmail: 'katarina.lovric@example.com', customerPhone: '+385932345678', status: 'pending', notes: null },
    { tableId: null, date: new Date('2026-01-05'), time: '18:00', numberOfGuests: 2, customerName: 'Goran Petrovic', customerEmail: 'goran.petrovic@example.com', customerPhone: '+385933456789', status: 'pending', notes: 'Djecja stolica' },
    { tableId: null, date: new Date('2026-01-05'), time: '20:30', numberOfGuests: 4, customerName: 'Mirela Jankovic', customerEmail: 'mirela.jankovic@example.com', customerPhone: '+385934567890', status: 'pending', notes: null },
    { tableId: null, date: new Date('2026-01-05'), time: '21:00', numberOfGuests: 2, customerName: 'Damir Horvat', customerEmail: 'damir.horvat@example.com', customerPhone: '+385935678901', status: 'pending', notes: 'Romantican stol' },
    { tableId: null, date: new Date('2026-01-05'), time: '19:00', numberOfGuests: 8, customerName: 'Snježana Kovac', customerEmail: 'snjezana.kovac@example.com', customerPhone: '+385936789012', status: 'pending', notes: 'Velika obitelj' },
    { tableId: createdTables[1].id, date: new Date('2026-01-08'), time: '20:00', numberOfGuests: 2, customerName: 'Luka Maric', customerEmail: 'luka.maric@example.com', customerPhone: '+385915678901', status: 'approved', notes: null },
    { tableId: null, date: new Date('2026-01-10'), time: '19:00', numberOfGuests: 4, customerName: 'Maja Juric', customerEmail: 'maja.juric@example.com', customerPhone: '+385916789012', status: 'pending', notes: 'Proslava rodjendana' },
    { tableId: createdTables[9].id, date: new Date('2026-01-12'), time: '18:00', numberOfGuests: 8, customerName: 'Tomislav Knezevic', customerEmail: 'tomislav.knezevic@example.com', customerPhone: '+385917890123', status: 'approved', notes: 'Biznis vecera' },
    { tableId: null, date: new Date('2026-01-15'), time: '20:30', numberOfGuests: 2, customerName: 'Sara Pavic', customerEmail: 'sara.pavic@example.com', customerPhone: '+385918901234', status: 'pending', notes: null },
    { tableId: createdTables[5].id, date: new Date('2026-01-17'), time: '19:00', numberOfGuests: 4, customerName: 'Darko Simic', customerEmail: 'darko.simic@example.com', customerPhone: '+385919012345', status: 'approved', notes: null },
    { tableId: createdTables[2].id, date: new Date('2026-01-18'), time: '18:30', numberOfGuests: 4, customerName: 'Nikolina Tomic', customerEmail: 'nikolina.tomic@example.com', customerPhone: '+385910123456', status: 'approved', notes: 'Alergija na orahe' },
    { tableId: null, date: new Date('2026-01-20'), time: '19:30', numberOfGuests: 6, customerName: 'Josip Vukovic', customerEmail: 'josip.vukovic@example.com', customerPhone: '+385921234567', status: 'pending', notes: null },
    { tableId: createdTables[7].id, date: new Date('2026-01-22'), time: '20:00', numberOfGuests: 6, customerName: 'Martina Bozic', customerEmail: 'martina.bozic@example.com', customerPhone: '+385922345678', status: 'approved', notes: null },
    { tableId: null, date: new Date('2026-01-24'), time: '18:00', numberOfGuests: 2, customerName: 'Filip Matic', customerEmail: 'filip.matic@example.com', customerPhone: '+385923456789', status: 'pending', notes: 'Godisnjica' },
    { tableId: createdTables[3].id, date: new Date('2026-01-25'), time: '19:00', numberOfGuests: 4, customerName: 'Iva Radovic', customerEmail: 'iva.radovic@example.com', customerPhone: '+385924567890', status: 'approved', notes: null },
    { tableId: createdTables[8].id, date: new Date('2026-01-28'), time: '20:30', numberOfGuests: 6, customerName: 'Karlo Lovric', customerEmail: 'karlo.lovric@example.com', customerPhone: '+385925678901', status: 'approved', notes: 'Specijalana vina' },
    { tableId: null, date: new Date('2026-01-30'), time: '19:00', numberOfGuests: 4, customerName: 'Tea Popovic', customerEmail: 'tea.popovic@example.com', customerPhone: '+385926789012', status: 'pending', notes: null },
    
    // 2. siječnja 2026 - POTPUNO ZAUZETO u 19:00 (ukupan kapacitet: 50 osoba)
    { tableId: createdTables[0].id, date: new Date('2026-01-02'), time: '19:00', numberOfGuests: 2, customerName: 'Ivan Horvat', customerEmail: 'ivan@example.com', customerPhone: '+385911111111', status: 'approved', notes: null },
    { tableId: createdTables[1].id, date: new Date('2026-01-02'), time: '19:00', numberOfGuests: 2, customerName: 'Ana Novak', customerEmail: 'ana@example.com', customerPhone: '+385911111112', status: 'approved', notes: null },
    { tableId: createdTables[2].id, date: new Date('2026-01-02'), time: '19:00', numberOfGuests: 4, customerName: 'Petar Kovač', customerEmail: 'petar@example.com', customerPhone: '+385911111113', status: 'approved', notes: null },
    { tableId: createdTables[3].id, date: new Date('2026-01-02'), time: '19:00', numberOfGuests: 4, customerName: 'Marija Jurić', customerEmail: 'marija@example.com', customerPhone: '+385911111114', status: 'approved', notes: null },
    { tableId: createdTables[4].id, date: new Date('2026-01-02'), time: '19:00', numberOfGuests: 4, customerName: 'Tomislav Babić', customerEmail: 'tomislav@example.com', customerPhone: '+385911111115', status: 'approved', notes: null },
    { tableId: createdTables[5].id, date: new Date('2026-01-02'), time: '19:00', numberOfGuests: 4, customerName: 'Ivana Matić', customerEmail: 'ivana@example.com', customerPhone: '+385911111116', status: 'approved', notes: null },
    { tableId: createdTables[6].id, date: new Date('2026-01-02'), time: '19:00', numberOfGuests: 6, customerName: 'Luka Knežević', customerEmail: 'luka@example.com', customerPhone: '+385911111117', status: 'approved', notes: null },
    { tableId: createdTables[7].id, date: new Date('2026-01-02'), time: '19:00', numberOfGuests: 6, customerName: 'Sara Marić', customerEmail: 'sara@example.com', customerPhone: '+385911111118', status: 'approved', notes: null },
    { tableId: createdTables[8].id, date: new Date('2026-01-02'), time: '19:00', numberOfGuests: 6, customerName: 'Filip Pavić', customerEmail: 'filip@example.com', customerPhone: '+385911111119', status: 'approved', notes: null },
    { tableId: createdTables[9].id, date: new Date('2026-01-02'), time: '19:00', numberOfGuests: 8, customerName: 'Nikolina Perić', customerEmail: 'nikolina@example.com', customerPhone: '+385911111120', status: 'approved', notes: null },
    { tableId: createdTables[10].id, date: new Date('2026-01-02'), time: '19:00', numberOfGuests: 2, customerName: 'Darko Tomić', customerEmail: 'darko@example.com', customerPhone: '+385911111121', status: 'approved', notes: null },
    { tableId: createdTables[11].id, date: new Date('2026-01-02'), time: '19:00', numberOfGuests: 2, customerName: 'Maja Šimić', customerEmail: 'maja@example.com', customerPhone: '+385911111122', status: 'approved', notes: null },
    
    // 2. siječnja 2026 - POTPUNO ZAUZETO u 20:00
    { tableId: createdTables[0].id, date: new Date('2026-01-02'), time: '20:00', numberOfGuests: 2, customerName: 'Josip Lovrić', customerEmail: 'josip@example.com', customerPhone: '+385922222221', status: 'approved', notes: null },
    { tableId: createdTables[1].id, date: new Date('2026-01-02'), time: '20:00', numberOfGuests: 2, customerName: 'Tea Božić', customerEmail: 'tea@example.com', customerPhone: '+385922222222', status: 'approved', notes: null },
    { tableId: createdTables[2].id, date: new Date('2026-01-02'), time: '20:00', numberOfGuests: 4, customerName: 'Karlo Radić', customerEmail: 'karlo@example.com', customerPhone: '+385922222223', status: 'approved', notes: null },
    { tableId: createdTables[3].id, date: new Date('2026-01-02'), time: '20:00', numberOfGuests: 4, customerName: 'Marta Vlašić', customerEmail: 'marta@example.com', customerPhone: '+385922222224', status: 'approved', notes: null },
    { tableId: createdTables[4].id, date: new Date('2026-01-02'), time: '20:00', numberOfGuests: 4, customerName: 'Igor Popović', customerEmail: 'igor@example.com', customerPhone: '+385922222225', status: 'approved', notes: null },
    { tableId: createdTables[5].id, date: new Date('2026-01-02'), time: '20:00', numberOfGuests: 4, customerName: 'Lucija Stanić', customerEmail: 'lucija@example.com', customerPhone: '+385922222226', status: 'approved', notes: null },
    { tableId: createdTables[6].id, date: new Date('2026-01-02'), time: '20:00', numberOfGuests: 6, customerName: 'Bruno Grgić', customerEmail: 'bruno@example.com', customerPhone: '+385922222227', status: 'approved', notes: null },
    { tableId: createdTables[7].id, date: new Date('2026-01-02'), time: '20:00', numberOfGuests: 6, customerName: 'Laura Vuković', customerEmail: 'laura@example.com', customerPhone: '+385922222228', status: 'approved', notes: null },
    { tableId: createdTables[8].id, date: new Date('2026-01-02'), time: '20:00', numberOfGuests: 6, customerName: 'David Bošnjak', customerEmail: 'david@example.com', customerPhone: '+385922222229', status: 'approved', notes: null },
    { tableId: createdTables[9].id, date: new Date('2026-01-02'), time: '20:00', numberOfGuests: 8, customerName: 'Elena Jozić', customerEmail: 'elena@example.com', customerPhone: '+385922222230', status: 'approved', notes: null },
    { tableId: createdTables[10].id, date: new Date('2026-01-02'), time: '20:00', numberOfGuests: 2, customerName: 'Matej Bilić', customerEmail: 'matej@example.com', customerPhone: '+385922222231', status: 'approved', notes: null },
    { tableId: createdTables[11].id, date: new Date('2026-01-02'), time: '20:00', numberOfGuests: 2, customerName: 'Paula Nikolić', customerEmail: 'paula@example.com', customerPhone: '+385922222232', status: 'approved', notes: null },
  ];

  // 6. siječnja 2026 - CIJELI DAN POTPUNO ZAUZET (svi stolovi, svi termini)
  // Logika: Večera traje 2h, pa će rezervacije na 11:00, 13:00, 15:00, 17:00, 19:00, 21:00
  // pokriti sve vremenske slotove od 11:00 do 22:30
  const fullDayTimes = ['11:00', '13:00', '15:00', '17:00', '19:00', '21:00'];
  const customerNames = [
    'Ivan Anić', 'Petra Barić', 'Marko Ćosić', 'Ana Delić', 'Stjepan Ercegovac', 'Maja Filipović',
    'Luka Galić', 'Ivana Horvat', 'Tomislav Ivić', 'Sara Jurić', 'Filip Kovačević', 'Nina Lukić'
  ];
  
  let reservationCounter = 600; // Start from 600 for unique email/phone
  for (const time of fullDayTimes) {
    for (let tableIndex = 0; tableIndex < createdTables.length; tableIndex++) {
      const table = createdTables[tableIndex];
      const customerName = customerNames[tableIndex];
      
      reservations.push({
        tableId: table.id,
        date: new Date('2026-01-06'),
        time: time,
        numberOfGuests: table.capacity,
        customerName: customerName,
        customerEmail: `${customerName.toLowerCase().replace(' ', '.')}${reservationCounter}@example.com`,
        customerPhone: `+38599${String(reservationCounter).padStart(7, '0')}`,
        status: 'approved',
        notes: null
      });
      
      reservationCounter++;
    }
  }

  for (const reservation of reservations) {
    await prisma.reservation.create({ data: reservation });
  }

  console.log('Created ' + reservations.length + ' reservations');
  console.log('Restaurant database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
