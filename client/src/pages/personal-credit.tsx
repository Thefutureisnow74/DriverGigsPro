import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  Target,
  Calculator,
  Plus,
  Minus,
  DollarSign,
  BarChart3,
  Activity,
  RefreshCw,
  Edit,
  Trash2,
  Save,
  X,
  ExternalLink
} from "lucide-react";

interface CreditScore {
  id: number;
  bureauName: string;
  score: number;
  scoreDate: string;
  scoreModel: string;
  notes?: string;
}

interface CreditGoal {
  id: number;
  goalType: string;
  goalName: string;
  targetValue: string;
  currentValue?: string;
  targetDate?: string;
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
}

interface Tradeline {
  id: number;
  accountName: string;
  accountType: string;
  creditorName: string;
  accountNumber?: string;
  openDate?: string;
  status: string;
  creditLimit?: number;
  currentBalance: number;
  minimumPayment?: number;
  interestRate?: number;
  paymentDueDate?: number;
  lastPaymentAmount?: number;
  lastPaymentDate?: string;
  isReporting: boolean;
  reportsToBureaus?: string[];
  notes?: string;
}

interface PersonalCreditCard {
  id: number;
  slotNumber: number;
  issuingCompany?: string;
  website?: string;
  cardTypeCategory?: string;
  accountType?: string;
  accountNumber?: string;
  expiration?: string;
  secCode?: string;
  monitor?: string;
  originalAmount?: number;
  currentBalance?: number;
  paymentDueDate?: number;
  internalLateDate?: number;
  officialLateDate?: number;
  reportDate?: string;
  login?: string;
  password?: string;
  monthlyPayment?: number;
  interestRate?: number;
  autoPay?: string;
  autoPayAcct?: string;
  dateOpened?: string;
  accountStatus?: string;
  notes?: string;
}

