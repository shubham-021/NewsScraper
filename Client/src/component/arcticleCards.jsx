import React from "react";

export default function ArticlesCard({title , link}){
    return(
    <div className="h-30 w-full bg-cyan-800 flex p-4 relative rounded-lg shadow-gray-100 shadow-sm text-white text-shadow-neutral-300">
      <p className="text-lg font-semibold">{title}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute text-lg hover:cursor-pointer bottom-2 right-4"
      >
        Read More
      </a>
    </div>
  );
};

