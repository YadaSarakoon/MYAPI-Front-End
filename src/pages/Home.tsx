import { LandingLanguageProvider } from '../features/landing/LandingLanguage';
import { ParcelLanding } from '../features/landing/ParcelLanding';
import { PastelSections } from '../features/landing/PastelSections';

export const Home = () => (
  <LandingLanguageProvider><main className="min-h-screen overflow-x-hidden bg-white font-['Kanit'] text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
    <ParcelLanding />
    <PastelSections />
  </main></LandingLanguageProvider>
);

export default Home;
