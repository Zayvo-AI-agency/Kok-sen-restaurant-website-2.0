import { MenuItem, TableSpreadPreset, ReviewItem, FaqItem, OutletInfo, GalleryPhotoItem } from '../types';
import { CLIENT_MENU_PHOTOS } from './clientMenuPhotos';

import koksenStorefront from '../assets/images/koksen_storefront_1790066148914.jpg';
import koksenDiningRoom from '../assets/images/koksen_dining_room_1790066311335.jpg';
import koksenVerandah from '../assets/images/koksen_verandah_1790066517759.jpg';
import koksenPrawnHorfun from '../assets/images/koksen_prawn_horfun_1790066221726.jpg';
import koksenClaypotTofu from '../assets/images/koksen_claypot_tofu_1790066247711.jpg';
import koksenHarCheongGai from '../assets/images/koksen_har_cheong_gai_1790066267150.jpg';
import koksenCrispyChicken from '../assets/images/koksen_crispy_chicken_1790066292467.jpg';
import koksenBeefBittergourd from '../assets/images/koksen_beef_bittergourd_1790066335962.jpg';
import koksenSambalKangkong from '../assets/images/koksen_sambal_kangkong_1790066465985.jpg';
import koksenBeefHorfun from '../assets/images/koksen_beef_horfun_1790066484862.jpg';
import koksenRoastPork from '../assets/images/koksen_roast_pork_1790066503338.jpg';
import koksenWokFlame from '../assets/images/koksen_wok_flame_1790066635917.jpg';

// Authentic Kok Sen photos uploaded by diner / archival collection
import koksenStreetAwning from '../assets/images/koksen_street_awning_1790188980533.jpg';
import koksenNeonSigns from '../assets/images/koksen_neon_signs_1790189007005.jpg';
import koksenArtWall from '../assets/images/koksen_art_wall_1790189019432.jpg';
import koksenKeongSaikDusk from '../assets/images/koksen_keong_saik_dusk_1790189032018.jpg';
import koksenDiningBooths from '../assets/images/koksen_dining_booths_1790189042512.jpg';
import koksenEveningQueue from '../assets/images/koksen_evening_queue_1790189054606.jpg';
import koksenPanoramicHall from '../assets/images/koksen_panoramic_hall_1790189065831.jpg';
import koksenMichelinDoor from '../assets/images/koksen_michelin_door_1790189078116.jpg';

// Authentic close-up food and menu photos matching diner's physical menu
import koksenPrawnNoodlesReal from '../assets/images/koksen_prawn_noodles_real_1790189836361.jpg';
import koksenYongTauFooReal from '../assets/images/koksen_yong_tau_foo_real_1790189864048.jpg';
import koksenCrispyChickenReal from '../assets/images/koksen_crispy_chicken_real_1790189886727.jpg';
import koksenHarCheongGaiReal from '../assets/images/koksen_har_cheong_gai_real_1790189903335.jpg';
import koksenBittergourdRibsReal from '../assets/images/koksen_bittergourd_ribs_real_1790189924965.jpg';
import koksenBlackBeanHorfunReal from '../assets/images/koksen_blackbean_horfun_real_1790189946383.jpg';
import koksenCollectionStorefront from '../assets/images/koksen_collection_storefront_1790189963048.jpg';

export const PHOTO_ASSETS = {
  storefront: koksenMichelinDoor,
  michelinDoor: koksenMichelinDoor,
  eveningQueue: koksenEveningQueue,
  streetAwning: koksenStreetAwning,
  neonSigns: koksenNeonSigns,
  artWall: koksenArtWall,
  keongSaikDusk: koksenKeongSaikDusk,
  diningBooths: koksenDiningBooths,
  panoramicHall: koksenPanoramicHall,
  diningRoom: koksenPanoramicHall,
  collectionStorefront: koksenCollectionStorefront,
  originalStorefront: koksenStorefront,
  verandah: koksenVerandah,
  prawnHorfun: koksenPrawnHorfun,
  prawnNoodlesReal: koksenPrawnNoodlesReal,
  yongTauFooReal: koksenYongTauFooReal,
  crispyChickenReal: koksenCrispyChickenReal,
  harCheongGaiReal: koksenHarCheongGaiReal,
  bittergourdRibsReal: koksenBittergourdRibsReal,
  blackBeanHorfunReal: koksenBlackBeanHorfunReal,
  claypotTofu: koksenYongTauFooReal,
  harCheongGai: koksenHarCheongGaiReal,
  crispyChicken: koksenCrispyChickenReal,
  sambalKangkong: koksenSambalKangkong,
  roastPork: koksenRoastPork,
  wokFlame: koksenWokFlame,
};

