// app/goal-setting/index.tsx
import React, { useContext, useState } from "react";
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

import Button from "../../components/Button";
import { UserContext } from "../../contexts/UserContext";

export default function GoalSettingScreen() {
  const router = useRouter();
  const { userData, setUserData } = useContext(UserContext);

  // 1. Goal Type: Use a single-select DropDownPicker.
  const [openGoalType, setOpenGoalType] = useState(false);
  const [goalTypeValue, setGoalTypeValue] = useState(userData.goalType || "");
  const [goalTypeItems, setGoalTypeItems] = useState([
    { label: "Weight Loss", value: "weight_loss" },
    { label: "Weight Gain", value: "weight_gain" },
    { label: "Endurance", value: "endurance" },
  ]);

  // 2. Goal Duration (months) as a number-pad input.
  const [goalDuration, setGoalDuration] = useState(
    userData.goalDuration ? userData.goalDuration.toString() : ""
  );

  // 3. Fitness Level (single-select dropdown)
  const [openFitness, setOpenFitness] = useState(false);
  const [fitnessValue, setFitnessValue] = useState(userData.fitnessLevel || "");
  const [fitnessItems, setFitnessItems] = useState([
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ]);

  // 4. Preferred Workout Location (single-select dropdown)
  const [openLocation, setOpenLocation] = useState(false);
  const [locationValue, setLocationValue] = useState(
    userData.preferredLocation || ""
  );
  const [locationItems, setLocationItems] = useState([
    { label: "Home", value: "home" },
    { label: "Gym", value: "gym" },
    { label: "Fitness Corner", value: "fitness_corner" },
    { label: "Sports Centre", value: "sports_centre" },
    { label: "Sports Facilities", value: "sports_facilities" },
  ]);

  // 5. Preferred Workout Type (single-select dropdown)
  const [openType, setOpenType] = useState(false);
  const [typeValue, setTypeValue] = useState(
    userData.preferredWorkoutType || ""
  );
  const [typeItems, setTypeItems] = useState([
    { label: "Pushups / General", value: "pushups" },
    { label: "Cardio", value: "cardio" },
    { label: "Outdoor/Water", value: "outdoor_water" },
    { label: "Gym Workouts", value: "gym_workouts" },
    { label: "None (No preference)", value: "none" },
  ]);

  const handleContinue = () => {
    const updatedData = {
      ...userData,
      goalType: goalTypeValue,
      goalDuration: parseInt(goalDuration, 10) || 0,
      fitnessLevel: fitnessValue,
      preferredLocation: locationValue,
      preferredWorkoutType: typeValue,
    };

    console.log(updatedData);
    setUserData(updatedData);
    router.push("/meal-preparation");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Goal Setting</Text>
          <Text style={styles.subtitle}>What's your fitness goal?</Text>
        </View>

        {/* Goal Type Dropdown */}
        <Text style={styles.label}>Goal Type</Text>
        <DropDownPicker
          listMode="SCROLLVIEW"
          zIndex={3000}
          open={openGoalType}
          value={goalTypeValue}
          items={goalTypeItems}
          setOpen={setOpenGoalType}
          setValue={(callback) => {
            const val = callback(goalTypeValue);
            setGoalTypeValue(val);
          }}
          setItems={setGoalTypeItems}
          placeholder="Select Goal"
          style={styles.picker}
          dropDownContainerStyle={styles.dropDownContainer}
        />

        {/* Goal Duration in months */}
        <Text style={styles.label}>Goal Duration (Months)</Text>
        <TextInput
          style={styles.input}
          value={goalDuration}
          onChangeText={setGoalDuration}
          keyboardType="number-pad"
        />

        {/* Fitness Level */}
        <Text style={styles.label}>Fitness Level</Text>
        <DropDownPicker
          listMode="SCROLLVIEW"
          zIndex={2999}
          open={openFitness}
          value={fitnessValue}
          items={fitnessItems}
          setOpen={setOpenFitness}
          setValue={(callback) => {
            const val = callback(fitnessValue);
            setFitnessValue(val);
          }}
          setItems={setFitnessItems}
          placeholder="Select Level"
          style={styles.picker}
          dropDownContainerStyle={styles.dropDownContainer}
        />

        {/* Preferred Workout Location */}
        <Text style={styles.label}>Preferred Workout Location</Text>
        <DropDownPicker
          listMode="SCROLLVIEW"
          zIndex={2998}
          open={openLocation}
          value={locationValue}
          items={locationItems}
          setOpen={setOpenLocation}
          setValue={(callback) => {
            const val = callback(locationValue);
            setLocationValue(val);
          }}
          setItems={setLocationItems}
          placeholder="Select Location"
          style={styles.picker}
          dropDownContainerStyle={styles.dropDownContainer}
        />

        {/* Preferred Workout Type */}
        <Text style={styles.label}>Preferred Workout Type</Text>
        <DropDownPicker
          listMode="SCROLLVIEW"
          zIndex={2997}
          open={openType}
          value={typeValue}
          items={typeItems}
          setOpen={setOpenType}
          setValue={(callback) => {
            const val = callback(typeValue);
            setTypeValue(val);
          }}
          setItems={setTypeItems}
          placeholder="Select Workout Type"
          style={styles.picker}
          dropDownContainerStyle={styles.dropDownContainer}
        />

        <Button title="Continue to Meal Preparation" onPress={handleContinue} />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
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
    zIndex: 3000,
  },
  dropDownContainer: {
    borderColor: "#bbb",
    borderRadius: 6,
  },
});
