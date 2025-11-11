import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Calendar,
  Clock,
  DollarSign,
  Navigation,
  Zap,
  Activity,
  RefreshCw,
  Maximize2
} from "lucide-react";

interface HotSpot {
  id: number;
  name: string;
  lat: number;
  lng: number;
  concentration: number;
  type: 'high' | 'medium' | 'low';
  estimatedEarnings: string;
  peakHours: string;
  events?: Event[];
}

interface Event {
  id: number;
  name: string;
  venue: string;
  time: string;
  expectedAttendance: number;
  type: 'concert' | 'sports' | 'convention' | 'nightlife' | 'business';
}

// Real-time hotspot data simulation (in production, this would come from APIs like Uber/Lyft demand data)
const atlantaHotSpots: HotSpot[] = [
  {
    id: 1,
    name: "Hartsfield-Jackson Airport",
    lat: 33.6407,
    lng: -84.4277,
    concentration: 95,
    type: 'high',
    estimatedEarnings: "$45-65/hr",
    peakHours: "5-9 AM, 4-8 PM",
    events: [
      {
        id: 1,
        name: "Flight Rush Hour",
        venue: "ATL Airport",
        time: "6:00 PM - 8:00 PM",
        expectedAttendance: 15000,
        type: 'business'
      }
    ]
  },
  {
    id: 2,
    name: "Downtown/Centennial Park",
    lat: 33.7490,
    lng: -84.3880,
    concentration: 88,
    type: 'high',
    estimatedEarnings: "$35-50/hr",
    peakHours: "11 AM-2 PM, 6-11 PM",
    events: [
      {
        id: 2,
        name: "Summer Concert Series",
        venue: "Centennial Olympic Park",
        time: "8:00 PM - 11:00 PM",
        expectedAttendance: 8000,
        type: 'concert'
      }
    ]
  },
  {
    id: 3,
    name: "Buckhead Entertainment",
    lat: 33.8484,
    lng: -84.3781,
    concentration: 82,
    type: 'high',
    estimatedEarnings: "$40-60/hr",
    peakHours: "7 PM-2 AM Fri-Sat",
    events: [
      {
        id: 3,
        name: "Nightlife District",
        venue: "Buckhead Village",
        time: "9:00 PM - 2:00 AM",
        expectedAttendance: 5000,
        type: 'nightlife'
      }
    ]
  },
  {
    id: 4,
    name: "Mercedes-Benz Stadium",
    lat: 33.7553,
    lng: -84.4006,
    concentration: 75,
    type: 'medium',
    estimatedEarnings: "$30-45/hr",
    peakHours: "Event dependent",
    events: [
      {
        id: 4,
        name: "Atlanta United FC",
        venue: "Mercedes-Benz Stadium",
        time: "7:30 PM - 10:00 PM",
        expectedAttendance: 42000,
        type: 'sports'
      }
    ]
  },
  {
    id: 5,
    name: "Georgia World Congress",
    lat: 33.7598,
    lng: -84.3951,
    concentration: 70,
    type: 'medium',
    estimatedEarnings: "$25-40/hr",
    peakHours: "9 AM-5 PM",
    events: [
      {
        id: 5,
        name: "Tech Convention",
        venue: "GWCC",
        time: "9:00 AM - 6:00 PM",
        expectedAttendance: 12000,
        type: 'convention'
      }
    ]
  },
  {
    id: 6,
    name: "Virginia-Highland",
    lat: 33.7847,
    lng: -84.3553,
    concentration: 65,
    type: 'medium',
    estimatedEarnings: "$20-35/hr",
    peakHours: "6-10 PM",
  },
  {
    id: 7,
    name: "Little Five Points",
    lat: 33.7644,
    lng: -84.3522,
    concentration: 58,
    type: 'low',
    estimatedEarnings: "$18-30/hr",
    peakHours: "7 PM-12 AM",
  },
  {
    id: 8,
    name: "Midtown Arts District",
    lat: 33.7838,
    lng: -84.3864,
    concentration: 72,
    type: 'medium',
    estimatedEarnings: "$28-42/hr",
    peakHours: "6-11 PM",
  }
];

const getConcentrationColor = (concentration: number) => {
  if (concentration >= 80) return "text-red-600 bg-red-100 border-red-200";
  if (concentration >= 60) return "text-orange-600 bg-orange-100 border-orange-200";
  return "text-green-600 bg-green-100 border-green-200";
};

const getTypeColor = (type: string) => {
  switch(type) {
    case 'high': return "bg-red-500";
    case 'medium': return "bg-orange-500";
    case 'low': return "bg-green-500";
    default: return "bg-gray-500";
  }
};

