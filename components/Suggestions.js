import { faker } from '@faker-js/faker';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import { Suggestion } from "./Suggestion"; 
import { onAuthStateChanged } from 'firebase/auth';

export const Suggestions = (user) => {

    const [suggestions, setSuggestions] = useState([]);
    const uid = user?.user?.uid;

    useEffect(() => {
      onSnapshot(query(collection(db, "users"), 
       where("id", "!=", uid)),
      (snapshot) => {
        const users = snapshot.docs.map((doc) => doc.data());
         const randomUsers = getRandomUsers(users, 5); 
       
          
        setSuggestions(randomUsers);
      }
        )
    }, [])
      
  
    const getRandomUsers = (users, limit) => {
      const shuffledUsers = users.sort(() => 0.5 - Math.random());
      return shuffledUsers.slice(0, limit);
    };
    // useEffect(() => {
    //   const users = [...Array(5)].map((_, i) => ({
    //     id: i,
    //     name: faker.name.fullName(),
    //     username: faker.internet.userName(),
    //     avatar: faker.image.avatar(),
    //     gender: faker.name.gender(),
    //     age: faker.datatype.number({ min: 18, max: 65 })
    //   }));
    //   setSuggestions(users);
    // }, [])


     
  return (
    <div className='mt-4 ml-10'>
        <div className='flex justify-between text-sm mb-5'>
            <h3 className='text-sm font-bold text-gray-400'>Suggestions for you</h3>
            <button className='text-gray-600 font-semibold'>See all</button>
        </div>

        {
          suggestions &&  suggestions.map(profile => (
                <div key={profile.id}>

                  
                    <Suggestion uid={uid} id={profile.id} img={profile.profileImg} username={profile.username}/>
                </div>
            ))
        }
    </div>
  )
}
