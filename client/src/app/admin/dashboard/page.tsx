'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isToday, isSameDay } from 'date-fns';
import Navigation from '@/components/Navigation';

const API_URL = '/api';

// Croatian public holidays
const getCroatianHolidays = (year: number) => {
  return [
    { date: new Date(year, 0, 1), name: 'Nova godina' },
    { date: new Date(year, 0, 6), name: 'Bogojavljenje, Sveta tri kralja' },
    { date: new Date(year, 4, 1), name: 'Praznik rada' },
    { date: new Date(year, 4, 30), name: 'Dan državnosti' },
    { date: new Date(year, 5, 22), name: 'Dan antifašističke borbe' },
    { date: new Date(year, 7, 5), name: 'Dan pobjede i domovinske zahvalnosti' },
    { date: new Date(year, 7, 15), name: 'Velika Gospa' },
    { date: new Date(year, 10, 1), name: 'Dan svih svetih' },
    { date: new Date(year, 10, 18), name: 'Dan sjećanja na žrtve Domovinskog rata' },
    { date: new Date(year, 11, 25), name: 'Božić' },
    { date: new Date(year, 11, 26), name: 'Sveti Stjepan' },
    // Uskrs i Uskrsni ponedjeljak (movable holidays - approximate)
    ...getEasterDates(year)
  ];
};

// Calculate Easter and related holidays (using simplified calculation)
const getEasterDates = (year: number) => {
  // Simplified Easter calculation (Meeus/Jones/Butcher algorithm)
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  const easter = new Date(year, month, day);
  const easterMonday = new Date(year, month, day + 1);
  const corpusChristi = new Date(year, month, day + 60); // 60 days after Easter
  
  return [
    { date: easter, name: 'Uskrs' },
    { date: easterMonday, name: 'Uskrsni ponedjeljak' },
    { date: corpusChristi, name: 'Tijelovo' }
  ];
};

const isHoliday = (date: Date) => {
  const year = date.getFullYear();
  const holidays = getCroatianHolidays(year);
  
  return holidays.some(holiday => 
    holiday.date.getDate() === date.getDate() &&
    holiday.date.getMonth() === date.getMonth() &&
    holiday.date.getFullYear() === date.getFullYear()
  );
};

const getHolidayName = (date: Date) => {
  const year = date.getFullYear();
  const holidays = getCroatianHolidays(year);
  
  const holiday = holidays.find(h => 
    h.date.getDate() === date.getDate() &&
    h.date.getMonth() === date.getMonth() &&
    h.date.getFullYear() === date.getFullYear()
  );
  
  return holiday?.name;
};

