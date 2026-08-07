import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

export default function TermsOfServiceScreen({ onClose }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onClose}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Terms of Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        <Text style={styles.headerText}>User Terms & Agreement</Text>
        <Text style={styles.dateText}>Last Updated: August 2026</Text>

        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>1. Introduction & Agreement</Text>
          <Text style={styles.paragraph}>
            Welcome to GoMatka ("Platform"). By registering, accessing, browsing, or using the Platform, mobile applications, or connected systems, you declare that you have read, understood, and agreed to be bound by these terms. If you disagree, do not use the app.
          </Text>

          <Text style={styles.sectionTitle}>2. Account Eligibility & Verification</Text>
          <Text style={styles.paragraph}>
            Participation in bidding matches is strictly restricted to individuals of 18 years of age or older. You are required to submit accurate verification details upon registration. Sharing account access with third parties or allowing minors to access your wallet is strictly prohibited and constitutes a breach of contract.
          </Text>

          <Text style={styles.sectionTitle}>3. Point System & Conversion Rules</Text>
          <Text style={styles.paragraph}>
            All gameplay, bid placement, and transactions within the platform are tracked using virtual points. 1 Point is fixed at the rate of ₹1 INR. Points hold no external retail value and are non-transferable outside the registered account.
          </Text>

          <Text style={styles.sectionTitle}>4. Bid Placements & Timings</Text>
          <Text style={styles.paragraph}>
            Bids can only be placed within the open window duration of each respective market. Once submitted, a bid cannot be canceled, amended, or refunded. GoMatka is not responsible for lag, internet failure, or synchronization delays that prevent users from submitting bids before market closing times.
          </Text>

          <Text style={styles.sectionTitle}>5. Deposit Verification Compliance</Text>
          <Text style={styles.paragraph}>
            When adding points, you must complete the bank transfer or UPI transfer first, and then enter the correct 12-digit UTR/Txn reference ID. Entering false, duplicate, or mock transaction IDs will result in automatic account locking and forfeiture of existing wallet balances.
          </Text>

          <Text style={styles.sectionTitle}>6. Payout & Withdrawal Policies</Text>
          <Text style={styles.paragraph}>
            Withdrawals are processed during bank working hours and settled directly to your verified bank account or UPI destination. The minimum withdrawal limit is ₹500. Processing times usually range from 4 to 6 business hours but may extend during bank holidays, server maintenance, or fraud checks.
          </Text>

          <Text style={styles.sectionTitle}>7. Anti-Cheating & System Abuse</Text>
          <Text style={styles.paragraph}>
            We employ automated algorithms to detect multi-accounting, syndicate bidding, automated scripts, and emulator-based bots. If any user is found exploiting software glitches, their account will be permanently blacklisted, and all pending withdrawals will be canceled.
          </Text>

          <Text style={styles.sectionTitle}>8. Platform Availability & Liability</Text>
          <Text style={styles.paragraph}>
            GoMatka does not guarantee continuous, uninterrupted, or secure access to our application. Platform operations may be suspended temporarily for system updates, hardware repairs, or external network failures without prior notice.
          </Text>

          <Text style={styles.sectionTitle}>9. Indemnification & Claims</Text>
          <Text style={styles.paragraph}>
            You agree to defend, indemnify, and hold harmless GoMatka, its developers, directors, and partner agencies from any claims, loss, liability, or damage arising from your use of the application, violation of these terms, or infringement of third-party rights.
          </Text>

          <Text style={styles.sectionTitle}>10. Governance & Legal Jurisdiction</Text>
          <Text style={styles.paragraph}>
            These terms of service shall be governed by, and construed in accordance with, applicable national laws. Any legal disputes or claims arising out of the platform use will be settled within the exclusive jurisdiction of the designated local courts.
          </Text>

          <Text style={styles.sectionTitle}>11. Amendments & Updates</Text>
          <Text style={styles.paragraph}>
            We reserve the right to revise or update these terms at any time. All revisions are effective immediately upon publishing. It is the user's responsibility to periodically review these terms to remain compliant with Platform regulations.
          </Text>

          <Text style={styles.sectionTitle}>12. Termination of Accounts</Text>
          <Text style={styles.paragraph}>
            GoMatka reserves the absolute right to suspend, terminate, or delete any user account at our sole discretion, without explaining the reason, if we suspect unethical behavior, money laundering, or breach of platform policies.
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
