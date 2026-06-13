// =============================================================================
// BulkBlitz — Mock Data
// Realistic data modelled on Indian manufacturers, cities, and product pricing.
// =============================================================================

// ─── Timestamp helpers (relative to "now") ──────────────────────────────────

const NOW = new Date();

/** Return an ISO string offset from now by the given hours (negative = past). */
function hoursFromNow(h) {
  return new Date(NOW.getTime() + h * 3600_000).toISOString();
}

/** Return an ISO string offset from now by the given days (negative = past). */
function daysFromNow(d) {
  return hoursFromNow(d * 24);
}

// =============================================================================
// 1. CATEGORIES
// =============================================================================

export const CATEGORIES = [
  { id: 'fmcg', name: 'FMCG', icon: '🛒', color: '#F59E0B', count: 87 },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: '📱',
    color: '#3B82F6',
    count: 64,
  },
  {
    id: 'apparel',
    name: 'Apparel',
    icon: '👕',
    color: '#8B5CF6',
    count: 53,
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    icon: '🏠',
    color: '#10B981',
    count: 41,
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    icon: '🌾',
    color: '#84CC16',
    count: 29,
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    icon: '🧴',
    color: '#EC4899',
    count: 36,
  },
  {
    id: 'stationery',
    name: 'Stationery',
    icon: '📝',
    color: '#F97316',
    count: 22,
  },
  {
    id: 'sports-fitness',
    name: 'Sports & Fitness',
    icon: '🏏',
    color: '#06B6D4',
    count: 18,
  },
];

// =============================================================================
// 2. MANUFACTURERS
// =============================================================================

export const MANUFACTURERS = [
  {
    id: 'mfr-001',
    name: 'Shree Ganesh Agro Foods',
    city: 'Pune',
    state: 'Maharashtra',
    gstVerified: true,
    fssaiVerified: true,
    bisVerified: false,
    yearsInBusiness: 18,
    rating: 4.6,
    totalBatches: 124,
    successRate: 96,
    avatar: 'SG',
    description:
      'Leading processor and packer of pulses, spices, and edible oils in western Maharashtra. FSSAI-certified facility with 50,000 sq ft capacity.',
  },
  {
    id: 'mfr-002',
    name: 'NovaTech Accessories Pvt Ltd',
    city: 'Surat',
    state: 'Gujarat',
    gstVerified: true,
    fssaiVerified: false,
    bisVerified: true,
    yearsInBusiness: 7,
    rating: 4.3,
    totalBatches: 89,
    successRate: 91,
    avatar: 'NT',
    description:
      'Manufacturer of mobile accessories, charging cables, and consumer electronics. BIS-certified production line with automated QC.',
  },
  {
    id: 'mfr-003',
    name: 'Lakshmi Textiles',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    gstVerified: true,
    fssaiVerified: false,
    bisVerified: false,
    yearsInBusiness: 32,
    rating: 4.8,
    totalBatches: 210,
    successRate: 98,
    avatar: 'LT',
    description:
      'Third-generation textile manufacturer specialising in premium cotton and linen fabrics. Exports to 12 countries.',
  },
  {
    id: 'mfr-004',
    name: 'Rajdhani Steel Works',
    city: 'Jaipur',
    state: 'Rajasthan',
    gstVerified: true,
    fssaiVerified: false,
    bisVerified: true,
    yearsInBusiness: 14,
    rating: 4.5,
    totalBatches: 76,
    successRate: 94,
    avatar: 'RS',
    description:
      'Premium stainless steel kitchenware and drinkware. BIS-certified 304-grade steel products with mirror-polish finish.',
  },
  {
    id: 'mfr-005',
    name: 'Kisan Organics',
    city: 'Indore',
    state: 'Madhya Pradesh',
    gstVerified: true,
    fssaiVerified: true,
    bisVerified: false,
    yearsInBusiness: 9,
    rating: 4.7,
    totalBatches: 58,
    successRate: 97,
    avatar: 'KO',
    description:
      'Certified organic farm produce — spices, seeds, and cold-pressed oils. NPOP and FSSAI Organic certified.',
  },
  {
    id: 'mfr-006',
    name: 'Bright Star Electricals',
    city: 'Nagpur',
    state: 'Maharashtra',
    gstVerified: true,
    fssaiVerified: false,
    bisVerified: true,
    yearsInBusiness: 11,
    rating: 4.4,
    totalBatches: 63,
    successRate: 92,
    avatar: 'BS',
    description:
      'LED lighting solutions manufacturer with BIS and ISI marks. Energy-efficient products for residential and commercial use.',
  },
  {
    id: 'mfr-007',
    name: 'Ludhiana Knit Exports',
    city: 'Ludhiana',
    state: 'Punjab',
    gstVerified: true,
    fssaiVerified: false,
    bisVerified: false,
    yearsInBusiness: 25,
    rating: 4.6,
    totalBatches: 143,
    successRate: 95,
    avatar: 'LK',
    description:
      'Knitwear and hosiery manufacturer with vertically integrated production. Supplies to major domestic and international brands.',
  },
  {
    id: 'mfr-008',
    name: 'Deccan Naturals',
    city: 'Hyderabad',
    state: 'Telangana',
    gstVerified: true,
    fssaiVerified: true,
    bisVerified: false,
    yearsInBusiness: 6,
    rating: 4.5,
    totalBatches: 42,
    successRate: 93,
    avatar: 'DN',
    description:
      'Handcrafted personal care and wellness products using Ayurvedic formulations. Cruelty-free and paraben-free.',
  },
  {
    id: 'mfr-009',
    name: 'Greenfield Seeds Co.',
    city: 'Indore',
    state: 'Madhya Pradesh',
    gstVerified: true,
    fssaiVerified: false,
    bisVerified: false,
    yearsInBusiness: 15,
    rating: 4.4,
    totalBatches: 37,
    successRate: 90,
    avatar: 'GS',
    description:
      'Research-driven seed company producing high-yield organic vegetable and flower seeds for Indian climatic conditions.',
  },
  {
    id: 'mfr-010',
    name: 'PowerVault India',
    city: 'Surat',
    state: 'Gujarat',
    gstVerified: true,
    fssaiVerified: false,
    bisVerified: true,
    yearsInBusiness: 5,
    rating: 4.2,
    totalBatches: 31,
    successRate: 88,
    avatar: 'PV',
    description:
      'Portable power solutions — power banks, wireless chargers, and travel adapters. BIS-certified lithium-polymer cells.',
  },
];

