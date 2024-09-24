import { useRouter } from 'next/router';
import Header from '../../components/Header';

import { useState} from 'react';
import { sendPasswordResetEmail} from 'firebase/auth';
import { auth, db } from '../../firebase';

function ForgetPassword({ providers }) {
  const [email, setEmail] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarColor, setSnackbarColor] = useState('');

  const router = useRouter();


  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email)
   
      setShowSnackbar(true);
      setSnackbarColor('green');
      router.push('/');
    } catch (error) {
      console.error(error);
      setShowSnackbar(true);
      setSnackbarColor('red');
    }
  };


 

  


  return (
    <>
      <Header />
      <div className='flex flex-col items-center justify-center min-h-screen py-2 -mt-16 px-14 text-center'>
      <div className="w-full max-w-xs">
      
        <p className='font-xs italic'>forgot password?</p>
        <div className='mt-32 '>
          <input
            type='email'
            placeholder='Email'
            className='w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
         
          <button className='w-full bg-blue-500 text-white py-3 rounded-lg focus:outline-none hover:bg-blue-600' onClick={handlePasswordReset}>
            reset password
          </button>
        </div>

      

        <p className='mt-4'>
          Don't have an account?{' '}
          <a href='/auth/signup' className='text-blue-500'>
            Sign up
          </a>
        </p>
      </div>

        </div>
      {showSnackbar && (
        <div
          className={`fixed top-20 right-4 p-4 rounded-lg text-white ${
            snackbarColor === 'green' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {snackbarColor === 'green' ? 'password reset email sent!' : 'invalid email!'}
        </div>
      )}
    </>
  );
}

export default ForgetPassword;