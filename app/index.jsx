import { StatusBar } from "expo-status-bar";
import { router, Redirect } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import { CustomButton } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";
import { useState,useEffect } from "react";

const Welcome = () => {
  const { isLoading, isLoggedIn } = useGlobalContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn !== null) {
      setLoading(false);
    }
  }, [isLoggedIn]);

  if (loading) {
    return <View><Text>Loading...</Text></View>;
  }

  if (!isLoading && isLoggedIn) {
    return <Redirect href="/Home" />;
  }

  return (
    <SafeAreaView className="bg-primary h-full">

      <ScrollView
        contentContainerStyle={{
          height: "90%",
        }}
      >
        <View className="w-full flex justify-center items-center px-4">
          <Image
            source={images.logo}
            className="w-[250px] h-[250px]"
            resizeMode="contain"
          />

          <Image
            source={images.cards}
            className="max-w-[300px] w-full h-[300px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-blue-400 font-bold text-center">
              Find Your people at air{"\n"}
              only with{" "}
              <Text className="text-secondary-200">Airly</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[200px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-blue-400 mt-7 text-center">
            Where Air Students meet eachother!
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/signin")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
    
  );
};

export default Welcome;