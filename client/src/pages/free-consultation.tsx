import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Star, 
  CheckCircle,
  Users,
  Trophy,
  Target,
  Zap,
  ArrowRight,
  Calendar,
  PhoneCall,
  MessageSquare,
  Gift
} from "lucide-react";
import { useState } from "react";

const benefits = [
  {
    title: "Master Multi-App Stacking Strategies",
    description: "Learn how to run DoorDash, Uber Eats, Grubhub, and Instacart simultaneously for maximum hourly earnings",
    icon: TrendingUp,
    earning: "+$1,500-3,000/month"
  },
  {
    title: "Optimize Peak Hour & Zone Selection", 
    description: "Discover the best times, locations, and app combinations to consistently earn $30-40/hour",
    icon: Zap,
    earning: "Double your hourly rate"
  },
  {
    title: "Transition to Independent Courier Work",
    description: "Once you've mastered app stacking, learn how to land $25-45/hour independent courier contracts",
    icon: Target,
    earning: "$4,000-8,000/month"
  },
  {
    title: "Build Your Own Courier Business",
    description: "Get step-by-step guidance on forming your courier business and scaling to multiple drivers",
    icon: Trophy,
    earning: "$10,000-15,000/month"
  }
];

const testimonials = [
  {
    name: "Sarah M.", 
    role: "Multi-App Stacker",
    quote: "Was making $18/hour on DoorDash alone. Now I stack 4 apps and consistently earn $35/hour. The zone strategies work!",
    earnings: "$35/hour average"
  },
  {
    name: "Marcus T.",
    role: "Independent Courier",
    quote: "Started with app stacking, then transitioned to my own courier routes. Went from $800/week to $1,800/week!",
    earnings: "350% increase"
  },
  {
    name: "David L.",
    role: "Business Owner",
    quote: "Mastered app stacking first, then built my courier business. Now have 3 drivers and pulling in $15K/month.",
    earnings: "$180K/year"
  }
];

const urgencyFactors = [
  "Holiday season approaching - peak app stacking season for maximum earnings (Oct-Jan)",
  "New drivers entering your market daily - secure your optimal zones before saturation",
  "Limited consultation slots available this week - only 12 spots remaining",
  "Independent courier opportunities filling fast - early adopters already earning $40+/hour"
];

