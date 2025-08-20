import React from "react";
import { Pressable, Text, PressableProps, ActivityIndicator } from "react-native";

export interface PrimaryButtonProps extends PressableProps {
  title: string;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
  loading?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  className = "",
  textClassName = "",
  disabled = false,
  loading = false,
  ...rest
}) => {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      className={`bg-primary rounded-xl py-4 items-center active:opacity-80 min-h-11 min-w-11 ${
        isDisabled ? "opacity-50" : ""
      } ${className}`}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text
          className={`text-white text-center text-lg font-semibold ${textClassName}`}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default PrimaryButton;
