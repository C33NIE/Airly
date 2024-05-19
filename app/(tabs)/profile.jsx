import { View, FlatList, TouchableOpacity,Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {InfoBox} from "../../components";
import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts,signOut } from "../../lib/appwrite";
import { EmptyState, Message } from "../../components";
import {useGlobalContext} from '../../context/GlobalProvider'
import { icons } from "../../constants";
const profile = () => {
  const { user,setUser,setIsLoggedIn } = useGlobalContext();
  const { data: posts } = useAppwrite( () => getUserPosts(user.$id));

  const logout = async () => {
    await signOut();
    setUser(null)
    setIsLoggedIn(false)

    router.replace("/signin")
  }


  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
         data={posts}
         keyExtractor={(item) => item.$id}
         renderItem={({item}) => (
           <Message Message={item} />
        )}
        ListHeaderComponent={() => (
         <View className="w-full justify-center items-center mt-6 mb-12 px-4">
          <TouchableOpacity className="w-full items-end mb-10" onPress={logout}>
            <Image source = {icons.logout}
            resizeMode="contain" className="w-6 h-6"/>
          </TouchableOpacity>
          <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
            <Image source={{uri: user?.avatar}}
            className="w-[90%] h-[90%] rounded-lg"
            resizeMode='cover'
            />

          </View>
            <InfoBox 
            title={user?.username}
            containerStyles='mt-5'
            titleStyles="text-lg"
            />

            <View className="mt-5 flex-row">
            <InfoBox 
            title={posts.length || 0}
            subtitle="Posts"
            containerStyles='mr-10'
            titleStyles="text-xl"
            />
            <InfoBox 
            title="1.2k"
            subtitle="Followers"
            titleStyles="text-xl"
            />
            </View>

         </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No messages Found"
            subtitle="No messages found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default profile;
