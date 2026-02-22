import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useAuth } from "@repo/auth";
import { useProfile } from "@repo/profile";

export default function ProfileScreen() {
  const { user } = useAuth();
  const { profile, loading, error, fetchProfile, updateProfile } = useProfile();

  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
      setLocation(profile.location || "");
      setWebsite(profile.website || "");
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ bio, location, website });
      Alert.alert("Success", "Profile updated successfully!");
    } catch {
      Alert.alert("Error", error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground">Loading profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView className="flex-1 p-6">
        <View className="mb-8">
          <Text className="text-xl font-bold text-foreground">Edit Profile</Text>
          <Text className="text-muted-foreground mt-1">
            Update your public profile information
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-foreground mb-2">Bio</Text>
            <TextInput
              className="w-full h-24 px-4 py-3 border border-input rounded-lg bg-background text-foreground"
              placeholder="Tell us about yourself..."
              placeholderTextColor="#737373"
              value={bio}
              onChangeText={setBio}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View className="mt-4">
            <Text className="text-sm font-medium text-foreground mb-2">Location</Text>
            <TextInput
              className="w-full h-12 px-4 border border-input rounded-lg bg-background text-foreground"
              placeholder="San Francisco, CA"
              placeholderTextColor="#737373"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View className="mt-4">
            <Text className="text-sm font-medium text-foreground mb-2">Website</Text>
            <TextInput
              className="w-full h-12 px-4 border border-input rounded-lg bg-background text-foreground"
              placeholder="https://yourwebsite.com"
              placeholderTextColor="#737373"
              value={website}
              onChangeText={setWebsite}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            className="w-full h-12 bg-primary rounded-lg items-center justify-center mt-6"
            onPress={handleSave}
            disabled={saving}
          >
            <Text className="text-primary-foreground font-medium">
              {saving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
