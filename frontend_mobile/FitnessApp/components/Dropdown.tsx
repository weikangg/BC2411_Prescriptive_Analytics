import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface CustomDropdownProps {
  label: string;
  options: string[];
  selectedValue: string;
  onValueChange: (itemValue: string, itemIndex: number) => void;
}

export default function CustomDropdown({ label, options, selectedValue, onValueChange }: CustomDropdownProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        {options.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  label: { marginBottom: 5, fontWeight: '600' },
  picker: { borderWidth: 1, borderColor: '#ccc' },
});
