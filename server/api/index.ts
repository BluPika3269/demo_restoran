import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

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

// Get services by category
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

export default app;
