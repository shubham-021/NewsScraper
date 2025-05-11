import React from 'react'
import {BrowserRouter , Routes , Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './component/homepage.jsx'
import TailwindCalendar from './component/calendar.jsx'
import ArticlesCard from './component/arcticleCards.jsx'
import Cards from './component/cardsPage.jsx'
import DateSlider from './component/topbar.jsx'
import DateProvider from './context/dateProvider.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <DateProvider>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/calendar' element={<TailwindCalendar/>}/>
                <Route path='/cardsPage' element={<Cards/>}/>
            </Routes>
        </DateProvider>    
    </BrowserRouter>
)
