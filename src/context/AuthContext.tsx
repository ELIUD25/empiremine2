import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  isActivated: boolean;
  balance: number;
  referralCode: string;
  referrals: number;
  totalEarnings: number;
  referredBy?: string;
  referralLink: string;
  activatedAt?: string;
  registeredAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  register: (email: string, password: string, name: string, referralCode?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  processReferralBonus: (referrerId: string, level: number) => void;
  processActivation: (userId: string) => void;
  processDeposit: (userId: string, amount: number) => void;
  getAllUsers: () => User[];
  checkReferralCode: (code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load users from localStorage
    const storedUsers = localStorage.getItem('empire_mine_users');
    if (storedUsers) {
      setAllUsers(JSON.parse(storedUsers));
    } else {
      // Initialize with admin user
      const adminUser: User = {
        id: 'admin_1',
        email: 'admin@empiremine.com',
        name: 'Admin',
        role: 'admin',
        isActivated: true,
        balance: 10000,
        referralCode: 'ADMIN001',
        referrals: 0,
        totalEarnings: 0,
        referralLink: 'https://empiremine.com/register?ref=admin_1',
        registeredAt: new Date().toISOString()
      };
      setAllUsers([adminUser]);
      localStorage.setItem('empire_mine_users', JSON.stringify([adminUser]));
    }

    // Check for existing session
    const storedUser = localStorage.getItem('empire_mine_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Ensure referral link exists
      if (!userData.referralLink) {
        userData.referralLink = `https://empiremine.com/register?ref=${userData.id}`;
      }
      setUser(userData);
    }
    setLoading(false);
  }, []);

  // Save users to localStorage whenever allUsers changes
  useEffect(() => {
    if (allUsers.length > 0) {
      localStorage.setItem('empire_mine_users', JSON.stringify(allUsers));
    }
  }, [allUsers]);

  const generateReferralLink = (userId: string) => {
    return `https://empiremine.com/register?ref=${userId}`;
  };

  const generateReferralCode = () => {
    return 'EM' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const checkReferralCode = async (code: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if referral code exists in any user
    return allUsers.some(user => user.referralCode === code.toUpperCase());
  };

  const login = async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in allUsers array
    const foundUser = allUsers.find(u => u.email === email);
    
    if (!foundUser) {
      throw new Error('User not found');
    }
    
    setUser(foundUser);
    localStorage.setItem('empire_mine_user', JSON.stringify(foundUser));
  };

  const register = async (email: string, password: string, name: string, referralCode?: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if referral code is valid
    if (referralCode && !await checkReferralCode(referralCode)) {
      throw new Error('Invalid referral code');
    }
    
    const userId = Math.random().toString(36).substr(2, 9);
    
    const mockUser: User = {
      id: userId,
      email,
      name,
      role: 'user',
      isActivated: false,
      balance: 0,
      referralCode: generateReferralCode(),
      referrals: 0,
      totalEarnings: 0,
      referredBy: referralCode || undefined,
      referralLink: generateReferralLink(userId),
      registeredAt: new Date().toISOString()
    };
    
    // Add to allUsers
    setAllUsers(prev => [...prev, mockUser]);
    
    setUser(mockUser);
    localStorage.setItem('empire_mine_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('empire_mine_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('empire_mine_user', JSON.stringify(updatedUser));
      
      // Update in allUsers array
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  const processReferralBonus = (referrerId: string, level: number) => {
    // This would be called when a user's activation is approved
    // Level 1: 200 KES, Level 2: 150 KES, Level 3: 50 KES
    const bonusAmounts = { 1: 200, 2: 150, 3: 50 };
    const bonus = bonusAmounts[level as keyof typeof bonusAmounts] || 0;
    
    // Update referrer's balance and referral count
    setAllUsers(prev => prev.map(u => {
      if (u.id === referrerId) {
        return {
          ...u,
          balance: u.balance + bonus,
          referrals: level === 1 ? u.referrals + 1 : u.referrals,
          totalEarnings: u.totalEarnings + bonus
        };
      }
      return u;
    }));
    
    // If current user is the referrer, update their state too
    if (user && user.id === referrerId) {
      updateUser({ 
        balance: user.balance + bonus,
        referrals: level === 1 ? user.referrals + 1 : user.referrals,
        totalEarnings: user.totalEarnings + bonus
      });
    }
  };

  const processActivation = (userId: string) => {
    // Automatically deduct 500 KES from user balance and activate account
    const userToActivate = allUsers.find(u => u.id === userId);
    if (userToActivate && userToActivate.balance >= 500) {
      const updatedUser = { 
        ...userToActivate,
        balance: userToActivate.balance - 500, 
        isActivated: true,
        activatedAt: new Date().toISOString()
      };
      
      // Update in allUsers
      setAllUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      
      // If it's the current user, update their state
      if (user && user.id === userId) {
        setUser(updatedUser);
        localStorage.setItem('empire_mine_user', JSON.stringify(updatedUser));
      }
      
      // Process referral bonuses if user was referred
      if (userToActivate.referredBy) {
        const referrer = allUsers.find(u => u.referralCode === userToActivate.referredBy);
        if (referrer) {
          processReferralBonus(referrer.id, 1);
          
          // Process 2nd level referral if referrer was also referred
          if (referrer.referredBy) {
            const secondLevelReferrer = allUsers.find(u => u.referralCode === referrer.referredBy);
            if (secondLevelReferrer) {
              processReferralBonus(secondLevelReferrer.id, 2);
              
              // Process 3rd level referral
              if (secondLevelReferrer.referredBy) {
                const thirdLevelReferrer = allUsers.find(u => u.referralCode === secondLevelReferrer.referredBy);
                if (thirdLevelReferrer) {
                  processReferralBonus(thirdLevelReferrer.id, 3);
                }
              }
            }
          }
        }
      }
    }
  };

  const processDeposit = (userId: string, amount: number) => {
    // Automatically add deposit to user balance
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, balance: u.balance + amount };
      }
      return u;
    }));
    
    if (user && user.id === userId) {
      updateUser({ balance: user.balance + amount });
    }
  };

  const getAllUsers = () => {
    return allUsers;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    processReferralBonus,
    processActivation,
    processDeposit,
    getAllUsers,
    checkReferralCode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};