export const KEONG_SAIK_HOURS = {
  daysSummary: 'Tuesday – Sunday',
  closedSummary: 'Monday: Closed (Weekly Kitchen Rest)',
  isClosedOnMonday: true,
  lunchDisplay: 'Lunch: 12:00pm – 2:15pm (Last order 2:00pm)',
  dinnerDisplay: 'Dinner: 5:00pm – 9:15pm (Last order 8:45pm)',
  lunchTime: '12:00pm – 2:15pm',
  dinnerTime: '5:00pm – 9:15pm',
  lastOrderNote: 'Last lunch order 2:00pm · Last dinner order 8:45pm',
  statusNote: 'Open until 10:30 PM on weekend peak for seated diners. Queue forms ~15m early.',
} as const;

export const CITY_SQUARE_HOURS = {
  daysSummary: 'Open Daily · Monday–Sunday',
  closedSummary: 'None (Open 7 Days a Week)',
  isClosedOnMonday: false,
  lunchDisplay: 'Lunch: 11:30am–2:30pm',
  dinnerDisplay: 'Dinner: 4:30pm–9:00pm',
  lunchTime: '11:30am–2:30pm',
  dinnerTime: '4:30pm–9:00pm',
  statusNote: 'Fully air-conditioned dining room with round family banquet tables.',
} as const;

export const OUTLETS: OutletInfo[] = [
  {
    id: 'keong-saik',
    name: 'Keong Saik Outlet (Flagship)',
    nameZh: '恭锡路总店',
    shortName: 'Keong Saik Outlet',
    address: '4 Keong Saik Road, Singapore 089110',
    district: 'Historic Chinatown / Keong Saik Shophouse Quarter',
    phone: '+65 9727 2533',
    phoneClean: '6597272533',
    whatsappNumber: '97272533',
    whatsappUrl: 'https://wa.me/6597272533',
    isFlagship: true,
    hours: KEONG_SAIK_HOURS,
  },
  {
    id: 'city-square-mall',
    name: 'City Square Mall Outlet',
    nameZh: '城市广场分店',
    shortName: 'City Square Mall Outlet',
    address: 'City Square Mall, 180 Kitchener Road, Singapore 208539',
    district: 'Kitchener Road / Farrer Park MRT (Direct Connection)',
    phone: '+65 9624 4244',
    phoneClean: '6596244244',
    whatsappNumber: '96244244',
    whatsappUrl: 'https://wa.me/6596244244',
    isFlagship: false,
    hours: CITY_SQUARE_HOURS,
  }
];