const getEventTypeIcon = (type: string) => {
  switch(type) {
    case 'concert': return "🎵";
    case 'sports': return "⚽";
    case 'convention': return "🏢";
    case 'nightlife': return "🌃";
    case 'business': return "✈️";
    default: return "📍";
  }
};

// Interactive Heat Map Component
function InteractiveHeatMap({ hotspots, onHotspotClick, selectedHotspot, mapBounds, userLocation }: {
  hotspots: HotSpot[],
  onHotspotClick: (hotspot: HotSpot) => void,
  selectedHotspot: HotSpot | null,
  mapBounds: any,
  userLocation: {lat: number, lng: number, city: string} | null
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<HotSpot | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dynamic map boundaries based on user location (with fallback)
    const bounds = mapBounds || {
      north: 33.9,
      south: 33.6,
      east: -84.2,
      west: -84.6
    };

    // Convert lat/lng to canvas coordinates
    const latLngToCanvas = (lat: number, lng: number) => {
      const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * canvas.width;
      const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * canvas.height;
      return { x, y };
    };

    // Draw background grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * canvas.width;
      const y = (i / 10) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw hotspots
    hotspots.forEach((hotspot) => {
      const pos = latLngToCanvas(hotspot.lat, hotspot.lng);
      const radius = Math.max(15, (hotspot.concentration / 100) * 40);
      
      // Determine color based on concentration
      let color;
      if (hotspot.concentration >= 80) color = '#ef4444';
      else if (hotspot.concentration >= 60) color = '#f97316';
      else color = '#22c55e';

      // Draw glow effect
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 2);
      gradient.addColorStop(0, color + '40');
      gradient.addColorStop(1, color + '00');
      ctx.fillStyle = gradient;
      ctx.fillRect(pos.x - radius * 2, pos.y - radius * 2, radius * 4, radius * 4);

      // Draw main circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color + (selectedHotspot?.id === hotspot.id ? 'CC' : '80');
      ctx.fill();
      ctx.strokeStyle = selectedHotspot?.id === hotspot.id ? '#1e40af' : color;
      ctx.lineWidth = selectedHotspot?.id === hotspot.id ? 3 : 2;
      ctx.stroke();

      // Draw concentration text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round(hotspot.concentration)}%`, pos.x, pos.y);

      // Store hotspot position for click detection
      (hotspot as any).canvasPos = { x: pos.x, y: pos.y, radius };
    });

    // Draw user location marker
    if (userLocation) {
      const userPos = latLngToCanvas(userLocation.lat, userLocation.lng);
      
      // Draw user location circle
      ctx.beginPath();
      ctx.arc(userPos.x, userPos.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw "You are here" text
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('You', userPos.x, userPos.y - 15);
    }

    // Draw major transportation corridors (simplified)
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Draw a rough highway system (main arteries)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Major highway (horizontal)
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
    
    // Major highway (vertical)
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    
    // Beltway/Ring road around metropolitan area
    const beltRadius = Math.min(canvas.width, canvas.height) * 0.3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, beltRadius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.setLineDash([]);
  }, [hotspots, selectedHotspot]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is within any hotspot
    for (const hotspot of hotspots) {
      const pos = (hotspot as any).canvasPos;
      if (pos) {
        const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        if (distance <= pos.radius) {
          onHotspotClick(hotspot);
          break;
        }
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setMousePos({ x: event.clientX, y: event.clientY });

    // Check if hovering over any hotspot
    let foundHotspot = null;
    for (const hotspot of hotspots) {
      const pos = (hotspot as any).canvasPos;
      if (pos) {
        const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        if (distance <= pos.radius) {
          foundHotspot = hotspot;
          break;
        }
      }
    }
    setHoveredHotspot(foundHotspot);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="w-full h-auto border border-slate-200 rounded-lg cursor-pointer bg-gradient-to-br from-slate-50 to-blue-50"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredHotspot(null)}
      />
      
      {/* Tooltip for hovered hotspot */}
      {hoveredHotspot && (
        <div 
          className="absolute bg-white rounded-lg shadow-lg border border-slate-200 p-3 pointer-events-none z-10 min-w-[200px]"
          style={{
            left: mousePos.x - 100,
            top: mousePos.y - 100,
          }}
        >
          <h4 className="font-semibold text-slate-800 mb-1">{hoveredHotspot.name}</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Demand:</span>
              <Badge className={getConcentrationColor(hoveredHotspot.concentration)}>
                {Math.round(hoveredHotspot.concentration)}%
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Earnings:</span>
              <span className="font-medium text-green-600">{hoveredHotspot.estimatedEarnings}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RideshareMap() {
  const [selectedHotSpot, setSelectedHotSpot] = useState<HotSpot | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [realTimeData, setRealTimeData] = useState(atlantaHotSpots);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number, city: string} | null>(null);
  const [mapBounds, setMapBounds] = useState({
    north: 33.9,
    south: 33.6,
    east: -84.2,
    west: -84.6,
    centerLat: 33.7490,
    centerLng: -84.3880
  });

  useEffect(() => {
    // Get user's location on component mount
    getUserLocation();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate real-time data updates
      updateRealTimeData();
    }, 30000); // Update every 30 seconds
    return () => clearInterval(timer);
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          try {
            // Get city name from coordinates using reverse geocoding
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
            const data = await response.json();
            const city = data.city || data.locality || 'Your Area';
            
            setUserLocation({ lat, lng, city });
            
            // Update map bounds to cover ~100 miles around user location
            const mileOffset = 1.44927; // Approximately 1 degree = 69 miles, so 100 miles ≈ 1.45 degrees
            const newBounds = {
              north: lat + mileOffset,
              south: lat - mileOffset,
              east: lng + mileOffset,
              west: lng - mileOffset,
              centerLat: lat,
              centerLng: lng
            };
            setMapBounds(newBounds);
            
            // Generate location-specific hotspots
            generateLocalHotspots(lat, lng, city);
          } catch (error) {
            console.log('Geocoding failed, using default location');
            setUserLocation({ lat: 33.7490, lng: -84.3880, city: 'Atlanta' });
          }
        },
        (error) => {
          console.log('Geolocation failed, using default location');
          setUserLocation({ lat: 33.7490, lng: -84.3880, city: 'Atlanta' });
        }
      );
    } else {
      setUserLocation({ lat: 33.7490, lng: -84.3880, city: 'Atlanta' });
    }
  };

  const generateLocalHotspots = (centerLat: number, centerLng: number, cityName: string) => {
    // Generate hotspots within 100 miles of user location
    const localHotspots: HotSpot[] = [
      {
        id: 1,
        name: `${cityName} Downtown`,
        lat: centerLat + 0.05,
        lng: centerLng - 0.03,
        concentration: Math.floor(Math.random() * 30) + 70,
        type: 'high' as const,
        estimatedEarnings: "$35-55/hr",
        peakHours: "11 AM-2 PM, 6-11 PM",
        events: [{
          id: 1,
          name: "Business District Rush",
          venue: "Downtown Core",
          time: "5:00 PM - 7:00 PM",
          expectedAttendance: 5000,
          type: 'business' as const
        }]
      },
      {
        id: 2,
        name: `${cityName} Airport Area`,
        lat: centerLat - 0.15,
        lng: centerLng + 0.1,
        concentration: Math.floor(Math.random() * 25) + 75,
        type: 'high' as const,
        estimatedEarnings: "$45-65/hr",
        peakHours: "5-9 AM, 4-8 PM",
        events: [{
          id: 2,
          name: "Flight Schedule Peak",
          venue: "Local Airport",
          time: "6:00 AM - 9:00 AM",
          expectedAttendance: 8000,
          type: 'business' as const
        }]
      },
      {
        id: 3,
        name: "Shopping District",
        lat: centerLat + 0.08,
        lng: centerLng + 0.05,
        concentration: Math.floor(Math.random() * 20) + 60,
        type: 'medium' as const,
        estimatedEarnings: "$25-40/hr",
        peakHours: "10 AM-4 PM, 7-10 PM",
      },
      {
        id: 4,
        name: "Entertainment Quarter",
        lat: centerLat - 0.05,
        lng: centerLng - 0.08,
        concentration: Math.floor(Math.random() * 25) + 65,
        type: 'medium' as const,
        estimatedEarnings: "$30-50/hr",
        peakHours: "7 PM-2 AM Fri-Sat",
        events: [{
          id: 4,
          name: "Weekend Nightlife",
          venue: "Entertainment District",
          time: "9:00 PM - 2:00 AM",
          expectedAttendance: 3000,
          type: 'nightlife' as const
        }]
      },
      {
        id: 5,
        name: "University Campus",
        lat: centerLat + 0.12,
        lng: centerLng - 0.15,
        concentration: Math.floor(Math.random() * 20) + 55,
        type: 'medium' as const,
        estimatedEarnings: "$20-35/hr",
        peakHours: "8 AM-6 PM weekdays",
      },
      {
        id: 6,
        name: "Medical Center",
        lat: centerLat - 0.08,
        lng: centerLng + 0.12,
        concentration: Math.floor(Math.random() * 15) + 50,
        type: 'low' as const,
        estimatedEarnings: "$18-30/hr",
        peakHours: "24/7 steady",
      },
      {
        id: 7,
        name: "Suburban Mall",
        lat: centerLat + 0.2,
        lng: centerLng + 0.18,
        concentration: Math.floor(Math.random() * 15) + 45,
        type: 'low' as const,
        estimatedEarnings: "$15-28/hr",
        peakHours: "12-8 PM weekends",
      },
      {
        id: 8,
        name: "Sports Complex",
        lat: centerLat - 0.12,
        lng: centerLng - 0.2,
        concentration: Math.floor(Math.random() * 30) + 40,
        type: 'low' as const,
        estimatedEarnings: "$25-45/hr",
        peakHours: "Event dependent",
        events: [{
          id: 8,
          name: "Local Sports Event",
          venue: "Stadium",
          time: "7:00 PM - 10:00 PM",
          expectedAttendance: 15000,
          type: 'sports' as const
        }]
      }
    ];
    
    setRealTimeData(localHotspots);
  };

  const updateRealTimeData = () => {
    setRealTimeData(prev => prev.map(spot => ({
      ...spot,
      concentration: Math.max(20, Math.min(100, spot.concentration + (Math.random() - 0.5) * 10))
    })));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateRealTimeData();
    setIsRefreshing(false);
  };

  const sortedHotSpots = [...realTimeData].sort((a, b) => b.concentration - a.concentration);

  return (
    <Card className="border border-slate-200 shadow-sm bg-white">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-sm">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Live Demand Map</h2>
              <p className="text-sm text-slate-500 font-medium">Real-time rideshare hotspots & events</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Updating...' : 'Refresh'}
            </Button>
            <Badge variant="outline" className="border-green-200 text-green-700">
              <Activity className="w-3 h-3 mr-1" />
              Live Data
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Interactive Map */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 mb-6">
          {/* Map Header */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                {userLocation ? `${userLocation.city} Area - 100 Mile Radius` : 'Live Demand Heat Map'}
              </h3>
              <div className="flex items-center space-x-4">
                {/* Legend */}
                <div className="flex items-center space-x-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>High (80%+)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Medium (60-79%)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Low (&lt;60%)</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  Updated: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Interactive Heat Map */}
          <div className="p-4">
            <InteractiveHeatMap 
              hotspots={realTimeData}
              onHotspotClick={setSelectedHotSpot}
              selectedHotspot={selectedHotSpot}
              mapBounds={mapBounds}
              userLocation={userLocation}
            />
            
            {/* Map Labels */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-slate-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Your Location
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
                Major Highways
              </div>
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                Click zones for details
              </div>
              <div className="flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                100-mile coverage
              </div>
            </div>
          </div>
        </div>

        {/* Selected Hotspot Details */}
        {selectedHotSpot && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                {selectedHotSpot.name}
              </h3>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                onClick={() => window.open(`https://maps.google.com?q=${selectedHotSpot.lat},${selectedHotSpot.lng}`, '_blank')}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Navigate
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Demand Level</span>
                  <Badge className={getConcentrationColor(selectedHotSpot.concentration)}>
                    {selectedHotSpot.concentration}%
                  </Badge>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Estimated Earnings</span>
                  <span className="font-semibold text-green-600">{selectedHotSpot.estimatedEarnings}</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Peak Hours</span>
                  <span className="font-medium text-slate-800 text-sm">{selectedHotSpot.peakHours}</span>
                </div>
              </div>
            </div>

            {/* Events */}
            {selectedHotSpot.events && selectedHotSpot.events.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Upcoming Events
                </h4>
                <div className="space-y-2">
                  {selectedHotSpot.events.map((event) => (
                    <div key={event.id} className="bg-white rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                          <div>
                            <h5 className="font-medium text-slate-800">{event.name}</h5>
                            <p className="text-sm text-slate-600">{event.venue}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-slate-800">{event.time}</div>
                          <div className="text-xs text-slate-600 flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {event.expectedAttendance.toLocaleString()} expected
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800">Your Area</h4>
                <p className="text-sm text-slate-600">{userLocation?.city || 'Detecting...'}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{sortedHotSpots[0]?.concentration || '--'}%</div>
                <div className="text-xs text-slate-600">top demand</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800">Active Events</h4>
                <p className="text-sm text-slate-600">Happening now</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {realTimeData.reduce((total, spot) => total + (spot.events?.length || 0), 0)}
                </div>
                <div className="text-xs text-slate-600">events</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800">Avg. Earnings</h4>
                <p className="text-sm text-slate-600">Peak hours</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">$35-50</div>
                <div className="text-xs text-slate-600">per hour</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}