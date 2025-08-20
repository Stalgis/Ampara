import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

export interface FormInputProps extends TextInputProps {
  label: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  rightIcon?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  containerClassName = "mb-6",
  labelClassName = "text-text dark:text-text-dark text-base font-semibold mb-2",
  inputClassName = "flex-1 py-3 px-4 text-lg text-text dark:text-text-dark",
  rightIcon,
  ...inputProps
}) => {
  return (
    <View className={containerClassName}>
      <Text className={labelClassName}>{label}</Text>
      <View className="flex-row items-center border border-border dark:border-border-dark rounded-lg bg-background dark:bg-background-dark">
        <TextInput className={inputClassName} {...inputProps} />
        {rightIcon}
      </View>
    </View>
  );
};

export default FormInput;
