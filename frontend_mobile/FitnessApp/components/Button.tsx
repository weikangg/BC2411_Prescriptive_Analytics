import React, { forwardRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
}

// Wrap the component in forwardRef so that refs passed from asChild will work
const Button = forwardRef<typeof TouchableOpacity, ButtonProps>(
  ({ title, onPress, style }, ref) => {
    return (
      <TouchableOpacity ref={ref} style={[styles.button, style]} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  }
);

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(22, 143, 85, 1)',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 8, // approximate the "gap" between elements
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    // Use the Inter font. Must match one loaded in `_layout.tsx`.
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
});