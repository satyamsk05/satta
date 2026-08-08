import { useAuth, useSignUp } from '@clerk/expo'
import { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'

export default function MainScreen() {
  const { isLoaded, isSignedIn } = useAuth()
  const { signUp } = useSignUp()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const handleSignUp = async () => {
    try {
      const { error } = await signUp.create({ emailAddress, password })
      if (error) {
        console.error("SignUp creation error:", error)
        return
      }

      const { error: sendError } = await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      if (sendError) {
        console.error("SignUp send code error:", sendError)
        return
      }

      setIsVerifying(true)
    } catch (e) {
      console.error("SignUp error:", e)
    }
  }

  const handleVerify = async () => {
    try {
      const { error } = await signUp.attemptEmailAddressVerification({ code })
      if (error) {
        console.error("Verification error:", error)
        return
      }
      // Note: Clerk React Native SDK auto-finalizes when attemptEmailAddressVerification succeeds if it matches conditions,
      // or requires calling finalize/setActive. Let's make sure the session is active.
    } catch (e) {
      console.error("Verification verification error:", e)
    }
  }

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    return (
      <View style={styles.container}>
        <Text>You're signed in</Text>
      </View>
    )
  }

  if (isVerifying) {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter your verification code"
          onChangeText={setCode}
          keyboardType="numeric"
        />
        <Button title="Verify" onPress={handleVerify} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={setEmailAddress}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Button title="Sign up" onPress={handleSignUp} />
      {/* Required for sign-up flows on Expo web. Clerk skips the browser CAPTCHA on iOS and Android */}
      <View nativeID="clerk-captcha" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
})
