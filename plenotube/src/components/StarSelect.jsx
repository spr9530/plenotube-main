import React, { memo } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

const StarSelect = memo(function StarSelect({ rating, hover, onEnter, onLeave, onClick }) {
    return (
        <div className="flex gap-1" onMouseLeave={onLeave}>
            {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1;
                const active = value <= (hover || rating);

                return (
                    <span
                        key={value}
                        onMouseEnter={() => onEnter(value)}
                        onClick={() => onClick(value)}
                    >
                        {active ? (
                            <FaStar className="text-yellow-400 text-xl cursor-pointer" />
                        ) : (
                            <FaRegStar className="text-yellow-400 text-xl cursor-pointer" />
                        )}
                    </span>
                );
            })}
        </div>
    );
});

export default StarSelect;
