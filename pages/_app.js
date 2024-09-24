import { RecoilRoot } from 'recoil';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css'; // Global styles for consistent layout

// Renamed for better clarity and uniqueness
const InstagramCloneApp = ({ Component, pageProps: { session, ...remainingPageProps } }) => {
  return (
    // Provides session context for authentication
    <SessionProvider session={session}>  
      {/* State management for the app using Recoil */}
      <RecoilRoot>
        {/* Render the main component with the remaining page properties */}
        <Component {...remainingPageProps} />  
      </RecoilRoot>
    </SessionProvider>
  );
};

export default InstagramCloneApp;
