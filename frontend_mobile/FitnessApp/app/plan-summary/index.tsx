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
  const { result } = useLocalSearchParams<{ result: string }>();

  // Parse the incoming result parameter (which is a JSON string from the API)
  const parsedData = result ? JSON.parse(result) : null;

  // Get model status from backend; e.g., "OPTIMAL" or "INFEASIBLE"
  const modelStatus = parsedData?.status || "UNKNOWN";

  // Check if the plan data is available (for a modelStatus of OPTIMAL)
  const hasPlan =
    modelStatus === "OPTIMAL" && parsedData?.plan && parsedData.plan.length > 0;
  // Check if recommendations exist (for a modelStatus of INFEASIBLE)
  const hasRecommendations =
    modelStatus === "INFEASIBLE" &&
    parsedData?.recommendations &&
    parsedData.recommendations.length > 0;

  // If plan is optimal, get weekly information and plan array.
  const weeklyInfo = hasPlan
    ? parsedData.weekly_info
    : {
        avg_free_time_used: 0,
        avg_net_calories: 0,
        avg_workout_duration: 0,
        free_time_week: 0,
        meals_per_day: 0,
      };
  const planArray = hasPlan ? parsedData.plan : [];

  // If more than 7 days, take only the first 7 days.
  const daysData = planArray.length > 7 ? planArray.slice(0, 7) : planArray;

  // Build stats only if plan exists.
  const stats = hasPlan
    ? [
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
      ]
    : [];

  // Navigation handlers.
  function handleEditPreferences() {
    router.push("/profile-setup");
  }
  function handleDone() {
    router.push("/");
  }
  function handleDayPress(dayPlan: any) {
    router.push({
      pathname: "/plan-summary/[day]",
      params: { day: JSON.stringify(dayPlan) },
    });
  }

  // Helper function to render recommendations.
  function renderRecommendations() {
    const recommendations: string[] = parsedData?.recommendations || [];
    if (recommendations.length === 0) return null;

    // Assume the first recommendation is the main one
    // and contains semicolon-separated key-value items.
    const mainRec = recommendations[0];
    const keyValuePairs = mainRec.split(";").map((item: string) => item.trim());
    // Process additional recommendations.
    const additionalRecommendations = recommendations.slice(1).map((rec) => {
      if (rec.trim() === "All input parameters appear feasible.") {
        return "All input parameters appear feasible. However, we recommend extending the time period for better optimization.";
      }
      return rec;
    });
    return (
      <View style={styles.recommendationsContainer}>
        <Text style={styles.sectionHeader}>Calculated Inputs</Text>
        {keyValuePairs.map((pair, idx) => (
          <View key={idx} style={styles.recommendationRow}>
            <Text style={styles.recommendationText}>{pair}</Text>
            {idx < keyValuePairs.length - 1 && (
              <View style={styles.separatorLine} />
            )}
          </View>
        ))}
        <Text style={styles.sectionHeader}>Recommendations</Text>
        {additionalRecommendations.map((rec, idx) => (
          <Text key={idx} style={styles.additionalRecommendation}>
            {rec}
          </Text>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.fullContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Always show headers */}
        <Text style={styles.pageHeader}>Plan Summary</Text>
        <Text style={styles.pageSubheader}>
          Your Personalized Weekly Plan For This Week
        </Text>

        {/* Model Status with Separator */}
        <View style={styles.modelStatusContainer}>
          <Text style={styles.modelStatusText}>
            Model Status: {modelStatus}
          </Text>
        </View>

        {hasPlan ? (
          <>
            {/* Stats Section */}
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statRow}>
                  <Text style={styles.statText}>{stat.label}</Text>
                  <View style={styles.separatorLine} />
                </View>
              ))}
            </View>

            {/* Detailed Weekly Plan Table */}
            <Text style={styles.detailedHeader}>Detailed Weekly Plan</Text>
            <ScrollView horizontal style={styles.dayScroll}>
              {daysData.map((dayItem: any, idx: number) => {
                const dayDate = new Date(dayItem.day);
                const dayNumber = dayDate.getDate().toString().padStart(2, "0");
                const month = (dayDate.getMonth() + 1)
                  .toString()
                  .padStart(2, "0");
                const formattedDay = `${dayNumber} / ${month}`;
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
          </>
        ) : hasRecommendations ? (
          // If no plan data but recommendations exist, render recommendations.
          renderRecommendations()
        ) : (
          <View style={styles.noPlanContainer}>
            <Text style={styles.noPlanText}>No plan data available.</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Buttons always at the bottom */}
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
  fullContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
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
  modelStatusContainer: {
    alignItems: "flex-start",
    marginBottom: 10,
    marginTop: 10,
  },
  modelStatusText: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: "#000",
  },
  statusSeparator: {
    marginTop: 5,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    width: "100%",
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
    borderColor: "#ccc",
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
    height: 220,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: "#f9f9f9",
    padding: 10,
    justifyContent: "space-between",
  },
  sectionHeader: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    marginVertical: 10,
    color: "#000",
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
  recommendationsContainer: {
    marginVertical: 0,
  },
  recommendationRow: {
    marginBottom: 10,
  },
  recommendationText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#000",
  },
  additionalRecContainer: {
    marginTop: 10,
  },
  additionalRecommendation: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  noPlanContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  noPlanText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#666",
  },
  bottomButtonsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
