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

  // Parse the incoming plan parameter (which is a JSON string from the API).
  const parsedData = plan ? JSON.parse(plan as string) : null;
  const weeklyInfo = parsedData?.weekly_info || {
    avg_free_time_used: 0,
    avg_net_calories: 0,
    avg_workout_duration: 0,
    free_time_week: 0,
    meals_per_day: 0,
  };
  const planArray = parsedData?.plan || [];

  // Use only the first 7 days if there are more than 7
  const daysData = planArray.length > 7 ? planArray.slice(0, 7) : planArray;

  // Stats array using weekly_info
  const stats = [
    {
      label: `Time Used: ${weeklyInfo.avg_free_time_used}/${weeklyInfo.free_time_week} min`,
    },
    { label: `Workout/day: ${weeklyInfo.avg_workout_duration} min` },
    { label: `Meals/day: ${weeklyInfo.meals_per_day}` },
    {
      label: `Calories/day: ${
        weeklyInfo.avg_net_calories > 0
          ? "+" + weeklyInfo.avg_net_calories
          : weeklyInfo.avg_net_calories
      } kcal`,
    },
  ];

  // Navigation handlers.
  function handleEditPreferences() {
    router.push("/profile-setup");
  }
  function handleDone() {
    router.push("/");
  }
  function handleDayPress(dayPlan: any) {
    // Navigate to the per-day detail page, passing the day plan as a JSON string.
    console.log(dayPlan);
    router.push({
      pathname: "/plan-summary/[day]",
      params: { day: JSON.stringify(dayPlan) },
    });
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.pageHeader}>Plan Summary</Text>
      <Text style={styles.pageSubheader}>
        Your Personalized Weekly Plan For This Week
      </Text>

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
        {daysData.map((dayItem: any, idx: number) => {
          // Convert the day string to a Date and format as "Sat 12 / 04"
          const dayDate = new Date(dayItem.day);
          const dayStr =  dayDate.toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
          });
          const month = (dayDate.getMonth() + 1).toString().padStart(2, "0");
          const formattedDay = `${dayStr} / ${month}`;
          return (
            <View key={idx} style={styles.dayBox}>
              <Text style={styles.dayTitle}>{formattedDay}</Text>
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
                onPress={() => handleDayPress(dayItem)}
              >
                <Text style={styles.viewPlanButtonText}>
                  Click to view plan
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom Buttons – Stacked Vertically */}
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
  pageHeader: {
    fontFamily: "Inter_700Bold",
    fontSize: 36,
    textAlign: "center",
    marginBottom: 5,
    color: "#000",
  },
  pageSubheader: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  statsContainer: {
    marginBottom: 15,
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
    borderBottomWidth: 1,
    borderColor: "#000",
    width: "100%",
    alignSelf: "flex-start",
    marginTop: 5,
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
    width: 160,
    height: 220, // Increased height for more content.
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
    backgroundColor: "#9ECAE1",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 10,
  },
  viewPlanButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
  bottomButtonsContainer: {
    marginTop: 20,
  },
  fullWidthButton: {
    backgroundColor: "#9ECAE1",
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
