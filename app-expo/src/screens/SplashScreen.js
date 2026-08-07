import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { Colors } from '../theme/colors';

export default function SplashScreen() {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Run animations sequentially and in parallel
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1.0,
          useNativeDriver: true,
          friction: 6,
          tension: 40,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress Bar Animation
    Animated.timing(progressWidth, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // width requires layout calculation
    }).start();
  }, []);

  // Interpolate progress width
  const animatedWidth = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Animated Brand Logo */}
        <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity, alignItems: 'center' }}>
          <Text style={styles.brandGo}>
            GO<Text style={styles.brandMatka}>MATKA</Text>
          </Text>
        </Animated.View>

        {/* Animated Subtitle */}
        <Animated.View style={{ opacity: textOpacity, alignItems: 'center', marginTop: 12 }}>
          <Text style={styles.brandSubtitle}>Clean, Minimalist Satta Play</Text>
        </Animated.View>
      </View>

      {/* Progress Indicator Container */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <Animated.View style={[styles.progressBarFill, { width: animatedWidth }]} />
        </View>
        <Text style={styles.loadingText}>Initializing secure environment...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  brandGo: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 3,
  },
  brandMatka: {
    color: Colors.success,
  },
  brandSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  progressContainer: {
    width: '60%',
    alignItems: 'center',
    marginBottom: 60,
  },
  progressBarBg: {
    height: 4,
    width: '100%',
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
