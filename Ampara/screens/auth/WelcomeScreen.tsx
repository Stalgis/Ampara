// screens/auth/WelcomeScreen.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  Pressable,
  Platform,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { SLIDES, type Slide } from "../../navigation/slides";

export default function WelcomeScreen() {
  const nav = useNavigation<any>();
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);
  const [index, setIndex] = useState(0);
  const ref = useRef<ICarouselInstance>(null);

  const ASPECT = 2; // tall
  const MAX_VH = 0.8;
  const carouselHeight = Math.min(width * ASPECT, height * MAX_VH);
  const isLast = index === SLIDES.length - 1;

  const goNext = () => {
    if (!isLast) ref.current?.scrollTo({ index: index + 1, animated: true });
  };

  const finish = async () => {
    await AsyncStorage.setItem("onboarding_done", "true");
    nav.reset({ index: 0, routes: [{ name: "LogIn" }] });
  };

  const go = async (routeName: "LogIn" | "SignUp" | "CreateElderUser") => {
    await AsyncStorage.setItem("onboarding_done", "true");
    nav.navigate(routeName);
  };

  return (
    <View className="flex-1 bg-background px-4 pt-3">
      {/* Skip */}
      <View className="items-end">
        <Pressable onPress={finish} className="px-3 py-1 rounded-full">
          <Text className="text-subtitle">Skip</Text>
        </Pressable>
      </View>

      {/* Carousel */}
      <View
        className="w-full overflow-hidden shadow-md mt-2"
        {...(Platform.OS === "web"
          ? ({ dataSet: { kind: "onboarding", name: "parallax" } } as any)
          : {})}
        style={{ height: carouselHeight, borderRadius: 20 }}
      >
        <Carousel<Slide>
          ref={ref}
          data={SLIDES}
          width={width - 32}
          height={carouselHeight}
          loop={false}
          pagingEnabled
          snapEnabled
          autoPlay={false}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
          onProgressChange={(_, abs) => setIndex(Math.round(abs))}
          renderItem={({ item, index: itemIndex }) => {
            const lastHere = itemIndex === SLIDES.length - 1;
            return (
              <View
                className="flex-1 items-center justify-center px-6"
                style={{ backgroundColor: item.color, borderRadius: 20 }}
              >
                <Text className="text-3xl font-bold text-white text-center">
                  {item.title}
                </Text>
                <Text className="text-white/90 text-base text-center mt-2 text-xl">
                  {item.body}
                </Text>

                {item.illustration && (
                  <Image
                    source={item.illustration}
                    className="w-3/4 h-60 mt-4"
                    resizeMode="contain"
                  />
                )}

                {/* CTA group only on last slide */}
                {lastHere && (
                  <View className="w-full mt-6 space-y-3 gap-2">
                    <Pressable
                      onPress={() => go("LogIn")}
                      className="rounded-xl py-3 items-center bg-white/10 border border-white/30 bg-[#FBBF24]"
                    >
                      <Text className="text-white font-semibold">Log In</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => go("SignUp")}
                      className="rounded-xl py-3 items-center bg-highlight"
                    >
                      <Text className="text-white font-semibold">Sign Up</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => go("CreateElderUser")}
                      className="rounded-xl py-3 items-center bg-[#D97706]"
                    >
                      <Text className="font-semibold text-white">
                        Create Elder User
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            );
          }}
        />
      </View>

      {/* Dots */}
      <View className="flex-row justify-center mt-4">
        {SLIDES.map((s, i) => (
          <View
            key={s.key}
            className={`h-2 rounded-full mx-1 ${
              i === index ? "w-6 bg-accent" : "w-2 bg-subtitle/40"
            }`}
          />
        ))}
      </View>

      {/* Bottom Next (hidden on last slide) */}
      {!isLast && (
        <View className="mt-6 flex-row items-center justify-between">
          <Pressable
            onPress={goNext}
            className="flex-1 rounded-xl py-3 items-center bg-highlight"
          >
            <Text className="text-white font-semibold">Next</Text>
          </Pressable>
        </View>
      )}

      <View className="items-center mt-4">
        <Text className="text-xs text-subtitle">
          Swipe to explore • Tap Next to continue
        </Text>
      </View>
    </View>
  );
}
