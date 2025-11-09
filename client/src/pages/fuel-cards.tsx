import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Fuel, 
  Plus, 
  Star, 
  ExternalLink, 
  Save, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Edit,
  Trash2,
  BarChart3,
  CreditCard,
  CheckCircle,
  Heart,
  Award,
  Building,
  Shield,
  Users,
  Zap
} from "lucide-react";

// Curated list of top fuel cards for gig drivers
const FEATURED_FUEL_CARDS = [
  {
    id: "upright-fuel",
    name: "Upright Fuel Card",
    rebateOffer: "Up to 5¢/gal",
    logo: "🚛",
    provider: "Upright",
    perks: ["✅ No PG", "✅ Reports to Business Credit", "🏁 Fleet Tracking", "💡 Good for New Biz"],
    description: "Best overall fuel card for independent contractors and small fleets with nationwide acceptance.",
    applyUrl: "https://uprightfuel.com",
    category: "Fleet"
  },
  {
    id: "racetrac-elite",
    name: "RaceTrac Elite Fuel Card",
    rebateOffer: "Up to 8¢/gal",
    logo: "🏁",
    provider: "RaceTrac",
    perks: ["✅ No Credit Check", "🏁 Regional Coverage", "💰 High Rebates", "⚡ Instant Approval"],
    description: "Premium rebates for drivers in RaceTrac coverage areas. Great for regional operations.",
    applyUrl: "https://racetrac.com/business",
    category: "Regional"
  },
  {
    id: "racetrac-universal",
    name: "RaceTrac Universal Fuel Card",
    rebateOffer: "Up to 3¢/gal",
    logo: "🌍",
    provider: "RaceTrac",
    perks: ["✅ Wide Network", "💡 Easy Setup", "📊 Online Reports", "🔄 Auto Rebates"],
    description: "Broader network acceptance with solid rebates and comprehensive reporting features.",
    applyUrl: "https://racetrac.com/universal",
    category: "Universal"
  },
  {
    id: "atob-fuel",
    name: "AtoB Fuel Card",
    rebateOffer: "Up to 6¢/gal",
    logo: "🎯",
    provider: "AtoB",
    perks: ["✅ No PG", "📱 Mobile App", "🔒 Fraud Protection", "💼 Business Credit"],
    description: "Modern fuel card platform with excellent mobile app and fraud protection for gig workers.",
    applyUrl: "https://atob.com",
    category: "Tech-Forward"
  },
  {
    id: "fuelman-deep-saver",
    name: "Fuelman Deep Saver Card",
    rebateOffer: "Up to 4¢/gal",
    logo: "⛽",
    provider: "Fuelman",
    perks: ["✅ Large Network", "💰 Deep Discounts", "📈 Volume Pricing", "🔧 Fleet Tools"],
    description: "Established fuel card with deep discounts and comprehensive fleet management tools.",
    applyUrl: "https://fuelman.com",
    category: "Established"
  },
  {
    id: "bp-business",
    name: "BP Business Solutions Card",
    rebateOffer: "Up to 3¢/gal",
    logo: "🟢",
    provider: "BP",
    perks: ["✅ BP Network", "🔄 Automatic Rebates", "📊 Detailed Reports", "⚡ Fast Approval"],
    description: "Direct from BP with excellent coverage at BP and Amoco stations nationwide.",
    applyUrl: "https://bp.com/business",
    category: "Brand-Specific"
  },
  {
    id: "exxonmobil-businesspro",
    name: "ExxonMobil BusinessPro",
    rebateOffer: "Up to 4¢/gal",
    logo: "🔴",
    provider: "ExxonMobil",
    perks: ["✅ Premium Locations", "💳 Business Credit", "🔒 Security Features", "📱 Mobile Access"],
    description: "Premium fuel card for ExxonMobil locations with strong business credit reporting.",
    applyUrl: "https://exxonmobil.com/business",
    category: "Premium"
  },
  {
    id: "wex-fleet",
    name: "WEX Fleet Card",
    rebateOffer: "Up to 5¢/gal",
    logo: "💼",
    provider: "WEX",
    perks: ["✅ Nationwide", "🏢 Enterprise Grade", "📊 Advanced Analytics", "🔧 Fleet Management"],
    description: "Industry-leading fleet card with comprehensive management tools and nationwide acceptance.",
    applyUrl: "https://wexinc.com",
    category: "Enterprise"
  },
  {
    id: "7eleven-fleet",
    name: "7-Eleven Fleet Card",
    rebateOffer: "Up to 3¢/gal",
    logo: "🟡",
    provider: "7-Eleven",
    perks: ["✅ Convenience Stores", "🍕 Food Purchases", "⏰ 24/7 Access", "🌃 Urban Coverage"],
    description: "Perfect for urban drivers with 24/7 access to fuel and convenience items.",
    applyUrl: "https://7-eleven.com/business",
    category: "Convenience"
  },
  {
    id: "shell-business",
    name: "Shell Business Fuel Card",
    rebateOffer: "Up to 4¢/gal",
    logo: "🐚",
    provider: "Shell",
    perks: ["✅ Shell Network", "⚡ Premium Fuel", "📊 Business Reports", "💳 Credit Building"],
    description: "Shell's business fuel card with access to premium fuel grades and business credit reporting.",
    applyUrl: "https://shell.com/business",
    category: "Premium"
  }
];

