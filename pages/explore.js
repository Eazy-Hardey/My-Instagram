import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import Header from '../components/Header';

function ExplorePage() {
  const [posts, setPosts] = useState([]);

  // Fetch posts from Firestore's "posts" collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      setPosts(snapshot.docs);
    });

    // Cleanup the snapshot listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Header />

      <div className='grid grid-cols-3 gap-3 md:gap-6 p-4'>
        {/* Map through the posts and display the image */}
        {posts.map((post) => (
          <img
            key={post.id}
            src={post.data().image}
            alt="Post"
            className='object-cover w-full h-32 md:h-64 lg:h-80'
          />
        ))}
      </div>
    </>
  );
}

export default ExplorePage;
