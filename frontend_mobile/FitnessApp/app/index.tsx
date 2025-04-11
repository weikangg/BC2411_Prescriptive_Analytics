// app/index.tsx
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import Button from "../components/Button";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      {/* Force a white background behind the status bar */}
      <StatusBar style="dark" translucent={false} />

      {/* Dumbbell Image */}
      <Image
        source={require("../assets/images/dumbbell.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Welcome Title */}
      <Text style={styles.title}>Welcome to FITPLANNER!</Text>

      {/* Slogan */}
      <Text style={styles.slogan}>Smart Planning. Real Results.</Text>

      {/* Get Started Button positioned near the bottom */}
      <View style={styles.buttonContainer}>
        <Link href="/profile-setup" asChild>
          <Button title="Get Started" />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logo: {
    position: "absolute",
    width: 188,
    height: 188,
    top: 38,
    left: 100,
  },
  title: {
    position: "absolute",
    width: 242,
    height: 88,
    top: 194,
    left: 76,
    fontFamily: "Inter_700Bold", // Bold weight for the title
    fontSize: 36,
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: "center",
    color: "#000",
  },
  slogan: {
    position: "absolute",
    width: 233,
    height: 35,
    top: 282,
    left: 88,
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "center",
    color: "#000",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50, // Adjust this value as needed
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
