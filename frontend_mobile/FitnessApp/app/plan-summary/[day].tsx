// app/plan-summary/[day].tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function DayDetailScreen() {
  const { day, plan } = useLocalSearchParams<{ day: string; plan?: string }>();
  const router = useRouter();

  console.log(`Plan for ${day}:`, plan);
  console.log(`Day:`, day);

  // Optionally, parse the plan JSON if passed as a string.
  const dayPlan = plan ? JSON.parse(plan) : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Plan for {day}</Text>
      {/* Display the plan details for this day */}
      {dayPlan ? (
        <Text style={styles.planText}>{JSON.stringify(dayPlan, null, 2)}</Text>
      ) : (
        <Text>No details available.</Text>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 20,
  },
  planText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 22,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "rgba(22,143,85,1)",
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: "center",
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: "#fff",
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
});
