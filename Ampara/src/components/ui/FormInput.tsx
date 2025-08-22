import React, { forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

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
      labelClassName = "text-text dark:text-text-dark text-base font-semibold mb-2",
      inputClassName = "flex-1 py-3 px-4 ",
      rightIcon,
      ...inputProps
    },
    ref
  ) => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className={containerClassName}>
          <Text className={labelClassName}>{label}</Text>
          <View className="flex-row border border-border dark:border-border-dark rounded-lg bg-background/70 dark:bg-background-dark/70">
            <TextInput
              ref={ref}
              className={inputClassName}
              {...inputProps}
              textAlignVertical="center"
            />
            {rightIcon}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
);

FormInput.displayName = "FormInput";
export default FormInput;
