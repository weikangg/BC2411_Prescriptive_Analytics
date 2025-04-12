// app/index.tsx
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import Button from "../components/Button";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent={false} />

      {/* Header Section */}
      <View style={styles.headerSection}>
        <Image
          source={require("../assets/images/dumbbell.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to FITPLANNER!</Text>
        <Text style={styles.slogan}>Smart Planning. Real Results.</Text>
      </View>

      {/* Footer Section */}
      <View style={styles.footerSection}>
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
    // Space out header and footer naturally
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerSection: {
    alignItems: "center",
  },
  logo: {
    width: 188,
    height: 188,
    marginBottom: 0,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 36,
    textAlign: "center",
    color: "#000",
    marginBottom: 10,
  },
  slogan: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    textAlign: "center",
    color: "#000",
  },
  footerSection: {
    width: "100%",
    alignItems: "center",
  },
});
