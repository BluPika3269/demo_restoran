import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Get all service categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      include: {
        services: true
      }
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        category: true
      },
      orderBy: { name: 'asc' }
    });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get services by category and type
app.get('/api/services/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const services = await prisma.service.findMany({
      where: { categoryId: parseInt(categoryId) },
      include: {
        category: true
      },
      orderBy: { name: 'asc' }
    });
    res.json(services);
  } catch (error) {
    console.error('Error fetching services by category:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get available time slots for a date and service
app.get('/api/availability', async (req, res) => {
  try {
    const { date, serviceId } = req.query;

    if (!date || !serviceId) {
      return res.status(400).json({ error: 'Date and serviceId are required' });
    }

    // Get service duration
    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId as string) }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Get existing appointments for the date
    const appointments = await prisma.appointment.findMany({
      where: {
        date: new Date(date as string),
        status: { in: ['pending', 'approved'] }
      },
      include: {
        service: true
      }
    });

    // Generate available time slots (9:00 - 18:00, 30min intervals)
    const workingHours = {
      start: 9 * 60, // 9:00 in minutes
      end: 18 * 60    // 18:00 in minutes
    };

    const availableSlots: string[] = [];
    const slotDuration = 30; // 30 minutes

    for (let time = workingHours.start; time < workingHours.end; time += slotDuration) {
      const slotStart = time;
      const slotEnd = time + service.duration;

      // Check if slot conflicts with existing appointments
      const conflict = appointments.some((appointment: any) => {
        const appointmentStart = timeStringToMinutes(appointment.time);
        const appointmentEnd = appointmentStart + appointment.service.duration;

        return (slotStart < appointmentEnd && slotEnd > appointmentStart);
      });

      if (!conflict) {
        availableSlots.push(minutesToTimeString(slotStart));
      }
    }

    res.json({ availableSlots, serviceDuration: service.duration });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// Get all appointments
app.get('/api/appointments', async (req, res) => {
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
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get appointment by ID
app.get('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
      include: {
        service: {
          include: {
            category: true
          }
        }
      }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

// Create new appointment
app.post('/api/appointments', async (req, res) => {
  try {
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
    } = req.body;

    // Validate service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return res.status(400).json({ error: 'Service not found' });
    }

    // Check if time slot is available
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: new Date(date),
        time: time,
        status: { in: ['pending', 'approved'] }
      }
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'Time slot not available' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        serviceId,
        size,
        design,
        date: new Date(date),
        time,
        customerName,
        customerPhone,
        customerEmail,
        notes
      },
      include: {
        service: {
          include: {
            category: true
          }
        }
      }
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Update appointment status
app.patch('/api/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        service: {
          include: {
            category: true
          }
        }
      }
    });

    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Delete appointment
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.appointment.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

// Admin routes
app.get('/api/admin/appointments', async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        service: true
      },
      orderBy: { date: 'desc' }
    });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching admin appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

app.patch('/api/admin/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        service: true
      }
    });

    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

app.delete('/api/admin/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.appointment.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

// Helper functions
function timeStringToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTimeString(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;