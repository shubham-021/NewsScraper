import React, { useContext } from "react";
import { useState , useEffect } from "react";
import ArticlesCard from './arcticleCards'
import SideComp from "./sidecomp";
import DateSlider from "./topbar";
import axios from 'axios'
import DateContext from "../context/dateContext";

export default function Cards(){

    const {selectedDate} = useContext(DateContext)

    const [articles , setArticles] = useState([])
    const [loading , setLoading] = useState(true)

    
    


    useEffect(()=>{
        const date = selectedDate.toISOString().split('T')[0]; // "2025-05-11"
        axios.get(`http://localhost:3000/api/articles/:${date}`)
        .then((res) => {
            setArticles(res.data)
            setLoading(false)
        })
        .catch((err) => {
            console.error('Error fetching articles: ' , err)
        })
    },[selectedDate])

    return(
        <div className="h-screen w-screen bg-[#abcdbd] relative flex justify-center items-center ">
            <div className="absolute left-0 top-0">
                <SideComp/>
            </div>
            <DateSlider/>
            {(loading) ? (
            <div className="text-2xl font-bold text-gray-700">
                    Loading Articles...
            </div>
            )
            :(<div className="absolute w-[85%] left-35 top-25 grid grid-cols-2 gap-8 p-2">
                {articles.map((articles , index) => (
                    <ArticlesCard key={index} title={articles.title} link={articles.link} />
                ))}
            </div>)}
        </div>
    )
}