import { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Car, 
  Shield, 
  CreditCard, 
  Globe, 
  Phone, 
  ChevronDown,
  Edit,
  Briefcase,
  Search,
  UserPlus,
  CheckCircle,
  FileText,
  RefreshCw,
  Clock,
  HelpCircle,
  Trash2,
  StickyNote,
  Calendar,
  Save,
  X,
  Play
} from "lucide-react";

// Comprehensive company logo mapping for delivery, logistics, and gig economy companies
const getCompanyLogo = (companyName: string) => {
  const name = companyName.toLowerCase().trim();
  
  // Food delivery services
  if (name.includes('doordash')) {
    return { type: 'image', src: 'https://cdn.freelogovectors.net/wp-content/uploads/2023/09/doordash-logo-freelogovectors.net_.png', alt: 'DoorDash' };
  }
  if (name.includes('uber eats') || name.includes('ubereats')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Uber-Eats-Logo.png', alt: 'Uber Eats' };
  }
  if (name.includes('grubhub')) {
    return { type: 'image', src: 'https://1000logos.net/wp-content/uploads/2020/02/Grubhub-Logo.png', alt: 'Grubhub' };
  }
  if (name.includes('postmates')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Postmates-Logo.png', alt: 'Postmates' };
  }
  if (name.includes('deliveroo')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/05/Deliveroo-Logo.png', alt: 'Deliveroo' };
  }
  if (name.includes('just eat') || name.includes('takeaway')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/05/Just-Eat-Logo.png', alt: 'Just Eat' };
  }
  if (name.includes('seamless')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Seamless-Logo.png', alt: 'Seamless' };
  }
  if (name.includes('caviar')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/05/Caviar-Logo.png', alt: 'Caviar' };
  }
  
  // Grocery delivery
  if (name.includes('instacart')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Instacart-Logo.png', alt: 'Instacart' };
  }
  if (name.includes('shipt')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/05/Shipt-Logo.png', alt: 'Shipt' };
  }
  if (name.includes('peapod')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Peapod-Logo.png', alt: 'Peapod' };
  }
  if (name.includes('freshdirect')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/FreshDirect-Logo.png', alt: 'FreshDirect' };
  }
  if (name.includes('thrive market')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Thrive-Market-Logo.png', alt: 'Thrive Market' };
  }
  
  // Major logistics and package delivery
  if (name.includes('fedex')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/03/FedEx-Logo.png', alt: 'FedEx' };
  }
  if (name.includes('ups')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/05/UPS-Logo.png', alt: 'UPS' };
  }
  if (name.includes('amazon') && (name.includes('logistics') || name.includes('flex') || name.includes('delivery'))) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png', alt: 'Amazon Logistics' };
  }
  if (name.includes('dhl')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/05/DHL-Logo.png', alt: 'DHL' };
  }
  if (name.includes('usps') || name.includes('postal service')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/05/USPS-Logo.png', alt: 'USPS' };
  }
  if (name.includes('ontrac')) {
    return { type: 'image', src: 'https://www.ontrac.com/images/ontrac-logo.png', alt: 'OnTrac' };
  }
  if (name.includes('lasership')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2021/03/LaserShip-Logo.png', alt: 'LaserShip' };
  }
  
  // Rideshare and gig platforms
  if (name.includes('uber') && !name.includes('eats')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/05/Uber-Logo.png', alt: 'Uber' };
  }
  if (name.includes('lyft')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/05/Lyft-Logo.png', alt: 'Lyft' };
  }
  if (name.includes('taskrabbit')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/05/TaskRabbit-Logo.png', alt: 'TaskRabbit' };
  }
  if (name.includes('handy')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Handy-Logo.png', alt: 'Handy' };
  }
  
  // Grocery and retail chains
  if (name.includes('walmart') && (name.includes('spark') || name.includes('delivery'))) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/05/Walmart-Logo.png', alt: 'Walmart Spark' };
  }
  if (name.includes('target') && name.includes('shipt')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/05/Target-Logo.png', alt: 'Target Shipt' };
  }
  if (name.includes('costco')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/05/Costco-Logo.png', alt: 'Costco' };
  }
  if (name.includes('kroger')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Kroger-Logo.png', alt: 'Kroger' };
  }
  if (name.includes('safeway')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Safeway-Logo.png', alt: 'Safeway' };
  }
  
  // On-demand and convenience delivery
  if (name.includes('roadie')) {
    return { type: 'image', src: 'https://www.roadie.com/wp-content/uploads/2020/03/roadie-logo-horizontal.png', alt: 'Roadie' };
  }
  if (name.includes('gopuff')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2021/04/Gopuff-Logo.png', alt: 'Gopuff' };
  }
  if (name.includes('favor')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Favor-Logo.png', alt: 'Favor' };
  }
  if (name.includes('minibar')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Minibar-Delivery-Logo.png', alt: 'Minibar Delivery' };
  }
  if (name.includes('drizly')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Drizly-Logo.png', alt: 'Drizly' };
  }
  
  // Pharmacy and medical delivery
  if (name.includes('cvs')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/CVS-Pharmacy-Logo.png', alt: 'CVS Pharmacy' };
  }
  if (name.includes('walgreens')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Walgreens-Logo.png', alt: 'Walgreens' };
  }
  if (name.includes('rite aid')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Rite-Aid-Logo.png', alt: 'Rite Aid' };
  }
  if (name.includes('capsule')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2021/03/Capsule-Logo.png', alt: 'Capsule' };
  }
  if (name.includes('pillpack')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/PillPack-Logo.png', alt: 'PillPack' };
  }
  
  // Meal kit and specialty food
  if (name.includes('blue apron')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Blue-Apron-Logo.png', alt: 'Blue Apron' };
  }
  if (name.includes('hellofresh')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/HelloFresh-Logo.png', alt: 'HelloFresh' };
  }
  if (name.includes('home chef')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Home-Chef-Logo.png', alt: 'Home Chef' };
  }
  if (name.includes('sunbasket')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Sunbasket-Logo.png', alt: 'Sunbasket' };
  }
  
  // Freight and commercial delivery
  if (name.includes('penske')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Penske-Logo.png', alt: 'Penske' };
  }
  if (name.includes('ryder')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Ryder-Logo.png', alt: 'Ryder' };
  }
  if (name.includes('jb hunt')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/J.B.-Hunt-Logo.png', alt: 'J.B. Hunt' };
  }
  if (name.includes('schneider')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Schneider-Logo.png', alt: 'Schneider' };
  }
  if (name.includes('swift transportation')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Swift-Transportation-Logo.png', alt: 'Swift Transportation' };
  }
  
  // Regional and local delivery services
  if (name.includes('deliv')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Deliv-Logo.png', alt: 'Deliv' };
  }
  if (name.includes('dispatch')) {
    return { type: 'image', src: 'https://www.dispatchit.com/wp-content/uploads/2020/04/dispatch-logo.png', alt: 'Dispatch' };
  }
  if (name.includes('point pickup')) {
    return { type: 'image', src: 'https://pointpickup.com/wp-content/uploads/2020/03/PointPickup-Logo.png', alt: 'Point Pickup' };
  }
  if (name.includes('burrow')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Burrow-Logo.png', alt: 'Burrow' };
  }
  
  // Specialty and niche delivery
  if (name.includes('postmates x')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Postmates-X-Logo.png', alt: 'Postmates X' };
  }
  if (name.includes('dolly')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Dolly-Logo.png', alt: 'Dolly' };
  }
  if (name.includes('lugg')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Lugg-Logo.png', alt: 'Lugg' };
  }
  if (name.includes('bellhops')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Bellhops-Logo.png', alt: 'Bellhops' };
  }
  
  // International delivery services
  if (name.includes('glovo')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Glovo-Logo.png', alt: 'Glovo' };
  }
  if (name.includes('foodpanda')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Foodpanda-Logo.png', alt: 'Foodpanda' };
  }
  if (name.includes('zomato')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Zomato-Logo.png', alt: 'Zomato' };
  }
  if (name.includes('swiggy')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Swiggy-Logo.png', alt: 'Swiggy' };
  }
  
  // Medical courier and specialty medical
  if (name.includes('medspeed') || name.includes('med speed')) {
    return { type: 'image', src: 'https://medspeed.com/wp-content/themes/medspeed/assets/img/logo.png', alt: 'MedSpeed' };
  }
  if (name.includes('stat medical')) {
    return { type: 'image', src: 'https://www.statmedical.com/images/stat-logo.png', alt: 'STAT Medical' };
  }
  if (name.includes('american medical') && name.includes('response')) {
    return { type: 'image', src: 'https://amr.net/wp-content/uploads/2020/06/amr-logo.png', alt: 'American Medical Response' };
  }
  if (name.includes('quest diagnostics')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Quest-Diagnostics-Logo.png', alt: 'Quest Diagnostics' };
  }
  if (name.includes('labcorp')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/LabCorp-Logo.png', alt: 'LabCorp' };
  }
  
  // Cannabis and specialty delivery
  if (name.includes('eaze')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2021/04/Eaze-Logo.png', alt: 'Eaze' };
  }
  if (name.includes('leafly')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2021/04/Leafly-Logo.png', alt: 'Leafly' };
  }
  if (name.includes('weedmaps')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2021/04/Weedmaps-Logo.png', alt: 'Weedmaps' };
  }
  
  // Auto parts and industrial delivery
  if (name.includes('napa') && name.includes('auto')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/NAPA-Auto-Parts-Logo.png', alt: 'NAPA Auto Parts' };
  }
  if (name.includes('autozone')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/AutoZone-Logo.png', alt: 'AutoZone' };
  }
  if (name.includes('advance auto')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Advance-Auto-Parts-Logo.png', alt: 'Advance Auto Parts' };
  }
  if (name.includes('oreilly') || name.includes("o'reilly")) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/OReilly-Auto-Parts-Logo.png', alt: "O'Reilly Auto Parts" };
  }
  
  // Pet and animal services
  if (name.includes('petco')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Petco-Logo.png', alt: 'Petco' };
  }
  if (name.includes('petsmart')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/PetSmart-Logo.png', alt: 'PetSmart' };
  }
  if (name.includes('chewy')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Chewy-Logo.png', alt: 'Chewy' };
  }
  if (name.includes('wag')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Wag-Logo.png', alt: 'Wag' };
  }
  if (name.includes('rover')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Rover-Logo.png', alt: 'Rover' };
  }
  
  // Electronics and tech delivery
  if (name.includes('best buy')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Best-Buy-Logo.png', alt: 'Best Buy' };
  }
  if (name.includes('geek squad')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Geek-Squad-Logo.png', alt: 'Geek Squad' };
  }
  if (name.includes('apple')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png', alt: 'Apple' };
  }
  if (name.includes('microsoft')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/04/Microsoft-Logo.png', alt: 'Microsoft' };
  }
  
  // Home improvement and furniture
  if (name.includes('home depot')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Home-Depot-Logo.png', alt: 'Home Depot' };
  }
  if (name.includes('lowes') || name.includes("lowe's")) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Lowes-Logo.png', alt: "Lowe's" };
  }
  if (name.includes('wayfair')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Wayfair-Logo.png', alt: 'Wayfair' };
  }
  if (name.includes('ikea')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/IKEA-Logo.png', alt: 'IKEA' };
  }
  if (name.includes('overstock')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Overstock-Logo.png', alt: 'Overstock' };
  }
  
  // Wholesale and business delivery  
  if (name.includes('sysco')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Sysco-Logo.png', alt: 'Sysco' };
  }
  if (name.includes('us foods')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/US-Foods-Logo.png', alt: 'US Foods' };
  }
  if (name.includes('performance food')) {
    return { type: 'image', src: 'https://www.pepsico.com/images/default-source/brands-logo/pepsi-logo.png', alt: 'Performance Food Group' };
  }
  if (name.includes('gordon food')) {
    return { type: 'image', src: 'https://www.gfs.com/images/gfs-logo.png', alt: 'Gordon Food Service' };
  }
  
  // Beverage and alcohol delivery
  if (name.includes('pepsi')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/05/Pepsi-Logo.png', alt: 'Pepsi' };
  }
  if (name.includes('coca cola') || name.includes('coke')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/05/Coca-Cola-Logo.png', alt: 'Coca-Cola' };
  }
  if (name.includes('anheuser') || name.includes('budweiser')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Budweiser-Logo.png', alt: 'Anheuser-Busch' };
  }
  if (name.includes('miller') && name.includes('coors')) {
    return { type: 'image', src: 'https://www.molsoncoors.com/sites/molsoncoors/files/2020-08/MC_Logo_Horizontal_RGB_Blue.png', alt: 'Molson Coors' };
  }
  
  // Banking and financial services
  if (name.includes('bank of america')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Bank-of-America-Logo.png', alt: 'Bank of America' };
  }
  if (name.includes('wells fargo')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Wells-Fargo-Logo.png', alt: 'Wells Fargo' };
  }
  if (name.includes('chase')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Chase-Logo.png', alt: 'Chase' };
  }
  if (name.includes('citibank') || name.includes('citi')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Citibank-Logo.png', alt: 'Citibank' };
  }
  
  // Clothing and fashion delivery
  if (name.includes('macys') || name.includes("macy's")) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Macys-Logo.png', alt: "Macy's" };
  }
  if (name.includes('nordstrom')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Nordstrom-Logo.png', alt: 'Nordstrom' };
  }
  if (name.includes('zappos')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Zappos-Logo.png', alt: 'Zappos' };
  }
  if (name.includes('stitch fix')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/Stitch-Fix-Logo.png', alt: 'Stitch Fix' };
  }
  
  // Office supplies and business services
  if (name.includes('staples')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Staples-Logo.png', alt: 'Staples' };
  }
  if (name.includes('office depot')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/09/Office-Depot-Logo.png', alt: 'Office Depot' };
  }
  if (name.includes('fedex office')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/03/FedEx-Office-Logo.png', alt: 'FedEx Office' };
  }
  if (name.includes('ups store')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/05/UPS-Store-Logo.png', alt: 'The UPS Store' };
  }
  
  // Flower and gift delivery
  if (name.includes('1800flowers') || name.includes('1-800-flowers')) {
    return { type: 'image', src: 'https://logos-world.net/wp-content/uploads/2020/11/1-800-Flowers-Logo.png', alt: '1-800-Flowers' };
  }
  if (name.includes('teleflora')) {
    return { type: 'image', src: 'https://www.teleflora.com/images/teleflora-logo.png', alt: 'Teleflora' };
  }
  if (name.includes('ftd')) {
    return { type: 'image', src: 'https://www.ftd.com/images/ftd-logo.png', alt: 'FTD' };
  }
  
  // Default fallback icon
  return {
    type: 'icon',
    icon: Building2,
    alt: companyName
  };
};
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ReminderIndicator from "@/components/reminder-indicator";
import NotesIndicator from "@/components/notes-indicator";
import { RESPONSIVE_GRIDS, RESPONSIVE_FLEX, TOUCH_FRIENDLY, OVERFLOW } from "@/lib/responsive-utils";



