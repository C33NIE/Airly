import { ScrollView, StyleSheet, Text, TouchableOpacity, View,Image,Alert } from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FormField } from '../../components'
import { Video,ResizeMode } from 'expo-av'
import { icons } from '../../constants'
import {CustomButton} from '../../components'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { createVideo } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const Create = () => {
  const {user} = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form,setForm] = useState( {
    Title:'',
    Video: null,
    Thumbnail:null
  })

  const openPicker = async (selectType) => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: selectType === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
        aspect: [4, 3],
        quality: 1,
    });

    if(!result.canceled) {
      if(selectType === 'image')
        {
          setForm({...form, Thumbnail:result.assets[0]})
        }

        if(selectType === 'video')
          {
            setForm({...form,Video:result.assets[0]})
          }
    }
  }

  const submit = async () => {
    if(!form.Video || !form.Title || !form.Thumbnail)
      {
        return Alert.alert("please fill in all fields")
      }

      setUploading(true);

      try {
        await createVideo( {
          ...form,userID:user.$id
        })

        Alert.alert('Success', 'Post uploaded succesfully')
        router.push('/Home')
      } catch (error) {
        Alert.alert('Error',error.message)
      }finally {
        setForm({
          Title:'',
          Video: null,
          Thumbnail:null
        })

        setUploading(false);
      }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-black font-psemibold">
          Show Air what on your mind
        </Text>
        <FormField
        title = "Video Title"
        value = {form.Title}
        placeholder = "give your video a nice title"
        handleChangeText={(e) =>setForm({ ...form, Title: e })}
        otherStyles="mt-12"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-black-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker('video')}>
            {form.Video ? (
              <Video 
               source ={{uri: form.Video.uri}}
               className="w-full h-64 rounded-2xl"
               resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className="w-full h-40 px-4 bg-gray-200 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image source={icons.upload}
                  resizeMode='"contain' className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>

        </View>

        <View className="mt-7 space-y-2">
            <Text className="text-base text-black-100 font-pmedium">
              Thumbnail
            </Text>

            <TouchableOpacity onPress={() => openPicker('image')}>
            {form.Thumbnail ? (
              <Image
               source={{uri: form.Thumbnail.uri}}
               resizeMode='cover'
               className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-gray-200 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2 ">
                  <Image source={icons.upload}
                  resizeMode='"contain' className="w-5 h-5"
                  />

                  <Text className="text-sm text-black-100 font-pmedium">
                    choose a file
                  </Text>
                </View>
            )}
          </TouchableOpacity>
        </View>

        <CustomButton 
        title = "Submit & publish"
        handlePress={submit}
        containerStyles="mt-7"
        isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create

const styles = StyleSheet.create({})