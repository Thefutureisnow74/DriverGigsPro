import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface UserProfile {
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  gigGoals?: string; // JSON string containing questionnaire data
  bio?: string;
  vehicleInfo?: any; // Vehicle data
}

interface Questionnaire {
  primaryGoal?: string;
  incomeTarget?: string;
  schedulePreferences?: string[];
  industryInterests?: string[];
  vehicleTypes?: string[];
  distancePreference?: string;
}

interface GigRecommendation {
  name: string;
  type: string;
  pay: string;
  reason: string;
  priority: "High" | "Medium" | "Low";
  signupUrl: string;
  estimatedOnboardingTime: string;
  requirements: string;
  urgentHiring: boolean;
  autoApplyReady: boolean;
  easySignup: boolean;
}

export class OpenAIGigRecommendationService {
  async generatePersonalizedRecommendations(
    userProfile: UserProfile,
    activeCompanyNames: string[]
  ): Promise<GigRecommendation[]> {
    try {
      // Parse questionnaire data
      let questionnaire: Questionnaire = {};
      if (userProfile.gigGoals) {
        try {
          questionnaire = JSON.parse(userProfile.gigGoals);
        } catch (error) {
          console.error("Error parsing gigGoals:", error);
        }
      }

      // Build user context for AI
      const userContext = this.buildUserContext(userProfile, questionnaire);
      
      // Create the AI prompt
      const prompt = this.createRecommendationPrompt(userContext, activeCompanyNames);

      // Get AI recommendations
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert gig economy advisor with deep knowledge of delivery, rideshare, and courier opportunities. Provide personalized recommendations based on user profiles and preferences."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 3000
      });

      const aiResponse = JSON.parse(response.choices[0].message.content || "{}");
      
