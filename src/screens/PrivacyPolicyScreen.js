import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

export default function PrivacyPolicyScreen({ onClose }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onClose}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        <Text style={styles.headerText}>Data Protection Policy</Text>
        <Text style={styles.dateText}>Last Updated: August 2026</Text>

        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>1. Data Collection Scope</Text>
          <Text style={styles.paragraph}>
            We gather specific personal details during your account registration, which include your mobile contact number, customized profile username, and chosen system login credentials. Additionally, payment setup details such as UPI IDs, holder names, account numbers, and IFSC codes are collected.
          </Text>

          <Text style={styles.sectionTitle}>2. How We Use Collected Data</Text>
          <Text style={styles.paragraph}>
            Your information is exclusively utilized to maintain your gaming profile, verify UTR deposits, process bank withdrawals, secure wallets, and prevent malicious actions on the Platform. We also monitor login session details to prevent double-access attempts.
          </Text>

          <Text style={styles.sectionTitle}>3. Financial Security & Encryption</Text>
          <Text style={styles.paragraph}>
            All financial transaction paths and details are processed over secure SSL networks. Bank account credentials and UPI addresses are encrypted at rest using industry-standard hashing algorithms (AES-256) inside our database records.
          </Text>

          <Text style={styles.sectionTitle}>4. Disclosure to Third Parties</Text>
          <Text style={styles.paragraph}>
            GoMatka does not sell, lease, trade, or distribute user details to third-party advertising services. Personal data is only shared with trusted financial settlement APIs and SMS verification gateways to complete transactions.
          </Text>

          <Text style={styles.sectionTitle}>5. Data Retention & Expiry Logs</Text>
          <Text style={styles.paragraph}>
            We retain player profile history and transaction logs as long as the account remains active. If you request account closure, your transaction references and phone listings will be securely archived or deleted from our primary servers.
          </Text>

          <Text style={styles.sectionTitle}>6. Cookies, Local Cache, and Storage</Text>
          <Text style={styles.paragraph}>
            The Platform uses temporary local storage cache settings to save your active user session tokens. This ensures that you stay logged in while switching screens. We do not use tracking cookies for external retargeting ads.
          </Text>

          <Text style={styles.sectionTitle}>7. Device Information Logs</Text>
          <Text style={styles.paragraph}>
            When using the app, we log basic technical details like device OS type, hardware model, IP address, and push notification configurations to customize interface responsiveness and deliver match result alerts.
          </Text>

          <Text style={styles.sectionTitle}>8. User Rights & Profile Control</Text>
          <Text style={styles.paragraph}>
            You have the right to access your stored profile configurations at any time. You can edit withdrawal accounts, update security passwords, or request absolute deletion of all personal entries by contacting our customer support help desk.
          </Text>

          <Text style={styles.sectionTitle}>9. Network Intrusion Protections</Text>
          <Text style={styles.paragraph}>
            We run automated system firewall checks, rate-limit queries, and check inputs to block SQL injections, DDoS attacks, and cross-site scripting vulnerabilities, protecting our users' assets.
          </Text>

          <Text style={styles.sectionTitle}>10. Children's Protection Policy</Text>
          <Text style={styles.paragraph}>
            The platform is strictly meant for players above 18 years of age. We do not knowingly save records of children. Any account suspected of belonging to a minor will be immediately deleted.
          </Text>

          <Text style={styles.sectionTitle}>11. Policy Changes & Notifications</Text>
          <Text style={styles.paragraph}>
            We may modify this privacy policy to match new legal guidelines or system upgrades. Active players will receive notification warnings or dashboard alerts when important data policy changes take place.
          </Text>

          <Text style={styles.sectionTitle}>12. Data Protection Contact</Text>
          <Text style={styles.paragraph}>
            For query reports, data access requests, or file deletion submissions, please connect directly with our designated Data Protection Officer (DPO) via the Whatsapp Support channel or the contact support email listed inside the app.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  appBar: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginLeft: 6,
  },
  appBarTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 45,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 24,
    fontWeight: '500',
  },
  contentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  paragraph: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
});