export const RESTAURANT_INFO = {
  nameEn: 'Kok Sen Restaurant',
  nameZh: '國成餐室',
  heritageNameZh: '國成球记菜社',
  establishedYear: '1968',
  address: '4 Keong Saik Road, Singapore 089110',
  district: 'Historic Chinatown / Keong Saik Shophouse Quarter',
  phone: '+65 9727 2533', // WhatsApp & Table inquiries (Keong Saik)
  phoneClean: '6597272533',
  reservationPhone: '+65 9727 2533', // Keong Saik Mainline WhatsApp
  reservationPhoneClean: '6597272533',
  keongSaikPhone: '+65 9727 2533',
  keongSaikPhoneClean: '6597272533',
  citySquareMallPhone: '+65 9624 4244',
  citySquareMallPhoneClean: '6596244244',
  outlets: OUTLETS,
  googleMapsUrl: 'https://share.google/jMYusWcExuUr1jP0p',
  rating: 4.0,
  reviewCount: '1,600+',
  michelinStatus: 'Michelin Guide Singapore · Bib Gourmand Awarded (2016–2026)',
  hours: [
    { day: 'Monday', lunch: 'Closed', dinner: 'Closed', outlet: 'Keong Saik (Flagship)' },
    { day: 'Tuesday – Sunday', lunch: '12:00pm – 2:15pm (Last order 2:00pm)', dinner: '5:00pm – 9:15pm (Last order 8:45pm)', outlet: 'Keong Saik (Flagship)' },
    { day: 'Monday – Sunday', lunch: '11:30am–2:30pm', dinner: '4:30pm–9:00pm', outlet: 'City Square Mall' },
  ],
  mrtStations: [
    { name: 'Outram Park MRT (EW16 / NE3 / TE17)', distance: '4 min walk (Exit 4)' },
    { name: 'Maxwell MRT (TE18)', distance: '5 min walk (Exit 2)' },
    { name: 'Chinatown MRT (NE4 / DT19)', distance: '6 min walk (Exit H)' }
  ]
};

export { MENU_CATEGORIES, FULL_MENU_ITEMS, TOP_SIGNATURES, type MenuCategoryDef } from "./menuData";

export const TABLE_SPREAD_PRESETS: TableSpreadPreset[] = [
  {
    id: "two-diners",
    title: "Two of You",
    dinerCount: "2 Diners",
    estimatedTotal: "Classic Duo Spread",
    subtitle: "A quick, proper dinner after work",
    dishes: [
      "Prawn Paste Chicken",
      "Kai Lan with Garlic",
      "Big Prawn Hor Fun"
    ],
    note: "A balanced combination for two, plus fragrant rice and floral Chinese tea.",
    suggestedItems: ["ks-20261015-010", "ks-20261015-039", "ks-20261015-050"]
  },
  {
    id: "four-to-five",
    title: "Four to Five",
    dinerCount: "4 – 5 Diners",
    estimatedTotal: "Family Heritage Spread",
    subtitle: "The classic Kok Sen house spread",
    isMostPopular: true,
    dishes: [
      "Prawn Roll",
      "Yong Tau Foo",
      "Salted Egg Prawns",
      "Kai Lan Roasted Pork",
      "Big Prawn Hor Fun"
    ],
    note: "Our most-ordered balanced combination for sharing with family and friends.",
    suggestedItems: [
      "ks-20261015-082",
      "ks-20261015-099",
      "ks-20261015-084",
      "ks-20261015-062",
      "ks-20261015-050"
    ]
  },
  {
    id: "eight-or-more",
    title: "Eight or More",
    dinerCount: "8+ Diners",
    estimatedTotal: "Round Table Banquet",
    subtitle: "Family celebration, office supper banquet",
    dishes: [
      "Golden Dragon Chicken",
      "Curry Fish Head",
      "Bittergourd Pork Ribs",
      "Homemade Tofu",
      "Big Prawn Hor Fun"
    ],
    note: "Give us a call ahead and we will hold a round revolving table for you.",
    suggestedItems: [
      "ks-20261015-035",
      "ks-20261015-026",
      "ks-20261015-061",
      "ks-20261015-095",
      "ks-20261015-050"
    ]
  }
];

