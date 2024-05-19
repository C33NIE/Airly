import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Alert, TextInput } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../../constants';
import { CustomButton } from '../../components';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { createMessage } from '../../lib/appwrite'; // Adjust this function name as necessary
import { useGlobalContext } from '../../context/GlobalProvider';

const Messages = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    Message: '',
    Image: null
  });

  const openPicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, Image: result.assets[0] });
    }
  };

  const submit = async () => {
    if (!form.Message) {
      return Alert.alert('Please fill in the message field');
    }

    setUploading(true);

    try {
      await createMessage({
        ...form,
        userID: user.$id,
      });
  
      Alert.alert('Success', 'Message posted successfully');
      router.push('/Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setForm({
        Message: '',
        Image: null
      });

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-black font-psemibold">
          Post your message
        </Text>
        <View style={[styles.formField, styles.messageInput]}>
          <Text className="text-base text-black-100 font-pmedium">
            Message
          </Text>
          <TextInput
            style={styles.textInput}
            value={form.Message}
            placeholder="Type your message here"
            multiline
            numberOfLines={5}
            onChangeText={(e) => setForm({ ...form, Message: e })}
          />
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-black-100 font-pmedium">
            Upload Image (Optional)
          </Text>

          <TouchableOpacity onPress={openPicker}>
            {form.Image ? (
              <Image
                source={{ uri: form.Image.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-40 px-4 bg-gray-200 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image source={icons.upload} resizeMode='contain' className="w-1/2 h-1/2" />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Submit & Post"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Messages;

const styles = StyleSheet.create({
  formField: {
    marginTop: 12,
  },
  messageInput: {
    height: 150,
  },
  textInput: {
    height: '100%',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    textAlignVertical: 'top', // Ensures the text starts from the top of the TextInput
  },
});
