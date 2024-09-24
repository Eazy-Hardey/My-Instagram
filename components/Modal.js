"use client";
import { CameraIcon } from "@heroicons/react/24/outline";
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "@firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import {ref, getDownloadURL, uploadString} from "@firebase/storage";
import { db, storage } from "../firebase";

const Modal = ({ isvisible, onClose, user}) => {
  if (!isvisible) return null;
 
  const filePickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const captionRef = useRef(null);

  const UploadPost = async () => {
    if (loading) return;

    setLoading(true);

    // create a post and add to firestore 'posts' collection
    // get the post id for the created post
    // upload the image to firebase storage with the post id
    // get a download URL from the storage and update the post with the image

    const docRef = await addDoc(collection(db, "posts"), {
      uid:user.uid,
      captionRef: captionRef.current.value,
      timestamp: serverTimestamp(),
    });


    const imagRef = ref(storage, `posts/${docRef.id}/image`);

    await uploadString(imagRef, selectedFile, "data_url").then(async snapshot => {
      const downloadURL = await getDownloadURL(imagRef);
      await updateDoc(doc(db, "posts", docRef.id), {
        image: downloadURL,
      });
    })

    onClose();
    setLoading(false);
    setSelectedFile(null);

  };

  const addImageToPost = (e) => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="w-[400px] flex flex-col">
        <button
          className="text-white text-xl place-self-end"
          onClick={() => onClose()}
        >
          close X
        </button>
        <div className="bg-white p-2 rounded-lg">
          <div>
            {selectedFile ? (
              <img
                src={selectedFile}
                className="w-full object-cover max-h-96 cursor-pointer"
                onClick={() => setSelectedFile(null)}
                alt=""
              />
            ) : (
              <div
                onClick={() => filePickerRef.current.click()}
                className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
              >
                <CameraIcon
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
            )}

            <div className="mt-5 sm:mt-6">
              <div className="my-2 text-center w-full text-xl font-semibold">
                Upload a Photo
              </div>

              <div>
                <input
                  ref={filePickerRef}
                  type="file"
                  hidden
                  onChange={addImageToPost}
                />
              </div>

              <div className="my-2">
                <input
                  className="border-none focus:ring-0 w-full text-center"
                  type="text"
                  ref={captionRef}
                  placeholder="Please enter a caption"
                ></input>
              </div>
              <button 
              type="button"
              disabled={!selectedFile}
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:disabled:bg-gray-300"
              onClick={UploadPost}
              >
               {loading ? "Uploading..." : "Upload Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
