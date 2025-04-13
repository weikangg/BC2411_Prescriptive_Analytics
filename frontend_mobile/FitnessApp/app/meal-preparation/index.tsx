import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import Slider from "@react-native-community/slider";

import Button from "../../components/Button";
import { UserContext } from "../../contexts/UserContext";
import { generatePlan } from "@/services/api";

export default function MealPreparationScreen() {
  const router = useRouter();
  const { userData, setUserData } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  // 1) Dietary Restrictions (Multi-select)
  const [openDiet, setOpenDiet] = useState(false);
  const [dietValue, setDietValue] = useState<string[]>(
    userData.dietRestrictions && userData.dietRestrictions.length > 0
      ? userData.dietRestrictions
      : ["none"]
  );
  const [dietItems, setDietItems] = useState([
    { label: "None (no preferences)", value: "none" },
    { label: "Keto", value: "keto" },
    { label: "Mediterranean", value: "mediterranean" },
    { label: "Dash", value: "dash" },
    { label: "Vegan", value: "vegan" },
    { label: "Paleo", value: "paleo" },
  ]);

  // 3) Meal Prep Time (Slider: 0 to 120 minutes)
  const [mealPrepTime, setMealPrepTime] = useState<number>(
    userData.mealPrepTime || 0
  );

  // 4) Meals per Day
  const [mealsPerDay, setMealsPerDay] = useState<string>(
    userData.mealsPerDay ? userData.mealsPerDay.toString() : ""
  );

  // 5) Variety Preferences (Multi-select)
  const [openVariety, setOpenVariety] = useState(false);
  const [varietyValue, setVarietyValue] = useState<string[]>(
    userData.varietyPreferences && userData.varietyPreferences.length > 0
      ? userData.varietyPreferences
      : ["none"]
  );
  const [varietyItems, setVarietyItems] = useState([
    { label: "None (no preferences)", value: "none" },
    { label: "Chinese", value: "chinese" },
    { label: "Caribbean", value: "caribbean" },
    { label: "American", value: "american" },
    { label: "Nordic", value: "nordic" },
    { label: "South American", value: "south american" },
    { label: "World", value: "world" },
    { label: "Mediterranean", value: "mediterranean" },
    { label: "Japanese", value: "japanese" },
    { label: "British", value: "british" },
    { label: "South East Asian", value: "south east asian" },
    { label: "Mexican", value: "mexican" },
    { label: "French", value: "french" },
    { label: "Eastern Europe", value: "eastern europe" },
    { label: "Central Europe", value: "central europe" },
    { label: "Indian", value: "indian" },
    { label: "Middle Eastern", value: "middle eastern" },
    { label: "Italian", value: "italian" },
    { label: "Kosher", value: "kosher" },
    { label: "Asian", value: "asian" },
  ]);

  // Errors state for validation
  const [errors, setErrors] = useState({
    dietRestrictions: "",
    mealPrepTime: "",
    mealsPerDay: "",
  });

  async function handlePlanGeneration(updatedData: any) {
    try {
      console.log("Data sent to API:", updatedData);
      const data = await generatePlan(updatedData);
      console.log("Data received from API:", data);
      const planString = JSON.stringify(data);
      router.push({
        pathname: "/plan-summary",
        params: { plan: planString },
      });
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGeneratePlan = () => {
    let newErrors: {
      dietRestrictions: string;
      mealPrepTime: string;
      mealsPerDay: string;
    } = {
      dietRestrictions: "",
      mealPrepTime: "",
      mealsPerDay: "",
    };

    let valid = true;

    if (dietValue.length === 0) {
      newErrors.dietRestrictions =
        "Please select at least one dietary restriction";
      valid = false;
    }

    if (mealPrepTime <= 0) {
      newErrors.mealPrepTime = "Meal prep time must be greater than 0";
      valid = false;
    }

    const mealsNum = parseInt(mealsPerDay, 10);
    if (isNaN(mealsNum) || mealsNum <= 0) {
      newErrors.mealsPerDay =
        "Meals per day must be greater than 0, please eat";
      valid = false;
    } else if (mealsNum >= 8) {
      newErrors.mealsPerDay =
        "Meals per day must be less than 8, please don't be fat";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) {
      return;
    }

    const updatedData = {
      ...userData,
      dietRestrictions: dietValue,
      mealPrepTime,
      mealsPerDay: mealsNum,
      varietyPreferences: varietyValue,
    };

    setIsLoading(true);
    setUserData(updatedData);
    handlePlanGeneration(updatedData);
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#228B22" />
        <Text style={styles.loadingText}>Generating your plan...</Text>
      </View>
    );
  }

  // Wrap the scroll view and footer in a parent view so the footer is always flushed at the bottom.
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.fullContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          nestedScrollEnabled
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Meal Preparations</Text>
            <Text style={styles.subtitle}>
              What are your food preferences?
            </Text>
          </View>

          {/* Dietary Restrictions (Multi-select) */}
          <Text style={styles.label}>Dietary Restrictions: (multi-select)</Text>
          <View style={{ zIndex: 3000, marginBottom: 5 }}>
            <DropDownPicker
              multiple={true}
              listMode="SCROLLVIEW"
              open={openDiet}
              value={dietValue}
              items={dietItems}
              setOpen={setOpenDiet}
              setValue={setDietValue}
              setItems={setDietItems}
              placeholder="Select dietary restrictions"
              style={styles.picker}
              dropDownContainerStyle={styles.dropDownContainer}
              multipleText={dietValue.join(", ")}
            />
          </View>
          {errors.dietRestrictions ? (
            <Text style={styles.errorText}>{errors.dietRestrictions}</Text>
          ) : null}

          {/* Meal Prep Time (Slider) */}
          <Text style={styles.label}>Meal Prep Time (minutes)</Text>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={120}
              step={5}
              value={mealPrepTime}
              onValueChange={setMealPrepTime}
              minimumTrackTintColor="#228B22"
              maximumTrackTintColor="#cccccc"
            />
            <Text style={styles.sliderValue}>{mealPrepTime} min</Text>
          </View>
          {errors.mealPrepTime ? (
            <Text style={styles.errorText}>{errors.mealPrepTime}</Text>
          ) : null}

          {/* Meals Per Day */}
          <Text style={styles.label}>Meals Per Day</Text>
          <TextInput
            style={styles.input}
            value={mealsPerDay}
            onChangeText={setMealsPerDay}
            keyboardType="number-pad"
          />
          {errors.mealsPerDay ? (
            <Text style={styles.errorText}>{errors.mealsPerDay}</Text>
          ) : null}

          {/* Variety Preferences (Multi-select) */}
          <Text style={styles.label}>Variety Preferences</Text>
          <View style={{ zIndex: 2000, marginBottom: 20 }}>
            <DropDownPicker
              multiple={true}
              listMode="SCROLLVIEW"
              open={openVariety}
              value={varietyValue}
              items={varietyItems}
              setOpen={setOpenVariety}
              setValue={setVarietyValue}
              setItems={setVarietyItems}
              placeholder="Select preferred cuisines"
              style={styles.picker}
              dropDownContainerStyle={styles.dropDownContainer}
              multipleText={varietyValue.join(", ")}
            />
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <Button title="Generate my plan!" onPress={handleGeneratePlan} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  headerContainer: {
    marginTop: 50,
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 36,
    lineHeight: 36,
    textAlign: "center",
    marginBottom: 10,
    color: "#000",
  },
  subtitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    lineHeight: 15,
    textAlign: "center",
    color: "#000",
  },
  label: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    marginBottom: 5,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#000",
    marginBottom: 20,
  },
  picker: {
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
    marginBottom: 20,
    fontFamily: "Inter_400Regular",
    color: "#000",
  },
  dropDownContainer: {
    borderColor: "#bbb",
    borderRadius: 6,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  slider: {
    flex: 1,
    marginRight: 10,
  },
  sliderValue: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#000",
    width: 60,
    textAlign: "right",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    // flush to bottom with margin at the bottom
    marginBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#228B22",
  },
});
