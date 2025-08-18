import React from "react";
import { Pressable, Text, PressableProps } from "react-native";

export interface PrimaryButtonProps extends PressableProps {
  title: string;
  className?: string;
  textClassName?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  className = "",
  textClassName = "",
  ...rest
}) => {
  return (
    <Pressable
      className={`bg-primary rounded-xl py-4 items-center ${className}`}
      {...rest}
    >
      <Text
        className={`text-white text-center text-lg font-semibold ${textClassName}`}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default PrimaryButton;
