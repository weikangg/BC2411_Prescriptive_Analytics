// app/plan-summary/index.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function PlanSummaryScreen() {
  const router = useRouter();
  const { plan } = useLocalSearchParams();
  // For now we use hard-coded placeholders.
  const totalTimeUsed = 200; // minutes used
  const totalTimeBudget = 400;
  const calsPerDay = 1800;
  const workoutDuration = 45;
  const mealsPerDay = 3;

  // Array for the four stats.
  const stats = [
    { label: `Time Used: ${totalTimeUsed}/${totalTimeBudget} min` },
    { label: `Workout/day: ${workoutDuration} min` },
    { label: `Meals/day: ${mealsPerDay}` },
    { label: `Calories/day: ${calsPerDay} kcal` },
  ];

  // Days for the weekly plan. (You can replace with actual plan data.)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  function handleEditPreferences() {
    router.push("/profile-setup");
  }

  function handleDone() {
    router.push("/");
  }

  function handleDayPress(day: string) {
    // Navigate to day detail page with the day parameter.
    router.push({ pathname: "/plan-summary/[day]", params: { day } });
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Plan Summary</Text>
      <Text style={styles.subtitle}>Your Personalized Weekly Plan!</Text>


      {/* Stats Section */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statRow}>
            <Text style={styles.statText}>{stat.label}</Text>
            <View style={styles.separatorLine} />
          </View>
        ))}
      </View>

      {/* Detailed Weekly Plan Header */}
      <Text style={styles.detailedHeader}>Detailed Weekly Plan</Text>

      {/* Horizontally Scrollable Days Table */}
      <ScrollView horizontal style={styles.dayScroll}>
        {days.map((day, idx) => (
          <View key={idx} style={styles.dayBox}>
            <Text style={styles.dayTitle}>{day}</Text>
            <View style={styles.row}>
              <Image
                source={require("../../assets/images/food.png")}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.daySubtitle}>Diet Meal Plan</Text>
            </View>
            <View style={styles.row}>
              <Image
                source={require("../../assets/images/exercise.png")}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.daySubtitle}>Exercises</Text>
            </View>
            <TouchableOpacity
              style={styles.viewPlanButton}
              onPress={() => handleDayPress(day)}
            >
              <Text style={styles.viewPlanButtonText}>Click to view plan</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Buttons – Stacked */}
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={styles.fullWidthButton}
          onPress={handleEditPreferences}
        >
          <Text style={styles.fullWidthButtonText}>Edit Preferences</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fullWidthButton, styles.doneButton]}
          onPress={handleDone}
        >
          <Text style={styles.fullWidthButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  title: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#000",
  },
  statsContainer: {
    marginBottom: 5,
  },
  statRow: {
    marginBottom: 20,
  },
  statText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#000",
    marginBottom: 2,
  },
  separatorLine: {
    marginTop: 5,
    borderBottomWidth: 1,
    borderColor: "#000",
    width: "100%",
    alignSelf: "flex-start",
  },
  detailedHeader: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: "#000",
    marginBottom: 10,
    textAlign: "left",
  },
  dayScroll: {
    marginBottom: 20,
  },
  dayBox: {
    width: 160, // increased width for more content
    height: 200, // increased height for less gap at bottom
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: "#f9f9f9",
    padding: 10,
    justifyContent: "space-between",
  },
  dayTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    marginBottom: 8,
    color: "#000",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  daySubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#333",
  },
  viewPlanButton: {
    alignSelf: "center",
    backgroundColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 10,
  },
  viewPlanButtonText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#000",
    textAlign: "center",
  },
  bottomButtonsContainer: {
    marginTop: 20,
  },
  fullWidthButton: {
    backgroundColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 14,
    width: "100%",
    marginBottom: 10,
    alignItems: "center",
  },
  doneButton: {
    backgroundColor: "rgba(22,143,85,1)",
  },
  fullWidthButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#fff",
  },
});
