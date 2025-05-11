import React from 'react';
import { useState, useEffect } from 'react';
import SideComp from './sidecomp';
import { useContext } from 'react';
import DateContext from '../context/dateContext';
import { useNavigate } from 'react-router-dom';

export default function TailwindCalendar() {

  const navigate = useNavigate()

  const {selectedDate , setSelectedDate} = useContext(DateContext)
  const [currentDate, setCurrentDate] = useState(new Date());
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'year', or 'decade'
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  // Track window dimensions
  useEffect(() => {
    // Update dimensions on mount
    function updateSize() {
      setWindowSize({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    }
    
    // Set initial size
    updateSize();
    
    // Add event listener
    window.addEventListener('resize', updateSize);
    
    // Clean up
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get the first day of the month (0 = Sunday, 1 = Monday, etc)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get today's date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Calculate the days array for the calendar
  const getDaysArray = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, current: false });
    }
    
    // Add the days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      date.setHours(0, 0, 0, 0);
      
      const isToday = isDateToday(date);
      const isSelected = isDateSelected(date);
      const isFuture = date > today;
      
      days.push({
        day: i,
        current: true,
        isToday,
        isSelected,
        isFuture,
        date
      });
    }
    
    return days;
  };
  
  // Check if a date is today
  const isDateToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Check if a date is selected
  const isDateSelected = (date) => {
    return date && selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };
  
  // Month navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setViewMode('month');
  };
  
  const goToNextMonth = () => {
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);
    
    // Only allow navigating to future months if it's the current month or past
    if (nextMonth <= today || nextMonth.getMonth() === today.getMonth()) {
      setCurrentDate(nextMonth);
    }
    setViewMode('month');
  };
  
  // Year navigation
  const goToPreviousYear = () => {
    setCurrentDate(new Date(currentYear - 1, currentMonth, 1));
    setViewMode('month');
  };
  
  const goToNextYear = () => {
    const nextYear = new Date(currentYear + 1, currentMonth, 1);
    
    // Only allow navigating to future years if it's the current year or past
    if (nextYear.getFullYear() <= today.getFullYear()) {
      setCurrentDate(nextYear);
    }
    setViewMode('month');
  };
  
  // Select a date
  const handleDateClick = (day) => {
    if (day.current && !day.isFuture) {
      setSelectedDate(day.date);
      navigate('/cardsPage')
    }
  };
  
  // Get month name
  const getMonthName = (month) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
  };
  
  // Toggle view mode
  const toggleViewMode = () => {
    if (viewMode === 'month') {
      setViewMode('year');
    } else if (viewMode === 'year') {
      setViewMode('decade');
    } else {
      setViewMode('month');
    }
  };
  
  // Generate years for year view (current year +/- 5 years)
  const getYearsArray = () => {
    const years = [];
    const startYear = currentYear - 5;
    const endYear = today.getFullYear(); // Limit to current year
    
    for (let year = startYear; year <= endYear; year++) {
      years.push({
        year,
        isCurrentYear: year === currentDate.getFullYear(),
        isSelected: selectedDate && year === selectedDate.getFullYear()
      });
    }
    
    return years;
  };
  
  // Generate months for year view
  const getMonthsArray = () => {
    const months = [];
    const currentYear = currentDate.getFullYear();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    
    for (let i = 0; i < 12; i++) {
      // Determine if this month is in the future (inaccessible)
      const isFuture = (currentYear === todayYear && i > todayMonth) || 
                       (currentYear > todayYear);
                       
      months.push({
        month: i,
        name: getMonthName(i).substring(0, 3),
        isCurrentMonth: i === currentDate.getMonth() && currentYear === currentDate.getFullYear(),
        isSelected: selectedDate && i === selectedDate.getMonth() && currentYear === selectedDate.getFullYear(),
        isFuture
      });
    }
    
    return months;
  };
  
  // Get weekdays
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get data arrays based on view mode
  const days = viewMode === 'month' ? getDaysArray() : [];
  const months = viewMode === 'year' ? getMonthsArray() : [];
  const years = viewMode === 'decade' ? getYearsArray() : [];
  
  // Handle month selection in year view
  const handleMonthClick = (monthObj) => {
    if (!monthObj.isFuture) {
      setCurrentDate(new Date(currentYear, monthObj.month, 1));
      setViewMode('month');
    }
  };
  
  // Handle year selection in decade view
  const handleYearClick = (yearObj) => {
    setCurrentDate(new Date(yearObj.year, currentMonth, 1));
    setViewMode('year');
  };
  
  return (
    <div className="w-screen h-screen">
      <SideComp/>
    <div className="relative w-full h-full flex flex-col items-center space-y-4">
      <div className="absolute w-[50%] h-[90%] top-8 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-[#5AE4A7] text-white p-4">
          <div className="flex justify-between items-center mb-2">
            <button 
              onClick={viewMode === 'month' ? goToPreviousMonth : (viewMode === 'year' ? goToPreviousYear : () => {})}
              className="text-white hover:bg-[#5AE4A7] rounded-full p-1"
            >
              <svg className="w-6 h-6 hover:cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Toggle between month/year/decade view */}
            <button 
              onClick={toggleViewMode}
              className="text-xl font-bold hover:bg-[#5AE4A7] px-3 py-1 rounded hover:cursor-pointer"
            >
              {viewMode === 'month' ? `${getMonthName(currentMonth)} ${currentYear}` : 
               viewMode === 'year' ? currentYear : 
               `${years[0]?.year} - ${years[years.length-1]?.year}`}
            </button>
            
            <button 
              onClick={viewMode === 'month' ? goToNextMonth : (viewMode === 'year' ? goToNextYear : () => {})}
              className={`text-white rounded-full p-1 ${
                (viewMode === 'month' && currentYear === today.getFullYear() && currentMonth >= today.getMonth()) ||
                (viewMode === 'year' && currentYear >= today.getFullYear())
                ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#5AE4A7] hover:cursor-pointer'
              }`}
              disabled={(viewMode === 'month' && currentYear === today.getFullYear() && currentMonth >= today.getMonth()) ||
                       (viewMode === 'year' && currentYear >= today.getFullYear())}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Year navigation buttons */}
          <div className="flex justify-center space-x-2">
            <button 
              onClick={goToPreviousYear}
              className="text-xs bg-white text-[#5AE4A7] hover:bg-[#d8f3dc] hover:text-white hover:cursor-pointer rounded px-2 py-1"
            >
              Previous Year
            </button>
            
            <button 
              onClick={goToNextYear}
              className={`text-xs bg-white text-[#5AE4A7] rounded px-2 py-1 ${
                currentYear >= today.getFullYear()
                ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d8f3dc] hover:text-white hover:cursor-pointer'
              }`}
              disabled={currentYear >= today.getFullYear()}
            >
              Next Year
            </button>
          </div>
        </div>
        
        {/* Month View */}
        {viewMode === 'month' && (
          <>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 bg-[#d8f3dc]">
              {weekdays.map((day, index) => (
                <div 
                  key={index} 
                  className="text-center py-2 text-[#52b788] font-medium text-sm"
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 p-2 bg-white">
              {days.map((day, index) => (
                <div 
                  key={index} 
                  className={`
                    aspect-square flex items-center justify-center text-sm rounded-full
                    ${!day.day ? 'text-gray-300' : day.isFuture ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                    ${day.isToday && !day.isSelected ? 'bg-[#d8f3dc] text-[#5AE4A7] font-bold' : ''}
                    ${day.isSelected ? 'bg-[#5AE4A7] text-white font-bold' : ''}
                    ${day.current && !day.isToday && !day.isSelected && !day.isFuture ? 'hover:bg-[#d8f3dc]' : ''}
                  `}
                  onClick={() => day.day && handleDateClick(day)}
                >
                  {day.day}
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Year View (Months) */}
        {viewMode === 'year' && (
          <div className="grid grid-cols-3 gap-2 p-4 bg-white">
            {months.map((month, index) => (
              <div 
                key={index} 
                className={`
                  py-4 flex items-center justify-center text-sm rounded
                  ${month.isFuture ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                  ${month.isCurrentMonth ? 'bg-indigo-100 text-[#5AE4A7] font-bold' : ''}
                  ${month.isSelected ? 'bg-[#5AE4A7] text-white font-bold' : ''}
                  ${!month.isCurrentMonth && !month.isSelected && !month.isFuture ? 'hover:bg-[#d8f3dc]' : ''}
                `}
                onClick={() => handleMonthClick(month)}
              >
                {month.name}
              </div>
            ))}
          </div>
        )}
        
        {/* Decade View (Years) */}
        {viewMode === 'decade' && (
          <div className="grid grid-cols-3 gap-2 p-4 bg-white">
            {years.map((yearObj, index) => (
              <div 
                key={index} 
                className={`
                  py-4 flex items-center justify-center text-sm rounded cursor-pointer
                  ${yearObj.isCurrentYear ? 'bg-indigo-100 text-[#5AE4A7] font-bold' : ''}
                  ${yearObj.isSelected ? 'bg-[#5AE4A7] text-white font-bold' : ''}
                  ${!yearObj.isCurrentYear && !yearObj.isSelected ? 'hover:bg-[#d8f3dc]' : ''}
                `}
                onClick={() => handleYearClick(yearObj)}
              >
                {yearObj.year}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}