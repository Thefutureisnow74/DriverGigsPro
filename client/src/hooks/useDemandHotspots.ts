import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import type { DemandDataResponse } from '@shared/types/demand';

async function fetchDemandData(
  lat: number,
  lng: number,
  city: string
): Promise<DemandDataResponse> {
  const response = await fetch(
    `/api/demand?lat=${lat}&lng=${lng}&city=${encodeURIComponent(city)}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch demand data');
  }
  
  return response.json();
}

export function useDemandHotspots(
  lat: number | null,
  lng: number | null,
  city: string | null,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  const queryKey = ['demand-hotspots', lat, lng, city];
  
  const query = useQuery({
    queryKey,
    queryFn: () => {
      if (lat === null || lng === null || city === null) {
        throw new Error('Location data required');
      }
      return fetchDemandData(lat, lng, city);
    },
    enabled: options?.enabled !== false && lat !== null && lng !== null && city !== null,
    refetchInterval: options?.refetchInterval || 60000, // Refetch every minute by default
    staleTime: 30000, // Consider data stale after 30 seconds
  });
  
  const refreshMutation = useMutation({
    mutationFn: async () => {
      if (lat === null || lng === null || city === null) {
        throw new Error('Location data required');
      }
      return fetchDemandData(lat, lng, city);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
    },
  });
  
  return {
    ...query,
    refresh: refreshMutation.mutate,
    isRefreshing: refreshMutation.isPending,
  };
}
