import React, { useMemo, useState } from "react";
import {
  View,
  Pressable,
  SafeAreaView,
  Text,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import colors from "tailwindcss/colors";
import { designTokens } from "../../design-tokens";
import AddEventModal, { EventPayload } from "./Modals/AddEventModal";
import { useTheme } from "../../controllers/ThemeContext";

export type EventItem = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  time: string; // "14:00 - 15:00"
  type: "Social" | "Health" | "Reminder";
  icon?: "users" | "coffee" | "book" | "calendar";
  color?: string;
  location?: string;
};

const iconForType = (
  type: EventItem["type"]
): { name: string; bg: string; fg: string } => {
  switch (type) {
    case "Health":
      return {
        name: "medkit",
        bg: colors.red[100],
        fg: colors.red[600],
      } as any;
    case "Reminder":
      return {
        name: "bell",
        bg: colors.yellow[100],
        fg: colors.yellow[600],
      } as any;
    default:
      return {
        name: "users",
        bg: colors.blue[100],
        fg: colors.blue[600],
      } as any;
  }
};

const CalendarScreen: React.FC = () => {
  const { colorScheme } = useTheme();
  const tokens = designTokens[colorScheme];

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [addVisible, setAddVisible] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([
    {
      id: "1",
      date: "2025-07-28",
      title: "Group Meeting",
      time: "14:00 - 15:00",
      type: "Social",
      icon: "users",
    },
    {
      id: "2",
      date: "2025-07-30",
      title: "Morning Coffee",
      time: "16:30 - 17:30",
      type: "Social",
      icon: "coffee",
    },
    {
      id: "3",
      date: "2025-08-01",
      title: "Study Session",
      time: "19:00 - 20:00",
      type: "Reminder",
      icon: "book",
    },
  ]);

  const dayEvents = useMemo(
    () => events.filter((e) => e.date === selectedDate),
    [events, selectedDate]
  );

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    events.forEach((e) => {
      marks[e.date] = marks[e.date] || {
        marked: true,
        dots: [{ color: tokens.highlight }],
      };
      marks[e.date].marked = true;
      marks[e.date].dotColor = tokens.highlight;
    });
    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: tokens.highlight,
    };
    return marks;
  }, [events, selectedDate, tokens.highlight]);

  const addEvent = (payload: EventPayload) => {
    setEvents((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        date: payload.date,
        title: payload.title,
        time: payload.time,
        type: payload.type,
      },
    ]);
  };

  return (
    <SafeAreaView className="bg-background h-full">
      <View className="mx-4">
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-text text-xl font-bold">Calendar</Text>
          <Pressable
            onPress={() => setAddVisible(true)}
            className="rounded-xl py-2 px-3"
            style={{ backgroundColor: tokens.highlight }}
          >
            <Text className="text-white font-semibold">Add Event +</Text>
          </Pressable>
        </View>

        <View
          className="border border-border rounded-2xl mt-3 overflow-hidden"
          style={{ backgroundColor: tokens.background }}
        >
          <Calendar
            current={selectedDate}
            onDayPress={(day: { dateString: string }) =>
              setSelectedDate(day.dateString)
            }
            markedDates={markedDates}
            theme={{
              backgroundColor: tokens.background,
              calendarBackground: tokens.background,
              selectedDayBackgroundColor: tokens.highlight,
              selectedDayTextColor: "#ffffff",
              todayTextColor: colors.emerald[500],
              arrowColor: tokens.highlight,
              textSectionTitleColor: tokens.subtitle,
              monthTextColor: tokens.text,
              dayTextColor: tokens.text,
            }}
          />
        </View>

        <View className="flex flex-row items-center justify-between mt-6">
          <Text className="text-text font-bold text-lg">
            Schedule for {selectedDate}
          </Text>
          <View className="flex-row items-center">
            <Feather name="calendar" size={18} color={tokens.subtitle} />
            <Text className="text-subtitle ml-1">
              {new Date(selectedDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View className="mt-4">
          {dayEvents.length === 0 && (
            <View className="border border-border rounded-2xl p-4 items-center justify-center">
              <Text className="text-subtitle">No events for this day</Text>
            </View>
          )}

          {dayEvents.map((e) => {
            const iconInfo = iconForType(e.type);
            return (
              <Pressable
                key={e.id}
                className="mb-3"
                android_ripple={{ color: "rgba(0,0,0,0.06)" }}
              >
                <View
                  className="flex-row items-center justify-between rounded-2xl p-4 bg-background border border-border"
                  style={{
                    shadowColor: "#000",
                    shadowOpacity: 0.08,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 6 },
                    elevation: 3,
                  }}
                >
                  <View className="flex-row items-center flex-1">
                    <View
                      className="rounded-2xl mr-3 p-3"
                      style={{ backgroundColor: iconInfo.bg }}
                    >
                      <FontAwesome
                        name={iconInfo.name as any}
                        size={20}
                        color={iconInfo.fg}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-semibold text-base"
                        style={{ color: tokens.text }}
                      >
                        {e.title}
                      </Text>
                      <Text
                        className="text-sm"
                        style={{ color: tokens.subtitle }}
                      >
                        {e.time}
                      </Text>
                      {e.location ? (
                        <Text
                          className="text-xs mt-1"
                          style={{ color: tokens.subtitle }}
                        >
                          {e.location}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <Pressable
                    className="rounded-lg px-3 py-2"
                    style={{ backgroundColor: tokens.highlight }}
                  >
                    <Text className="text-white font-medium">Open</Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <AddEventModal
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        onSubmit={addEvent}
        defaultDate={selectedDate}
        tokens={tokens}
      />
    </SafeAreaView>
  );
};

export default CalendarScreen;
