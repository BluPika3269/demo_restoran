'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';
import { hr } from 'date-fns/locale';
import useSWR from 'swr';
import Navigation from '@/components/Navigation';

const API_URL = '/api';

const TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
];

export default function ReservationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [timeAvailability, setTimeAvailability] = useState<Record<string, boolean>>({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [dateAvailability, setDateAvailability] = useState<Record<string, { available: number, total: number }>>({});

  // Set date from URL parameter if provided
  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      try {
        const date = parseISO(dateParam);
        setSelectedDate(date);
      } catch (error) {
        console.error('Invalid date parameter:', error);
      }
    }
  }, [searchParams]);

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
    setEmailError(isValid ? '' : 'Unesite valjanu email adresu (npr. ime@domena.com)');
    return isValid;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only letters (including Croatian), spaces, and hyphens
    const filtered = value.replace(/[^a-zA-ZčćžšđČĆŽŠĐ\s-]/g, '');
    const capitalized = capitalizeName(filtered);
    setCustomerName(capitalized);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setCustomerEmail(email);
    validateEmail(email);
  };

  // SWR fetcher function
  const fetcher = (url: string) => fetch(url).then(res => res.json());

  // Use SWR for automatic caching and revalidation
  const { data: batchData, error: batchError } = useSWR(
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

  // Check availability for all times when date or guests change
  useEffect(() => {
    if (selectedDate && numberOfGuests > 0) {
      checkAvailabilityForAllTimes();
    }
  }, [selectedDate, numberOfGuests]);

  const checkAvailabilityForAllTimes = async () => {
    if (!selectedDate) return;
    
    setCheckingAvailability(true);
    
    try {
      // Single batch request for all time slots of selected date instead of 24 individual requests!
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



  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !customerName || !customerPhone) {
      alert('Molimo popunite sve obavezne podatke (ime, telefon)');
      return;
    }

    // Validate email if provided
    if (customerEmail && !validateEmail(customerEmail)) {
      alert('Molimo unesite valjanu email adresu');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
          numberOfGuests,
          customerName,
          customerEmail: customerEmail.trim() || null,
          customerPhone,
          specialRequests: specialRequests.trim() || null,
          duration: 120
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Greška prilikom rezervacije');
      }

      setConfirmed(true);
    } catch (error: any) {
      alert(error.message || 'Greška prilikom rezervacije');
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime('');
    setNumberOfGuests(2);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setSpecialRequests('');
    setConfirmed(false);
  };



  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <Navigation />
        <div className="pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass rounded-lg p-6 sm:p-8 lg:p-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#D4AF37] mb-3 sm:mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Rezervacija Potvrđena!
              </h2>
              <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">Vaša rezervacija je uspješno kreirana</p>
              
              <div className="bg-[#1A1A1A] rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 text-left">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center border-b border-[#333] pb-2 sm:pb-3">
                    <span className="text-gray-400 text-sm sm:text-base">Datum</span>
                    <span className="text-white font-semibold text-sm sm:text-base">
                      {selectedDate && format(selectedDate, 'dd. MMMM yyyy.', { locale: hr })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#333] pb-2 sm:pb-3">
                    <span className="text-gray-400 text-sm sm:text-base">Vrijeme</span>
                    <span className="text-white font-semibold text-sm sm:text-base">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm sm:text-base">Broj gostiju</span>
                    <span className="text-white font-semibold text-sm sm:text-base">{numberOfGuests}</span>
                  </div>
                </div>
              </div>
              
              {customerEmail && (
                <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8">
                  Potvrda je poslana na: <span className="text-[#D4AF37]">{customerEmail}</span>
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={resetBooking}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#E8D89F] text-black font-semibold py-3 px-6 rounded-lg transition-all uppercase tracking-wider text-sm sm:text-base"
                >
                  Nova Rezervacija
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 bg-[#1A1A1A] hover:bg-[#333] text-white font-semibold py-3 px-6 rounded-lg transition-all uppercase tracking-wider border border-[#333] hover:border-[#D4AF37] text-sm sm:text-base"
                >
                  Početna Stranica
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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
        .react-datepicker__day--limited-availability::after {
          background-color: #f59e0b;
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
              Rezervacija Stola
            </h1>
            <p className="text-gray-400 text-base sm:text-lg">Odaberite termin i stol za vašu večeru</p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 sm:mb-10 lg:mb-12 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-between">
              {[
                { num: 1, label: 'Datum & Vrijeme' },
                { num: 2, label: 'Vaši Podaci' }
              ].map((s, index) => (
                <div key={s.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center w-full">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all text-sm sm:text-base ${
                      step >= s.num 
                        ? 'bg-[#D4AF37] text-black scale-110' 
                        : 'bg-[#1A1A1A] text-gray-500 border-2 border-[#333]'
                    }`}>
                      {s.num}
                    </div>
                    <span className={`text-[10px] sm:text-xs mt-2 uppercase tracking-wider text-center ${
                      step >= s.num ? 'text-[#D4AF37]' : 'text-gray-600'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {index < 1 && (
                    <div className={`flex-1 h-0.5 sm:h-1 mx-2 sm:mx-4 transition-all ${
                      step > s.num ? 'bg-[#D4AF37]' : 'bg-[#333]'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {/* STEP 1: Date, Time & Guests */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="glass rounded-lg p-4 sm:p-6 lg:p-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Odaberite Datum, Vrijeme i Broj Gostiju
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                  {/* Date Picker */}
                  <div className="flex flex-col items-center">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider text-center">
                      Datum
                    </label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date: Date | null) => setSelectedDate(date)}
                      minDate={new Date()}
                      dateFormat="dd.MM.yyyy"
                      locale={hr}
                      inline
                      calendarClassName="custom-calendar"
                      dayClassName={(date) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const availability = dateAvailability[dateStr];
                        
                        if (!availability) return '';
                        
                        if (availability.available === 0) {
                          return 'react-datepicker__day--no-availability';
                        } else {
                          return 'react-datepicker__day--has-availability';
                        }
                      }}
                      filterDate={(date) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const availability = dateAvailability[dateStr];
                        // Allow selection only if there's at least 1 available slot
                        return !availability || availability.available > 0;
                      }}
                    />
                    <div className="mt-4 flex flex-wrap gap-3 justify-center text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-gray-400">Dostupno</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-gray-400">Popunjeno</span>
                      </div>
                    </div>
                  </div>

                  {/* Time & Guests */}
                  <div>
                    <div className="mb-6">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                        Broj Gostiju
                      </label>
                      <div className="flex items-center justify-center gap-3 sm:gap-4">
                        <button
                          onClick={() => setNumberOfGuests(Math.max(1, numberOfGuests - 1))}
                          className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1A1A1A] border-2 border-[#333] hover:border-[#D4AF37] text-white rounded-lg transition-all text-lg"
                        >
                          -
                        </button>
                        <span className="text-2xl sm:text-3xl font-bold text-[#D4AF37] w-12 sm:w-16 text-center">
                          {numberOfGuests}
                        </span>
                        <button
                          onClick={() => setNumberOfGuests(Math.min(12, numberOfGuests + 1))}
                          className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1A1A1A] border-2 border-[#333] hover:border-[#D4AF37] text-white rounded-lg transition-all text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
                        Vrijeme
                      </label>
                      {checkingAvailability ? (
                        <div className="text-center py-8">
                          <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-[#D4AF37] border-r-transparent"></div>
                          <p className="text-gray-400 text-sm mt-2">Provjeravam dostupnost...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 sm:max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                          {TIME_SLOTS.map((time) => {
                            const isAvailable = timeAvailability[time] !== false;
                            const isDisabled = !isAvailable;
                            
                            return (
                              <button
                                key={time}
                                onClick={() => !isDisabled && setSelectedTime(time)}
                                disabled={isDisabled}
                                className={`py-2 sm:py-3 px-2 text-xs sm:text-sm font-semibold rounded-lg transition-all relative ${
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
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full bg-[#D4AF37] hover:bg-[#E8D89F] disabled:bg-[#333] disabled:text-gray-600 text-black font-bold py-3 sm:py-4 rounded-lg transition-all uppercase tracking-wider text-sm sm:text-base"
                >
                  Nastavi
                </button>
              </motion.div>
            )}

            {/* STEP 2: Customer Info */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="glass rounded-lg p-4 sm:p-6 lg:p-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Vaši Podaci
                </h2>

                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                      Ime i Prezime *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={handleNameChange}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border-2 border-[#333] focus:border-[#D4AF37] rounded-lg text-white transition-all outline-none"
                      placeholder="Ivan Horvat"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                      Email (opcionalno)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={handleEmailChange}
                      className={`w-full px-4 py-3 bg-[#1A1A1A] border-2 ${
                        emailError ? 'border-red-500' : 'border-[#333]'
                      } focus:border-[#D4AF37] rounded-lg text-white transition-all outline-none`}
                      placeholder="ivan@email.com"
                    />
                    {emailError && (
                      <p className="text-red-500 text-sm mt-1">{emailError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => {
                        // Allow only numbers, +, and spaces
                        const filtered = e.target.value.replace(/[^0-9+\s]/g, '');
                        setCustomerPhone(filtered);
                      }}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border-2 border-[#333] focus:border-[#D4AF37] rounded-lg text-white transition-all outline-none"
                      placeholder="+385 91 234 5678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                      Posebni Zahtjevi (opcionalno)
                    </label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border-2 border-[#333] focus:border-[#D4AF37] rounded-lg text-white transition-all outline-none resize-none"
                      placeholder="Alergije, dijeta, posebne želje..."
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-[#1A1A1A] rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-bold text-[#D4AF37] mb-3 sm:mb-4">Sažetak Rezervacije</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Datum</span>
                      <span className="text-white font-semibold">
                        {selectedDate && format(selectedDate, 'dd.MM.yyyy', { locale: hr })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vrijeme</span>
                      <span className="text-white font-semibold">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gosti</span>
                      <span className="text-white font-semibold">{numberOfGuests}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-[#1A1A1A] hover:bg-[#333] text-white font-bold py-3 sm:py-4 rounded-lg transition-all uppercase tracking-wider border border-[#333] text-sm sm:text-base"
                  >
                    Natrag
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !customerName || !customerPhone}
                    className="flex-1 bg-[#D4AF37] hover:bg-[#E8D89F] disabled:bg-[#333] disabled:text-gray-600 text-black font-bold py-3 sm:py-4 rounded-lg transition-all uppercase tracking-wider text-sm sm:text-base"
                  >
                    {loading ? 'Rezerviram...' : 'Potvrdi Rezervaciju'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
