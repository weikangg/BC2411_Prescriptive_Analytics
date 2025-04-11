// app/plan-summary/index.tsx
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import CustomButton from '../../components/Button';

export default function PlanSummaryScreen() {
  // Retrieve plan passed as route parameter (decoded if needed)
  const { plan } = useLocalSearchParams<{ plan: string }>();
  const planData = plan ? JSON.parse(plan) : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Plan Summary</Text>
      {planData ? (
        <>
          <Text style={styles.text}>Recommended Weekly Plan:</Text>
          <Text style={styles.planText}>{JSON.stringify(planData, null, 2)}</Text>
          <Link href="/profile-setup" asChild>
            <CustomButton title="Edit Preferences" />
          </Link>
          <Link href="/" asChild>
            <CustomButton title="Done" />
          </Link>
        </>
      ) : (
        <Text style={styles.text}>No plan found.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 22, marginBottom: 10, fontWeight: 'bold' },
  text: { fontSize: 16, marginVertical: 5 },
  planText: { marginVertical: 10, fontSize: 14, lineHeight: 20 },
});
