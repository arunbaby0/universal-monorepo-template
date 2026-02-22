import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "@repo/auth";

export default function LoginScreen() {
  const { login, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    clearError();
    try {
      await login({ email, password });
      router.replace("/(app)");
    } catch {
      Alert.alert("Error", error || "Login failed");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <View className="flex-1 justify-center px-6">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-foreground text-center">Welcome back</Text>
          <Text className="text-muted-foreground text-center mt-2">Sign in to your account</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-foreground mb-2">Email</Text>
            <TextInput
              className="w-full h-12 px-4 border border-input rounded-lg bg-background text-foreground"
              placeholder="you@example.com"
              placeholderTextColor="#737373"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View className="mt-4">
            <Text className="text-sm font-medium text-foreground mb-2">Password</Text>
            <TextInput
              className="w-full h-12 px-4 border border-input rounded-lg bg-background text-foreground"
              placeholder="Enter your password"
              placeholderTextColor="#737373"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error && (
            <Text className="text-destructive text-sm mt-2">{error}</Text>
          )}

          <TouchableOpacity
            className="w-full h-12 bg-primary rounded-lg items-center justify-center mt-6"
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-primary-foreground font-medium">
              {loading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8 flex-row justify-center">
          <Text className="text-muted-foreground">Don't have an account? </Text>
          <Link href="/(auth)/signup" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-medium">Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
