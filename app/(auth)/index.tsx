// app/(auth)/index.tsx

import { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors, { ColorScheme } from "@constants/Colors";
import Fonts from "@constants/Fonts";
import Images from "@constants/Images";

const { width: screenWidth } = Dimensions.get("window");

interface OnboardingItem {
  id: string;
  title: string;
  image: any;
}

const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    title: "Swift and Reliable Delivery",
    image: Images.auth.authOne,
  },
  {
    id: "2",
    title: "Precision in Every Package",
    image: Images.auth.authTwo,
  },
  {
    id: "3",
    title: "Built for Critical Moments",
    image: Images.auth.authOne,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scheme = (useColorScheme() ?? "light") as ColorScheme;
  const colors = Colors[scheme];

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % onboardingData.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={[styles.slide, { backgroundColor: colors.background }]}>
      <Image source={item.image} style={styles.backgroundImage} />
      <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex
              ? [styles.activeDot, { backgroundColor: colors.primary }]
              : [styles.inactiveDot, { backgroundColor: colors.border }],
          ]}
        />
      ))}
    </View>
  );

  const onScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onScrollToIndexFailed={() => {}}
        style={{ flexGrow: 0 }}
      />

      {renderDots()}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.getStartedButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(auth)/get-started")}
        >
          <Text style={[styles.getStartedText, { color: colors.background }]}>
            Get Started
          </Text>
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={[styles.orLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.orText, { color: colors.textSecondary }]}>
            OR
          </Text>
          <View style={[styles.orLine, { backgroundColor: colors.border }]} />
        </View>

        <TouchableOpacity
          style={[
            styles.socialButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Image
            source={{
              uri: "https://img.icons8.com/color/48/000000/google-logo.png",
            }}
            style={styles.socialIcon}
          />
          <Text style={[styles.socialText, { color: colors.text }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.socialButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="logo-apple" size={20} color={colors.text} />
          <Text style={[styles.socialText, { color: colors.text }]}>
            Continue with Apple
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={[styles.loginText, { color: colors.textSecondary }]}>
            Already have an account?{" "}
            <Text style={[styles.loginLinkText, { color: colors.primary }]}>
              Log In
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: screenWidth,
    alignItems: "center",
    marginTop: 64,
  },
  backgroundImage: {
    width: "80%",
    height: screenWidth * 0.8,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.nunitoBold,
    textAlign: "center",
    paddingHorizontal: 30,
    lineHeight: 32,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    borderRadius: 4,
  },
  inactiveDot: {},
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  getStartedButton: {
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  getStartedText: {
    fontSize: 16,
    fontFamily: Fonts.nunitoBold,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  orLine: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: 15,
    fontSize: 14,
    fontFamily: Fonts.nunitoRegular,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    width: "100%",
    justifyContent: "center",
    borderWidth: 1,
  },
  socialText: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: Fonts.nunitoSemiBold,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  loginText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    fontFamily: Fonts.nunitoRegular,
  },
  loginLinkText: {
    fontFamily: Fonts.nunitoSemiBold,
    textDecorationLine: "underline",
  },
});
