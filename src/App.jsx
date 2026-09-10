import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here';

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRoutes />
    </GoogleOAuthProvider>
  );
}

export default App;