export const REVIEWS: ReviewItem[] = [
  {
    id: '1',
    author: 'Regular Diner on Google',
    role: 'Local Patron (Over 10 years)',
    rating: 5,
    text: 'The Big Prawn Hor Fun is completely in a league of its own. The broth is simmered down to a fiery reddish prawn bisque with undeniable wok hei.',
    date: '2 weeks ago',
    source: 'Google'
  },
  {
    id: '2',
    author: 'Keong Saik Food Critic',
    role: 'Culinary Writer',
    rating: 5,
    text: "Claypot liver still spitting when served. Perfectly tender without being overcooked. There's a reason Michelin has kept them on Bib Gourmand for years.",
    date: '1 month ago',
    source: 'Local Regular'
  },
  {
    id: '3',
    author: 'Marcus Tan',
    role: 'Food Enthusiast',
    rating: 5,
    text: 'The Har Cheong Gai chicken wings are deeply fragrant with shrimp paste, blistered crisp on the outside while staying succulent inside. Don’t skip the Moonlight Hor Fun either!',
    date: '3 months ago',
    source: 'Google'
  }
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What are your operating hours at each outlet?',
    answer: '1) Keong Saik Outlet (Flagship): Tuesday – Sunday with Lunch 12:00pm – 2:15pm (Last order 2:00pm) and Dinner 5:00pm – 9:15pm (Last order 8:45pm). Closed on Mondays. \n2) City Square Mall Outlet: Open Daily · Monday–Sunday with Lunch 11:30am–2:30pm and Dinner 4:30pm–9:00pm.'
  },
  {
    id: 'faq-2',
    question: 'Do you take reservations?',
    answer: 'Yes! Connect directly to our mainline WhatsApp for reservations at either outlet: 1) Keong Saik outlet (+65 9727 2533) or 2) City Square Mall outlet (+65 9624 4244). Tell us your preferred date, time, and number of guests. Weekend evenings and round tables fill up quickly, so reserving in advance is advised. Walk-ins are always welcomed as well.'
  },
  {
    id: 'faq-3',
    question: 'Can I order takeaway?',
    answer: "Certainly. Message your order on WhatsApp or call ahead and we'll have it packed and ready. Gravy dishes such as hor fun travel best if you collect them soon after they're cooked."
  },
  {
    id: 'faq-4',
    question: 'How do I find you, and where can I park?',
    answer: "We welcome you at two locations: \n1) Keong Saik Flagship: 4 Keong Saik Road (4-min walk from Outram Park MRT Exit 4, 5-min walk from Maxwell MRT Exit 2). Street parking along Keong Saik and multi-storey parking at Kreta Ayer Complex.\n2) City Square Mall: 180 Kitchener Road, #02-K1/K2 (Direct sheltered connection from Farrer Park MRT Exit I). Ample sheltered basement carpark available in the mall."
  },
  {
    id: 'faq-5',
    question: 'Do you cater for large groups?',
    answer: "Round tables are what we do best — family dinners, birthdays and office suppers included. Call ahead with your numbers and budget per head, and we'll suggest a spread and hold the table."
  },
  {
    id: 'faq-6',
    question: 'Is there anything for vegetarians?',
    answer: 'Yes. Our greens, tofu dishes and fried rice can be prepared without meat or seafood — please let us know when you order so the kitchen can adjust the seasoning.'
  }
];

