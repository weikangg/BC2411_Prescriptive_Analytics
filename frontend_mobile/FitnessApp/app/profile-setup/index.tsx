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

  // Use string state for inputs so that TextInput can work properly,
  // then convert them to number when storing.
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

  const handleContinue = () => {
    const updatedData = {
      ...userData,
      name,
      age: parseInt(age, 10) || 0,
      gender: genderValue,
      height: parseFloat(height) || 0,
      weight: parseFloat(weight) || 0,
      activityLevel: activityLevelValue,
      freeTime: parseFloat(freeTime) || 0,
      daysWeek: parseInt(daysWeek, 10) || 0,
    };

    console.log(updatedData); // Logs the updated data immediately
    setUserData(updatedData);
    router.push("/goal-setting");
  };

  return (
    // Dismiss keyboard by tapping outside text inputs
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
        </View>

        {/* Number of Days a Week Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>No. of Days a Week (1-7)</Text>
          <TextInput
            style={styles.input}
            value={daysWeek}
            onChangeText={(val) => {
              if (val === "" || /^[1-7]$/.test(val)) {
                setDaysWeek(val);
              }
            }}
            keyboardType="number-pad"
            maxLength={1}
          />
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
