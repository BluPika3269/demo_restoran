import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type RouteContext = {
  params: Promise<{ id: string }>
}

// PATCH /api/reservations/[id] - Update reservation (status, tableId, etc.)
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, tableId, notes } = body;

    // Build update data dynamically
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (tableId !== undefined) updateData.tableId = tableId;
    if (notes !== undefined) updateData.notes = notes;

    // If tableId is being assigned, verify table is available
    if (tableId) {
      const reservation = await prisma.reservation.findUnique({
        where: { id: parseInt(id) }
      });

      if (!reservation) {
        return NextResponse.json(
          { error: 'Reservation not found' },
          { status: 404 }
        );
      }

      // Check if table is already reserved at this time
      const reservationDate = new Date(reservation.date);
      reservationDate.setHours(0, 0, 0, 0);
      const endDate = new Date(reservation.date);
      endDate.setHours(23, 59, 59, 999);

      const existingReservation = await prisma.reservation.findFirst({
        where: {
          tableId,
          date: {
            gte: reservationDate,
            lte: endDate
          },
          time: reservation.time,
          status: {
            not: 'cancelled'
          },
          id: {
            not: parseInt(id) // Exclude current reservation
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

    const updatedReservation = await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        table: true
      }
    });

    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    );
  }
}

// DELETE /api/reservations/[id] - Delete reservation
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    
    await prisma.reservation.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return NextResponse.json(
      { error: 'Failed to delete reservation' },
      { status: 500 }
    );
  }
}
