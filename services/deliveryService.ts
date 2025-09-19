
import { DeliverySlot } from '../types';
import { DAILY_CAPACITY_BOXES } from '../constants';

// Simple seeded random number generator for deterministic "randomness"
const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
};


export const getDeliverySlots = (): DeliverySlot[] => {
  const slots: DeliverySlot[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Look ahead for the next 4 weeks (28 days) to ensure we get 3 full weeks of slots
  for (let i = 0; i < 28; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayOfWeek = date.getDay(); // Sunday is 0, Wednesday is 3, Saturday is 6

    if (dayOfWeek === 3 || dayOfWeek === 6) {
      // Use date as a seed for consistent random capacity on each refresh
      const rand = seededRandom(date.getTime());
      const capacityUsed = Math.floor(rand() * (DAILY_CAPACITY_BOXES + 1));
      
      const slot: DeliverySlot = {
        date: date,
        dayOfWeek: dayOfWeek === 3 ? 'Wednesday' : 'Saturday',
        isAvailable: capacityUsed < DAILY_CAPACITY_BOXES,
        capacityUsed: capacityUsed,
        maxCapacity: DAILY_CAPACITY_BOXES,
      };
      slots.push(slot);
    }
  }

  // Ensure we only show slots for the next 3 weeks from the first available slot
  return slots.slice(0, 6); // 2 slots per week for 3 weeks
};
