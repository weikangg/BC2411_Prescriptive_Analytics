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

  // Dropdown and input state
  const [openGoalType, setOpenGoalType] = useState(false);
  const [goalTypeValue, setGoalTypeValue] = useState(userData.goalType || "");
  const [goalTypeItems, setGoalTypeItems] = useState([
    { label: "Weight Loss", value: "weight_loss" },
    { label: "Weight Gain", value: "weight_gain" },
    { label: "Endurance", value: "endurance" },
  ]);

  const [goalDuration, setGoalDuration] = useState(
    userData.goalDuration ? userData.goalDuration.toString() : ""
  );

  const [openFitness, setOpenFitness] = useState(false);
  const [fitnessValue, setFitnessValue] = useState(userData.fitnessLevel || "");
  const [fitnessItems, setFitnessItems] = useState([
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ]);

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

  const [openType, setOpenType] = useState(false);
  const [typeValue, setTypeValue] = useState(
    userData.preferredWorkoutType || ""
  );
  const [typeItems, setTypeItems] = useState([
    { label: "General", value: "general" },
    { label: "Cardio", value: "cardio" },
    { label: "Outdoor/Water", value: "outdoor_water" },
    { label: "Gym Workouts", value: "gym_workouts" },
    { label: "None (No preference)", value: "none" },
  ]);

  // Errors state for validation
  const [errors, setErrors] = useState({
    goalType: "",
    goalDuration: "",
    fitnessLevel: "",
    preferredLocation: "",
    preferredWorkoutType: "",
  });

  const handleContinue = () => {
    // Initialize a new error object
    let newErrors: {
      goalType: string;
      goalDuration: string;
      fitnessLevel: string;
      preferredLocation: string;
      preferredWorkoutType: string;
    } = {
      goalType: "",
      goalDuration: "",
      fitnessLevel: "",
      preferredLocation: "",
      preferredWorkoutType: "",
    };

    let valid = true;

    // Validate Goal Type
    if (!goalTypeValue) {
      newErrors.goalType = "Goal type is required";
      valid = false;
    }
    
    // Validate Goal Duration: Should be > 0 and less than 6 months.
    const durationNum = parseInt(goalDuration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      newErrors.goalDuration = "Goal duration must be greater than 0";
      valid = false;
    } else if (durationNum >= 6) {
      newErrors.goalDuration = "Goal duration should be less than 6 months";
      valid = false;
    }

    // Validate Fitness Level
    if (!fitnessValue) {
      newErrors.fitnessLevel = "Fitness level is required";
      valid = false;
    }
    
    // Validate Preferred Workout Location
    if (!locationValue) {
      newErrors.preferredLocation = "Preferred workout location is required";
      valid = false;
    }
    
    // Validate Preferred Workout Type
    if (!typeValue) {
      newErrors.preferredWorkoutType = "Preferred workout type is required";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      return;
    }

    // Update user data and navigate
    const updatedData = {
      ...userData,
      goalType: goalTypeValue,
      goalDuration: durationNum,
      fitnessLevel: fitnessValue,
      preferredLocation: locationValue,
      preferredWorkoutType: typeValue,
    };

    console.log("Updated Data:", updatedData);
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
        {errors.goalType ? (
          <Text style={styles.errorText}>{errors.goalType}</Text>
        ) : null}

        {/* Goal Duration Input */}
        <Text style={styles.label}>Goal Duration (Months)</Text>
        <TextInput
          style={styles.input}
          value={goalDuration}
          onChangeText={setGoalDuration}
          keyboardType="number-pad"
        />
        {errors.goalDuration ? (
          <Text style={styles.errorText}>{errors.goalDuration}</Text>
        ) : null}

        {/* Fitness Level Dropdown */}
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
        {errors.fitnessLevel ? (
          <Text style={styles.errorText}>{errors.fitnessLevel}</Text>
        ) : null}

        {/* Preferred Workout Location Dropdown */}
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
        {errors.preferredLocation ? (
          <Text style={styles.errorText}>{errors.preferredLocation}</Text>
        ) : null}

        {/* Preferred Workout Type Dropdown */}
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
        {errors.preferredWorkoutType ? (
          <Text style={styles.errorText}>{errors.preferredWorkoutType}</Text>
        ) : null}

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
  },
  dropDownContainer: {
    borderColor: "#bbb",
    borderRadius: 6,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});
