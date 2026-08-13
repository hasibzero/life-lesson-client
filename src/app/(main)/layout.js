// app/(main)/layout.js
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar'; // Using the standard Next.js @ alias

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer/>
      
    </div>
  );
}