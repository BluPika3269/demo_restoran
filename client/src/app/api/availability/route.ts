import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Trajanje rezervacije u minutama (2 sata)
const RESERVATION_DURATION = 120;

// Helper funkcija za pretvaranje vremena u minute
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Helper funkcija za provjeru preklapanja vremena
function timesOverlap(time1: string, time2: string, duration: number = RESERVATION_DURATION): boolean {
  const start1 = timeToMinutes(time1);
  const end1 = start1 + duration;
  const start2 = timeToMinutes(time2);
  const end2 = start2 + duration;
  
  // Provjera preklapanja: vrijeme 1 se preklapa sa vrijeme 2 ako:
  // - start1 je prije end2 I end1 je poslije start2
  return start1 < end2 && end1 > start2;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const numberOfGuests = parseInt(searchParams.get('numberOfGuests') || '2');

    if (!date || !time) {
      return NextResponse.json(
        { error: 'Date and time are required' },
        { status: 400 }
      );
    }

    const reservationDate = new Date(date);
    reservationDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Get all tables
    const allTables = await prisma.table.findMany();
    const totalCapacity = allTables.reduce((sum, table) => sum + table.capacity, 0);

    // Get all reservations for this date that are not cancelled
    const existingReservations = await prisma.reservation.findMany({
      where: {
        date: {
          gte: reservationDate,
          lte: endDate
        },
        status: {
          in: ['pending', 'approved']
        }
      }
    });

    // Filtriraj rezervacije koje se preklapaju sa traženim vremenom
    const overlappingReservations = existingReservations.filter(res => 
      timesOverlap(res.time, time, RESERVATION_DURATION)
    );

    // Dobij ID-eve zauzetih stolova
    const reservedTableIds = overlappingReservations
      .map(res => res.tableId)
      .filter((id): id is number => id !== null);

    // Slobodni stolovi = svi stolovi - zauzeti stolovi
    const availableTables = allTables.filter(table => !reservedTableIds.includes(table.id));
    const availableCapacity = availableTables.reduce((sum, table) => sum + table.capacity, 0);
    const reservedCapacity = totalCapacity - availableCapacity;
    
    const isAvailable = availableCapacity >= numberOfGuests;

    return NextResponse.json({
      available: isAvailable,
      totalCapacity,
      reservedCapacity,
      availableCapacity,
      availableTablesCount: availableTables.length,
      totalTablesCount: allTables.length,
      reservationDuration: RESERVATION_DURATION,
      message: isAvailable 
        ? `Dostupno za ${numberOfGuests} ${numberOfGuests === 1 ? 'osobu' : numberOfGuests <= 4 ? 'osobe' : 'osoba'}` 
        : 'Nema dovoljno mjesta za odabrano vrijeme'
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 });
  }
}
