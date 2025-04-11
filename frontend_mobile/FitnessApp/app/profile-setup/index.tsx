// app/profile-setup/index.tsx
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
import Button from "../../components/Button"; // Your forwarded ref Button component
import { UserContext } from "../../contexts/UserContext";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { userData, setUserData } = useContext(UserContext);

  // Using state as strings for inputs and later conversion where needed.
  const [name, setName] = useState(userData.name || "");
  const [age, setAge] = useState(userData.age ? userData.age.toString() : "");

  // Gender DropDownPicker state
  const [openGender, setOpenGender] = useState(false);
  const [genderValue, setGenderValue] = useState(userData.gender || "");
  const [genderItems, setGenderItems] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ]);

  const [height, setHeight] = useState(
    userData.height ? userData.height.toString() : ""
  );
  const [weight, setWeight] = useState(
    userData.weight ? userData.weight.toString() : ""
  );

  // Activity Level DropDownPicker state
  const [openActivity, setOpenActivity] = useState(false);
  const [activityLevelValue, setActivityLevelValue] = useState(
    userData.activityLevel || ""
  );
  const [activityLevelItems, setActivityLevelItems] = useState([
    { label: "Sedentary", value: "Sedentary" },
    { label: "Lightly Active", value: "Lightly Active" },
    { label: "Very Active", value: "Very Active" },
  ]);

  const [freeTime, setFreeTime] = useState(
    userData.freeTime ? userData.freeTime.toString() : ""
  );
  const [daysWeek, setDaysWeek] = useState(
    userData.daysWeek ? userData.daysWeek.toString() : ""
  );

  // State to hold error messages per field
  const [errors, setErrors] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    freeTime: "",
    daysWeek: "",
  });

  const handleContinue = () => {
    // Clear previous errors.
    let newErrors: {
      name: string;
      age: string;
      gender: string;
      height: string;
      weight: string;
      activityLevel: string;
      freeTime: string;
      daysWeek: string;
    } = {
      name: "",
      age: "",
      gender: "",
      height: "",
      weight: "",
      activityLevel: "",
      freeTime: "",
      daysWeek: "",
    };

    let valid = true;

    // Validate Name (non-empty)
    if (!name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    // Validate Age (> 0, < 150)
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum <= 0) {
      newErrors.age = "Age must be greater than 0";
      valid = false;
    } else if (ageNum >= 150) {
      newErrors.age = "Age must be less than 150";
      valid = false;
    }

    // Validate Gender
    if (!genderValue) {
      newErrors.gender = "Gender is required";
      valid = false;
    }

    // Validate Height (> 0, < 250)
    const heightNum = parseFloat(height);
    if (isNaN(heightNum) || heightNum <= 0) {
      newErrors.height = "Height must be greater than 0";
      valid = false;
    } else if (heightNum >= 250) {
      newErrors.height = "Height must be less than 250 cm";
      valid = false;
    }

    // Validate Weight (> 0, < 200)
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      newErrors.weight = "Weight must be greater than 0";
      valid = false;
    } else if (weightNum >= 200) {
      newErrors.weight = "Weight must be less than 200 kg";
      valid = false;
    }

    // Validate Activity Level
    if (!activityLevelValue) {
      newErrors.activityLevel = "Activity Level is required";
      valid = false;
    }

    // Validate Free Time (0-24)
    const freeTimeNum = parseFloat(freeTime);
    if (isNaN(freeTimeNum) || freeTimeNum < 0 || freeTimeNum > 24) {
      newErrors.freeTime = "Free Time per day must be between 0 and 24 hours";
      valid = false;
    }

    // Validate No. of Days a Week (1-7)
    const daysWeekNum = parseInt(daysWeek, 10);
    if (isNaN(daysWeekNum) || daysWeekNum < 1 || daysWeekNum > 7) {
      newErrors.daysWeek = "Days per week must be between 1 and 7";
      valid = false;
    }

    setErrors(newErrors);

    // If not valid, do not continue
    if (!valid) {
      return;
    }

    // If everything is validated, update the user context and navigate to the next page.
    const updatedData = {
      ...userData,
      name,
      age: ageNum,
      gender: genderValue,
      height: heightNum,
      weight: weightNum,
      activityLevel: activityLevelValue,
      freeTime: freeTimeNum,
      daysWeek: daysWeekNum,
    };

    console.log("Updated Data:", updatedData);
    setUserData(updatedData);
    router.push("/goal-setting");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        nestedScrollEnabled={true}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Profile Setup</Text>
          <Text style={styles.subtitle}>Tell us about you!</Text>
        </View>

        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
          {errors.name ? (
            <Text style={styles.errorText}>{errors.name}</Text>
          ) : null}
        </View>

        {/* Age Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
          />
          {errors.age ? (
            <Text style={styles.errorText}>{errors.age}</Text>
          ) : null}
        </View>

        {/* Gender Picker */}
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>Gender</Text>
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={openGender}
            value={genderValue}
            items={genderItems}
            setOpen={setOpenGender}
            setValue={(callback) => {
              const newVal = callback(genderValue);
              setGenderValue(newVal);
            }}
            setItems={setGenderItems}
            placeholder="Select Gender"
            style={pickerStyles.picker}
            dropDownContainerStyle={pickerStyles.dropDownContainer}
          />
          {errors.gender ? (
            <Text style={styles.errorText}>{errors.gender}</Text>
          ) : null}
        </View>

        {/* Height Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            keyboardType="number-pad"
          />
          {errors.height ? (
            <Text style={styles.errorText}>{errors.height}</Text>
          ) : null}
        </View>

        {/* Weight Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="number-pad"
          />
          {errors.weight ? (
            <Text style={styles.errorText}>{errors.weight}</Text>
          ) : null}
        </View>

        {/* Activity Level Picker */}
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>Activity Level</Text>
          <DropDownPicker
            listMode="SCROLLVIEW"
            open={openActivity}
            value={activityLevelValue}
            items={activityLevelItems}
            setOpen={setOpenActivity}
            setValue={(callback) => {
              const newVal = callback(activityLevelValue);
              setActivityLevelValue(newVal);
            }}
            setItems={setActivityLevelItems}
            placeholder="Select Activity Level"
            style={pickerStyles.picker}
            dropDownContainerStyle={pickerStyles.dropDownContainer}
          />
          {errors.activityLevel ? (
            <Text style={styles.errorText}>{errors.activityLevel}</Text>
          ) : null}
        </View>

        {/* Free Time Per Day Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>Free Time Per Day (Hours)</Text>
          <TextInput
            style={styles.input}
            value={freeTime}
            onChangeText={setFreeTime}
            keyboardType="number-pad"
          />
          {errors.freeTime ? (
            <Text style={styles.errorText}>{errors.freeTime}</Text>
          ) : null}
        </View>

        {/* Number of Days a Week Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>No. of Days a Week (1-7)</Text>
          <TextInput
            style={styles.input}
            value={daysWeek}
            onChangeText={(val) => {
              // Allow only single digit numbers (and empty string to permit deletions)
              if (val === "" || /^[1-7]$/.test(val)) {
                setDaysWeek(val);
              }
            }}
            keyboardType="number-pad"
            maxLength={1}
          />
          {errors.daysWeek ? (
            <Text style={styles.errorText}>{errors.daysWeek}</Text>
          ) : null}
        </View>

        <Text style={styles.disclaimer}>
          We will use this to calculate your BMR & TDEE needs.
        </Text>

        <Button title="Continue to Goal Setting" onPress={handleContinue} />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
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
  fieldContainer: {
    marginBottom: 15,
  },
  inputLabel: {
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
  },
  disclaimer: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 20,
    color: "#555",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

const pickerStyles = StyleSheet.create({
  picker: {
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 5,
    marginBottom: 15,
    fontFamily: "Inter_400Regular",
  },
  dropDownContainer: {
    borderColor: "#bbb",
    borderRadius: 6,
  },
});
