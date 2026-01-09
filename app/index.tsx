// app/index.tsx

import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, useColorScheme } from "react-native";
import { useRouter } from "expo-router";

import Colors, { ColorScheme } from "@constants/Colors";
import Images from "@constants/Images";

export default function SplashEntry() {
  const scheme = (useColorScheme() ?? "light") as ColorScheme;
  const c = Colors[scheme];
  const router = useRouter();

  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 260,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 140,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        router.replace("/(auth)");
      }
    });

    return () => {
      animation.stop();
    };
  }, [opacity, scale, router]);

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Animated.Image
        source={Images.branding.logo.mix}
        resizeMode="contain"
        style={[
          styles.logo,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 240,
    height: 240,
  },
});
