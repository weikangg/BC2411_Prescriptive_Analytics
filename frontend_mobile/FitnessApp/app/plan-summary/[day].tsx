import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchSerpImage } from "../../services/serpApi";

export default function DayDetailScreen() {
  const { day } = useLocalSearchParams<{ day: string }>();
  const router = useRouter();
  const dayItem = day ? JSON.parse(day) : null;

  const [mealImages, setMealImages] = useState<(string | null)[]>(
    dayItem.selected_meals.map(() => null)
  );
  const [exerciseImages, setExerciseImages] = useState<(string | null)[]>(
    dayItem.selected_exercises.map(() => null)
  );
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  // Create a cache for query-to-image mappings.
  const imageCacheRef = useRef<{ [query: string]: string }>({});

  // Helper: Return cached image URL if exists, otherwise fetch and cache.
  async function getImage(query: string): Promise<string> {
    if (imageCacheRef.current[query]) {
      return imageCacheRef.current[query];
    }
    console.log("Pinging SERP API for:", query);
    const imageUrl = await fetchSerpImage(query);
    imageCacheRef.current[query] = imageUrl;
    return imageUrl;
  }

  useEffect(() => {
    let cancelled = false;
    async function fetchAllImages() {
      try {
        const newMealImages = await Promise.all(
          dayItem.selected_meals.map((meal: any) => getImage(meal.recipe))
        );
        const newExerciseImages = await Promise.all(
          dayItem.selected_exercises.map((ex: any) => getImage(ex.name))
        );
        if (!cancelled) {
          setMealImages(newMealImages);
          setExerciseImages(newExerciseImages);
          setIsLoadingImages(false);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setIsLoadingImages(false);
      }
    }
    fetchAllImages();
    return () => {
      cancelled = true;
    };
  }, [dayItem]);

  if (isLoadingImages) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#228B22" />
        <Text style={styles.loadingText}>Loading day details...</Text>
      </View>
    );
  }

  // Format date as "DD / MM"
  const dayDate = new Date(dayItem.day);
  const dayNumber = dayDate.getDate().toString().padStart(2, "0");
  const month = (dayDate.getMonth() + 1).toString().padStart(2, "0");
  const formattedDate = `${dayNumber} / ${month}`;

  function handleDone() {
    router.push("/");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Daily Plan</Text>
      <Text style={styles.headerSubtitle}>{formattedDate}</Text>

      <Text style={styles.calorieRequirement}>
        Caloric Requirement: {Number(dayItem.total_net_calories).toFixed(2)}{" "}
        kcal
      </Text>
      <View style={styles.separatorLine} />

      <Text style={styles.sectionHeader}>Suggested Meals</Text>
      {dayItem.selected_meals.map((meal: any, index: number) => (
        <View key={index} style={styles.mealRow}>
          <Image
            source={{ uri: mealImages[index] || "" }}
            style={styles.mealImage}
            resizeMode="cover"
          />
          <View style={styles.mealDetails}>
            <Text style={styles.mealNumber}>
              Meal {index + 1}: {meal.recipe}
            </Text>
            <View style={styles.mealInfoRow}>
              <Text style={styles.mealTotalTime}>
                Total Time: {Number(meal.total_time).toFixed(2)} min
              </Text>
              <Text style={styles.mealCalories}>
                {Number(meal.calories).toFixed(2)} kcal
              </Text>
            </View>
          </View>
          <View style={styles.separatorLine} />
        </View>
      ))}

      <Text style={styles.sectionHeader}>Suggested Exercises</Text>
      {dayItem.selected_exercises.map((exercise: any, index: number) => (
        <View key={index} style={styles.exerciseRow}>
          <Image
            source={{ uri: exerciseImages[index] || "" }}
            style={styles.exerciseImage}
            resizeMode="cover"
          />
          <View style={styles.exerciseDetails}>
            <Text style={styles.exerciseTitle}>
              Exercise {index + 1}: {exercise.name}
            </Text>
            <View style={styles.exerciseInfoRow}>
              <Text style={styles.exerciseDetail}>Type: {exercise.type}</Text>
              <Text style={styles.exerciseDetail}>
                Location: {exercise.location}
              </Text>
            </View>
            <View style={styles.exerciseInfoRow}>
              <Text style={styles.exerciseDetail}>
                Duration: {Number(exercise.duration).toFixed(2)} min
              </Text>
              <Text style={styles.exerciseDetail}>
                Burned: {Number(exercise.estimated_calories_burned).toFixed(2)}{" "}
                kcal
              </Text>
            </View>
          </View>
          <View style={styles.separatorLine} />
        </View>
      ))}

      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#228B22",
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 5,
    color: "#000",
  },
  headerSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  calorieRequirement: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    marginBottom: 20,
    color: "#000",
  },
  sectionHeader: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    marginVertical: 10,
    color: "#000",
  },
  mealRow: {
    marginBottom: 15,
  },
  mealImage: {
    width: width - 40,
    height: 120,
    borderRadius: 6,
    marginBottom: 5,
  },
  mealDetails: {
    flexDirection: "column",
    // You can add marginVertical or padding here if needed.
  },
  mealInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  mealTotalTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#333",
  },
  mealCalories: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#333",
    // Optionally, textAlign:"right" if needed.
  },
  mealNumber: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    marginBottom: 3,
    color: "#000",
  },

  separatorLine: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  exerciseRow: {
    marginBottom: 15,
  },
  exerciseImage: {
    width: width - 40,
    height: 120,
    borderRadius: 6,
    marginBottom: 5,
  },
  exerciseDetails: {
    flexDirection: "column",
  },
  exerciseTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#000",
    marginBottom: 3,
  },
  exerciseInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exerciseDetail: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#333",
  },
  doneButton: {
    backgroundColor: "rgba(22,143,85,1)",
    borderRadius: 8,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  doneButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#fff",
  },
});
