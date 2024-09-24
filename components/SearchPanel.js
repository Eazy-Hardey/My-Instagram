import { useRouter } from 'next/router';
import React from 'react';

const SearchPanel = ({ isVisible, users, onClose }) => {
  const router = useRouter();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="overflow-hidden bg-white rounded-md shadow-lg w-11/12 md:w-1/2 h-auto mx-auto flex flex-col text-black font-bold relative">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-800 focus:outline-none"
          onClick={onClose}
        >
          &times;
        </button>

        <ul className="p-4 space-y-4 overflow-y-auto max-h-[80vh]">
          {users.length > 0 ? (
            users.map((user) => {
              const userData = user.data();
              return (
                <li key={user.id} className="cursor-pointer">
                  <div
                    className="flex items-center space-x-4 hover:bg-gray-100 p-2 rounded-md transition-all"
                    onClick={() =>
                      router
                        .push(`/${userData?.username || 'user'}`)
                        .then(() => onClose())
                    }
                  >
                    <img
                      src={userData?.profileImg || '/default-avatar.png'}
                      className="w-10 h-10 rounded-full border p-[2px]"
                      alt={`${userData?.username}'s profile`}
                    />
                    <div className="flex flex-col">
                      <h2 className="font-semibold text-sm">{userData?.username || 'Unknown User'}</h2>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="text-center text-gray-500">No users found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchPanel;
