'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { hr } from 'date-fns/locale';
import Navigation from '@/components/Navigation';

const API_URL = '/api';

const TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
];

interface Table {
  id: number;
  number: number;
  capacity: number;
  x: number;
  y: number;
  shape: string;
}

interface Reservation {
  id: number;
  tableId: number | null;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfGuests: number;
  specialRequests?: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  table?: {
    id: number;
    number: number;
    capacity: number;
  };
}

export default function AdminDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'cancelled' | 'today'>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showTableModal, setShowTableModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [reservedTableIds, setReservedTableIds] = useState<number[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: 'cancel' | 'delete', id: number, name: string } | null>(null);
  const [showNewReservationModal, setShowNewReservationModal] = useState(false);
  const [newReservation, setNewReservation] = useState({
    date: new Date(),
    time: '19:00',
    numberOfGuests: 2,
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    specialRequests: ''
  });
  const [timeAvailability, setTimeAvailability] = useState<Record<string, boolean>>({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [emailError, setEmailError] = useState('');
  const router = useRouter();

  // Capitalize first letter of each word
  const capitalizeName = (value: string) => {
    return value
      .split(' ')
      .map(word => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };

  // Validate email format
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('');
      return true; // Email is optional
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? '' : 'Unesite valjanu email adresu');
    return isValid;
  };

  const formatPhoneNumber = (phone: string) => {
    // Format: +385 92 3456 789
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.startsWith('+385')) {
      const number = cleaned.substring(4);
      return `+385 ${number.substring(0, 2)} ${number.substring(2, 6)} ${number.substring(6)}`;
    }
    return phone;
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/login');
      return;
    }
    fetchReservations();
  }, [router]);

  // Check availability when date or guests change in new reservation modal
  useEffect(() => {
    if (showNewReservationModal && newReservation.date && newReservation.numberOfGuests > 0) {
      checkAvailabilityForAllTimes();
    }
  }, [showNewReservationModal, newReservation.date, newReservation.numberOfGuests]);

  const checkAvailabilityForAllTimes = async () => {
    if (!newReservation.date) return;
    
    setCheckingAvailability(true);
    
    try {
      const response = await fetch(
        `${API_URL}/availability/date?date=${format(newReservation.date, 'yyyy-MM-dd')}&numberOfGuests=${newReservation.numberOfGuests}`
      );
      const data = await response.json();
      
      if (data.success && data.availability) {
        setTimeAvailability(data.availability);
      }
    } catch (error) {
      console.error('Error checking time availability:', error);
      setTimeAvailability({});
    } finally {
      setCheckingAvailability(false);
    }
  };

  const fetchReservations = async () => {
    setLoading(true);
    try {
      console.log('Fetching reservations from API...');
      const response = await fetch(`${API_URL}/reservations`);
      const data = await response.json();
      console.log('Received reservations:', data.length);
      console.log('Sample:', data.slice(0, 3));
      const sortedData = data.sort((a: Reservation, b: Reservation) => {
        const dateA = new Date(a.date + 'T' + a.time).getTime();
        const dateB = new Date(b.date + 'T' + b.time).getTime();
        return dateA - dateB;
      });
      setReservations(sortedData);
      console.log('Set reservations state with', sortedData.length, 'items');
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: Reservation['status']) => {
    try {
      await fetch(`${API_URL}/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchReservations();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const requestCancelReservation = (reservation: Reservation) => {
    setConfirmAction({ type: 'cancel', id: reservation.id, name: reservation.customerName });
    setShowConfirmModal(true);
  };

  const requestDeleteReservation = (reservation: Reservation) => {
    setConfirmAction({ type: 'delete', id: reservation.id, name: reservation.customerName });
    setShowConfirmModal(true);
  };

  const executeConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.type === 'cancel') {
        await fetch(`${API_URL}/reservations/${confirmAction.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'cancelled' }),
        });
      } else if (confirmAction.type === 'delete') {
        await fetch(`${API_URL}/reservations/${confirmAction.id}`, {
          method: 'DELETE',
        });
      }
      fetchReservations();
    } catch (error) {
      console.error('Error executing action:', error);
    } finally {
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };

  const openTableSelection = async (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setSelectedTableId(reservation.tableId);
    setShowTableModal(true);
    await fetchTablesAndReservations(reservation);
  };

  // Trajanje rezervacije u minutama (2 sata)
  const RESERVATION_DURATION = 120;

  // Helper funkcija za pretvaranje vremena u minute
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Helper funkcija za provjeru preklapanja vremena
  const timesOverlap = (time1: string, time2: string, duration: number = RESERVATION_DURATION): boolean => {
    const start1 = timeToMinutes(time1);
    const end1 = start1 + duration;
    const start2 = timeToMinutes(time2);
    const end2 = start2 + duration;
    
    // Provjera preklapanja: vrijeme 1 se preklapa sa vrijeme 2 ako:
    // - start1 je prije end2 I end1 je poslije start2
    return start1 < end2 && end1 > start2;
  };

  const fetchTablesAndReservations = async (reservation: Reservation) => {
    try {
      // Fetch all tables
      const tablesResponse = await fetch(`${API_URL}/tables`);
      const tablesData = await tablesResponse.json();
      setTables(tablesData);

      // Fetch all reservations for the same date
      const reservationsResponse = await fetch(`${API_URL}/reservations?date=${reservation.date}`);
      const reservationsData = await reservationsResponse.json();
      
      // Filtriraj stolove koji su zauzeti u vremenu koje se preklapa
      const reservedIds = reservationsData
        .filter((res: Reservation) => 
          timesOverlap(res.time, reservation.time, RESERVATION_DURATION) && 
          res.id !== reservation.id && 
          res.status !== 'cancelled'
        )
        .map((res: Reservation) => res.tableId)
        .filter((id: number | null) => id !== null);
      setReservedTableIds(reservedIds);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const confirmTableAssignment = async () => {
    if (!selectedReservation || !selectedTableId) return;
    
    setIsConfirming(true);
    try {
      await fetch(`${API_URL}/reservations/${selectedReservation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId: selectedTableId, status: 'approved' }),
      });
      
      // Wait a bit to show the success animation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setShowTableModal(false);
      setSelectedReservation(null);
      setSelectedTableId(null);
      fetchReservations();
    } catch (error) {
      console.error('Error assigning table:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCreateReservation = async () => {
    // Validacija
    if (!newReservation.customerName.trim() || !newReservation.customerPhone.trim()) {
      alert('Molimo unesite ime i telefon gosta');
      return;
    }

    if (newReservation.numberOfGuests < 1) {
      alert('Broj gostiju mora biti najmanje 1');
      return;
    }

    // Validate email if provided
    if (newReservation.customerEmail && !validateEmail(newReservation.customerEmail)) {
      alert('Molimo unesite valjanu email adresu');
      return;
    }

    setIsConfirming(true);
    try {
      // Kreiraj rezervaciju sa statusom 'pending' - admin će odabrati stol nakon
      const response = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: format(newReservation.date, 'yyyy-MM-dd'),
          time: newReservation.time,
          numberOfGuests: newReservation.numberOfGuests,
          customerName: newReservation.customerName,
          customerPhone: newReservation.customerPhone,
          customerEmail: newReservation.customerEmail.trim() || null,
          specialRequests: newReservation.specialRequests.trim() || null,
        }),
      });

      if (response.ok) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setShowNewReservationModal(false);
        // Reset forme
        setNewReservation({
          date: new Date(),
          time: '19:00',
          numberOfGuests: 2,
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          specialRequests: ''
        });
        fetchReservations();
        alert('Rezervacija kreirana! Dodjelite stol u listi rezervacija.');
      } else {
        const error = await response.json();
        alert(error.error || 'Greška pri kreiranju rezervacije');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Greška pri kreiranju rezervacije');
    } finally {
      setIsConfirming(false);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/');
  };

  // Get reservations filtered ONLY by date (for card counts)
  const getDateFilteredReservations = () => {
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    return reservations.filter(r => r.date.startsWith(selectedDateStr));
  };

  const getFilteredReservations = () => {
    const today = new Date().toISOString().split('T')[0];
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    
    console.log('=== FILTERING RESERVATIONS ===');
    console.log('Total reservations:', reservations.length);
    console.log('Selected date:', selectedDateStr);
    console.log('Filter:', filter);
    console.log('First 3 reservation dates from API:', reservations.slice(0, 3).map(r => ({ date: r.date, type: typeof r.date, customerName: r.customerName })));
    
    let filtered = reservations;
    
    // Filter by selected date FIRST
    filtered = filtered.filter(r => {
      const dateStr = typeof r.date === 'string' ? r.date : (r.date as any).toISOString?.() || r.date;
      const matches = String(dateStr).startsWith(selectedDateStr);
      if (matches) {
        console.log('✓ Match found:', r.customerName, dateStr);
      }
      return matches;
    });
    console.log('After date filter:', filtered.length);
    
    // Then filter by status
    switch (filter) {
      case 'pending':
        filtered = filtered.filter(r => r.status === 'pending');
        break;
      case 'approved':
        filtered = filtered.filter(r => r.status === 'approved');
        break;
      case 'cancelled':
        filtered = filtered.filter(r => r.status === 'cancelled');
        break;
      case 'today':
        filtered = reservations.filter(r => String(r.date).startsWith(today));
        break;
      case 'all':
      default:
        // Already filtered by date
        break;
    }
    
    console.log('After status filter:', filtered.length);
    return filtered;
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/50';
    }
  };

  const getStatusText = (status: Reservation['status']) => {
    switch (status) {
      case 'pending': return 'Na čekanju';
      case 'approved': return 'Potvrđeno';
      case 'completed': return 'Završeno';
      case 'cancelled': return 'Otkazano';
    }
  };

  const filteredReservations = getFilteredReservations();
  const pendingCount = reservations.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />
      
      <div className="pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold text-[#D4AF37] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Admin Panel
              </h1>
              <p className="text-gray-400">Upravljanje rezervacijama</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-[#1A1A1A] text-gray-400 hover:text-white border border-[#333] hover:border-[#D4AF37] rounded-lg transition-all uppercase tracking-wider text-sm"
            >
              Odjava
            </button>
          </motion.div>

          {/* Calendar with Reservation Counts */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-lg p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#D4AF37]">Odaberi datum</h2>
              {format(selectedDate, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd') && (
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C4A137] text-black font-semibold rounded-lg transition-all text-sm"
                >
                  Vrati se na danas
                </button>
              )}
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="shrink-0">
                <style jsx global>{`
                  .admin-calendar .react-datepicker {
                    background: #1A1A1A;
                    border: 1px solid #333;
                    border-radius: 12px;
                    font-family: inherit;
                    padding: 8px;
                  }
                  .admin-calendar .react-datepicker__header {
                    background: #0A0A0A;
                    border-bottom: 1px solid #333;
                    border-radius: 12px 12px 0 0;
                    padding-top: 16px;
                    padding-bottom: 12px;
                  }
                  .admin-calendar .react-datepicker__current-month {
                    color: #D4AF37;
                    font-weight: 600;
                    font-size: 1.125rem;
                    margin-bottom: 12px;
                  }
                  .admin-calendar .react-datepicker__day-names {
                    margin-bottom: 8px;
                  }
                  .admin-calendar .react-datepicker__day-name {
                    color: #888;
                    font-size: 1rem;
                    width: 3.25rem;
                    line-height: 3.25rem;
                    margin: 0.25rem;
                    font-weight: 500;
                  }
                  .admin-calendar .react-datepicker__day {
                    color: #999;
                    border-radius: 10px;
                    transition: all 0.2s;
                    width: 3.25rem;
                    height: 3.25rem;
                    line-height: 3.25rem;
                    margin: 0.25rem;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                  }
                  .admin-calendar .react-datepicker__day:hover {
                    background: #2A2A2A;
                    color: #fff;
                    transform: scale(1.05);
                  }
                  .admin-calendar .react-datepicker__day--selected {
                    background: #D4AF37 !important;
                    color: #000 !important;
                    font-weight: 700;
                    transform: scale(1.1);
                  }
                  .admin-calendar .react-datepicker__day--today {
                    border: 2px solid #D4AF37;
                    color: #D4AF37;
                    font-weight: 600;
                  }
                  .admin-calendar .react-datepicker__day--disabled {
                    color: #444;
                    cursor: not-allowed;
                  }
                  .admin-calendar .react-datepicker__navigation {
                    top: 16px;
                    width: 2.5rem;
                    height: 2.5rem;
                  }
                  .admin-calendar .react-datepicker__navigation-icon::before {
                    border-color: #D4AF37;
                    border-width: 2px 2px 0 0;
                    width: 10px;
                    height: 10px;
                  }
                  .admin-calendar .react-datepicker__day-has-reservations {
                    position: relative;
                  }
                  .admin-calendar .react-datepicker__day-has-reservations::after {
                    content: attr(data-count);
                    position: absolute;
                    bottom: 3px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #D4AF37;
                    color: #000;
                    font-size: 0.7rem;
                    font-weight: 700;
                    padding: 2px 5px;
                    border-radius: 5px;
                    min-width: 18px;
                    text-align: center;
                  }
                `}</style>
                <div className="admin-calendar">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => date && setSelectedDate(date)}
                    inline
                    locale={hr}
                    dayClassName={(date) => {
                      const dateStr = format(date, 'yyyy-MM-dd');
                      const dayReservations = reservations.filter(r => r.date.startsWith(dateStr));
                      return dayReservations.length > 0 ? 'react-datepicker__day-has-reservations' : '';
                    }}
                    renderDayContents={(day, date) => {
                      if (!date) return day;
                      const dateStr = format(date, 'yyyy-MM-dd');
                      const dayReservations = reservations.filter(r => r.date.startsWith(dateStr));
                      return (
                        <span data-count={dayReservations.length || ''}>
                          {day}
                        </span>
                      );
                    }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 h-full flex flex-col">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {format(selectedDate, 'd. MMMM yyyy.', { locale: hr })}
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                    {/* Nova Rezervacija Karton */}
                    <motion.button
                      onClick={() => {
                        const dateStr = format(selectedDate, 'yyyy-MM-dd');
                        router.push(`/admin/new-reservation?date=${dateStr}`);
                      }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-linear-to-br from-[#D4AF37] to-[#C4A137] hover:from-[#E8D89F] hover:to-[#D4AF37] rounded-xl p-6 border-2 border-[#D4AF37] transition-all shadow-lg hover:shadow-[#D4AF37]/30 group"
                    >
                      <div className="flex flex-col items-center justify-center h-full gap-3">
                        <svg className="w-14 h-14 text-black group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <div className="text-sm font-bold text-black uppercase tracking-wider">Nova Rezervacija</div>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setFilter('all')}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`rounded-xl p-5 border-2 transition-all text-left shadow-lg relative overflow-hidden group ${
                        filter === 'all' 
                          ? 'bg-linear-to-br from-[#1A1A1A] to-[#0A0A0A] border-[#D4AF37] shadow-[#D4AF37]/30' 
                          : 'bg-[#0A0A0A] border-[#333] hover:border-[#D4AF37] hover:shadow-[#D4AF37]/20'
                      }`}
                    >
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <div className="text-3xl font-bold text-[#D4AF37]">
                            {getDateFilteredReservations().length}
                          </div>
                        </div>
                        <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Ukupno rezervacija</div>
                      </div>
                      {filter === 'all' && (
                        <motion.div 
                          layoutId="activeFilter"
                          className="absolute inset-0 bg-[#D4AF37]/5 rounded-xl"
                        />
                      )}
                    </motion.button>
                    
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="rounded-xl p-5 border-2 border-[#333] bg-linear-to-br from-[#1A1A1A] to-[#0A0A0A] shadow-lg hover:shadow-blue-400/20 relative overflow-hidden group transition-all cursor-default flex flex-col justify-center"
                    >
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <div className="text-3xl font-bold text-blue-400">
                            {getDateFilteredReservations().filter(r => r.status === 'approved').reduce((sum, r) => sum + r.numberOfGuests, 0)}
                          </div>
                        </div>
                        <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Ukupno gostiju</div>
                      </div>
                    </motion.div>
                    
                    <motion.button
                      onClick={() => setFilter('approved')}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`rounded-xl p-5 border-2 transition-all text-left shadow-lg relative overflow-hidden group ${
                        filter === 'approved' 
                          ? 'bg-linear-to-br from-[#1A1A1A] to-[#0A0A0A] border-green-400 shadow-green-400/30' 
                          : 'bg-[#0A0A0A] border-[#333] hover:border-green-400 hover:shadow-green-400/20'
                      }`}
                    >
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-3xl font-bold text-green-400">
                            {getDateFilteredReservations().filter(r => r.status === 'approved').length}
                          </div>
                        </div>
                        <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Potvrđeno</div>
                      </div>
                      {filter === 'approved' && (
                        <motion.div 
                          layoutId="activeFilter"
                          className="absolute inset-0 bg-green-400/5 rounded-xl"
                        />
                      )}
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setFilter('pending')}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`rounded-xl p-5 border-2 transition-all text-left shadow-lg relative overflow-hidden group ${
                        filter === 'pending' 
                          ? 'bg-linear-to-br from-[#1A1A1A] to-[#0A0A0A] border-orange-500 shadow-orange-500/30' 
                          : 'bg-[#0A0A0A] border-[#333] hover:border-orange-500 hover:shadow-orange-500/20'
                      }`}
                    >
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-3xl font-bold text-orange-500">
                            {getDateFilteredReservations().filter(r => r.status === 'pending').length}
                          </div>
                        </div>
                        <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Na čekanju</div>
                      </div>
                      {filter === 'pending' && (
                        <motion.div 
                          layoutId="activeFilter"
                          className="absolute inset-0 bg-orange-500/5 rounded-xl"
                        />
                      )}
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setFilter('cancelled')}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`rounded-xl p-5 border-2 transition-all text-left shadow-lg relative overflow-hidden group ${
                        filter === 'cancelled' 
                          ? 'bg-linear-to-br from-[#1A1A1A] to-[#0A0A0A] border-red-500 shadow-red-500/30' 
                          : 'bg-[#0A0A0A] border-[#333] hover:border-red-500 hover:shadow-red-500/20'
                      }`}
                    >
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-3xl font-bold text-red-500">
                            {getDateFilteredReservations().filter(r => r.status === 'cancelled').length}
                          </div>
                        </div>
                        <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Otkazano</div>
                      </div>
                      {filter === 'cancelled' && (
                        <motion.div 
                          layoutId="activeFilter"
                          className="absolute inset-0 bg-red-500/5 rounded-xl"
                        />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reservations List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#D4AF37] border-r-transparent"></div>
            </div>
          ) : filteredReservations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-lg p-12 text-center"
            >
              <p className="text-gray-400 text-lg">Nema rezervacija</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredReservations.map((reservation, index) => (
                <motion.div
                  key={reservation.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-lg p-6 hover:border-[#D4AF37] transition-all"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    {/* Info */}
                    <div className="flex-1 min-w-[250px]">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-white">{reservation.customerName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusColor(reservation.status)}`}>
                          {getStatusText(reservation.status)}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <span className="text-[#D4AF37]">📅</span>
                          <span>{new Date(reservation.date).toLocaleDateString('hr-HR')} u {reservation.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#D4AF37]">👥</span>
                          <span>{reservation.numberOfGuests} {reservation.numberOfGuests === 1 ? 'osoba' : reservation.numberOfGuests <= 4 ? 'osobe' : 'osoba'}</span>
                        </div>
                        {reservation.table ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[#D4AF37]">🪑</span>
                            <span>Stol #{reservation.table.number}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400">⚠️</span>
                            <span className="text-yellow-400 text-xs">Stol nije dodijeljen</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-[#D4AF37]">📧</span>
                          <span>{reservation.customerEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#D4AF37]">📱</span>
                          <span>{formatPhoneNumber(reservation.customerPhone)}</span>
                          <a 
                            href={`tel:${reservation.customerPhone}`}
                            className="ml-2 px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30 rounded text-xs font-semibold uppercase tracking-wider transition-all"
                          >
                            Pozovi
                          </a>
                        </div>
                        {reservation.specialRequests && (
                          <div className="flex items-start gap-2 mt-2 pt-2 border-t border-[#333]">
                            <span className="text-[#D4AF37]">💬</span>
                            <span className="italic">{reservation.specialRequests}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[120px]">
                      {reservation.status === 'pending' && (
                        <>
                          {!reservation.tableId ? (
                            <button
                              onClick={() => openTableSelection(reservation)}
                              className="px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#D4AF37]/30 rounded-lg transition-all text-sm font-semibold uppercase tracking-wider"
                            >
                              Potvrdi rezervaciju
                            </button>
                          ) : (
                            <button
                              onClick={() => updateStatus(reservation.id, 'approved')}
                              className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30 rounded-lg transition-all text-sm font-semibold uppercase tracking-wider"
                            >
                              Potvrdi
                            </button>
                          )}
                        </>
                      )}
                      {reservation.status === 'approved' && (
                        <button
                          onClick={() => updateStatus(reservation.id, 'completed')}
                          className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30 rounded-lg transition-all text-sm font-semibold uppercase tracking-wider"
                        >
                          Završi
                        </button>
                      )}
                      {reservation.status === 'cancelled' && (
                        <>
                          <button
                            onClick={() => openTableSelection(reservation)}
                            className="px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#D4AF37]/30 rounded-lg transition-all text-sm font-semibold uppercase tracking-wider"
                          >
                            Reaktiviraj
                          </button>
                        </>
                      )}
                      {(reservation.status === 'pending' || reservation.status === 'approved') && (
                        <button
                          onClick={() => requestCancelReservation(reservation)}
                          className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 rounded-lg transition-all text-sm font-semibold uppercase tracking-wider"
                        >
                          Otkaži
                        </button>
                      )}
                      <button
                        onClick={() => requestDeleteReservation(reservation)}
                        className="px-4 py-2 bg-[#1A1A1A] text-gray-400 border border-[#333] hover:border-red-500 hover:text-red-400 rounded-lg transition-all text-sm font-semibold uppercase tracking-wider"
                      >
                        Obriši
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Selection Modal */}
      {showTableModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Loading Overlay */}
          {isConfirming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md z-10 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#1A1A1A] border-2 border-[#D4AF37] rounded-2xl p-8 flex flex-col items-center gap-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full"
                />
                <div className="text-center">
                  <p className="text-[#D4AF37] font-bold text-xl mb-1">Potvrđujem rezervaciju...</p>
                  <p className="text-gray-400 text-sm">Spremam podatke u bazu</p>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8 }}
                  className="h-1 bg-[#D4AF37] rounded-full"
                  style={{ maxWidth: '200px' }}
                />
              </motion.div>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1A1A1A] rounded-lg border border-[#333] w-full max-w-6xl max-h-[95vh] overflow-y-auto relative"
          >
            <div className="p-4 sm:p-6 border-b border-[#333] sticky top-0 bg-[#1A1A1A] z-10">
              <div className="flex items-start justify-between mb-3 sm:mb-4 gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#D4AF37] mb-1 sm:mb-2 truncate" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Odaberite Stol
                  </h2>
                  <p className="text-gray-400 text-xs sm:text-sm truncate">
                    {selectedReservation.customerName} • {new Date(selectedReservation.date).toLocaleDateString('hr-HR')} u {selectedReservation.time} • {selectedReservation.numberOfGuests} {selectedReservation.numberOfGuests === 1 ? 'osoba' : selectedReservation.numberOfGuests <= 4 ? 'osobe' : 'osoba'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowTableModal(false);
                    setSelectedReservation(null);
                    setSelectedTableId(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors shrink-0"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {selectedTableId && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 bg-[#0A0A0A] border border-[#D4AF37] rounded-lg p-2.5 sm:p-3">
                    <p className="text-[#D4AF37] font-semibold text-sm sm:text-base">
                      Odabran stol: #{tables.find(t => t.id === selectedTableId)?.number} ({tables.find(t => t.id === selectedTableId)?.capacity} osoba)
                    </p>
                  </div>
                  <button
                    onClick={confirmTableAssignment}
                    disabled={isConfirming}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#D4AF37] hover:bg-[#C4A137] text-black font-bold rounded-lg transition-all uppercase tracking-wider text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden"
                  >
                    {isConfirming ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                        />
                        <span>Spremam...</span>
                        <motion.div
                          initial={{ x: '-100%' }}
                          animate={{ x: '200%' }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                        />
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Potvrdi Rezervaciju</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="p-3 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                {/* Visual Table Plan */}
                <div className="flex-1 bg-[#0A0A0A] rounded-lg p-3 sm:p-4 relative overflow-hidden">
                  <style jsx>{`
                    .table-hover rect,
                    .table-hover circle {
                      transition: stroke 0.2s ease;
                    }
                    .table-hover:hover rect,
                    .table-hover:hover circle {
                      stroke: #22c55e !important;
                    }
                  `}</style>
                  <div className="w-full" style={{ aspectRatio: '4/3' }}>
                    <svg viewBox="0 0 800 600" className="w-full h-full">
                      <rect x="20" y="20" width="760" height="560" fill="#0A0A0A" stroke="#333" strokeWidth="2" rx="8"/>
                      <text x="400" y="60" textAnchor="middle" fill="#D4AF37" fontSize="20" fontWeight="bold">
                        Plan Restorana
                      </text>

                      {tables.map((table) => {
                        const isReserved = reservedTableIds.includes(table.id);
                        const isAvailable = !isReserved && table.capacity >= selectedReservation.numberOfGuests;
                        const isSelected = selectedTableId === table.id;
                        const isRound = table.shape === 'round';
                        
                        return (
                          <g
                            key={table.id}
                            onClick={() => isAvailable && setSelectedTableId(table.id)}
                            style={{ cursor: isAvailable ? 'pointer' : 'not-allowed' }}
                            className={isAvailable ? 'table-hover' : ''}
                          >
                            {isRound ? (
                              <circle
                                cx={table.x}
                                cy={table.y}
                                r="38"
                                fill={isSelected ? '#D4AF37' : isAvailable ? '#1A1A1A' : '#0A0A0A'}
                                stroke={isSelected ? '#FFF' : isAvailable ? '#D4AF37' : '#555'}
                                strokeWidth={isSelected ? 3.5 : 2.5}
                                opacity={isAvailable ? 1 : 0.4}
                              />
                            ) : (
                              <rect
                                x={table.x - 44}
                                y={table.y - 34}
                                width="88"
                                height="68"
                                rx="5"
                                fill={isSelected ? '#D4AF37' : isAvailable ? '#1A1A1A' : '#0A0A0A'}
                                stroke={isSelected ? '#FFF' : isAvailable ? '#D4AF37' : '#555'}
                                strokeWidth={isSelected ? 3.5 : 2.5}
                                opacity={isAvailable ? 1 : 0.4}
                              />
                            )}
                            <text
                              x={table.x}
                              y={table.y - 3}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fill={isSelected ? '#000' : isAvailable ? '#D4AF37' : '#555'}
                              fontSize="18"
                              fontWeight="bold"
                            >
                              {table.number}
                            </text>
                            <text
                              x={table.x}
                              y={table.y + 16}
                              textAnchor="middle"
                              fill={isSelected ? '#000' : isAvailable ? '#FFF' : '#555'}
                              fontSize="12"
                              fontWeight="500"
                            >
                              {table.capacity} {table.capacity === 1 ? 'osoba' : table.capacity <= 4 ? 'osobe' : 'osoba'}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Legend - Sidebar */}
                <div className="lg:w-56 bg-[#0A0A0A] rounded-lg p-4 border border-[#333]">
                  <h3 className="text-[#D4AF37] font-bold text-base sm:text-lg mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Legenda
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#1A1A1A] border-2.5 border-[#D4AF37] rounded shrink-0 flex items-center justify-center">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="9" stroke="#D4AF37" strokeWidth="2"/>
                          <path d="M9 12l2 2 4-4" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">Dostupno</p>
                        <p className="text-gray-400 text-xs">Može se odabrati</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#D4AF37] border-2.5 border-white rounded shrink-0 flex items-center justify-center">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                          <rect x="4" y="4" width="16" height="16" rx="2" fill="#000" stroke="#000" strokeWidth="2"/>
                          <path d="M8 12h8" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">Odabrano</p>
                        <p className="text-gray-400 text-xs">Trenutno odabran</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#0A0A0A] border-2.5 border-[#555] rounded shrink-0 opacity-40 flex items-center justify-center">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="9" stroke="#555" strokeWidth="2"/>
                          <path d="M15 9l-6 6M9 9l6 6" stroke="#555" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-300 font-semibold text-sm">Zauzeto / Premalo</p>
                        <p className="text-gray-500 text-xs">Nije dostupno</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-[#333]">
                    <div className="text-xs text-gray-400 space-y-2">
                      <p className="flex items-center gap-2">
                        <span className="text-[#D4AF37]">●</span>
                        <span>Kliknite na dostupan stol</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-[#22c55e]">●</span>
                        <span>Zeleni rub pri hover</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1A1A1A] rounded-lg border-2 border-red-500 max-w-md w-full p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-500">Potvrda akcije</h3>
                <p className="text-gray-400 text-sm">Ova akcija ne može se poništiti</p>
              </div>
            </div>

            <div className="bg-[#0A0A0A] rounded-lg p-4 mb-6 border border-[#333]">
              <p className="text-white mb-2">
                {confirmAction.type === 'cancel' ? 'Otkazati' : 'Obrisati'} rezervaciju za:
              </p>
              <p className="text-[#D4AF37] font-semibold text-lg">{confirmAction.name}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                }}
                className="flex-1 px-4 py-3 bg-[#333] text-white hover:bg-[#444] rounded-lg transition-all font-semibold"
              >
                Odustani
              </button>
              <button
                onClick={executeConfirmAction}
                className="flex-1 px-4 py-3 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-all font-semibold"
              >
                {confirmAction.type === 'cancel' ? 'Otkaži rezervaciju' : 'Obriši'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Nova Rezervacija Modal */}
      {showNewReservationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1A1A1A] rounded-lg border border-[#D4AF37] max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Nova Rezervacija
                </h2>
                <p className="text-gray-400 text-sm">Ručno kreiranje rezervacije za goste koji zovu ili dolaze</p>
              </div>
              <button
                onClick={() => setShowNewReservationModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Ime i prezime */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Ime i prezime <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newReservation.customerName}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only letters (including Croatian), spaces, and hyphens
                    const filtered = value.replace(/[^a-zA-Z\u010d\u0107\u017e\u0161\u0111\u010c\u0106\u017d\u0160\u0110\s-]/g, '');
                    const capitalized = capitalizeName(filtered);
                    setNewReservation({...newReservation, customerName: capitalized});
                  }}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                  placeholder="Marko Horvat"
                />
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Telefon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={newReservation.customerPhone}
                  onChange={(e) => {
                    // Allow only numbers, +, and spaces
                    const filtered = e.target.value.replace(/[^0-9+\s]/g, '');
                    setNewReservation({...newReservation, customerPhone: filtered});
                  }}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                  placeholder="+385 91 234 5678"
                />
              </div>

              {/* Email (opciono) */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email (opciono)
                </label>
                <input
                  type="email"
                  value={newReservation.customerEmail}
                  onChange={(e) => {
                    const email = e.target.value;
                    setNewReservation({...newReservation, customerEmail: email});
                    validateEmail(email);
                  }}
                  className={`w-full px-4 py-3 bg-[#0A0A0A] border ${
                    emailError ? 'border-red-500' : 'border-[#333]'
                  } rounded-lg text-white focus:border-[#D4AF37] focus:outline-none`}
                  placeholder="marko@example.com"
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              {/* Datum */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Datum <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={newReservation.date}
                  onChange={(date: Date | null) => date && setNewReservation({...newReservation, date})}
                  minDate={new Date()}
                  dateFormat="dd.MM.yyyy"
                  locale={hr}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Vrijeme */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Vrijeme <span className="text-red-500">*</span>
                </label>
                {checkingAvailability ? (
                  <div className="text-center py-8">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-[#D4AF37] border-r-transparent"></div>
                    <p className="text-gray-400 text-sm mt-2">Provjeravam dostupnost...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-2">
                    {TIME_SLOTS.map((time) => {
                      const isAvailable = timeAvailability[time] !== false;
                      const isDisabled = !isAvailable;
                      
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => !isDisabled && setNewReservation({...newReservation, time})}
                          disabled={isDisabled}
                          className={`py-3 px-2 text-sm font-semibold rounded-lg transition-all relative ${
                            newReservation.time === time
                              ? 'bg-[#D4AF37] text-black scale-105'
                              : isDisabled
                              ? 'bg-[#1A1A1A]/50 text-gray-600 cursor-not-allowed border border-[#333]/50'
                              : 'bg-[#0A0A0A] text-gray-300 hover:bg-[#333] hover:text-white border border-[#333] hover:border-[#D4AF37]'
                          }`}
                        >
                          {time}
                          {isDisabled && (
                            <span className="absolute top-1 right-1 text-red-500 text-xs">✕</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Broj gostiju */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Broj gostiju <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setNewReservation({...newReservation, numberOfGuests: Math.max(1, newReservation.numberOfGuests - 1)})}
                    className="w-12 h-12 bg-[#0A0A0A] border border-[#333] hover:border-[#D4AF37] rounded-lg text-white font-bold text-xl transition-all"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold text-[#D4AF37] min-w-12 text-center">
                    {newReservation.numberOfGuests}
                  </span>
                  <button
                    onClick={() => setNewReservation({...newReservation, numberOfGuests: newReservation.numberOfGuests + 1})}
                    className="w-12 h-12 bg-[#0A0A0A] border border-[#333] hover:border-[#D4AF37] rounded-lg text-white font-bold text-xl transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Posebni zahtjevi */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Posebni zahtjevi (opciono)
                </label>
                <textarea
                  value={newReservation.specialRequests}
                  onChange={(e) => setNewReservation({...newReservation, specialRequests: e.target.value})}
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] rounded-lg text-white focus:border-[#D4AF37] focus:outline-none resize-none"
                  rows={3}
                  placeholder="Alergije, proslave, posebni zahtjevi..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewReservationModal(false)}
                disabled={isConfirming}
                className="flex-1 px-6 py-3 bg-[#333] text-white hover:bg-[#444] rounded-lg transition-all font-semibold uppercase tracking-wider disabled:opacity-50"
              >
                Odustani
              </button>
              <button
                onClick={handleCreateReservation}
                disabled={isConfirming}
                className="flex-1 px-6 py-3 bg-[#D4AF37] hover:bg-[#C4A137] text-black rounded-lg transition-all font-bold uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isConfirming ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                    />
                    <span>Spremam...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Kreiraj Rezervaciju</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
