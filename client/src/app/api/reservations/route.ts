import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export async function GET(request: Request) {
  try {
    console.log('=== FETCHING RESERVATIONS ===');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const tableId = searchParams.get('tableId');

    let reservations;

    if (date && tableId) {
      // Get reservations for specific table and date
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      reservations = await prisma.reservation.findMany({
        where: {
          tableId: parseInt(tableId),
          date: {
            gte: startDate,
            lte: endDate
          },
          status: {
            not: 'cancelled'
          }
        },
        include: {
          table: true
        },
        orderBy: { time: 'asc' }
      });
    } else if (date) {
      // Get all reservations for specific date
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      reservations = await prisma.reservation.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate
          },
          status: {
            not: 'cancelled'
          }
        },
        include: {
          table: true
        },
        orderBy: { time: 'asc' }
      });
    } else {
      // Get all reservations
      reservations = await prisma.reservation.findMany({
        include: {
          table: true
        },
        orderBy: [
          { date: 'asc' },
          { time: 'asc' }
        ]
      });
    }

    console.log('Found', reservations.length, 'reservations');
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('=== CREATING RESERVATION ===');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    const body = await request.json();
    const {
      tableId,
      date,
      time,
      numberOfGuests,
      duration,
      customerName,
      customerPhone,
      customerEmail,
      notes
    } = body;
    console.log('Reservation data:', { date, time, numberOfGuests, customerName });

    // Validate required fields (tableId is now optional - will be assigned by admin)
    if (!date || !time || !numberOfGuests || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check total capacity availability for this date/time
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

    // Check if there's enough capacity
    if (availableCapacity < numberOfGuests) {
      return NextResponse.json(
        { error: 'Nema dovoljno mjesta za odabrano vrijeme. Molimo odaberite drugo vrijeme ili datum.' },
        { status: 400 }
      );
    }

    // If tableId is provided, check if table exists and is available
    if (tableId) {
      const table = await prisma.table.findUnique({
        where: { id: tableId }
      });

      if (!table) {
        return NextResponse.json(
          { error: 'Table not found' },
          { status: 404 }
        );
      }

      // Check if table is already reserved at this time
      const existingReservation = await prisma.reservation.findFirst({
        where: {
          tableId,
          date: {
            gte: reservationDate,
            lte: endDate
          },
          time,
          status: {
            not: 'cancelled'
          }
        }
      });

      if (existingReservation) {
        return NextResponse.json(
          { error: 'Table is already reserved at this time' },
          { status: 400 }
        );
      }
    }

    // Create reservation (tableId can be null, admin will assign later)
    const reservation = await prisma.reservation.create({
      data: {
        ...(tableId && { tableId }), // Only include tableId if provided
        date: new Date(date),
        time,
        duration: duration || 120,
        numberOfGuests,
        customerName,
        customerPhone,
        customerEmail,
        notes,
        status: 'pending'
      },
      include: {
        table: true
      }
    });

    console.log('Reservation created with ID:', reservation.id);
    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}