type SortOption = "name" | "rebate" | "provider" | "usage";

export default function FuelCards() {
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSpendModalOpen, setIsSpendModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("rebate");
  const [spendData, setSpendData] = useState({
    spendAmount: "",
    rebateEarned: "",
    recordDate: new Date().toISOString().split("T")[0],
    notes: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's saved fuel cards
  const { data: savedCards = [], isLoading } = useQuery({
    queryKey: ["/api/user-saved-fuel-cards"],
  });

  // Save fuel card mutation
  const saveFuelCardMutation = useMutation({
    mutationFn: (cardData: any) => apiRequest("/api/user-saved-fuel-cards", "POST", cardData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-saved-fuel-cards"] });
      toast({
        title: "Success",
        description: "Fuel card saved to your tracker!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save fuel card. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update fuel card mutation
  const updateFuelCardMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/user-saved-fuel-cards/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-saved-fuel-cards"] });
      toast({
        title: "Updated",
        description: "Fuel card information updated successfully!",
      });
    },
  });

  // Delete fuel card mutation
  const deleteFuelCardMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/user-saved-fuel-cards/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-saved-fuel-cards"] });
      toast({
        title: "Deleted",
        description: "Fuel card removed from your tracker.",
      });
    },
  });

  // Add spend record mutation
  const addSpendMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/fuel-card-spend-history", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-saved-fuel-cards"] });
      setIsSpendModalOpen(false);
      setSpendData({
        spendAmount: "",
        rebateEarned: "",
        recordDate: new Date().toISOString().split("T")[0],
        notes: ""
      });
      toast({
        title: "Added",
        description: "Spend record added successfully!",
      });
    },
  });

  const handleSaveCard = (featuredCard: any) => {
    const cardData = {
      cardName: featuredCard.name,
      cardProvider: featuredCard.provider,
      rebateOffer: featuredCard.rebateOffer,
      monthlySpend: "0.00",
      earnedRebates: "0.00",
      personalNotes: "",
      rating: 5
    };
    saveFuelCardMutation.mutate(cardData);
  };

  const handleUpdateCard = (cardId: number, field: string, value: any) => {
    updateFuelCardMutation.mutate({
      id: cardId,
      data: { [field]: value }
    });
  };

  const handleAddSpendRecord = () => {
    if (!selectedCard || !spendData.spendAmount) return;
    
    addSpendMutation.mutate({
      savedCardId: selectedCard.id,
      spendAmount: parseFloat(spendData.spendAmount),
      rebateEarned: parseFloat(spendData.rebateEarned || "0"),
      recordDate: spendData.recordDate,
      notes: spendData.notes
    });
  };

  const sortedFeaturedCards = [...FEATURED_FUEL_CARDS].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "rebate":
        const aRebate = parseFloat(a.rebateOffer.match(/\d+/)?.[0] || "0");
        const bRebate = parseFloat(b.rebateOffer.match(/\d+/)?.[0] || "0");
        return bRebate - aRebate;
      case "provider":
        return a.provider.localeCompare(b.provider);
      default:
        return 0;
    }
  });

  const sortedSavedCards = [...savedCards].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.cardName.localeCompare(b.cardName);
      case "rebate":
        const aRebate = parseFloat(a.rebateOffer?.match(/\d+/)?.[0] || "0");
        const bRebate = parseFloat(b.rebateOffer?.match(/\d+/)?.[0] || "0");
        return bRebate - aRebate;
      case "provider":
        return a.cardProvider.localeCompare(b.cardProvider);
      case "usage":
        return parseFloat(b.monthlySpend || "0") - parseFloat(a.monthlySpend || "0");
      default:
        return 0;
    }
  });

  const totalMonthlySpend = savedCards.reduce((sum, card) => sum + parseFloat(card.monthlySpend || "0"), 0);
  const totalRebatesEarned = savedCards.reduce((sum, card) => sum + parseFloat(card.earnedRebates || "0"), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
              <Fuel className="text-green-600" />
              <span>Fuel Card Discovery Hub</span>
            </h1>
            <p className="text-gray-600 mt-1">Discover the best fuel cards and manage your fuel spending</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rebate">Highest Rebate</SelectItem>
                <SelectItem value="name">Card Name</SelectItem>
                <SelectItem value="provider">Provider</SelectItem>
                <SelectItem value="usage">Monthly Usage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Saved Cards</p>
                  <p className="text-3xl font-bold">{savedCards.length}</p>
                </div>
                <CreditCard className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Monthly Spend</p>
                  <p className="text-3xl font-bold">${totalMonthlySpend.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Rebates</p>
                  <p className="text-3xl font-bold">${totalRebatesEarned.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Avg Rebate</p>
                  <p className="text-3xl font-bold">
                    {totalMonthlySpend > 0 ? ((totalRebatesEarned / totalMonthlySpend) * 100).toFixed(1) : "0.0"}%
                  </p>
                </div>
                <Award className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Discover Fuel Cards Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Shield className="text-blue-600" />
            <span>Discover Top Fuel Cards</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFeaturedCards.map((card) => (
              <Card key={card.id} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{card.logo}</span>
                      <div>
                        <CardTitle className="text-lg">{card.name}</CardTitle>
                        <p className="text-sm text-gray-600">{card.provider}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 font-bold">
                      {card.rebateOffer}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {card.perks.slice(0, 3).map((perk, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {perk}
                      </Badge>
                    ))}
                    {card.perks.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{card.perks.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {card.description}
                  </p>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(card.applyUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Apply Now
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleSaveCard(card)}
                      disabled={saveFuelCardMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save to My Cards
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* My Fuel Card Tracker Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Users className="text-purple-600" />
            <span>My Fuel Card Tracker ({savedCards.length})</span>
          </h2>
          
          {savedCards.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="space-y-4">
                <Heart className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-600">No Saved Cards Yet</h3>
                <p className="text-gray-500">Save your favorite fuel cards from the discovery section above to start tracking your fuel spending and rebates.</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedSavedCards.map((card) => (
                <Card key={card.id} className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{card.cardName}</CardTitle>
                        <p className="text-sm text-gray-600">{card.cardProvider}</p>
                        <Badge variant="secondary" className="mt-1">
                          {card.rebateOffer}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 cursor-pointer ${
                              i < (card.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                            onClick={() => handleUpdateCard(card.id, "rating", i + 1)}
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-gray-500">Monthly Spend</Label>
                        <Input
                          type="number"
                          value={card.monthlySpend || ""}
                          onChange={(e) => handleUpdateCard(card.id, "monthlySpend", e.target.value)}
                          placeholder="0.00"
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Earned Rebates</Label>
                        <Input
                          type="number"
                          value={card.earnedRebates || ""}
                          onChange={(e) => handleUpdateCard(card.id, "earnedRebates", e.target.value)}
                          placeholder="0.00"
                          className="mt-1 text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-500">Personal Notes</Label>
                      <Textarea
                        value={card.personalNotes || ""}
                        onChange={(e) => handleUpdateCard(card.id, "personalNotes", e.target.value)}
                        placeholder="Add notes about this card..."
                        rows={2}
                        className="mt-1 text-sm"
                      />
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedCard(card);
                          setIsSpendModalOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Spend
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedCard(card);
                          setIsDetailOpen(true);
                        }}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteFuelCardMutation.mutate(card.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Spend Record Modal */}
      <Dialog open={isSpendModalOpen} onOpenChange={setIsSpendModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Fuel Spend Record</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Card</Label>
              <Input value={selectedCard?.cardName || ""} disabled />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Spend Amount ($)</Label>
                <Input
                  type="number"
                  value={spendData.spendAmount}
                  onChange={(e) => setSpendData(prev => ({ ...prev, spendAmount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Rebate Earned ($)</Label>
                <Input
                  type="number"
                  value={spendData.rebateEarned}
                  onChange={(e) => setSpendData(prev => ({ ...prev, rebateEarned: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={spendData.recordDate}
                onChange={(e) => setSpendData(prev => ({ ...prev, recordDate: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>Notes</Label>
              <Textarea
                value={spendData.notes}
                onChange={(e) => setSpendData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes about this transaction..."
                rows={3}
              />
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsSpendModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddSpendRecord}
                disabled={addSpendMutation.isPending || !spendData.spendAmount}
              >
                Add Record
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}