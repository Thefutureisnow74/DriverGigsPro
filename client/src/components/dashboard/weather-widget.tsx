import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Cloud, CloudRain, Wind } from "lucide-react";

export default function WeatherWidget() {
  const { data: weather, isLoading } = useQuery({
    queryKey: ['/api/weather'],
    queryFn: () => api.weather.getCurrent(),
  });

  if (isLoading) {
    return (
      <Card className="card-hover weather-gradient rounded-2xl text-white shadow-xl animate-pulse">
        <CardContent className="p-6">
          <div className="h-24 bg-white bg-opacity-10 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="text-4xl text-yellow-300 animate-pulse-slow" />;
      case 'cloudy':
        return <Cloud className="text-4xl text-gray-200 animate-pulse-slow" />;
      case 'rainy':
        return <CloudRain className="text-4xl text-blue-200 animate-pulse-slow" />;
      default:
        return <Sun className="text-4xl text-yellow-300 animate-pulse-slow" />;
    }
  };

  return (
    <Card className="card-hover weather-gradient rounded-2xl text-white shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Today's Weather</h3>
            <div className="flex items-center space-x-4">
              {getWeatherIcon(weather?.condition || 'sunny')}
              <div>
                <p className="text-3xl font-bold">{weather?.temperature || 72}°F</p>
                <p className="text-sm opacity-80">
                  {weather?.condition || 'Sunny'}, {weather?.description || 'Perfect for driving!'}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">{weather?.location || 'Atlanta, GA'}</p>
            <p className="text-xs opacity-60">
              Last updated: {weather?.lastUpdated ? 
                new Date(weather.lastUpdated).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : 
                '2 min ago'
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
