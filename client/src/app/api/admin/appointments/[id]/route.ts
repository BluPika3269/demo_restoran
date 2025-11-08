import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH /api/admin/appointments/[id] - Update appointment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const resolvedParams = await params;
    const appointmentId = parseInt(resolvedParams.id);

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
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