export default function FreeConsultation() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    currentSituation: '',
    goals: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-6 bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-2xl border-2 border-orange-200">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-4">
          <Phone className="text-white text-3xl animate-pulse" />
        </div>
        <Badge className="bg-red-600 text-white text-lg px-4 py-2 animate-bounce">
          🔥 LIMITED TIME: FREE 15-MINUTE CONSULTATION
        </Badge>
        <h1 className="text-5xl font-bold text-gray-800">
          Already Making Money with Gig Apps? <span className="text-green-600">Let's Stack More Income!</span>
        </h1>
        <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
          You're already earning with DoorDash, Uber, and other apps. Now discover how to 
          <span className="font-bold text-blue-600"> stack multiple apps strategically</span> for immediate income boosts, 
          then transition to <span className="font-bold text-green-600">$4,000-8,000/month</span> 
          Independent Courier opportunities
        </p>
        
        <div className="flex justify-center items-center space-x-8 text-2xl font-bold">
          <div className="text-red-600">
            <span className="line-through">$15-20/hour</span>
            <p className="text-sm text-gray-600">Traditional Gig Apps</p>
          </div>
          <ArrowRight className="text-4xl text-orange-500" />
          <div className="text-green-600">
            <span>$25-45/hour</span>
            <p className="text-sm text-gray-600">Independent Courier Work</p>
          </div>
        </div>
      </div>

      {/* Urgency Section */}
      <Card className="bg-gradient-to-r from-red-100 to-orange-100 border-2 border-red-300">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-red-700 flex items-center justify-center space-x-2">
            <Clock className="animate-spin" />
            <span>Don't Wait - Every Day You Delay Costs You Money!</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urgencyFactors.map((factor, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  !
                </div>
                <p className="text-gray-700 font-medium">{factor}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benefits Section */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          What You'll Learn in Your FREE Consultation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-green-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Icon className="text-white text-xl" />
                      </div>
                      <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    </div>
                    <Badge className="bg-green-600 text-white font-bold">
                      {benefit.earning}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Testimonials */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Real Results from Real Drivers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                  <Badge className="bg-green-600 text-white">
                    {testimonial.earnings}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main CTA Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card className="border-2 border-orange-300">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl text-center">
              📞 Schedule Your FREE 15-Minute Consultation NOW
            </CardTitle>
            <p className="text-center text-orange-100">
              Normally $75 - FREE for active drivers ready to stack apps
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">First Name *</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                  className="border-2 border-gray-300 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Name *</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Smith"
                  className="border-2 border-gray-300 focus:border-orange-500"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Phone Number *</label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className="border-2 border-gray-300 focus:border-orange-500"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Email Address *</label>
              <Input
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@email.com"
                className="border-2 border-gray-300 focus:border-orange-500"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Current Driving Situation</label>
              <Textarea
                value={formData.currentSituation}
                onChange={(e) => handleInputChange('currentSituation', e.target.value)}
                placeholder="What gig apps are you currently using? How much are you earning per week?"
                className="border-2 border-gray-300 focus:border-orange-500"
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Income Goals</label>
              <Textarea
                value={formData.goals}
                onChange={(e) => handleInputChange('goals', e.target.value)}
                placeholder="How much would you like to earn per month? What are your financial goals?"
                className="border-2 border-gray-300 focus:border-orange-500"
                rows={3}
              />
            </div>
            
            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 text-lg animate-pulse"
            >
              <PhoneCall className="mr-2" />
              GET MY FREE CONSULTATION NOW
            </Button>
            
            <p className="text-xs text-gray-600 text-center">
              ✓ 100% Free ✓ No Obligations ✓ Results Guaranteed or Money Back
            </p>
          </CardContent>
        </Card>

        {/* Why Call Now */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
            <CardHeader>
              <CardTitle className="text-xl text-green-700 flex items-center space-x-2">
                <Gift className="text-green-600" />
                <span>What You Get in This Call (Value: $1,500+)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Multi-app stacking blueprint for your specific market and vehicle type",
                "Peak hour and zone optimization strategies for immediate income boost",
                "App rotation techniques to maximize surge pricing and bonuses", 
                "Transition roadmap from app stacking to independent courier opportunities",
                "Access to our private contractor network and high-paying route database",
                "30-day money-back guarantee on all paid services"
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="text-green-600 w-6 h-6 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 font-medium">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300">
            <CardHeader>
              <CardTitle className="text-xl text-red-700 text-center">
                ⚠️ WARNING: Don't Make These Costly Mistakes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Staying trapped in low-paying gig apps while others earn 3x more",
                "Missing the holiday season peak earning period (Oct-Jan)",
                "Not understanding the tax benefits of business ownership",
                "Using the wrong vehicle for courier work (costly mistake!)",
                "Trying to figure it out alone instead of learning from experts"
              ].map((mistake, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    ✗
                  </div>
                  <p className="text-gray-700">{mistake}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Final CTA */}
      <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-center">
        <CardContent className="py-12 space-y-6">
          <h2 className="text-4xl font-bold">Ready to Stack Apps and Scale Your Income?</h2>
          <p className="text-2xl text-orange-100 max-w-3xl mx-auto">
            You're already earning with gig apps. Now let's optimize your strategy and show you the path to $4,000-8,000/month.
          </p>
          <div className="space-y-4">
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-12 py-6 text-xl"
            >
              <Phone className="mr-3 text-2xl" />
              CALL US NOW: (555) 123-DRIVE
            </Button>
            <p className="text-lg text-orange-200">
              📞 Available 7 days a week • 8 AM - 8 PM EST
            </p>
            <p className="text-sm text-orange-300">
              Or fill out the form above and we'll call you within 2 hours
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Social Proof Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="space-y-2">
          <div className="text-3xl font-bold text-green-600">2,847</div>
          <p className="text-gray-600">Drivers Helped</p>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-blue-600">$18.5M</div>
          <p className="text-gray-600">Extra Income Generated</p>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-purple-600">96%</div>
          <p className="text-gray-600">Success Rate</p>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-orange-600">4.9/5</div>
          <p className="text-gray-600">Client Rating</p>
        </div>
      </div>
    </div>
  );
}