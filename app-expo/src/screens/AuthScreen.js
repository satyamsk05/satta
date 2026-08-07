import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { AppDataContext } from '../context/AppDataContext';
import { Colors } from '../theme/colors';

export default function AuthScreen() {
  const { loginUser, registerUser } = useContext(AppDataContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async () => {
    if (!phone || !password || (isSignUp && !name)) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    setLoading(true);
    try {
      if (isSignUp) {
        await registerUser(phone, name, password);
        Alert.alert('Success', 'Registration completed!');
      } else {
        await loginUser(phone, password);
        Alert.alert('Success', 'Logged in successfully!');
      }
    } catch (e) {
      Alert.alert('Error', 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      // Mock login as Guest Player
      await loginUser('9876543210', 'guest');
    } catch (e) {
      Alert.alert('Error', 'Failed to skip login');
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
        <Text style={styles.formTitle}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>
        
        {isSignUp && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, focusedField === 'name' && styles.inputFocused]}
              placeholder="John Doe"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, focusedField === 'phone' && styles.inputFocused]}
            placeholder="Enter 10 digit number"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            onFocus={() => setFocusedField('phone')}
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

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>{isSignUp ? 'REGISTER' : 'LOGIN'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchBtn} onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={styles.switchText}>
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Register"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip & Explore as Guest →</Text>
        </TouchableOpacity>
      </View>
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
});
