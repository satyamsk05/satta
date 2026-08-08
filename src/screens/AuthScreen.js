import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppDataContext } from '../context/AppDataContext';
import { Colors } from '../theme/colors';

export default function AuthScreen() {
  const { loginUser, registerUser, verifyCode, loginGuest } = useContext(AppDataContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Custom Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('info'); // 'success' | 'error' | 'info'
  const [alertOnClose, setAlertOnClose] = useState(null);

  const showAlert = (title, message, type = 'info', onClose = null) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertOnClose(() => onClose);
    setAlertVisible(true);
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
    if (alertOnClose) {
      alertOnClose();
    }
  };

  const handleSubmit = async () => {
    if (isVerifying) {
      if (!code) {
        showAlert('Error', 'Please enter verification code', 'error');
        return;
      }
      setLoading(true);
      try {
        await verifyCode(code);
        showAlert('Success', 'Verification completed & logged in successfully!', 'success');
      } catch (e) {
        showAlert('Error', e.message || 'Verification failed', 'error');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email || !password) {
      showAlert('Error', 'Please fill all fields', 'error');
      return;
    }
    
    setLoading(true);
    try {
      if (isSignUp) {
        await registerUser(email, password);
        setIsVerifying(true);
        showAlert('Verify OTP', 'Please enter the verification code sent to your email.', 'info');
      } else {
        await loginUser(email, password);
        showAlert('Success', 'Logged in successfully!', 'success');
      }
    } catch (e) {
      showAlert('Error', e.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      // Mock login as Guest Player
      await loginGuest();
    } catch (e) {
      showAlert('Error', 'Failed to skip login', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandContainer}>
        <Text style={styles.brandGo}>GO<Text style={styles.brandMatka}>MATKA</Text></Text>
        <Text style={styles.brandSubtitle}>Clean, Minimalist Satta Play</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>
          {isVerifying ? 'Verify Your Account' : (isSignUp ? 'Create Account' : 'Welcome Back')}
        </Text>
        
        {isVerifying ? (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Verification Code</Text>
            <TextInput
              style={[styles.input, focusedField === 'code' && styles.inputFocused]}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
              onFocus={() => setFocusedField('code')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        ) : (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, focusedField === 'email' && styles.inputFocused]}
                placeholder="john.doe@gmail.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, focusedField === 'password' && styles.inputFocused]}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </>
        )}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>
              {isVerifying ? 'VERIFY' : (isSignUp ? 'REGISTER' : 'LOGIN')}
            </Text>
          )}
        </TouchableOpacity>

        {isVerifying ? (
          <TouchableOpacity style={styles.switchBtn} onPress={() => setIsVerifying(false)}>
            <Text style={styles.switchText}>← Back to registration</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.switchBtn} onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.switchText}>
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Register"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip & Explore as Guest →</Text>
        </TouchableOpacity>
      </View>

      {/* Custom alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertVisible}
        onRequestClose={handleAlertClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.iconContainer}>
              {alertType === 'success' && (
                <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
              )}
              {alertType === 'error' && (
                <Ionicons name="close-circle" size={48} color={Colors.error} />
              )}
              {alertType === 'info' && (
                <Ionicons name="information-circle" size={48} color={Colors.primary} />
              )}
            </View>
            <Text style={styles.modalTitle}>{alertTitle}</Text>
            <Text style={styles.modalMessage}>{alertMessage}</Text>
            <TouchableOpacity 
              style={[
                styles.modalBtn, 
                alertType === 'success' && { backgroundColor: Colors.success },
                alertType === 'error' && { backgroundColor: Colors.error },
                alertType === 'info' && { backgroundColor: Colors.primary }
              ]} 
              onPress={handleAlertClose}
            >
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // Theme background
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  brandGo: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  brandMatka: {
    color: Colors.success,
  },
  brandSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 8,
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    color: Colors.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    transition: 'all 0.2s ease',
  },
  inputFocused: {
    borderColor: Colors.success,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: Colors.surface,
  },
  submitBtn: {
    backgroundColor: Colors.success,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  switchBtn: {
    alignItems: 'center',
    marginTop: 20,
  },
  switchText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  skipBtn: {
    alignItems: 'center',
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  skipText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    fontWeight: '500',
  },
  modalBtn: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
