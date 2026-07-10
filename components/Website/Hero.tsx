"use client";

import React from "react";
import { Clock, User, ArrowUpRight } from "lucide-react";

export default function Hero() {
  const secondaryStories = [
    {
      category: "Politics",
      headline: "Coalition Talks Deepen As Parliament Convenes For Key General Budget Framework",
      date: "July 10, 2026",
      image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80"
    },
    {
      category: "Business",
      headline: "Crypto Regulations Framework Solidified Across Major G20 Banking Institutions",
      date: "July 10, 2026",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80"
    },
    {
      category: "Sports",
      headline: "Grand Slam Semifinals Set Stage For Historic Generation Clash At Center Court",
      date: "July 10, 2026",
      image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <section className="w-full bg-[#FFFFFF] py-6 sm:py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* Responsive Grid Matrix Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 xl:grid-cols-10 gap-6">
          
          {/* ================= LEFT SIDE: FEATURED MASSIVE CARD (70%) ================= */}
          <div className="md:col-span-3 xl:col-span-7 flex flex-col justify-between">
            <div className="group relative w-full aspect-[16/10] overflow-hidden rounded-md bg-neutral-900 shadow-xl cursor-pointer">
              
              {/* Image with Hardware Accelerated Smooth Zoom */}
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
                alt="India Satellite Launch Hardware"
                className="w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-105 will-change-transform opacity-85"
                loading="eager"
              />
              
              {/* Deep Linear Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
              
              {/* Top Utility Indicator Layer */}
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-[#DC2626] text-white font-extrabold text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-md">
                  Science & Tech
                </span>
              </div>

              {/* Core Context Content Container */}
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8 z-20 flex flex-col justify-end">
                <div className="flex flex-wrap items-center gap-4 text-neutral-300 font-semibold text-xs mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>Aravind Swaminathan</span>
                  </div>
                  <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full" />
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>4 Min Read</span>
                  </div>
                  <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full hidden sm:inline" />
                  <span className="hidden sm:inline">July 10, 2026</span>
                </div>

                <h1 className="text-white font-sans font-black text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-[1.15] tracking-tight max-w-4xl group-hover:text-neutral-100 transition-colors">
                  India Successfully Launches Advanced Next-Generation Communication Satellite Into Orbit
                </h1>
                
                <p className="text-neutral-300 mt-3 text-sm md:text-base max-w-2xl line-clamp-2 font-normal hidden sm:block">
                  The deep-space deployment marks a monumental leap forward for local infrastructure, bolstering sovereign secure network routing and remote regional connectivity arrays across the subcontinent.
                </p>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE: COMPACT NEWS CHANNELS (30%) ================= */}
          <div className="md:col-span-2 xl:col-span-3 flex flex-col gap-4 justify-between">
            {secondaryStories.map((story, index) => (
              <div 
                key={index}
                className="group relative flex-1 min-h-[140px] flex overflow-hidden rounded-md bg-neutral-900 border border-neutral-100 shadow-lg cursor-pointer transform hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Micro Background Panel */}
                <img 
                  src={story.image} 
                  alt={story.headline}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-105 will-change-transform opacity-40 group-hover:opacity-50"
                />
                
                {/* Micro Dark Wash */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/30 z-10" />

                {/* Vertical Interactive Edge Line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#DC2626] transform scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300 z-30" />

                {/* Text Framing Meta Layer */}
                <div className="relative p-4 flex flex-col justify-between items-start z-20 w-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white bg-black/40 border border-white/20 px-2 py-0.5 rounded-sm">
                    {story.category}
                  </span>

                  <div className="mt-2.5">
                    <h3 className="text-white font-bold text-[14px] sm:text-[15px] leading-snug line-clamp-2 tracking-wide group-hover:text-red-200 transition-colors pr-4">
                      {story.headline}
                    </h3>
                  </div>

                  <div className="w-full flex items-center justify-between text-[11px] font-bold text-neutral-400 mt-2">
                    <span>{story.date}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}