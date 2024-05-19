import { FlatList, RefreshControl, StyleSheet, Text,View} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'react-native'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { useState } from 'react'
import { getAllPosts, getlatestVideos } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import Message from '../../components/Message'
import {useGlobalContext} from '../../context/GlobalProvider'

const Home = () => {
  
  const { user,setUser,setIsLoggedIn } = useGlobalContext();
  const {data:posts,refetch} = useAppwrite(getAllPosts);
  const {data:latestVideos} = useAppwrite(getlatestVideos);

const [refreshing, setRefreshing] = useState(false);

const onRefresh = async () => {
  setRefreshing(true);
  await refetch();
  setRefreshing(false);
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
      <View className="my-6 px-4 space-y-6">
        <View className="justify-between items-start flex-row mb-6">
          <View>
            <Text className="font-pmedium text-sm text-blue-400">
              Welcome Back,
            </Text>
            <Text className="text-2xl font-psemibold text-black">
              {user?.username}
            </Text>
          </View>
          <View className="mt-1.5"> 
            <Image
              source={images.logoSmall}
              className="w-12 h-12"
              resizeMode="contain"
            />
          </View>
        </View>
          <SearchInput />
          <View className="w-full flex-1 pt-5 pb-8">
            <Text className="text-blue-500 text-lg font-pregular mb-3">
                Latest Content
            </Text>
          <Trending videos={latestVideos ?? []}/>
          </View>
      </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Messages Found"
            subtitle= "Be the first Message!"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({})