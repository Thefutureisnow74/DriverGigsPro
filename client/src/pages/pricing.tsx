import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Infinity } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Free Plan",
    price: "$0",
    period: "forever",
    description: "Get started with basic gig work tools",
    icon: Star,
    gradient: "from-green-500 to-teal-500",
    popular: false,
    features: [
      "Access to TEN Driver Opportunities",
      "Complete Fleet Management System",
      "Advanced Job Tracking & Analytics",
      "Business Formation Tools & Guides",
      "Document Management & Storage",
      "Priority Feature Requests",
      "No Monthly Fees - Get Lifetime Access Now"
    ]
  },
  {
    name: "Monthly Plan",
    price: "$15",
    period: "per month",
    description: "Everything you need for growing gig work success",
    icon: Zap,
    gradient: "from-blue-500 to-indigo-500",
    popular: false,
    features: [
      "Everything forever - no monthly fees",
      "Access to 50 Driver Opportunities",
      "Complete Fleet Management System",
      "Advanced Job Tracking & Analytics",
      "Driver Gigs Academy & Training Courses",
      "Business Formation Tools & Guides",
      "Document Management & Storage",
      "Expense Tracking & Tax Optimization",
      "Calendar Integration & Scheduling",
      "Affiliate Program & Referral System",
      "Money For You AI Savings Recommendations",
      "Priority Feature Requests",
      "Exclusive Community Access",
      "No Monthly Fees - Pay Once, Own Forever"
    ]
  },
  {
    name: "Lifetime Access",
    price: "$497",
    period: "one time",
    description: "Everything forever - no monthly fees",
    icon: Crown,
    gradient: "from-purple-600 to-pink-600",
    popular: true,
    features: [
      "Everything forever - no monthly fees",
      "Access to HUNDREDS of Driver Opportunities",
      "Complete Fleet Management System",
      "Advanced Job Tracking & Analytics",
      "Driver Gigs Academy & Training Courses",
      "Business Formation Tools & Guides",
      "Document Management & Storage",
      "Expense Tracking & Tax Optimization",
      "Calendar Integration & Scheduling",
      "Personal Coaching & Success Consultations",
      "Affiliate Program & Referral System",
      "Money For You AI Savings Recommendations",
      "Priority Feature Requests",
      "Exclusive Community Access",
      "No Monthly Fees - Pay Once, Own Forever",
      "Driver Gig Academy - full access"
    ]
  }
];

export default function Pricing() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handlePlanSelect = (planName: string) => {
    if (planName === 'Free Plan') {
      toast({
        title: "Free Plan Activated!",
        description: "You now have access to all free features. Start exploring!",
      });
      setLocation('/dashboard');
    } else if (planName === 'Monthly Plan') {
      toast({
        title: "Monthly Plan Selected",
        description: "Redirecting you to checkout...",
      });
      // TODO: Integrate Stripe checkout for monthly plan
      setTimeout(() => {
        toast({
          title: "Coming Soon",
          description: "Payment integration is being set up. Please contact support.",
        });
      }, 1500);
    } else if (planName === 'Lifetime Access') {
      toast({
        title: "Lifetime Access Selected",
        description: "Redirecting you to checkout...",
      });
      // TODO: Integrate Stripe checkout for lifetime plan
      setTimeout(() => {
        toast({
          title: "Coming Soon",
          description: "Payment integration is being set up. Please contact support.",
        });
      }, 1500);
    }
  };

  const handleFreeTrial = () => {
    toast({
      title: "Start Your Free Trial",
      description: "Sign up to start your 14-day free trial!",
    });
    setLocation('/dashboard');
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Choose Your Plan</h1>
          <p className="text-gray-600 mt-2">Select the perfect plan for your gig work success journey</p>
        </div>
      </header>

      {/* Pricing Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Three-Tier Plan Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              
              return (
                <Card 
                  key={index}
                  className={`card-hover relative overflow-hidden shadow-2xl ${
                    plan.popular ? 'ring-2 ring-purple-500 scale-105' : 'ring-1 ring-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm font-semibold">
                        ✨ Best Value - Limited Time
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                    <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="text-white text-2xl" />
                    </div>
                    
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      {plan.name}
                    </CardTitle>
                    
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600 ml-2 text-lg">/{plan.period}</span>
                    </div>
                    
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="px-6 pb-6">
                    <ul className="space-y-2 mb-8 min-h-[300px]">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                            <Check className="text-white w-2.5 h-2.5" />
                          </div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={() => handlePlanSelect(plan.name)}
                      data-testid={`button-select-${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl hover:scale-105'
                          : `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-lg hover:scale-102`
                      }`}
                    >
                      {plan.name === 'Free Plan' ? 'Get Started Free' : 
                       plan.name === 'Monthly Plan' ? 'Start Monthly Plan' : 
                       'Get Lifetime Access Now'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="card-hover">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Can I change plans anytime?</h3>
                  <p className="text-gray-600">Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately.</p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Is there a free trial?</h3>
                  <p className="text-gray-600">Our Free plan is available forever! Try Pro features with a 14-day free trial, no credit card required.</p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">What payment methods do you accept?</h3>
                  <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Do you offer refunds?</h3>
                  <p className="text-gray-600">Yes! We offer a 30-day money-back guarantee for all paid plans, no questions asked.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4">Ready to boost your gig work income?</h2>
                <p className="text-xl mb-8 opacity-90">Join thousands of drivers already using our platform</p>
                <Button 
                  onClick={handleFreeTrial}
                  data-testid="button-start-free-trial"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                >
                  Start Your Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
