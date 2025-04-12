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
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "../../components/Button";
import { UserContext } from "../../contexts/UserContext";

export default function GoalSettingScreen() {
  const router = useRouter();
  const { userData, setUserData } = useContext(UserContext);

  // 1. Goal Type Dropdown.
  const [openGoalType, setOpenGoalType] = useState(false);
  const [goalTypeValue, setGoalTypeValue] = useState(userData.goalType || "");
  const [goalTypeItems, setGoalTypeItems] = useState([
    { label: "Weight Loss", value: "weight_loss" },
    { label: "Weight Gain", value: "weight_gain" },
    { label: "Endurance", value: "endurance" },
  ]);

  // New: Goal Weight Input.
  const [goalWeight, setGoalWeight] = useState(
    userData.goalWeight ? userData.goalWeight.toString() : ""
  );

  // 2. Goal Target Date using an inline compact DateTimePicker.
  const [goalTargetDate, setGoalTargetDate] = useState(
    userData.goalTargetDate ? new Date(userData.goalTargetDate) : new Date()
  );

  // 3. Fitness Level Dropdown.
  const [openFitness, setOpenFitness] = useState(false);
  const [fitnessValue, setFitnessValue] = useState(userData.fitnessLevel || "");
  const [fitnessItems, setFitnessItems] = useState([
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ]);

  // 4. Preferred Workout Location Dropdown.
  // Default to "none" if no value provided.
  const [openLocation, setOpenLocation] = useState(false);
  const [locationValue, setLocationValue] = useState(
    userData.preferredLocation || "none"
  );
  const [locationItems, setLocationItems] = useState([
    { label: "None (No preference)", value: "none" },
    { label: "Home", value: "home" },
    { label: "Gym", value: "gym" },
    { label: "Fitness Corner", value: "fitness corner" },
    { label: "Sports Centre", value: "sports centre" },
    { label: "Sports Facilities", value: "pool/sports facility" },
  ]);

  // 5. Preferred Workout Type Dropdown.
  // Default to "none" if no value provided.
  const [openType, setOpenType] = useState(false);
  const [typeValue, setTypeValue] = useState(
    userData.preferredWorkoutType || "none"
  );
  const [typeItems, setTypeItems] = useState([
    { label: "None (No preference)", value: "none" },
    { label: "General", value: "general" },
    { label: "Sports", value: "sports" },
    { label: "Cardio", value: "cardio" },
    { label: "Outdoor/Water", value: "outdoor/water" },
    { label: "Fitness", value: "fitness" },
    { label: "Gym Workouts", value: "gym" },
  ]);

  // Validation errors.
  const [errors, setErrors] = useState({
    goalType: "",
    goalWeight: "",
    goalTargetDate: "",
    fitnessLevel: "",
    preferredLocation: "",
    preferredWorkoutType: "",
  });

  // DateTimePicker onChange handler.
  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setGoalTargetDate(selectedDate);
    }
  };

  const handleContinue = () => {
    let newErrors = {
      goalType: "",
      goalWeight: "",
      goalTargetDate: "",
      fitnessLevel: "",
      preferredLocation: "",
      preferredWorkoutType: "",
    };
    let valid = true;

    // Validate Goal Type.
    if (!goalTypeValue) {
      newErrors.goalType = "Goal type is required";
      valid = false;
    }

    // Validate Goal Weight: > 0 and < 200 kg.
    const parsedGoalWeight = parseFloat(goalWeight);
    if (isNaN(parsedGoalWeight) || parsedGoalWeight <= 0) {
      newErrors.goalWeight = "Goal weight must be greater than 0";
      valid = false;
    } else if (parsedGoalWeight >= 200) {
      newErrors.goalWeight = "Goal weight must be less than 200 kg";
      valid = false;
    }

    // Validate that the target date is not in the past.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(goalTargetDate);
    target.setHours(0, 0, 0, 0);
    if (target < today) {
      newErrors.goalTargetDate = "Target date cannot be in the past";
      valid = false;
    }
    if (!fitnessValue) {
      newErrors.fitnessLevel = "Fitness level is required";
      valid = false;
    }
    if (!locationValue) {
      newErrors.preferredLocation = "Preferred workout location is required";
      valid = false;
    }
    if (!typeValue) {
      newErrors.preferredWorkoutType =
        "Preferred workout type is required";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    // Build updated data including the new goalWeight property.
    const updatedData = {
      ...userData,
      goalType: goalTypeValue,
      goalWeight: parsedGoalWeight,
      goalTargetDate: goalTargetDate.toISOString(),
      fitnessLevel: fitnessValue,
      preferredLocation: locationValue,
      preferredWorkoutType: typeValue,
    };

    console.log("Updated Data:", updatedData);
    setUserData(updatedData);
    router.push("/meal-preparation");
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
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
          placeholder="Select Goal Type"
          style={styles.picker}
          dropDownContainerStyle={styles.dropDownContainer}
        />
        {errors.goalType ? (
          <Text style={styles.errorText}>{errors.goalType}</Text>
        ) : null}

        {/* Goal Weight Input */}
        <Text style={styles.label}>Goal Weight (kg)</Text>
        <TextInput
          style={styles.input}
          value={goalWeight}
          onChangeText={setGoalWeight}
          keyboardType="number-pad"
          placeholder="Enter your goal weight"
          placeholderTextColor="#aaa"
        />
        {errors.goalWeight ? (
          <Text style={styles.errorText}>{errors.goalWeight}</Text>
        ) : null}

        {/* Inline Date Picker for Goal Target Date */}
        <Text style={styles.label}>Achieve Goal By</Text>
        <View style={styles.dateInput}>
          <DateTimePicker
            value={goalTargetDate}
            mode="date"
            display={Platform.OS === "ios" ? "compact" : "default"}
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        </View>
        {errors.goalTargetDate ? (
          <Text style={styles.errorText}>{errors.goalTargetDate}</Text>
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
  dateInput: {
    borderWidth: 1,
    borderColor: "#bbb", // Green accent for border
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: "#fff", 
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});