import React from "react";
import { Text, TextProps } from "react-native";

interface Props extends TextProps {
  className?: string;
}

export default function Heading({ className = "", style, ...props }: Props) {
  return (
    <Text
      className={`text-3xl font-bold text-text dark:text-text-dark ${className}`}
      style={[style]}
      {...props}
    />
  );
}
