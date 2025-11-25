import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fix appointments sequence
    await prisma.$executeRaw`
      SELECT setval(pg_get_serial_sequence('appointments', 'id'), COALESCE((SELECT MAX(id) FROM appointments), 0) + 1, false);
    `;
    
    // Fix services sequence
    await prisma.$executeRaw`
      SELECT setval(pg_get_serial_sequence('services', 'id'), COALESCE((SELECT MAX(id) FROM services), 0) + 1, false);
    `;
    
    // Fix service_categories sequence
    await prisma.$executeRaw`
      SELECT setval(pg_get_serial_sequence('service_categories', 'id'), COALESCE((SELECT MAX(id) FROM service_categories), 0) + 1, false);
    `;
    
    return NextResponse.json({ success: true, message: 'Sequences fixed successfully' });
  } catch (error) {
    console.error('Error fixing sequences:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
