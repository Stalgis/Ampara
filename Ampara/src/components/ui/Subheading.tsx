import React from "react";
import { Text, TextProps } from "react-native";

interface Props extends TextProps {
  className?: string;
}

export default function Subheading({ className = "", style, ...props }: Props) {
  return (
    <Text
      className={`text-lg font-semibold text-text dark:text-text-dark ${className}`}
      style={[style]}
      {...props}
    />
  );
}
