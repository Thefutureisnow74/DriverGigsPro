import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Shield, 
  Clock,
  CheckCircle,
  Star,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  BarChart3,
  Zap,
  Trophy,
  Target
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Static Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 overflow-hidden">
        {/* Navigation */}
        <nav className="relative z-20 flex items-center justify-between p-6 lg:px-8 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DriverPro Elite
              </span>
              <div className="text-xs text-blue-600">Professional Gig Platform</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/auth'}
              className="text-gray-700 hover:bg-gray-100"
            >
              Driver Sign In
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/auth?signup=true'}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Sign Up Free
            </Button>
            <Button 
              onClick={() => window.location.href = '/auth?signup=true'}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 shadow-lg shadow-blue-500/25"
            >
              Start Earning Today
            </Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <div className="flex items-center space-x-2 mb-6">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 text-sm font-semibold">
                🚀 BETA ACCESS
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 px-3 py-1">
                Free During Beta
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-300 px-3 py-1">
                500+ Companies
              </Badge>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
              Turn Your Car Into a 
              <span className="block text-transparent bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text">
                Money Machine
              </span>
            </h1>
            
            <p className="mt-8 text-xl leading-8 text-gray-700">
              Stop driving for pennies. Our AI-powered platform connects you with the highest-paying gig opportunities, 
              tracks your earnings across platforms, and maximizes your income potential.
            </p>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">
                🎯 <strong>BETA Program:</strong> Get free access to all premium features while we perfect the platform. 
                Your feedback helps us build the ultimate driver success tool!
              </p>
            </div>
            
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                No monthly fees
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                AI earnings optimizer
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                500+ verified companies
              </div>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/auth'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-4 text-lg shadow-xl shadow-blue-500/25 transform hover:scale-105 transition-all w-full sm:w-auto"
              >
                <Zap className="w-5 h-5 mr-2" />
                Join BETA - Free Access
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = '/auth'}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg w-full sm:w-auto"
              >
                See How It Works
              </Button>
            </div>
            
            <div className="mt-8 text-center sm:text-left">
              <p className="text-sm text-gray-600">
                Join our exclusive BETA program - Limited spots available
              </p>
            </div>
          </div>
          
          {/* Hero Stats/Features */}
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-100 backdrop-blur-md border-green-200 hover:border-green-300 transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-green-100 rounded-full">
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900">$3,000+</div>
                        <div className="text-sm text-green-700">Monthly Potential</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 backdrop-blur-md border-blue-200 hover:border-blue-300 transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Target className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900">532</div>
                        <div className="text-sm text-blue-700">Verified Companies</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 backdrop-blur-md border-purple-200 hover:border-purple-300 transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <BarChart3 className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900">AI</div>
                        <div className="text-sm text-purple-700">Smart Optimization</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-50 to-red-100 backdrop-blur-md border-orange-200 hover:border-orange-300 transition-all duration-300 hover:transform hover:scale-105 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-orange-100 rounded-full">
                        <Trophy className="h-8 w-8 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900">Free</div>
                        <div className="text-sm text-orange-700">Forever Access</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Testimonial Card */}
              <Card className="mt-8 bg-gray-50 backdrop-blur-md border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-lg">M</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-700 italic">
                        "I went from making $800/week to $1,200+ using this platform. The AI recommendations are spot-on!"
                      </p>
                      <div className="mt-2 flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">- Maria, DoorDash Driver</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">
              BETA Features - Free Access
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              The Complete Driver Success Platform
            </p>
            <p className="mt-6 text-xl leading-8 text-gray-700">
              Test all premium features during our BETA program. Help us build the perfect platform 
              while getting free access to everything needed to maximize your driving income.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
              
              <Card className="bg-gradient-to-br from-green-50 to-emerald-100 backdrop-blur-md border-green-200 hover:border-green-300 transition-all duration-300 group shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-all">
                      <MapPin className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Smart Opportunity Finder</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Our AI scans 532 verified companies daily to find the highest-paying opportunities in your area. 
                    Get instant alerts for premium gigs before your competition.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 backdrop-blur-md border-blue-200 hover:border-blue-300 transition-all duration-300 group shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-all">
                      <Truck className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Complete Fleet Manager</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Track vehicle expenses, maintenance schedules, insurance dates, and loan payments. 
                    Never miss a deadline that could cost you money.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 backdrop-blur-md border-purple-200 hover:border-purple-300 transition-all duration-300 group shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-all">
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">AI Earnings Optimizer</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Get personalized recommendations on which platforms to focus on, best driving times, 
                    and strategies to increase your hourly rate by up to 40%.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-red-100 backdrop-blur-md border-orange-200 hover:border-orange-300 transition-all duration-300 group shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-all">
                      <CreditCard className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Smart Tax Tracking</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Automatically track mileage, expenses, and generate IRS-compliant reports. 
                    Maximize your tax deductions and keep more of what you earn.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 backdrop-blur-md border-yellow-200 hover:border-yellow-300 transition-all duration-300 group shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-yellow-100 rounded-full group-hover:bg-yellow-200 transition-all">
                      <FileText className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Business Setup Wizard</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Step-by-step guidance to form your LLC, get business insurance, and set up 
                    accounting systems that save thousands in taxes.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-teal-50 to-cyan-100 backdrop-blur-md border-teal-200 hover:border-teal-300 transition-all duration-300 group shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-teal-100 rounded-full group-hover:bg-teal-200 transition-all">
                      <Calendar className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Driver Academy</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    Access exclusive training courses, certification programs, and insider tips 
                    from top-earning drivers in your market.
                  </p>
                </CardContent>
              </Card>
              
            </div>
          </div>
        </div>
      </div>

      {/* Driver Success Stories */}
      <div className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-blue-600">
              BETA Tester Success Stories
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Early Users Are Seeing Results
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Success Story 1 */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 backdrop-blur-md border-green-200 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-700 text-lg italic mb-6">
                  "I increased my weekly earnings from $850 to $1,350 in just 3 weeks. The AI recommendations are incredible!"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">J</span>
                  </div>
                  <div>
                    <div className="text-gray-900 font-semibold">Jake Martinez</div>
                    <div className="text-green-700 text-sm">DoorDash + Uber Driver, Phoenix</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Success Story 2 */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 backdrop-blur-md border-blue-200 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-700 text-lg italic mb-6">
                  "The fleet management tools saved me $2,400 in vehicle expenses last year. This platform pays for itself!"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <div>
                    <div className="text-gray-900 font-semibold">Sarah Chen</div>
                    <div className="text-blue-700 text-sm">Rideshare + Delivery, Seattle</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Success Story 3 */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 backdrop-blur-md border-purple-200 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-700 text-lg italic mb-6">
                  "Found 12 new gig opportunities I never knew existed. Now I'm making $4,200/month consistently."
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <div>
                    <div className="text-gray-900 font-semibold">Marcus Johnson</div>
                    <div className="text-purple-700 text-sm">Multi-Platform Driver, Atlanta</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Ready to Join Our BETA Program?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-xl leading-8 text-orange-100">
              Get exclusive early access to all premium features. Help us build the ultimate driver platform while maximizing your earnings - completely free during BETA.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/auth'}
                className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-12 py-4 text-xl shadow-2xl transform hover:scale-105 transition-all w-full sm:w-auto"
              >
                <Zap className="w-6 h-6 mr-2" />
                Join BETA Program
              </Button>
            </div>
            
            <div className="mt-8 flex justify-center items-center space-x-8 text-orange-100">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-white mr-2" />
                Free During BETA
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-white mr-2" />
                No Credit Card Required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-white mr-2" />
                Exclusive Early Access
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  DriverPro Elite
                </span>
                <div className="text-xs text-blue-200">Professional Gig Platform</div>
              </div>
            </div>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-sm leading-5 text-gray-400">
              &copy; 2025 DriverPro Elite. Empowering drivers worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}