// =============================================================================
// 3. BATCHES
// =============================================================================

export const BATCHES = [
  // ── FMCG ──────────────────────────────────────────────────────────────────
  {
    id: 'batch-001',
    manufacturerId: 'mfr-001',
    title: 'Premium Chana Dal — 1 kg Pack',
    description:
      'Machine-sorted, double-polished chana dal from Vidarbha farms. Rich in protein, ideal for everyday cooking. FSSAI certified, vacuum-sealed packaging for longer shelf life.',
    category: 'fmcg',
    images: ['/placeholder-product.jpg'],
    tiers: [
      { minSlots: 1, maxSlots: 50, price: 95 },
      { minSlots: 51, maxSlots: 150, price: 82 },
      { minSlots: 151, maxSlots: 300, price: 74 },
      { minSlots: 301, maxSlots: 500, price: 68 },
    ],
    currentSlots: 287,
    moq: 5,
    maxSlots: 500,
    status: 'LIVE',
    startTime: hoursFromNow(-36),
    endTime: hoursFromNow(12),
    velocity: 8.2,
    recentJoiners: [
      { name: 'Meena S.', avatar: 'MS', joinedAt: hoursFromNow(-0.5) },
      { name: 'Anil P.', avatar: 'AP', joinedAt: hoursFromNow(-1.2) },
      { name: 'Kavita R.', avatar: 'KR', joinedAt: hoursFromNow(-2) },
    ],
    specs: {
      weight: '1 kg per pack',
      type: 'Double-polished',
      origin: 'Vidarbha, Maharashtra',
      certification: 'FSSAI',
      shelfLife: '12 months',
    },
    shipping: { type: 'direct', estimatedDays: 5 },
    reviews: [
      {
        user: 'Priya M.',
        rating: 5,
        comment: 'Best quality dal I have bought online. Cooks evenly and tastes great.',
        date: daysFromNow(-10),
      },
      {
        user: 'Sandeep K.',
        rating: 4,
        comment: 'Good value for the price. Packaging could be sturdier.',
        date: daysFromNow(-18),
      },
    ],
  },
  {
    id: 'batch-002',
    manufacturerId: 'mfr-005',
    title: 'Organic Turmeric Powder — 500 g',
    description:
      'Stone-ground Lakadong turmeric from Meghalaya with 7-9% curcumin content. NPOP certified organic, no artificial colour or additives. Packed in airtight food-grade pouches.',
    category: 'fmcg',
    images: ['/placeholder-product.jpg'],
    tiers: [
      { minSlots: 1, maxSlots: 40, price: 220 },
      { minSlots: 41, maxSlots: 120, price: 185 },
      { minSlots: 121, maxSlots: 250, price: 162 },
      { minSlots: 251, maxSlots: 400, price: 145 },
      { minSlots: 401, maxSlots: 500, price: 132 },
    ],
    currentSlots: 118,
    moq: 3,
    maxSlots: 500,
    status: 'LIVE',
    startTime: hoursFromNow(-20),
    endTime: hoursFromNow(28),
    velocity: 5.9,
    recentJoiners: [
      { name: 'Deepak V.', avatar: 'DV', joinedAt: hoursFromNow(-0.3) },
      { name: 'Sunita G.', avatar: 'SG', joinedAt: hoursFromNow(-1.5) },
    ],
    specs: {
      weight: '500 g',
      curcuminContent: '7-9%',
      origin: 'Meghalaya',
      certification: 'NPOP Organic, FSSAI',
      shelfLife: '18 months',
    },
    shipping: { type: 'direct', estimatedDays: 6 },
    reviews: [
      {
        user: 'Ritu A.',
        rating: 5,
        comment: 'Amazing colour and aroma. Best haldi I have ever used!',
        date: daysFromNow(-5),
      },
    ],
  },
  {
    id: 'batch-003',
    manufacturerId: 'mfr-005',
    title: 'Cold-Pressed Virgin Coconut Oil — 1 L',
    description:
      'Wood-pressed coconut oil from Kerala copra. Retains natural aroma and nutrients. Multi-purpose — cooking, skin care, and hair care. Glass bottle packaging.',
    category: 'fmcg',
    images: ['/placeholder-product.jpg'],
    tiers: [
      { minSlots: 1, maxSlots: 30, price: 499 },
      { minSlots: 31, maxSlots: 80, price: 435 },
      { minSlots: 81, maxSlots: 150, price: 389 },
      { minSlots: 151, maxSlots: 250, price: 349 },
    ],
    currentSlots: 22,
    moq: 2,
    maxSlots: 250,
    status: 'NEW',
    startTime: hoursFromNow(-6),
    endTime: hoursFromNow(66),
    velocity: 3.7,
    recentJoiners: [
      { name: 'Asha M.', avatar: 'AM', joinedAt: hoursFromNow(-0.8) },
    ],
    specs: {
      weight: '1 litre',
      extractionMethod: 'Wood cold-press',
      origin: 'Kerala',
      certification: 'FSSAI',
      shelfLife: '24 months',
    },
    shipping: { type: 'direct', estimatedDays: 7 },
    reviews: [],
  },

  // ── Electronics ───────────────────────────────────────────────────────────
  {
    id: 'batch-004',
    manufacturerId: 'mfr-002',
    title: 'USB-C to USB-C Fast Charging Cable — 1.5 m',
    description:
      '65 W PD fast-charging cable with braided nylon sheath and reinforced connectors. Compatible with all USB-C devices. BIS certified, 10,000+ bend-tested.',
    category: 'electronics',
    images: ['/placeholder-product.jpg'],
    tiers: [
      { minSlots: 1, maxSlots: 100, price: 249 },
      { minSlots: 101, maxSlots: 300, price: 199 },
      { minSlots: 301, maxSlots: 600, price: 159 },
      { minSlots: 601, maxSlots: 1000, price: 129 },
    ],
    currentSlots: 847,
    moq: 5,
    maxSlots: 1000,
    status: 'LIVE',
    startTime: hoursFromNow(-48),
    endTime: hoursFromNow(4),
    velocity: 17.6,
    recentJoiners: [
      { name: 'Vikram J.', avatar: 'VJ', joinedAt: hoursFromNow(-0.1) },
      { name: 'Neha T.', avatar: 'NT', joinedAt: hoursFromNow(-0.2) },
      { name: 'Rahul D.', avatar: 'RD', joinedAt: hoursFromNow(-0.4) },
      { name: 'Pooja S.', avatar: 'PS', joinedAt: hoursFromNow(-0.6) },
    ],
    specs: {
      length: '1.5 m',
      material: 'Braided Nylon + Aluminium',
      wattage: '65 W PD',
      certification: 'BIS',
      warranty: '1 year',
    },
    shipping: { type: 'direct', estimatedDays: 4 },
    reviews: [
      {
        user: 'Arjun S.',
        rating: 5,
        comment: 'Superb build quality. Charges my MacBook Air at full speed.',
        date: daysFromNow(-3),
      },
      {
        user: 'Sneha P.',
        rating: 4,
        comment: 'Good cable, fast charging works. Slightly stiff at first.',
        date: daysFromNow(-7),
      },
      {
        user: 'Manoj R.',
        rating: 5,
        comment: 'Bought 10 units last batch. Zero complaints from customers.',
        date: daysFromNow(-15),
      },
    ],
  },
  {
    id: 'batch-005',
    manufacturerId: 'mfr-006',
    title: '9 W LED Bulb — Cool Daylight (Pack of 4)',
    description:
      '9 W B22 LED bulbs, 900 lumens, 6500 K cool daylight. Energy-saving, flicker-free, surge protection up to 2.5 kV. BIS/ISI marked.',
    category: 'electronics',
    images: ['/placeholder-product.jpg'],
    tiers: [
      { minSlots: 1, maxSlots: 80, price: 320 },
      { minSlots: 81, maxSlots: 200, price: 275 },
      { minSlots: 201, maxSlots: 400, price: 240 },
      { minSlots: 401, maxSlots: 600, price: 210 },
    ],
    currentSlots: 389,
    moq: 3,
    maxSlots: 600,
    status: 'LIVE',
    startTime: hoursFromNow(-30),
    endTime: hoursFromNow(18),
    velocity: 13.0,
    recentJoiners: [
      { name: 'Suresh B.', avatar: 'SB', joinedAt: hoursFromNow(-0.7) },
      { name: 'Reema K.', avatar: 'RK', joinedAt: hoursFromNow(-1.3) },
    ],
    specs: {
      wattage: '9 W',
      lumens: 900,
      colourTemp: '6500 K Cool Daylight',
      base: 'B22',
      certification: 'BIS / ISI',
      warranty: '2 years',
      lifespan: '25,000 hours',
    },
    shipping: { type: 'direct', estimatedDays: 5 },
    reviews: [
      {
        user: 'Ganesh M.',
        rating: 4,
        comment: 'Bright and efficient. Running 6 months without issues.',
        date: daysFromNow(-12),
      },
    ],
  },
  {
    id: 'batch-006',
    manufacturerId: 'mfr-010',
    title: '10,000 mAh Power Bank — USB-C PD 22.5 W',
    description:
      'Slim aluminium power bank with 22.5 W fast charge. Dual output (USB-C + USB-A). LED display, BIS-certified Li-polymer cells. Airline-safe capacity.',
    category: 'electronics',
    images: ['/placeholder-product.jpg'],
    tiers: [
      { minSlots: 1, maxSlots: 50, price: 899 },
      { minSlots: 51, maxSlots: 150, price: 779 },
      { minSlots: 151, maxSlots: 300, price: 699 },
      { minSlots: 301, maxSlots: 500, price: 629 },
      { minSlots: 501, maxSlots: 700, price: 579 },
    ],
    currentSlots: 73,
    moq: 2,
    maxSlots: 700,
    status: 'NEW',
    startTime: hoursFromNow(-10),
    endTime: hoursFromNow(62),
    velocity: 7.3,
    recentJoiners: [
      { name: 'Farhan S.', avatar: 'FS', joinedAt: hoursFromNow(-0.4) },
      { name: 'Divya N.', avatar: 'DN', joinedAt: hoursFromNow(-1.1) },
    ],
    specs: {
      capacity: '10,000 mAh',
      output: 'USB-C PD 22.5 W + USB-A QC 3.0',
      weight: '210 g',
      material: 'Aluminium alloy',
      certification: 'BIS',
      warranty: '1 year',
    },
    shipping: { type: 'direct', estimatedDays: 4 },
    reviews: [
      {
        user: 'Karan T.',
        rating: 5,
        comment: 'Sleek design, charges my phone twice. Very happy with purchase.',
        date: daysFromNow(-8),
      },
    ],
  },

  // ── Apparel ───────────────────────────────────────────────────────────────
  {
    id: 'batch-007',
    manufacturerId: 'mfr-007',
    title: 'Men\'s Round-Neck Cotton T-Shirt — 180 GSM',
    description:
      'Bio-washed combed cotton tee, pre-shrunk. Available in 6 colours (S–XXL). Reinforced collar, side-seam construction. Ideal for retail, gifting, or personal use.',
    category: 'apparel',
    images: ['/placeholder-product.jpg'],
    tiers: [
      { minSlots: 1, maxSlots: 100, price: 349 },
      { minSlots: 101, maxSlots: 300, price: 289 },
      { minSlots: 301, maxSlots: 600, price: 245 },
      { minSlots: 601, maxSlots: 1000, price: 215 },
    ],
    currentSlots: 542,
    moq: 10,
    maxSlots: 1000,
    status: 'LIVE',
    startTime: hoursFromNow(-40),
    endTime: hoursFromNow(8),
    velocity: 13.6,
    recentJoiners: [
      { name: 'Pankaj W.', avatar: 'PW', joinedAt: hoursFromNow(-0.2) },
      { name: 'Nisha R.', avatar: 'NR', joinedAt: hoursFromNow(-0.9) },
      { name: 'Amit G.', avatar: 'AG', joinedAt: hoursFromNow(-1.5) },
    ],
    specs: {
      fabric: '100% Combed Cotton, 180 GSM',
      sizes: 'S, M, L, XL, XXL',
      colours: 'Black, White, Navy, Grey, Olive, Maroon',
      washCare: 'Machine wash cold, tumble dry low',
    },
    shipping: { type: 'direct', estimatedDays: 6 },
    reviews: [
      {
        user: 'Rohit V.',
        rating: 5,
        comment: 'Excellent fabric quality. Ordered 50 pcs for my store — sold out in a week!',
        date: daysFromNow(-4),
      },
      {
        user: 'Megha S.',
        rating: 4,
        comment: 'Nice fit and feel. The olive colour is slightly different from the image.',
        date: daysFromNow(-9),
      },
    ],
  },
  {
    id: 'batch-008',
    manufacturerId: 'mfr-003',
    title: 'Men\'s Linen Kurta — Handloom Finish',
    description:
      'Lightweight pure linen kurta with hand-finished collar and wooden buttons. Perfect for summer. Available in pastels and earthy tones. Sizes M–XXXL.',
    category: 'apparel',
    images: ['/placeholder-product.jpg'],
    tiers: [
      { minSlots: 1, maxSlots: 40, price: 1299 },
      { minSlots: 41, maxSlots: 100, price: 1099 },
      { minSlots: 101, maxSlots: 200, price: 949 },
      { minSlots: 201, maxSlots: 350, price: 849 },
    ],
    currentSlots: 196,
    moq: 3,
    maxSlots: 350,
    status: 'ENDING_SOON',
    startTime: hoursFromNow(-70),
    endTime: hoursFromNow(2.5),
    velocity: 2.8,
    recentJoiners: [
      { name: 'Siddharth J.', avatar: 'SJ', joinedAt: hoursFromNow(-1) },
    ],
    specs: {
      fabric: '100% Pure Linen (European Flax)',
      sizes: 'M, L, XL, XXL, XXXL',
      colours: 'Sky Blue, Beige, Sage Green, White, Peach',
      finish: 'Handloom, wooden buttons',
    },
    shipping: { type: 'direct', estimatedDays: 7 },
    reviews: [
      {
        user: 'Anand R.',
        rating: 5,
        comment: 'Superb linen quality. Feels like a ₹3,000 kurta. Absolute steal!',
        date: daysFromNow(-6),
      },
      {
        user: 'Vinay L.',
        rating: 5,
        comment: 'Bought 5 pieces for a family function. Everyone loved them.',
        date: daysFromNow(-14),
      },
    ],
  },

  // ── Home & Kitchen ────────────────────────────────────────────────────────
  {
    id: 'batch-009',
    manufacturerId: 'mfr-004',
    title: 'Stainless Steel Water Bottle — 1 L (304 Grade)',
    description:
      'Mirror-polished 304-grade stainless steel bottle. Leak-proof, BPA-free cap. Single-wall design, lightweight and durable. Ideal for office, gym, and school.',
    category: 'home-kitchen',
    images: ['/placeholder-product.jpg'],
    tiers: [
      { minSlots: 1, maxSlots: 60, price: 399 },
      { minSlots: 61, maxSlots: 180, price: 339 },
      { minSlots: 181, maxSlots: 350, price: 289 },
      { minSlots: 351, maxSlots: 500, price: 259 },
    ],
    currentSlots: 472,
    moq: 5,
    maxSlots: 500,
    status: 'ENDING_SOON',
    startTime: hoursFromNow(-65),
    endTime: hoursFromNow(3),
    velocity: 7.3,
    recentJoiners: [
      { name: 'Jyoti M.', avatar: 'JM', joinedAt: hoursFromNow(-0.3) },
      { name: 'Prakash N.', avatar: 'PN', joinedAt: hoursFromNow(-0.8) },
    ],
    specs: {
      capacity: '1 litre',
      material: '304-grade Stainless Steel',
      weight: '180 g',
      finish: 'Mirror polish',
      certification: 'BIS, Food-grade',
    },
    shipping: { type: 'direct', estimatedDays: 5 },
    reviews: [
      {
        user: 'Lakshmi G.',
        rating: 5,
        comment: 'No metallic taste, very sturdy. Using it daily for 3 months now.',
        date: daysFromNow(-20),
      },
      {
        user: 'Rajesh T.',
        rating: 4,
        comment: 'Good quality for the price. Cap seal could be tighter.',
        date: daysFromNow(-25),
      },
    ],
  },
  {
    id: 'batch-010',
    manufacturerId: 'mfr-003',
    title: 'Premium Cotton Bedsheet — King Size (108×108 in)',
    description:
      'Handloom 300 TC cotton bedsheet with 2 matching pillow covers. Reactive-dyed, fade-resistant prints inspired by Rajasthani block-print motifs. Pre-washed for softness.',
    category: 'home-kitchen',
    images: ['/placeholder-product.jpg'],
    tiers: [
      { minSlots: 1, maxSlots: 30, price: 1199 },
      { minSlots: 31, maxSlots: 80, price: 999 },
      { minSlots: 81, maxSlots: 150, price: 879 },
      { minSlots: 151, maxSlots: 250, price: 749 },
    ],
    currentSlots: 14,
    moq: 2,
    maxSlots: 250,
    status: 'NEW',
    startTime: hoursFromNow(-4),
    endTime: hoursFromNow(68),
    velocity: 3.5,
    recentJoiners: [
      { name: 'Shweta P.', avatar: 'SP', joinedAt: hoursFromNow(-1.2) },
    ],
    specs: {
      size: '108 × 108 inches (King)',
      material: '300 TC Pure Cotton',
      includes: '1 bedsheet + 2 pillow covers',
      washCare: 'Machine wash cold, do not bleach',
      designs: 'Rajasthani block-print motifs',
    },
    shipping: { type: 'direct', estimatedDays: 6 },
    reviews: [],
  },

  // ── Personal Care ─────────────────────────────────────────────────────────
  {
    id: 'batch-011',
    manufacturerId: 'mfr-008',
    title: 'Handmade Ayurvedic Soap — Neem & Tulsi (125 g × 4)',
    description:
      'Cold-process soap made with neem oil, tulsi extract, and turmeric. No parabens, no SLS. Moisturising and antibacterial. Eco-friendly paper packaging.',
    category: 'personal-care',
    images: ['/placeholder-product.jpg'],
    tiers: [
      { minSlots: 1, maxSlots: 50, price: 299 },
      { minSlots: 51, maxSlots: 150, price: 259 },
      { minSlots: 151, maxSlots: 300, price: 225 },
      { minSlots: 301, maxSlots: 450, price: 199 },
    ],
    currentSlots: 310,
    moq: 3,
    maxSlots: 450,
    status: 'LIVE',
    startTime: hoursFromNow(-52),
    endTime: hoursFromNow(20),
    velocity: 6.0,
    recentJoiners: [
      { name: 'Tanvi D.', avatar: 'TD', joinedAt: hoursFromNow(-0.6) },
      { name: 'Mohan K.', avatar: 'MK', joinedAt: hoursFromNow(-1.8) },
    ],
    specs: {
      weight: '125 g × 4 bars',
      ingredients: 'Neem oil, Tulsi, Turmeric, Coconut oil, Shea butter',
      skinType: 'All skin types',
      certification: 'Cruelty-free, Paraben-free',
    },
    shipping: { type: 'direct', estimatedDays: 5 },
    reviews: [
      {
        user: 'Pallavi S.',
        rating: 5,
        comment: 'Heavenly fragrance and very gentle on skin. My entire family uses it now.',
        date: daysFromNow(-8),
      },
      {
        user: 'Nitin K.',
        rating: 4,
        comment: 'Good soap, slightly smaller than expected but great quality.',
        date: daysFromNow(-11),
      },
    ],
  },
  {
    id: 'batch-012',
    manufacturerId: 'mfr-008',
    title: 'Bhringraj & Amla Hair Oil — 200 ml',
    description:
      'Traditional Ayurvedic hair oil infused with Bhringraj, Amla, Brahmi, and coconut oil base. Promotes hair growth, reduces dandruff. No mineral oil.',
    category: 'personal-care',
    images: ['/placeholder-product.jpg'],
    tiers: [
      { minSlots: 1, maxSlots: 40, price: 349 },
      { minSlots: 41, maxSlots: 100, price: 299 },
      { minSlots: 101, maxSlots: 200, price: 265 },
      { minSlots: 201, maxSlots: 350, price: 239 },
    ],
    currentSlots: 42,
    moq: 3,
    maxSlots: 350,
    status: 'LIVE',
    startTime: hoursFromNow(-18),
    endTime: hoursFromNow(54),
    velocity: 2.3,
    recentJoiners: [
      { name: 'Swati L.', avatar: 'SL', joinedAt: hoursFromNow(-2) },
    ],
    specs: {
      volume: '200 ml',
      ingredients: 'Bhringraj, Amla, Brahmi, Virgin Coconut Oil',
      suitableFor: 'All hair types',
      certification: 'FSSAI, Cruelty-free',
    },
    shipping: { type: 'direct', estimatedDays: 5 },
    reviews: [
      {
        user: 'Geeta V.',
        rating: 5,
        comment: 'Been using for 2 months — noticeable reduction in hair fall. Love it!',
        date: daysFromNow(-3),
      },
    ],
  },

  // ── Agriculture ───────────────────────────────────────────────────────────
  {
    id: 'batch-013',
    manufacturerId: 'mfr-009',
    title: 'Organic Kitchen Garden Seeds Pack — 15 Varieties',
    description:
      'Curated seed kit with 15 varieties of vegetables and herbs: tomato, chilli, okra, coriander, methi, spinach, brinjal, bottle gourd, and more. Non-GMO, heirloom seeds suited for Indian climate.',
    category: 'agriculture',
    images: ['/placeholder-product.jpg'],
    tiers: [
      { minSlots: 1, maxSlots: 40, price: 599 },
      { minSlots: 41, maxSlots: 100, price: 499 },
      { minSlots: 101, maxSlots: 200, price: 429 },
      { minSlots: 201, maxSlots: 350, price: 379 },
    ],
    currentSlots: 103,
    moq: 2,
    maxSlots: 350,
    status: 'LIVE',
    startTime: hoursFromNow(-22),
    endTime: hoursFromNow(50),
    velocity: 4.7,
    recentJoiners: [
      { name: 'Hemant C.', avatar: 'HC', joinedAt: hoursFromNow(-0.5) },
      { name: 'Savita W.', avatar: 'SW', joinedAt: hoursFromNow(-1.7) },
    ],
    specs: {
      varieties: '15 (Tomato, Green Chilli, Okra, Coriander, Methi, Spinach, Brinjal, Bottle Gourd, Ridge Gourd, Capsicum, Mint, Basil, Radish, Carrot, Cucumber)',
      seedType: 'Non-GMO Heirloom',
      season: 'All-season (Kharif + Rabi)',
      germinationRate: '85%+',
    },
    shipping: { type: 'direct', estimatedDays: 4 },
    reviews: [
      {
        user: 'Raghav M.',
        rating: 5,
        comment: 'Started a terrace garden with this kit. 13 out of 15 varieties sprouted beautifully.',
        date: daysFromNow(-7),
      },
    ],
  },

  // ── Closed batch (for historical data) ────────────────────────────────────
  {
    id: 'batch-014',
    manufacturerId: 'mfr-001',
    title: 'Toor Dal — Premium Unpolished — 1 kg',
    description:
      'Farm-fresh unpolished toor dal from Madhya Pradesh. High protein, no artificial polish or oil coating. FSSAI certified.',
    category: 'fmcg',
    images: ['/placeholder-product.jpg'],
    tiers: [
      { minSlots: 1, maxSlots: 50, price: 135 },
      { minSlots: 51, maxSlots: 150, price: 118 },
      { minSlots: 151, maxSlots: 300, price: 105 },
      { minSlots: 301, maxSlots: 500, price: 95 },
    ],
    currentSlots: 500,
    moq: 5,
    maxSlots: 500,
    status: 'CLOSED',
    startTime: daysFromNow(-7),
    endTime: daysFromNow(-1),
    velocity: 0,
    recentJoiners: [],
    specs: {
      weight: '1 kg per pack',
      type: 'Unpolished',
      origin: 'Madhya Pradesh',
      certification: 'FSSAI',
      shelfLife: '10 months',
    },
    shipping: { type: 'direct', estimatedDays: 5 },
    reviews: [
      {
        user: 'Sunita B.',
        rating: 5,
        comment: 'Batch completed fast! Great dal, cooking quality is outstanding.',
        date: daysFromNow(-2),
      },
      {
        user: 'Manoj P.',
        rating: 4,
        comment: 'Tasty and fresh. Delivery was a day late but product was worth it.',
        date: daysFromNow(-1),
      },
    ],
  },
];

