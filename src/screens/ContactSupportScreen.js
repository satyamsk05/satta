import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

export default function ContactSupportScreen({ onClose }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(null);

  const handleSubmit = () => {
    if (!subject || !message) {
      Alert.alert('Error', 'Please fill in both Subject and Message.');
      return;
    }

    Alert.alert('Success', 'Your support ticket has been submitted! Our agent will contact you shortly.', [
      { text: 'OK', onPress: onClose }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onClose}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Contact Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>How can we help?</Text>
        <Text style={styles.subtitleText}>Our support team is active 24/7 to resolve deposit, withdrawal, and gameplay issues.</Text>

        {/* Quick Contact Links */}
        <View style={styles.quickLinksCard}>
          <TouchableOpacity style={styles.linkItem} onPress={() => Alert.alert('Support Helpline', 'Calling support: +91 99999 88888')}>
            <Ionicons name="call" size={18} color={Colors.success} />
            <View style={styles.linkTextContainer}>
              <Text style={styles.linkTitle}>Call Support Helpline</Text>
              <Text style={styles.linkSubtitle}>+91 99999 88888</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem} onPress={() => Alert.alert('WhatsApp Chat', 'Opening WhatsApp Support...')} style={[styles.linkItem, { borderBottomWidth: 0 }]}>
            <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
            <View style={styles.linkTextContainer}>
              <Text style={styles.linkTitle}>WhatsApp Support</Text>
              <Text style={styles.linkSubtitle}>Instant chat responses</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Support Ticket Form */}
        <Text style={styles.sectionHeader}>SUBMIT A SUPPORT TICKET</Text>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={[styles.input, isFocused === 'subject' && styles.inputFocused]}
              placeholder="e.g. Deposit not credited"
              placeholderTextColor="#94A3B8"
              value={subject}
              onChangeText={setSubject}
              onFocus={() => setIsFocused('subject')}
              onBlur={() => setIsFocused(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description Message</Text>
            <TextInput
              style={[styles.input, styles.textArea, isFocused === 'message' && styles.inputFocused]}
              placeholder="Provide transaction details or issue description..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={message}
              onChangeText={setMessage}
              onFocus={() => setIsFocused('message')}
              onBlur={() => setIsFocused(null)}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>SEND SUPPORT MESSAGE</Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 10,
    letterSpacing: 0.8,
  },
  quickLinksCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  linkTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  linkTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  linkSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFFFF',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
