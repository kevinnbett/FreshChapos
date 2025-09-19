import React from 'react';
import { DeliverySlot } from '../types';
import { CalendarIcon, CheckCircleIcon, XCircleIcon } from './Icons';

interface DatePickerProps {
  slots: DeliverySlot[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ slots, selectedDate, onDateSelect }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const isSameDay = (d1: Date, d2: Date | null): boolean => {
    if (!d1 || !d2) {
      return false;
    }
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center mb-4">
        <CalendarIcon className="w-6 h-6 text-amber-600 mr-3" />
        <h2 className="text-xl font-bold text-gray-800">1. Choose a delivery day</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {slots.map(slot => {
          const isSelected = isSameDay(slot.date, selectedDate);
          const isFull = !slot.isAvailable;
          const progress = (slot.capacityUsed / slot.maxCapacity) * 100;

          return (
            <button
              key={slot.date.toISOString()}
              onClick={() => !isFull && onDateSelect(slot.date)}
              disabled={isFull}
              className={`p-3 rounded-lg text-center transition-all duration-200 border-2 ${
                isSelected
                  ? 'bg-amber-100 border-amber-500 scale-105 shadow-md'
                  : isFull
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-gray-200 hover:border-amber-400 hover:bg-amber-50'
              }`}
            >
              <div className="font-semibold text-gray-700">{slot.dayOfWeek}</div>
              <div className={`text-lg font-bold ${isSelected ? 'text-amber-700' : 'text-gray-900'}`}>{formatDate(slot.date)}</div>
              <div className="text-xs text-gray-500 mt-2">
                {isFull ? (
                  <div className="flex items-center justify-center text-red-500">
                    <XCircleIcon className="w-4 h-4 mr-1" />
                    <span>Fully Booked</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-green-600">
                     <CheckCircleIcon className="w-4 h-4 mr-1" />
                    <span>Available</span>
                  </div>
                )}
              </div>
              {!isFull && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-1.5 rounded-full" 
                    style={{ width: `${progress}%` }}>
                  </div>
                </div>
              )}
               <div className="text-xs text-gray-400 mt-1">{slot.capacityUsed} / {slot.maxCapacity} booked</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DatePicker;
