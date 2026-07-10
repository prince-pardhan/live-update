import Navbar from "../components/Website/Navbar";
import Hero from "../components/Website/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />
    </main>
  );
}