export default function PersonalCredit() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showTradelineDialog, setShowTradelineDialog] = useState(false);
  const [editingScore, setEditingScore] = useState<CreditScore | null>(null);
  const [editingGoal, setEditingGoal] = useState<CreditGoal | null>(null);
  const [editingTradeline, setEditingTradeline] = useState<Tradeline | null>(null);
  
  // Score input states
  const [experianScoreInput, setExperianScoreInput] = useState('');
  const [transUnionScoreInput, setTransUnionScoreInput] = useState('');
  const [equifaxScoreInput, setEquifaxScoreInput] = useState('');
  
  // Date input states
  const [experianDateInput, setExperianDateInput] = useState('');
  const [transUnionDateInput, setTransUnionDateInput] = useState('');
  const [equifaxDateInput, setEquifaxDateInput] = useState('');
  
  // Live score states for immediate chart updates
  const [liveExperianScore, setLiveExperianScore] = useState<number | null>(null);
  const [liveTransUnionScore, setLiveTransUnionScore] = useState<number | null>(null);
  const [liveEquifaxScore, setLiveEquifaxScore] = useState<number | null>(null);

  // Fetch data
  const { data: scores = [], isLoading: scoresLoading } = useQuery<CreditScore[]>({
    queryKey: ["/api/personal-credit/scores"],
  });

  const { data: goals = [], isLoading: goalsLoading } = useQuery<CreditGoal[]>({
    queryKey: ["/api/personal-credit/goals"],
  });

  const { data: tradelines = [], isLoading: tradelinesLoading } = useQuery<Tradeline[]>({
    queryKey: ["/api/personal-credit/tradelines"],
  });

  const { data: cards = [], isLoading: cardsLoading } = useQuery<PersonalCreditCard[]>({
    queryKey: ["/api/personal-credit/cards"],
  });

  // Mutations
  const updateScoreMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<CreditScore> & { id: number }) => 
      apiRequest(`/api/personal-credit/scores/${id}`, { method: "PUT", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personal-credit/scores"] });
      setEditingScore(null);
      toast({ title: "Success", description: "Credit score updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update credit score", variant: "destructive" });
    }
  });

  const deleteScoreMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/personal-credit/scores/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personal-credit/scores"] });
      toast({ title: "Success", description: "Credit score deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete credit score", variant: "destructive" });
    }
  });

  const createScoreMutation = useMutation({
    mutationFn: (data: Partial<CreditScore>) => apiRequest("/api/personal-credit/scores", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personal-credit/scores"] });
      toast({ title: "Success", description: "Credit score added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add credit score", variant: "destructive" });
    }
  });

  const createGoalMutation = useMutation({
    mutationFn: (data: Partial<CreditGoal>) => apiRequest("/api/personal-credit/goals", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personal-credit/goals"] });
      setShowGoalDialog(false);
      toast({ title: "Success", description: "Credit goal added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add credit goal", variant: "destructive" });
    }
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<CreditGoal> & { id: number }) => 
      apiRequest(`/api/personal-credit/goals/${id}`, { method: "PUT", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personal-credit/goals"] });
      setEditingGoal(null);
      toast({ title: "Success", description: "Credit goal updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update credit goal", variant: "destructive" });
    }
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/personal-credit/goals/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personal-credit/goals"] });
      toast({ title: "Success", description: "Credit goal deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete credit goal", variant: "destructive" });
    }
  });

  const createTradelineMutation = useMutation({
    mutationFn: (data: Partial<Tradeline>) => apiRequest("/api/personal-credit/tradelines", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personal-credit/tradelines"] });
      setShowTradelineDialog(false);
      toast({ title: "Success", description: "Tradeline added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add tradeline", variant: "destructive" });
    }
  });

  const updateTradelineMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<Tradeline> & { id: number }) => 
      apiRequest(`/api/personal-credit/tradelines/${id}`, { method: "PUT", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personal-credit/tradelines"] });
      setEditingTradeline(null);
      toast({ title: "Success", description: "Tradeline updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update tradeline", variant: "destructive" });
    }
  });

  const deleteTradelineMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/personal-credit/tradelines/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personal-credit/tradelines"] });
      toast({ title: "Success", description: "Tradeline deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete tradeline", variant: "destructive" });
    }
  });

  const saveCardMutation = useMutation({
    mutationFn: async (cardData: any) => {
      const existingCard = cards.find((c: any) => c.slotNumber === cardData.slotNumber);

      if (existingCard) {
        const response = await apiRequest(`/api/personal-credit/cards/${existingCard.id}`, {
          method: "PUT",
          body: cardData,
        });
        return response;
      } else {
        const response = await apiRequest("/api/personal-credit/cards", {
          method: "POST",
          body: cardData,
        });
        return response;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/personal-credit/cards"] });
      toast({ title: "Success", description: "Card saved successfully", duration: 1500 });
    },
    onError: (error) => {
      console.error('Card save error:', error);
      toast({ title: "Save failed", description: "Failed to save card", variant: "destructive" });
    },
  });

  // Calculate average score and credit utilization
  const latestScores = scores.reduce((acc, score) => {
    const existing = acc.find(s => s.bureauName === score.bureauName);
    if (!existing || new Date(score.scoreDate) > new Date(existing.scoreDate)) {
      acc = acc.filter(s => s.bureauName !== score.bureauName);
      acc.push(score);
    }
    return acc;
  }, [] as CreditScore[]);

  // Get current display scores (live scores take priority over database scores)
  const getCurrentScore = (bureau: string) => {
    if (bureau === 'Experian' && liveExperianScore !== null) return liveExperianScore;
    if (bureau === 'TransUnion' && liveTransUnionScore !== null) return liveTransUnionScore;
    if (bureau === 'Equifax' && liveEquifaxScore !== null) return liveEquifaxScore;
    return latestScores.find(s => s.bureauName === bureau)?.score || 0;
  };

  // Get current saved date for display in date inputs
  const getCurrentDate = (bureau: string) => {
    const savedScore = latestScores.find(s => s.bureauName === bureau);
    if (savedScore && savedScore.scoreDate) {
      return new Date(savedScore.scoreDate).toISOString().split('T')[0];
    }
    return '';
  };

  // Calculate average score using current display scores (including live inputs)
  const currentScores = [
    getCurrentScore('Experian'),
    getCurrentScore('TransUnion'), 
    getCurrentScore('Equifax')
  ].filter(score => score > 0);
  
  const averageScore = currentScores.length > 0 ? 
    Math.round(currentScores.reduce((sum, score) => sum + score, 0) / currentScores.length) : 0;

  const totalCreditLimit = tradelines
    .filter(t => t.status === 'active' && t.creditLimit)
    .reduce((sum, t) => sum + (t.creditLimit || 0), 0);

  const totalBalance = tradelines
    .filter(t => t.status === 'active')
    .reduce((sum, t) => sum + t.currentBalance, 0);

  const utilizationRate = totalCreditLimit > 0 ? (totalBalance / totalCreditLimit) * 100 : 0;

  // Handle score input changes and updates
  const handleScoreUpdate = (bureau: string, score: string, date?: string) => {
    const scoreValue = parseInt(score);
    if (scoreValue >= 300 && scoreValue <= 850) {
      const existingScore = latestScores.find(s => s.bureauName === bureau);
      const scoreDate = date || new Date().toISOString().split('T')[0];
      
      if (existingScore) {
        updateScoreMutation.mutate({
          id: existingScore.id,
          score: scoreValue,
          scoreDate: scoreDate,
        });
      } else {
        createScoreMutation.mutate({
          bureauName: bureau,
          score: scoreValue,
          scoreDate: scoreDate,
          scoreModel: bureau === 'Experian' ? 'FICO Score' : bureau === 'TransUnion' ? 'VantageScore' : 'Equifax Score',
        });
      }
    }
  };

  // Helper to get card value
  const getCardValue = (slotNumber: number, field: string) => {
    const card = cards.find((c: any) => c.slotNumber === slotNumber);
    return card?.[field] || '';
  };

  // Handle card field changes with debouncing
  const handleCardChange = (() => {
    const timeouts: { [key: string]: NodeJS.Timeout } = {};
    
    return (slotNumber: number, field: string, value: any) => {
      const key = `card-${slotNumber}`;
      
      if (timeouts[key]) {
        clearTimeout(timeouts[key]);
      }
      
      timeouts[key] = setTimeout(() => {
        const cardData = {
          slotNumber,
          [field]: value,
        };
        
        const existing = cards.find((c: any) => c.slotNumber === slotNumber);
        
        if (existing) {
          saveCardMutation.mutate({ ...existing, ...cardData });
        } else {
          saveCardMutation.mutate(cardData);
        }
      }, 2500);
    };
  })();

  function getScoreRange(score: number) {
    if (score >= 800) return { range: "Excellent", color: "text-green-600", bgColor: "bg-green-50" };
    if (score >= 740) return { range: "Very Good", color: "text-blue-600", bgColor: "bg-blue-50" };
    if (score >= 670) return { range: "Good", color: "text-yellow-600", bgColor: "bg-yellow-50" };
    if (score >= 580) return { range: "Fair", color: "text-orange-600", bgColor: "bg-orange-50" };
    return { range: "Poor", color: "text-red-600", bgColor: "bg-red-50" };
  }

  const scoreRange = getScoreRange(averageScore);

  if (scoresLoading || goalsLoading || tradelinesLoading || cardsLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Credit Manager</h1>
        <p className="text-gray-600">Manually track your credit scores, goals, and tradelines for better financial management</p>
      </div>

      {/* Personal Credit Score Overview */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="text-indigo-600" size={20} />
          <h4 className="text-base font-semibold text-indigo-700">Personal Credit Scores</h4>
        </div>

        {/* Credit Score Visualization */}
        <div className="border-b pb-6">
          <h5 className="text-lg font-semibold text-slate-700 mb-6">Credit Score Overview</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Experian Chart */}
            <div className="text-center">
              <div className="h-40 relative mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { 
                          name: 'Score', 
                          value: getCurrentScore('Experian'), 
                          color: '#3b82f6' 
                        },
                        { 
                          name: 'Remaining', 
                          value: 850 - getCurrentScore('Experian'), 
                          color: '#e2e8f0' 
                        }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#e2e8f0" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-blue-700">
                      {getCurrentScore('Experian')}
                    </span>
                    <div className="text-sm text-blue-600 font-medium">300-850</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <h6 className="font-bold text-blue-700 text-lg">Experian</h6>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('https://www.experian.com/', '_blank')}
                  className="p-1 h-6 w-6 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  <ExternalLink size={14} />
                </Button>
              </div>
              <p className="text-blue-600 text-sm">FICO Score</p>
              <div className="mt-2">
                <p className="text-xs text-blue-600 mb-1">
                  Last Updated: {latestScores.find(s => s.bureauName === 'Experian')?.scoreDate ? 
                    new Date(latestScores.find(s => s.bureauName === 'Experian')?.scoreDate).toLocaleDateString() : 'Not tracked'}
                </p>
              </div>
            </div>

            {/* TransUnion Chart */}
            <div className="text-center">
              <div className="h-40 relative mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { 
                          name: 'Score', 
                          value: getCurrentScore('TransUnion'), 
                          color: '#059669' 
                        },
                        { 
                          name: 'Remaining', 
                          value: 850 - getCurrentScore('TransUnion'), 
                          color: '#e2e8f0' 
                        }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    >
                      <Cell fill="#059669" />
                      <Cell fill="#e2e8f0" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-green-700">
                      {getCurrentScore('TransUnion')}
                    </span>
                    <div className="text-sm text-green-600 font-medium">300-850</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <h6 className="font-bold text-green-700 text-lg">TransUnion</h6>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('https://www.transunion.com/', '_blank')}
                  className="p-1 h-6 w-6 text-green-600 hover:text-green-800 hover:bg-green-50"
                >
                  <ExternalLink size={14} />
                </Button>
              </div>
              <p className="text-green-600 text-sm">VantageScore</p>
              <div className="mt-2">
                <p className="text-xs text-green-600 mb-1">
                  Last Updated: {latestScores.find(s => s.bureauName === 'TransUnion')?.scoreDate ? 
                    new Date(latestScores.find(s => s.bureauName === 'TransUnion')?.scoreDate).toLocaleDateString() : 'Not tracked'}
                </p>
              </div>
            </div>

            {/* Equifax Chart */}
            <div className="text-center">
              <div className="h-40 relative mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { 
                          name: 'Score', 
                          value: getCurrentScore('Equifax'), 
                          color: '#dc2626' 
                        },
                        { 
                          name: 'Remaining', 
                          value: 850 - getCurrentScore('Equifax'), 
                          color: '#e2e8f0' 
                        }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    >
                      <Cell fill="#dc2626" />
                      <Cell fill="#e2e8f0" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-red-700">
                      {getCurrentScore('Equifax')}
                    </span>
                    <div className="text-sm text-red-600 font-medium">300-850</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <h6 className="font-bold text-red-700 text-lg">Equifax</h6>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('https://www.equifax.com/', '_blank')}
                  className="p-1 h-6 w-6 text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <ExternalLink size={14} />
                </Button>
              </div>
              <p className="text-red-600 text-sm">Equifax Score</p>
              <div className="mt-2">
                <p className="text-xs text-red-600 mb-1">
                  Last Updated: {latestScores.find(s => s.bureauName === 'Equifax')?.scoreDate ? 
                    new Date(latestScores.find(s => s.bureauName === 'Equifax')?.scoreDate).toLocaleDateString() : 'Not tracked'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Input Fields */}
        <div className="mt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Experian Input */}
            <div className="text-center">
              <Input
                type="number"
                min="300"
                max="850"
                placeholder="Enter Experian Score"
                value={experianScoreInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setExperianScoreInput(value);
                  const scoreValue = parseInt(value);
                  if (scoreValue >= 300 && scoreValue <= 850) {
                    setLiveExperianScore(scoreValue);
                  } else if (value === '') {
                    setLiveExperianScore(null);
                  }
                }}
                onBlur={() => {
                  if (experianScoreInput) {
                    handleScoreUpdate('Experian', experianScoreInput, experianDateInput);
                    setExperianScoreInput('');
                    setExperianDateInput('');
                  }
                }}
                className="text-center text-lg font-semibold border-2 border-blue-200 focus:border-blue-400"
              />
              <Input
                type="date"
                placeholder="Score date"
                value={experianDateInput || getCurrentDate('Experian')}
                onChange={(e) => setExperianDateInput(e.target.value)}
                className="mt-2 text-center text-sm border border-blue-200 focus:border-blue-400"
              />
            </div>

            {/* TransUnion Input */}
            <div className="text-center">
              <Input
                type="number"
                min="300"
                max="850"
                placeholder="Enter TransUnion Score"
                value={transUnionScoreInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setTransUnionScoreInput(value);
                  const scoreValue = parseInt(value);
                  if (scoreValue >= 300 && scoreValue <= 850) {
                    setLiveTransUnionScore(scoreValue);
                  } else if (value === '') {
                    setLiveTransUnionScore(null);
                  }
                }}
                onBlur={() => {
                  if (transUnionScoreInput) {
                    handleScoreUpdate('TransUnion', transUnionScoreInput, transUnionDateInput);
                    setTransUnionScoreInput('');
                    setTransUnionDateInput('');
                  }
                }}
                className="text-center text-lg font-semibold border-2 border-green-200 focus:border-green-400"
              />
              <Input
                type="date"
                placeholder="Score date"
                value={transUnionDateInput || getCurrentDate('TransUnion')}
                onChange={(e) => setTransUnionDateInput(e.target.value)}
                className="mt-2 text-center text-sm border border-green-200 focus:border-green-400"
              />
            </div>

            {/* Equifax Input */}
            <div className="text-center">
              <Input
                type="number"
                min="300"
                max="850"
                placeholder="Enter Equifax Score"
                value={equifaxScoreInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setEquifaxScoreInput(value);
                  const scoreValue = parseInt(value);
                  if (scoreValue >= 300 && scoreValue <= 850) {
                    setLiveEquifaxScore(scoreValue);
                  } else if (value === '') {
                    setLiveEquifaxScore(null);
                  }
                }}
                onBlur={() => {
                  if (equifaxScoreInput) {
                    handleScoreUpdate('Equifax', equifaxScoreInput, equifaxDateInput);
                    setEquifaxScoreInput('');
                    setEquifaxDateInput('');
                  }
                }}
                className="text-center text-lg font-semibold border-2 border-red-200 focus:border-red-400"
              />
              <Input
                type="date"
                placeholder="Score date"
                value={equifaxDateInput || getCurrentDate('Equifax')}
                onChange={(e) => setEquifaxDateInput(e.target.value)}
                className="mt-2 text-center text-sm border border-red-200 focus:border-red-400"
              />
            </div>
          </div>
        </div>

        {/* Credit Summary Stats */}
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">{averageScore}</p>
                    <Badge className={`${scoreRange.bgColor} ${scoreRange.color} text-xs`}>
                      {scoreRange.range}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Credit Utilization</p>
                    <p className="text-2xl font-bold text-gray-900">{utilizationRate.toFixed(1)}%</p>
                    <Progress value={utilizationRate} className="h-2 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Credit Limit</p>
                    <p className="text-2xl font-bold text-gray-900">${totalCreditLimit.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Balance: ${totalBalance.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Goals and Tradelines Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Credit Goals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Credit Goals
            </CardTitle>
            <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <CreditGoalForm 
                  onSubmit={(data) => createGoalMutation.mutate(data)}
                  isLoading={createGoalMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {goals.length > 0 ? (
              <div className="space-y-4">
                {goals.map((goal) => {
                  const current = parseInt(goal.currentValue || "0");
                  const target = parseInt(goal.targetValue);
                  const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
                  
                  return (
                    <div key={goal.id} className="p-4 rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-900">{goal.goalName}</h4>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingGoal(goal)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteGoalMutation.mutate(goal.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">{goal.currentValue || 0} / {goal.targetValue}</span>
                        <Badge variant={goal.isCompleted ? "default" : "secondary"}>
                          {goal.isCompleted ? "Complete" : "In Progress"}
                        </Badge>
                      </div>
                      <Progress value={progress} className="h-2 mb-2" />
                      <div className="text-xs text-gray-500">{Math.round(progress)}% complete</div>
                      {goal.targetDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Target: {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      )}
                      {goal.notes && (
                        <p className="text-xs text-gray-500 mt-1">{goal.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No credit goals set yet</p>
                <p className="text-sm text-gray-400">Set your first goal to track progress</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-blue-50">
                <div className="text-2xl font-bold text-blue-900">{latestScores.length}</div>
                <p className="text-sm text-blue-700">Credit Bureaus</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50">
                <div className="text-2xl font-bold text-green-900">{tradelines.filter(t => t.status === 'active').length}</div>
                <p className="text-sm text-green-700">Active Accounts</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50">
                <div className="text-2xl font-bold text-purple-900">${totalCreditLimit.toLocaleString()}</div>
                <p className="text-sm text-purple-700">Total Credit Limit</p>
              </div>
              <div className="p-4 rounded-lg bg-orange-50">
                <div className="text-2xl font-bold text-orange-900">${totalBalance.toLocaleString()}</div>
                <p className="text-sm text-orange-700">Total Balance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Credit and Debit Cards Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
            Personal Credit and Debit Cards
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cardsLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-300 border-t-indigo-600 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((slotNumber) => (
                <div key={`card-${slotNumber}`} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                      Card #{slotNumber}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`card-${slotNumber}-issuingCompany`}>Company Name & Number</Label>
                      <Input
                        id={`card-${slotNumber}-issuingCompany`}
                        data-testid={`input-card-${slotNumber}-issuing-company`}
                        value={getCardValue(slotNumber, 'issuingCompany')}
                        onChange={(e) => handleCardChange(slotNumber, 'issuingCompany', e.target.value)}
                        placeholder="e.g., Chase, Account #12345"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-website`}>Website</Label>
                      <Input
                        id={`card-${slotNumber}-website`}
                        data-testid={`input-card-${slotNumber}-website`}
                        value={getCardValue(slotNumber, 'website')}
                        onChange={(e) => handleCardChange(slotNumber, 'website', e.target.value)}
                        placeholder="https://www.chase.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-cardTypeCategory`}>Type of Card</Label>
                      <Select
                        value={getCardValue(slotNumber, 'cardTypeCategory')}
                        onValueChange={(value) => handleCardChange(slotNumber, 'cardTypeCategory', value)}
                      >
                        <SelectTrigger id={`card-${slotNumber}-cardTypeCategory`} data-testid={`select-card-${slotNumber}-card-type-category`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit">Credit</SelectItem>
                          <SelectItem value="debit">Debit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-accountType`}>Card Name</Label>
                      <Input
                        id={`card-${slotNumber}-accountType`}
                        data-testid={`input-card-${slotNumber}-account-type`}
                        value={getCardValue(slotNumber, 'accountType')}
                        onChange={(e) => handleCardChange(slotNumber, 'accountType', e.target.value)}
                        placeholder="e.g., Chase Sapphire Preferred"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-accountNumber`}>Last Four Digits</Label>
                      <Input
                        id={`card-${slotNumber}-accountNumber`}
                        data-testid={`input-card-${slotNumber}-account-number`}
                        value={getCardValue(slotNumber, 'accountNumber')}
                        onChange={(e) => handleCardChange(slotNumber, 'accountNumber', e.target.value)}
                        placeholder="1234"
                        maxLength={4}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-expiration`}>Expiration</Label>
                      <Input
                        id={`card-${slotNumber}-expiration`}
                        data-testid={`input-card-${slotNumber}-expiration`}
                        value={getCardValue(slotNumber, 'expiration')}
                        onChange={(e) => handleCardChange(slotNumber, 'expiration', e.target.value)}
                        placeholder="MM/YY"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-secCode`}>Sec Code (CVV)</Label>
                      <Input
                        id={`card-${slotNumber}-secCode`}
                        data-testid={`input-card-${slotNumber}-sec-code`}
                        value={getCardValue(slotNumber, 'secCode')}
                        onChange={(e) => handleCardChange(slotNumber, 'secCode', e.target.value)}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-monitor`}>Monitor</Label>
                      <Input
                        id={`card-${slotNumber}-monitor`}
                        data-testid={`input-card-${slotNumber}-monitor`}
                        value={getCardValue(slotNumber, 'monitor')}
                        onChange={(e) => handleCardChange(slotNumber, 'monitor', e.target.value)}
                        placeholder="Monitoring service"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-originalAmount`}>Credit Limit ($)</Label>
                      <Input
                        id={`card-${slotNumber}-originalAmount`}
                        data-testid={`input-card-${slotNumber}-credit-limit`}
                        type="number"
                        step="0.01"
                        value={getCardValue(slotNumber, 'originalAmount')}
                        onChange={(e) => handleCardChange(slotNumber, 'originalAmount', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-currentBalance`}>Balance Due ($)</Label>
                      <Input
                        id={`card-${slotNumber}-currentBalance`}
                        data-testid={`input-card-${slotNumber}-current-balance`}
                        type="number"
                        step="0.01"
                        value={getCardValue(slotNumber, 'currentBalance')}
                        onChange={(e) => handleCardChange(slotNumber, 'currentBalance', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-paymentDueDate`}>Due Date</Label>
                      <Input
                        id={`card-${slotNumber}-paymentDueDate`}
                        data-testid={`input-card-${slotNumber}-payment-due-date`}
                        type="number"
                        min="1"
                        max="31"
                        value={getCardValue(slotNumber, 'paymentDueDate')}
                        onChange={(e) => handleCardChange(slotNumber, 'paymentDueDate', e.target.value)}
                        placeholder="Day of month (1-31)"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-internalLateDate`}>Internal Late Date</Label>
                      <Input
                        id={`card-${slotNumber}-internalLateDate`}
                        data-testid={`input-card-${slotNumber}-internal-late-date`}
                        type="number"
                        min="1"
                        max="31"
                        value={getCardValue(slotNumber, 'internalLateDate')}
                        onChange={(e) => handleCardChange(slotNumber, 'internalLateDate', e.target.value)}
                        placeholder="Day of month (1-31)"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-officialLateDate`}>Official Late Date</Label>
                      <Input
                        id={`card-${slotNumber}-officialLateDate`}
                        data-testid={`input-card-${slotNumber}-official-late-date`}
                        type="number"
                        min="1"
                        max="31"
                        value={getCardValue(slotNumber, 'officialLateDate')}
                        onChange={(e) => handleCardChange(slotNumber, 'officialLateDate', e.target.value)}
                        placeholder="Day of month (1-31)"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-reportDate`}>Report Date / Settlement Date</Label>
                      <Input
                        id={`card-${slotNumber}-reportDate`}
                        data-testid={`input-card-${slotNumber}-report-date`}
                        type="date"
                        value={getCardValue(slotNumber, 'reportDate')}
                        onChange={(e) => handleCardChange(slotNumber, 'reportDate', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-login`}>Login</Label>
                      <Input
                        id={`card-${slotNumber}-login`}
                        data-testid={`input-card-${slotNumber}-login`}
                        value={getCardValue(slotNumber, 'login')}
                        onChange={(e) => handleCardChange(slotNumber, 'login', e.target.value)}
                        placeholder="Username or email"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-password`}>Password</Label>
                      <Input
                        id={`card-${slotNumber}-password`}
                        data-testid={`input-card-${slotNumber}-password`}
                        type="password"
                        value={getCardValue(slotNumber, 'password')}
                        onChange={(e) => handleCardChange(slotNumber, 'password', e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-monthlyPayment`}>Payment ($)</Label>
                      <Input
                        id={`card-${slotNumber}-monthlyPayment`}
                        data-testid={`input-card-${slotNumber}-monthly-payment`}
                        type="number"
                        step="0.01"
                        value={getCardValue(slotNumber, 'monthlyPayment')}
                        onChange={(e) => handleCardChange(slotNumber, 'monthlyPayment', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-interestRate`}>Interest Rate (%)</Label>
                      <Input
                        id={`card-${slotNumber}-interestRate`}
                        data-testid={`input-card-${slotNumber}-interest-rate`}
                        type="number"
                        step="0.01"
                        value={getCardValue(slotNumber, 'interestRate')}
                        onChange={(e) => handleCardChange(slotNumber, 'interestRate', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-autoPay`}>AUTO PAY</Label>
                      <Select
                        value={getCardValue(slotNumber, 'autoPay')}
                        onValueChange={(value) => handleCardChange(slotNumber, 'autoPay', value)}
                      >
                        <SelectTrigger id={`card-${slotNumber}-autoPay`} data-testid={`select-card-${slotNumber}-auto-pay`}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-autoPayAcct`}>AutoPay Acct</Label>
                      <Input
                        id={`card-${slotNumber}-autoPayAcct`}
                        data-testid={`input-card-${slotNumber}-auto-pay-acct`}
                        value={getCardValue(slotNumber, 'autoPayAcct')}
                        onChange={(e) => handleCardChange(slotNumber, 'autoPayAcct', e.target.value)}
                        placeholder="Bank account for autopay"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-dateOpened`}>Date Opened</Label>
                      <Input
                        id={`card-${slotNumber}-dateOpened`}
                        data-testid={`input-card-${slotNumber}-date-opened`}
                        type="date"
                        value={getCardValue(slotNumber, 'dateOpened')}
                        onChange={(e) => handleCardChange(slotNumber, 'dateOpened', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`card-${slotNumber}-accountStatus`}>Account Status</Label>
                      <Select
                        value={getCardValue(slotNumber, 'accountStatus')}
                        onValueChange={(value) => handleCardChange(slotNumber, 'accountStatus', value)}
                      >
                        <SelectTrigger id={`card-${slotNumber}-accountStatus`} data-testid={`select-card-${slotNumber}-account-status`}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paid_off">Paid Off</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="md:col-span-3">
                      <Label htmlFor={`card-${slotNumber}-notes`}>Notes</Label>
                      <Textarea
                        id={`card-${slotNumber}-notes`}
                        data-testid={`textarea-card-${slotNumber}-notes`}
                        value={getCardValue(slotNumber, 'notes')}
                        onChange={(e) => handleCardChange(slotNumber, 'notes', e.target.value)}
                        placeholder="Additional notes about this card"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tradelines */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Credit Tradelines
          </CardTitle>
          <Dialog open={showTradelineDialog} onOpenChange={setShowTradelineDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Tradeline
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <TradelineForm 
                onSubmit={(data) => createTradelineMutation.mutate(data)}
                isLoading={createTradelineMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {tradelines.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Account</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-left p-2">Balance</th>
                    <th className="text-left p-2">Limit</th>
                    <th className="text-left p-2">Utilization</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tradelines.map((tradeline) => {
                    const utilization = tradeline.creditLimit ? 
                      (tradeline.currentBalance / tradeline.creditLimit) * 100 : 0;
                    
                    return (
                      <tr key={tradeline.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{tradeline.accountName}</div>
                            <div className="text-xs text-gray-500">{tradeline.creditorName}</div>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline">
                            {tradeline.accountType.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="font-medium">${tradeline.currentBalance.toLocaleString()}</div>
                        </td>
                        <td className="p-2">
                          {tradeline.creditLimit ? `$${tradeline.creditLimit.toLocaleString()}` : 'N/A'}
                        </td>
                        <td className="p-2">
                          {tradeline.creditLimit ? (
                            <div>
                              <div className="text-sm">{utilization.toFixed(1)}%</div>
                              <Progress value={utilization} className="h-1 w-16" />
                            </div>
                          ) : 'N/A'}
                        </td>
                        <td className="p-2">
                          <Badge variant={tradeline.status === 'active' ? 'default' : 'secondary'}>
                            {tradeline.status}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingTradeline(tradeline)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteTradelineMutation.mutate(tradeline.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tradelines added yet</p>
              <p className="text-sm text-gray-400">Add your credit cards, loans, and other accounts</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modals */}
      {editingScore && (
        <Dialog open={!!editingScore} onOpenChange={() => setEditingScore(null)}>
          <DialogContent>
            <CreditScoreForm 
              initialData={editingScore}
              onSubmit={(data) => updateScoreMutation.mutate({ ...data, id: editingScore.id })}
              isLoading={updateScoreMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}

      {editingGoal && (
        <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
          <DialogContent>
            <CreditGoalForm 
              initialData={editingGoal}
              onSubmit={(data) => updateGoalMutation.mutate({ ...data, id: editingGoal.id })}
              isLoading={updateGoalMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}

      {editingTradeline && (
        <Dialog open={!!editingTradeline} onOpenChange={() => setEditingTradeline(null)}>
          <DialogContent className="max-w-2xl">
            <TradelineForm 
              initialData={editingTradeline}
              onSubmit={(data) => updateTradelineMutation.mutate({ ...data, id: editingTradeline.id })}
              isLoading={updateTradelineMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Credit Score Form Component
function CreditScoreForm({ 
  initialData, 
  onSubmit, 
  isLoading 
}: { 
  initialData?: CreditScore; 
  onSubmit: (data: Partial<CreditScore>) => void; 
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    bureauName: initialData?.bureauName || '',
    score: initialData?.score || '',
    scoreDate: initialData?.scoreDate ? initialData.scoreDate.split('T')[0] : '',
    scoreModel: initialData?.scoreModel || 'FICO',
    notes: initialData?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      bureauName: formData.bureauName,
      score: parseInt(formData.score as string),
      scoreDate: new Date(formData.scoreDate).toISOString(),
      scoreModel: formData.scoreModel,
      notes: formData.notes || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{initialData ? 'Edit Credit Score' : 'Add Credit Score'}</DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bureauName">Credit Bureau</Label>
          <Select 
            value={formData.bureauName} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, bureauName: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select bureau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Equifax">Equifax</SelectItem>
              <SelectItem value="Experian">Experian</SelectItem>
              <SelectItem value="TransUnion">TransUnion</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="score">Credit Score</Label>
          <Input
            type="number"
            min="300"
            max="850"
            value={formData.score}
            onChange={(e) => setFormData(prev => ({ ...prev, score: e.target.value }))}
            placeholder="720"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="scoreDate">Score Date</Label>
          <Input
            type="date"
            value={formData.scoreDate}
            onChange={(e) => setFormData(prev => ({ ...prev, scoreDate: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="scoreModel">Score Model</Label>
          <Select 
            value={formData.scoreModel} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, scoreModel: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FICO">FICO</SelectItem>
              <SelectItem value="VantageScore">VantageScore</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Any additional notes..."
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {initialData ? 'Update' : 'Add'} Score
        </Button>
      </div>
    </form>
  );
}

// Credit Goal Form Component
function CreditGoalForm({ 
  initialData, 
  onSubmit, 
  isLoading 
}: { 
  initialData?: CreditGoal; 
  onSubmit: (data: Partial<CreditGoal>) => void; 
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    goalType: initialData?.goalType || 'credit_score',
    goalName: initialData?.goalName || '',
    targetValue: initialData?.targetValue || '',
    currentValue: initialData?.currentValue || '',
    targetDate: initialData?.targetDate ? initialData.targetDate.split('T')[0] : '',
    notes: initialData?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      goalType: formData.goalType,
      goalName: formData.goalName,
      targetValue: formData.targetValue,
      currentValue: formData.currentValue || undefined,
      targetDate: formData.targetDate ? new Date(formData.targetDate).toISOString() : undefined,
      notes: formData.notes || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{initialData ? 'Edit Credit Goal' : 'Add Credit Goal'}</DialogTitle>
      </DialogHeader>
      
      <div>
        <Label htmlFor="goalType">Goal Type</Label>
        <Select 
          value={formData.goalType} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, goalType: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credit_score">Credit Score</SelectItem>
            <SelectItem value="utilization_reduction">Utilization Reduction</SelectItem>
            <SelectItem value="debt_payoff">Debt Payoff</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="goalName">Goal Name</Label>
        <Input
          value={formData.goalName}
          onChange={(e) => setFormData(prev => ({ ...prev, goalName: e.target.value }))}
          placeholder="Reach 750 credit score"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="currentValue">Current Value</Label>
          <Input
            value={formData.currentValue}
            onChange={(e) => setFormData(prev => ({ ...prev, currentValue: e.target.value }))}
            placeholder="720"
          />
        </div>
        
        <div>
          <Label htmlFor="targetValue">Target Value</Label>
          <Input
            value={formData.targetValue}
            onChange={(e) => setFormData(prev => ({ ...prev, targetValue: e.target.value }))}
            placeholder="750"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="targetDate">Target Date (Optional)</Label>
        <Input
          type="date"
          value={formData.targetDate}
          onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
        />
      </div>
      
      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Steps to achieve this goal..."
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {initialData ? 'Update' : 'Add'} Goal
        </Button>
      </div>
    </form>
  );
}

// Tradeline Form Component
function TradelineForm({ 
  initialData, 
  onSubmit, 
  isLoading 
}: { 
  initialData?: Tradeline; 
  onSubmit: (data: Partial<Tradeline>) => void; 
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    accountName: initialData?.accountName || '',
    accountType: initialData?.accountType || 'credit_card',
    creditorName: initialData?.creditorName || '',
    accountNumber: initialData?.accountNumber || '',
    openDate: initialData?.openDate ? initialData.openDate.split('T')[0] : '',
    status: initialData?.status || 'active',
    creditLimit: initialData?.creditLimit?.toString() || '',
    currentBalance: initialData?.currentBalance?.toString() || '0',
    minimumPayment: initialData?.minimumPayment?.toString() || '',
    interestRate: initialData?.interestRate?.toString() || '',
    paymentDueDate: initialData?.paymentDueDate?.toString() || '',
    lastPaymentAmount: initialData?.lastPaymentAmount?.toString() || '',
    lastPaymentDate: initialData?.lastPaymentDate ? initialData.lastPaymentDate.split('T')[0] : '',
    isReporting: initialData?.isReporting ?? true,
    reportsToBureaus: initialData?.reportsToBureaus || ['Equifax', 'Experian', 'TransUnion'],
    notes: initialData?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      accountName: formData.accountName,
      accountType: formData.accountType,
      creditorName: formData.creditorName,
      accountNumber: formData.accountNumber || undefined,
      openDate: formData.openDate ? new Date(formData.openDate).toISOString() : undefined,
      status: formData.status,
      creditLimit: formData.creditLimit ? parseFloat(formData.creditLimit) : undefined,
      currentBalance: parseFloat(formData.currentBalance),
      minimumPayment: formData.minimumPayment ? parseFloat(formData.minimumPayment) : undefined,
      interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
      paymentDueDate: formData.paymentDueDate ? parseInt(formData.paymentDueDate) : undefined,
      lastPaymentAmount: formData.lastPaymentAmount ? parseFloat(formData.lastPaymentAmount) : undefined,
      lastPaymentDate: formData.lastPaymentDate ? new Date(formData.lastPaymentDate).toISOString() : undefined,
      isReporting: formData.isReporting,
      reportsToBureaus: formData.reportsToBureaus,
      notes: formData.notes || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{initialData ? 'Edit Tradeline' : 'Add Tradeline'}</DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="accountName">Account Name</Label>
          <Input
            value={formData.accountName}
            onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
            placeholder="Chase Freedom"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="accountType">Account Type</Label>
          <Select 
            value={formData.accountType} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, accountType: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="credit_card">Credit Card</SelectItem>
              <SelectItem value="auto_loan">Auto Loan</SelectItem>
              <SelectItem value="mortgage">Mortgage</SelectItem>
              <SelectItem value="personal_loan">Personal Loan</SelectItem>
              <SelectItem value="line_of_credit">Line of Credit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="creditorName">Creditor Name</Label>
          <Input
            value={formData.creditorName}
            onChange={(e) => setFormData(prev => ({ ...prev, creditorName: e.target.value }))}
            placeholder="Chase Bank"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="paid_off">Paid Off</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="creditLimit">Credit Limit</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.creditLimit}
            onChange={(e) => setFormData(prev => ({ ...prev, creditLimit: e.target.value }))}
            placeholder="5000.00"
          />
        </div>
        
        <div>
          <Label htmlFor="currentBalance">Current Balance</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.currentBalance}
            onChange={(e) => setFormData(prev => ({ ...prev, currentBalance: e.target.value }))}
            placeholder="1250.00"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minimumPayment">Minimum Payment</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.minimumPayment}
            onChange={(e) => setFormData(prev => ({ ...prev, minimumPayment: e.target.value }))}
            placeholder="35.00"
          />
        </div>
        
        <div>
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.interestRate}
            onChange={(e) => setFormData(prev => ({ ...prev, interestRate: e.target.value }))}
            placeholder="18.99"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional account details..."
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {initialData ? 'Update' : 'Add'} Tradeline
        </Button>
      </div>
    </form>
  );
}