      // Validate and format the response
      return this.formatRecommendations(aiResponse.recommendations || []);
      
    } catch (error) {
      console.error("Error generating AI recommendations:", error);
      // Fallback to default recommendations if AI fails
      return this.getFallbackRecommendations(activeCompanyNames);
    }
  }

  private buildUserContext(userProfile: UserProfile, questionnaire: Questionnaire): string {
    const context = [];
    
    // Basic profile info
    if (userProfile.firstName) {
      context.push(`Name: ${userProfile.firstName} ${userProfile.lastName || ''}`);
    }
    
    if (userProfile.city && userProfile.state) {
      context.push(`Location: ${userProfile.city}, ${userProfile.state}`);
    }
    
    if (userProfile.bio) {
      context.push(`Background: ${userProfile.bio}`);
    }

    // Questionnaire preferences
    if (questionnaire.primaryGoal) {
      context.push(`Primary Goal: ${questionnaire.primaryGoal}`);
    }
    
    if (questionnaire.incomeTarget) {
      context.push(`Income Target: ${questionnaire.incomeTarget}`);
    }
    
    if (questionnaire.schedulePreferences?.length) {
      context.push(`Schedule Preferences: ${questionnaire.schedulePreferences.join(', ')}`);
    }
    
    if (questionnaire.industryInterests?.length) {
      context.push(`Industry Interests: ${questionnaire.industryInterests.join(', ')}`);
    }
    
    if (questionnaire.vehicleTypes?.length) {
      context.push(`Vehicle Types: ${questionnaire.vehicleTypes.join(', ')}`);
    }
    
    if (questionnaire.distancePreference) {
      context.push(`Distance Preference: ${questionnaire.distancePreference}`);
    }

    return context.join('\n');
  }

  private createRecommendationPrompt(userContext: string, activeCompanyNames: string[]): string {
    return `
Based on the following user profile, recommend 5 personalized gig economy opportunities that match their preferences and situation:

USER PROFILE:
${userContext}

COMPANIES TO EXCLUDE (user is already active with these):
${activeCompanyNames.filter(name => name && typeof name === 'string').join(', ')}

REQUIREMENTS:
1. Recommend exactly 5 gig opportunities
2. Focus on real, well-known gig economy platforms
3. Match recommendations to user's location, vehicle type, and preferences
4. Consider their income targets and schedule flexibility
5. Prioritize companies with quick onboarding if user seems time-sensitive
6. Include diverse types of gigs (delivery, rideshare, specialized services)

RESPONSE FORMAT:
Return a JSON object with this exact structure:
{
  "recommendations": [
    {
      "name": "Company Name",
      "type": "Service Type (e.g., Food Delivery, Package Delivery, Rideshare)",
      "pay": "Pay range (e.g., $15-25/hour + tips)",
      "reason": "Why this matches the user (2-3 sentences max)",
      "priority": "High|Medium|Low",
      "signupUrl": "https://actual-signup-url.com",
      "estimatedOnboardingTime": "Time estimate (e.g., Same day, 1-2 days, 1 week)",
      "requirements": "Brief requirements summary",
      "urgentHiring": true/false,
      "autoApplyReady": true/false,
      "easySignup": true/false
    }
  ]
}

Make sure all recommendations are relevant to the user's profile and exclude companies they're already working with.
    `;
  }

  private formatRecommendations(recommendations: any[]): GigRecommendation[] {
    return recommendations
      .filter(rec => rec && rec.name && rec.type)
      .slice(0, 5)
      .map(rec => ({
        name: rec.name || "Unknown Company",
        type: rec.type || "Gig Work",
        pay: rec.pay || "Competitive rates",
        reason: rec.reason || "Good fit for your profile",
        priority: this.validatePriority(rec.priority),
        signupUrl: rec.signupUrl || "#",
        estimatedOnboardingTime: rec.estimatedOnboardingTime || "1-3 days",
        requirements: rec.requirements || "Standard requirements apply",
        urgentHiring: Boolean(rec.urgentHiring),
        autoApplyReady: Boolean(rec.autoApplyReady),
        easySignup: Boolean(rec.easySignup)
      }));
  }

  private validatePriority(priority: string): "High" | "Medium" | "Low" {
    const validPriorities = ["High", "Medium", "Low"];
    return validPriorities.includes(priority) ? priority as "High" | "Medium" | "Low" : "Medium";
  }

  private getFallbackRecommendations(activeCompanyNames: string[]): GigRecommendation[] {
    const fallbackRecs = [
      {
        name: "DoorDash",
        type: "Food Delivery",
        pay: "$16-25/hour + tips",
        reason: "Largest food delivery platform with consistent demand",
        priority: "High" as const,
        signupUrl: "https://www.doordash.com/dasher/signup/",
        estimatedOnboardingTime: "Same day",
        requirements: "Background check, insulated bag",
        urgentHiring: true,
        autoApplyReady: true,
        easySignup: true
      },
      {
        name: "Uber Eats",
        type: "Food Delivery",
        pay: "$12-20/hour + tips",
        reason: "Flexible scheduling with high demand periods",
        priority: "High" as const,
        signupUrl: "https://www.uber.com/us/en/deliver/",
        estimatedOnboardingTime: "1-2 days",
        requirements: "Background check, vehicle verification",
        urgentHiring: true,
        autoApplyReady: false,
        easySignup: true
      },
      {
        name: "Amazon Flex",
        type: "Package Delivery",
        pay: "$18-25/hour",
        reason: "Set schedule blocks, reliable pay rates",
        priority: "Medium" as const,
        signupUrl: "https://flex.amazon.com/",
        estimatedOnboardingTime: "3-5 days",
        requirements: "Background check, vehicle inspection",
        urgentHiring: false,
        autoApplyReady: false,
        easySignup: false
      },
      {
        name: "Instacart",
        type: "Grocery Shopping",
        pay: "$15-22/hour + tips",
        reason: "Growing demand for grocery delivery services",
        priority: "Medium" as const,
        signupUrl: "https://shoppers.instacart.com/",
        estimatedOnboardingTime: "2-3 days",
        requirements: "Background check, smartphone",
        urgentHiring: false,
        autoApplyReady: true,
        easySignup: true
      },
      {
        name: "Roadie",
        type: "Package Delivery",
        pay: "$8-50/hour",
        reason: "On-the-way deliveries, flexible scheduling",
        priority: "Low" as const,
        signupUrl: "https://www.roadie.com/driver/",
        estimatedOnboardingTime: "1-2 days",
        requirements: "Background check, vehicle verification",
        urgentHiring: false,
        autoApplyReady: true,
        easySignup: true
      }
    ];

    // Filter out companies user is already active with
    const activeNamesNormalized = activeCompanyNames
      .filter(name => name && typeof name === 'string')
      .map(name => name.toLowerCase().replace(/\s/g, ''));

    return fallbackRecs.filter(rec => {
      const recNameNormalized = rec.name.toLowerCase().replace(/\s/g, '');
      return !activeNamesNormalized.some(activeName => 
        activeName === recNameNormalized ||
        activeName.includes(recNameNormalized) ||
        recNameNormalized.includes(activeName)
      );
    }).slice(0, 5);
  }
}

export const gigRecommendationService = new OpenAIGigRecommendationService();