// =============================================================================
// 4. DERIVED BATCH LISTS
// =============================================================================

/** Top 4 batches by velocity (slots filled per hour). */
export const TRENDING_BATCHES = [...BATCHES]
  .filter((b) => b.status !== 'CLOSED')
  .sort((a, b) => b.velocity - a.velocity)
  .slice(0, 4);

/** Batches ending within the next 6 hours. */
export const ENDING_SOON_BATCHES = BATCHES.filter((b) => {
  if (b.status === 'CLOSED') return false;
  const hoursLeft = (new Date(b.endTime) - NOW) / 3600_000;
  return hoursLeft > 0 && hoursLeft <= 6;
});

/** Batches whose startTime is within the last 24 hours. */
export const NEW_BATCHES = BATCHES.filter((b) => {
  const hoursSinceStart = (NOW - new Date(b.startTime)) / 3600_000;
  return hoursSinceStart >= 0 && hoursSinceStart <= 24;
});

// =============================================================================
// 5. ORDERS
// =============================================================================

export const ORDERS = [
  {
    id: 'ORD-20260610-001',
    batchId: 'batch-014',
    batchTitle: 'Toor Dal — Premium Unpolished — 1 kg',
    quantity: 20,
    pricePerUnit: 95,
    totalAmount: 1900,
    status: 'DELIVERED',
    orderedAt: daysFromNow(-6),
    trackingNumber: 'DTDC-9812734560',
    manufacturer: 'Shree Ganesh Agro Foods',
  },
  {
    id: 'ORD-20260611-002',
    batchId: 'batch-004',
    batchTitle: 'USB-C to USB-C Fast Charging Cable — 1.5 m',
    quantity: 10,
    pricePerUnit: 129,
    totalAmount: 1290,
    status: 'SHIPPED',
    orderedAt: daysFromNow(-3),
    trackingNumber: 'DELHIVERY-BLK7823410',
    manufacturer: 'NovaTech Accessories Pvt Ltd',
  },
  {
    id: 'ORD-20260612-003',
    batchId: 'batch-007',
    batchTitle: "Men's Round-Neck Cotton T-Shirt — 180 GSM",
    quantity: 25,
    pricePerUnit: 245,
    totalAmount: 6125,
    status: 'CONFIRMED',
    orderedAt: daysFromNow(-1),
    trackingNumber: null,
    manufacturer: 'Ludhiana Knit Exports',
  },
  {
    id: 'ORD-20260609-004',
    batchId: 'batch-009',
    batchTitle: 'Stainless Steel Water Bottle — 1 L (304 Grade)',
    quantity: 15,
    pricePerUnit: 259,
    totalAmount: 3885,
    status: 'DELIVERED',
    orderedAt: daysFromNow(-8),
    trackingNumber: 'BLUEDART-4456712380',
    manufacturer: 'Rajdhani Steel Works',
  },
  {
    id: 'ORD-20260613-005',
    batchId: 'batch-011',
    batchTitle: 'Handmade Ayurvedic Soap — Neem & Tulsi (125 g × 4)',
    quantity: 10,
    pricePerUnit: 199,
    totalAmount: 1990,
    status: 'CONFIRMED',
    orderedAt: hoursFromNow(-5),
    trackingNumber: null,
    manufacturer: 'Deccan Naturals',
  },
  {
    id: 'ORD-20260607-006',
    batchId: 'batch-001',
    batchTitle: 'Premium Chana Dal — 1 kg Pack',
    quantity: 30,
    pricePerUnit: 74,
    totalAmount: 2220,
    status: 'DELIVERED',
    orderedAt: daysFromNow(-12),
    trackingNumber: 'ECOM-EXP-3345120098',
    manufacturer: 'Shree Ganesh Agro Foods',
  },
];

