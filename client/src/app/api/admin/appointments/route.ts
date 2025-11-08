import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/admin/appointments - Fetch all appointments
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
      orderBy: {
        date: 'desc'
      }
    });
    
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST /api/admin/appointments - Create new appointment (if needed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, date, time, size, design, customerName, customerEmail, customerPhone, notes } = body;

    // Validate required fields
    if (!serviceId || !date || !time || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create appointment date from date and time
    const [hours, minutes] = time.split(':').map(Number);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(hours, minutes, 0, 0);

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
        status: 'PENDING'
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
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
