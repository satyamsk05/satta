import React, { createContext, useState, useEffect } from 'react';

export const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [currentUserPhone, setCurrentUserPhone] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);
  const [walletBalance, setWalletBalance] = useState(5000.0);
  const [betHistory, setBetHistory] = useState([]);
  const [currentTheme, setCurrentTheme] = useState('royalLight');
  const [isInitialized, setIsInitialized] = useState(false);

  // persisted bank details
  const [isBankAdded, setIsBankAdded] = useState(false);
  const [savedBankName, setSavedBankName] = useState('');
  const [savedHolderName, setSavedHolderName] = useState('');
  const [savedAccountNo, setSavedAccountNo] = useState('');
  const [savedIfsc, setSavedIfsc] = useState('');
  const [savedUpiId, setSavedUpiId] = useState('');

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

  useEffect(() => {
    // Initialise app state mockup delay
    setTimeout(() => {
      setIsInitialized(true);
    }, 1000);
  }, []);

  const loginUser = async (phone, password) => {
    setCurrentUserPhone(phone);
    setCurrentUserName('Satta King ' + phone.substring(phone.length - 4));
    setWalletBalance(2500.0);
    return true;
  };

  const registerUser = async (phone, name, password) => {
    setCurrentUserPhone(phone);
    setCurrentUserName(name);
    setWalletBalance(1000.0);
    return true;
  };

  const logoutUser = () => {
    setCurrentUserPhone(null);
    setCurrentUserName(null);
  };

  const addBet = (newBet) => {
    setBetHistory((prev) => [newBet, ...prev]);
    setWalletBalance((prev) => prev - newBet.points);
  };

  const addPoints = (amount) => {
    setWalletBalance((prev) => prev + amount);
  };

  const withdrawPoints = (amount) => {
    if (amount <= walletBalance) {
      setWalletBalance((prev) => prev - amount);
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
  };

  return (
    <AppDataContext.Provider
      value={{
        isInitialized,
        currentUserPhone,
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
