import React from 'react'
import { useState, useEffect } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from 'firebase/auth';
export const  Suggestion = ({ uid, id, img, username}) => {

    const [hasFollowed, setHasFollowed] = useState(false)
    const [followers, setFollowers] = useState([])
    const [ user, setUser ] = useState(null);
    const [userDocID, setUserDocID] = useState(null);
    const [docID, setDocID] = useState(null);
    

    const getDocID = (id) => {
      onSnapshot(query(collection(db, "users"),where("id", "==", id)),(snapshot) => {
        setDocID(snapshot.docs[0].id);
      })
   
    }

    useEffect(
        () =>{
          onSnapshot(query(
            collection(db, "users"),
            where("id", "==", uid)),
          (snapshot) => setUserDocID(snapshot.docs[0].id)
    
          )
        }
      )

    useEffect(
        () => {
          
          setHasFollowed(followers.findIndex((follow) => follow.id === uid) !== -1);
        
        }, [followers]
      )

     

      useEffect(() => {
        getDocID(id)
        if(docID){
        return onSnapshot(
          collection(db, "users", docID, "followers"),(snapshot) => setFollowers(snapshot.docs)
        )
        }
      }
      )

      const followUser = async () => {
        if (hasFollowed) {
        
        await deleteDoc(doc(db, "users", userDocID, "following", id));
          await deleteDoc(doc(db, "users", docID, "followers", uid));
          
        }else {
          await setDoc(doc(db, "users", docID, "followers", uid), {
            username: user.displayName,
          })

          await setDoc(doc(db, "users", userDocID, "following", id ),{
            username: username
          })

        }
        
      }

      useEffect (() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user);
          }else {
            setUser(null);
          }
        })
      })
    
  return (
    <div className='flex items-center justify-between mt-3'>

                <img src={img} className='w-10 h-10 rounded-full border p-[2px]' alt=''></img>
                <div>
                    <h2 className='font-semibold text-sm'>{username}</h2>
                    <h3 className='text-xs text-gray-400'>Based on people you know</h3>
                </div>
                
                {
                    hasFollowed ? (
                     <button className='text-blue-400 text-sm font-bold w-16' onClick={followUser}>Following</button> ):(
                      <button className='text-blue-400 text-sm font-bold w-16' onClick={followUser}>Follow</button>)
                }
                    
                </div>
  )
}
