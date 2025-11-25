'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isToday } from 'date-fns';
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
    ...getEasterDates(year)
  ];
};

const getEasterDates = (year: number) => {
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
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  const easter = new Date(year, month, day);
  const easterMonday = new Date(year, month, day + 1);
  const corpusChristi = new Date(year, month, day + 60);
  
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

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
  type: string;
  services: Service[];
}

export default function OrderPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Load categories and appointments in parallel
    Promise.all([fetchCategories(), fetchAppointments()]);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Set empty array on error so UI can render
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/appointments`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedService) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedService]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !selectedService) return;
    setLoading(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await axios.get(`${API_URL}/availability`, {
        params: { date: formattedDate, serviceId: selectedService.id }
      });
      setAvailableSlots(response.data.availableSlots);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime('');
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedDate(null);
    setSelectedTime('');
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime || !customerName || !customerEmail || !customerPhone) {
      alert('Molimo popunite sve podatke');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/appointments`, {
        serviceId: selectedService.id,
        size: '',
        design: '',
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        customerName,
        customerEmail,
        customerPhone,
        notes
      });
      setIsConfirmed(true);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Greška prilikom kreiranja rezervacije');
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const holiday = isHoliday(date);
      
      return (
        <div className="flex flex-col items-center mt-1">
          {holiday && (
            <div className="w-2 h-2 bg-red-500 rounded-full mt-1" title={getHolidayName(date)}></div>
          )}
        </div>
      );
    }
    return null;
  };

  const resetBooking = () => {
    setSelectedCategory(null);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime('');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setNotes('');
    setIsConfirmed(false);
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="pt-24 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center animate-fade-in">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Rezervacija Potvrđena!</h2>
                <p className="text-gray-600 dark:text-gray-400">Vaša rezervacija je uspješno kreirana.</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded p-6 mb-6 max-w-md mx-auto">
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Usluga:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Datum:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedDate && format(selectedDate, 'dd.MM.yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Vrijeme:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Cijena:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedService?.price}€</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Poslali smo vam potvrdu na email: {customerEmail}</p>
              <button onClick={resetBooking} className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded transition-colors">Nova Rezervacija</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="pt-24 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Rezervirajte Termin</h1>
            <p className="text-gray-600 dark:text-gray-300">Popunite korake redom</p>
          </div>

          <div className="space-y-6">
            {/* KORAK 1: Kategorija */}
            <div className={`bg-white dark:bg-gray-800 rounded-lg shadow transition-all duration-500 ${selectedCategory ? 'overflow-hidden' : ''}`}>
              <div 
                className={`p-6 ${selectedCategory ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''}`}
                onClick={() => selectedCategory && setSelectedCategory(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedCategory ? 'bg-green-500' : 'bg-pink-500'}`}>
                      {selectedCategory ? (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-white font-bold">1</span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Odaberite Kategoriju</h2>
                      {selectedCategory && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedCategory.name}</p>
                      )}
                    </div>
                  </div>
                  {selectedCategory && (
                    <button className="text-pink-500 hover:text-pink-600 text-sm font-medium">Promijeni</button>
                  )}
                </div>
              </div>
              
              {!selectedCategory && (
                <div className="px-6 pb-6 animate-slide-down">
                  {categories.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg animate-pulse">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categories.map((category) => (
                        <button 
                          key={category.id} 
                          onClick={() => handleCategorySelect(category)} 
                          className="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-pink-500 hover:shadow-lg transition-all text-left transform hover:scale-105"
                        >
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{category.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{category.services.length} usluga</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* KORAK 2: Usluga */}
            {selectedCategory && (
              <div className={`bg-white dark:bg-gray-800 rounded-lg shadow transition-all duration-500 animate-slide-down ${selectedService ? 'overflow-hidden' : ''}`}>
                <div 
                  className={`p-6 ${selectedService ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''}`}
                  onClick={() => selectedService && setSelectedService(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedService ? 'bg-green-500' : 'bg-pink-500'}`}>
                        {selectedService ? (
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-white font-bold">2</span>
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Odaberite Uslugu</h2>
                        {selectedService && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedService.name} - {selectedService.price}€</p>
                        )}
                      </div>
                    </div>
                    {selectedService && (
                      <button className="text-pink-500 hover:text-pink-600 text-sm font-medium">Promijeni</button>
                    )}
                  </div>
                </div>
                
                {!selectedService && (
                  <div className="px-6 pb-6 animate-slide-down">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedCategory.services.map((service) => (
                        <button 
                          key={service.id} 
                          onClick={() => handleServiceSelect(service)} 
                          className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-pink-500 hover:shadow-lg transition-all text-left transform hover:scale-105"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{service.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{service.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-yellow-400">{service.price}€</span>
                            <span className="text-sm text-gray-500">⏱️ {service.duration} min</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* KORAK 3: Datum */}
            {selectedService && (
              <div className={`bg-white dark:bg-gray-800 rounded-lg shadow transition-all duration-500 animate-slide-down ${selectedDate ? 'overflow-hidden' : ''}`}>
                <div 
                  className={`p-6 ${selectedDate ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''}`}
                  onClick={() => selectedDate && setSelectedDate(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedDate ? 'bg-green-500' : 'bg-pink-500'}`}>
                        {selectedDate ? (
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-white font-bold">3</span>
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Odaberite Datum</h2>
                        {selectedDate && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{format(selectedDate, 'dd.MM.yyyy')}</p>
                        )}
                      </div>
                    </div>
                    {selectedDate && (
                      <button className="text-pink-500 hover:text-pink-600 text-sm font-medium">Promijeni</button>
                    )}
                  </div>
                </div>
                
                {!selectedDate && (
                  <div className="px-6 pb-6 animate-slide-down">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Odaberite datum</h3>
                      {!isToday(calendarDate) && (
                        <button
                          onClick={() => setCalendarDate(new Date())}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          Danas
                        </button>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <div className="calendar-container">
                        <Calendar
                          key={calendarDate.toISOString()}
                          onChange={(value) => {
                            setCalendarDate(value as Date);
                            handleDateSelect(value as Date);
                          }}
                          value={calendarDate}
                          minDate={new Date()}
                          tileDisabled={({ date }) => date.getDay() === 0 || isHoliday(date)}
                          tileContent={tileContent}
                          tileClassName={({ date }) => {
                            const isCurrentMonth = date.getMonth() === calendarDate.getMonth() && date.getFullYear() === calendarDate.getFullYear();
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
                    <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Praznik - zatvoreno</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="line-through opacity-50">15</span>
                        <span>Prošli datum</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* KORAK 4: Vrijeme */}
            {selectedDate && (
              <div className={`bg-white dark:bg-gray-800 rounded-lg shadow transition-all duration-500 animate-slide-down ${selectedTime ? 'overflow-hidden' : ''}`}>
                <div 
                  className={`p-6 ${selectedTime ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''}`}
                  onClick={() => selectedTime && setSelectedTime('')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedTime ? 'bg-green-500' : 'bg-pink-500'}`}>
                        {selectedTime ? (
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-white font-bold">4</span>
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Odaberite Vrijeme</h2>
                        {selectedTime && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedTime}</p>
                        )}
                      </div>
                    </div>
                    {selectedTime && (
                      <button className="text-pink-500 hover:text-pink-600 text-sm font-medium">Promijeni</button>
                    )}
                  </div>
                </div>
                
                {!selectedTime && (
                  <div className="px-6 pb-6 animate-slide-down">
                    {loading ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600 dark:text-gray-400">Učitavam dostupne termine...</p>
                      </div>
                    ) : (() => {
                      const filteredSlots = availableSlots.filter(slot => {
                        // Filter out past times for today
                        if (selectedDate && isToday(selectedDate)) {
                          const now = new Date();
                          const [hours, minutes] = slot.split(':').map(Number);
                          const slotTime = new Date();
                          slotTime.setHours(hours, minutes, 0, 0);
                          return slotTime > now;
                        }
                        return true;
                      });
                      
                      return filteredSlots.length > 0 ? (
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                          {filteredSlots.map((slot) => (
                            <button 
                              key={slot} 
                              onClick={() => handleTimeSelect(slot)} 
                              className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-pink-500 hover:shadow-lg transition-all font-medium text-gray-900 dark:text-white transform hover:scale-105"
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-600 dark:text-gray-400">
                            {selectedDate && isToday(selectedDate) && availableSlots.length > 0 
                              ? "Nema dostupnih termina za današnji dan (svi termini su prošli)." 
                              : "Nema dostupnih termina za odabrani datum."}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* KORAK 5: Podaci */}
            {selectedTime && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-all duration-500 animate-slide-down">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-pink-500">
                      <span className="text-white font-bold">5</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Vaši Podaci</h2>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Pregled rezervacije:</h3>
                    <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <p>📋 Usluga: {selectedService?.name}</p>
                      <p>💰 Cijena: {selectedService?.price}€</p>
                      <p>⏱️ Trajanje: {selectedService?.duration} min</p>
                      <p>📅 Datum: {selectedDate && format(selectedDate, 'dd.MM.yyyy')}</p>
                      <p>🕐 Vrijeme: {selectedTime}</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ime i prezime *</label>
                      <input 
                        type="text" 
                        required 
                        value={customerName} 
                        onChange={(e) => {
                          const value = e.target.value;
                          // Capitalize first letter after space
                          const capitalized = value
                            .split(' ')
                            .map((word, index) => {
                              if (word.length === 0) return word;
                              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                            })
                            .join(' ');
                          setCustomerName(capitalized);
                        }} 
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all" 
                        placeholder="Ana Anić" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                      <input 
                        type="email" 
                        required 
                        value={customerEmail} 
                        onChange={(e) => setCustomerEmail(e.target.value)} 
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all" 
                        placeholder="ana@example.com" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telefon *</label>
                      <input 
                        type="tel" 
                        required 
                        value={customerPhone} 
                        onChange={(e) => {
                          const value = e.target.value;
                          // Ograničenje na maksimalno 13 znakova (npr. +38599XXXXXXX)
                          if (value.length <= 13 && (value === '' || /^(\+)?[0-9]*$/.test(value))) {
                            setCustomerPhone(value);
                          }
                        }}
                        maxLength={13}
                        minLength={8}
                        pattern="^\+?[0-9]+$"
                        title="Telefon mora imati minimalno 8 znakova, maksimalno 13. Znak + samo na početku, ostalo samo brojevi (bez razmaka)."
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all" 
                        placeholder="+38599XXXXXXX" 
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {customerPhone.length}/13 znakova
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Napomena (opciono)</label>
                      <textarea 
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)} 
                        rows={3} 
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-pink-500 focus:ring-2 focus:ring-pink-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all" 
                        placeholder="Posebni zahtjevi..." 
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading} 
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 px-6 rounded-lg transition-all disabled:opacity-50 transform hover:scale-105 shadow-lg"
                    >
                      {loading ? 'Rezerviram...' : '✅ Potvrdi Rezervaciju'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

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
    </div>
  );
}
