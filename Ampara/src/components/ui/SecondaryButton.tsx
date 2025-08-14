import React from "react";
import { Pressable, Text, PressableProps } from "react-native";

export interface SecondaryButtonProps extends PressableProps {
  title: string;
  className?: string;
  textClassName?: string;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  className = "",
  textClassName = "",
  ...rest
}) => {
  return (
    <Pressable
      className={`bg-accent rounded-xl py-4 items-center ${className}`}
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

export default SecondaryButton;
