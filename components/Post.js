import {
  BookmarkIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  PaperAirplaneIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { addDoc, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { useState, useEffect, useCallback } from "react";
import Moment from 'react-moment';
import { onAuthStateChanged } from "firebase/auth";
import InputEmoji from "react-input-emoji";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/24/solid";

function Post({ id, uid, img, caption }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [posterData, setPosterData] = useState(null);

  // Fetch comments
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts", id, "comments"), orderBy("timestamp", "desc")),
      (snapshot) => setComments(snapshot.docs),
      (error) => console.error("Error fetching comments:", error)
    );
    return () => unsubscribe();
  }, [id]);

  // Fetch poster data
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "users"), where("id", "==", uid)),
      (snapshot) => setPosterData(snapshot.docs[0]),
      (error) => console.error("Error fetching poster data:", error)
    );
    return () => unsubscribe();
  }, [uid]);

  // Fetch likes
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
      setLikes(snapshot.docs);
      setHasLiked(snapshot.docs.some((like) => like.id === user?.uid));
    });
    return () => unsubscribe();
  }, [id, user]);

  // Auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Like post
  const likePost = useCallback(async () => {
    try {
      if (hasLiked) {
        await deleteDoc(doc(db, "posts", id, "likes", user.uid));
      } else {
        await setDoc(doc(db, "posts", id, "likes", user.uid), {
          username: user.displayName,
        });
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }, [hasLiked, id, user]);

  // Delete post
  const deletePost = useCallback(async () => {
    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }, [id]);

  // Send comment
  const sendComment = useCallback(async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const commentToSend = comment;
      setComment("");
      try {
        await addDoc(collection(db, "posts", id, "comments"), {
          comment: commentToSend,
          username: user.displayName,
          userImage: user.photoURL,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error sending comment:", error);
      }
    }
  }, [comment, id, user]);

  return (
    <div className="bg-white my-7 border rounded-sm w-full object-cover">
      {/* Header */}
      <div className="flex items-center p-5">
        <img
          src={posterData?.data().profileImg}
          className="rounded-full h-12 w-12 border p-1 mr-3 object-cover"
          alt=""
        />
        <a href={`/${posterData?.data().username}`} className="flex-1 font-semibold">{posterData?.data().username}</a>
        {user?.uid === uid ? (
          <XCircleIcon className="h-5 cursor-pointer" onClick={deletePost} />
        ) : (
          <EllipsisHorizontalIcon className="h-5" />
        )}
      </div>
      <img src={img} className="object-cover w-[800px] max-h-[800px]" alt="" />
      {user && (
        <div className="flex justify-between px-4 pt-4">
          <div className="flex space-x-4">
            {hasLiked ? (
              <HeartIconFilled className="btn text-red-700" onClick={likePost} />
            ) : (
              <HeartIcon className="btn" onClick={likePost} />
            )}
            <ChatBubbleOvalLeftEllipsisIcon className="btn" />
            <PaperAirplaneIcon className="btn" />
          </div>
          <BookmarkIcon className="btn" />
        </div>
      )}
      <p className="p-5 truncate">
        {likes.length > 0 && (
          <p className="font-bold mb-1">{likes.length} {likes.length === 1 ? "Like" : "Likes"}</p>
        )}
        <span className="font-semibold mr-2">{posterData?.data().username}</span>
        {caption}
      </p>
      {comments.length > 0 && (
        <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-center space-x-2 mb-3">
              <img className="h-7 w-7 rounded-full object-cover" src={comment.data().userImage} alt="" />
              <span className="font-semibold text-sm">{comment.data().username}</span>
              <p>{comment.data().comment}</p>
              <Moment fromNow className="pr-5 text-xs text-gray-600">
                {comment.data().timestamp?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}
      {user && (
        <form className="flex items-center p-4" onSubmit={sendComment}>
          <InputEmoji
            type="text"
            value={comment}
            onChange={setComment}
            placeholder="Add a comment..."
            className="border-none flex-1 focus:ring-0 outline-none"
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            className="font-semibold text-blue-400"
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
