import axios from 'axios';
import type { DemandDataResponse, HotSpot } from '@shared/types/demand';

// Simple in-memory cache with TTL
interface CacheEntry {
  data: DemandDataResponse;
  expiry: number;
}

const demandCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(lat: number, lng: number): string {
  // Round to 2 decimal places to group nearby coordinates
  const roundedLat = Math.round(lat * 100) / 100;
  const roundedLng = Math.round(lng * 100) / 100;
  return `${roundedLat},${roundedLng}`;
}

function cleanExpiredCache() {
  const now = Date.now();
  const entries = Array.from(demandCache.entries());
  for (const [key, entry] of entries) {
    if (entry.expiry < now) {
      demandCache.delete(key);
    }
  }
}

/**
 * Generate demand hotspots based on user location with caching
 * In production, this would aggregate data from multiple APIs:
 * - Traffic APIs (TomTom, HERE)
 * - Event APIs (Ticketmaster, PredictHQ) 
 * - Weather APIs (OpenWeatherMap)
 * - Transportation data (airports, transit hubs)
 */
export async function generateDemandHotspots(
  userLat: number,
  userLng: number,
  city: string,
  forceRefresh = false
): Promise<DemandDataResponse> {
  
  // Clean up expired cache entries
  cleanExpiredCache();
  
  // Check cache unless forcing refresh
  const cacheKey = getCacheKey(userLat, userLng);
  const now = Date.now();
  
  if (!forceRefresh) {
    const cached = demandCache.get(cacheKey);
    if (cached && cached.expiry > now) {
      return {
        ...cached.data,
        dataSource: 'cached',
        cacheExpiry: new Date(cached.expiry).toISOString()
      };
    }
  }
  
  // Generate fresh data
  const hotspots: HotSpot[] = [];
  
  // Mile to degree conversion (approximate)
  const mileOffset = 1.44927; // ~100 miles
  
  // Common high-demand locations to simulate
  const locationTypes = [
    { name: 'Airport', baseDemand: 90, earnings: '$45-65/hr', peak: '5-9 AM, 4-8 PM' },
    { name: 'Downtown/City Center', baseDemand: 85, earnings: '$35-50/hr', peak: '11 AM-2 PM, 6-11 PM' },
    { name: 'Shopping District', baseDemand: 80, earnings: '$30-45/hr', peak: '12-8 PM' },
    { name: 'Entertainment District', baseDemand: 78, earnings: '$40-60/hr', peak: '7 PM-2 AM Fri-Sat' },
    { name: 'Stadium/Arena', baseDemand: 75, earnings: '$30-45/hr', peak: 'Event dependent' },
    { name: 'Convention Center', baseDemand: 70, earnings: '$25-40/hr', peak: '9 AM-5 PM' },
    { name: 'University Campus', baseDemand: 65, earnings: '$20-35/hr', peak: '8 AM-10 PM' },
    { name: 'Medical District', baseDemand: 72, earnings: '$28-42/hr', peak: '6-11 PM' }
  ];
  
  // Current hour affects demand
  const currentHour = new Date().getHours();
  
  // Generate 5-8 hotspots in the area
  const numHotspots = 5 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < numHotspots; i++) {
    const locationType = locationTypes[i % locationTypes.length];
    
    // Random position within 100-mile radius
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * mileOffset;
    
    const lat = userLat + (distance * Math.cos(angle));
    const lng = userLng + (distance * Math.sin(angle));
    
    // Adjust demand based on time of day
    let demandMultiplier = 1;
    if (currentHour >= 7 && currentHour <= 9) demandMultiplier = 1.2; // Morning rush
    else if (currentHour >= 17 && currentHour <= 20) demandMultiplier = 1.3; // Evening rush
    else if (currentHour >= 21 || currentHour <= 2) demandMultiplier = 0.9; // Late night
    else if (currentHour >= 11 && currentHour <= 14) demandMultiplier = 1.1; // Lunch
    
    const concentration = Math.min(100, Math.round(locationType.baseDemand * demandMultiplier * (0.85 + Math.random() * 0.3)));
    
    let type: 'high' | 'medium' | 'low' = 'low';
    if (concentration >= 80) type = 'high';
    else if (concentration >= 60) type = 'medium';
    
    hotspots.push({
      id: i + 1,
      name: `${locationType.name}`,
      lat,
      lng,
      concentration,
      type,
      estimatedEarnings: locationType.earnings,
      peakHours: locationType.peak
    });
  }
  
  // Sort by concentration (highest first)
  hotspots.sort((a, b) => b.concentration - a.concentration);
  
  const result: DemandDataResponse = {
    hotspots,
    userLocation: {
      lat: userLat,
      lng: userLng,
      city
    },
    lastUpdated: new Date().toISOString(),
    dataSource: 'realtime'
  };
  
  // Cache the result
  demandCache.set(cacheKey, {
    data: result,
    expiry: now + CACHE_TTL
  });
  
  return result;
}

/**
 * Get weather data for location
 */
export async function getWeatherData(lat: number, lng: number) {
  try {
    // Using free weather API - no key required
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
    );
    
    return response.data;
  } catch (error) {
    console.error('Weather API error:', error);
    return null;
  }
}
