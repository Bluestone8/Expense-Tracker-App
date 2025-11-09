import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

const Welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* login button */}

        <View>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={styles.loginButton}
          >
            <Typo fontWeight="500"> sign in</Typo>
          </TouchableOpacity>

          <Animated.Image
            entering={FadeIn.duration(2000)}
            source={require("../../assets/images/welcome.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify().damping(30)}
            style={{ alignItems: "center" }}
          >
            <Typo size={30} fontWeight="800">
              Always take control
            </Typo>
            <Typo size={30} fontWeight="800">
              of your finances
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(100)
              .springify()
              .damping(40)}
            style={{ alignItems: "center", gap: 2 }}
          >
            <Typo size={16} fontWeight="400">
              Get started with our app
            </Typo>
            <Typo size={16} fontWeight="400">
              and take control of your finances!
            </Typo>
          </Animated.View>

          <View style={styles.buttonContainer}>
            <Button onPress={() => router.navigate("/register")}>
              <Typo size={22} color={colors.neutral900} fontWeight="600">
                {" "}
                Get Started
              </Typo>
            </Button>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    alignSelf: "center",

    marginTop: verticalScale(100),
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: "white",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
});
