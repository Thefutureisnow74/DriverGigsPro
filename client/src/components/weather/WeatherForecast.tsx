import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  CloudDrizzle, 
  Zap, 
  Eye, 
  Wind,
  MapPin,
  RefreshCw,
  Droplets,
  Thermometer,
  Gauge,
  Sunrise,
  Sunset,
  Navigation,
  Umbrella
} from "lucide-react";

interface WeatherDay {
  date: string;
  dayName: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  // Enhanced weather details for modal
  pressure: number;
  uvIndex: number;
  visibility: number;
  sunrise: string;
  sunset: string;
  feelsLike: number;
  windDirection: string;
  moonPhase: string;
  hourlyForecast: Array<{
    time: string;
    temp: number;
    condition: string;
    precipitation: number;
  }>;
}

interface WeatherData {
  location: string;
  current: {
    temp: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
  };
  forecast: WeatherDay[];
}

const getWeatherIcon = (condition: string, size: "sm" | "md" | "lg" = "md") => {
  const iconSize = size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6";
  
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
    return <CloudRain className={`${iconSize} text-blue-500`} />;
  }
  if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) {
    return <CloudSnow className={`${iconSize} text-blue-300`} />;
  }
  if (conditionLower.includes('drizzle')) {
    return <CloudDrizzle className={`${iconSize} text-blue-400`} />;
  }
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return <Zap className={`${iconSize} text-yellow-500`} />;
  }
  if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
    return <Cloud className={`${iconSize} text-gray-500`} />;
  }
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    return <Sun className={`${iconSize} text-yellow-400`} />;
  }
  
  return <Sun className={`${iconSize} text-yellow-400`} />;
};

