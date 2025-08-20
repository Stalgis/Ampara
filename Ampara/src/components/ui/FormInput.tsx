import React, { forwardRef } from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

export interface FormInputProps extends TextInputProps {
  label: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  rightIcon?: React.ReactNode;
}

const FormInput = forwardRef<TextInput, FormInputProps>(
  (
    {
      label,
      containerClassName = "mb-6",
      labelClassName = "text-gray-700 text-base font-semibold mb-2",
      inputClassName = "flex-1 py-3 px-4 text-lg",
      rightIcon,
      ...inputProps
    },
    ref
  ) => {
    return (
      <View className={containerClassName}>
        <Text className={labelClassName}>{label}</Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg bg-white/70">
          <TextInput ref={ref} className={inputClassName} {...inputProps} />
          {rightIcon}
        </View>
      </View>
    );
  }
);

export default FormInput;