export const GALLERY_IMAGES: GalleryPhotoItem[] = [
  {
    id: 'michelin-entrance-photo',
    title: 'Michelin Bib Gourmand Entrance & Backlit Signage',
    category: 'space',
    url: koksenMichelinDoor,
    caption: 'Front entrance at 4 Keong Saik Road featuring backlit 3D calligraphy "國成 菜馆 KOK SEN" and consecutive Michelin Bib Gourmand seals spanning 2016 through 2026.',
    tag: '4 Keong Saik Rd',
    aspect: 'tall'
  },
  {
    id: 'collection-storefront-photo',
    title: 'Takeaway Collection Station & Keong Saik Shophouse Facade',
    category: 'space',
    url: koksenCollectionStorefront,
    caption: 'Daytime street level view of Kok Sen with the wooden calligraphy signage, vintage mosaic tiles, and dedicated takeaway collection station.',
    tag: 'Collection Window',
    aspect: 'standard'
  },
  {
    id: 'evening-queue-photo',
    title: 'Evening Bustle & Al Fresco Tables',
    category: 'space',
    url: koksenEveningQueue,
    caption: 'Diners gathering beneath the heritage awning on Keong Saik Road, enjoying dinner and queueing for dinner service under the evening glow.',
    tag: 'Night Atmosphere',
    aspect: 'standard'
  },
  {
    id: 'street-awning-view-photo',
    title: 'Keong Saik Streetscape & Heritage Sign',
    category: 'space',
    url: koksenStreetAwning,
    caption: 'Daytime street view along Keong Saik Road with Kok Sen’s vertical red "國成餐室" banner and outdoor sidewalk seating against the Pinnacle@Duxton backdrop.',
    tag: 'Keong Saik Road',
    aspect: 'standard'
  },
  {
    id: 'panoramic-hall-photo',
    title: 'Main Dining Hall & Round Banquet Tables',
    category: 'space',
    url: koksenPanoramicHall,
    caption: 'Air-conditioned dining room equipped with classic round tables, sage-green bentwood chairs, curved ceiling cove lighting, and families sharing plates.',
    tag: 'Main Dining Hall',
    aspect: 'wide'
  },
  {
    id: 'neon-dish-partition-photo',
    title: 'Illuminated Neon Cantonese Dish Partition',
    category: 'space',
    url: koksenNeonSigns,
    caption: 'Custom timber slat room divider illuminated with vibrant neon acrylic plaques highlighting house specialties like 肉碎豆腐 and 巧手三宝煲.',
    tag: 'Interior Craft',
    aspect: 'standard'
  },
  {
    id: 'art-wall-gallery-photo',
    title: 'Singapore Shophouse Art Gallery Wall',
    category: 'space',
    url: koksenArtWall,
    caption: 'Feature salon gallery wall with framed watercolor artworks of historic Singapore shophouse architecture and Peranakan motifs above heritage geometric tiles.',
    tag: 'Art Collection',
    aspect: 'standard'
  },
  {
    id: 'keong-saik-dusk-photo',
    title: 'Twilight on Keong Saik & Bukit Pasoh',
    category: 'space',
    url: koksenKeongSaikDusk,
    caption: 'The iconic curved art deco corner shophouse building at Keong Saik Road and Bukit Pasoh illuminated warmly at dusk.',
    tag: 'Heritage Quarter',
    aspect: 'standard'
  },
  {
    id: 'dining-booths-view-photo',
    title: 'Sage Green Banquettes & Cozy Booths',
    category: 'space',
    url: koksenDiningBooths,
    caption: 'Comfortable sage green booth seating nestled beside timber screens with warm hanging industrial pendant lamps.',
    tag: 'Booth Seating',
    aspect: 'standard'
  },
  {
    id: 'big-prawn-hor-fun-photo',
    title: 'Big Prawns Hor Fun (大虾滑蛋河粉)',
    category: 'dishes',
    url: '/oddle-three-exact-2026-10-19/big-prawns-hor-fun.png',
    caption: 'Kok Sen signature dish: wide flat rice noodles charred with intense wok hei, steeped in spicy-savory orange prawn gravy with split king prawns.',
    tag: 'Signature Hor Fun',
    aspect: 'standard'
  },
  {
    id: 'big-prawn-noodles-soup-photo',
    title: 'Big Prawns Bee Hoon Soup (大虾粗米粉汤)',
    category: 'dishes',
    url: CLIENT_MENU_PHOTOS.N1,
    caption: 'Thick white bee hoon swimming in an intense boiling prawn broth brewed for hours with crushed prawn shells and halved fresh king prawns.',
    tag: 'Signature Soup',
    aspect: 'standard'
  },
  {
    id: 'claypot-stuffed-tofu-photo',
    title: 'Claypot Yong Tau Foo (巧手三宝煲)',
    category: 'claypot',
    url: CLIENT_MENU_PHOTOS.T1,
    caption: 'Rustic earthenware claypot bubbling with homemade golden bean curd cubes, charred eggplant and large red chillies hand-stuffed with squid and prawn paste.',
    tag: 'Craft Claypot',
    aspect: 'standard'
  },
  {
    id: 'har-cheong-gai-photo',
    title: 'Prawn Paste Chicken (虾酱鸡)',
    category: 'dishes',
    url: koksenHarCheongGaiReal,
    caption: 'Marinated in fermented shrimp paste, fried golden-brown to crisp perfection, served with homemade garlic chili dip.',
    tag: 'Signature Poultry',
    aspect: 'standard'
  },
  {
    id: 'crispy-chicken-photo',
    title: 'Golden Dragon Chicken (脆皮金龙鸡)',
    category: 'dishes',
    url: CLIENT_MENU_PHOTOS.CH2,
    caption: 'Traditional Cantonese banquet craft: paper-thin roasted chicken skin bonded to bouncy minced squid and prawn paste, sliced into delicate rectangular bites.',
    tag: 'Heritage Banquet',
    aspect: 'standard'
  },
  {
    id: 'bittergourd-pork-ribs-photo',
    title: 'Bittergourd Pork Ribs with Black Bean Sauce (苦瓜豉汁闷排骨)',
    category: 'wok',
    url: CLIENT_MENU_PHOTOS.P1,
    caption: 'Braised pork ribs glistening in savory fermented black bean garlic glaze with stewed green bittergourd.',
    tag: 'Wok Specialty',
    aspect: 'standard'
  },
  {
    id: 'black-bean-horfun-photo',
    title: 'Black Bean Sauce with Fish Head / Sliced Fish (豉汁炒鱼头 / 鱼片)',
    category: 'dishes',
    url: CLIENT_MENU_PHOTOS.H6,
    caption: 'Charred wide flat rice noodles and tender fish drenched in rich fermented black bean gravy with red chili slices.',
    tag: 'Wok Hei Fish',
    aspect: 'standard'
  },
  {
    id: 'sambal-kang-kong-photo',
    title: 'Stir Fried Kangkong With Sambal (马来风光)',
    category: 'wok',
    url: CLIENT_MENU_PHOTOS.G6,
    caption: 'Fresh water spinach wok-tossed over blazing heat with pungent homemade dried shrimp belacan chili paste.',
    tag: 'Spicy Greens',
    aspect: 'standard'
  },
  {
    id: 'roast-pork-rice-photo',
    title: 'Roasted Pork Tofu Rice (烧肉豆腐饭)',
    category: 'dishes',
    url: CLIENT_MENU_PHOTOS.R12,
    caption: 'Crackling pork belly and silken bean curd cubes in savory egg gravy over warm steamed jasmine rice.',
    tag: 'Rice Favorite',
    aspect: 'standard'
  },
  {
    id: 'beef-horfun-photo',
    title: 'Black Bean/Dry Beef Hor Fun (豉汁/干炒牛肉河)',
    category: 'dishes',
    url: CLIENT_MENU_PHOTOS.H7,
    caption: 'Dry wok-seared charred flat rice noodles with tender marinated beef slices, yellow chives, crisp bean sprouts, and searing wok hei.',
    tag: 'Dry Hor Fun',
    aspect: 'standard'
  },
  {
    id: 'claypot-homemade-tofu-photo',
    title: 'Homemade Tofu with Minced Pork (家乡豆腐)',
    category: 'claypot',
    url: CLIENT_MENU_PHOTOS.T2,
    caption: 'Crisp golden beancurd exterior with melt-in-mouth interior simmered in a bubbling claypot with minced pork and savory sauce.',
    tag: 'Claypot Craft',
    aspect: 'standard'
  },
  {
    id: 'black-pepper-beef-photo',
    title: 'Black Pepper Beef (黑椒炒牛肉)',
    category: 'wok',
    url: CLIENT_MENU_PHOTOS.R6,
    caption: 'Tender beef slices wok-tossed over ferocious heat with cracked black pepper, onions and capsicums.',
    tag: 'Black Pepper Wok',
    aspect: 'standard'
  },
  {
    id: 'cereal-butter-prawns-photo',
    title: 'Cereal Butter Prawns (麦片鲜虾)',
    category: 'dishes',
    url: CLIENT_MENU_PHOTOS.SE5,
    caption: 'Plump fresh prawns encrusted in golden toasted nestum cereal, curry leaves, butter, and bird eye chillies.',
    tag: 'Crispy Seafood',
    aspect: 'standard'
  },
  {
    id: 'yam-ring-photo',
    title: 'Yam Ring (芋头圈)',
    category: 'dishes',
    url: 'https://ucarecdn.com/ae5e3756-b4d0-4285-b1ab-1fab276a383d/',
    caption: 'Fluffy, deep-fried mashed yam ring crowned with stir-fried prawns, cashew nuts, and fresh vegetables.',
    tag: 'Heritage Classic',
    aspect: 'standard'
  },
  {
    id: 'moonlight-horfun-photo',
    title: 'Moonlight Hor Fun (月光河粉)',
    category: 'dishes',
    url: CLIENT_MENU_PHOTOS.H5,
    caption: 'Silky dark-soy-glazed hor fun topped with raw golden egg yolk, Chinese sausages, squid, and fragrant pork lardons.',
    tag: 'Wok Hei Classic',
    aspect: 'standard'
  },
  {
    id: 'crispy-roast-pork-photo',
    title: 'Fried Crispy Roast Pork with Black Sauce (香爆烧肉)',
    category: 'wok',
    url: CLIENT_MENU_PHOTOS.P4,
    caption: 'Crackling roast pork belly tossed over roaring wok heat with caramelized dark sweet sauce and onions.',
    tag: 'Crispy Specialty',
    aspect: 'standard'
  },
  {
    id: 'salted-egg-prawn-photo',
    title: 'Salted Egg Prawn Ball (咸蛋黄虾球)',
    category: 'dishes',
    url: CLIENT_MENU_PHOTOS.SE3,
    caption: 'Juicy prawn balls coated in rich, grainy salted egg yolk cream with fragrant curry leaves and chili.',
    tag: 'Golden Crust',
    aspect: 'standard'
  },
  {
    id: 'claypot-brinjal-photo',
    title: 'Claypot Brinjal With Minced Pork (肉碎茄子煲)',
    category: 'claypot',
    url: CLIENT_MENU_PHOTOS.T7,
    caption: 'Silky braised eggplant simmered with savory minced pork and salted fish in a piping hot claypot.',
    tag: 'Sizzling Claypot',
    aspect: 'standard'
  },
  {
    id: 'diner-prawn-horfun-snap',
    title: 'Feast of Big Prawn Hor Fun & Har Cheong Gai',
    category: 'diner',
    url: '/oddle-three-exact-2026-10-19/big-prawns-hor-fun.png',
    caption: 'Visited Keong Saik flagship with family! The orange prawn gravy is out of this world, rich with wok hei and juicy giant prawns.',
    tag: 'Verified Diner Snap',
    aspect: 'standard',
    isClientPhoto: true,
    uploadedBy: 'Rachel Tan (Diner @ Keong Saik)',
    date: 'Yesterday',
    dishCode: 'H1',
    rating: 5
  },
  {
    id: 'diner-yongtaufoo-snap',
    title: 'Bubbling Claypot Yong Tau Foo at Dinner Service',
    category: 'diner',
    url: CLIENT_MENU_PHOTOS.T1,
    caption: 'The squid and prawn stuffing in the brinjals and chillies was exceptionally bouncy. The fermented bean sauce was heavenly with rice!',
    tag: 'Verified Diner Snap',
    aspect: 'standard',
    isClientPhoto: true,
    uploadedBy: 'Marcus Lim (Diner @ City Square Mall)',
    date: '3 days ago',
    dishCode: 'T1',
    rating: 5
  }
];