const mockWeatherData: WeatherData = {
  location: "Atlanta, GA",
  current: {
    temp: 72,
    condition: "Partly Cloudy",
    icon: "partly-cloudy",
    humidity: 65,
    windSpeed: 8,
    visibility: 10
  },
  forecast: [
    {
      date: "2025-01-28",
      dayName: "Today",
      high: 75,
      low: 52,
      condition: "Partly Cloudy",
      icon: "partly-cloudy",
      humidity: 65,
      windSpeed: 8,
      precipitation: 10,
      pressure: 30.15,
      uvIndex: 6,
      visibility: 10,
      sunrise: "7:15 AM",
      sunset: "5:45 PM",
      feelsLike: 78,
      windDirection: "SSW",
      moonPhase: "Waxing Crescent",
      hourlyForecast: [
        { time: "6 AM", temp: 52, condition: "Clear", precipitation: 0 },
        { time: "9 AM", temp: 62, condition: "Partly Cloudy", precipitation: 0 },
        { time: "12 PM", temp: 71, condition: "Partly Cloudy", precipitation: 5 },
        { time: "3 PM", temp: 75, condition: "Partly Cloudy", precipitation: 10 },
        { time: "6 PM", temp: 68, condition: "Cloudy", precipitation: 15 },
        { time: "9 PM", temp: 58, condition: "Clear", precipitation: 0 }
      ]
    },
    {
      date: "2025-01-29",
      dayName: "Wed",
      high: 78,
      low: 55,
      condition: "Sunny",
      icon: "sunny",
      humidity: 58,
      windSpeed: 6,
      precipitation: 0,
      pressure: 30.25,
      uvIndex: 8,
      visibility: 15,
      sunrise: "7:14 AM",
      sunset: "5:46 PM",
      feelsLike: 82,
      windDirection: "SW",
      moonPhase: "Waxing Crescent",
      hourlyForecast: [
        { time: "6 AM", temp: 55, condition: "Clear", precipitation: 0 },
        { time: "9 AM", temp: 66, condition: "Sunny", precipitation: 0 },
        { time: "12 PM", temp: 75, condition: "Sunny", precipitation: 0 },
        { time: "3 PM", temp: 78, condition: "Sunny", precipitation: 0 },
        { time: "6 PM", temp: 72, condition: "Clear", precipitation: 0 },
        { time: "9 PM", temp: 61, condition: "Clear", precipitation: 0 }
      ]
    },
    {
      date: "2025-01-30",
      dayName: "Thu",
      high: 73,
      low: 48,
      condition: "Light Rain",
      icon: "rain",
      humidity: 78,
      windSpeed: 12,
      precipitation: 65,
      pressure: 29.95,
      uvIndex: 3,
      visibility: 6,
      sunrise: "7:13 AM",
      sunset: "5:47 PM",
      feelsLike: 70,
      windDirection: "NE",
      moonPhase: "First Quarter",
      hourlyForecast: [
        { time: "6 AM", temp: 48, condition: "Cloudy", precipitation: 10 },
        { time: "9 AM", temp: 55, condition: "Light Rain", precipitation: 40 },
        { time: "12 PM", temp: 68, condition: "Light Rain", precipitation: 65 },
        { time: "3 PM", temp: 73, condition: "Light Rain", precipitation: 55 },
        { time: "6 PM", temp: 66, condition: "Drizzle", precipitation: 30 },
        { time: "9 PM", temp: 52, condition: "Cloudy", precipitation: 15 }
      ]
    },
    {
      date: "2025-01-31",
      dayName: "Fri",
      high: 69,
      low: 45,
      condition: "Cloudy",
      icon: "cloudy",
      humidity: 70,
      windSpeed: 10,
      precipitation: 20,
      pressure: 30.05,
      uvIndex: 4,
      visibility: 8,
      sunrise: "7:12 AM",
      sunset: "5:48 PM",
      feelsLike: 66,
      windDirection: "NW",
      moonPhase: "First Quarter",
      hourlyForecast: [
        { time: "6 AM", temp: 45, condition: "Cloudy", precipitation: 5 },
        { time: "9 AM", temp: 52, condition: "Cloudy", precipitation: 15 },
        { time: "12 PM", temp: 62, condition: "Cloudy", precipitation: 20 },
        { time: "3 PM", temp: 69, condition: "Cloudy", precipitation: 25 },
        { time: "6 PM", temp: 64, condition: "Cloudy", precipitation: 15 },
        { time: "9 PM", temp: 50, condition: "Partly Cloudy", precipitation: 5 }
      ]
    },
    {
      date: "2025-02-01",
      dayName: "Sat",
      high: 76,
      low: 51,
      condition: "Partly Cloudy",
      icon: "partly-cloudy",
      humidity: 62,
      windSpeed: 7,
      precipitation: 15,
      pressure: 30.18,
      uvIndex: 7,
      visibility: 12,
      sunrise: "7:11 AM",
      sunset: "5:49 PM",
      feelsLike: 79,
      windDirection: "SW",
      moonPhase: "Waxing Gibbous",
      hourlyForecast: [
        { time: "6 AM", temp: 51, condition: "Clear", precipitation: 0 },
        { time: "9 AM", temp: 61, condition: "Partly Cloudy", precipitation: 5 },
        { time: "12 PM", temp: 71, condition: "Partly Cloudy", precipitation: 10 },
        { time: "3 PM", temp: 76, condition: "Partly Cloudy", precipitation: 15 },
        { time: "6 PM", temp: 70, condition: "Partly Cloudy", precipitation: 10 },
        { time: "9 PM", temp: 58, condition: "Clear", precipitation: 0 }
      ]
    },
    {
      date: "2025-02-02",
      dayName: "Sun",
      high: 80,
      low: 57,
      condition: "Sunny",
      icon: "sunny",
      humidity: 55,
      windSpeed: 5,
      precipitation: 0,
      pressure: 30.22,
      uvIndex: 9,
      visibility: 15,
      sunrise: "7:10 AM",
      sunset: "5:50 PM",
      feelsLike: 85,
      windDirection: "S",
      moonPhase: "Waxing Gibbous",
      hourlyForecast: [
        { time: "6 AM", temp: 57, condition: "Clear", precipitation: 0 },
        { time: "9 AM", temp: 68, condition: "Sunny", precipitation: 0 },
        { time: "12 PM", temp: 77, condition: "Sunny", precipitation: 0 },
        { time: "3 PM", temp: 80, condition: "Sunny", precipitation: 0 },
        { time: "6 PM", temp: 75, condition: "Clear", precipitation: 0 },
        { time: "9 PM", temp: 63, condition: "Clear", precipitation: 0 }
      ]
    },
    {
      date: "2025-02-03",
      dayName: "Mon",
      high: 77,
      low: 54,
      condition: "Partly Cloudy",
      icon: "partly-cloudy",
      humidity: 60,
      windSpeed: 9,
      precipitation: 5,
      pressure: 30.20,
      uvIndex: 7,
      visibility: 12,
      sunrise: "7:09 AM",
      sunset: "5:51 PM",
      feelsLike: 80,
      windDirection: "SW",
      moonPhase: "Full Moon",
      hourlyForecast: [
        { time: "6 AM", temp: 54, condition: "Clear", precipitation: 0 },
        { time: "9 AM", temp: 64, condition: "Partly Cloudy", precipitation: 0 },
        { time: "12 PM", temp: 73, condition: "Partly Cloudy", precipitation: 5 },
        { time: "3 PM", temp: 77, condition: "Partly Cloudy", precipitation: 5 },
        { time: "6 PM", temp: 71, condition: "Partly Cloudy", precipitation: 0 },
        { time: "9 PM", temp: 60, condition: "Clear", precipitation: 0 }
      ]
    }
  ]
};

