import { Redirect } from "expo-router";
import { useAuth } from "@repo/auth";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { user, loading, initialized } = useAuth();

  if (!initialized || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#171717" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
