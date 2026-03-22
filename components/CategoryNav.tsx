'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { id: 1, name: 'Facebook', icon: '📘' },
  { id: 2, name: 'Instagram', icon: '📷' },
  { id: 3, name: 'TikTok', icon: '🎵' },
  { id: 4, name: 'Twitter', icon: '🐦' },
  { id: 5, name: 'YouTube', icon: '📺' },
  { id: 6, name: 'Discord', icon: '💬' },
  { id: 7, name: 'Reddit', icon: '🎭' },
  { id: 8, name: 'Snapchat', icon: '👻' },
  { id: 9, name: 'VPN', icon: '🔒' },
  { id: 10, name: 'Email', icon: '📧' },
];

export default function CategoryNav() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(1);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('category-scroll');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-800">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">
          Shop by Categories
        </h3>

        <div className="relative">
          {/* Scroll Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Categories Scroll Container */}
          <div 
            id="category-scroll"
            className="flex gap-4 overflow-x-auto no-scrollbar pb-4"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/50'
                    : 'bg-slate-800/50 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className={`text-sm font-medium ${
                  selectedCategory === category.id ? 'text-white' : 'text-slate-300'
                }`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>

          <button 
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}
