export interface ProductColor {
  name: string;
  hex: string;
  image: string; // NOW REQUIRED — har color ni apni image hone joye
}

export interface FabricInfo {
  material?: string;
  weight?: string;
  weave?: string;
  origin?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'saree' | 'lehenga' | 'evening' | 'bridal';
  fabric: string;
  colors: ProductColor[];
  sizes: string[];
  image: string;
  images: string[];
  description: string;
  fabricInfo?: FabricInfo;
  careInstructions?: string;
  featured: boolean;
  badge?: string;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Chanderi Silk Saree",
    price: 18500,
    originalPrice: 24000,
    category: "saree",
    fabric: "Chanderi Silk",
    colors: [
      {
        name: "Rose Pink",
        hex: "#C8577A",
        image: "https://images.pexels.com/photos/4048041/pexels-photo-4048041.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
      {
        name: "Midnight Navy",
        hex: "#0a1128",
        image: "https://images.pexels.com/photos/29172779/pexels-photo-29172779.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
      {
        name: "Royal Gold",
        hex: "#D4AF37",
        image: "https://images.pexels.com/photos/15226347/pexels-photo-15226347.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
    ],
    sizes: ["Free Size"],
    image: "https://images.pexels.com/photos/4048041/pexels-photo-4048041.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    images: [
      "https://images.pexels.com/photos/4048041/pexels-photo-4048041.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      "https://images.pexels.com/photos/29172779/pexels-photo-29172779.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      "https://images.pexels.com/photos/15226347/pexels-photo-15226347.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    ],
    description: "A timeless Chanderi silk saree with intricate gold zari work along the border. The delicate handwoven motifs tell stories of generations of master weavers. Perfect for festive occasions and celebrations.",
    featured: true,
    badge: "BESTSELLER",
    rating: 4.8,
    reviews: 234,
  },
  {
    id: 2,
    name: "Banarasi Bridal Lehenga",
    price: 85000,
    category: "bridal",
    fabric: "Pure Banarasi Silk",
    colors: [
      {
        name: "Bridal Red",
        hex: "#8B0000",
        image: "https://images.pexels.com/photos/15123420/pexels-photo-15123420.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
      {
        name: "Rose Gold",
        hex: "#B76E79",
        image: "https://images.pexels.com/photos/12792006/pexels-photo-12792006.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
      {
        name: "Deep Maroon",
        hex: "#722f37",
        image: "https://images.pexels.com/photos/28210864/pexels-photo-28210864.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "https://images.pexels.com/photos/15123420/pexels-photo-15123420.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    images: [
      "https://images.pexels.com/photos/15123420/pexels-photo-15123420.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      "https://images.pexels.com/photos/12792006/pexels-photo-12792006.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      "https://images.pexels.com/photos/28210864/pexels-photo-28210864.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    ],
    description: "An exquisite Banarasi bridal lehenga adorned with traditional zardozi embroidery. Each piece takes over 400 hours to handcraft, featuring real gold thread work and precious stone accents.",
    featured: true,
    rating: 4.9,
    reviews: 156,
  },
  {
    id: 3,
    name: "Emerald Evening Gown",
    price: 32000,
    originalPrice: 42000,
    category: "evening",
    fabric: "Italian Georgette",
    colors: [
      {
        name: "Emerald",
        hex: "#046307",
        image: "https://images.pexels.com/photos/1655844/pexels-photo-1655844.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
      {
        name: "Sapphire",
        hex: "#0f52ba",
        image: "https://images.pexels.com/photos/8891974/pexels-photo-8891974.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
      {
        name: "Onyx",
        hex: "#1a1a1a",
        image: "https://images.pexels.com/photos/2220315/pexels-photo-2220315.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
    ],
    sizes: ["XS", "S", "M", "L"],
    image: "https://images.pexels.com/photos/1655844/pexels-photo-1655844.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    images: [
      "https://images.pexels.com/photos/1655844/pexels-photo-1655844.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      "https://images.pexels.com/photos/8891974/pexels-photo-8891974.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    ],
    description: "A stunning floor-length evening gown in rich emerald georgette. Features a dramatic back, hand-embellished bodice, and flowing silhouette that commands every room.",
    featured: true,
    badge: "24% OFF",
    rating: 4.7,
    reviews: 89,
  },
  {
    id: 4,
    name: "Kanjivaram Heritage Saree",
    price: 45000,
    category: "saree",
    fabric: "Pure Kanjivaram Silk",
    colors: [
      {
        name: "Temple Gold",
        hex: "#D4AF37",
        image: "https://images.pexels.com/photos/7486649/pexels-photo-7486649.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
      {
        name: "Peacock Blue",
        hex: "#005f73",
        image: "https://images.pexels.com/photos/29172779/pexels-photo-29172779.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
      {
        name: "Wine",
        hex: "#722f37",
        image: "https://images.pexels.com/photos/4048041/pexels-photo-4048041.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
    ],
    sizes: ["Free Size"],
    image: "https://images.pexels.com/photos/7486649/pexels-photo-7486649.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    images: [
      "https://images.pexels.com/photos/7486649/pexels-photo-7486649.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      "https://images.pexels.com/photos/29172779/pexels-photo-29172779.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    ],
    description: "A masterpiece from the Kanjivaram weaving tradition. This heritage saree features temple border motifs and pure gold zari, crafted by National Award-winning artisans.",
    featured: true,
    rating: 5.0,
    reviews: 312,
  },
  {
    id: 5,
    name: "Designer Cocktail Lehenga",
    price: 28000,
    originalPrice: 35000,
    category: "lehenga",
    fabric: "Net & Raw Silk",
    colors: [
      {
        name: "Dusty Rose",
        hex: "#C8577A",
        image: "https://images.pexels.com/photos/13661851/pexels-photo-13661851.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
      {
        name: "Powder Blue",
        hex: "#b0c4de",
        image: "https://images.pexels.com/photos/28210864/pexels-photo-28210864.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
      {
        name: "Mint",
        hex: "#98ff98",
        image: "https://images.pexels.com/photos/15226347/pexels-photo-15226347.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    image: "https://images.pexels.com/photos/13661851/pexels-photo-13661851.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    images: [
      "https://images.pexels.com/photos/13661851/pexels-photo-13661851.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      "https://images.pexels.com/photos/28210864/pexels-photo-28210864.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    ],
    description: "A modern cocktail lehenga that bridges tradition with contemporary design. Featuring mirror work, sequin detailing, and a trendy crop-top blouse pattern.",
    featured: false,
    badge: "20% OFF",
    rating: 4.6,
    reviews: 178,
  },
  {
    id: 6,
    name: "Organza Celebration Saree",
    price: 12500,
    category: "saree",
    fabric: "Pure Organza",
    colors: [
      {
        name: "Blush",
        hex: "#de5d83",
        image: "https://images.pexels.com/photos/15226347/pexels-photo-15226347.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
      {
        name: "Lavender",
        hex: "#b57edc",
        image: "https://images.pexels.com/photos/4048041/pexels-photo-4048041.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
      {
        name: "Champagne",
        hex: "#f7e7ce",
        image: "https://images.pexels.com/photos/29172779/pexels-photo-29172779.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
    ],
    sizes: ["Free Size"],
    image: "https://images.pexels.com/photos/15226347/pexels-photo-15226347.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    images: [
      "https://images.pexels.com/photos/15226347/pexels-photo-15226347.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      "https://images.pexels.com/photos/4048041/pexels-photo-4048041.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    ],
    description: "Lightweight and ethereal, this organza saree is adorned with delicate floral embroidery and a scalloped border. The perfect balance of grace and modernity.",
    featured: false,
    rating: 4.5,
    reviews: 201,
  },
  {
    id: 7,
    name: "Royal Bridal Ensemble",
    price: 125000,
    category: "bridal",
    fabric: "Velvet & Zardozi",
    colors: [
      {
        name: "Royal Red",
        hex: "#c41e3a",
        image: "https://images.pexels.com/photos/12792006/pexels-photo-12792006.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
      {
        name: "Imperial Gold",
        hex: "#D4AF37",
        image: "https://images.pexels.com/photos/15123420/pexels-photo-15123420.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
    ],
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.pexels.com/photos/12792006/pexels-photo-12792006.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    images: [
      "https://images.pexels.com/photos/12792006/pexels-photo-12792006.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      "https://images.pexels.com/photos/15123420/pexels-photo-15123420.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    ],
    description: "The crown jewel of our bridal collection. This royal ensemble features over 50,000 hand-embroidered crystals, genuine gold zardozi work, and a dramatic 12-foot train.",
    featured: false,
    rating: 5.0,
    reviews: 67,
  },
  {
    id: 8,
    name: "Noir Couture Gown",
    price: 38000,
    category: "evening",
    fabric: "French Chiffon",
    colors: [
      {
        name: "Noir",
        hex: "#1a1a1a",
        image: "https://images.pexels.com/photos/8891974/pexels-photo-8891974.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
      {
        name: "Midnight Blue",
        hex: "#191970",
        image: "https://images.pexels.com/photos/1655844/pexels-photo-1655844.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      },
    ],
    sizes: ["XS", "S", "M", "L"],
    image: "https://images.pexels.com/photos/8891974/pexels-photo-8891974.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    images: [
      "https://images.pexels.com/photos/8891974/pexels-photo-8891974.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      "https://images.pexels.com/photos/1655844/pexels-photo-1655844.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    ],
    description: "An architectural masterpiece in French chiffon. This noir couture gown features geometric draping, asymmetric hemline, and hidden pockets — because luxury should be practical.",
    featured: false,
    rating: 4.8,
    reviews: 143,
  },
];

export const collections = [
  {
    id: "bridal",
    name: "Bridal Heritage",
    description: "Timeless bridal ensembles for your forever moment",
    image: "https://images.pexels.com/photos/12792006/pexels-photo-12792006.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
  },
  {
    id: "festive",
    name: "Festive Edit",
    description: "Celebrate every occasion in splendor",
    image: "https://images.pexels.com/photos/7486649/pexels-photo-7486649.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
  },
  {
    id: "evening",
    name: "Evening Couture",
    description: "Command every room you enter",
    image: "https://images.pexels.com/photos/1655844/pexels-photo-1655844.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
  },
];

export const testimonials = [
  {
    name: "Priya Sharma",
    text: "The Banarasi lehenga was beyond my dreams. Every guest at my wedding couldn't stop admiring the craftsmanship.",
    rating: 5,
    location: "Mumbai",
  },
  {
    name: "Ananya Patel",
    text: "Heer's Design transformed my vision into reality. The custom saree they created for me was a masterpiece.",
    rating: 5,
    location: "Ahmedabad",
  },
  {
    name: "Deepika Reddy",
    text: "From the first consultation to delivery, the experience was nothing short of royal. Truly luxury fashion.",
    rating: 5,
    location: "Hyderabad",
  },
];
