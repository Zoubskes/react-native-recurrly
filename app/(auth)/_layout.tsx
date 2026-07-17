import { useAuth, useSession } from "@clerk/expo";
import { type Href, Redirect, Stack, usePathname } from "expo-router";

const TASKS_ROUTE = "/(auth)/tasks" as Href;

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { session } = useSession();
  const pathname = usePathname();
  const isTasksRoute = pathname === "/tasks" || pathname === "/(auth)/tasks";
  const hasCurrentTask = Boolean(session?.currentTask);

  if (!isLoaded) return null;
  if (isSignedIn && hasCurrentTask && !isTasksRoute) return <Redirect href={TASKS_ROUTE} />;
  if (isSignedIn && !hasCurrentTask && isTasksRoute) return <Redirect href="/(tabs)" />;
  if (isSignedIn && !hasCurrentTask) return <Redirect href="/(tabs)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
