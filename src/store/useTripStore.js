import { useState, useEffect } from 'react';

const STORAGE_KEY = 'seyahat_planlayici_trips';

const sampleTrips = [
  {
    id: '1',
    title: 'İstanbul Turu',
    destination: 'İstanbul, Türkiye',
    startDate: '2026-06-10',
    endDate: '2026-06-15',
    coverColor: '#3B82F6',
    budget: 5000,
    currency: 'TRY',
    days: [
      {
        id: 'd1',
        date: '2026-06-10',
        activities: [
          { id: 'a1', time: '09:00', title: 'Ayasofya Ziyareti', location: 'Ayasofya, Fatih', lat: 41.0086, lng: 28.9802, cost: 0, category: 'kultur', notes: '' },
          { id: 'a2', time: '12:00', title: 'Kapalıçarşı', location: 'Kapalıçarşı, Beyazıt', lat: 41.0107, lng: 28.9683, cost: 200, category: 'alisveris', notes: 'Hediyelik eşya' },
        ],
      },
      {
        id: 'd2',
        date: '2026-06-11',
        activities: [
          { id: 'a3', time: '10:00', title: 'Boğaz Turu', location: 'Eminönü İskelesi', lat: 41.0172, lng: 28.9745, cost: 150, category: 'eglenme', notes: '' },
        ],
      },
    ],
    expenses: [
      { id: 'e1', title: 'Uçak Bileti', amount: 1200, category: 'ulasim', date: '2026-06-10' },
      { id: 'e2', title: 'Otel (5 gece)', amount: 2500, category: 'konaklama', date: '2026-06-10' },
      { id: 'e3', title: 'Yemekler', amount: 600, category: 'yemek', date: '2026-06-10' },
    ],
  },
];

export function useTripStore() {
  const [trips, setTrips] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : sampleTrips;
    } catch {
      return sampleTrips;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  }, [trips]);

  function addTrip(trip) {
    const { aiPlan, ...rest } = trip;
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    let days = [];
    let expenses = [];

    if (aiPlan) {
      days = aiPlan.days.map((d, di) => ({
        id: `d${Date.now()}${di}`,
        date: d.date,
        activities: (d.activities || []).map((a, ai) => ({
          ...a,
          id: `a${Date.now()}${di}${ai}`,
          lat: a.lat || null,
          lng: a.lng || null,
          cost: Number(a.cost) || 0,
        })),
      }));
      expenses = (aiPlan.expenses || []).map((e, i) => ({
        ...e,
        id: `e${Date.now()}${i}`,
        amount: Number(e.amount) || 0,
      }));
    }

    const newTrip = {
      ...rest,
      id: Date.now().toString(),
      days,
      expenses,
      coverColor: colors[Math.floor(Math.random() * colors.length)],
    };
    setTrips(prev => [newTrip, ...prev]);
    return newTrip.id;
  }

  function updateTrip(id, updates) {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }

  function deleteTrip(id) {
    setTrips(prev => prev.filter(t => t.id !== id));
  }

  function addDay(tripId, date) {
    const day = { id: Date.now().toString(), date, activities: [] };
    setTrips(prev => prev.map(t =>
      t.id === tripId ? { ...t, days: [...t.days, day].sort((a, b) => a.date.localeCompare(b.date)) } : t
    ));
  }

  function addActivity(tripId, dayId, activity) {
    setTrips(prev => prev.map(t =>
      t.id === tripId ? {
        ...t,
        days: t.days.map(d =>
          d.id === dayId ? { ...d, activities: [...d.activities, { ...activity, id: Date.now().toString() }] } : d
        ),
      } : t
    ));
  }

  function deleteActivity(tripId, dayId, activityId) {
    setTrips(prev => prev.map(t =>
      t.id === tripId ? {
        ...t,
        days: t.days.map(d =>
          d.id === dayId ? { ...d, activities: d.activities.filter(a => a.id !== activityId) } : d
        ),
      } : t
    ));
  }

  function addExpense(tripId, expense) {
    setTrips(prev => prev.map(t =>
      t.id === tripId ? { ...t, expenses: [...t.expenses, { ...expense, id: Date.now().toString() }] } : t
    ));
  }

  function deleteExpense(tripId, expenseId) {
    setTrips(prev => prev.map(t =>
      t.id === tripId ? { ...t, expenses: t.expenses.filter(e => e.id !== expenseId) } : t
    ));
  }

  return { trips, addTrip, updateTrip, deleteTrip, addDay, addActivity, deleteActivity, addExpense, deleteExpense };
}
