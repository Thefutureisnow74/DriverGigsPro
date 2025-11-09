import { Configuration, PlaidApi, PlaidEnvironments, TransactionsGetResponse, AccountsGetResponse } from 'plaid';
import { EncryptionService } from '../encryption';

export class PlaidService {
  private client: PlaidApi;

  constructor() {
    const configuration = new Configuration({
      basePath: process.env.PLAID_ENV === 'production' ? PlaidEnvironments.production : PlaidEnvironments.sandbox,
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
          'PLAID-SECRET': process.env.PLAID_SECRET!,
        },
      },
    });
    this.client = new PlaidApi(configuration);
  }

  async createLinkToken(userId: string) {
    try {
      const request = {
        user: {
          client_user_id: userId,
        },
        client_name: 'Gig Driver Platform',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en',
      };

      const response = await this.client.linkTokenCreate(request);
      return response.data.link_token;
    } catch (error) {
      console.error('Error creating Plaid link token:', error);
      throw new Error('Failed to create link token');
    }
  }

  async exchangePublicToken(publicToken: string) {
    try {
      const response = await this.client.linkTokenExchange({
        public_token: publicToken,
      });

      return {
        accessToken: response.data.access_token,
        itemId: response.data.item_id,
      };
    } catch (error) {
      console.error('Error exchanging public token:', error);
      throw new Error('Failed to exchange public token');
    }
  }

  async getAccounts(accessToken: string): Promise<AccountsGetResponse> {
    try {
      const decryptedToken = EncryptionService.decrypt(accessToken);
      const response = await this.client.accountsGet({
        access_token: decryptedToken,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw new Error('Failed to fetch accounts');
    }
  }

  async getTransactions(accessToken: string, startDate: string, endDate: string): Promise<TransactionsGetResponse> {
    try {
      const decryptedToken = EncryptionService.decrypt(accessToken);
      const response = await this.client.transactionsGet({
        access_token: decryptedToken,
        start_date: startDate,
        end_date: endDate,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  }

  async analyzeGigEarnings(transactions: any[], companyNames: string[]) {
    const gigTransactions = transactions.filter(tx => {
      const merchantName = tx.merchant_name?.toLowerCase() || '';
      const description = tx.account_owner?.toLowerCase() || '';
      
      return companyNames.some(company => 
        merchantName.includes(company.toLowerCase()) || 
        description.includes(company.toLowerCase())
      );
    });

    const earningsByCompany: Record<string, any> = {};

    for (const tx of gigTransactions) {
      const company = this.identifyGigCompany(tx, companyNames);
      if (company && tx.amount < 0) { // Negative amounts are deposits in Plaid
        if (!earningsByCompany[company]) {
          earningsByCompany[company] = {
            companyName: company,
            totalEarnings: 0,
            transactionCount: 0,
            transactions: [],
            lastTransaction: null,
          };
        }

        const earnings = Math.abs(tx.amount);
        earningsByCompany[company].totalEarnings += earnings;
        earningsByCompany[company].transactionCount += 1;
        earningsByCompany[company].transactions.push({
          date: tx.date,
          amount: earnings,
          description: tx.name,
          accountId: tx.account_id,
        });

        if (!earningsByCompany[company].lastTransaction || 
            tx.date > earningsByCompany[company].lastTransaction) {
          earningsByCompany[company].lastTransaction = tx.date;
        }
      }
    }

    return earningsByCompany;
  }

  private identifyGigCompany(transaction: any, companyNames: string[]): string | null {
    const merchantName = transaction.merchant_name?.toLowerCase() || '';
    const description = transaction.name?.toLowerCase() || '';
    const accountOwner = transaction.account_owner?.toLowerCase() || '';

    for (const company of companyNames) {
      const companyLower = company.toLowerCase();
      if (merchantName.includes(companyLower) || 
          description.includes(companyLower) ||
          accountOwner.includes(companyLower)) {
        return company;
      }
    }

    // Additional pattern matching for common gig platforms
    const gigPatterns = {
      'doordash': ['doordash', 'door dash', 'dd pay'],
      'uber': ['uber', 'uber technologies'],
      'lyft': ['lyft'],
      'instacart': ['instacart', 'maplebear'],
      'amazon': ['amazon flex', 'amazon logistics'],
      'grubhub': ['grubhub'],
    };

    for (const [platform, patterns] of Object.entries(gigPatterns)) {
      if (patterns.some(pattern => 
          merchantName.includes(pattern) || 
          description.includes(pattern) ||
          accountOwner.includes(pattern))) {
        return platform;
      }
    }

    return null;
  }

  async calculateEarningsMetrics(earningsData: any) {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dailyEarnings = this.filterTransactionsByDate(earningsData.transactions, now, now);
    const weeklyEarnings = this.filterTransactionsByDate(earningsData.transactions, oneWeekAgo, now);
    const monthlyEarnings = this.filterTransactionsByDate(earningsData.transactions, oneMonthAgo, now);

    return {
      dailyEarnings: this.sumTransactions(dailyEarnings),
      weeklyEarnings: this.sumTransactions(weeklyEarnings),
      monthlyEarnings: this.sumTransactions(monthlyEarnings),
      totalTransactions: earningsData.transactionCount,
      lastEarningDate: earningsData.lastTransaction,
    };
  }

  private filterTransactionsByDate(transactions: any[], startDate: Date, endDate: Date) {
    return transactions.filter((tx: any) => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= endDate;
    });
  }

  private sumTransactions(transactions: any[]) {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0);
  }
}