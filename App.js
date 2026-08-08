import React, { useContext, useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Platform, StatusBar, Animated, LogBox } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppDataProvider, AppDataContext } from './src/context/AppDataContext';
import { Colors } from './src/theme/colors';
import { ClerkProvider } from '@clerk/expo';

LogBox.ignoreAllLogs();
import * as SecureStore from 'expo-secure-store';
import AuthScreen from './src/screens/AuthScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import LiveResultsScreen from './src/screens/LiveResultsScreen';
import BetHistoryScreen from './src/screens/BetHistoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PlaceBetScreen from './src/screens/PlaceBetScreen';
import PlayLoader from './src/components/PlayLoader';
import DepositScreen from './src/screens/DepositScreen';
import WithdrawScreen from './src/screens/WithdrawScreen';
import BankDetailsScreen from './src/screens/BankDetailsScreen';
import TermsOfServiceScreen from './src/screens/TermsOfServiceScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import ContactSupportScreen from './src/screens/ContactSupportScreen';
import SplashScreen from './src/screens/SplashScreen';

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item;
    } catch (error) {
      console.error('SecureStore get item error: ', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
console.log("CLERK KEY DETECTED:", publishableKey);

function TabButton({ isActive, iconActive, iconInactive, label, onPress }) {
  const scaleAnim = useRef(new Animated.Value(isActive ? 1.08 : 1.0)).current;
  const dotOpacity = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1.08 : 1.0,
        useNativeDriver: true,
        friction: 6,
        tension: 45,
      }),
      Animated.timing(dotOpacity, {
        toValue: isActive ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      })
    ]).start();
  }, [isActive]);

  return (
    <TouchableOpacity 
      style={styles.tabItem} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons 
          name={isActive ? iconActive : iconInactive} 
          size={19} 
          color={isActive ? Colors.primary : Colors.textSecondary} 
        />
        <Text style={[styles.tabLabel, { color: isActive ? Colors.primary : Colors.textSecondary, marginTop: 2 }]}>
          {label}
        </Text>
        <Animated.View style={[styles.activeDot, { opacity: dotOpacity }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

function MainAppShell() {
  const { isInitialized, currentUserEmail } = useContext(AppDataContext);
  const [currentTab, setCurrentTab] = useState(0); // 0 = Home, 1 = Results, 2 = Bets, 3 = Profile
  const [activeBetMarket, setActiveBetMarket] = useState(null);
  const [showPlayLoader, setShowPlayLoader] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showBankSettings, setShowBankSettings] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  const handleSelectMarket = (market) => {
    setShowPlayLoader(true);
    setTimeout(() => {
      setShowPlayLoader(false);
      setActiveBetMarket(market);
    }, 2000);
  };

  if (!isInitialized) {
    return <SplashScreen />;
  }

  const renderActiveTab = () => {
    switch (currentTab) {
      case 0:
        return (
          <DashboardScreen 
            onNavigate={(index) => {
              if (index === 4) setShowDeposit(true);
              else if (index === 5) setShowWithdraw(true);
              else setCurrentTab(index);
            }} 
            onSelectMarket={handleSelectMarket} 
          />
        );
      case 1:
        return <LiveResultsScreen />;
      case 2:
        return <BetHistoryScreen />;
      case 3:
        return (
          <ProfileScreen 
            onGoToBankSettings={() => setShowBankSettings(true)} 
            onGoToTerms={() => setShowTerms(true)}
            onGoToSupport={() => setShowSupport(true)}
            onGoToPrivacy={() => setShowPrivacy(true)}
          />
        );
      default:
        return <DashboardScreen />;
    }
  };

  const renderScreen = () => {
    if (!currentUserEmail) {
      return <AuthScreen />;
    }

    if (showDeposit) {
      return <DepositScreen onClose={() => setShowDeposit(false)} />;
    }

    if (showWithdraw) {
      return (
        <WithdrawScreen 
          onClose={() => setShowWithdraw(false)} 
          onGoToBankSettings={() => {
            setShowWithdraw(false);
            setShowBankSettings(true);
          }}
        />
      );
    }

    if (showBankSettings) {
      return <BankDetailsScreen onClose={() => setShowBankSettings(false)} />;
    }

    if (showTerms) {
      return <TermsOfServiceScreen onClose={() => setShowTerms(false)} />;
    }

    if (showPrivacy) {
      return <PrivacyPolicyScreen onClose={() => setShowPrivacy(false)} />;
    }

    if (showSupport) {
      return <ContactSupportScreen onClose={() => setShowSupport(false)} />;
    }

    if (activeBetMarket) {
      return (
        <PlaceBetScreen 
          market={activeBetMarket} 
          onClose={() => setActiveBetMarket(null)} 
        />
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.tabContent}>
          {renderActiveTab()}
        </View>
        
        {/* Custom Floating Bottom Tab Navigation */}
        <View style={styles.tabBar}>
          <TabButton 
            isActive={currentTab === 0} 
            iconActive="home" 
            iconInactive="home-outline" 
            label="Home" 
            onPress={() => setCurrentTab(0)} 
          />
          <TabButton 
            isActive={currentTab === 1} 
            iconActive="trophy" 
            iconInactive="trophy-outline" 
            label="Results" 
            onPress={() => setCurrentTab(1)} 
          />
          <TabButton 
            isActive={currentTab === 2} 
            iconActive="time" 
            iconInactive="time-outline" 
            label="Bets" 
            onPress={() => setCurrentTab(2)} 
          />
          <TabButton 
            isActive={currentTab === 3} 
            iconActive="person" 
            iconInactive="person-outline" 
            label="Profile" 
            onPress={() => setCurrentTab(3)} 
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      <PlayLoader visible={showPlayLoader} />
    </View>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <AppDataProvider>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
        <MainAppShell />
      </AppDataProvider>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    height: 64,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(241, 245, 249, 0.9)',
    paddingBottom: 0,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 3,
  },
});
