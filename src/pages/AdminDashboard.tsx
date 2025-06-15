import React, { useState } from 'react';
import { 
  Users, DollarSign, TrendingUp, Settings, CheckCircle, X, 
  Plus, Edit, Trash2, Upload, Target, FileText, MessageSquare, 
  AlertCircle, Award, Eye, BookOpen 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Extend Window interface for custom properties
interface CustomWindow extends Window {
  __bettingTips?: BettingTip[];
  __bettingResults?: BettingResult[];
}

declare let window: CustomWindow;

interface Activation {
  id: number;
  name: string;
  email: string;
  amount: number;
  mpesaMessage: string;
  date: string;
}

interface Withdrawal {
  id: number;
  name: string;
  email: string;
  amount: number;
  method: string;
  details: string;
  date: string;
}

interface Deposit {
  id: number;
  name: string;
  email: string;
  amount: number;
  mpesaMessage: string;
  date: string;
}

interface Task {
  id: number;
  title: string;
  type: 'survey' | 'bidding' | 'transcription' | 'data-entry';
  description: string;
  reward: number;
  maxResponses?: number;
  currentResponses?: number;
  maxBidders?: number;
  currentBidders?: number;
  questions?: string[];
  requirements?: string;
  audioUrl?: string;
  active: boolean;
}

interface PendingTask {
  id: number;
  taskTitle: string;
  userName: string;
  response: string;
  submittedAt: string;
  reward: number;
}

interface Blog {
  id: number;
  title: string;
  author: string;
  content: string;
  submittedAt: string;
  category: string;
}

interface Signal {
  id: number;
  pair: string;
  type: 'BUY' | 'SELL';
  entry: string;
  tp1: string;
  tp2: string;
  sl: string;
  status: 'Active' | 'Hit TP1' | 'Closed';
  createdAt: string;
}

interface BettingTip {
  id: number;
  match: string;
  league: string;
  time: string;
  prediction: string;
  odds: string;
  confidence: 'High' | 'Medium' | 'Low';
  analysis: string;
  date: string;
}

interface BettingResult {
  match: string;
  prediction: string;
  result: 'Won' | 'Lost';
  odds: string;
  profit: string;
}

interface Advertisement {
  id: number;
  title: string;
  brand: string;
  type: 'video' | 'image';
  url: string;
  reward: number;
  maxViews: number;
  currentViews: number;
  active: boolean;
}

interface Course {
  id: number;
  name: string;
  courseNumber: string;
  videos: string[];
  content: string;
  exams: string[];
  active: boolean;
}

interface News {
  id: number;
  title: string;
  summary: string;
  impact: 'High' | 'Medium' | 'Low';
  publishedAt: string;
}

type ModalItem = Activation | Withdrawal | Deposit | Task | PendingTask | Blog | Signal | BettingTip | Advertisement | Course | News | null;

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState<ModalItem>(null);
  const [error, setError] = useState('');

  // Mock data - in real app, this would come from API
  const [pendingActivations, setPendingActivations] = useState<Activation[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', amount: 500, mpesaMessage: 'RH123456789 Confirmed. You have received Ksh500.00 from JOHN DOE 254712345678 on 14/06/25 at 2:30 PM', date: '2025-06-14' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', amount: 500, mpesaMessage: 'RH987654321 Confirmed. You have received Ksh500.00 from JANE SMITH 254798765432 on 14/06/25 at 3:15 PM', date: '2025-06-14' }
  ]);

  const [pendingWithdrawals, setPendingWithdrawals] = useState<Withdrawal[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', amount: 1000, method: 'M-Pesa', details: '254700000000', date: '2025-06-14' },
    { id: 2, name: 'Bob Wilson', email: 'bob@example.com', amount: 1500, method: 'Bank', details: 'KCB - 1234567890', date: '2025-06-13' }
  ]);

  const [pendingDeposits, setPendingDeposits] = useState<Deposit[]>([
    { id: 1, name: 'Mike Brown', email: 'mike@example.com', amount: 2000, mpesaMessage: 'RH555666777 Confirmed. You have received Ksh2000.00 from MIKE BROWN 254711111111 on 14/06/25 at 4:00 PM', date: '2025-06-14' },
    { id: 2, name: 'Sarah Davis', email: 'sarah@example.com', amount: 1000, mpesaMessage: 'RH888999000 Confirmed. You have received Ksh1000.00 from SARAH DAVIS 254722222222 on 14/06/25 at 4:30 PM', date: '2025-06-14' }
  ]);

  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([
    { id: 1, taskTitle: 'Product Review Survey', userName: 'Tom Wilson', response: 'Excellent product quality, would recommend to others. The delivery was fast and packaging was secure.', submittedAt: '2025-06-14 14:30', reward: 50 },
    { id: 2, taskTitle: 'Data Entry Task', userName: 'Lisa Chen', response: 'Completed all 50 entries with 100% accuracy. Double-checked all contact information.', submittedAt: '2025-06-14 15:15', reward: 100 }
  ]);

  const [pendingBlogs, setPendingBlogs] = useState<Blog[]>([
    { id: 1, title: 'Future of Cryptocurrency', author: 'John Crypto', content: 'Cryptocurrency is revolutionizing the financial world...', submittedAt: '2025-06-14 10:00', category: 'Technology' },
    { id: 2, title: 'Digital Marketing Trends', author: 'Marketing Pro', content: 'The digital marketing landscape is constantly evolving...', submittedAt: '2025-06-14 11:30', category: 'Business' }
  ]);

  const [liveSignals] = useState<Signal[]>([
    { id: 1, pair: 'EUR/USD', type: 'BUY', entry: '1.0850', tp1: '1.0900', tp2: '1.0950', sl: '1.0800', status: 'Active', createdAt: '2025-06-14 14:00' },
    { id: 2, pair: 'GBP/USD', type: 'SELL', entry: '1.2650', tp1: '1.2600', tp2: '1.2550', sl: '1.2700', status: 'Hit TP1', createdAt: '2025-06-14 12:00' }
  ]);

  const [bettingTips, setBettingTips] = useState<BettingTip[]>([]);
  const [bettingResults, setBettingResults] = useState<BettingResult[]>([]);

  const [advertisements] = useState<Advertisement[]>([
    { id: 1, title: 'New Smartphone Launch', brand: 'TechCorp', type: 'video', url: 'https://example.com/video.mp4', reward: 10, maxViews: 1000, currentViews: 245, active: true },
    { id: 2, title: 'Fashion Collection', brand: 'StyleBrand', type: 'image', url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg', reward: 10, maxViews: 500, currentViews: 189, active: true }
  ]);

  const [tasks] = useState<Task[]>([
    { id: 1, title: 'Product Review Survey', type: 'survey', description: 'Rate products you have used', reward: 50, maxResponses: 100, currentResponses: 25, questions: ['Rate the product quality', 'Would you recommend it?'], active: true },
    { id: 2, title: 'Academic Essay', type: 'bidding', description: 'Write a 1000-word essay on climate change', reward: 500, maxBidders: 1, currentBidders: 0, requirements: 'University level writing', active: true },
    { id: 3, title: 'Audio Transcription', type: 'transcription', description: 'Transcribe 10-minute audio file', reward: 200, maxBidders: 1, currentBidders: 0, audioUrl: 'https://example.com/audio.mp3', active: true }
  ]);

  const [tradingCourses] = useState<Course[]>([
    { id: 1, name: 'Forex Fundamentals', courseNumber: 'FX101', videos: ['Introduction to Forex', 'Currency Pairs', 'Market Hours'], content: 'Learn the basics of forex trading...', exams: ['Basic Forex Quiz'], active: true },
    { id: 2, name: 'Technical Analysis', courseNumber: 'TA201', videos: ['Chart Patterns', 'Indicators', 'Support & Resistance'], content: 'Master technical analysis...', exams: ['Technical Analysis Test'], active: true }
  ]);

  const [marketNews] = useState<News[]>([
    { id: 1, title: 'Fed Signals Rate Cut', summary: 'Federal Reserve hints at rate reduction...', impact: 'High', publishedAt: '2025-06-14 09:00' },
    { id: 2, title: 'EUR Strengthens', summary: 'European Central Bank releases positive data...', impact: 'Medium', publishedAt: '2025-06-14 10:30' }
  ]);

  const [newBettingTip, setNewBettingTip] = useState<BettingTip>({
    id: 0,
    match: '',
    league: '',
    time: '',
    prediction: '',
    odds: '',
    confidence: 'Medium',
    analysis: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [rejectFeedback, setRejectFeedback] = useState('');

  // Sync betting tips with global state for BettingPage
  window.__bettingTips = bettingTips;
  window.__bettingResults = bettingResults;

  const handleApproveActivation = (id: number) => {
    setPendingActivations(prev => prev.filter(item => item.id !== id));
    alert('Activation approved! 500 KES deducted and referral bonuses processed.');
  };

  const handleRejectActivation = (id: number) => {
    setPendingActivations(prev => prev.filter(item => item.id !== id));
    alert('Activation rejected.');
  };

  const handleApproveWithdrawal = (id: number) => {
    setPendingWithdrawals(prev => prev.filter(item => item.id !== id));
    alert('Withdrawal approved and processed.');
  };

  const handleApproveDeposit = (id: number) => {
    setPendingDeposits(prev => prev.filter(item => item.id !== id));
    alert('Deposit approved and added to user balance.');
  };

  const handleApproveTask = (id: number) => {
    const task = pendingTasks.find(t => t.id === id);
    setPendingTasks(prev => prev.filter(item => item.id !== id));
    alert(`Task approved! ${task?.reward || 0} KES added to user balance.`);
  };

  const handleRejectTask = (id: number) => {
    setPendingTasks(prev => prev.filter(item => item.id !== id));
    alert(`Task rejected. Feedback: ${rejectFeedback}`);
    setRejectFeedback('');
  };

  const handleApproveBlog = (id: number) => {
    setPendingBlogs(prev => prev.filter(item => item.id !== id));
    alert('Blog approved and published.');
  };

  const handleRejectBlog = (id: number) => {
    setPendingBlogs(prev => prev.filter(item => item.id !== id));
    alert(`Blog rejected. Feedback: ${rejectFeedback}`);
    setRejectFeedback('');
  };

  const handleCreateBettingTip = () => {
    if (!newBettingTip.match || !newBettingTip.league || !newBettingTip.time || !newBettingTip.prediction || !newBettingTip.odds || !newBettingTip.analysis) {
      setError('All fields are required');
      return;
    }
    if (isNaN(parseFloat(newBettingTip.odds)) || parseFloat(newBettingTip.odds) <= 1) {
      setError('Invalid odds format');
      return;
    }

    const newTip: BettingTip = {
      id: bettingTips.length + 1,
      ...newBettingTip
    };
    setBettingTips(prev => [...prev, newTip]);
    setNewBettingTip({
      id: 0,
      match: '',
      league: '',
      time: '',
      prediction: '',
      odds: '',
      confidence: 'Medium',
      analysis: '',
      date: new Date().toISOString().split('T')[0]
    });
    setError('');
    closeModal();
  };

  const handleUpdateBettingTip = () => {
    if (!newBettingTip.match || !newBettingTip.league || !newBettingTip.time || !newBettingTip.prediction || !newBettingTip.odds || !newBettingTip.analysis) {
      setError('All fields are required');
      return;
    }
    if (isNaN(parseFloat(newBettingTip.odds)) || parseFloat(newBettingTip.odds) <= 1) {
      setError('Invalid odds format');
      return;
    }

    setBettingTips(prev => prev.map(tip => tip.id === selectedItem?.id ? { ...newBettingTip, id: tip.id } : tip));
    setNewBettingTip({
      id: 0,
      match: '',
      league: '',
      time: '',
      prediction: '',
      odds: '',
      confidence: 'Medium',
      analysis: '',
      date: new Date().toISOString().split('T')[0]
    });
    setError('');
    closeModal();
  };

  const handleDeleteBettingTip = (id: number) => {
    setBettingTips(prev => prev.filter(tip => tip.id !== id));
  };

  const handleMarkResult = (id: number, result: 'Won' | 'Lost') => {
    const tip = bettingTips.find(t => t.id === id);
    if (tip) {
      const profit = result === 'Won' 
        ? `+${(parseFloat(tip.odds) * 100 - 100).toFixed(0)} KES`
        : '-100 KES';
      setBettingResults(prev => [{
        match: tip.match,
        prediction: tip.prediction,
        result,
        odds: tip.odds,
        profit
      }, ...prev]);
      setBettingTips(prev => prev.filter(t => t.id !== id));
    }
  };

  const openModal = (type: string, item?: ModalItem) => {
    setModalType(type);
    setSelectedItem(item);
    if (type === 'editBettingTip' && item) {
      setNewBettingTip(item as BettingTip);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
    setError('');
    setRejectFeedback('');
    setNewBettingTip({
      id: 0,
      match: '',
      league: '',
      time: '',
      prediction: '',
      odds: '',
      confidence: 'Medium',
      analysis: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage all platform operations and user activities</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold text-white">15,247</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Pending Actions</p>
                <p className="text-2xl font-bold text-white">{pendingActivations.length + pendingWithdrawals.length + pendingDeposits.length + pendingTasks.length + pendingBlogs.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-white">2.5M KES</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-400/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm font-medium">Active Signals</p>
                <p className="text-2xl font-bold text-white">{liveSignals.filter(s => s.status === 'Active').length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2 mb-8">
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: Settings },
              { id: 'activations', label: 'Activations', icon: CheckCircle },
              { id: 'withdrawals', label: 'Withdrawals', icon: DollarSign },
              { id: 'deposits', label: 'Deposits', icon: Upload },
              { id: 'tasks', label: 'Tasks', icon: Target },
              { id: 'blogs', label: 'Blogs', icon: FileText },
              { id: 'signals', label: 'Trading Signals', icon: TrendingUp },
              { id: 'betting', label: 'Betting Tips', icon: Award },
              { id: 'ads', label: 'Advertisements', icon: Eye },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'news', label: 'Market News', icon: MessageSquare }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all text-sm ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Platform Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-400/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Pending Activations</h3>
                  <p className="text-3xl font-bold text-orange-400">{pendingActivations.length}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Pending Withdrawals</h3>
                  <p className="text-3xl font-bold text-blue-400">{pendingWithdrawals.length}</p>
                </div>
                <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Pending Tasks</h3>
                  <p className="text-3xl font-bold text-green-400">{pendingTasks.length}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Pending Blogs</h3>
                  <p className="text-3xl font-bold text-purple-400">{pendingBlogs.length}</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-400/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Active Ads</h3>
                  <p className="text-3xl font-bold text-yellow-400">{advertisements.filter(ad => ad.active).length}</p>
                </div>
                <div className="bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border border-indigo-400/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Active Tasks</h3>
                  <p className="text-3xl font-bold text-indigo-400">{tasks.filter(task => task.active).length}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activations' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Pending Activations</h2>
              <div className="space-y-4">
                {pendingActivations.map((activation) => (
                  <div key={activation.id} className="bg-gradient-to-r from-orange-600/10 to-red-600/10 border border-orange-400/20 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{activation.name}</h3>
                        <p className="text-gray-300 mb-2">{activation.email}</p>
                        <p className="text-yellow-400 font-medium mb-3">Amount: {activation.amount} KES</p>
                        <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 mb-3">
                          <p className="text-blue-300 text-sm font-medium mb-1">M-Pesa Message:</p>
                          <p className="text-blue-200 text-sm">{activation.mpesaMessage}</p>
                        </div>
                        <p className="text-gray-400 text-sm">Date: {activation.date}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleApproveActivation(activation.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectActivation(activation.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <X className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'withdrawals' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Pending Withdrawals</h2>
              <div className="space-y-4">
                {pendingWithdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-400/20 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{withdrawal.name}</h3>
                        <p className="text-gray-300 mb-1">{withdrawal.email}</p>
                        <p className="text-green-400 font-medium mb-1">Amount: {withdrawal.amount} KES</p>
                        <p className="text-gray-400 text-sm">Method: {withdrawal.method} - {withdrawal.details}</p>
                        <p className="text-gray-400 text-sm">Date: {withdrawal.date}</p>
                      </div>
                      <button
                        onClick={() => handleApproveWithdrawal(withdrawal.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'deposits' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Pending Deposits</h2>
              <div className="space-y-4">
                {pendingDeposits.map((deposit) => (
                  <div key={deposit.id} className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-400/20 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{deposit.name}</h3>
                        <p className="text-gray-300 mb-2">{deposit.email}</p>
                        <p className="text-green-400 font-medium mb-3">Amount: {deposit.amount} KES</p>
                        <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 mb-3">
                          <p className="text-blue-300 text-sm font-medium mb-1">M-Pesa Message:</p>
                          <p className="text-blue-200 text-sm">{deposit.mpesaMessage}</p>
                        </div>
                        <p className="text-gray-400 text-sm">Date: {deposit.date}</p>
                      </div>
                      <button
                        onClick={() => handleApproveDeposit(deposit.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Task Management</h2>
                <button
                  onClick={() => openModal('createTask')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Task</span>
                </button>
              </div>

              {/* Pending Task Submissions */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Pending Submissions</h3>
                <div className="space-y-4">
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-400/20 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-2">{task.taskTitle}</h4>
                          <p className="text-gray-300 mb-2">Submitted by: {task.userName}</p>
                          <div className="bg-white/5 rounded-lg p-3 mb-3">
                            <p className="text-gray-300 text-sm">{task.response}</p>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">Submitted: {task.submittedAt}</p>
                          <p className="text-green-400 font-medium">Reward: {task.reward} KES</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleApproveTask(task.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => openModal('rejectTask', task)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
                          >
                            <X className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Tasks */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Active Tasks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tasks.map((task) => (
                    <div key={task.id} className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-400/20 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white">{task.title}</h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal('editTask', task)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{task.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-400 font-medium">{task.reward} KES</span>
                        <span className="text-gray-400">
                          {task.type === 'survey' ? `${task.currentResponses}/${task.maxResponses} responses` : 
                           task.type === 'bidding' || task.type === 'transcription' ? `${task.currentBidders}/${task.maxBidders} bidders` :
                           `${task.currentResponses}/${task.maxResponses} responses`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'blogs' && (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Blog Management</h2>
              <div className="space-y-4">
                {pendingBlogs.map((blog) => (
                  <div key={blog.id} className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-400/20 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{blog.title}</h3>
                        <p className="text-gray-300 mb-2">By: {blog.author}</p>
                        <p className="text-blue-400 mb-3">Category: {blog.category}</p>
                        <div className="bg-white/5 rounded-lg p-3 mb-3">
                          <p className="text-gray-300 text-sm">{blog.content.substring(0, 200)}...</p>
                        </div>
                        <p className="text-gray-400 text-sm">Submitted: {blog.submittedAt}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleApproveBlog(blog.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => openModal('rejectBlog', blog)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <X className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'signals' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Trading Signals</h2>
                <button
                  onClick={() => openModal('createSignal')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Signal</span>
                </button>
              </div>
              <div className="space-y-4">
                {liveSignals.map((signal) => (
                  <div key={signal.id} className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-400/20 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-xl font-semibold text-white">{signal.pair}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            signal.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {signal.type}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            signal.status === 'Active' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {signal.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Entry: <span className="text-white">{signal.entry}</span></p>
                          </div>
                          <div>
                            <p className="text-gray-400">TP1: <span className="text-green-400">{signal.tp1}</span></p>
                          </div>
                          <div>
                            <p className="text-gray-400">TP2: <span className="text-green-400">{signal.tp2}</span></p>
                          </div>
                          <div>
                            <p className="text-gray-400">SL: <span className="text-red-400">{signal.sl}</span></p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal('editSignal', signal)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'betting' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Betting Tips</h2>
                <button
                  onClick={() => openModal('createBettingTip')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Tip</span>
                </button>
              </div>
              <div className="space-y-4">
                {bettingTips.map((tip) => (
                  <div key={tip.id} className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-400/20 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{tip.match}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-gray-400 text-sm">Prediction</p>
                            <p className="text-white font-medium">{tip.prediction}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Odds</p>
                            <p className="text-green-400 font-medium">{tip.odds}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Confidence</p>
                            <p className={`font-medium ${tip.confidence === 'High' ? 'text-green-400' : tip.confidence === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                              {tip.confidence}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Date</p>
                            <p className="text-white">{tip.date}</p>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{tip.analysis}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => openModal('editBettingTip', tip)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBettingTip(tip.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleMarkResult(tip.id, 'Won')}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleMarkResult(tip.id, 'Lost')}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ads' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Advertisement Management</h2>
                <button
                  onClick={() => openModal('createAd')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Advertisement</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {advertisements.map((ad) => (
                  <div key={ad.id} className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-400/20 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{ad.title}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal('editAd', ad)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-2">Brand: {ad.brand}</p>
                    <p className="text-blue-400 mb-2">Type: {ad.type}</p>
                    <p className="text-green-400 mb-2">Reward: {ad.reward} KES</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Views: {ad.currentViews}/{ad.maxViews}</span>
                      <span className={`px-2 py-1 rounded text-xs ${ad.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {ad.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Trading Courses</h2>
                <button
                  onClick={() => openModal('createCourse')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Course</span>
                </button>
              </div>
              <div className="space-y-6">
                {tradingCourses.map((course) => (
                  <div key={course.id} className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-400/20 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{course.name}</h3>
                        <p className="text-blue-400 mb-3">Course Number: {course.courseNumber}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-gray-400 text-sm mb-1">Videos ({course.videos.length})</p>
                            <ul className="text-gray-300 text-sm">
                              {course.videos.map((video, index) => (
                                <li key={index}>• {video}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm mb-1">Content</p>
                            <p className="text-gray-300 text-sm">{course.content}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm mb-1">Exams ({course.exams.length})</p>
                            <ul className="text-gray-300 text-sm">
                              {course.exams.map((exam, index) => (
                                <li key={index}>• {exam}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => openModal('editCourse', course)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Market News</h2>
                <button
                  onClick={() => openModal('createNews')}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add News</span>
                </button>
              </div>
              <div className="space-y-4">
                {marketNews.map((news) => (
                  <div key={news.id} className="bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-400/20 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{news.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            news.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                            news.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {news.impact} Impact
                          </span>
                        </div>
                        <p className="text-gray-300 mb-2">{news.summary}</p>
                        <p className="text-gray-400 text-sm">Published: {news.publishedAt}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => openModal('editNews', news)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {modalType === 'rejectTask' ? 'Reject Task' :
                   modalType === 'rejectBlog' ? 'Reject Blog' :
                   modalType === 'createTask' ? 'Create New Task' :
                   modalType === 'editTask' ? 'Edit Task' :
                   modalType === 'createSignal' ? 'Add Trading Signal' :
                   modalType === 'editSignal' ? 'Edit Trading Signal' :
                   modalType === 'createBettingTip' ? 'Add Betting Tip' :
                   modalType === 'editBettingTip' ? 'Edit Betting Tip' :
                   modalType === 'createAd' ? 'Add Advertisement' :
                   modalType === 'editAd' ? 'Edit Advertisement' :
                   modalType === 'createCourse' ? 'Add Trading Course' :
                   modalType === 'editCourse' ? 'Edit Trading Course' :
                   modalType === 'createNews' ? 'Add Market News' :
                   modalType === 'editNews' ? 'Edit Market News' :
                   'Edit Item'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {(modalType === 'rejectTask' || modalType === 'rejectBlog') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Rejection Feedback</label>
                    <textarea
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white h-32 resize-none"
                      placeholder="Provide detailed feedback for rejection..."
                      value={rejectFeedback}
                      onChange={(e) => setRejectFeedback(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (modalType === 'rejectTask') {
                          handleRejectTask((selectedItem as PendingTask).id);
                        } else {
                          handleRejectBlog((selectedItem as Blog).id);
                        }
                        closeModal();
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Reject with Feedback
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'createTask' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Task Type</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
                      <option value="survey">Survey</option>
                      <option value="bidding">Academic/Bidding</option>
                      <option value="transcription">Transcription</option>
                      <option value="data-entry">Data Entry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="Task title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Description</label>
                    <textarea
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white h-24 resize-none"
                      placeholder="Task description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Reward (KES)</label>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Max Responses</label>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Create Task
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'editTask' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Task Type</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" defaultValue={(selectedItem as Task).type}>
                      <option value="survey">Survey</option>
                      <option value="bidding">Academic/Bidding</option>
                      <option value="transcription">Transcription</option>
                      <option value="data-entry">Data Entry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      defaultValue={(selectedItem as Task).title}
                      placeholder="Task title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Description</label>
                    <textarea
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white h-24 resize-none"
                      defaultValue={(selectedItem as Task).description}
                      placeholder="Task description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Reward (KES)</label>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        defaultValue={(selectedItem as Task).reward}
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Max Responses</label>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        defaultValue={(selectedItem as Task).maxResponses || (selectedItem as Task).maxBidders}
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Update Task
                    </button>
                  </div>
                </div>
              )}

              {(modalType === 'createSignal' || modalType === 'editSignal') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Currency Pair</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      defaultValue={modalType === 'editSignal' ? (selectedItem as Signal).pair : ''}
                      placeholder="e.g., EUR/USD"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Type</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" defaultValue={modalType === 'editSignal' ? (selectedItem as Signal).type : 'BUY'}>
                      <option value="BUY">BUY</option>
                      <option value="SELL">SELL</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Entry</label>
                      <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        defaultValue={modalType === 'editSignal' ? (selectedItem as Signal).entry : ''}
                        placeholder="e.g., 1.0850"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Stop Loss</label>
                      <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        defaultValue={modalType === 'editSignal' ? (selectedItem as Signal).sl : ''}
                        placeholder="e.g., 1.0800"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Take Profit 1</label>
                      <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        defaultValue={modalType === 'editSignal' ? (selectedItem as Signal).tp1 : ''}
                        placeholder="e.g., 1.0900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Take Profit 2</label>
                      <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        defaultValue={modalType === 'editSignal' ? (selectedItem as Signal).tp2 : ''}
                        placeholder="e.g., 1.0950"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Status</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" defaultValue={modalType === 'editSignal' ? (selectedItem as Signal).status : 'Active'}>
                      <option value="Active">Active</option>
                      <option value="Hit TP1">Hit TP1</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      {modalType === 'createSignal' ? 'Create Signal' : 'Update Signal'}
                    </button>
                  </div>
                </div>
              )}

              {(modalType === 'createBettingTip' || modalType === 'editBettingTip') && (
                <div className="space-y-4">
                  {error && (
                    <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3">
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Match</label>
                    <input
                      type="text"
                      value={newBettingTip.match}
                      onChange={e => setNewBettingTip({...newBettingTip, match: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="e.g., Arsenal vs Chelsea"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">League</label>
                    <input
                      type="text"
                      value={newBettingTip.league}
                      onChange={e => setNewBettingTip({...newBettingTip, league: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="e.g., Premier League"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Time</label>
                      <input
                        type="text"
                        value={newBettingTip.time}
                        onChange={e => setNewBettingTip({...newBettingTip, time: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        placeholder="e.g., 15:30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Date</label>
                      <input
                        type="date"
                        value={newBettingTip.date}
                        onChange={e => setNewBettingTip({...newBettingTip, date: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Prediction</label>
                    <input
                      type="text"
                      value={newBettingTip.prediction}
                      onChange={e => setNewBettingTip({...newBettingTip, prediction: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="e.g., Arsenal Win"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Odds</label>
                    <input
                      type="text"
                      value={newBettingTip.odds}
                      onChange={e => setNewBettingTip({...newBettingTip, odds: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="e.g., 2.50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Confidence</label>
                    <select
                      value={newBettingTip.confidence}
                      onChange={e => setNewBettingTip({...newBettingTip, confidence: e.target.value as 'High' | 'Medium' | 'Low'})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Analysis</label>
                    <textarea
                      rows={4}
                      value={newBettingTip.analysis}
                      onChange={e => setNewBettingTip({...newBettingTip, analysis: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white resize-none"
                      placeholder="Write detailed analysis..."
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={modalType === 'createBettingTip' ? handleCreateBettingTip : handleUpdateBettingTip}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      {modalType === 'createBettingTip' ? 'Create Tip' : 'Update Tip'}
                    </button>
                  </div>
                </div>
              )}

              {(modalType === 'createAd' || modalType === 'editAd') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      defaultValue={modalType === 'editAd' ? (selectedItem as Advertisement).title : ''}
                      placeholder="Advertisement title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Brand</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      defaultValue={modalType === 'editAd' ? (selectedItem as Advertisement).brand : ''}
                      placeholder="Brand name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Type</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white" defaultValue={modalType === 'editAd' ? (selectedItem as Advertisement).type : 'video'}>
                      <option value="video">Video</option>
                      <option value="image">Image</option>
                    </select>
                  </div>
                  <div>
                                       <label className="block text-sm text-gray-300 mb-2">URL</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      defaultValue={modalType === 'editAd' ? (selectedItem as Advertisement).url : ''}
                      placeholder="e.g., https://example.com/ad"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Reward (KES)</label>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        defaultValue={modalType === 'editAd' ? (selectedItem as Advertisement).reward : ''}
                        placeholder="e.g., 10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Max Views</label>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        defaultValue={modalType === 'editAd' ? (selectedItem as Advertisement).maxViews : ''}
                        placeholder="e.g., 1000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Active</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      defaultValue={modalType === 'editAd' ? (selectedItem as Advertisement).active.toString() : 'true'}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      {modalType === 'createAd' ? 'Create Advertisement' : 'Update Advertisement'}
                    </button>
                  </div>
                </div>
              )}

              {(modalType === 'createCourse' || modalType === 'editCourse') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Course Name</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      defaultValue={modalType === 'editCourse' ? (selectedItem as Course).name : ''}
                      placeholder="e.g., Forex Fundamentals"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Course Number</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      defaultValue={modalType === 'editCourse' ? (selectedItem as Course).courseNumber : ''}
                      placeholder="e.g., FX101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Videos (comma-separated)</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      defaultValue={modalType === 'editCourse' ? (selectedItem as Course).videos.join(', ') : ''}
                      placeholder="e.g., Introduction to Forex, Currency Pairs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Content</label>
                    <textarea
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white h-24 resize-none"
                      defaultValue={modalType === 'editCourse' ? (selectedItem as Course).content : ''}
                      placeholder="Course description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Exams (comma-separated)</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      defaultValue={modalType === 'editCourse' ? (selectedItem as Course).exams.join(', ') : ''}
                      placeholder="e.g., Basic Forex Quiz"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Active</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      defaultValue={modalType === 'editCourse' ? (selectedItem as Course).active.toString() : 'true'}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      {modalType === 'createCourse' ? 'Create Course' : 'Update Course'}
                    </button>
                  </div>
                </div>
              )}

              {(modalType === 'createNews' || modalType === 'editNews') && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Title</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      defaultValue={modalType === 'editNews' ? (selectedItem as News).title : ''}
                      placeholder="e.g., Fed Signals Rate Cut"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Summary</label>
                    <textarea
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white h-24 resize-none"
                      defaultValue={modalType === 'editNews' ? (selectedItem as News).summary : ''}
                      placeholder="News summary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Impact</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      defaultValue={modalType === 'editNews' ? (selectedItem as News).impact : 'Medium'}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Published At</label>
                    <input
                      type="datetime-local"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      defaultValue={
                        modalType === 'editNews'
                          ? new Date((selectedItem as News).publishedAt).toISOString().slice(0, 16)
                          : new Date().toISOString().slice(0, 16)
                      }
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      {modalType === 'createNews' ? 'Create News' : 'Update News'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;