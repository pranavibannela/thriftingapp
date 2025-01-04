import '../styles/globals.css';
import '../styles/pink.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
import { onAuthStateChanged } from "firebase/auth";




export default MyApp;