// =============================================================================
// 6. WALLET
// =============================================================================

export const WALLET = {
  balance: 2475,
  transactions: [
    {
      id: 'txn-001',
      type: 'credit',
      amount: 500,
      description: 'Welcome bonus — first order reward',
      date: daysFromNow(-30),
    },
    {
      id: 'txn-002',
      type: 'debit',
      amount: 1900,
      description: 'Order ORD-20260610-001 — Toor Dal 20 units',
      date: daysFromNow(-6),
    },
    {
      id: 'txn-003',
      type: 'credit',
      amount: 190,
      description: 'Cashback — Toor Dal batch (10% reward)',
      date: daysFromNow(-5),
    },
    {
      id: 'txn-004',
      type: 'credit',
      amount: 5000,
      description: 'Wallet top-up via UPI',
      date: daysFromNow(-4),
    },
    {
      id: 'txn-005',
      type: 'debit',
      amount: 1290,
      description: 'Order ORD-20260611-002 — USB-C Cable 10 units',
      date: daysFromNow(-3),
    },
    {
      id: 'txn-006',
      type: 'credit',
      amount: 75,
      description: 'Referral bonus — Priya M. joined BulkBlitz',
      date: daysFromNow(-2),
    },
    {
      id: 'txn-007',
      type: 'debit',
      amount: 100,
      description: 'Batch reservation — Cotton T-Shirts',
      date: daysFromNow(-1),
    },
  ],
};

