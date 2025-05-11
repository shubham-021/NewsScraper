import React from "react";

export default function Hero(){
    return(
        <div className="w-150 h-200 absolute top-35 left-40">
            <span className="font-bold text-5xl tracking-[10px] font-poppins text-[#52b788]">NewsMachine</span> <br/>
            <div className="mt-2 font-poppins text-[18px]">
                is your personal timeline for staying informed. We bring you the latest headlines from trusted sources — organized by date, by category, and built with speed and simplicity in mind. 
                Whether you're a student preparing for competitive exams or just someone who wants to stay updated without the noise, NewsMachine helps you track daily news effortlessly.
                <br /><br/>
                🗓 Browse news by Today, Yesterday, or any past date<br/>
                🧠 Save important headlines to your personal sections<br/>
                <span>⚡</span> Light, fast, and focused only on what matters<br/>
                🔐 Login to sync your saved news across devices<br/><br/>
                We don’t overload you with endless articles — just clean, bite-sized headlines that link directly to the original source. It’s your news, on your schedule.
                <span className="ml-2 font-bold text-xl tracking-[2px] text-[#52b788]">Start scrolling.</span><br/><span className="text-[#52b788] ml-60 font-bold text-xl tracking-[2px]">Stay sharp.</span><br/><span className="ml-80 text-[#52b788] font-bold text-xl tracking-[2px]">Stay ahead.</span>
            </div>
        </div>
    )
}