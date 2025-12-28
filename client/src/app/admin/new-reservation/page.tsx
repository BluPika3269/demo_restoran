'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { hr } from 'date-fns/locale';
import useSWR from 'swr';
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

export default function NewReservationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  
  const [selectedDate, setSelectedDate] = useState<Date>(dateParam ? new Date(dateParam) : new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [timeAvailability, setTimeAvailability] = useState<Record<string, boolean>>({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [dateAvailability, setDateAvailability] = useState<Record<string, { available: number, total: number }>>({});
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTableIds, setSelectedTableIds] = useState<number[]>([]);
  const [reservedTableIds, setReservedTableIds] = useState<number[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  // SWR fetcher function
  const fetcher = (url: string) => fetch(url).then(res => res.json());

  // Use SWR for automatic caching and revalidation
  const { data: batchData } = useSWR(
    numberOfGuests > 0 ? `${API_URL}/availability/batch?numberOfGuests=${numberOfGuests}&days=60` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 60 seconds
    }
  );

  // Update dateAvailability when batch data arrives
  useEffect(() => {
    if (batchData?.success && batchData?.availability) {
      setDateAvailability(batchData.availability);
    }
  }, [batchData]);

  useEffect(() => {
    if (selectedDate && numberOfGuests > 0) {
      checkAvailabilityForAllTimes();
    }
  }, [selectedDate, numberOfGuests]);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      fetchTablesAndReservations();
    }
  }, [selectedDate, selectedTime, numberOfGuests]);

  const checkAvailabilityForAllTimes = async () => {
    if (!selectedDate) return;
    
    setCheckingAvailability(true);
    
    try {
      const response = await fetch(
        `${API_URL}/availability/date?date=${format(selectedDate, 'yyyy-MM-dd')}&numberOfGuests=${numberOfGuests}`
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

  const RESERVATION_DURATION = 120;

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const timesOverlap = (time1: string, time2: string, duration: number = RESERVATION_DURATION): boolean => {
    const start1 = timeToMinutes(time1);
    const end1 = start1 + duration;
    const start2 = timeToMinutes(time2);
    const end2 = start2 + duration;
    return start1 < end2 && end1 > start2;
  };

  const fetchTablesAndReservations = async () => {
    try {
      const tablesResponse = await fetch(`${API_URL}/tables`);
      const tablesData = await tablesResponse.json();
      setTables(tablesData);

      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const reservationsResponse = await fetch(`${API_URL}/reservations?date=${dateStr}`);
      const reservationsData = await reservationsResponse.json();
      
      const reservedIds = reservationsData
        .filter((res: any) => 
          timesOverlap(res.time, selectedTime, RESERVATION_DURATION) && 
          res.status !== 'cancelled'
        )
        .map((res: any) => res.tableId)
        .filter((id: number | null) => id !== null);
      setReservedTableIds(reservedIds);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const toggleTableSelection = (tableId: number) => {
    setSelectedTableIds(prev => {
      if (prev.includes(tableId)) {
        // Uvijek dopusti uklanjanje stola
        return prev.filter(id => id !== tableId);
      } else {
        // Provjeri da li je trenutni kapacitet već dovoljan
        const currentCapacity = prev.reduce((sum, id) => {
          const table = tables.find(t => t.id === id);
          return sum + (table?.capacity || 0);
        }, 0);
        
        // Ako je trenutni kapacitet već >= numberOfGuests, ne dopusti dodavanje još stolova
        if (currentCapacity >= numberOfGuests) {
          return prev; // Ne dodaj novi stol
        }
        
        return [...prev, tableId];
      }
    });
  };

  const getTotalCapacity = () => {
    return selectedTableIds.reduce((sum, id) => {
      const table = tables.find(t => t.id === id);
      return sum + (table?.capacity || 0);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Molimo unesite ime i telefon gosta');
      return;
    }

    if (selectedTableIds.length === 0) {
      alert('Molimo odaberite najmanje jedan stol');
      return;
    }

    const totalCapacity = getTotalCapacity();
    if (totalCapacity < numberOfGuests) {
      alert(`Ukupan kapacitet odabranih stolova (${totalCapacity}) je manji od broja gostiju (${numberOfGuests})`);
      return;
    }

    setIsConfirming(true);
    try {
      // Kreiraj rezervaciju za svaki odabrani stol
      const reservationPromises = selectedTableIds.map(tableId => 
        fetch(`${API_URL}/reservations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: format(selectedDate, 'yyyy-MM-dd'),
            time: selectedTime,
            numberOfGuests,
            customerName,
            customerPhone,
            customerEmail: customerEmail || undefined,
            specialRequests: specialRequests || undefined,
            tableId,
            status: 'approved'
          }),
        })
      );

      const responses = await Promise.all(reservationPromises);
      const allSuccessful = responses.every(res => res.ok);

      if (allSuccessful) {
        await new Promise(resolve => setTimeout(resolve, 800));
        router.push('/admin/dashboard');
      } else {
        const error = await responses[0].json();
        alert(error.error || 'Greška pri kreiranju rezervacije');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Greška pri kreiranju rezervacije');
    } finally {
      setIsConfirming(false);
    }
  };

  const dayClassName = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const availability = dateAvailability[dateStr];
    
    if (availability) {
      if (availability.available === 0) {
        return 'react-datepicker__day--no-availability';
      } else if (availability.available > 0) {
        return 'react-datepicker__day--has-availability';
      }
    }
    return '';
  };

  const filterDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const availability = dateAvailability[dateStr];
    return !availability || availability.available > 0;
  };

  const handleCancel = () => {
    router.push(`/admin/dashboard?date=${format(selectedDate, 'yyyy-MM-dd')}`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />
      
      <style jsx global>{`
        .react-datepicker {
          background-color: #1A1A1A !important;
          border: 1px solid #333 !important;
          border-radius: 0.5rem !important;
          font-family: inherit !important;
          font-size: 1rem !important;
        }
        .react-datepicker__header {
          background-color: #0A0A0A !important;
          border-bottom: 1px solid #333 !important;
          padding-top: 1.5rem !important;
          padding-bottom: 0.75rem !important;
        }
        .react-datepicker__current-month {
          color: #D4AF37 !important;
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          margin-bottom: 0.75rem !important;
        }
        .react-datepicker__day-name {
          color: #D4AF37 !important;
          width: 3rem !important;
          line-height: 3rem !important;
          font-size: 0.95rem !important;
          font-weight: 500 !important;
        }
        .react-datepicker__day {
          color: #FFF !important;
          width: 3rem !important;
          line-height: 3rem !important;
          margin: 0.25rem !important;
          font-size: 1rem !important;
          border-radius: 0.5rem !important;
        }
        .react-datepicker__day:hover {
          background-color: #D4AF37 !important;
          color: #000 !important;
        }
        .react-datepicker__day--selected {
          background-color: #D4AF37 !important;
          color: #000 !important;
          font-weight: 600 !important;
        }
        .react-datepicker__day--disabled {
          color: #555 !important;
        }
        .react-datepicker__day--outside-month {
          color: #444 !important;
          opacity: 0.4 !important;
        }
        .react-datepicker__day--has-availability {
          position: relative;
        }
        .react-datepicker__day--has-availability::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #22c55e;
        }
        .react-datepicker__day--no-availability {
          color: #888 !important;
          text-decoration: line-through;
          cursor: not-allowed !important;
        }
        .react-datepicker__day--no-availability::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #ef4444;
        }
        .react-datepicker__day--no-availability:hover {
          background-color: transparent !important;
          color: #888 !important;
        }
        .react-datepicker__navigation {
          top: 1.25rem !important;
        }
        .react-datepicker__navigation-icon::before {
          border-color: #D4AF37 !important;
          border-width: 2px 2px 0 0 !important;
          height: 10px !important;
          width: 10px !important;
        }
        .react-datepicker__month {
          margin: 1rem !important;
        }
        .table-hover rect,
        .table-hover circle {
          transition: stroke 0.2s ease;
        }
        .table-hover:hover rect,
        .table-hover:hover circle {
          stroke: #22c55e !important;
        }
      `}</style>
      
      <div className="pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-10 lg:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#D4AF37] mb-3 sm:mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Nova Rezervacija
            </h1>
            <p className="text-gray-400 text-base sm:text-lg">Odaberi datum, unesi podatke gosta i dodijeli stolove</p>
          </motion.div>

          {/* Single Page Form with Table Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="glass rounded-lg p-6 sm:p-8">
              {/* Number of Guests - Top Row */}
              <div className="flex items-center justify-center gap-8 pb-6 mb-6 border-b border-[#333]">
                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Broj Gostiju
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setNumberOfGuests(Math.max(1, numberOfGuests - 1))}
                    className="w-10 h-10 bg-[#1A1A1A] border-2 border-[#333] hover:border-[#D4AF37] text-white rounded-lg transition-all text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold text-[#D4AF37] w-16 text-center">
                    {numberOfGuests}
                  </span>
                  <button
                    onClick={() => setNumberOfGuests(Math.min(12, numberOfGuests + 1))}
                    className="w-10 h-10 bg-[#1A1A1A] border-2 border-[#333] hover:border-[#D4AF37] text-white rounded-lg transition-all text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Date and Time Grid */}
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Date Picker */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                    Odaberite Datum
                  </label>
                  <div className="flex justify-center">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date: Date | null) => date && setSelectedDate(date)}
                      inline
                      minDate={new Date()}
                      locale={hr}
                      dayClassName={dayClassName}
                      filterDate={filterDate}
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div className="flex flex-col">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                    Vrijeme
                  </label>
                  {checkingAvailability ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-[#D4AF37] border-r-transparent"></div>
                        <p className="text-gray-400 text-sm mt-2">Provjeravam dostupnost...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 overflow-y-auto pr-2 custom-scrollbar content-start flex-1">
                      {TIME_SLOTS.map((time) => {
                        const isAvailable = timeAvailability[time] !== false;
                        const isDisabled = !isAvailable;
                        
                        return (
                          <button
                            key={time}
                            onClick={() => !isDisabled && setSelectedTime(time)}
                            disabled={isDisabled}
                            className={`py-2 px-2 text-xs sm:text-sm font-semibold rounded-lg transition-all relative ${
                              selectedTime === time
                                ? 'bg-[#D4AF37] text-black'
                                : isDisabled
                                ? 'bg-[#1A1A1A]/50 text-gray-600 cursor-not-allowed border border-[#333]/50'
                                : 'bg-[#1A1A1A] text-gray-400 hover:bg-[#333] hover:text-white border border-[#333]'
                            }`}
                          >
                            {time}
                            {isDisabled && (
                              <span className="absolute top-0 right-0 text-red-500 text-xs">✕</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Table Selection Section */}
              <div className="pt-6 border-t border-[#333] mb-8">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[#D4AF37] mb-2">
                    Odaberite Stol
                  </h3>
                  {selectedDate && selectedTime && (
                    <p className="text-gray-400 text-sm">
                      {format(selectedDate, 'd. MMMM yyyy.', { locale: hr })} u {selectedTime} • {numberOfGuests} {numberOfGuests === 1 ? 'osoba' : numberOfGuests <= 4 ? 'osobe' : 'osoba'}
                    </p>
                  )}
                </div>

                {selectedTableIds.length > 0 && (
                  <div className="bg-[#0A0A0A] border border-[#D4AF37] rounded-lg p-4 mb-4">
                    <p className="text-[#D4AF37] font-bold mb-2">Odabrani stolovi:</p>
                    <div className="space-y-1">
                      {selectedTableIds.map(id => {
                        const table = tables.find(t => t.id === id);
                        return table ? (
                          <div key={id} className="flex items-center justify-between text-sm">
                            <span className="text-white">Stol #{table.number}</span>
                            <span className="text-gray-400">{table.capacity} {table.capacity === 1 ? 'osoba' : table.capacity <= 4 ? 'osobe' : 'osoba'}</span>
                          </div>
                        ) : null;
                      })}
                      <div className="border-t border-[#333] pt-2 mt-2 flex items-center justify-between font-bold">
                        <span className="text-[#D4AF37]">Ukupan kapacitet:</span>
                        <span className="text-[#D4AF37]">{getTotalCapacity()} {getTotalCapacity() === 1 ? 'osoba' : getTotalCapacity() <= 4 ? 'osobe' : 'osoba'}</span>
                      </div>
                      {getTotalCapacity() < numberOfGuests ? (
                        <p className="text-red-400 text-xs mt-2">⚠️ Odaberite još stolova (potrebno: {numberOfGuests} gostiju)</p>
                      ) : (
                        <p className="text-green-400 text-xs mt-2">✓ Kapacitet je zadovoljen</p>
                      )}
                    </div>
                  </div>
                )}

                {selectedTime ? (
                  <div className="bg-[#0A0A0A] rounded-lg p-4 relative overflow-hidden">
                      <div className="w-full" style={{ aspectRatio: '4/3' }}>
                        <svg viewBox="0 0 800 600" className="w-full h-full">
                          <rect x="20" y="20" width="760" height="560" fill="#0A0A0A" stroke="#333" strokeWidth="2" rx="8"/>
                          <text x="400" y="60" textAnchor="middle" fill="#D4AF37" fontSize="20" fontWeight="bold">
                            Plan Restorana
                          </text>

                      {tables.map((table) => {
                        const isReserved = reservedTableIds.includes(table.id);
                        const isSelected = selectedTableIds.includes(table.id);
                        const currentCapacity = getTotalCapacity();
                        const capacitySatisfied = currentCapacity >= numberOfGuests;
                        const isDisabledDueToCapacity = !isSelected && capacitySatisfied;
                        const isAvailable = !isReserved && !isDisabledDueToCapacity;
                        const isRound = table.shape === 'round';
                        
                        return (
                          <g
                            key={table.id}
                            onClick={() => {
                              if (isSelected) {
                                // Dopusti uklanjanje odabranog stola
                                toggleTableSelection(table.id);
                              } else if (isAvailable) {
                                // Dopusti odabir samo ako stol nije rezerviran i kapacitet nije zadovoljen
                                toggleTableSelection(table.id);
                              }
                            }}
                            style={{ cursor: isAvailable || isSelected ? 'pointer' : 'not-allowed' }}
                            className={isAvailable || isSelected ? 'table-hover' : ''}
                          >
                            {isRound ? (
                              <circle
                                cx={table.x}
                                cy={table.y}
                                r="38"
                                fill={isSelected ? '#D4AF37' : isAvailable ? '#1A1A1A' : '#0A0A0A'}
                                stroke={isSelected ? '#FFF' : isAvailable ? '#D4AF37' : '#555'}
                                strokeWidth={isSelected ? 3.5 : 2.5}
                                opacity={isAvailable || isSelected ? 1 : 0.4}
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
                                opacity={isAvailable || isSelected ? 1 : 0.4}
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
                ) : (
                  <div className="bg-[#0A0A0A] rounded-lg p-8 text-center">
                    <p className="text-gray-400">Odaberite datum i vrijeme da vidite dostupne stolove</p>
                  </div>
                )}
              </div>

              {/* Customer Info Section */}
              <div className="pt-6 border-t border-[#333]">
                <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">Podaci o gostu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Ime i prezime <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                      placeholder="Marko Horvat"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Telefon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                      placeholder="+385 91 234 5678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Email (opciono)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                      placeholder="marko@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Posebni zahtjevi (opciono)
                    </label>
                    <input
                      type="text"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
                      placeholder="Alergije, proslave..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCancel}
                  disabled={isConfirming}
                  className="flex-1 bg-[#333] hover:bg-[#444] disabled:opacity-50 text-white font-bold py-3 sm:py-4 rounded-lg transition-all uppercase tracking-wider text-sm sm:text-base"
                >
                  Odustani
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedDate || !selectedTime || !customerName.trim() || !customerPhone.trim() || selectedTableIds.length === 0 || getTotalCapacity() < numberOfGuests || isConfirming}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#E8D89F] disabled:bg-[#333] disabled:text-gray-600 text-black font-bold py-3 sm:py-4 rounded-lg transition-all uppercase tracking-wider text-sm sm:text-base flex items-center justify-center gap-2"
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
                      <span>Potvrdi Rezervaciju</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
