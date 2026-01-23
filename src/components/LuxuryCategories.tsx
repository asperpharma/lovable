import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/components/contexts/LanguageContext";
import { Sparkles, Star, Gem, Heart } from "lucide-react";

const CATS = [
  { 
    name: "Skin", 
    nameAr: "البشرة",
    img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80",
    href: "/shop?category=Skin%20Care",
    icon: Heart,
    color: "from-rose-400/20 to-pink-300/20"
  },
  { 
    name: "Hair", 
    nameAr: "الشعر",
    img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=400&q=80",
    href: "/shop?category=Hair%20Care",
    icon: Sparkles,
    color: "from-amber-400/20 to-yellow-300/20"
  },
  { 
    name: "Makeup", 
    nameAr: "المكياج",
    img: "https://images.unsplash.com/photo-1522338228045-9b68e7751395?auto=format&fit=crop&w=400&q=80",
    href: "/shop?category=Makeup",
    icon: Star,
    color: "from-purple-400/20 to-pink-300/20"
  },
  { 
    name: "Fragrance", 
    nameAr: "العطور",
    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80",
    href: "/shop?category=Fragrances",
    icon: Gem,
    color: "from-cyan-400/20 to-blue-300/20"
  },
  { 
    name: "Body", 
    nameAr: "الجسم",
    img: "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=400&q=80",
    href: "/shop?category=Body%20Care",
    icon: Heart,
    color: "from-emerald-400/20 to-teal-300/20"
  },
];

export const LuxuryCategories = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-background via-cream/30 to-background overflow-x-auto relative">
      {/* Background Magical Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-burgundy/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 relative">
            <span className="relative z-10">
              {isAr ? "اكتشف مجموعاتنا" : "Discover Our Collections"}
            </span>
            {/* Text glow */}
            <span className="absolute inset-0 text-gold/10 blur-2xl text-4xl md:text-5xl lg:text-6xl">
              {isAr ? "اكتشف مجموعاتنا" : "Discover Our Collections"}
            </span>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-gold/60 to-gold/80 animate-expand-horizontal" />
            <div className="relative">
              <Sparkles className="w-6 h-6 text-gold/70 animate-pulse" />
              <div className="absolute inset-0 bg-gold/20 rounded-full blur-lg animate-pulse" />
            </div>
            <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent via-gold/60 to-gold/80 animate-expand-horizontal" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>

        {/* Enhanced Category Cards with 3D Effects */}
        <div className="flex justify-center items-center gap-8 md:gap-12 lg:gap-16 min-w-[600px]">
          {CATS.map((c, index) => {
            const isHovered = hoveredIndex === index;
            const Icon = c.icon;
            
            return (
              <Link 
                key={c.name} 
                to={c.href} 
                className="group flex flex-col items-center gap-6 animate-fade-in-up transform-gpu"
                style={{ animationDelay: `${index * 120}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Magical Category Circle with 3D Transform */}
                <div className="relative" style={{
                  transform: isHovered 
                    ? 'perspective(1000px) rotateY(10deg) rotateX(-5deg) scale(1.15)' 
                    : 'perspective(1000px) rotateY(0) rotateX(0) scale(1)',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                  {/* Outer Glow Rings - Multiple Layers */}
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${c.color} 
                                  opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 
                                  scale-150 group-hover:scale-200`} />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/20 via-gold/10 to-transparent 
                                  opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 
                                  scale-125 group-hover:scale-175" />
                  
                  {/* Main Circle with Enhanced Styling */}
                  <div className={`relative w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden 
                                  border-3 border-gold/30 group-hover:border-gold/80
                                  shadow-[0_8px_30px_rgba(212,175,55,0.15)]
                                  group-hover:shadow-[0_16px_50px_rgba(212,175,55,0.4),0_0_0_2px_rgba(212,175,55,0.2)]
                                  transition-all duration-700 ease-out
                                  group-hover:scale-110
                                  p-1.5 bg-gradient-to-br from-white via-cream/50 to-white
                                  transform-gpu`}>
                    
                    {/* Multi-layer Shimmer Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent 
                                      -translate-x-full group-hover:translate-x-full 
                                      transition-transform duration-[2000ms] ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                    
                    {/* Category Image with Parallax */}
                    <img 
                      src={c.img} 
                      className="relative w-full h-full object-cover rounded-full 
                                 filter brightness-90 group-hover:brightness-115 saturate-110
                                 transition-all duration-700
                                 transform-gpu"
                      style={{
                        transform: isHovered ? 'scale(1.1) rotate(2deg)' : 'scale(1) rotate(0deg)',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      alt={isAr ? c.nameAr : c.name}
                      loading="lazy"
                    />
                    
                    {/* Icon Overlay - Appears on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gold/30 rounded-full blur-xl animate-pulse" />
                        <div className="relative bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                          <Icon className="w-6 h-6 text-gold animate-pulse" />
                        </div>
                      </div>
                    </div>

                    {/* Floating Particles */}
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-gold/40 blur-sm opacity-0 group-hover:opacity-100 animate-float"
                        style={{
                          width: `${Math.random() * 3 + 2}px`,
                          height: `${Math.random() * 3 + 2}px`,
                          left: `${20 + i * 30}%`,
                          top: `${20 + i * 30}%`,
                          animationDelay: `${i * 0.3}s`,
                          animationDuration: `${Math.random() * 2 + 2}s`,
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Floating Decorative Elements */}
                  <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 
                                  transform translate-y-4 group-hover:translate-y-0 rotate-12
                                  transition-all duration-700 ease-out z-20">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gold/40 rounded-full blur-md animate-pulse scale-150" />
                      <div className="relative w-8 h-8 rounded-full 
                                      bg-gradient-to-br from-gold via-gold-light to-gold
                                      flex items-center justify-center
                                      shadow-[0_4px_15px_rgba(212,175,55,0.6)]
                                      border border-gold/50">
                        <Star className="w-4 h-4 text-burgundy animate-spin-slow" style={{ animationDuration: '3s' }} />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Category Name with Animation */}
                <span className="font-serif text-xl md:text-2xl text-foreground/90 italic 
                               group-hover:text-gold-500 transition-colors duration-500
                               relative transform-gpu"
                      style={{
                        transform: isHovered ? 'translateY(-4px) scale(1.05)' : 'translateY(0) scale(1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}>
                  {isAr ? c.nameAr : c.name}
                  {/* Animated Underline */}
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 
                                 group-hover:w-full transition-all duration-700 ease-out
                                 shadow-[0_2px_8px_rgba(212,175,55,0.5)]" />
                  {/* Text Glow */}
                  <span className="absolute inset-0 text-gold/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {isAr ? c.nameAr : c.name}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LuxuryCategories;
