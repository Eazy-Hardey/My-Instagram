import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';
import Story from './Story';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export default function Stories() {
  const [suggestions, setSuggestions] = useState([]);
  const [user, setUser] = useState(null);

  // Generate random users for stories
  useEffect(() => {
    const users = Array.from({ length: 20 }, () => ({
      id: faker.datatype.uuid(),
      name: faker.name.fullName(),
      username: faker.internet.userName(),
      avatar: faker.image.avatar(),
      gender: faker.name.gender(),
      age: faker.datatype.number({ min: 18, max: 65 }),
    }));
    setSuggestions(users);
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser || null);
    });
    return () => unsubscribe(); // Clean up on unmount
  }, []);

  return (
    <div className="flex space-x-2 p-6 bg-white mt-8 border-gray-200 border rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-black">
      {/* Render the authenticated user's story if available */}
      {user && (
        <Story img={user.photoURL || '/default-avatar.png'} username={user.displayName || 'Anonymous'} />
      )}

      {/* Render random stories */}
      {suggestions.length > 0 ? (
        suggestions.map((profile) => (
          <Story key={profile.id} img={profile.avatar} username={profile.username} />
        ))
      ) : (
        <p className="text-gray-500 text-center">No stories available</p>
      )}
    </div>
  );
}