interface Appointment {
  id: number;
  serviceId: number;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  service?: {
    id: number;
    name: string;
    price: number;
    duration: number;
  };
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/login');
      return;
    }

    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/appointments`);
      const data = await response.json();
      // Sortiraj od najskijeg prema najranijem (najprije nadolazeći termini)
      const sortedData = data.sort((a: Appointment, b: Appointment) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) return dateA - dateB; // Prvo po datumu
        // Ako je isti datum, sortiraj po vremenu
        const [hoursA, minutesA] = a.time.split(':').map(Number);
        const [hoursB, minutesB] = b.time.split(':').map(Number);
        return (hoursA * 60 + minutesA) - (hoursB * 60 + minutesB);
      });
      setAppointments(sortedData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: number, status: Appointment['status']) => {
    try {
      await fetch(`${API_URL}/admin/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      fetchAppointments(); // Refresh data
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const deleteAppointment = async (appointmentId: number) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    setAppointmentToDelete(appointment || null);
    setShowDeleteModal(true);
  };

  const rescheduleAppointment = async (appointment: Appointment) => {
    setAppointmentToReschedule(appointment);
    setNewDate(appointment.date.split('T')[0]);
    setNewTime(appointment.time);
    setShowRescheduleModal(true);
    // Fetch available slots for current date
    fetchAvailableSlots(appointment.date.split('T')[0], appointment.serviceId);
  };

  const fetchAvailableSlots = async (date: string, serviceId: number, excludeAppointmentId?: number) => {
    try {
      const url = excludeAppointmentId 
        ? `${API_URL}/availability?date=${date}&serviceId=${serviceId}&excludeAppointmentId=${excludeAppointmentId}`
        : `${API_URL}/availability?date=${date}&serviceId=${serviceId}`;
      const response = await fetch(url);
      const data = await response.json();
      setAvailableSlots(data.availableSlots || []);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots([]);
    }
  };

  const confirmReschedule = async () => {
    if (!appointmentToReschedule || !newDate || !newTime) return;

    try {
      const response = await fetch(`${API_URL}/admin/appointments/${appointmentToReschedule.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          date: newDate,
          time: newTime
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Greška prilikom prebacivanja termina');
        return;
      }

      fetchAppointments();
      setShowRescheduleModal(false);
      setAppointmentToReschedule(null);
      setSelectedAppointment(null);
      alert('Termin uspješno prebačen!');
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      alert('Greška prilikom prebacivanja termina');
    }
  };

  const confirmDeleteAppointment = async () => {
    if (!appointmentToDelete) return;

    try {
      await fetch(`${API_URL}/admin/appointments/${appointmentToDelete.id}`, {
        method: 'DELETE',
      });
      fetchAppointments(); // Refresh data
      setShowDeleteModal(false);
      setAppointmentToDelete(null);
      setSelectedAppointment(null); // Close details modal if open
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments
      .filter(apt => {
        const aptDate = new Date(apt.date);
        return isSameDay(aptDate, date);
      })
      .sort((a, b) => {
        // Sortiraj po vremenu (od najranijeg prema najkasnijem)
        const [hoursA, minutesA] = a.time.split(':').map(Number);
        const [hoursB, minutesB] = b.time.split(':').map(Number);
        return (hoursA * 60 + minutesA) - (hoursB * 60 + minutesB);
      });
  };

  const getAppointmentsForToday = () => {
    const today = new Date();
    return appointments
      .filter(apt => {
        const aptDate = new Date(apt.date);
        return isSameDay(aptDate, today);
      })
      .sort((a, b) => {
        // Sortiraj po vremenu (od najranijeg prema najkasnijem)
        const [hoursA, minutesA] = a.time.split(':').map(Number);
        const [hoursB, minutesB] = b.time.split(':').map(Number);
        return (hoursA * 60 + minutesA) - (hoursB * 60 + minutesB);
      });
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return 'Na čekanju';
      case 'approved': return 'Potvrđen';
      case 'completed': return 'Završen';
      case 'cancelled': return 'Otkazan';
      default: return status;
    }
  };

  const isCurrentOrUpcoming = (appointment: Appointment) => {
    const now = new Date();
    const aptDate = new Date(appointment.date);
    const [hours, minutes] = appointment.time.split(':').map(Number);
    aptDate.setHours(hours, minutes, 0, 0);
    
    const endTime = new Date(aptDate.getTime() + (appointment.service?.duration || 60) * 60000);
    
    // Trenutni termin je onaj koji je u tijeku (između početka i kraja) I potvrđen
    if (now >= aptDate && now <= endTime && appointment.status === 'approved') {
      return 'current';
    }
    
    // Nadolazeći termin - razlikuj pending i approved
    if (now < aptDate) {
      if (appointment.status === 'pending') {
        return 'pending'; // Na čekanju - žuto
      }
      return 'upcoming'; // Potvrđen - zeleno
    }
    
    // Prošli termin
    return 'past';
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayAppointments = getAppointmentsForDate(date);
      const approvedCount = dayAppointments.filter(a => a.status === 'approved' || a.status === 'completed').length;
      const pendingCount = dayAppointments.filter(a => a.status === 'pending').length;
      const holiday = isHoliday(date);
      
      return (
        <div className="flex flex-col items-center justify-start mt-1 h-10">
          <div className="flex items-center gap-1">
            {approvedCount > 0 && (
              <div className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {approvedCount}
              </div>
            )}
            {pendingCount > 0 && (
              <div className="w-5 h-5 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {pendingCount}
              </div>
            )}
            {dayAppointments.length === 0 && <div className="h-5"></div>}
          </div>
          {holiday && (
            <div className="w-2 h-2 bg-red-500 rounded-full mt-1" title={getHolidayName(date)}></div>
          )}
        </div>
      );
    }
    return null;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <style jsx global>{`
        .calendar-container .react-calendar {
          width: 100%;
          max-width: 100%;
          background: white;
          border: 1px solid rgb(229 231 235);
          font-family: inherit;
          border-radius: 0.5rem;
          padding: 1rem;
        }
        .dark .calendar-container .react-calendar {
          background: rgb(31 41 55);
          border: 1px solid rgb(75 85 99);
          color: rgb(243 244 246);
        }
        .calendar-container .react-calendar__navigation {
          background: transparent;
        }
        .dark .calendar-container .react-calendar__navigation button {
          color: rgb(243 244 246);
        }
        .calendar-container .react-calendar__navigation button:enabled:hover,
        .calendar-container .react-calendar__navigation button:enabled:focus {
          background-color: rgb(243 244 246);
        }
        .dark .calendar-container .react-calendar__navigation button:enabled:hover,
        .dark .calendar-container .react-calendar__navigation button:enabled:focus {
          background-color: rgb(55 65 81);
        }
        .calendar-container .react-calendar__month-view__weekdays__weekday {
          color: rgb(107 114 128);
        }
        .dark .calendar-container .react-calendar__month-view__weekdays__weekday {
          color: rgb(156 163 175);
        }
        .calendar-container .react-calendar__tile {
          padding: 0.5em 0.5em;
          position: relative;
          background: white;
          color: rgb(17 24 39);
          height: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }
        .dark .calendar-container .react-calendar__tile {
          background: rgb(31 41 55);
          color: rgb(243 244 246);
        }
        .calendar-container .react-calendar__tile abbr {
          display: block;
          height: 24px;
          line-height: 24px;
        }
        .calendar-container .react-calendar__tile:enabled:hover,
        .calendar-container .react-calendar__tile:enabled:focus {
          background: rgb(243 244 246);
        }
        .dark .calendar-container .react-calendar__tile:enabled:hover,
        .dark .calendar-container .react-calendar__tile:enabled:focus {
          background-color: rgb(55 65 81);
        }
        .calendar-container .react-calendar__tile--active {
          background: #ec4899 !important;
          color: white !important;
        }
        .calendar-container .react-calendar__tile--active:enabled:hover,
        .calendar-container .react-calendar__tile--active:enabled:focus {
          background: #db2777 !important;
        }
        .calendar-container .react-calendar__tile--holiday {
          background: rgba(239, 68, 68, 0.1);
        }
        .dark .calendar-container .react-calendar__tile--holiday {
          background: rgba(239, 68, 68, 0.2);
        }
        .calendar-container .react-calendar__tile--past {
          text-decoration: line-through;
          opacity: 0.5;
        }
        .dark .calendar-container .react-calendar__tile--past {
          text-decoration: line-through;
          opacity: 0.5;
        }
        .calendar-container .react-calendar__tile--other-month {
          color: rgb(156 163 175);
        }
        .dark .calendar-container .react-calendar__tile--other-month {
          color: rgb(107 114 128);
        }
      `}</style>
      <div className="pt-24 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Upravljanje terminima</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Odjavi se
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Kalendar</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={fetchAppointments}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center gap-2"
                    >
                      {loading ? (
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      )}
                      {loading ? 'Osvježavanje...' : 'Osvježi'}
                    </button>
                    {!isToday(selectedDate) && (
                      <button
                        onClick={() => setSelectedDate(new Date())}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        Današnji datum
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="calendar-container">
                    <Calendar
                      key={selectedDate.toISOString()}
                      onChange={(value) => setSelectedDate(value as Date)}
                      value={selectedDate}
                      tileContent={tileContent}
                      tileClassName={({ date }) => {
                        const isCurrentMonth = date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear();
                        const holiday = isHoliday(date);
                        const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
                        let classes = '';
                        if (!isCurrentMonth) classes += 'react-calendar__tile--other-month ';
                        if (holiday) classes += 'react-calendar__tile--holiday ';
                        if (isPastDate) classes += 'react-calendar__tile--past ';
                        return classes.trim();
                      }}
                      className="border rounded shadow"
                    />
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">27</span>
                    </div>
                    <span>Odabrani datum</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <span>Potvrđeni termini</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <span>Na čekanju</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Praznik</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="line-through opacity-50">15</span>
                    <span>Prošli datum</span>
                  </div>
                </div>

                {/* Selected Date Appointments - Two Column Timeline Layout */}
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Termini za {format(selectedDate, 'dd.MM.yyyy')}
                    {isHoliday(selectedDate) && (
                      <span className="ml-2 text-sm text-red-500 dark:text-red-400">
                        ({getHolidayName(selectedDate)})
                      </span>
                    )}
                  </h3>
                  
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Potvrđeni termini
                        </div>
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4 min-h-[100px] animate-pulse">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          Na čekanju
                        </div>
                        <div className="space-y-3">
                          {[1, 2].map((i) => (
                            <div key={i} className="rounded-lg border-2 border-yellow-300 dark:border-yellow-600 p-4 min-h-[100px] animate-pulse bg-yellow-50 dark:bg-yellow-900/20">
                              <div className="h-4 bg-yellow-200 dark:bg-yellow-700 rounded w-1/3 mb-2"></div>
                              <div className="h-3 bg-yellow-200 dark:bg-yellow-700 rounded w-1/2 mb-2"></div>
                              <div className="h-3 bg-yellow-200 dark:bg-yellow-700 rounded w-2/3"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (() => {
                    const allApts = getAppointmentsForDate(selectedDate);
                    const approvedApts = allApts.filter(apt => apt.status === 'approved' || apt.status === 'completed');
                    const pendingApts = allApts.filter(apt => apt.status === 'pending');
                    
                    if (allApts.length === 0) {
                      return (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                          Nema termina za odabrani datum
                        </p>
                      );
                    }
                    
                    // Get unique time slots that have appointments (approved or pending)
                    const occupiedTimeSlots = new Set([
                      ...approvedApts.map(apt => apt.time),
                      ...pendingApts.map(apt => apt.time)
                    ]);
                    
                    const timeSlots = Array.from(occupiedTimeSlots).sort();
                    
                    // Map appointments to time slots
                    const approvedMap = new Map(approvedApts.map(apt => [apt.time, apt]));
                    const pendingMap = new Map(pendingApts.map(apt => [apt.time, apt]));
                    
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left Column - Approved/Confirmed Appointments */}
                        <div>
                          <div className="text-sm font-medium text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Potvrđeni termini
                          </div>
                          <div className="space-y-3">
                            {timeSlots.map((timeSlot) => {
                              const appointment = approvedMap.get(timeSlot);
                              if (!appointment) {
                                return (
                                  <div key={timeSlot} className="min-h-[100px] rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-600 text-xs p-2">
                                    {timeSlot} - Slobodno
                                  </div>
                                );
                              }
                              
                              const timeStatus = isCurrentOrUpcoming(appointment);
                              return (
                                <div
                                  key={appointment.id}
                                  className={`rounded-lg p-3 md:p-4 cursor-pointer transition-all duration-500 ease-in-out min-h-[100px] appointment-slide-in ${
                                    timeStatus === 'current' 
                                      ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500 shadow-lg animate-pulse' 
                                      : timeStatus === 'upcoming'
                                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700'
                                      : 'bg-gray-50 dark:bg-gray-700 opacity-60'
                                  } hover:shadow-md hover:scale-[1.02]`}
                                  onClick={() => setSelectedAppointment(appointment)}
                                >
                                  <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          {timeStatus === 'current' && (
                                            <span className="relative flex h-2 w-2 flex-shrink-0">
                                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                            </span>
                                          )}
                                          <p className={`font-semibold text-sm truncate ${
                                            timeStatus === 'current' 
                                              ? 'text-blue-900 dark:text-blue-100' 
                                              : 'text-gray-900 dark:text-white'
                                          }`}>
                                            {appointment.time}
                                          </p>
                                        </div>
                                        <p className="text-sm font-medium mt-1 truncate">{appointment.customerName}</p>
                                      </div>
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full border whitespace-nowrap ml-2 flex-shrink-0 ${getStatusColor(appointment.status)}`}>
                                        {getStatusText(appointment.status)}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                      {appointment.service?.name} ({appointment.service?.duration} min)
                                    </p>
                                    {timeStatus === 'current' && (
                                      <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                                        🔴 U TIJEKU
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Right Column - Pending Appointments */}
                        <div>
                          <div className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                            Na čekanju ({pendingApts.length})
                          </div>
                          <div className="space-y-3">
                            {timeSlots.map((timeSlot) => {
                              const appointment = pendingMap.get(timeSlot);
                              if (!appointment) {
                                return (
                                  <div key={`pending-${timeSlot}`} className="min-h-[100px] hidden md:block"></div>
                                );
                              }
                              
                              return (
                                <div
                                  key={appointment.id}
                                  className="rounded-lg p-3 md:p-4 cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-105 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 hover:shadow-lg min-h-[100px] appointment-slide-in"
                                  onClick={() => setSelectedAppointment(appointment)}
                                >
                                  <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-yellow-500 text-base flex-shrink-0">⏳</span>
                                          <p className="font-semibold text-sm text-yellow-900 dark:text-yellow-100 truncate">
                                            {appointment.time}
                                          </p>
                                        </div>
                                        <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mt-1 truncate">
                                          {appointment.customerName}
                                        </p>
                                      </div>
                                      <span className={`px-2 py-1 text-xs font-medium rounded-full border whitespace-nowrap ml-2 flex-shrink-0 ${getStatusColor(appointment.status)}`}>
                                        {getStatusText(appointment.status)}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                      {appointment.service?.name} ({appointment.service?.duration} min)
                                    </p>
                                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                      → Čeka potvrdu
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Today's Appointments & Actions */}
            <div className="space-y-6">
              {/* Today's Appointments */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Današnji termini
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {loading ? (
                    <>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4 animate-pulse">
                          <div className="flex justify-between items-start mb-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                          </div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                        </div>
                      ))}
                    </>
                  ) : getAppointmentsForToday().map((appointment) => {
                    const timeStatus = isCurrentOrUpcoming(appointment);
                    return (
                      <div
                        key={appointment.id}
                        className={`rounded-lg p-3 cursor-pointer transition-all ${
                          timeStatus === 'current' 
                            ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500 animate-pulse' 
                            : timeStatus === 'pending'
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-600'
                            : timeStatus === 'upcoming'
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700'
                            : 'bg-gray-50 dark:bg-gray-700 opacity-60'
                        } hover:shadow-md`}
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {timeStatus === 'current' && (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                              )}
                              {timeStatus === 'pending' && (
                                <span className="text-yellow-500 text-xs">⏳</span>
                              )}
                              <p className={`font-medium text-sm ${
                                timeStatus === 'current' 
                                  ? 'text-blue-900 dark:text-blue-100 font-bold' 
                                  : timeStatus === 'pending'
                                  ? 'text-yellow-900 dark:text-yellow-100'
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {appointment.time}
                              </p>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {appointment.customerName}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {!loading && getAppointmentsForToday().length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      Nema termina danas
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Statistika
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Ukupno termina:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{appointments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Na čekanju:</span>
                    <span className="font-semibold text-yellow-600">{appointments.filter(a => a.status === 'pending').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Potvrđeni:</span>
                    <span className="font-semibold text-green-600">{appointments.filter(a => a.status === 'approved').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Završeni:</span>
                    <span className="font-semibold text-blue-600">{appointments.filter(a => a.status === 'completed').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details Modal */}
          {selectedAppointment && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Detalji termina
                    </h3>
                    <button
                      onClick={() => setSelectedAppointment(null)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Klijent</label>
                      <p className="text-gray-900 dark:text-white">{selectedAppointment.customerName}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <p className="text-gray-900 dark:text-white">{selectedAppointment.customerEmail}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefon</label>
                      <p className="text-gray-900 dark:text-white">{selectedAppointment.customerPhone}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Usluga</label>
                      <p className="text-gray-900 dark:text-white">{selectedAppointment.service?.name}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Datum i vrijeme</label>
                      <p className="text-gray-900 dark:text-white">
                        {format(new Date(selectedAppointment.date), 'dd.MM.yyyy')} u {selectedAppointment.time}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Trajanje</label>
                      <p className="text-gray-900 dark:text-white">{selectedAppointment.service?.duration} minuta</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cijena</label>
                      <p className="text-gray-900 dark:text-white">{selectedAppointment.service?.price}€</p>
                    </div>

                    {selectedAppointment.notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Napomena</label>
                        <p className="text-gray-900 dark:text-white">{selectedAppointment.notes}</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedAppointment.status)}`}>
                        {getStatusText(selectedAppointment.status)}
                      </span>
                    </div>

                    {selectedAppointment.status === 'pending' && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Pregled termina u kalendaru
                        </label>
                        <div className="w-full flex justify-center">
                          <div className="calendar-container">
                            <Calendar
                              value={new Date(selectedAppointment.date)}
                              tileClassName={({ date }) => {
                                const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
                                const holiday = isHoliday(date);
                                const isSelectedDate = date.toDateString() === new Date(selectedAppointment.date).toDateString();
                                let classes = '';
                                if (holiday) classes += 'react-calendar__tile--holiday ';
                                if (isPastDate) classes += 'react-calendar__tile--past ';
                                if (isSelectedDate) classes += 'react-calendar__tile--active ';
                                return classes.trim();
                              }}
                              tileContent={({ date, view }) => {
                                if (view === 'month') {
                                  const appts = getAppointmentsForDate(date);
                                  const approvedCount = appts.filter(a => a.status === 'approved' || a.status === 'completed').length;
                                  const pendingCount = appts.filter(a => a.status === 'pending').length;
                                  return (
                                    <div style={{ marginTop: '4px' }}>
                                      {approvedCount > 0 && (
                                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                                          {approvedCount}
                                        </span>
                                      )}
                                      {pendingCount > 0 && (
                                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-yellow-500 rounded-full ml-1">
                                          {pendingCount}
                                        </span>
                                      )}
                                    </div>
                                  );
                                }
                                return null;
                              }}
                              className="border rounded shadow"
                              locale="hr-HR"
                            />
                          </div>
                        </div>
                        
                        {/* Legend */}
                        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 bg-pink-500 rounded flex items-center justify-center">
                              <span className="text-white text-[10px] font-bold">27</span>
                            </div>
                            <span>Ovaj termin</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                              3
                            </div>
                            <span>Potvrđeni</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 bg-yellow-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                              2
                            </div>
                            <span>Na čekanju</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-6">
                    {selectedAppointment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            updateAppointmentStatus(selectedAppointment.id, 'approved');
                            setSelectedAppointment(null);
                          }}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          Potvrdi
                        </button>
                        <button
                          onClick={() => {
                            updateAppointmentStatus(selectedAppointment.id, 'cancelled');
                            setSelectedAppointment(null);
                          }}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          Odbij
                        </button>
                      </>
                    )}

                    {selectedAppointment.status === 'approved' && (
                      <button
                        onClick={() => {
                          updateAppointmentStatus(selectedAppointment.id, 'completed');
                          setSelectedAppointment(null);
                        }}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Označi kao završeno
                      </button>
                    )}

                    {(selectedAppointment.status === 'pending' || selectedAppointment.status === 'approved') && (
                      <button
                        onClick={() => rescheduleAppointment(selectedAppointment)}
                        className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Prebaci termin
                      </button>
                    )}

                    <button
                      onClick={() => {
                        deleteAppointment(selectedAppointment.id);
                        setSelectedAppointment(null);
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Obriši
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showDeleteModal && appointmentToDelete && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Brisanje termina
                      </h3>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Jeste li sigurni da želite obrisati termin za <strong>{appointmentToDelete.customerName}</strong> zakazan za {format(new Date(appointmentToDelete.date), 'dd.MM.yyyy')} u {appointmentToDelete.time}?
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Ova akcija se ne može poništiti.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Odustani
                    </button>
                    <button
                      onClick={confirmDeleteAppointment}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Obriši
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reschedule Modal */}
          {showRescheduleModal && appointmentToReschedule && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Prebaci termin
                    </h3>
                    <button
                      onClick={() => setShowRescheduleModal(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Prebacivanje termina za: <strong>{appointmentToReschedule.customerName}</strong>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Usluga: <strong>{appointmentToReschedule.service?.name}</strong>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Trenutni termin: <strong>{format(new Date(appointmentToReschedule.date), 'dd.MM.yyyy')} u {appointmentToReschedule.time}</strong>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Novi datum
                      </label>
                      <div className="w-full flex justify-center">
                        <div className="calendar-container">
                          <Calendar
                            onChange={(value) => {
                              if (value instanceof Date) {
                                const dateStr = value.toISOString().split('T')[0];
                                setNewDate(dateStr);
                                fetchAvailableSlots(dateStr, appointmentToReschedule.serviceId, appointmentToReschedule.id);
                              }
                            }}
                            value={newDate ? new Date(newDate) : new Date()}
                            minDate={new Date()}
                            tileClassName={({ date }) => {
                              const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
                              const holiday = isHoliday(date);
                              let classes = '';
                              if (holiday) classes += 'react-calendar__tile--holiday ';
                              if (isPastDate) classes += 'react-calendar__tile--past ';
                              return classes.trim();
                            }}
                            tileContent={({ date, view }) => {
                              if (view === 'month') {
                                const appts = getAppointmentsForDate(date);
                                const approvedCount = appts.filter(a => a.status === 'approved' || a.status === 'completed').length;
                                const pendingCount = appts.filter(a => a.status === 'pending').length;
                                return (
                                  <div style={{ marginTop: '4px' }}>
                                    {approvedCount > 0 && (
                                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                                        {approvedCount}
                                      </span>
                                    )}
                                    {pendingCount > 0 && (
                                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-yellow-500 rounded-full ml-1">
                                        {pendingCount}
                                      </span>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            }}
                            className="border rounded shadow"
                            locale="hr-HR"
                          />
                        </div>
                      </div>
                      
                      {/* Legend */}
                      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold">27</span>
                          </div>
                          <span>Odabrani datum</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                            3
                          </div>
                          <span>Potvrđeni termini</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-yellow-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                            2
                          </div>
                          <span>Na čekanju</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Praznik</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="line-through opacity-50">15</span>
                          <span>Prošli datum</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Novo vrijeme
                      </label>
                      {availableSlots.length > 0 ? (
                        <select
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Odaberi vrijeme</option>
                          {availableSlots.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      ) : newDate ? (
                        <p className="text-sm text-red-500">Nema slobodnih termina za odabrani datum</p>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Odaberi datum da vidiš slobodne termine</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowRescheduleModal(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Odustani
                    </button>
                    <button
                      onClick={confirmReschedule}
                      disabled={!newDate || !newTime}
                      className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      Prebaci
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}