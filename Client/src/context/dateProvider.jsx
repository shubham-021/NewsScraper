import React from 'react';
import { useState } from "react";
import DateContext from "./dateContext.jsx"

const DateProvider = ({children}) => {
    const [selectedDate , setSelectedDate] = useState(new Date())

    return (
        <DateContext.Provider value={{selectedDate , setSelectedDate}}>
            {children}
        </DateContext.Provider>
    )
}

export default DateProvider