// Helper to determine if restaurant is currently open based on SGT time
export function getOpeningStatus(outletId?: 'keong-saik' | 'city-square-mall') {
  const now = new Date();
  // Singapore is UTC+8
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const sgtNow = new Date(utc + (3600000 * 8));
  
  const day = sgtNow.getDay(); // 0 is Sun, 1 is Mon, 2-6 is Tue-Sat
  const hours = sgtNow.getHours();
  const minutes = sgtNow.getMinutes();
  const currentTimeVal = hours + minutes / 60;

  // Specific Outlet: City Square Mall
  // Open daily: Monday–Sunday
  // Lunch: 11:30am–2:30pm (11.5 to 14.5)
  // Afternoon break: 2:30pm–4:30pm (14.5 to 16.5)
  // Dinner: 4:30pm–9:00pm (16.5 to 21.0)
  if (outletId === 'city-square-mall') {
    if (currentTimeVal >= 11.5 && currentTimeVal <= 14.5) {
      return { isOpen: true, message: 'City Square Mall Open · Lunch Service until 2:30pm', outletId: 'city-square-mall' };
    }
    if (currentTimeVal >= 16.5 && currentTimeVal <= 21.0) {
      return { isOpen: true, message: 'City Square Mall Open · Dinner Service until 9:00pm', outletId: 'city-square-mall' };
    }
    if (currentTimeVal < 11.5) {
      return { isOpen: false, message: 'City Square Mall Opens Today at 11:30am for Lunch', outletId: 'city-square-mall' };
    }
    if (currentTimeVal > 14.5 && currentTimeVal < 16.5) {
      return { isOpen: false, message: 'Afternoon Kitchen Break · Dinner Service Begins at 4:30pm', outletId: 'city-square-mall' };
    }
    return { isOpen: false, message: 'Closed for the night · Reopens Tomorrow at 11:30am', outletId: 'city-square-mall' };
  }

  // Specific Outlet: Keong Saik Flagship
  // Closed on Mondays
  // Tue–Sun: Lunch: 12:00pm–2:15pm (12.0 to 14.25) | Dinner: 5:00pm–9:15pm (17.0 to 21.25)
  if (outletId === 'keong-saik') {
    if (day === 1) {
      return { isOpen: false, message: 'Keong Saik Closed on Mondays · Reopens Tuesday 12:00pm', outletId: 'keong-saik' };
    }
    if (currentTimeVal >= 12.0 && currentTimeVal <= 14.25) {
      return { isOpen: true, message: 'Keong Saik Open · Lunch Service until 2:15pm', outletId: 'keong-saik' };
    }
    if (currentTimeVal >= 17.0 && currentTimeVal <= 21.25) {
      return { isOpen: true, message: 'Keong Saik Open · Dinner Service until 9:15pm', outletId: 'keong-saik' };
    }
    if (currentTimeVal < 12.0) {
      return { isOpen: false, message: 'Keong Saik Opens Today at 12:00pm for Lunch', outletId: 'keong-saik' };
    }
    if (currentTimeVal > 14.25 && currentTimeVal < 17.0) {
      return { isOpen: false, message: 'Kitchen Break · Dinner service begins at 5:00pm', outletId: 'keong-saik' };
    }
    return { isOpen: false, message: 'Closed for the night · Reopens 12:00pm', outletId: 'keong-saik' };
  }

  // General Status (Both Outlets):
  const isCsmOpen = (currentTimeVal >= 11.5 && currentTimeVal <= 14.5) || (currentTimeVal >= 16.5 && currentTimeVal <= 21.0);
  const isKsOpen = day !== 1 && ((currentTimeVal >= 12.0 && currentTimeVal <= 14.25) || (currentTimeVal >= 17.0 && currentTimeVal <= 21.25));

  if (isCsmOpen && isKsOpen) {
    return { isOpen: true, message: 'Kitchens Open · Serving at Keong Saik & City Square Mall' };
  }
  if (isCsmOpen && !isKsOpen) {
    return { isOpen: true, message: 'City Square Mall Open Now · Keong Saik Closed' };
  }
  if (!isCsmOpen && isKsOpen) {
    return { isOpen: true, message: 'Keong Saik Open Now · City Square Mall Closed' };
  }

  // Both closed:
  if (currentTimeVal < 11.5) {
    return { isOpen: false, message: 'Kitchens Closed · Opens 11:30am (City Square Mall) / 12:00pm (Keong Saik)' };
  }
  if (currentTimeVal > 14.5 && currentTimeVal < 16.5) {
    return { isOpen: false, message: 'Afternoon Kitchen Break · Dinner from 4:30pm (City Sq) / 5:00pm (Keong Saik)' };
  }
  return { isOpen: false, message: 'Closed for the night · Reopens Tomorrow at 11:30am' };
}
