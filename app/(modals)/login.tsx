import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useOAuth, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";

enum AuthStrategies {
  GOOGLE = "oauth_google",
  APPLE = "oauth_apple",
}

export default function Page() {
  useWarmUpBrowser();

  const [isSignIn, setIsSignIn] = useState(true);
  const [pendingVerification, setPendingVerification] = useState(false);
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });

  const { signIn, setActive: setLoginActive, isLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive } = useSignUp();
  const router = useRouter();

  const email = useRef("");
  const password = useRef("");
  const code = useRef("");

  const onSelected = async (strategy: AuthStrategies) => {
    const selectedAuth = {
      [AuthStrategies.GOOGLE]: googleAuth,
      [AuthStrategies.APPLE]: appleAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.back();
      }
    } catch (error) {
      console.error("Oauth: " + error);
    }
  };

  const submit = async () => {
    try {
      if (isSignIn) {
        const { createdSessionId } = await signIn!.create({ identifier: email.current, password: password.current });
        setLoginActive!({ session: createdSessionId });
        router.back()
      } else {
        await signUp!.create({
          emailAddress: email.current,
          password: password.current,
        });
        
        await signUp!.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        setPendingVerification(true);
      }
    } catch (error) {
      console.error("Error: " + error);
    }
  };

  const verifyCode = async () => {
    try {
      const { createdSessionId } = await signUp!.attemptEmailAddressVerification({ code: code.current })
      if(createdSessionId) {
        setSignUpActive!({ session: createdSessionId });
        router.back();
      }
    } catch (error) {
      
    }
  }

  return (
    <View style={styles.container}>
      {pendingVerification && (
        <TextInput
          autoCapitalize="none"
          placeholder="Code..."
          style={styles.input}
          onChangeText={(text) => (code.current = text)}
        />
      )}
      <View style={{ gap: 20 }}>
        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          style={styles.input}
          onChangeText={(text) => (email.current = text)}
        />
        <TextInput
          autoCapitalize="none"
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          onChangeText={(text) => (password.current = text)}
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={!pendingVerification ? submit : verifyCode}>
        <Text style={styles.btnText}>{isSignIn ? "Continue" : "Sign up"}</Text>
      </TouchableOpacity>

      {isSignIn && (
        <View style={styles.separatorView}>
          <Text>Don't have account</Text>
          <TouchableOpacity onPress={() => setIsSignIn(false)}>
            <Text style={{ color: Colors.primary }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.separatorView}>
        <View style={styles.separatorLine} />
        <Text>or</Text>
        <View style={styles.separatorLine} />
      </View>

      <View>
        <TouchableOpacity style={styles.btnOutline}>
          <Ionicons name="call-outline" size={24} color="black" />
          <Text style={styles.btnOutlineText}>Continue with Phone</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelected(AuthStrategies.GOOGLE)}
        >
          <Ionicons name="logo-google" size={24} color="black" />
          <Text style={styles.btnOutlineText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelected(AuthStrategies.APPLE)}
        >
          <Ionicons name="logo-apple" size={24} color="black" />
          <Text style={styles.btnOutlineText}>Continue with Apple</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ababab",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  btn: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  btnText: {
    color: "white",
    fontSize: 16,
  },
  btnOutline: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 8,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
  },
  btnOutlineText: {
    color: "black",
    fontSize: 16,
  },
  separatorView: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  separatorLine: {
    borderBottomColor: "black",
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
  },
});
