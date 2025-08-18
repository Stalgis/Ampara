import React from "react";
import { View, ViewProps } from "react-native";

export interface CardProps extends ViewProps {
  className?: string;
}

const Card: React.FC<CardProps> = ({ className = "", children, ...rest }) => {
  return (
    <View
      className={`border border-border rounded-xl bg-white ${className}`}
      {...rest}
    >
      {children}
    </View>
  );
};

export default Card;
