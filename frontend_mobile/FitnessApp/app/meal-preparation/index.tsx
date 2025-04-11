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
} from "react-native";
import { useRouter } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import Slider from "@react-native-community/slider";

import Button from "../../components/Button";
import { UserContext } from "../../contexts/UserContext";

export default function MealPreparationScreen() {
  const router = useRouter();
  const { userData, setUserData } = useContext(UserContext);

  // 1) Dietary Restrictions (Multi-select)
  const [openDiet, setOpenDiet] = useState(false);
  const [dietValue, setDietValue] = useState<string[]>([
    ...userData.dietRestrictions,
  ]);
  const [dietItems, setDietItems] = useState([
    { label: "Keto", value: "keto" },
    { label: "Mediterranean", value: "mediterranean" },
    { label: "Dash", value: "dash" },
    { label: "Vegan", value: "vegan" },
    { label: "Paleo", value: "paleo" },
    { label: "None (no preferences)", value: "none" },
  ]);

  // 2) Allergies (comma-separated)
  const [allergies, setAllergies] = useState<string>(
    userData.allergies.join(", ")
  );

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
  const [varietyValue, setVarietyValue] = useState<string[]>([
    ...userData.varietyPreferences,
  ]);
  const [varietyItems, setVarietyItems] = useState([
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

  const handleGeneratePlan = () => {
    // Parse allergies string to array
    const allergyArray = allergies
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const updatedData = {
      ...userData,
      dietRestrictions: dietValue, // array of strings
      allergies: allergyArray,
      mealPrepTime, // number (minutes)
      mealsPerDay: parseInt(mealsPerDay, 10) || 0,
      varietyPreferences: varietyValue,
    };

    console.log(updatedData);
    setUserData(updatedData);

    router.push("/plan-summary");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Meal Preparations</Text>
          <Text style={styles.subtitle}>What are your food preferences?</Text>
        </View>

        {/* Dietary Restrictions (Multi-select) */}
        <Text style={styles.label}>Dietary Restrictions:</Text>
        <View style={{ zIndex: 3000, marginBottom: 20 }}>
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
          />
        </View>

        {/* Allergies (comma-separated) */}
        <Text style={styles.label}>Allergies</Text>
        <TextInput
          style={styles.input}
          value={allergies}
          onChangeText={setAllergies}
          placeholder="e.g. Peanuts, Shellfish"
          placeholderTextColor="#aaa"
        />

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

        {/* Meals Per Day */}
        <Text style={styles.label}>Meals Per Day</Text>
        <TextInput
          style={styles.input}
          value={mealsPerDay}
          onChangeText={setMealsPerDay}
          keyboardType="number-pad"
        />

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
          />
        </View>

        <Button title="Generate my plan!" onPress={handleGeneratePlan} />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
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
  },
  subtitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    lineHeight: 15,
    textAlign: "center",
  },
  label: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    marginBottom: 5,
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
    marginBottom: 20,
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
});
