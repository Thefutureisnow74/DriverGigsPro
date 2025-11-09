import { EncryptionService } from '../encryption';

export interface OAuthCredentials {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  accountId?: string;
}

export class OAuthService {
  static async handleDoorDashAuth(email: string, password: string): Promise<OAuthCredentials> {
    // Simulate DoorDash OAuth flow
    // In production, this would make actual API calls to DoorDash
    try {
      const mockResponse = await this.simulateOAuthFlow('doordash', email, password);
      
      return {
        accessToken: mockResponse.access_token,
        refreshToken: mockResponse.refresh_token,
        expiresAt: new Date(Date.now() + mockResponse.expires_in * 1000),
        accountId: mockResponse.account_id,
      };
    } catch (error) {
      throw new Error('DoorDash authentication failed');
    }
  }

  static async handleUberAuth(email: string, password: string): Promise<OAuthCredentials> {
    // Simulate Uber OAuth flow
    try {
      const mockResponse = await this.simulateOAuthFlow('uber', email, password);
      
      return {
        accessToken: mockResponse.access_token,
        refreshToken: mockResponse.refresh_token,
        expiresAt: new Date(Date.now() + mockResponse.expires_in * 1000),
        accountId: mockResponse.account_id,
      };
    } catch (error) {
      throw new Error('Uber authentication failed');
    }
  }

  static async handleAmazonFlexAuth(email: string, password: string): Promise<OAuthCredentials> {
    // Simulate Amazon Flex OAuth flow
    try {
      const mockResponse = await this.simulateOAuthFlow('amazon_flex', email, password);
      
      return {
        accessToken: mockResponse.access_token,
        refreshToken: mockResponse.refresh_token,
        expiresAt: new Date(Date.now() + mockResponse.expires_in * 1000),
        accountId: mockResponse.account_id,
      };
    } catch (error) {
      throw new Error('Amazon Flex authentication failed');
    }
  }

  static async refreshToken(platform: string, refreshToken: string): Promise<OAuthCredentials> {
    try {
      const decryptedToken = EncryptionService.decrypt(refreshToken);
      const mockResponse = await this.simulateTokenRefresh(platform, decryptedToken);
      
      return {
        accessToken: mockResponse.access_token,
        refreshToken: mockResponse.refresh_token,
        expiresAt: new Date(Date.now() + mockResponse.expires_in * 1000),
      };
    } catch (error) {
      throw new Error(`Failed to refresh ${platform} token`);
    }
  }

  static async fetchEarningsData(platform: string, accessToken: string) {
    try {
      const decryptedToken = EncryptionService.decrypt(accessToken);
      
      // Simulate API calls to fetch earnings data
      const earningsData = await this.simulateEarningsAPI(platform, decryptedToken);
      
      return {
        dailyEarnings: earningsData.daily_earnings,
        weeklyEarnings: earningsData.weekly_earnings,
        monthlyEarnings: earningsData.monthly_earnings,
        tripCount: earningsData.trip_count,
        deliveryCount: earningsData.delivery_count,
        rating: earningsData.rating,
        acceptanceRate: earningsData.acceptance_rate,
        completionRate: earningsData.completion_rate,
        onlineHours: earningsData.online_hours,
        activeHours: earningsData.active_hours,
        milesDriven: earningsData.miles_driven,
        rawData: earningsData,
      };
    } catch (error) {
      throw new Error(`Failed to fetch ${platform} earnings data`);
    }
  }

  private static async simulateOAuthFlow(platform: string, email: string, password: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Validate credentials format
    if (!this.isValidEmail(email) || password.length < 6) {
      throw new Error('Invalid credentials');
    }

    // Generate realistic mock tokens
    const accountId = this.generateAccountId(platform);
    const accessToken = EncryptionService.generateRandomToken(64);
    const refreshToken = EncryptionService.generateRandomToken(64);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 3600, // 1 hour
      token_type: 'Bearer',
      account_id: accountId,
    };
  }

  private static async simulateTokenRefresh(platform: string, refreshToken: string) {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const accessToken = EncryptionService.generateRandomToken(64);
    const newRefreshToken = EncryptionService.generateRandomToken(64);

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
      expires_in: 3600,
      token_type: 'Bearer',
    };
  }

  private static async simulateEarningsAPI(platform: string, accessToken: string) {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500));
    
    // Generate realistic earnings data based on platform
    const baseEarnings = this.getBaseEarningsForPlatform(platform);
    const variance = 0.2; // 20% variance
    
    const dailyEarnings = this.applyVariance(baseEarnings.daily, variance);
    const weeklyEarnings = this.applyVariance(baseEarnings.weekly, variance);
    const monthlyEarnings = this.applyVariance(baseEarnings.monthly, variance);

    return {
      daily_earnings: dailyEarnings,
      weekly_earnings: weeklyEarnings,
      monthly_earnings: monthlyEarnings,
      trip_count: Math.floor(Math.random() * 50) + 10,
      delivery_count: Math.floor(Math.random() * 80) + 20,
      rating: (4.5 + Math.random() * 0.5).toFixed(2),
      acceptance_rate: (0.7 + Math.random() * 0.25).toFixed(2),
      completion_rate: (0.85 + Math.random() * 0.15).toFixed(2),
      online_hours: (6 + Math.random() * 4).toFixed(1),
      active_hours: (4 + Math.random() * 3).toFixed(1),
      miles_driven: (150 + Math.random() * 100).toFixed(1),
      last_updated: new Date().toISOString(),
    };
  }

  private static getBaseEarningsForPlatform(platform: string) {
    const earningsMap = {
      'doordash': { daily: 120, weekly: 840, monthly: 3600 },
      'uber': { daily: 140, weekly: 980, monthly: 4200 },
      'amazon_flex': { daily: 160, weekly: 1120, monthly: 4800 },
      'lyft': { daily: 110, weekly: 770, monthly: 3300 },
      'instacart': { daily: 95, weekly: 665, monthly: 2850 },
    };

    return earningsMap[platform] || { daily: 100, weekly: 700, monthly: 3000 };
  }

  private static applyVariance(base: number, variance: number): number {
    const factor = 1 + (Math.random() - 0.5) * 2 * variance;
    return Math.round(base * factor * 100) / 100;
  }

  private static generateAccountId(platform: string): string {
    const prefix = platform.substring(0, 3).toUpperCase();
    const suffix = Math.random().toString(36).substr(2, 9).toUpperCase();
    return `${prefix}-${suffix}`;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}