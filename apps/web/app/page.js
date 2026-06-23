'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowRight, Flame, Clock, Sparkles, FolderOpen, CheckCircle, 
  BarChart3, TrendingUp, Check, Factory, Layers, ShoppingBag, 
  Cpu, Shirt, Home, Wheat, PenTool, Dumbbell
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import HyperframeExplainer from '@/components/home/HyperframeExplainer';
import StaggerReveal from '@/components/ui/StaggerReveal';
import BatchCard from '@/components/batch/BatchCard';
import { CATEGORIES, STATS } from '@/lib/mock-data';

const categoryIconMap = {
  all: Layers,
  fmcg: ShoppingBag,
  electronics: Cpu,
  apparel: Shirt,
  'home-kitchen': Home,
  agriculture: Wheat,
  'personal-care': Sparkles,
  stationery: PenTool,
  'sports-fitness': Dumbbell,
};

function LiveJoinTicker() {
  const joins = [
    { name: 'Rahul K.', city: 'Mumbai', slots: 10, time: 'just now' },
    { name: 'Priya S.', city: 'Pune', slots: 5, time: '12s ago' },
    { name: 'Amit G.', city: 'Delhi', slots: 20, time: '35s ago' },
    { name: 'Meena R.', city: 'Bangalore', slots: 15, time: '1m ago' },
    { name: 'Sandeep V.', city: 'Surat', slots: 8, time: '2m ago' },
    { name: 'Kunal M.', city: 'Ahmedabad', slots: 12, time: '3m ago' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % joins.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentJoin = joins[currentIndex];

  return (
    <div className="h-6 overflow-hidden relative w-full text-left">
      <div 
        key={currentIndex} 
        className="flex items-center justify-between text-[11px] text-neutral-400 font-medium animate-fade-in-up"
      >
        <span className="flex items-center gap-1.5 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          <span>
            <strong className="text-white font-bold">{currentJoin.name}</strong> from {currentJoin.city} joined <strong className="text-primary font-bold">+{currentJoin.slots} units</strong>
          </span>
        </span>
        <span className="text-[9px] text-neutral-500 font-mono shrink-0 ml-2">{currentJoin.time}</span>
      </div>
    </div>
  );
}

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const activeCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  const [activeTab, setActiveTab] = useState('trending');
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBatches() {
      try {
        const res = await fetch('/api/batches');
        if (res.ok) {
          const data = await res.json();
          setBatches(data);
        }
      } catch (err) {
        console.error('Failed to load batches:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBatches();
  }, []);

  // Replaced by <StaggerReveal> wrapping categories + batch grid

  const handleCategoryChange = (catId) => {
    const params = new URLSearchParams(window.location.search);
    if (catId === 'all') {
      params.delete('category');
    } else {
      params.set('category', catId);
    }
    router.push(`/?${params.toString()}`);
  };

  const filteredBatches = batches.filter((b) => {
    const matchesCategory = activeCategory === 'all' || b.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && b.status !== 'CLOSED';
  });

  const getTrending = () => {
    return [...batches].sort((a, b) => (b.velocity || 0) - (a.velocity || 0));
  };

  const getEnding = () => {
    return [...batches]
      .filter((b) => b.status === 'LIVE')
      .sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
  };

  const getNew = () => {
    return [...batches].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  const tabBatches = {
    trending: getTrending(),
    ending: getEnding(),
    new: getNew(),
  };

  const currentTabBatches = tabBatches[activeTab] || getTrending();
  const liveCount = batches.filter((b) => b.status === 'LIVE').length;

  const TABS = [
    { id: 'trending', icon: Flame, label: 'Trending' },
    { id: 'ending', icon: Clock, label: 'Ending Soon' },
    { id: 'new', icon: Sparkles, label: 'New' },
  ];

  const CTA_FEATURES = [
    'First batch completely free listing',
    'Only 4% fee on successful batches',
    'Payout within 3 business days',
    'GST invoice auto-generated',
  ];

  const CTA_STATS = [
    { v: '₹0', l: 'Upfront Cost' },
    { v: '4%', l: 'Success Fee' },
    { v: '3d', l: 'Payout Time' },
    { v: '320+', l: 'Active Sellers' },
  ];

  const PROOF_CARDS = [
    { k: 'Demand Signal', v: 'Buyers reserve slots before production locks, proving market fit.', tone: 'orange' },
    { k: 'Tier Unlock', v: 'Every reservation pushes the whole batch closer to factory pricing.', tone: 'green' },
    { k: 'Shared Upside', v: 'When the batch closes, everyone pays the final lowest unlocked price.', tone: 'amber' },
  ];

  return (
    <>
      <Header />

      <main className="relative bg-neutral-950">
        <HeroSection stats={STATS} />

        {/* -- Hyperframe: scroll-driven 5-scene business idea explainer -- */}
        <div id="how-it-works">
          <HyperframeExplainer />
        </div>

        {/* -- SECTION 1: LIVE BATCHES --------------------------------------- */}
        <section className="py-20 border-t border-white/5" id="live-feed">
          <div className="container mx-auto px-4">

            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 reveal">
              <div className="flex flex-col text-left">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-3 before:content-[''] before:block before:w-0.5 before:h-3 before:bg-primary before:rounded-sm">
                  Live Now
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-white flex items-center gap-3 tracking-tight leading-tight">
                  <span>Active Batches</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">{liveCount} live</span>
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-md">
                  Join an active batch and watch the price fall in real time.
                </p>
              </div>
            </div>

            {/* Segmented Tab Controls */}
            <div className="flex gap-1.5 p-1 rounded-xl bg-neutral-900/40 border border-white/5 w-fit mb-8 reveal" role="tablist">
              {TABS.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${isActive ? 'bg-primary/10 text-primary border border-primary/20 shadow-md' : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                    onClick={() => setActiveTab(tab.id)}
                    role="tab"
                    aria-selected={isActive}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Batch Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                Array(4).fill(0).map((_, idx) => (
                  <div
                    key={idx}
                    className="skeleton h-[360px] rounded-2xl bg-neutral-900/40 border border-white/5 animate-pulse"
                  />
                ))
              ) : currentTabBatches.length > 0 ? (
                currentTabBatches.slice(0, 4).map((batch, i) => (
                    <BatchCard
                      batch={batch}
                      manufacturer={batch.manufacturer}
                      index={i}
                    />
                ))
              ) : (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border border-dashed border-white/5 rounded-2xl bg-neutral-900/10">
                  <div className="text-3xl">📭</div>
                  <h3 className="text-base font-bold text-white mt-4 font-display">Nothing here yet</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mt-1">
                    No batches match this filter right now. Try another tab or check back soon!
                  </p>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* -- SECTION 2: BROWSE BY CATEGORY --------------------------------- */}
        <section className="py-20 border-t border-white/5 bg-neutral-950/40" id="categories-section">
          <div className="container mx-auto px-4">

            {/* Section Header */}
            <div className="flex flex-col text-left mb-8 reveal">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-3 before:content-[''] before:block before:w-0.5 before:h-3 before:bg-primary before:rounded-sm">
                Explore
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">Browse by Category</h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Find batches in your favorite product categories.
              </p>
            </div>

            {/* Category Tiles / Horizontal Scrollable Glass Chips */}
            <div className="relative w-full mb-8 reveal">
              {/* Fade mask */}
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none z-10" />
              
              <div className="scrollbar-none overflow-x-auto pb-2 -mb-2" id="category-filters">
                <div className="flex items-center gap-3 w-max py-1 px-1">
                  <button
                    className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border transition-all cursor-pointer text-xs font-bold ${
                      activeCategory === 'all' 
                        ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(255,106,0,0.15)]' 
                        : 'border-white/5 bg-neutral-900/20 hover:bg-neutral-900/50 text-neutral-400 hover:text-white'
                    }`}
                    onClick={() => handleCategoryChange('all')}
                    id="chip-all"
                  >
                    <Layers className="w-4 h-4 shrink-0" />
                    <span>All Batches</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeCategory === 'all' ? 'bg-primary/20 text-primary' : 'bg-neutral-950 text-neutral-500'}`}>
                      {batches.length}
                    </span>
                  </button>

                  {CATEGORIES.map((cat) => {
                    const isSelected = activeCategory === cat.id;
                    const IconComponent = categoryIconMap[cat.id] || FolderOpen;
                    return (
                      <button
                        key={cat.id}
                        id={`chip-${cat.id}`}
                        className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border transition-all cursor-pointer text-xs font-bold ${
                          isSelected 
                            ? 'border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(255,106,0,0.15)]' 
                            : 'border-white/5 bg-neutral-900/20 hover:bg-neutral-900/50 text-neutral-400 hover:text-white'
                        }`}
                        onClick={() => handleCategoryChange(cat.id)}
                      >
                        <IconComponent className="w-4 h-4 shrink-0" />
                        <span className="truncate max-w-[120px]">{cat.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-primary/20 text-primary' : 'bg-neutral-950 text-neutral-500'}`}>
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Filtered Batch Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                Array(4).fill(0).map((_, idx) => (
                  <div
                    key={idx}
                    className="skeleton h-[360px] rounded-2xl bg-neutral-900/40 border border-white/5 animate-pulse"
                  />
                ))
              ) : filteredBatches.length > 0 ? (
                filteredBatches.map((batch, i) => (
                    <BatchCard
                      batch={batch}
                      manufacturer={batch.manufacturer}
                      index={i}
                    />
                ))
              ) : (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border border-dashed border-white/5 rounded-2xl bg-neutral-900/10">
                  <FolderOpen className="w-8 h-8 text-neutral-500" />
                  <h3 className="text-base font-bold text-white mt-4 font-display">No matches found</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mt-1">
                    {searchQuery 
                      ? `We couldn't find any batches matching "${searchQuery}".`
                      : "No active batches match this filter right now. Try checking other categories!"}
                  </p>
                  {searchQuery && (
                    <button 
                      onClick={() => router.push('/')}
                      className="px-4 py-1.5 rounded-lg btn-secondary-new text-xs font-bold mt-4 cursor-pointer"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </section>

        {/* -- SECTION 3: WHY IT DROPS --------------------------------------- */}
        <section className="py-20 border-t border-white/5 bg-neutral-950" id="price-drop-proof">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: simulator info */}
              <div className="lg:col-span-6 flex flex-col text-left gap-6 reveal">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-3 before:content-[''] before:block before:w-0.5 before:h-3 before:bg-primary before:rounded-sm">
                    Crowd Mechanics
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight leading-tight">
                    One more buyer can drop <br />the price for everyone.
                  </h2>
                  <p className="text-sm text-neutral-400 mt-3 leading-relaxed">
                    BulkBlitz turns scattered demand into a live manufacturing signal, so buyers see the batch move toward better tiers instead of waiting for opaque wholesale quotes.
                  </p>
                </div>

                {/* Live simulation widget */}
                <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/30 backdrop-blur-md shadow-2xl flex flex-col gap-4 w-full">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white font-display">Live Batch #1842: Premium Rice</span>
                    <span className="inline-flex items-center gap-1.5 text-green-400">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span>98% Filled</span>
                    </span>
                  </div>

                  <div className="relative h-2.5 w-full bg-neutral-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full w-[98%] bg-gradient-to-r from-primary to-accent rounded-full relative pulse-glow-bar">
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="flex flex-col p-2 bg-neutral-950/40 rounded-lg border border-green-500/20 text-green-400">
                      <span className="font-mono font-bold text-sm">₹120</span>
                      <span className="text-[9px] font-semibold text-green-500/80">Tier 1</span>
                    </div>
                    <div className="flex flex-col p-2 bg-neutral-950/40 rounded-lg border border-green-500/20 text-green-400">
                      <span className="font-mono font-bold text-sm">₹95</span>
                      <span className="text-[9px] font-semibold text-green-500/80">Tier 2</span>
                    </div>
                    <div className="flex flex-col p-2 bg-neutral-950/40 rounded-lg border border-primary/20 text-primary">
                      <span className="font-mono font-bold text-sm">₹75</span>
                      <span className="text-[9px] font-semibold text-primary/80">Next Tier</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 p-3 bg-neutral-950/60 border border-white/5 rounded-xl">
                    <LiveJoinTicker />
                    <div className="flex items-center gap-2 text-xs font-bold text-primary border-t border-white/5 pt-2">
                      <Flame className="w-4 h-4 flex-shrink-0 animate-bounce" />
                      <span>Only 2 more orders needed to unlock ₹75/kg pricing for everyone!</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: proof cards */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                {PROOF_CARDS.map((card, idx) => (
                  <div key={card.k} className="relative group p-6 rounded-2xl border border-white/5 bg-neutral-900/20 backdrop-blur-md flex gap-5 hover:border-white/10 transition-colors reveal" style={{ transitionDelay: `${idx * 150}ms` }}>
                    <div className="absolute top-4 right-4 text-4xl font-mono font-black text-white/5 select-none">{String(idx + 1).padStart(2, '0')}</div>
                    
                    {/* Widget Content visual mockups */}
                    <div className="w-1/3 hidden sm:block flex-shrink-0 p-3 rounded-xl border border-white/5 bg-neutral-950/40 animate-fade-in">
                      {idx === 0 && (
                        <div className="flex flex-col gap-1.5 text-[9px] text-left">
                          <div className="font-bold text-neutral-400 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-primary" /> Live reservations</div>
                          <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-neutral-500 truncate max-w-[60px]">Sharma Dist.</span><span className="text-green-400 font-bold font-mono">+50 slots</span></div>
                          <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-neutral-500 truncate max-w-[60px]">FreshFoods</span><span className="text-green-400 font-bold font-mono">+20 slots</span></div>
                          <div className="flex justify-between"><span className="text-neutral-500 truncate max-w-[60px]">R. Patel Co.</span><span className="text-green-400 font-bold font-mono">+100 slots</span></div>
                        </div>
                      )}
                      {idx === 1 && (
                        <div className="flex flex-col gap-1.5 text-[9px] text-left">
                          <div className="font-bold text-neutral-400 flex items-center gap-1"><BarChart3 className="w-3 h-3 text-green-400" /> Volume Tiers</div>
                          <div className="flex justify-between text-neutral-500"><span className="truncate">1-20 slots</span><span className="font-mono">₹120 <Check className="inline w-2.5 h-2.5 text-green-400" /></span></div>
                          <div className="flex justify-between text-neutral-500"><span className="truncate">21-50 slots</span><span className="font-mono">₹95 <Check className="inline w-2.5 h-2.5 text-green-400" /></span></div>
                          <div className="flex justify-between text-white font-bold"><span className="truncate">51-100 slots</span><span className="font-mono text-primary">₹75 ●</span></div>
                        </div>
                      )}
                      {idx === 2 && (
                        <div className="flex flex-col gap-1.5 text-[9px] text-left">
                          <div className="font-bold text-neutral-400 flex items-center gap-1"><CheckCircle className="w-3 h-3 text-amber-500" /> Order Summary</div>
                          <div className="flex justify-between text-neutral-500"><span>Initial Price</span><span className="line-through font-mono">₹12,000</span></div>
                          <div className="flex justify-between text-white font-bold"><span>Final Price</span><span className="text-green-400 font-mono">₹7,500</span></div>
                          <div className="border-t border-white/5 my-0.5" />
                          <div className="flex justify-between text-primary font-bold"><span>Refunded</span><span className="font-mono">₹4,500 Saved</span></div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col text-left justify-center">
                      <h3 className="text-base font-bold text-white font-display">{card.k}</h3>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed max-w-sm">{card.v}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* -- SECTION 4: MANUFACTURER CTA ----------------------------------- */}
        <section className="py-20 border-t border-white/5 reveal" id="cta-section">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-neutral-950 via-neutral-900/50 to-neutral-950 p-8 md:p-12 shadow-2xl">
              
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left side copy */}
                <div className="lg:col-span-7 flex flex-col text-left gap-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-primary/20 bg-primary/10 text-primary">
                      <Factory className="w-3.5 h-3.5" />
                      <span>For Manufacturers</span>
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight leading-tight mt-4">
                      <span className="text-white">Scale your production.</span> <br />
                      <span className="text-primary">Fill your order book.</span>
                    </h2>
                  </div>

                  <div className="flex flex-col gap-3">
                    {CTA_FEATURES.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 text-xs text-neutral-300 font-medium">
                        <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="/manufacturer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl btn-primary-new font-bold text-sm self-start"
                    id="cta-manufacturer"
                  >
                    Start Selling Today
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Right side stats */}
                <div className="lg:col-span-5">
                  <div className="grid grid-cols-2 gap-4 min-w-[280px]">
                    {CTA_STATS.map((stat) => (
                      <div key={stat.l} className="flex flex-col p-5 bg-neutral-900/40 border-t-2 border-t-primary/60 border-x border-b border-white/5 rounded-2xl backdrop-blur-md hover:border-t-primary hover:border-x-white/10 hover:border-b-white/10 hover:-translate-y-1 transition-all duration-300 shadow-lg">
                        <span className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight">{stat.v}</span>
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-2 leading-none">{stat.l}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Logo Ticker */}
              <div className="relative z-10 mt-12 pt-8 border-t border-white/5 overflow-hidden">
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center mb-6">
                  Trusted by leading manufacturers across India
                </p>
                <div className="relative w-full overflow-hidden">
                  {/* Gradient fades on sides */}
                  <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-neutral-950 to-transparent pointer-events-none z-10" />
                  <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none z-10" />
                  
                  {/* Scrolling container */}
                  <div className="flex gap-16 animate-marquee w-max select-none">
                    {/* First set of logos */}
                    <div className="flex gap-16 items-center">
                      <span className="text-xs font-black tracking-wider text-neutral-600 font-display">TATA ENTERPRISES</span>
                      <span className="text-xs font-black tracking-wider text-neutral-600 font-display">RELIANCE MFG</span>
                      <span className="text-xs font-black tracking-wider text-neutral-600 font-display">BIRLA INDUSTRIES</span>
                      <span className="text-xs font-black tracking-wider text-neutral-600 font-display">ITC LIMITED</span>
                      <span className="text-xs font-black tracking-wider text-neutral-600 font-display">GODREJ GROUP</span>
                    </div>
                    {/* Duplicate set for seamless loop */}
                    <div className="flex gap-16 items-center" aria-hidden="true">
                      <span className="text-xs font-black tracking-wider text-neutral-600 font-display">TATA ENTERPRISES</span>
                      <span className="text-xs font-black tracking-wider text-neutral-600 font-display">RELIANCE MFG</span>
                      <span className="text-xs font-black tracking-wider text-neutral-600 font-display">BIRLA INDUSTRIES</span>
                      <span className="text-xs font-black tracking-wider text-neutral-600 font-display">ITC LIMITED</span>
                      <span className="text-xs font-black tracking-wider text-neutral-600 font-display">GODREJ GROUP</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen text-xs font-bold text-neutral-400 bg-neutral-950 font-sans tracking-widest uppercase">
        Loading BulkBlitz...
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
