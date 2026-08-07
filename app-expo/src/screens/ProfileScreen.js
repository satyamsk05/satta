import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Share, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppDataContext } from '../context/AppDataContext';
import { Colors } from '../theme/colors';

export default function ProfileScreen({ 
  onGoToBankSettings, 
  onGoToChangePassword, 
  onGoToTerms, 
  onGoToSupport, 
  onGoToPrivacy 
}) {
  const { currentUserName, currentUserPhone, logoutUser, updateUserName } = useContext(AppDataContext);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentUserName || '');

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logoutUser },
    ]);
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Play Matka on GoMatka App! Download now and get instant payouts: https://gomatka.com',
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share app link');
    }
  };

  const handleRateApp = () => {
    Alert.alert('Rate Application', 'Enjoying GoMatka? Tap 5 stars to show your support!', [
      { text: 'Later', style: 'cancel' },
      { text: '5 Stars ⭐⭐⭐⭐⭐', onPress: () => Alert.alert('Thank You', 'Thank you for your rating!') }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Profile Settings</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {currentUserName ? currentUserName[0].toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.details}>
            {isEditingName ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.nameInput}
                  value={tempName}
                  onChangeText={setTempName}
                  placeholder="Enter name"
                  placeholderTextColor={Colors.textSecondary}
                  autoFocus
                />
                <TouchableOpacity style={styles.saveBtn} onPress={() => {
                  if (!tempName.trim()) {
                    Alert.alert('Error', 'Name cannot be empty');
                    return;
                  }
                  updateUserName(tempName.trim());
                  setIsEditingName(false);
                }}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => {
                  setTempName(currentUserName || '');
                  setIsEditingName(false);
                }}>
                  <Ionicons name="close-circle" size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.nameRow}>
                <Text style={styles.name}>{currentUserName || 'User'}</Text>
                <TouchableOpacity onPress={() => {
                  setTempName(currentUserName || '');
                  setIsEditingName(true);
                }}>
                  <Ionicons name="create-outline" size={16} color={Colors.primary} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              </View>
            )}
            <Text style={styles.phone}>{currentUserPhone || '+91'}</Text>
          </View>
        </View>

        {/* Account Settings Header */}
        <Text style={styles.sectionHeader}>ACCOUNT SETTINGS</Text>

        {/* Grid 2x2 */}
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.gridCard} onPress={onGoToChangePassword}>
            <View style={styles.iconCircle}>
              <Ionicons name="key-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Change Password</Text>
            <Text style={styles.cardSubtitle}>Update credentials</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.gridCard} onPress={onGoToBankSettings}>
            <View style={styles.iconCircle}>
              <Ionicons name="business-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Bank Accounts</Text>
            <Text style={styles.cardSubtitle}>Payout settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard} onPress={onGoToTerms}>
            <View style={styles.iconCircle}>
              <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Terms of Service</Text>
            <Text style={styles.cardSubtitle}>App usage rules</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard} onPress={onGoToSupport}>
            <View style={styles.iconCircle}>
              <Ionicons name="call-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Contact Support</Text>
            <Text style={styles.cardSubtitle}>Get instant help</Text>
          </TouchableOpacity>
        </View>

        {/* More Section */}
        <Text style={styles.sectionHeader}>MORE INFORMATION</Text>
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.gridCard} onPress={onGoToPrivacy}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Privacy Policy</Text>
            <Text style={styles.cardSubtitle}>How we secure data</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard} onPress={handleShareApp}>
            <View style={styles.iconCircle}>
              <Ionicons name="share-social-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Share App</Text>
            <Text style={styles.cardSubtitle}>Invite friends</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard} onPress={handleRateApp}>
            <View style={styles.iconCircle}>
              <Ionicons name="star-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Rate App</Text>
            <Text style={styles.cardSubtitle}>Support developers</Text>
          </TouchableOpacity>

          <View style={styles.gridCardDisabled}>
            <View style={styles.iconCircle}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.textSecondary} />
            </View>
            <Text style={styles.cardTitleDisabled}>App Version</Text>
            <Text style={styles.cardSubtitle}>v1.0.0</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.logoutBtnText}>LOGOUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  appBar: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  details: {
    marginLeft: 16,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  nameInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    paddingVertical: 2,
    marginRight: 8,
    flex: 1,
  },
  saveBtn: {
    padding: 4,
    marginRight: 4,
  },
  cancelBtn: {
    padding: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  phone: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gridCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    alignItems: 'flex-start',
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  gridCardDisabled: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    alignItems: 'flex-start',
    marginBottom: 12,
    opacity: 0.8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  cardTitleDisabled: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 9,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.error,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 10,
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
