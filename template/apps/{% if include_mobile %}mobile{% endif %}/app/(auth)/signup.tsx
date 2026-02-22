import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "@repo/auth";

export default function SignupScreen() {
  const { signup, loading, error, clearError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    clearError();
    try {
      await signup({ name, email, password });
      router.replace("/(app)");
    } catch {
      Alert.alert("Error", error || "Signup failed");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerClassName="flex-1 justify-center px-6">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-foreground text-center">Create account</Text>
          <Text className="text-muted-foreground text-center mt-2">Get started with your free account</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-foreground mb-2">Name</Text>
            <TextInput
              className="w-full h-12 px-4 border border-input rounded-lg bg-background text-foreground"
              placeholder="Your name"
              placeholderTextColor="#737373"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View className="mt-4">
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
              placeholder="Create a password (min 8 characters)"
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
            onPress={handleSignup}
            disabled={loading}
          >
            <Text className="text-primary-foreground font-medium">
              {loading ? "Creating account..." : "Create Account"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8 flex-row justify-center">
          <Text className="text-muted-foreground">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-medium">Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
