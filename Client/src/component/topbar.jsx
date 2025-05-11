import React, { useContext, useState } from 'react';
import { format, addDays, subDays, isToday } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import DateContext from '../context/dateContext';

const DateSlider = () => {

  const {selectedDate , setSelectedDate} = useContext(DateContext)

  const [centerDate, setCenterDate] = useState(selectedDate);
  const [direction, setDirection] = useState(0);

  const getDates = (base) => [
    subDays(base, 1),
    base,
    addDays(base, 1),
  ];

  const [dates, setDates] = useState(getDates(centerDate));

  const handleSlide = (dir) => {
    if (dir === 1 && isToday(centerDate)) return;

    setDirection(dir);
    const newCenter = dir === 1
      ? addDays(centerDate, 1)
      : subDays(centerDate, 1);

    setTimeout(() => {
      setCenterDate(newCenter);
      console.log(newCenter)
      setSelectedDate(newCenter)
      setDates(getDates(newCenter));
    }, 300);
  };

  const slideVariants = {
    initial: (dir) => ({ x: dir * 100, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: -dir * 100, opacity: 0 }),
  };

  const isTodayCenter = isToday(centerDate);

  return (
        <div className="flex flex-col items-center w-[70%] h-12  p-4 space-y-4 bg-[#52b788] text-white fixed z-10 top-2 rounded-3xl">
            <div className="flex items-center gap-6 justify-around absolute bottom-2 w-[50%]">
                {/* Left Button */}
                <button
                onClick={() => handleSlide(-1)}
                className="text-xl px-3 py-1 rounded hover:cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </button>

                {/* Date Slider */}
                <div className="relative w-full h-6 overflow-hidden flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                    key={centerDate.toDateString()}
                    custom={direction}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="flex gap-6 items-center absolute w-full justify-center"
                    >
                    {dates.map((date, idx) => (
                        <div
                        key={date.toString()}
                        className={`w-[80%] text-center text-lg transition-all duration-300 m-3 ${
                            idx === 1
                            ? 'font-bold scale-110'
                            : 'text-white scale-95'
                        }`}
                        >
                        {format(date, 'MMM dd')}
                        </div>
                    ))}
                    </motion.div>
                </AnimatePresence>
                </div>

                {/* Right Button */}
                <button
                onClick={() => handleSlide(1)}
                disabled={isTodayCenter}
                className={`text-xl px-3 py-1 rounded transition-colors duration-200 ${
                    isTodayCenter
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'hover:cursor-pointer'
                }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>

                </button>
            </div>
        </div>
  );
};

export default DateSlider;