export default function WeatherForecast() {
  const [isLoading, setIsLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedDay, setSelectedDay] = useState<WeatherDay | null>(null);
  const [showWeatherModal, setShowWeatherModal] = useState(false);

  const handleDayClick = (day: WeatherDay) => {
    setSelectedDay(day);
    setShowWeatherModal(true);
  };

  // Fetch user profile to get location
  const { data: userProfile } = useQuery({ 
    queryKey: ["/api/user/profile"],
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  useEffect(() => {
    // Simulate loading weather data
    const timer = setTimeout(() => {
      // Use the user's actual location from their profile
      const userLocation = userProfile?.city && userProfile?.state 
        ? `${userProfile.city}, ${userProfile.state.toUpperCase()}`
        : "Mesquite, TX"; // Default to user's known location
      
      setWeatherData({
        ...mockWeatherData,
        location: userLocation
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [userProfile]);

  if (isLoading || !weatherData) {
    return (
      <div className="flex items-center space-x-4 px-4 py-2">
        <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
        <span className="text-sm text-slate-600">Loading weather...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 lg:space-x-4 px-2 lg:px-4 py-2 overflow-x-auto">
      {/* Current Location */}
      <div className="flex items-center space-x-1 text-sm text-slate-700 flex-shrink-0">
        <MapPin className="w-4 h-4 text-blue-500" />
        <span className="font-medium hidden sm:inline">{weatherData.location}</span>
      </div>

      {/* Current Weather */}
      <div className="flex items-center space-x-2 px-2 lg:px-3 py-1 lg:py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 flex-shrink-0">
        {getWeatherIcon(weatherData.current.condition, "sm")}
        <div className="flex items-center space-x-1">
          <span className="text-base lg:text-lg font-bold text-slate-800">
            {weatherData.current.temp}°
          </span>
          <span className="text-xs lg:text-sm text-slate-600 hidden md:inline">
            {weatherData.current.condition}
          </span>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="flex items-center space-x-1 lg:space-x-2">
        {weatherData.forecast.slice(0, 5).map((day, index) => (
          <div 
            key={day.date}
            onClick={() => handleDayClick(day)}
            className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-xl transition-all duration-300 hover:bg-blue-100 hover:shadow-md cursor-pointer flex-shrink-0 ${
              index === 0 ? 'bg-blue-50 border border-blue-100' : 'hover:scale-105'
            }`}
          >
            <span className="text-xs font-medium text-slate-600">
              {day.dayName}
            </span>
            <div className="flex items-center justify-center">
              {getWeatherIcon(day.condition, "sm")}
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <span className="font-semibold text-slate-800">{day.high}°</span>
              <span className="text-slate-500">{day.low}°</span>
            </div>
            {day.precipitation > 0 && (
              <div className="flex items-center space-x-1">
                <Droplets className="w-2 h-2 text-blue-500" />
                <span className="text-xs text-blue-600">{day.precipitation}%</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Weather Details - Only on larger screens */}
      <div className="hidden xl:flex items-center space-x-2 text-xs text-slate-600 px-2 py-1 bg-slate-50 rounded-xl flex-shrink-0">
        <div className="flex items-center space-x-1">
          <Wind className="w-3 h-3" />
          <span>{weatherData.current.windSpeed}mph</span>
        </div>
      </div>

      {/* Detailed Weather Modal */}
      <Dialog open={showWeatherModal} onOpenChange={setShowWeatherModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center">
              {selectedDay && getWeatherIcon(selectedDay.condition, "lg")}
              <span className="ml-3">
                {selectedDay?.dayName} - {selectedDay?.condition}
              </span>
            </DialogTitle>
          </DialogHeader>

          {selectedDay && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Left Column - Main Weather Info */}
              <div className="space-y-6">
                {/* Temperature Card */}
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-slate-800">
                          {selectedDay.high}°
                        </span>
                        <span className="text-xl text-slate-600 ml-2">
                          / {selectedDay.low}°
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">
                        Feels like {selectedDay.feelsLike}°F
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-slate-700">
                        {selectedDay.condition}
                      </div>
                      <p className="text-sm text-slate-600">
                        {new Date(selectedDay.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center">
                      <Wind className="w-5 h-5 text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm text-slate-600">Wind</p>
                        <p className="font-semibold">{selectedDay.windSpeed} mph {selectedDay.windDirection}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center">
                      <Droplets className="w-5 h-5 text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm text-slate-600">Humidity</p>
                        <p className="font-semibold">{selectedDay.humidity}%</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center">
                      <Umbrella className="w-5 h-5 text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm text-slate-600">Precipitation</p>
                        <p className="font-semibold">{selectedDay.precipitation}%</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center">
                      <Eye className="w-5 h-5 text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm text-slate-600">Visibility</p>
                        <p className="font-semibold">{selectedDay.visibility} mi</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center">
                      <Gauge className="w-5 h-5 text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm text-slate-600">Pressure</p>
                        <p className="font-semibold">{selectedDay.pressure} in</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center">
                      <Sun className="w-5 h-5 text-yellow-500 mr-2" />
                      <div>
                        <p className="text-sm text-slate-600">UV Index</p>
                        <p className="font-semibold">{selectedDay.uvIndex}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Sun & Moon Info */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Sun & Moon</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Sunrise className="w-5 h-5 text-orange-500 mr-2" />
                      <div>
                        <p className="text-sm text-slate-600">Sunrise</p>
                        <p className="font-semibold">{selectedDay.sunrise}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Sunset className="w-5 h-5 text-orange-600 mr-2" />
                      <div>
                        <p className="text-sm text-slate-600">Sunset</p>
                        <p className="font-semibold">{selectedDay.sunset}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-slate-600">Moon Phase</p>
                    <p className="font-semibold">{selectedDay.moonPhase}</p>
                  </div>
                </Card>
              </div>

              {/* Right Column - Hourly Forecast */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Hourly Forecast</h3>
                  <div className="space-y-3">
                    {selectedDay.hourlyForecast.map((hour, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-slate-700 w-12">
                            {hour.time}
                          </span>
                          {getWeatherIcon(hour.condition, "sm")}
                          <span className="text-sm text-slate-600">
                            {hour.condition}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-800">
                            {hour.temp}°
                          </span>
                          {hour.precipitation > 0 && (
                            <div className="flex items-center space-x-1">
                              <Droplets className="w-3 h-3 text-blue-500" />
                              <span className="text-xs text-blue-600">
                                {hour.precipitation}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Driving Conditions */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Driving Conditions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Road Visibility</span>
                      <Badge className={selectedDay.visibility >= 10 ? "bg-green-100 text-green-800" : 
                                      selectedDay.visibility >= 5 ? "bg-yellow-100 text-yellow-800" : 
                                      "bg-red-100 text-red-800"}>
                        {selectedDay.visibility >= 10 ? "Excellent" : 
                         selectedDay.visibility >= 5 ? "Good" : "Poor"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Rain Risk</span>
                      <Badge className={selectedDay.precipitation <= 20 ? "bg-green-100 text-green-800" : 
                                      selectedDay.precipitation <= 50 ? "bg-yellow-100 text-yellow-800" : 
                                      "bg-red-100 text-red-800"}>
                        {selectedDay.precipitation <= 20 ? "Low" : 
                         selectedDay.precipitation <= 50 ? "Moderate" : "High"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Wind Conditions</span>
                      <Badge className={selectedDay.windSpeed <= 10 ? "bg-green-100 text-green-800" : 
                                      selectedDay.windSpeed <= 20 ? "bg-yellow-100 text-yellow-800" : 
                                      "bg-red-100 text-red-800"}>
                        {selectedDay.windSpeed <= 10 ? "Calm" : 
                         selectedDay.windSpeed <= 20 ? "Breezy" : "Windy"}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}