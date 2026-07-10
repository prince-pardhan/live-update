"use client";

import React, { useState, useEffect } from "react";
import { 
  MapPin, CloudSun, Search, Menu, X, ChevronRight, Volume2 
} from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [activeTab, setActiveTab] = useState("Home");

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(new Date().toLocaleDateString('en-US', options));
  }, []);

  const navItems = [
    "Home", "India", "World", "Politics", "Business", 
    "Technology", "Sports", "Entertainment", "Lifestyle"
  ];

  const breakingNews = [
    "India successfully launches next-gen communication satellite GSAT-20 into orbit.",
    "Global Markets rally as inflation cools down faster than central bank projections.",
    "Tech Titan announces $2 Billion infrastructure investment in New Delhi digital hub.",
    "BCCI unveils highly anticipated schedule for the upcoming international test series."
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-[#FFFFFF] shadow-md">
      {/* 1. Top Black Info Bar */}
      <div className="w-full bg-[#0F0F0F] text-[#FFFFFF] text-[12px] font-medium border-b border-neutral-800 hidden md:block">
        <div className="max-w-[1400px] mx-auto px-4 h-10 flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-5 text-neutral-300">
            <span>{currentDate}</span>
            <span className="w-px h-3 bg-neutral-700" />
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>New Delhi, India</span>
            </div>
            <span className="w-px h-3 bg-neutral-700" />
            <div className="flex items-center gap-1.5">
              <CloudSun className="w-3.5 h-3.5 text-amber-400" />
              <span>32°C / 90°F</span>
            </div>
          </div>

          {/* Right Links & Socials */}
          <div className="flex items-center gap-6 text-neutral-300">
            <div className="flex items-center gap-4 border-r border-neutral-700 pr-5">
              <a href="#" className="hover:text-[#DC2626] transition-colors">About Us</a>
              <a href="#" className="hover:text-[#DC2626] transition-colors">Advertise</a>
              <a href="#" className="hover:text-[#DC2626] transition-colors">Contact</a>
            </div>
            {/* <div className="flex items-center gap-3.5">
              <a href="#" className="hover:text-[#DC2626] transition-all hover:scale-110"><Facebook className="w-3.5 h-3.5" /></a>
              <a href="#" className="hover:text-[#DC2626] transition-all hover:scale-110"><Twitter className="w-3.5 h-3.5" /></a>
              <a href="#" className="hover:text-[#DC2626] transition-all hover:scale-110"><Instagram className="w-3.5 h-3.5" /></a>
              <a href="#" className="hover:text-[#DC2626] transition-all hover:scale-110"><Youtube className="w-3.5 h-3.5" /></a>
            </div> */}
          </div>
        </div>
      </div>

      {/* 2. Main Navbar */}
      <div className="w-full border-b border-neutral-200 backdrop-blur-md bg-white/95 sticky top-0">
        <div className="max-w-[1400px] mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo Brand Frame */}
          <div className="flex flex-col justify-center select-none group cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#DC2626] flex items-center justify-center text-white font-black text-lg tracking-tighter transform group-hover:rotate-6 transition-transform">
                T
              </div>
              <span className="font-serif text-2xl md:text-3xl font-black tracking-tight text-[#0F0F0F]">
                LIVE<span className="text-[#DC2626]">UPDATE</span>
              </span>
            </div>
            <span className="text-[10px] tracking-[0.18em] uppercase font-bold text-neutral-500 mt-0.5 pl-9 hidden sm:block">
              Independent. Verifiable. Global.
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`px-3 py-2 text-[14px] font-bold uppercase tracking-wider transition-all relative group rounded-sm ${
                  activeTab === item ? "text-[#DC2626]" : "text-[#0F0F0F] hover:text-[#DC2626]"
                }`}
              >
                {item}
                <span className={`absolute bottom-0 left-3 right-3 h-[2px] bg-[#DC2626] transition-transform duration-300 origin-left ${
                  activeTab === item ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
              </button>
            ))}
          </nav>

          {/* System Control Panel */}
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-full hover:bg-neutral-100 text-[#0F0F0F] transition-colors" aria-label="Search articles">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-full hover:bg-neutral-100 text-[#0F0F0F] transition-colors lg:hidden"
              aria-label="Toggle structural menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Breaking News Bar */}
      <div className="w-full bg-[#F5F5F5] border-b border-neutral-200 overflow-hidden h-11 flex items-center">
        <div className="max-w-[1400px] mx-auto px-4 w-full flex items-center justify-between">
          <div className="flex items-center flex-1 overflow-hidden">
            <div className="bg-[#DC2626] text-white font-black text-[11px] uppercase tracking-widest px-3 py-1 flex items-center gap-1.5 select-none rounded-sm shrink-0 shadow-sm z-10 animate-pulse">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Breaking</span>
            </div>
            
            {/* Infinite Horizontal News Loop */}
            <div className="relative w-full overflow-hidden mask-linear-side ml-4">
              <div className="flex gap-20 whitespace-nowrap animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused]">
                {breakingNews.map((text, idx) => (
                  <div key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <span className="w-2 h-2 bg-[#DC2626] rotate-45 group-hover:scale-125 transition-transform" />
                    <span className="text-[13px] font-semibold text-[#0F0F0F] group-hover:text-[#DC2626] transition-colors">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Ticker Controls */}
          <div className="hidden sm:flex items-center gap-1 pl-4 border-l border-neutral-300 ml-4 shrink-0">
            <button className="p-1 text-neutral-500 hover:text-[#0F0F0F] hover:bg-neutral-200 rounded transition-colors">
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
            <button className="p-1 text-neutral-500 hover:text-[#0F0F0F] hover:bg-neutral-200 rounded transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Fullscreen Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[124px] bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="w-[280px] h-full bg-white p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 mb-2">Main Sections</p>
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveTab(item);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left py-2.5 px-3 rounded-md font-bold uppercase tracking-wider text-[14px] transition-all flex items-center justify-between group ${
                    activeTab === item ? "bg-red-50 text-[#DC2626]" : "text-[#0F0F0F] hover:bg-neutral-50"
                  }`}
                >
                  {item}
                  <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all ${activeTab === item ? "opacity-100 text-[#DC2626]" : "text-neutral-400"}`} />
                </button>
              ))}
            </div>
            
            <div className="border-t border-neutral-200 pt-4 mt-auto">
              <div className="flex items-center gap-1.5 text-neutral-600 font-medium text-xs mb-3">
                <MapPin className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>New Delhi, India</span>
              </div>
              {/* <div className="flex justify-around text-neutral-500 pt-2">
                <Facebook className="w-4 h-4 hover:text-[#DC2626]" />
                <Twitter className="w-4 h-4 hover:text-[#DC2626]" />
                <Instagram className="w-4 h-4 hover:text-[#DC2626]" />
                <Youtube className="w-4 h-4 hover:text-[#DC2626]" />
              </div> */}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}