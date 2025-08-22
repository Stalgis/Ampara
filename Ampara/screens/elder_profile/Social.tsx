
import React from "react";
import {
  View,
  Text,
  Image,
} from "react-native";
import { mockFamily, mockNurses } from "./mock-data";

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View className="bg-background dark:bg-background-dark rounded-2xl border border-border dark:border-border-dark p-4">
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-lg font-semibold text-text dark:text-text-dark">
        {title}
      </Text>
    </View>
    {children}
  </View>
);

export default function Social() {
  return (
    <>
      <SectionCard title="Family">
        <View className="space-y-3">
          {mockFamily.map((p) => (
            <View key={p.id} className="flex-row items-center">
              {p.avatarUrl ? (
                <Image
                  source={{ uri: p.avatarUrl }}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <View className="w-10 h-10 rounded-full mr-3 bg-amber-100 items-center justify-center">
                  <Text className="text-amber-800 font-bold text-base">
                    {p.name.charAt(0)}
                  </Text>
                </View>
              )}
              <Text className="text-text dark:text-text-dark font-medium">
                {p.name}
              </Text>
            </View>
          ))}
        </View>
      </SectionCard>
      <SectionCard title="Nurses">
        <View className="space-y-3">
          {mockNurses.map((p) => (
            <View key={p.id} className="flex-row items-center">
              {p.avatarUrl ? (
                <Image
                  source={{ uri: p.avatarUrl }}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <View className="w-10 h-10 rounded-full mr-3 bg-amber-100 items-center justify-center">
                  <Text className="text-amber-800 font-bold text-base">
                    {p.name.charAt(0)}
                  </Text>
                </View>
              )}
              <Text className="text-text dark:text-text-dark font-medium">
                {p.name}
              </Text>
            </View>
          ))}
        </View>
      </SectionCard>
    </>
  );
}
