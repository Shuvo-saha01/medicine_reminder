import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import Colors from '../constants/Colors';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  type?: 'primary' | 'secondary' | 'danger' | 'success';
}

export const CustomButton: React.FC<CustomButtonProps> = ({ 
  title, 
  onPress, 
  style, 
  textStyle,
  type = 'primary'
}) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'primary': return Colors.accent;
      case 'secondary': return Colors.secondary;
      case 'danger': return Colors.error;
      case 'success': return Colors.success;
      default: return Colors.accent;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: getBackgroundColor() }, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.textLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
