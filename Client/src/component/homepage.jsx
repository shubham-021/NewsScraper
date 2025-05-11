import React from "react";
import SideComp from './sidecomp'
import Hero from "./hero";

function Home(){
    return(
        <div className="h-screen flex w-full relative bg-[#ffffff] items-center overflow-hidden">
            <SideComp/>
            <Hero/>
            <div className=" absolute h-150 w-150 bg-[url('./assets/10334062.jpg')] bg-cover right-10"></div>
        </div>
    )
}

export default Home