// New action dropdown specifically for Driver Opportunities
interface ActionDropdownProps {
  currentSelection: string | null;
  onAction: (action: string) => void;
  isWaitingList?: boolean;
  onWaitingListToggle?: () => void;
}

function ActionDropdown({ currentSelection, onAction, isWaitingList = false, onWaitingListToggle }: ActionDropdownProps) {
  const getButtonContent = () => {
    if (currentSelection === 'research') {
      return (
        <>
          <RefreshCw className="w-3 h-3 mr-2 text-amber-600" />
          <span className="text-amber-700">Researching</span>
        </>
      );
    } else if (currentSelection === 'apply') {
      return (
        <>
          <UserPlus className="w-3 h-3 mr-2 text-blue-600" />
          <span className="text-blue-700">Applied</span>
        </>
      );
    } else if (currentSelection === 'waitinglist') {
      return (
        <>
          <Clock className="w-3 h-3 mr-2 text-orange-600" />
          <span className="text-orange-700">Waiting List</span>
        </>
      );
    } else if (currentSelection === 'active') {
      return (
        <>
          <CheckCircle className="w-3 h-3 mr-2 text-white" />
          <span className="text-white">Active</span>
        </>
      );
    } else if (currentSelection === 'other') {
      return (
        <>
          <HelpCircle className="w-3 h-3 mr-2 text-purple-600" />
          <span className="text-purple-700">Other</span>
        </>
      );
    }
    return <span className="text-blue-700">Choose Action</span>;
  };

  const getButtonClasses = () => {
    if (currentSelection === 'research') {
      return "bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-amber-300 text-amber-700 shadow-sm";
    } else if (currentSelection === 'apply') {
      return "bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-300 text-blue-700 shadow-sm";
    } else if (currentSelection === 'waitinglist') {
      return "bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border-orange-300 text-orange-700 shadow-sm";
    } else if (currentSelection === 'active') {
      return "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-green-700 text-white shadow-md";
    } else if (currentSelection === 'other') {
      return "bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-300 text-purple-700 shadow-sm";
    }
    return "bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-blue-700 shadow-sm";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`${getButtonClasses()} transition-all duration-200 text-xs px-2.5 py-1 h-7 border rounded-lg font-medium w-full justify-between`}
        >
          <div className="flex items-center">
            {getButtonContent()}
          </div>
          <ChevronDown className="ml-1 w-2.5 h-2.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 z-50">
        <DropdownMenuItem
          onClick={() => onAction('')}
          className="flex items-center space-x-2 py-1.5 cursor-pointer border-b border-gray-100"
        >
          <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-400" />
          <div className="flex flex-col">
            <span className="font-medium text-sm text-gray-600">Choose Action</span>
            <span className="text-xs text-gray-500">Reset to neutral state</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onAction('research')}
          className="flex items-center space-x-2 py-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
          <div className="flex flex-col">
            <span className="font-medium text-sm">Researching</span>
            <span className="text-xs text-gray-500">Researching this company</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onAction('apply')}
          className="flex items-center space-x-2 py-1.5 cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5 text-blue-600" />
          <div className="flex flex-col">
            <span className="font-medium text-sm">Applied</span>
            <span className="text-xs text-gray-500">Already applied to this company</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onAction('waitinglist')}
          className="flex items-center space-x-2 py-1.5 cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5 text-orange-600" />
          <div className="flex flex-col">
            <span className="font-medium text-sm">Waiting List</span>
            <span className="text-xs text-gray-500">On waiting list for this company</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onAction('active')}
          className="flex items-center space-x-2 py-2 cursor-pointer"
        >
          <CheckCircle className="w-4 h-4 text-green-700" />
          <div className="flex flex-col">
            <span className="font-medium">Active</span>
            <span className="text-xs text-gray-500">Currently working with this company</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onAction('other')}
          className="flex items-center space-x-2 py-1.5 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
          <div className="flex flex-col">
            <span className="font-medium text-sm">Other</span>
            <span className="text-xs text-gray-500">Other status or note</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Company Notes Component
