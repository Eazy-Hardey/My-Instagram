import React from 'react';

function Story({ img, username }) {
  return (
    <div className="group flex flex-col items-center cursor-pointer">
      {/* Story Image */}
      <img
        className="h-14 w-14 rounded-full p-[1.5px] border-red-500 border-2 object-cover
          transition-transform duration-200 ease-out group-hover:scale-110 group-hover:rotate-2
          group-focus:ring-2 group-focus:ring-indigo-500"
        src={img}
        alt={`${username}'s story`}
      />
      {/* Username */}
      <p className="text-xs w-14 truncate text-center mt-1 transition-colors duration-200 ease-out
        group-hover:text-red-500">
        {username}
      </p>
    </div>
  );
}

export default Story;