// =============================================================================
// 7. USER
// =============================================================================

export const USER = {
  id: 'usr-78234',
  name: 'Ashish Sharma',
  phone: '+91 98765 43210',
  email: 'ashish.sharma@gmail.com',
  avatar: 'AS',
  trustScore: 92,
  addresses: [
    {
      id: 'addr-1',
      label: 'Home',
      line1: 'Flat 402, Sunflower Residency',
      line2: 'Baner Road, Baner',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411045',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Office',
      line1: '3rd Floor, TechPark One',
      line2: 'Hinjewadi Phase 2',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411057',
      isDefault: false,
    },
  ],
  joinedAt: '2025-11-15T10:30:00.000Z',
};

// =============================================================================
// 8. STATS (Hero / Landing page)
// =============================================================================

export const STATS = {
  totalBuyers: 48500,
  totalManufacturers: 320,
  totalSaved: 1_85_00_000, // ₹1.85 crore saved by buyers
  activeBatches: 142,
};

// =============================================================================
// 9. HELPER FUNCTIONS
// =============================================================================

/**
 * Find a batch by its ID.
 *
 * @param {string} id
 * @returns {object|undefined}
 */
export function getBatchById(id) {
  return BATCHES.find((b) => b.id === id);
}

/**
 * Return all batches that belong to a given category.
 *
 * @param {string} categoryId - e.g. "fmcg", "electronics"
 * @returns {object[]}
 */
