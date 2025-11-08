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
      setAppointments(data);
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
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return isSameDay(aptDate, date);
    });
  };

  const getAppointmentsForToday = () => {
    return getAppointmentsForDate(new Date());
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

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayAppointments = getAppointmentsForDate(date);
      const holiday = isHoliday(date);
      
      return (
        <div className="flex flex-col items-center mt-1">
          {dayAppointments.length > 0 && (
            <div className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {dayAppointments.length}
            </div>
          )}
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
          padding: 0.75em 0.5em;
          position: relative;
          background: white;
          color: rgb(17 24 39);
        }
        .dark .calendar-container .react-calendar__tile {
          background: rgb(31 41 55);
          color: rgb(243 244 246);
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
                <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <span>Broj termina</span>
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

                {/* Selected Date Appointments */}
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Termini za {format(selectedDate, 'dd.MM.yyyy')}
                    {isHoliday(selectedDate) && (
                      <span className="ml-2 text-sm text-red-500 dark:text-red-400">
                        ({getHolidayName(selectedDate)})
                      </span>
                    )}
                  </h3>
                  <div className="space-y-3">
                    {getAppointmentsForDate(selectedDate).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {appointment.time} - {appointment.customerName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {appointment.service?.name} ({appointment.service?.duration} min)
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                    {getAppointmentsForDate(selectedDate).length === 0 && (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        Nema termina za odabrani datum
                      </p>
                    )}
                  </div>
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
                  {getAppointmentsForToday().map((appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {appointment.time}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {appointment.customerName}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {getAppointmentsForToday().length === 0 && (
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
        </div>
      </div>
    </div>
  );
}