import { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Post from './Post';
import { db } from '../firebase';

function Posts({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'posts'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        setPosts(snapshot.docs);
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div className="text-red-500">Failed to load posts: {error}</div>;
  }

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post.id}
            id={post.id}
            uid={post.data().uid}
            img={post.data().image || '/default-image.png'} // Fallback for missing image
            caption={post.data().captionRef || 'No caption available'} // Fallback for missing caption
          />
        ))
      ) : (
        <div>No posts available</div>
      )}
    </div>
  );
}

export default Posts;
