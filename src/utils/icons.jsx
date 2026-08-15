// Central icon set for the app — Font Awesome Free (solid), wrapped so every
// call site keeps working exactly as it did with lucide-react (same names,
// same `className="w-4 h-4"` sizing convention). To swap the icon library
// again later, this is the only file that needs to change.
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleExclamation,
  faTriangleExclamation,
  faArrowLeft,
  faArrowRight,
  faRightLeft,
  faAward,
  faMoneyBill1,
  faBeerMugEmpty,
  faBookOpen,
  faCalculator,
  faCalendarDays,
  faCamera,
  faCar,
  faCheck,
  faCircleCheck,
  faSquareCheck,
  faChevronDown,
  faChevronUp,
  faClock,
  faMugSaucer,
  faCoins,
  faCompass,
  faCopy,
  faCreditCard,
  faCrown,
  faDatabase,
  faDollarSign,
  faDownload,
  faPenToSquare,
  faArrowUpRightFromSquare,
  faEye,
  faFileCode,
  faFileCsv,
  faFileLines,
  faFilter,
  faFire,
  faCircleQuestion,
  faHotel,
  faCircleInfo,
  faKey,
  faLandmark,
  faLock,
  faRightFromBracket,
  faEnvelope,
  faLocationDot,
  faBars,
  faMinus,
  faMoon,
  faMusic,
  faLocationArrow,
  faPhone,
  faChartPie,
  faPizzaSlice,
  faPlane,
  faPlus,
  faSquarePlus,
  faPrint,
  faRotateLeft,
  faFloppyDisk,
  faMagnifyingGlass,
  faArrowUpFromBracket,
  faShield,
  faShieldHalved,
  faShoppingBag,
  faMobileScreen,
  faWandMagicSparkles,
  faStar,
  faSun,
  faTag,
  faTicket,
  faTrain,
  faTrash,
  faTrophy,
  faFont,
  faUpload,
  faUserCheck,
  faUserPlus,
  faUsers,
  faWifi,
  faWineGlass,
  faXmark,
  faBolt,
  faLightbulb,
  faCircleXmark,
  faTableTennisPaddleBall,
  faUtensils,
  faAnchor,
  faBaseball,
  faAppleWhole,
  faGift,
  faFilm,
  faPalette,
  faCity,
  faTrainSubway,
  faBowlFood,
  faBowlRice,
  faSuitcase
} from '@fortawesome/free-solid-svg-icons';

function makeIcon(icon, displayName) {
  const Icon = React.forwardRef(function IconComponent({ className, ...rest }, ref) {
    return <FontAwesomeIcon icon={icon} className={className} ref={ref} {...rest} />;
  });
  Icon.displayName = displayName;
  return Icon;
}