export function getBatchesByCategory(categoryId) {
  return BATCHES.filter((b) => b.category === categoryId);
}

/**
 * Determine the current price tier for a batch based on how many slots
 * have been filled.
 *
 * @param {object} batch
 * @returns {{ minSlots: number, maxSlots: number, price: number }}
 */
export function getCurrentTier(batch) {
  if (!batch || !batch.tiers || batch.tiers.length === 0) return null;

  const filled = batch.currentSlots || 0;

  // Walk tiers from highest to lowest and return the first match
  for (let i = batch.tiers.length - 1; i >= 0; i--) {
    if (filled >= batch.tiers[i].minSlots) {
      return batch.tiers[i];
    }
  }

  return batch.tiers[0];
}

/**
 * Calculate the percentage saved between the first (highest) tier price
 * and the current tier price.
 *
 * @param {object} batch
 * @returns {number} e.g. 28 for 28%
 */
export function getSavingsPercent(batch) {
  if (!batch || !batch.tiers || batch.tiers.length < 2) return 0;

  const firstPrice = batch.tiers[0].price;
  const currentTier = getCurrentTier(batch);
  if (!currentTier || currentTier.price >= firstPrice) return 0;

  return Math.round(((firstPrice - currentTier.price) / firstPrice) * 100);
}

/**
 * Compute a countdown object from an ISO end-time string.
 *
 * @param {string} endTime - ISO 8601 date string
 * @returns {{ hours: number, minutes: number, seconds: number }}
 */
export function getTimeRemaining(endTime) {
  const diff = Math.max(0, new Date(endTime) - new Date());
  const totalSec = Math.floor(diff / 1000);

  return {
    hours: Math.floor(totalSec / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
  };
}

/**
 * How many more buyers are needed to unlock the next price tier?
 *
 * @param {object} batch
 * @returns {number|null} null if already at the last tier
 */
export function getSlotsToNextTier(batch) {
  if (!batch || !batch.tiers) return null;

  const filled = batch.currentSlots || 0;
  const currentTier = getCurrentTier(batch);
  const currentIdx = batch.tiers.indexOf(currentTier);

  if (currentIdx === -1 || currentIdx >= batch.tiers.length - 1) return null;

  const nextTier = batch.tiers[currentIdx + 1];
  return Math.max(0, nextTier.minSlots - filled);
}

/**
 * Find a manufacturer by their ID.
 *
 * @param {string} id
 * @returns {object|undefined}
 */
export function getManufacturerById(id) {
  return MANUFACTURERS.find((m) => m.id === id);
}
