import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        service: {
          include: {
            category: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

// Helper function to convert time string to minutes
function timeStringToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/appointments - Start');
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body));
    
    const {
      serviceId,
      size,
      design,
      date,
      time,
      customerName,
      customerPhone,
      customerEmail,
      notes
    } = body;

    // Validate required fields
    if (!serviceId || !date || !time || !customerName || !customerEmail || !customerPhone) {
      console.log('Validation failed - missing fields');
      return NextResponse.json(
        { error: 'Nedostaju obavezna polja' },
        { status: 400 }
      );
    }

    // Get service to check duration
    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) }
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Usluga nije pronađena' },
        { status: 404 }
      );
    }

    // Create appointment date from date and time
    const [hours, minutes] = time.split(':').map(Number);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(hours, minutes, 0, 0);

    // Check for time conflicts - provjera preklapanja
    const requestedStart = timeStringToMinutes(time);
    const requestedEnd = requestedStart + service.duration;

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        date: appointmentDate,
        status: { in: ['pending', 'approved'] }
      },
      include: {
        service: true
      }
    });

    // Provjera preklapanja
    const hasConflict = existingAppointments.some((apt) => {
      const aptStart = timeStringToMinutes(apt.time);
      const aptEnd = aptStart + apt.service.duration;
      
      // Termini se preklapaju ako:
      // - novi termin počinje prije kraja postojećeg I završava nakon početka postojećeg
      return (requestedStart < aptEnd && requestedEnd > aptStart);
    });

    if (hasConflict) {
      return NextResponse.json(
        { error: 'Termin se preklapa s postojećim terminom. Molimo odaberite drugo vrijeme.' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        serviceId: parseInt(serviceId),
        date: appointmentDate,
        time,
        size: size || '',
        design: design || '',
        customerName,
        customerPhone,
        customerEmail,
        notes: notes || '',
        status: 'pending'
      },
      include: {
        service: {
          include: {
            category: true
          }
        }
      }
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ 
      error: 'Failed to create appointment',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
