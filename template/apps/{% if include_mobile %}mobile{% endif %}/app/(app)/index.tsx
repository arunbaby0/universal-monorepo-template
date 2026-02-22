import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@repo/auth";

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <View className="flex-1 bg-background p-6">
      <View className="mb-8">
        <Text className="text-2xl font-bold text-foreground">
          Welcome, {user?.name}!
        </Text>
        <Text className="text-muted-foreground mt-2">
          This is your dashboard
        </Text>
      </View>

      <View className="space-y-4">
        <View className="bg-secondary p-4 rounded-xl">
          <Text className="font-semibold text-foreground mb-1">Profile</Text>
          <Text className="text-sm text-muted-foreground">
            Manage your profile information
          </Text>
        </View>

        <View className="bg-secondary p-4 rounded-xl mt-4">
          <Text className="font-semibold text-foreground mb-1">Settings</Text>
          <Text className="text-sm text-muted-foreground">
            Configure your account preferences
          </Text>
        </View>
      </View>

      <View className="mt-auto">
        <TouchableOpacity
          className="w-full h-12 border border-input rounded-lg items-center justify-center"
          onPress={handleLogout}
        >
          <Text className="text-foreground font-medium">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
