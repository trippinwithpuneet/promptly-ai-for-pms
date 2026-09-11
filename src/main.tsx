import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import '@fontsource/archivo-black/400.css'
import '@fontsource/hind/400.css'
import '@fontsource/hind/500.css'
import '@fontsource/hind/600.css'
import './index.css'

const root = document.getElementById("root");

if (root) createRoot(root).render(<App />);
