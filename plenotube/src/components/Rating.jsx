import React from 'react'

import { FaStar, FaRegStar } from "react-icons/fa";

function Rating({ rating }) {
  const totalStars = 5;

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: totalStars }, (_, index) => {
        const starValue = index + 1; 
        return starValue <= rating ? (
          <FaStar key={index} className="text-yellow-400" />
        ) : (
          <FaRegStar key={index} className="text-yellow-400" />
        );
      })}
    </div>
  );
}

export default Rating;
