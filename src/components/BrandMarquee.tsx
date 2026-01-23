import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/components/contexts/LanguageContext";
import { Award, ShieldCheck, Sparkles, Crown, Gem, ArrowRight, Star } from "lucide-react";

// Premium luxury brand logos - Curated selection of world's finest beauty brands
// Tier 1: Ultra-Luxury (Haute Couture)
import diorLogo from "@/assets/brands/dior-luxury.png";
import esteeLauderLogo from "@/assets/brands/estee-lauder-luxury.png";
import lancomeLogo from "@/assets/brands/lancome-luxury.png";
import yslLogo from "@/assets/brands/ysl-luxury.png";
import cliniqueLogo from "@/assets/brands/clinique-luxury.png";
import kerastaseLogo from "@/assets/brands/kerastase-luxury.png";

// Tier 2: Premium Professional (Dermatological & Salon)
import laRochePosayLogo from "@/assets/brands/la-roche-posay-luxury.png";
import paulasChoiceLogo from "@/assets/brands/paulas-choice-luxury.png";
import olaplexLogo from "@/assets/brands/olaplex-luxury.png";
import ceraveLogo from "@/assets/brands/cerave-luxury.png";
import theOrdinaryLogo from "@/assets/brands/the-ordinary-luxury.png";

const BRANDS = [
  // Ultra-Luxury Tier
  { 
    name: "Dior", 
    logo: diorLogo, 
    tier: "ultra-luxury",
    category: "Haute Couture",
    description: "French luxury fashion house"
  },
  { 
    name: "Estée Lauder", 
    logo: esteeLauderLogo, 
    tier: "ultra-luxury",
    category: "Luxury Skincare",
    description: "American luxury beauty brand"
  },
  { 
    name: "Lancôme", 
    logo: lancomeLogo, 
    tier: "ultra-luxury",
    category: "French Luxury",
    description: "Parisian elegance since 1935"
  },
  { 
    name: "YSL Beauty", 
    logo: yslLogo, 
    tier: "ultra-luxury",
    category: "Luxury Makeup",
    description: "Yves Saint Laurent beauty"
  },
  { 
    name: "Clinique", 
    logo: cliniqueLogo, 
    tier: "ultra-luxury",
    category: "Dermatologist Tested",
    description: "Allergy tested, fragrance free"
  },
  { 
    name: "Kérastase", 
    logo: kerastaseLogo, 
    tier: "ultra-luxury",
    category: "Luxury Hair Care",
    description: "L'Oréal's premium hair care"
  },
  // Premium Professional Tier
  { 
    name: "La Roche-Posay", 
    logo: laRochePosayLogo, 
    tier: "premium",
    category: "Dermatological",
    description: "French pharmacy skincare"
  },
  { 
    name: "Paula's Choice", 
    logo: paulasChoiceLogo, 
    tier: "premium",
    category: "Science-Based",
    description: "Evidence-based skincare"
  },
  { 
    name: "Olaplex", 
    logo: olaplexLogo, 
    tier: "premium",
    category: "Hair Repair",
    description: "Bond-building technology"
  },
  { 
    name: "CeraVe", 
    logo: ceraveLogo, 
    tier: "premium",
    category: "Dermatologist Recommended",
    description: "Developed with dermatologists"
  },
  { 
    name: "The Ordinary", 
    logo: theOrdinaryLogo, 
    tier: "premium",
    category: "Clinical Formulations",
    description: "Clinical formulations with integrity"
  },
];

