import { Sun, Cloud, CloudRain, CloudSnow, Wind } from "lucide-react";

export default function WeatherRow() {
  // Static weather data for consistent display (replace with API call when needed)
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 mt-2">
        <div className="flex justify-between items-center space-x-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex flex-col items-center animate-pulse">
              <div className="w-4 h-4 bg-white bg-opacity-30 rounded mb-1"></div>
              <div className="w-6 h-6 bg-white bg-opacity-30 rounded mb-1"></div>
              <div className="w-8 h-3 bg-white bg-opacity-30 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getWeatherIcon = (condition: string, size: string = "w-5 h-5") => {
    const iconClass = `${size} text-white drop-shadow-sm`;
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className={iconClass} />;
      case 'cloudy':
        return <Cloud className={iconClass} />;
      case 'rainy':
        return <CloudRain className={iconClass} />;
      case 'snowy':
        return <CloudSnow className={iconClass} />;
      default:
        return <Sun className={iconClass} />;
    }
  };

  // Generate dynamic day names based on current date
  const getDayName = (daysFromNow: number) => {
    if (daysFromNow === 0) return 'Today';
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  // 7-day forecast data with dynamic day names
  const forecast = [
    { day: getDayName(0), temp: 72, condition: 'sunny', high: 75, low: 65 },
    { day: getDayName(1), temp: 68, condition: 'cloudy', high: 70, low: 62 },
    { day: getDayName(2), temp: 74, condition: 'sunny', high: 78, low: 66 },
    { day: getDayName(3), temp: 71, condition: 'rainy', high: 73, low: 68 },
    { day: getDayName(4), temp: 69, condition: 'cloudy', high: 72, low: 64 },
    { day: getDayName(5), temp: 76, condition: 'sunny', high: 79, low: 69 },
    { day: getDayName(6), temp: 73, condition: 'sunny', high: 77, low: 67 }
  ];

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-1 mt-1">
      <div className="flex justify-between items-center space-x-2">
        {forecast.map((day, index) => (
          <div key={index} className="flex flex-col items-center text-center min-w-0 flex-1">
            <p className="text-xs font-medium text-white opacity-90 mb-0.5">{day.day}</p>
            <div className="flex justify-center mb-0.5">
              {getWeatherIcon(day.condition, "w-4 h-4")}
            </div>
            <p className="text-xs font-bold text-white">{day.temp}°</p>
            <div className="text-xs text-white opacity-75">
              <span>{day.high}°</span>
              <span className="text-white opacity-60 mx-0.5">/</span>
              <span>{day.low}°</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Current conditions summary */}
      <div className="mt-1 text-center">
        <p className="text-xs text-white opacity-80">
          Mesquite, TX - Perfect conditions for driving today
        </p>
      </div>
    </div>
  );
}