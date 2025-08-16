import React from "react";
import { Text, TextProps } from "react-native";

interface Props extends TextProps {
  className?: string;
}

export default function Body({ className = "", style, ...props }: Props) {
  return (
    <Text
      className={`text-base text-gray-700 ${className}`}
      style={[style]}
      {...props}
    />
  );
}
