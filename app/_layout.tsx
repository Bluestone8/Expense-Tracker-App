import Loading from "@/components/Loading";
import { AuthProvider, useAuth } from "@/contexts/authContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(modals)/profileModal"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="(modals)/walletModal"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="(modals)/transactionModal"
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
};

const RootLayoutNav = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/welcome");
    }
  }, [isAuthenticated, loading, segments, router]);

  if (loading) {
    return <Loading />;
  }

  return <StackLayout />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
