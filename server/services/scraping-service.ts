import puppeteer from 'puppeteer';

export class ScrapingService {
  private browser: any = null;

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
    return this.browser;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async scrapeDoorDashData(email: string, password: string) {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      // Navigate to DoorDash login page
      await page.goto('https://dasher.doordash.com/login', { waitUntil: 'networkidle2' });

      // Login process
      await page.type('input[name="email"]', email);
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]');

      // Wait for dashboard to load
      await page.waitForNavigation({ waitUntil: 'networkidle2' });

      // Scrape earnings data
      const earningsData = await page.evaluate(() => {
        // This would contain actual scraping logic for DoorDash dashboard
        // For security and ToS reasons, this is a simplified example
        return {
          dailyEarnings: 0,
          weeklyEarnings: 0,
          monthlyEarnings: 0,
          deliveryCount: 0,
          rating: 0,
          completionRate: 0,
        };
      });

      return earningsData;
    } catch (error) {
      console.error('DoorDash scraping error:', error);
      throw new Error('Failed to scrape DoorDash data');
    } finally {
      await page.close();
    }
  }

  async scrapeUberData(email: string, password: string) {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      await page.goto('https://partners.uber.com/login', { waitUntil: 'networkidle2' });

      await page.type('input[name="email"]', email);
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]');

      await page.waitForNavigation({ waitUntil: 'networkidle2' });

      const earningsData = await page.evaluate(() => {
        return {
          dailyEarnings: 0,
          weeklyEarnings: 0,
          monthlyEarnings: 0,
          tripCount: 0,
          rating: 0,
          acceptanceRate: 0,
        };
      });

      return earningsData;
    } catch (error) {
      console.error('Uber scraping error:', error);
      throw new Error('Failed to scrape Uber data');
    } finally {
      await page.close();
    }
  }

  async scrapeAmazonFlexData(email: string, password: string) {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      await page.goto('https://flex.amazon.com/login', { waitUntil: 'networkidle2' });

      await page.type('input[name="email"]', email);
      await page.type('input[name="password"]', password);
      await page.click('button[type="submit"]');

      await page.waitForNavigation({ waitUntil: 'networkidle2' });

      const earningsData = await page.evaluate(() => {
        return {
          dailyEarnings: 0,
          weeklyEarnings: 0,
          monthlyEarnings: 0,
          deliveryCount: 0,
          rating: 0,
          blocksCompleted: 0,
        };
      });

      return earningsData;
    } catch (error) {
      console.error('Amazon Flex scraping error:', error);
      throw new Error('Failed to scrape Amazon Flex data');
    } finally {
      await page.close();
    }
  }

  // Generic scraping method for platforms without specific APIs
  async scrapeGenericPlatform(url: string, email: string, password: string, selectors: any) {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Login
      if (selectors.emailInput && selectors.passwordInput && selectors.submitButton) {
        await page.type(selectors.emailInput, email);
        await page.type(selectors.passwordInput, password);
        await page.click(selectors.submitButton);
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
      }

      // Extract data based on provided selectors
      const data = await page.evaluate((sel) => {
        const result: any = {};
        
        if (sel.earningsSelector) {
          const earningsElement = document.querySelector(sel.earningsSelector);
          result.earnings = earningsElement ? earningsElement.textContent : null;
        }

        if (sel.tripCountSelector) {
          const tripElement = document.querySelector(sel.tripCountSelector);
          result.tripCount = tripElement ? tripElement.textContent : null;
        }

        if (sel.ratingSelector) {
          const ratingElement = document.querySelector(sel.ratingSelector);
          result.rating = ratingElement ? ratingElement.textContent : null;
        }

        return result;
      }, selectors);

      return data;
    } catch (error) {
      console.error('Generic scraping error:', error);
      throw new Error('Failed to scrape platform data');
    } finally {
      await page.close();
    }
  }

  // Cleanup method to be called when service is no longer needed
  async cleanup() {
    await this.closeBrowser();
  }
}