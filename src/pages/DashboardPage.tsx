import React, { useState } from 'react';
import { Crown, DollarSign, Users, TrendingUp, Gift, Copy, CheckCircle, AlertCircle, Eye, Clock, Target, ArrowUpRight, ArrowDownLeft, Phone, Building, PenTool, Gamepad2, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, processActivation } = useAuth();
  const { addDepositRequest, addWithdrawalRequest, addUserActivity } = useData();
  const [copied, setCopied] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('mpesa');
  const [bankDetails, setBankDetails] = useState({ bank: '', account: '', name: '' });
  const [mpesaMessage, setMpesaMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  const copyReferralLink = async () => {
    if (user?.referralLink) {
      await navigator.clipboard.writeText(user.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || !mpesaMessage || !user) {
      alert('Please enter amount and paste your M-Pesa message');
      return;
    }
    
    setProcessing(true);
    
    // Add deposit request
    addDepositRequest({
      userId: user.id,
      userName: user.name,
      amount: parseFloat(depositAmount),
      mpesaMessage,
      status: 'pending'
    });

    // Add user activity
    addUserActivity({
      userId: user.id,
      type: 'deposit_request',
      description: `Deposit request submitted: ${depositAmount} KES`,
      amount: parseFloat(depositAmount)
    });
    
    alert(`Deposit request of ${depositAmount} KES submitted successfully! Your M-Pesa message has been sent to admin for verification. Funds will be added to your account once approved.`);
    
    setShowDepositModal(false);
    setDepositAmount('');
    setMpesaMessage('');
    setProcessing(false);
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !user) return;
    
    const amount = parseFloat(withdrawAmount);
    if (amount > user.balance) {
      alert('Insufficient balance');
      return;
    }

    if (amount < 500) {
      alert('Minimum withdrawal amount is 500 KES');
      return;
    }

    setProcessing(true);
    
    // Add withdrawal request
    addWithdrawalRequest({
      userId: user.id,
      userName: user.name,
      amount,
      method: withdrawMethod,
      details: withdrawMethod === 'mpesa' ? { phoneNumber } : bankDetails,
      status: 'pending'
    });

    // Add user activity
    addUserActivity({
      userId: user.id,
      type: 'withdrawal_request',
      description: `Withdrawal request submitted: ${amount} KES`,
      amount
    });
    
    alert('Withdrawal request submitted. Pending admin approval.');
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setProcessing(false);
  };

  const handleActivation = async () => {
    if (!user || user.balance < 500) {
      alert('Insufficient balance for activation. Please deposit funds first.');
      return;
    }
    
    setProcessing(true);
    
    // Process activation
    processActivation(user.id);

    // Add user activity
    addUserActivity({
      userId: user.id,
      type: 'account_activation',
      description: 'Account activated successfully',
      amount: -500
    });
    
    alert('Account activated successfully! 500 KES deducted from your balance. Referral bonuses processed.');
    
    setShowActivationModal(false);
    setProcessing(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-300">Manage your Empire Mine account and track your earnings</p>
        </div>

        {/* Activation Alert */}
        {!user.isActivated && (
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-400/30 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <AlertCircle className="h-6 w-6 text-orange-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Account Activation Required</h3>
                <p className="text-gray-300 mb-4">
                  To unlock all earning features, activate your account. The 500 KES activation fee will be automatically deducted from your account balance.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowActivationModal(true)}
                    disabled={user.balance < 500}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                      user.balance >= 500
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black'
                        : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {user.balance >= 500 ? 'Activate Account - 500 KES' : 'Insufficient Balance'}
                  </button>
                  {user.balance < 500 && (
                    <button
                      onClick={() => setShowDepositModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                    >
                      Deposit Funds
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-400/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Current Balance</p>
                <p className="text-2xl font-bold text-white">{user.balance} KES</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Referrals</p>
                <p className="text-2xl font-bold text-white">{user.referrals}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Total Earnings</p>
                <p className="text-2xl font-bold text-white">{user.totalEarnings} KES</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-400/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm font-medium">Account Status</p>
                <p className="text-sm font-bold text-white">
                  {user.isActivated ? (
                    <span className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Activated</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4 text-orange-400" />
                      <span>Pending</span>
                    </span>
                  )}
                </p>
              </div>
              <Crown className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Referral Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Gift className="h-6 w-6 text-yellow-400" />
                <span>Referral Program</span>
              </h2>
              
              <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-300 mb-2">Your Referral Link:</p>
                <div className="flex items-center space-x-2">
                  <code className="bg-black/30 px-3 py-2 rounded text-yellow-400 font-mono text-sm flex-1 break-all">
                    {user.referralLink}
                  </code>
                  <button
                    onClick={copyReferralLink}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-2 rounded transition-colors flex items-center space-x-1 flex-shrink-0"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <a
                    href={user.referralLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors flex items-center space-x-1 flex-shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Open</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-500/10 border border-green-400/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">200 KES</p>
                  <p className="text-sm text-gray-300">1st Level Referral</p>
                </div>
                <div className="text-center p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-400">150 KES</p>
                  <p className="text-sm text-gray-300">2nd Level Referral</p>
                </div>
                <div className="text-center p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">50 KES</p>
                  <p className="text-sm text-gray-300">3rd Level Referral</p>
                </div>
              </div>
            </div>

            {/* Earning Methods */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Earning Methods</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link 
                  to="/blog"
                  className={`p-4 border border-white/10 rounded-lg transition-all text-center group ${
                    user.isActivated ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-500/20 cursor-not-allowed opacity-50'
                  }`}
                >
                  <PenTool className="h-8 w-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm text-white">Blog Posts</p>
                  <p className="text-xs text-gray-400">Share Knowledge</p>
                </Link>
                
                <Link 
                  to="/casino"
                  className={`p-4 border border-white/10 rounded-lg transition-all text-center group ${
                    user.isActivated ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-500/20 cursor-not-allowed opacity-50'
                  }`}
                >
                  <Gamepad2 className="h-8 w-8 text-red-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm text-white">Casino</p>
                  <p className="text-xs text-gray-400">Play & Win</p>
                </Link>
                
                <Link 
                  to="/ads"
                  className={`p-4 border border-white/10 rounded-lg transition-all text-center group ${
                    user.isActivated ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-500/20 cursor-not-allowed opacity-50'
                  }`}
                >
                  <Eye className="h-8 w-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm text-white">Watch Ads</p>
                  <p className="text-xs text-gray-400">10 KES/ad</p>
                </Link>
                
                <Link 
                  to="/microtasks"
                  className={`p-4 border border-white/10 rounded-lg transition-all text-center group ${
                    user.isActivated ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-500/20 cursor-not-allowed opacity-50'
                  }`}
                >
                  <Clock className="h-8 w-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm text-white">Microtasks</p>
                  <p className="text-xs text-gray-400">Variable Pay</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowDepositModal(true)}
                  className="w-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 hover:border-blue-400/50 text-white py-2 px-4 rounded-lg transition-all flex items-center space-x-2"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  <span>Deposit Funds</span>
                </button>
                <button 
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={!user.isActivated}
                  className={`w-full border text-white py-2 px-4 rounded-lg transition-all flex items-center space-x-2 ${
                    user.isActivated 
                      ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-green-400/30 hover:border-green-400/50' 
                      : 'bg-gray-500/20 border-gray-500/30 cursor-not-allowed opacity-50'
                  }`}
                >
                  <ArrowDownLeft className="h-4 w-4" />
                  <span>Withdraw Funds</span>
                </button>
                <Link 
                  to="/betting"
                  className={`w-full border text-white py-2 px-4 rounded-lg transition-all flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-400/30 hover:border-blue-400/50`}
                >
                  <Target className="h-4 w-4" />
                  <span>View Predictions</span>
                </Link>
                <Link 
                  to="/trading"
                  className={`w-full border text-white py-2 px-4 rounded-lg transition-all flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-400/30 hover:border-purple-400/50`}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Trading Signals</span>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {user.isActivated && (
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-300 text-sm">Account activated</span>
                    <span className="text-red-400 font-medium">-500 KES</span>
                  </div>
                )}
                {user.referrals > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-300 text-sm">Referral bonus</span>
                    <span className="text-green-400 font-medium">+200 KES</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-300 text-sm">Account created</span>
                  <span className="text-blue-400 font-medium">Welcome!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {/* Deposit Modal */}
        {showDepositModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-4">Deposit Funds</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Amount (KES)</label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                    placeholder="Enter amount"
                    min="100"
                  />
                  <p className="text-xs text-gray-400 mt-1">Minimum deposit: 100 KES</p>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">M-Pesa Confirmation Message</label>
                  <textarea
                    value={mpesaMessage}
                    onChange={(e) => setMpesaMessage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white h-24 resize-none"
                    placeholder="Paste your M-Pesa confirmation message here..."
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Example: RH123456789 Confirmed. You have received Ksh500.00 from JOHN DOE...
                  </p>
                </div>
                
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
                  <p className="text-blue-300 text-sm">
                    Send payment to <strong>0746082039</strong> then paste the confirmation message above. 
                    Admin will verify and add funds to your account.
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeposit}
                  disabled={processing || !depositAmount || !mpesaMessage}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-4">Withdraw Funds</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Amount (KES)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                    placeholder="Enter amount"
                    min="500"
                    max={user.balance}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Available: {user.balance} KES | Minimum: 500 KES
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Withdrawal Method</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="mpesa"
                        checked={withdrawMethod === 'mpesa'}
                        onChange={(e) => setWithdrawMethod(e.target.value)}
                        className="text-blue-600"
                      />
                      <Phone className="h-4 w-4 text-green-400" />
                      <span className="text-white">M-Pesa</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="bank"
                        checked={withdrawMethod === 'bank'}
                        onChange={(e) => setWithdrawMethod(e.target.value)}
                        className="text-blue-600"
                      />
                      <Building className="h-4 w-4 text-blue-400" />
                      <span className="text-white">Bank Transfer</span>
                    </label>
                  </div>
                </div>
                
                {withdrawMethod === 'mpesa' && (
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">M-Pesa Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="254700000000"
                    />
                  </div>
                )}
                
                {withdrawMethod === 'bank' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Bank Name</label>
                      <input
                        type="text"
                        value={bankDetails.bank}
                        onChange={(e) => setBankDetails({...bankDetails, bank: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        placeholder="e.g., KCB Bank"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Account Number</label>
                      <input
                        type="text"
                        value={bankDetails.account}
                        onChange={(e) => setBankDetails({...bankDetails, account: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        placeholder="Account number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Account Name</label>
                      <input
                        type="text"
                        value={bankDetails.name}
                        onChange={(e) => setBankDetails({...bankDetails, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white"
                        placeholder="Account holder name"
                      />
                    </div>
                  </div>
                )}
                
                <div className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-3">
                  <p className="text-orange-300 text-sm">
                    Withdrawal requests are processed within 24 hours after admin approval.
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={processing || !withdrawAmount || (withdrawMethod === 'mpesa' && !phoneNumber) || (withdrawMethod === 'bank' && (!bankDetails.bank || !bankDetails.account || !bankDetails.name))}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Activation Modal */}
        {showActivationModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-4">Account Activation</h3>
              
              <div className="space-y-4">
                <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-400 mb-2">500 KES</p>
                  <p className="text-gray-300 text-sm">Will be deducted from your balance</p>
                  <p className="text-gray-300 text-sm">Current balance: {user.balance} KES</p>
                </div>
                
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
                  <p className="text-blue-300 text-sm">
                    This fee activates your account and unlocks all earning features. 
                    Referral bonuses will be automatically processed if you were referred.
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowActivationModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleActivation}
                  disabled={processing || user.balance < 500}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {processing ? 'Processing...' : 'Activate Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;