interface CompanyNotesProps {
  companyId: number;
  companyName: string;
}

function CompanyNotes({ companyId, companyName }: CompanyNotesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [contactName, setContactName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [contactDate, setContactDate] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [reminderText, setReminderText] = useState("");
  const [reminderId, setReminderId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing notes when dialog opens with optimized loading
  const loadNotes = async () => {
    if (!isOpen) return;
    
    setIsLoading(true);
    try {
      // Add a small delay to show loading state briefly
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await fetch(`/api/job-search-notes/${companyId}`);
      if (response.ok) {
        const existingNotes = await response.json();
        if (existingNotes && existingNotes.length > 0) {
          const latestNote = existingNotes[0]; // Get the most recent note
          setNotes(latestNote.notes || latestNote.conversationSummary || "");
          setContactName(latestNote.contactName || "");
          setPhoneNumber(latestNote.phoneNumber || "");
          setEmailAddress(latestNote.emailAddress || "");
          
          // Format dates for input fields
          if (latestNote.dateApplied) {
            setContactDate(new Date(latestNote.dateApplied).toISOString().split('T')[0]);
          }
          if (latestNote.contactDate) {
            setContactDate(new Date(latestNote.contactDate).toISOString().split('T')[0]);
          }
          if (latestNote.interviewDate) {
            setInterviewDate(new Date(latestNote.interviewDate).toISOString().split('T')[0]);
          }
          if (latestNote.followUpDate) {
            setFollowUpDate(new Date(latestNote.followUpDate).toISOString().split('T')[0]);
          }
          if (latestNote.reminderDate) {
            const reminderDateTime = new Date(latestNote.reminderDate);
            setReminderDate(reminderDateTime.toISOString().split('T')[0]);
            
            // Handle time formatting more safely
            if (latestNote.reminderTime) {
              setReminderTime(latestNote.reminderTime);
            } else {
              // Extract time from datetime if available
              const timeString = reminderDateTime.toTimeString().slice(0, 5);
              setReminderTime(timeString !== '00:00' ? timeString : '');
            }
          }
          setReminderText(latestNote.reminderText || "");
          setReminderId(latestNote.id || null);
        }
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
    }
    setIsLoading(false);
  };

  // Load notes when dialog opens, clear when closed
  useEffect(() => {
    if (isOpen) {
      loadNotes();
    } else {
      // Clear form when dialog closes
      setNotes("");
      setContactName("");
      setPhoneNumber("");
      setEmailAddress("");
      setInterviewDate("");
      setContactDate("");
      setFollowUpDate("");
      setReminderDate("");
      setReminderTime("");
      setReminderText("");
      setReminderId(null);
    }
  }, [isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/job-search-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          notes,
          contactName,
          phoneNumber,
          emailAddress,
          dateApplied: contactDate ? new Date(contactDate).toISOString() : null,
          contactDate: contactDate ? new Date(contactDate).toISOString() : null,
          interviewDate: interviewDate ? new Date(interviewDate).toISOString() : null,
          followUpDate: followUpDate ? new Date(followUpDate).toISOString() : null,
          reminderDate: reminderDate ? (
            reminderTime ? 
              new Date(`${reminderDate}T${reminderTime}`).toISOString() :
              new Date(`${reminderDate}T09:00`).toISOString()
          ) : null,
          reminderTime: reminderTime,
          reminderText: reminderText,
          conversationSummary: notes,
        }),
      });

      if (response.ok) {
        setIsOpen(false);
        console.log("Notes saved successfully");
        // Trigger a re-render of reminder indicators and clear cache
        console.log('Dispatching notesUpdated event for company:', companyId);
        window.dispatchEvent(new CustomEvent('notesUpdated', { detail: { companyId } }));
      } else {
        const errorData = await response.json();
        console.error("Failed to save notes:", errorData);
        alert("Failed to save notes: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Failed to save notes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`w-full ${TOUCH_FRIENDLY.button} bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 text-yellow-700 border-yellow-200/70 hover:border-yellow-300 font-semibold shadow-sm hover:shadow-md transition-all duration-200`}
        >
          <StickyNote className="w-4 h-4 mr-2" />
          Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <StickyNote className="w-5 h-5" />
            <span>Notes for {companyName}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
              <span className="ml-2 text-gray-600">Loading notes...</span>
            </div>
          ) : (
            <>
              {/* Notes Section */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes & Comments</Label>
                <Textarea
                  id="notes"
                  placeholder="Add your notes about this company, interview details, conversations, etc..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </>
          )}
          
          {!isLoading && (
            <>
              {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Person</Label>
              <Input
                id="contactName"
                placeholder="Hiring manager, recruiter, etc."
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="(555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="emailAddress">Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                placeholder="contact@company.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Important Dates */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4" />
              <h3 className="font-medium">Important Dates</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interviewDate">Interview Date</Label>
                <Input
                  id="interviewDate"
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactDate">Last Contact Date</Label>
                <Input
                  id="contactDate"
                  type="date"
                  value={contactDate}
                  onChange={(e) => setContactDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followUpDate">Follow-up Date</Label>
                <Input
                  id="followUpDate"
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
              </div>
              <div className="space-y-2" data-reminder-id={reminderId || undefined}>
                <Label htmlFor="reminderDate">Reminder Date & Time</Label>
                <div className={RESPONSIVE_GRIDS.twoCol}>
                  <Input
                    id="reminderDate"
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    placeholder="Select date"
                    className={TOUCH_FRIENDLY.input}
                  />
                  <Input
                    id="reminderTime"
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    placeholder="Select time"
                    className={TOUCH_FRIENDLY.input}
                  />
                </div>
                <div className="mt-2">
                  <Label htmlFor="reminderText">Reminder Message (Optional)</Label>
                  <Input
                    id="reminderText"
                    placeholder="What to remind you about..."
                    value={reminderText}
                    onChange={(e) => setReminderText(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isSaving}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              <Save className="w-4 h-4 mr-1" />
              {isSaving ? "Saving..." : "Save Notes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CompanyCardProps {
  company: any;
  onEdit?: () => void;
  onViewProfile?: () => void;
  onSync?: () => void;
  onJobSearchNotes?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  syncData?: {
    earnings: { daily: number; weekly: number; monthly: number; total: number };
    trips: { completed: number; cancelled: number; totalDistance: number };
    performance: { rating: number; acceptanceRate: number; completionRate: number; onTimeRate: number };
    lastSync: Date;
  };
  showActionDropdown?: boolean;
  onAction?: (action: string) => void;
  className?: string;
  isWaitingList?: boolean;
  onWaitingListToggle?: () => void;
  activeDuration?: string;
}

export default function CompanyCard({
  company,
  onEdit,
  onViewProfile,
  onSync,
  onView,
  onJobSearchNotes,
  onDelete,
  syncData,
  showActionDropdown,
  onAction,
  className = "",
  isWaitingList = false,
  onWaitingListToggle,
  activeDuration
}: CompanyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState(company.videoUrl || "");

  return (
    <Card 
      className={`group relative rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 hover:from-white hover:via-blue-50/40 hover:to-indigo-50/30 ${OVERFLOW.preventX} overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Subtle top border accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-60" />
      
      <CardHeader className="relative pb-3 px-5 pt-5">
        {/* Company Name Row - Enhanced */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm overflow-hidden">
                {(() => {
                  const logo = getCompanyLogo(company.name);
                  if (logo.type === 'image') {
                    return (
                      <img 
                        src={logo.src} 
                        alt={logo.alt}
                        className="w-7 h-7 object-contain"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          const parent = target.parentElement;
                          if (parent) {
                            target.style.display = 'none';
                            const fallback = parent.querySelector('.fallback-icon') as HTMLElement;
                            if (fallback) {
                              fallback.style.display = 'flex';
                            }
                          }
                        }}
                      />
                    );
                  } else if (logo.icon) {
                    const IconComponent = logo.icon;
                    return <IconComponent className="w-4 h-4 text-blue-600" />;
                  }
                  return <Building2 className="w-4 h-4 text-blue-600" />;
                })()}
                <div className="fallback-icon w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 items-center justify-center shadow-sm" style={{ display: 'none' }}>
                  <Building2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-900 leading-tight truncate group-hover:text-blue-900 transition-colors duration-200">
                {company.name}
              </h3>
            </div>
            
            {/* Video Link Display */}
            <div className="ml-10 mb-2">
              {isEditingVideo ? (
                <div className="flex items-center space-x-2">
                  <Input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                    className="flex-1 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={async () => {
                      try {
                        await fetch(`/api/companies/${company.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ videoUrl })
                        });
                        setIsEditingVideo(false);
                        // Update company object with new video URL
                        company.videoUrl = videoUrl;
                      } catch (error) {
                        console.error('Failed to update video URL:', error);
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setVideoUrl(company.videoUrl || "");
                      setIsEditingVideo(false);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {company.videoUrl ? (
                    <button
                      onClick={() => window.open(company.videoUrl, '_blank')}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                    >
                      <Play className="w-4 h-4" />
                      <span>Watch Company Video</span>
                    </button>
                  ) : (
                    <span className="text-gray-500 text-sm">No video link</span>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingVideo(true)}
                    className="p-1 h-6 w-6"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-600 ml-10 font-medium truncate">{company.serviceVertical}</p>
          </div>

          {/* Trash button for Active Companies section - Enhanced */}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 h-8 w-8 rounded-xl flex-shrink-0 transition-all duration-200 hover:shadow-sm border border-transparent hover:border-red-200"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Action Dropdown Row - Enhanced */}
        <div className="mb-4">
          {/* Action dropdown for Driver Opportunities */}
          {showActionDropdown && onAction && (
            <ActionDropdown 
              currentSelection={company.currentAction || null} 
              onAction={onAction}
              isWaitingList={isWaitingList}
              onWaitingListToggle={onWaitingListToggle}
            />
          )}
        </div>

        {/* Company Tags - Enhanced with better spacing and design */}
        <div className={`${RESPONSIVE_FLEX.wrap} ${OVERFLOW.preventX} mt-3`}>
          {company.averagePay && (
            <Badge className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-semibold text-xs px-3 py-1 rounded-full border border-green-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <DollarSign className="w-3 h-3 mr-1" />
              {company.averagePay}
            </Badge>
          )}
          {company.contractType && (
            <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200/70 text-xs px-3 py-1 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
              <Briefcase className="w-3 h-3 mr-1" />
              {company.contractType}
            </Badge>
          )}
          {company.vehicleTypes && company.vehicleTypes.length > 0 && (
            <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200/70 text-xs px-3 py-1 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
              <Car className="w-3 h-3 mr-1" />
              {company.vehicleTypes[0]}
              {company.vehicleTypes.length > 1 && ` +${company.vehicleTypes.length - 1}`}
            </Badge>
          )}
          <ReminderIndicator companyId={company.id} />
          <NotesIndicator companyId={company.id} companyName={company.name} />
        </div>
      </CardHeader>

      <CardContent className="relative pt-0 px-5 pb-5">
        {/* Sync Data Display - Enhanced */}
        {syncData && (
          <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/40 border border-blue-200/30 rounded-xl p-4 mt-4 backdrop-blur-sm shadow-inner">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center text-sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Synced Data
            </h4>
            
            {/* Earnings Row - Compact */}
            <div className={`${RESPONSIVE_GRIDS.fourCol} text-xs mb-2`}>
              <div className="text-center bg-white/80 rounded-md p-1.5">
                <div className="font-semibold text-blue-700 text-xs">${syncData.earnings.daily}</div>
                <div className="text-blue-600 text-xs">Daily</div>
              </div>
              <div className="text-center bg-white/80 rounded-md p-1.5">
                <div className="font-semibold text-blue-700 text-xs">${syncData.earnings.weekly}</div>
                <div className="text-blue-600 text-xs">Weekly</div>
              </div>
              <div className="text-center bg-white/80 rounded-md p-1.5">
                <div className="font-semibold text-blue-700 text-xs">${syncData.earnings.monthly}</div>
                <div className="text-blue-600 text-xs">Monthly</div>
              </div>
              <div className="text-center bg-white/80 rounded-md p-1.5">
                <div className="font-semibold text-blue-700 text-xs">${syncData.earnings.total}</div>
                <div className="text-blue-600 text-xs">Total</div>
              </div>
            </div>

            {/* Performance Metrics - Compact */}
            <div className={`${RESPONSIVE_GRIDS.twoCol} text-xs mb-2`}>
              <div className="bg-white/80 rounded-md p-1.5">
                <div className="font-medium text-gray-700 text-xs">Rating</div>
                <div className="text-blue-700 font-semibold text-xs">{syncData.performance.rating}/5.0</div>
              </div>
              <div className="bg-white/80 rounded-md p-1.5">
                <div className="font-medium text-gray-700 text-xs">Trips</div>
                <div className="text-blue-700 font-semibold text-xs">{syncData.trips.completed}</div>
              </div>
            </div>

            {/* Performance Percentages */}
            <div className={`${RESPONSIVE_GRIDS.threeCol} text-xs mb-2`}>
              <div className="text-center">
                <div className="font-semibold text-blue-700">{syncData.performance.acceptanceRate}%</div>
                <div className="text-blue-600">Acceptance</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-700">{syncData.performance.completionRate}%</div>
                <div className="text-blue-600">Completion</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-700">{syncData.performance.onTimeRate}%</div>
                <div className="text-blue-600">On-Time</div>
              </div>
            </div>

            {/* Last Sync */}
            <div className="text-xs text-blue-600 text-center pt-2 border-t border-blue-200">
              Last synced: {syncData.lastSync.toLocaleDateString()}
            </div>
          </div>
        )}

        {/* Company Information Grid */}
        <div className={`${RESPONSIVE_GRIDS.twoCol} text-sm`}>
          {/* Active Duration - prominently displayed for Active Companies */}
          {activeDuration && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4 text-green-500" />
              <span className="font-medium text-green-700">Active for {activeDuration}</span>
            </div>
          )}
          
          {company.areasServed && company.areasServed.length > 0 && (
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>{company.areasServed[0]}</span>
              {company.areasServed.length > 1 && (
                <Badge variant="secondary" className="text-xs">
                  +{company.areasServed.length - 1}
                </Badge>
              )}
            </div>
          )}
          
          {company.insuranceRequirements && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Shield className="w-4 h-4 text-red-500" />
              <span className="truncate">{company.insuranceRequirements}</span>
            </div>
          )}
          

        </div>



        {/* Action Buttons - Enhanced */}
        <div className="space-y-3 mt-6 pt-4 border-t border-gray-200/50">
          {onViewProfile && (
            <Button 
              onClick={onViewProfile}
              variant="outline" 
              size="sm" 
              className={`w-full ${TOUCH_FRIENDLY.button} bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 border-blue-200/70 hover:border-blue-300 font-semibold shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Company Profile
            </Button>
          )}

          {/* Notes Button - Enhanced */}
          <CompanyNotes companyId={company.id} companyName={company.name} />

          {(onSync || onEdit) && (
            <div className={RESPONSIVE_FLEX.row}>
              {onSync && (
                <Button 
                  onClick={onSync}
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-blue-700 border-blue-200/70 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
              {onEdit && (
                <Button 
                  onClick={onEdit}
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-green-700 border-green-200/70 hover:border-green-300 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  My Notes
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}