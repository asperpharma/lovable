import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Sparkles, Star, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const LuxuryHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToCollection = () => {
    const element = document.getElementById("featured-collection");
    element?.scrollIntoView({
      behavior: "smooth"
    });
  };

  // Parallax offset based on scroll
  const parallaxOffset = scrollY * 0.5;

  return (
    <div 
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden bg-luxury-black"
      style={{
        transform: `translateY(${parallaxOffset}px)`,
      }}
    >
      {/* 1. Magical Multi-Layer Background with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary Background - Parallax Layer 1 */}
        <div 
          className="absolute inset-0 bg-cover bg-center will-change-transform" 
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1920&q=80')`,
            transform: `scale(1.15) translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
            animation: 'kenBurns 25s ease-in-out infinite alternate',
            transition: 'transform 0.1s ease-out',
          }} 
        />
        
        {/* Secondary Overlay - Parallax Layer 2 */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-soft-light will-change-transform" 
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1920&q=80')`,
            transform: `scale(1.2) translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`,
            animation: 'kenBurns 30s ease-in-out infinite alternate-reverse',
            transition: 'transform 0.15s ease-out',
          }} 
        />
        
        {/* Animated Gradient Overlays - Multiple Layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/70 via-luxury-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-burgundy/20 via-transparent to-gold/10" />
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-burgundy/5"
          style={{
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
            transition: 'transform 0.2s ease-out',
          }}
        />
        
        {/* Magical Floating Particles System */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold/40 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-gold/50 rounded-full blur-sm animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-gold/30 rounded-full blur-sm animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        </div>

        {/* Floating Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          <Sparkles className="absolute text-gold/40 animate-sparkle-float" style={{ left: '20%', top: '30%', width: '12px', height: '12px', animationDelay: '0s', animationDuration: '4s' }} />
          <Sparkles className="absolute text-gold/40 animate-sparkle-float" style={{ left: '70%', top: '20%', width: '10px', height: '10px', animationDelay: '1s', animationDuration: '5s' }} />
          <Sparkles className="absolute text-gold/40 animate-sparkle-float" style={{ left: '80%', top: '60%', width: '14px', height: '14px', animationDelay: '2s', animationDuration: '3s' }} />
        </div>

        {/* Animated Orbs - Magical Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-burgundy/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* 2. Hero Content with 3D Parallax Effects */}
      <div 
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        style={{
          transform: `translateZ(0) translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Decorative Elements with Animation */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-60">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60 animate-expand-horizontal" />
          <div className="relative">
            <Sparkles className="w-5 h-5 text-gold/70 animate-spin-slow" style={{ animationDuration: '8s' }} />
            <div className="absolute inset-0 bg-gold/20 rounded-full blur-lg animate-pulse" />
          </div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60 animate-expand-horizontal" style={{ animationDelay: '0.3s' }} />
        </div>
        
        {/* Gold Pre-heading with Magical Entrance */}
        <div className="mb-8 animate-fade-in-up opacity-0 [animation-delay:0.2s]">
          <div className="relative inline-block">
            <span className="relative z-10 inline-flex items-center gap-3 font-sans text-xs md:text-sm font-medium uppercase tracking-[0.4em] text-gold-300">
              <Star className="w-3 h-3 animate-spin-slow text-gold" style={{ animationDuration: '4s' }} />
              <span className="relative">
                The New Collection
                <span className="absolute inset-0 text-gold/30 blur-sm">The New Collection</span>
              </span>
              <Gem className="w-3 h-3 animate-pulse text-gold" />
            </span>
            {/* Glow trail */}
            <div className="absolute inset-0 bg-gold/20 blur-xl animate-pulse" />
          </div>
        </div>

        {/* Main Headline - 3D Text Effect with Glow */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-light leading-[1.1] tracking-tight text-soft-ivory animate-fade-in-up opacity-0 [animation-delay:0.4s] relative">
          <span className="block relative transform-gpu" style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
            transition: 'transform 0.1s ease-out',
          }}>
            Redefining
            {/* Multi-layer glow effect */}
            <span className="absolute -top-2 -left-2 text-gold/20 blur-xl text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] select-none pointer-events-none">
              Redefining
            </span>
            <span className="absolute -top-1 -left-1 text-gold/10 blur-2xl text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] select-none pointer-events-none">
              Redefining
            </span>
          </span>
          <span className="block italic text-gold-300 relative mt-3 transform-gpu" style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * -3}deg) rotateY(${mousePosition.x * -3}deg)`,
            transition: 'transform 0.1s ease-out',
          }}>
            <span className="relative z-10 inline-block">
              Eternal Beauty
              {/* Animated underline */}
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent animate-expand-horizontal" />
            </span>
            <span className="absolute inset-0 text-gold/30 blur-lg italic select-none pointer-events-none">
              Eternal Beauty
            </span>
            <span className="absolute inset-0 text-gold/20 blur-2xl italic select-none pointer-events-none">
              Eternal Beauty
            </span>
          </span>
        </h1>

        {/* Enhanced Subtitle with Fade In */}
        <p className="mt-10 max-w-2xl font-sans text-base md:text-lg lg:text-xl font-light leading-relaxed text-soft-ivory/85 animate-fade-in-up opacity-0 [animation-delay:0.6s]">
          Experience the fusion of nature's finest ingredients and scientific innovation. 
          <span className="block mt-3 text-gold/90 font-medium">A ritual designed for those who demand perfection.</span>
        </p>

        {/* Enhanced Buttons with 3D Effects */}
        <div className="mt-14 flex flex-col items-center gap-6 sm:flex-row animate-fade-in-up opacity-0 [animation-delay:0.8s]">
          {/* Primary CTA - 3D Gold Button */}
          <Button asChild className="group relative overflow-hidden bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 px-12 py-8 font-sans text-sm font-semibold uppercase tracking-widest text-luxury-black transition-all duration-500 hover:from-gold-400 hover:via-gold-500 hover:to-gold-400 hover:shadow-[0_0_50px_rgba(212,175,55,0.8)] hover:scale-110 transform-gpu" style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
            transition: 'all 0.1s ease-out',
          }}>
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-out" />
            {/* Glow pulse */}
            <div className="absolute inset-0 bg-gold/30 rounded-lg blur-xl opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500" />
            <Link to="/shop" className="relative z-10 flex items-center gap-3">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="relative">
                Shop Now
                <span className="absolute inset-0 text-luxury-black/20 blur-sm">Shop Now</span>
              </span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </Button>

          {/* Secondary CTA - Glass Morphism with 3D */}
          <Button variant="outline" className="group relative overflow-hidden border-2 border-soft-ivory/50 bg-soft-ivory/10 backdrop-blur-xl px-12 py-8 font-sans text-sm font-semibold uppercase tracking-widest text-soft-ivory transition-all duration-500 hover:border-gold-300 hover:bg-soft-ivory/25 hover:text-gold-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:scale-110 transform-gpu" style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * -2}deg) rotateY(${mousePosition.x * -2}deg)`,
            transition: 'all 0.1s ease-out',
          }}>
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/15 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 flex items-center gap-3">
              <Sparkles className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity animate-pulse" />
              <span>View Lookbook</span>
            </span>
          </Button>
        </div>
      </div>

      {/* 3. Enhanced Scroll Indicator with Magnetic Effect */}
      <button 
        onClick={scrollToCollection} 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-soft-ivory/60 transition-all duration-300 hover:text-gold-300 animate-fade-in-up opacity-0 [animation-delay:1s] group"
        style={{
          transform: `translateY(${Math.sin(scrollY * 0.01) * 5}px)`,
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="font-sans text-xs uppercase tracking-widest group-hover:tracking-[0.3em] transition-all">
            Scroll
          </span>
          <div className="relative">
            <ChevronDown className="h-6 w-6 animate-bounce" />
            <div className="absolute inset-0 bg-gold/20 blur-lg animate-pulse" />
          </div>
          {/* Animated line */}
          <div className="h-8 w-px bg-gradient-to-b from-gold/60 to-transparent animate-pulse" />
        </div>
      </button>

      {/* 4. Floating Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 opacity-20 pointer-events-none">
        <Gem className="w-16 h-16 text-gold/30 animate-float-slow" style={{ animationDuration: '6s' }} />
      </div>
      <div className="absolute bottom-1/3 left-1/4 opacity-20 pointer-events-none">
        <Star className="w-12 h-12 text-gold/30 animate-float-slow" style={{ animationDuration: '8s', animationDelay: '2s' }} />
      </div>
    </div>
  );
};

export default LuxuryHero;
