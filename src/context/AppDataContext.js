import React, { createContext, useState, useEffect } from 'react';
import { useAuth, useSignIn, useSignUp, useUser, useClerk } from '@clerk/expo';
import * as SecureStore from 'expo-secure-store';

export const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);
  const [walletBalance, setWalletBalance] = useState(5000.0);
  const [betHistory, setBetHistory] = useState([]);
  const [currentTheme, setCurrentTheme] = useState('royalLight');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // persisted bank details
  const [isBankAdded, setIsBankAdded] = useState(false);
  const [savedBankName, setSavedBankName] = useState('');
  const [savedHolderName, setSavedHolderName] = useState('');
  const [savedAccountNo, setSavedAccountNo] = useState('');
  const [savedIfsc, setSavedIfsc] = useState('');
  const [savedUpiId, setSavedUpiId] = useState('');

  const getStoreKey = (email) => {
    if (!email) return '';
    return `user_data_${email.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
  };

  const loadUserData = async (email) => {
    try {
      // 1. Try loading from Clerk user unsafeMetadata if user is logged in
      if (user && !isGuest) {
        try {
          const data = user.unsafeMetadata;
          if (data && Object.keys(data).length > 0) {
            setWalletBalance(data.walletBalance ?? 5000.0);
            setBetHistory(data.betHistory ?? []);
            setIsBankAdded(data.isBankAdded ?? false);
            setSavedBankName(data.savedBankName ?? '');
            setSavedHolderName(data.savedHolderName ?? '');
            setSavedAccountNo(data.savedAccountNo ?? '');
            setSavedIfsc(data.savedIfsc ?? '');
            setSavedUpiId(data.savedUpiId ?? '');
            
            // Sync to local SecureStore cache
            const cacheData = {
              walletBalance: data.walletBalance ?? 5000.0,
              betHistory: data.betHistory ?? [],
              isBankAdded: data.isBankAdded ?? false,
              savedBankName: data.savedBankName ?? '',
              savedHolderName: data.savedHolderName ?? '',
              savedAccountNo: data.savedAccountNo ?? '',
              savedIfsc: data.savedIfsc ?? '',
              savedUpiId: data.savedUpiId ?? '',
            };
            await SecureStore.setItemAsync(getStoreKey(email), JSON.stringify(cacheData));
            return;
          }
        } catch (clerkError) {
          console.log("Clerk metadata load failed, falling back to local SecureStore:", clerkError.message);
        }
      }

      // 2. Local fallback (for offline or guest sessions)
      const key = getStoreKey(email);
      const dataStr = await SecureStore.getItemAsync(key);
      if (dataStr) {
        const data = JSON.parse(dataStr);
        setWalletBalance(data.walletBalance ?? 5000.0);
        setBetHistory(data.betHistory ?? []);
        setIsBankAdded(data.isBankAdded ?? false);
        setSavedBankName(data.savedBankName ?? '');
        setSavedHolderName(data.savedHolderName ?? '');
        setSavedAccountNo(data.savedAccountNo ?? '');
        setSavedIfsc(data.savedIfsc ?? '');
        setSavedUpiId(data.savedUpiId ?? '');
      } else {
        resetUserDataToDefault();
      }
    } catch (e) {
      console.error("Error loading user data:", e);
    }
  };

  const resetUserDataToDefault = () => {
    setWalletBalance(5000.0);
    setBetHistory([]);
    setIsBankAdded(false);
    setSavedBankName('');
    setSavedHolderName('');
    setSavedAccountNo('');
    setSavedIfsc('');
    setSavedUpiId('');
  };

  const saveUserData = async (email, overrides = {}) => {
    try {
      const key = getStoreKey(email);
      const currentData = {
        walletBalance: overrides.hasOwnProperty('walletBalance') ? overrides.walletBalance : walletBalance,
        betHistory: overrides.hasOwnProperty('betHistory') ? overrides.betHistory : betHistory,
        isBankAdded: overrides.hasOwnProperty('isBankAdded') ? overrides.isBankAdded : isBankAdded,
        savedBankName: overrides.hasOwnProperty('savedBankName') ? overrides.savedBankName : savedBankName,
        savedHolderName: overrides.hasOwnProperty('savedHolderName') ? overrides.savedHolderName : savedHolderName,
        savedAccountNo: overrides.hasOwnProperty('savedAccountNo') ? overrides.savedAccountNo : savedAccountNo,
        savedIfsc: overrides.hasOwnProperty('savedIfsc') ? overrides.savedIfsc : savedIfsc,
        savedUpiId: overrides.hasOwnProperty('savedUpiId') ? overrides.savedUpiId : savedUpiId,
      };
      
      // Save locally first
      await SecureStore.setItemAsync(key, JSON.stringify(currentData));

      // Save to Clerk user metadata asynchronously if logged in
      if (user && !isGuest) {
        try {
          await user.update({
            unsafeMetadata: currentData
          });
        } catch (clerkError) {
          console.error("Clerk metadata save error:", clerkError);
        }
      }
    } catch (e) {
      console.error("Error saving user data:", e);
    }
  };

  const initialMarkets = [
    { id: '1', title: 'DESAWAR', openTime: '10:00 PM', closeTime: '05:00 AM', currentResult: '52', isOpen: true },
    { id: '2', title: 'DELHI BAZAR', openTime: '11:00 AM', closeTime: '03:00 PM', currentResult: '19', isOpen: true },
    { id: '3', title: 'SHRI GANESH', openTime: '12:00 PM', closeTime: '04:30 PM', currentResult: '83', isOpen: true },
    { id: '4', title: 'FARIDABAD', openTime: '02:00 PM', closeTime: '06:00 PM', currentResult: '57', isOpen: true },
    { id: '5', title: 'GHAZIABAD', openTime: '04:00 PM', closeTime: '08:30 PM', currentResult: 'Waiting...', isOpen: true },
    { id: '6', title: 'GALI', openTime: '06:00 PM', closeTime: '11:50 PM', currentResult: 'Waiting...', isOpen: true },
    { id: '7', title: 'TAJ', openTime: '12:30 PM', closeTime: '03:15 PM', currentResult: '42', isOpen: true },
  ];

  const [markets, setMarkets] = useState(initialMarkets);

  const { isLoaded: isAuthLoaded, isSignedIn, signOut: clerkSignOut } = useAuth();
  const { user } = useUser();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { setActive } = useClerk();

  useEffect(() => {
    if (isSignedIn || user) {
      const email = user?.primaryEmailAddress?.emailAddress || 'user@gmail.com';
      setCurrentUserEmail(email);
      setCurrentUserName(user?.firstName || user?.fullName || user?.username || 'User');
      setIsGuest(false);
    } else if (!isGuest) {
      setCurrentUserEmail(null);
      setCurrentUserName(null);
    }
  }, [isSignedIn, user, isGuest]);

  useEffect(() => {
    if (currentUserEmail) {
      loadUserData(currentUserEmail);
    } else {
      resetUserDataToDefault();
    }
  }, [currentUserEmail]);

  useEffect(() => {
    console.log("Clerk loaded states:", { isAuthLoaded, isSignedIn, hasUser: !!user });
  }, [isAuthLoaded, isSignedIn, user]);

  useEffect(() => {
    if (isAuthLoaded) {
      const timer = setTimeout(() => {
        setIsInitialized(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthLoaded]);

  const loginUser = async (email, password) => {
    if (!isAuthLoaded) {
      throw new Error("Clerk authentication is not loaded yet. Please wait a moment.");
    }
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      const target = result || signIn;
      const status = target.status || signIn.status;
      const sessionId = target.createdSessionId || signIn.createdSessionId;
      
      if (status === 'complete') {
        await setActive({ session: sessionId });
        return true;
      } else {
        throw new Error(`Login status incomplete: ${status}`);
      }
    } catch (error) {
      console.error("Clerk login error:", error);
      throw error;
    }
  };

  const registerUser = async (email, password) => {
    if (!isAuthLoaded) {
      throw new Error("Clerk authentication is not loaded yet. Please wait a moment.");
    }
    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName: 'Player',
      });
      await signUp.verifications.sendEmailCode();
      return true;
    } catch (error) {
      console.error("Clerk signup error:", error);
      throw error;
    }
  };

  const verifyCode = async (code) => {
    if (!isAuthLoaded) {
      throw new Error("Clerk authentication is not loaded yet. Please wait a moment.");
    }
    try {
      console.log("Before verification - signUp.status:", signUp.status);
      const result = await signUp.verifications.verifyEmailCode({ code });
      console.log("Verification result:", result);
      console.log("After verification - signUp full object:", JSON.stringify(signUp));
      
      const target = result || signUp;
      const status = target.status || signUp.status;
      const sessionId = target.createdSessionId || signUp.createdSessionId;
      
      if (status === 'complete') {
        await setActive({ session: sessionId });
        return true;
      } else {
        throw new Error(`Verification status incomplete: ${status}`);
      }
    } catch (error) {
      console.error("Clerk OTP verification error:", error);
      throw error;
    }
  };

  const loginGuest = () => {
    setIsGuest(true);
    setCurrentUserEmail('guest@gomatka.com');
    setCurrentUserName('Guest Player');
  };

  const logoutUser = async () => {
    try {
      if (isGuest) {
        setIsGuest(false);
        setCurrentUserEmail(null);
        setCurrentUserName(null);
      } else {
        await clerkSignOut();
      }
    } catch (error) {
      console.error("Clerk signout error:", error);
    }
  };

  const addBet = (newBet) => {
    const updatedHistory = [newBet, ...betHistory];
    const updatedBalance = walletBalance - newBet.points;
    setBetHistory(updatedHistory);
    setWalletBalance(updatedBalance);
    if (currentUserEmail) {
      saveUserData(currentUserEmail, {
        betHistory: updatedHistory,
        walletBalance: updatedBalance
      });
    }
  };

  const addPoints = (amount) => {
    const updatedBalance = walletBalance + amount;
    setWalletBalance(updatedBalance);
    if (currentUserEmail) {
      saveUserData(currentUserEmail, { walletBalance: updatedBalance });
    }
  };

  const withdrawPoints = (amount) => {
    if (amount <= walletBalance) {
      const updatedBalance = walletBalance - amount;
      setWalletBalance(updatedBalance);
      if (currentUserEmail) {
        saveUserData(currentUserEmail, { walletBalance: updatedBalance });
      }
      return true;
    }
    return false;
  };

  const saveBankDetails = (bankName, holderName, accountNo, ifsc, upiId) => {
    setSavedBankName(bankName);
    setSavedHolderName(holderName);
    setSavedAccountNo(accountNo);
    setSavedIfsc(ifsc);
    setSavedUpiId(upiId);
    setIsBankAdded(true);
    if (currentUserEmail) {
      saveUserData(currentUserEmail, {
        savedBankName: bankName,
        savedHolderName: holderName,
        savedAccountNo: accountNo,
        savedIfsc: ifsc,
        savedUpiId: upiId,
        isBankAdded: true
      });
    }
  };

  return (
    <AppDataContext.Provider
      value={{
        isInitialized,
        currentUserEmail,
        currentUserName,
        walletBalance,
        betHistory,
        markets,
        currentTheme,
        isBankAdded,
        savedBankName,
        savedHolderName,
        savedAccountNo,
        savedIfsc,
        savedUpiId,
        loginUser,
        registerUser,
        verifyCode,
        loginGuest,
        logoutUser,
        addBet,
        addPoints,
        withdrawPoints,
        saveBankDetails,
        updateUserName: setCurrentUserName,
        setTheme: setCurrentTheme,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};