export const AlertCircle = makeIcon(faCircleExclamation, 'AlertCircle');
export const AlertTriangle = makeIcon(faTriangleExclamation, 'AlertTriangle');
export const ArrowLeft = makeIcon(faArrowLeft, 'ArrowLeft');
export const ArrowRight = makeIcon(faArrowRight, 'ArrowRight');
export const ArrowRightLeft = makeIcon(faRightLeft, 'ArrowRightLeft');
export const Award = makeIcon(faAward, 'Award');
export const Banknote = makeIcon(faMoneyBill1, 'Banknote');
export const Beer = makeIcon(faBeerMugEmpty, 'Beer');
export const BookOpen = makeIcon(faBookOpen, 'BookOpen');
export const Calculator = makeIcon(faCalculator, 'Calculator');
export const Calendar = makeIcon(faCalendarDays, 'Calendar');
export const Camera = makeIcon(faCamera, 'Camera');
export const Car = makeIcon(faCar, 'Car');
export const Check = makeIcon(faCheck, 'Check');
export const CheckCircle2 = makeIcon(faCircleCheck, 'CheckCircle2');
export const CheckSquare = makeIcon(faSquareCheck, 'CheckSquare');
export const ChevronDown = makeIcon(faChevronDown, 'ChevronDown');
export const ChevronUp = makeIcon(faChevronUp, 'ChevronUp');
export const Clock = makeIcon(faClock, 'Clock');
export const Coffee = makeIcon(faMugSaucer, 'Coffee');
export const Coins = makeIcon(faCoins, 'Coins');
export const Compass = makeIcon(faCompass, 'Compass');
export const Copy = makeIcon(faCopy, 'Copy');
export const CreditCard = makeIcon(faCreditCard, 'CreditCard');
export const Crown = makeIcon(faCrown, 'Crown');
export const Database = makeIcon(faDatabase, 'Database');
export const DollarSign = makeIcon(faDollarSign, 'DollarSign');
export const Download = makeIcon(faDownload, 'Download');
export const Edit3 = makeIcon(faPenToSquare, 'Edit3');
export const ExternalLink = makeIcon(faArrowUpRightFromSquare, 'ExternalLink');
export const Eye = makeIcon(faEye, 'Eye');
export const FileJson = makeIcon(faFileCode, 'FileJson');
export const FileSpreadsheet = makeIcon(faFileCsv, 'FileSpreadsheet');
export const FileText = makeIcon(faFileLines, 'FileText');
export const Filter = makeIcon(faFilter, 'Filter');
export const Flame = makeIcon(faFire, 'Flame');
export const HelpCircle = makeIcon(faCircleQuestion, 'HelpCircle');
export const Hotel = makeIcon(faHotel, 'Hotel');
export const Info = makeIcon(faCircleInfo, 'Info');
export const Key = makeIcon(faKey, 'Key');
export const Landmark = makeIcon(faLandmark, 'Landmark');
export const Lock = makeIcon(faLock, 'Lock');
export const LogOut = makeIcon(faRightFromBracket, 'LogOut');
export const Mail = makeIcon(faEnvelope, 'Mail');
export const MapPin = makeIcon(faLocationDot, 'MapPin');
export const Menu = makeIcon(faBars, 'Menu');
export const Minus = makeIcon(faMinus, 'Minus');
export const Moon = makeIcon(faMoon, 'Moon');
export const Music = makeIcon(faMusic, 'Music');
export const Navigation = makeIcon(faLocationArrow, 'Navigation');
export const Phone = makeIcon(faPhone, 'Phone');
export const PieChart = makeIcon(faChartPie, 'PieChart');
export const Pizza = makeIcon(faPizzaSlice, 'Pizza');
export const Plane = makeIcon(faPlane, 'Plane');
export const Plus = makeIcon(faPlus, 'Plus');
export const PlusSquare = makeIcon(faSquarePlus, 'PlusSquare');
export const Printer = makeIcon(faPrint, 'Printer');
export const RotateCcw = makeIcon(faRotateLeft, 'RotateCcw');
export const Save = makeIcon(faFloppyDisk, 'Save');
export const Search = makeIcon(faMagnifyingGlass, 'Search');
export const Share = makeIcon(faArrowUpFromBracket, 'Share');
export const Shield = makeIcon(faShield, 'Shield');
export const ShieldAlert = makeIcon(faShieldHalved, 'ShieldAlert');
export const ShieldCheck = makeIcon(faShieldHalved, 'ShieldCheck');
export const ShoppingBag = makeIcon(faShoppingBag, 'ShoppingBag');
export const Smartphone = makeIcon(faMobileScreen, 'Smartphone');
export const Sparkles = makeIcon(faWandMagicSparkles, 'Sparkles');
export const Star = makeIcon(faStar, 'Star');
export const Sun = makeIcon(faSun, 'Sun');
export const Tag = makeIcon(faTag, 'Tag');
export const Ticket = makeIcon(faTicket, 'Ticket');
export const Train = makeIcon(faTrain, 'Train');
export const Trash2 = makeIcon(faTrash, 'Trash2');
export const Trophy = makeIcon(faTrophy, 'Trophy');
export const Type = makeIcon(faFont, 'Type');
export const Upload = makeIcon(faUpload, 'Upload');
export const UserCheck = makeIcon(faUserCheck, 'UserCheck');
export const UserPlus = makeIcon(faUserPlus, 'UserPlus');
export const Users = makeIcon(faUsers, 'Users');
export const WifiOff = makeIcon(faWifi, 'WifiOff');
export const Wine = makeIcon(faWineGlass, 'Wine');
export const X = makeIcon(faXmark, 'X');
export const Zap = makeIcon(faBolt, 'Zap');
export const Lightbulb = makeIcon(faLightbulb, 'Lightbulb');
export const CircleXmark = makeIcon(faCircleXmark, 'CircleXmark');
export const TennisBall = makeIcon(faTableTennisPaddleBall, 'TennisBall');
export const Utensils = makeIcon(faUtensils, 'Utensils');
export const Anchor = makeIcon(faAnchor, 'Anchor');
export const Baseball = makeIcon(faBaseball, 'Baseball');
export const Apple = makeIcon(faAppleWhole, 'Apple');
export const Gift = makeIcon(faGift, 'Gift');
export const Film = makeIcon(faFilm, 'Film');
export const Palette = makeIcon(faPalette, 'Palette');
export const City = makeIcon(faCity, 'City');
export const Subway = makeIcon(faTrainSubway, 'Subway');
export const BowlFood = makeIcon(faBowlFood, 'BowlFood');
export const BowlRice = makeIcon(faBowlRice, 'BowlRice');
export const Suitcase = makeIcon(faSuitcase, 'Suitcase');

// Maps the emoji glyphs already stored in initialData.js's extraCards.icon
// field to a Font Awesome component, so content data doesn't need a rewrite
// to stop rendering raw emoji as UI icons. Unmapped glyphs fall back to Sparkles.
const EMOJI_ICON_MAP = {
  '⚓': Anchor,
  '⚾': Baseball,
  '🍎': Apple,
  '🎁': Gift,
  '🎟️': Ticket,
  '🎥': Film,
  '🎨': Palette,
  '🎾': TennisBall,
  '🏙️': City,
  '👀': Eye,
  '📚': BookOpen,
  '🗽': Landmark,
  '🚇': Subway,
  '🚗': Car,
  '🛍️': ShoppingBag,
  '🥞': BowlFood,
  '🥟': BowlRice
};

export function iconForEmoji(emoji, fallback = Sparkles) {
  return EMOJI_ICON_MAP[emoji] || fallback;
}
