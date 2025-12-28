import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format, addDays } from 'date-fns';

const RESERVATION_DURATION = 120; // 2 hours in minutes
const TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
];

// Convert time string to minutes since midnight
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Check if two time slots overlap (considering 2-hour duration)
function timesOverlap(time1: string, time2: string): boolean {
  const start1 = timeToMinutes(time1);
  const end1 = start1 + RESERVATION_DURATION;
  const start2 = timeToMinutes(time2);
  const end2 = start2 + RESERVATION_DURATION;
  
  return start1 < end2 && end1 > start2;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const numberOfGuestsParam = searchParams.get('numberOfGuests');
    const daysParam = searchParams.get('days') || '60';
    
    const numberOfGuests = numberOfGuestsParam ? parseInt(numberOfGuestsParam) : 2;
    const days = parseInt(daysParam);

    if (!numberOfGuests || numberOfGuests < 1) {
      return NextResponse.json(
        { error: 'Invalid number of guests' },
        { status: 400 }
      );
    }

    // Get all tables
    const allTables = await prisma.table.findMany();
    const totalTablesCount = allTables.length;

    // Get all approved reservations for the next X days
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = addDays(startDate, days);
    endDate.setHours(23, 59, 59, 999);

    const reservations = await prisma.reservation.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        status: 'approved'
      },
      select: {
        date: true,
        time: true,
        tableId: true,
      },
    });

    // Build availability map
    const availabilityMap: Record<string, { available: number; total: number }> = {};

    // Check each day
    for (let i = 0; i < days; i++) {
      const checkDate = addDays(startDate, i);
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      
      let availableSlots = 0;

      // Check each time slot
      for (const timeSlot of TIME_SLOTS) {
        // Find reservations that overlap with this slot on this date
        const overlappingReservations = reservations.filter((res: { date: Date; time: string; tableId: number | null }) => {
          const resDateStr = format(new Date(res.date), 'yyyy-MM-dd');
          return resDateStr === dateStr && timesOverlap(res.time, timeSlot);
        });

        // Get IDs of reserved tables
        const reservedTableIds = overlappingReservations
          .map((res: { tableId: number | null }) => res.tableId)
          .filter((id: number | null): id is number => id !== null);

        // Find available tables (not reserved)
        const availableTables = allTables.filter(
          (table: { id: number; capacity: number }) => !reservedTableIds.includes(table.id)
        );

        // Calculate available capacity
        const availableCapacity = availableTables.reduce(
          (sum: number, table: { capacity: number }) => sum + table.capacity,
          0
        );

        // This slot is available if we have enough capacity
        if (availableCapacity >= numberOfGuests) {
          availableSlots++;
        }
      }

      availabilityMap[dateStr] = {
        available: availableSlots,
        total: TIME_SLOTS.length,
      };
    }

    return NextResponse.json({
      success: true,
      availability: availabilityMap,
      totalTablesCount,
      reservationDuration: RESERVATION_DURATION,
      numberOfGuests,
      daysChecked: days,
    });

  } catch (error) {
    console.error('Error checking batch availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