export const BrandMarquee = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="w-full bg-gradient-to-b from-cream via-background to-cream/30 py-20 md:py-28 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-burgundy/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Elegant Header with Premium Icons - Enhanced */}
        <div className="text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-gold/60 to-gold/80 animate-expand-horizontal" />
            <div className="relative flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-gold/70 animate-pulse" />
              <div className="relative">
                <Crown className="w-10 h-10 md:w-12 md:h-12 text-gold drop-shadow-[0_2px_12px_rgba(212,175,55,0.5)] animate-float-slow" strokeWidth={1.5} />
                <div className="absolute inset-0 bg-gold/30 rounded-full blur-2xl animate-pulse" />
                <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl scale-150 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              <Star className="w-5 h-5 text-gold/70 animate-spin-slow" style={{ animationDuration: '6s' }} />
            </div>
            <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent via-gold/60 to-gold/80 animate-expand-horizontal" style={{ animationDelay: '0.3s' }} />
          </div>
          <p className="font-serif text-xs md:text-sm uppercase tracking-[0.4em] text-muted-foreground/80">
            {isAr ? "موزع معتمد للعلامات الفاخرة" : "Authorized Luxury Retailer"}
          </p>
        </div>
        
        {/* Luxury Brand Grid - Enhanced with 3D Effects */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 md:gap-7">
          {BRANDS.map((brand, index) => {
            const isHovered = hoveredIndex === index;
            return (
              <div
                key={brand.name}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative flex items-center justify-center p-7 md:p-9 
                           bg-gradient-to-br from-white via-cream/50 to-white
                           backdrop-blur-md rounded-2xl
                           border border-gold/25 
                           shadow-[0_6px_30px_-4px_rgba(212,175,55,0.1)]
                           hover:shadow-[0_16px_50px_-4px_rgba(212,175,55,0.35),0_0_0_1px_rgba(212,175,55,0.3)]
                           hover:border-gold/90
                           transition-all duration-700 ease-out
                           hover:-translate-y-4 hover:scale-[1.05]
                           overflow-hidden
                           transform-gpu
                           animate-fade-in-up"
                style={{ 
                  animationDelay: `${index * 80}ms`,
                  transform: isHovered ? 'translateY(-16px) scale(1.05) rotateY(2deg)' : 'translateY(0) scale(1) rotateY(0deg)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-light/30 via-gold/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-tl from-burgundy/10 via-transparent to-gold/10" />
                </div>

                {/* Magical Shimmer Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                                  -translate-x-full group-hover:translate-x-full 
                                  transition-transform duration-[2000ms] ease-in-out" />
                </div>
                
                {/* Tier Badge for Ultra-Luxury - Enhanced */}
                {brand.tier === "ultra-luxury" && (
                  <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 
                                  transform scale-0 group-hover:scale-100 rotate-12
                                  transition-all duration-700 ease-out z-20">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gold/60 rounded-full blur-xl animate-pulse scale-150" />
                      <div className="relative w-10 h-10 rounded-full 
                                      bg-gradient-to-br from-gold via-gold-light to-gold
                                      flex items-center justify-center
                                      shadow-[0_6px_20px_rgba(212,175,55,0.7)]
                                      border-2 border-gold/60
                                      animate-bounce-slow">
                        <Crown className="w-5 h-5 text-burgundy" strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating Sparkle Particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                  {[...Array(6)].map((_, i) => (
                    <Sparkles 
                      key={i}
                      className={`absolute w-3 h-3 text-gold/0 
                                 group-hover:text-gold/70 
                                 transition-all duration-700 group-hover:animate-pulse`}
                      style={{
                        top: `${20 + i * 15}%`,
                        left: `${15 + i * 12}%`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Brand Logo with 3D Transform */}
                <div className="relative z-10 flex flex-col items-center justify-center transform-gpu" style={{
                  transform: isHovered ? 'perspective(1000px) rotateX(-5deg) rotateY(5deg) scale(1.1)' : 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                  <img
                    src={brand.logo}
                    alt={`${brand.name} - ${brand.description || brand.category}`}
                    className="relative h-12 md:h-14 lg:h-16 w-auto max-w-full object-contain 
                               filter grayscale-[25%] opacity-80
                               group-hover:grayscale-0 group-hover:opacity-100
                               transition-all duration-700 ease-out
                               group-hover:brightness-110
                               will-change-transform
                               drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                               group-hover:drop-shadow-[0_8px_24px_rgba(212,175,55,0.4)]"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent && !parent.querySelector('.brand-fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'brand-fallback flex flex-col items-center gap-2';
                        const nameSpan = document.createElement('span');
                        nameSpan.className = 'font-serif text-sm md:text-base font-semibold text-foreground/90 tracking-wider group-hover:text-burgundy transition-colors duration-300';
                        nameSpan.textContent = brand.name;
                        const descSpan = document.createElement('span');
                        descSpan.className = 'text-[10px] text-foreground/50 uppercase tracking-widest';
                        descSpan.textContent = brand.category || '';
                        fallback.appendChild(nameSpan);
                        fallback.appendChild(descSpan);
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                  {/* Enhanced Category Label */}
                  {brand.category && (
                    <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 
                                    transform translate-y-4 group-hover:translate-y-0
                                    transition-all duration-500 ease-out
                                    text-[10px] uppercase tracking-[0.25em] text-gold/80 font-semibold
                                    whitespace-nowrap">
                      {brand.category}
                    </span>
                  )}
                </div>

                {/* Magnetic Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/0 via-gold/0 to-gold/0 
                                group-hover:from-gold/20 group-hover:via-gold/10 group-hover:to-gold/20 
                                transition-all duration-700 blur-xl opacity-0 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>

        {/* Enhanced View All Brands Button */}
        <div className="flex justify-center mt-14 md:mt-18">
          <Link
            to="/brands"
            className="group relative inline-flex items-center gap-4 px-10 py-5
                       bg-gradient-to-r from-burgundy via-burgundy-dark to-burgundy
                       hover:from-burgundy-dark hover:via-burgundy hover:to-burgundy-dark
                       text-cream font-semibold tracking-wider uppercase text-sm
                       rounded-full overflow-hidden
                       shadow-[0_6px_25px_-4px_rgba(74,14,25,0.5)]
                       hover:shadow-[0_12px_40px_-4px_rgba(74,14,25,0.7),0_0_0_1px_rgba(212,175,55,0.3)]
                       transition-all duration-500 ease-out
                       hover:scale-110 hover:-translate-y-2
                       transform-gpu"
          >
            {/* Multi-layer Shimmer */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                            bg-gradient-to-r from-transparent via-white/25 to-transparent
                            transition-transform duration-1000 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Button Content */}
            <Crown className="w-6 h-6 text-gold drop-shadow-[0_2px_8px_rgba(212,175,55,0.6)] animate-pulse" strokeWidth={1.5} />
            <span className="relative">
              {isAr ? "استكشف جميع العلامات التجارية" : "View All Brands"}
            </span>
            <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
            
            {/* Decorative Sparkles */}
            <Sparkles className="absolute top-2 right-4 w-4 h-4 text-gold/70 opacity-0 
                                 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
            <Star className="absolute bottom-2 left-4 w-3 h-3 text-gold/50 opacity-0 
                             group-hover:opacity-100 transition-opacity duration-700 animate-spin-slow" style={{ animationDuration: '4s' }} />
          </Link>
        </div>

        {/* Enhanced Bottom Decorative Element */}
        <div className="flex items-center justify-center gap-4 mt-14 md:mt-18">
          <div className="h-px w-20 md:w-32 bg-gradient-to-r from-transparent via-gold/50 to-gold/70 animate-expand-horizontal" />
          <div className="flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-gold/10 via-gold/15 to-gold/10 rounded-full border border-gold/30 backdrop-blur-sm shadow-[0_4px_15px_rgba(212,175,55,0.2)]">
            <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-gold drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)] animate-pulse" strokeWidth={1.5} />
            <span className="text-gold text-xs md:text-sm font-semibold tracking-[0.35em] uppercase">
              {isAr ? "أصالة مضمونة" : "Authenticity Guaranteed"}
            </span>
            <Award className="w-6 h-6 md:w-7 md:h-7 text-gold drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)] animate-pulse" style={{ animationDelay: '0.5s' }} strokeWidth={1.5} />
          </div>
          <div className="h-px w-20 md:w-32 bg-gradient-to-l from-transparent via-gold/50 to-gold/70 animate-expand-horizontal" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </section>
  );
};
