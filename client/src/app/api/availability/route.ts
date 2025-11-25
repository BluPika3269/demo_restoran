import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

// Helper function to convert time string to minutes
function timeStringToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');
    const excludeAppointmentId = searchParams.get('excludeAppointmentId');

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

    // Get all appointments for that date (full day range)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    console.log('Searching appointments between:', startOfDay, 'and', endOfDay);
    
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: { in: ['pending', 'approved'] },
        ...(excludeAppointmentId && { id: { not: parseInt(excludeAppointmentId) } })
      },
      include: {
        service: true
      }
    });
    
    console.log('Found appointments:', appointments.length);

    // Generate all possible time slots
    const allSlots = generateTimeSlots(startOfDay, service.duration);

    // Get current time
    const now = new Date();
    const isToday = startOfDay.toDateString() === now.toDateString();
    const currentMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : 0;

    // Filter slots based on actual time conflicts with service duration
    const availableSlots = allSlots.filter(slot => {
      const slotStart = timeStringToMinutes(slot);
      const slotEnd = slotStart + service.duration;

      // Provjeri da li je slot u prošlosti (samo za današnji dan)
      if (isToday && slotEnd <= currentMinutes) {
        return false;
      }

      // Provjeri da li se slot preklapa sa bilo kojim postojećim appointmentom
      const hasConflict = appointments.some((apt) => {
        const aptStart = timeStringToMinutes(apt.time);
        const aptEnd = aptStart + apt.service.duration;

        // Provjeri preklapanje
        return (slotStart < aptEnd && slotEnd > aptStart);
      });

      return !hasConflict;
    });

    return NextResponse.json({ 
      availableSlots,
      serviceDuration: service.duration 
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
