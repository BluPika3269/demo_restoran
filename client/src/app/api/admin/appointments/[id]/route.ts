import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper function to convert time string to minutes
function timeStringToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

// PATCH /api/admin/appointments/[id] - Update appointment (status, date, time)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { status, date, time } = body;

    const resolvedParams = await params;
    const appointmentId = parseInt(resolvedParams.id);

    // Dohvati trenutni appointment
    const currentAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { service: true }
    });

    if (!currentAppointment) {
      return NextResponse.json(
        { error: 'Termin nije pronađen' },
        { status: 404 }
      );
    }

    // Ako se mijenja datum ili vrijeme, provjeri preklapanje
    if (date || time) {
      const newDate = date ? new Date(date) : currentAppointment.date;
      const newTime = time || currentAppointment.time;
      
      const requestedStart = timeStringToMinutes(newTime);
      const requestedEnd = requestedStart + currentAppointment.service.duration;

      const existingAppointments = await prisma.appointment.findMany({
        where: {
          date: newDate,
          status: { in: ['pending', 'approved'] },
          id: { not: appointmentId } // Isključi trenutni appointment
        },
        include: {
          service: true
        }
      });

      // Provjera preklapanja
      const hasConflict = existingAppointments.some((apt) => {
        const aptStart = timeStringToMinutes(apt.time);
        const aptEnd = aptStart + apt.service.duration;
        
        return (requestedStart < aptEnd && requestedEnd > aptStart);
      });

      if (hasConflict) {
        return NextResponse.json(
          { error: 'Novi termin se preklapa s postojećim terminom. Molimo odaberite drugo vrijeme.' },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (date) updateData.date = new Date(date);
    if (time) updateData.time = time;

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData,
      include: {
        service: {
          include: {
            category: true
          }
        }
      }
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/appointments/[id] - Delete appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const appointmentId = parseInt(resolvedParams.id);

    await prisma.appointment.delete({
      where: { id: appointmentId }
    });

    return NextResponse.json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}

// GET /api/admin/appointments/[id] - Get single appointment (optional)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const appointmentId = parseInt(resolvedParams.id);

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        service: {
          include: {
            category: true
          }
        }
      }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}
