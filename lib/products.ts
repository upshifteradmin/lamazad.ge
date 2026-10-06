export interface Product {
  id: string;
  slug: string;
  brand: string; // 'Nike', 'Adidas', 'Jordan', "Levi's", 'New Balance', 'Carhartt', 'Lamazad Custom'
  isAuthentic?: boolean; // 100% verified original guarantee badge
  titleKa: string;
  titleEn: string;
  category: 'sneakers' | 'streetwear' | 'limited-drops';
  categoryLabelKa: string;
  price: number;
  originalPrice?: number;
  stockCount: number; // e.g. 2, 4, 6
  isLimitedDrop?: boolean;
  isNewArrival?: boolean;
  descriptionKa: string;
  descriptionEn: string;
  images: string[];
  videoPreview?: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  specs: { label: string; value: string }[];
  tagKa: string;
}

export const BRANDS = [
  'ყველა ბრენდი',
  'Nike',
  'Adidas',
  'Jordan',
  "Levi's",
  'New Balance',
  'Carhartt',
  'Lamazad Custom',
] as const;

export const PRODUCTS: Product[] = [
  // --- NIKE ---
  {
    id: 'nike-dunk-low-panda',
    slug: 'nike-dunk-low-retro-panda',
    brand: 'Nike',
    isAuthentic: true,
    titleKa: "NIKE DUNK LOW RETRO 'PANDA'",
    titleEn: "Nike Dunk Low Retro 'Panda' Black/White",
    category: 'sneakers',
    categoryLabelKa: 'სნეიკერები / Nike',
    price: 330,
    originalPrice: 420, // -21%
    stockCount: 4,
    isLimitedDrop: true,
    isNewArrival: true,
    tagKa: '🔥 ყველაზე მოთხოვნადი',
    descriptionKa: 'ლეგენდარული შავ-თეთრი Dunk Low Retro. პრემიუმ ტყავის ზედაპირი, კლასიკური საკალათბურთო პროფილი და კომფორტული ქაფის ძირი. 100% ორიგინალი ოფიციალური ევროპული ლოტისგან.',
    descriptionEn: 'The iconic Nike Dunk Low Retro Panda colorway. Smooth leather upper with timeless two-tone blocking.',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['40', '41', '42', '42.5', '43', '44', '45'],
    colors: [
      { name: 'White / Black Panda', hex: '#111111' },
    ],
    specs: [
      { label: 'ბრენდი', value: 'Nike (100% ორიგინალი)' },
      { label: 'მოდელის კოდი', value: 'DD1391-100' },
      { label: 'მასალა', value: 'ნატურალური რბილი ტყავი' },
      { label: 'მიწოდება', value: 'ბათუმში 24 საათში ადგილზე მოსინჯვით' },
    ],
  },
  {
    id: 'nike-af1-07-white',
    slug: 'nike-air-force-1-07-triple-white',
    brand: 'Nike',
    isAuthentic: true,
    titleKa: "NIKE AIR FORCE 1 '07 TRIPLE WHITE",
    titleEn: "Nike Air Force 1 '07 Classic White",
    category: 'sneakers',
    categoryLabelKa: 'სნეიკერები / Nike',
    price: 290,
    originalPrice: 350, // -17%
    stockCount: 6,
    isNewArrival: false,
    tagKa: '⭐ Streetwear კლასიკა',
    descriptionKa: 'ქუჩის სტილის მარადიული სიმბოლო. თოვლივით თეთრი ტყავი, ჩამონტაჟებული Nike Air ბალიში და უწყვეტი გამძლეობა. იდეალურია ნებისმიერი ლუქისთვის.',
    descriptionEn: 'The radiant Nike Air Force 1 07 delivers fresh details with the same iconic cushioning you love.',
    images: [
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    colors: [
      { name: 'Triple White', hex: '#ffffff' },
    ],
    specs: [
      { label: 'ბრენდი', value: 'Nike (Verified Authentic)' },
      { label: 'ამორტიზაცია', value: 'Encapsulated Nike Air-Sole unit' },
      { label: 'ძირი', value: 'არამცურავი რეზინის პროტექტორი' },
    ],
  },
  {
    id: 'nike-tech-fleece-hoodie',
    slug: 'nike-sportswear-tech-fleece-windrunner',
    brand: 'Nike',
    isAuthentic: true,
    titleKa: 'NIKE SPORTSWEAR TECH FLEECE HOODIE',
    titleEn: 'Nike Sportswear Tech Fleece Full-Zip Windrunner',
    category: 'streetwear',
    categoryLabelKa: 'ტანსაცმელი / Nike',
    price: 285,
    originalPrice: 360, // -21%
    stockCount: 3,
    isLimitedDrop: false,
    isNewArrival: true,
    tagKa: '⚡ Tech Fleece სერია',
    descriptionKa: 'მსუბუქი სითბო და პრემიუმ ურბანული სტილი. ორმხრივი გლუვი საწმისი, თერმო-ელვა და დახვეწილი მკლავის ჯიბე. საუკეთესო არჩევანი ბათუმის დინამიური დღეებისთვის.',
    descriptionEn: 'Premium low-profile fleece that feels smooth on both sides. Distinctive zippered chevron pocket.',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Heather Grey', hex: '#77797e' },
      { name: 'Anthracite Black', hex: '#1c1c1f' },
    ],
    specs: [
      { label: 'შემადგენლობა', value: '66% ბამბა / 34% პოლიესტერი' },
      { label: 'ფიტი', value: 'Slim Athletic Street Fit' },
      { label: 'ელვა', value: 'Full-length 2-way Zipper' },
    ],
  },

  // --- ADIDAS ---
  {
    id: 'adidas-samba-og-white',
    slug: 'adidas-originals-samba-og-white-black',
    brand: 'Adidas',
    isAuthentic: true,
    titleKa: "ADIDAS ORIGINALS SAMBA OG",
    titleEn: "Adidas Originals Samba OG 'Cloud White/Core Black'",
    category: 'sneakers',
    categoryLabelKa: 'სნეიკერები / Adidas',
    price: 310,
    originalPrice: 380, // -18%
    stockCount: 5,
    isNewArrival: true,
    tagKa: '🔥 2026 წლის ჰიტი',
    descriptionKa: 'ტრიბუნების საკულტო ფეხსაცმელი, რომელიც თანამედროვე ქუჩის მოდის N1 ტრენდად იქცა. რბილი ტყავი, ზამშის T-toe და კლასიკური რეზინის ყავისფერი Gum sole.',
    descriptionEn: 'Born on the pitch, the Samba is a timeless icon of street style. Leather upper with suede overlays and gum rubber outsole.',
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: [
      { name: 'Cloud White / Core Black', hex: '#ffffff' },
    ],
    specs: [
      { label: 'ბრენდი', value: 'Adidas Originals' },
      { label: 'ძირი', value: 'Gum Rubber Cupsole' },
      { label: 'წარმოშობა', value: '100% ავთენტური ევროპული იმპორტი' },
    ],
  },
  {
    id: 'adidas-gazelle-indoor-blue',
    slug: 'adidas-gazelle-indoor-collegiate-navy',
    brand: 'Adidas',
    isAuthentic: true,
    titleKa: "ADIDAS GAZELLE INDOOR BLUE",
    titleEn: "Adidas Originals Gazelle Indoor Navy Suede",
    category: 'sneakers',
    categoryLabelKa: 'სნეიკერები / Adidas',
    price: 275,
    originalPrice: 340, // -19%
    stockCount: 3,
    tagKa: '🌊 ბათუმის ფავორიტი',
    descriptionKa: 'პრემიუმ ხავერდოვანი ზამში ლურჯ ტონალობაში, გამჭვირვალე რეზინის ძირით. 70-იანი წლების ვინტაჟური ესთეტიკა შეუდარებელი კომფორტით.',
    descriptionEn: 'Rich suede upper paired with a semi-translucent gum rubber outsole for authentic retro cool.',
    images: [
      'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['40', '41', '42', '43', '44'],
    colors: [
      { name: 'Collegiate Navy', hex: '#1c2940' },
    ],
    specs: [
      { label: 'ზედაპირი', value: 'ნატურალური პრემიუმ ზამში' },
      { label: 'ლაინერი', value: 'ტყავის რბილი შიგთავსი' },
    ],
  },
  {
    id: 'adidas-campus-00s-black',
    slug: 'adidas-campus-00s-core-black',
    brand: 'Adidas',
    isAuthentic: true,
    titleKa: "ADIDAS CAMPUS 00s 'CORE BLACK'",
    titleEn: "Adidas Campus 00s Core Black/Cloud White",
    category: 'sneakers',
    categoryLabelKa: 'სნეიკერები / Adidas',
    price: 280,
    stockCount: 5,
    isLimitedDrop: false,
    tagKa: '🛹 Y2K Skate Vibe',
    descriptionKa: 'ფართო სილუეტი, განიერი თასმები და 2000-იანების სკეიტბორდინგის კულტურა. სქელი ზამში და შეუდარებელი გამძლეობა.',
    descriptionEn: 'Chunky Y2K skate proportions with plush suede and extra-wide contrasting laces.',
    images: [
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['39', '40', '41', '42', '43', '44'],
    colors: [
      { name: 'Core Black / White', hex: '#151515' },
    ],
    specs: [
      { label: 'სტილი', value: 'Oversized Y2K Skate Silhouette' },
      { label: 'თასმები', value: 'Fat Laces + სათადარიგო წყვილი' },
    ],
  },

  // --- JORDAN ---
  {
    id: 'jordan-1-retro-high-og',
    slug: 'air-jordan-1-retro-high-og-chicago',
    brand: 'Jordan',
    isAuthentic: true,
    titleKa: "AIR JORDAN 1 RETRO HIGH OG",
    titleEn: "Air Jordan 1 Retro High OG 'Lost & Found'",
    category: 'limited-drops',
    categoryLabelKa: 'ლიმიტირებული / Jordan',
    price: 520,
    originalPrice: 650, // -20%
    stockCount: 2,
    isLimitedDrop: true,
    isNewArrival: true,
    tagKa: '💎 GRAIL STATUS',
    descriptionKa: 'საკოლექციო დონის ლეგენდა. ვინტაჟური დამუშავების ტყავი, საკულტო წითელ-თეთრ-შავი პალიტრა და დანომრილი პარტია. 100% ორიგინალი ავთენტიფიკაციის სერტიფიკატით.',
    descriptionEn: 'The silhouette that started it all. Premium cracked leather finish and aged midsole storytelling.',
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['41', '42', '43', '44', '45'],
    colors: [
      { name: 'Chicago Red / Black / White', hex: '#c4151c' },
    ],
    specs: [
      { label: 'ხაზი', value: 'Jordan Brand Retro High' },
      { label: 'სტატუსი', value: 'Deadstock Collector Grail' },
      { label: 'გარანტია', value: '100% Original Verified' },
    ],
  },
  {
    id: 'jordan-4-retro-military',
    slug: 'air-jordan-4-retro-military-black',
    brand: 'Jordan',
    isAuthentic: true,
    titleKa: "AIR JORDAN 4 RETRO 'MILITARY BLACK'",
    titleEn: "Air Jordan 4 Retro Military Black",
    category: 'sneakers',
    categoryLabelKa: 'სნეიკერები / Jordan',
    price: 590,
    originalPrice: 720, // -18%
    stockCount: 2,
    isLimitedDrop: true,
    tagKa: '🔥 HYPE DROP',
    descriptionKa: 'ყველაზე ცხელი Jordan 4 სილუეტი. ნატურალური ტყავი ნაცრისფერი ზამშის ტალღოვანი ჩანართებით, ბადისებრი პანელები და ხილული Air ბალიში ქუსლში.',
    descriptionEn: 'Crisp white leather upper enhanced with neutral grey suede overlay and contrasting black wings.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['41', '42', '42.5', '43', '44'],
    colors: [
      { name: 'White / Neutral Grey / Black', hex: '#ffffff' },
    ],
    specs: [
      { label: 'მოდელი', value: 'Air Jordan 4 Retro' },
      { label: 'ქუსლი', value: 'Visible Air Sole Cushioning' },
      { label: 'ორიგინალი', value: 'დამოწმებული შტრიხკოდით' },
    ],
  },

  // --- NEW BALANCE ---
  {
    id: 'nb-550-white-green',
    slug: 'new-balance-550-white-green',
    brand: 'New Balance',
    isAuthentic: true,
    titleKa: "NEW BALANCE 550 'WHITE GREEN'",
    titleEn: "New Balance 550 White Green Vintage",
    category: 'sneakers',
    categoryLabelKa: 'სნეიკერები / New Balance',
    price: 295,
    originalPrice: 370, // -20%
    stockCount: 4,
    isNewArrival: true,
    tagKa: '🌿 Retro Basketball',
    descriptionKa: '80-იანი წლების არქივებიდან დაბრუნებული შედევრი. სუფთა თეთრი პერფორირებული ტყავი, მწვანე აქცენტები და ვინტაჟური კალათბურთის ესთეტიკა.',
    descriptionEn: 'Tribute to 1989 basketball pro players. Clean leather and stream-lined retro low silhouette.',
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [
      { name: 'White / Forest Green', hex: '#1e3f20' },
    ],
    specs: [
      { label: 'ბრენდი', value: 'New Balance' },
      { label: 'მასალა', value: 'პერფორირებული ტყავი + ზამში' },
      { label: 'კომფორტი', value: 'EVA ორთოპედიული ჩაფენა' },
    ],
  },
  {
    id: 'nb-2002r-protection-pack',
    slug: 'new-balance-2002r-protection-pack-rain-cloud',
    brand: 'New Balance',
    isAuthentic: true,
    titleKa: "NEW BALANCE 2002R 'PROTECTION PACK'",
    titleEn: "New Balance 2002R Rain Cloud Deconstructed",
    category: 'sneakers',
    categoryLabelKa: 'სნეიკერები / New Balance',
    price: 380,
    originalPrice: 475, // -20%
    stockCount: 3,
    isLimitedDrop: true,
    tagKa: '⚡ Deconstructed Design',
    descriptionKa: 'დაფლეთილი ზამშის პანელები და ნედლი ჭრები. N-ergy ამორტიზაცია და Stability Web ტექნოლოგია მაქსიმალური ერგონომიკისთვის ბათუმის ქუჩებში სასეირნოდ.',
    descriptionEn: 'Raw-edged hairy suede overlays give an archival runner a rugged, unfinished modern flair.',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['41', '42', '43', '44'],
    colors: [
      { name: 'Rain Cloud Grey', hex: '#8c8d8f' },
    ],
    specs: [
      { label: 'ტექნოლოგია', value: 'N-ergy + ABZORB Cushioning' },
      { label: 'დიზაინი', value: 'Multi-layer Rough Cut Suede' },
    ],
  },
  {
    id: 'nb-1906r-silver-metallic',
    slug: 'new-balance-1906r-silver-metallic',
    brand: 'New Balance',
    isAuthentic: true,
    titleKa: "NEW BALANCE 1906R 'SILVER METALLIC'",
    titleEn: "New Balance 1906R Tech Runner Silver",
    category: 'sneakers',
    categoryLabelKa: 'სნეიკერები / New Balance',
    price: 340,
    stockCount: 4,
    tagKa: '⚡ Y2K Cyber Runner',
    descriptionKa: 'კიბერნეტიკული მეტალიკი და სუნთქვადი ბადე. N-lock თასმების სისტემა და ულტრა-რბილი ნაბიჯი. იდეალურია მათთვის, ვისაც უყვარს 2026/2027 ტექ-ესთეტიკა.',
    descriptionEn: 'High-tech Y2K runner with metallic open mesh and responsive N-ergy sole unit.',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['40', '41', '42', '43', '44'],
    colors: [
      { name: 'Metallic Silver / Black', hex: '#c5c6c8' },
    ],
    specs: [
      { label: 'ჩონჩხი', value: 'N-Lock Lacing Support' },
      { label: 'სუნთქვადობა', value: 'Open-cell Performance Mesh' },
    ],
  },

  // --- LEVI'S ---
  {
    id: 'levis-501-original-jeans',
    slug: 'levis-501-original-fit-jeans-stonewash',
    brand: "Levi's",
    isAuthentic: true,
    titleKa: "LEVI'S 501® ORIGINAL FIT JEANS",
    titleEn: "Levi's 501 Original Fit Straight Denim Stonewash",
    category: 'streetwear',
    categoryLabelKa: "ტანსაცმელი / Levi's",
    price: 240,
    originalPrice: 300, // -20%
    stockCount: 6,
    isNewArrival: true,
    tagKa: '👖 კულტურული ხატი',
    descriptionKa: 'ჯინსის ისტორიის საწყისი 1873 წლიდან. კლასიკური სწორი ჭრა, საკულტო ღილებიანი ჩამკეტი (Button Fly) და 100% მყარი დენიმი, რომელიც წლების მატებასთან ერთად უკეთესი ხდება.',
    descriptionEn: 'The original straight fit jeans since 1873. Signature button fly and 100% heavyweight cotton denim.',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['30/32', '31/32', '32/32', '33/32', '34/32', '36/32'],
    colors: [
      { name: 'Medium Stonewash Indigo', hex: '#395175' },
    ],
    specs: [
      { label: 'ბრენდი', value: "Levi's (100% ორიგინალი წითელი ტაბით)" },
      { label: 'ჭრა', value: 'Straight Leg, Regular Rise' },
      { label: 'შემადგენლობა', value: '100% Non-Stretch Cotton Denim (14 oz)' },
    ],
  },
  {
    id: 'levis-relaxed-trucker-jacket',
    slug: 'levis-relaxed-trucker-denim-jacket',
    brand: "Levi's",
    isAuthentic: true,
    titleKa: "LEVI'S® RELAXED TRUCKER JACKET",
    titleEn: "Levi's Relaxed Fit Trucker Denim Jacket",
    category: 'streetwear',
    categoryLabelKa: "ტანსაცმელი / Levi's",
    price: 270,
    originalPrice: 340, // -21%
    stockCount: 4,
    tagKa: '🧥 ვინტაჟური ქურთუკი',
    descriptionKa: 'ქუჩის სტილის ოვერსაიზ სილუეტი. ნარეცხი მუქი ინდიგო მეტალის ბრენდირებული ღილებითა და მკერდის ნაკერებიანი ჯიბეებით. იდეალურად ერგება ჰუდზე მოსაცმელად.',
    descriptionEn: 'Slouchy relaxed trucker jacket silhouette built from durable washed indigo denim.',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Dark Washed Indigo', hex: '#233246' },
    ],
    specs: [
      { label: 'ჭრა', value: 'Relaxed Drop-Shoulder Fit' },
      { label: 'ტაბი', value: "Original Levi's Red Tab" },
    ],
  },

  // --- CARHARTT WIP ---
  {
    id: 'carhartt-wip-active-jacket',
    slug: 'carhartt-wip-og-active-jacket-hamilton-brown',
    brand: 'Carhartt',
    isAuthentic: true,
    titleKa: "CARHARTT WIP OG ACTIVE JACKET",
    titleEn: "Carhartt WIP Heavy Canvas OG Active Jacket Hamilton Brown",
    category: 'streetwear',
    categoryLabelKa: 'ტანსაცმელი / Carhartt',
    price: 360,
    originalPrice: 450, // -20%
    stockCount: 3,
    isLimitedDrop: true,
    isNewArrival: true,
    tagKa: '🔨 მძიმე Dearborn Canvas',
    descriptionKa: 'სამუშაო ტანსაცმლის გამძლეობა გადატანილი ქუჩის მაღალ მოდაში. 12 უნცია მძიმე Dearborn ბამბის ტილო, თბილი შიდა სარჩული და სამმაგი გამაგრებული ნაკერები.',
    descriptionEn: 'Built from heavyweight 12 oz organic Dearborn Canvas with triple-stitched details and square Carhartt label.',
    images: [
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Hamilton Brown', hex: '#875129' },
      { name: 'Black Aged', hex: '#1e1e1e' },
    ],
    specs: [
      { label: 'ტილო', value: '12 oz 100% Organic Cotton Dearborn Canvas' },
      { label: 'სარჩული', value: 'Diamond Quilted Micro-fleece' },
      { label: 'ლოგო', value: 'Square Woven Carhartt WIP Patch' },
    ],
  },

  // --- LAMAZAD CUSTOM STUDIO & LIMITED DROPS ---
  {
    id: 'prod-01',
    slug: 'batumi-nocturne-heavy-hoodie',
    brand: 'Lamazad Custom',
    isAuthentic: true,
    titleKa: 'HOODIE "BATUMI NOCTURNE" (500 GSM)',
    titleEn: 'Batumi Nocturne Heavyweight Hoodie',
    category: 'streetwear',
    categoryLabelKa: 'ტანსაცმელი / ჰუდი',
    price: 176,
    originalPrice: 220, // -20%
    stockCount: 3,
    isLimitedDrop: true,
    isNewArrival: true,
    tagKa: '🔥 დარჩენილია 3 ცალი',
    descriptionKa: 'ულტრა-მძიმე 500 გრამიანი ფრანგული ტერი ბამბა. ემბოსირებული Batumi Nocturne გრაფიკა ზურგზე, წყალგამძლე ელვა და ოვერსაიზ სილუეტი. შექმნილია ბათუმის ნესტიანი და ქარიანი საღამოებისთვის.',
    descriptionEn: 'Ultra-heavy 500 GSM French terry cotton. Embossed Nocturne print on back, waterproof accents and slouchy oversized silhouette.',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    ],
    videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-a-hoodie-in-a-dark-room-41808-large.mp4',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Washed Black', hex: '#141416' },
      { name: 'Acid Slate', hex: '#2c2e35' },
    ],
    specs: [
      { label: 'მატერიალი', value: '100% ორგანული ქართული ბამბა (500 GSM)' },
      { label: 'ჭრა', value: 'Boxy Oversized Streetwear Fit' },
      { label: 'წარმოება', value: 'ხელნაკეთი ლიმიტირებული პარტია, ბათუმი' },
    ],
  },
  {
    id: 'prod-03',
    slug: 'ali-nino-cyber-kinetic-tee',
    brand: 'Lamazad Custom',
    isAuthentic: true,
    titleKa: 'LIMITED TEE "ALI & NINO 2099"',
    titleEn: 'Limited Drop: Ali & Nino 2099 Tee',
    category: 'limited-drops',
    categoryLabelKa: 'ლიმიტირებული დროპი',
    price: 110,
    stockCount: 5,
    isLimitedDrop: true,
    tagKa: '💎 50 ცალიანი კოლექცია',
    descriptionKa: 'ბათუმის საკულტო მოძრავი სკულპტურის კიბერპანკ რეინტერპრეტაცია. მაღალი რეზოლუციის აბრეშუმის ტრაფარეტული ბეჭდვა მბზინავი პიგმენტებით, რომელიც ულტრაიისფერ შუქზე ანათებს.',
    descriptionEn: 'Cyberpunk reimagining of the iconic kinetic Ali & Nino sculpture. High-density screen print with UV reactive pigments.',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pure Carbon', hex: '#111113' },
      { name: 'Chalk Bone', hex: '#ebeae6' },
    ],
    specs: [
      { label: 'სიმკვრივე', value: '280 GSM Heavy Cotton' },
      { label: 'ბეჭდვა', value: 'UV Glow Screenprint + High-Density Ink' },
      { label: 'ტირაჟი', value: 'მხოლოდ 50 დანომრილი ეგზემპლარი' },
    ],
  },
  {
    id: 'prod-04',
    slug: 'batumi-port-cargo-pants',
    brand: 'Lamazad Custom',
    isAuthentic: true,
    titleKa: 'CARGO PANTS "BATUMI DOCK 04"',
    titleEn: 'Batumi Dock 04 Modular Cargo Pants',
    category: 'streetwear',
    categoryLabelKa: 'ტანსაცმელი / შარვალი',
    price: 175,
    originalPrice: 250, // -30%
    stockCount: 8,
    tagKa: '🌊 ბათუმის პორტის სერია',
    descriptionKa: 'ტექნიკური Ripstop ქსოვილი წყალგაუმტარი საფარით. 6 მოდულური ჯიბე მაგნიტური საკეტებით, რეგულირებადი ქვედა ნაწილი ფეხსაცმელთან კომბინაციისთვის.',
    descriptionEn: 'Technical ripstop cargo pants with water-repellent coating and magnetic quick-access pockets.',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
    ],
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Deep Coal', hex: '#161619' },
      { name: 'Submarine Khaki', hex: '#2b2a24' },
    ],
    specs: [
      { label: 'ქსოვილი', value: 'DWR Coated Cordura / Cotton Blend' },
      { label: 'ჯიბეები', value: 'Fidlock მაგნიტური საკეტები' },
    ],
  },
];
