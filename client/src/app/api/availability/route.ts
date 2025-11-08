import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Working hours
const WORKING_HOURS = {
  start: 9, // 9:00
  end: 19,  // 19:00 (7 PM)
};

// Generate time slots (every 30 minutes)
function generateTimeSlots(date: Date, serviceDuration: number): string[] {
  const slots: string[] = [];
  const workingStart = WORKING_HOURS.start * 60; // minutes
  const workingEnd = WORKING_HOURS.end * 60; // minutes
  
  for (let time = workingStart; time <= workingEnd - serviceDuration; time += 30) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    slots.push(timeString);
  }
  
  return slots;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!date || !serviceId) {
      return NextResponse.json(
        { error: 'Date and serviceId are required' },
        { status: 400 }
      );
    }

    // Get service to know duration
    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) }
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Get all appointments for that date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          not: 'CANCELLED'
        }
      },
      include: {
        service: true
      }
    });

    // Generate all possible time slots
    const allSlots = generateTimeSlots(new Date(date), service.duration);

    // Filter out booked slots
    const bookedSlots = appointments.map((apt: any) => {
      const hours = apt.date.getHours().toString().padStart(2, '0');
      const minutes = apt.date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    });

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    return NextResponse.json({ availableSlots });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
