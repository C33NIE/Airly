import { StyleSheet, Text, View,ScrollView,Image, Alert } from 'react-native'
import React from 'react'
import {SafeAreaView} from 'react-native-safe-area-context'
import {images} from '../../constants'
import { CustomButton, FormField } from '../../components'
import { useState } from 'react'
import { Link } from 'expo-router'
import { createUser } from '../../lib/appwrite'
import { router } from 'expo-router'



const signup = () => {
  const [form, setForm] = useState({
    username: '',
    email:'',
    password:''
  })

  const [isSubmitting, setisSubmitting] = useState(false)
  
  const submit = async ()  => {
    if(form.username === "" || form.email === ""|| form.password ==="")
      {
        Alert.alert('Error','please fill in all the fields');
      }

      setisSubmitting(true);
      try {
        const result = await createUser(form.email,form.password,form.username);
        setUser(result);
        setIsLogged(true);
        
        
        router.replace('/Home');
      } catch (error) {
        Alert.alert('You have been registered, now login'); 
      }finally{
        setisSubmitting(false);
      }
  };


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] px-4 my-6">
        <Image source={images.logo} resizeMode='contain' className="w-[200px] h-[100px]" />
        <Text className="text-2xl font-semibold text-secondary mt-10 margin-bottom-20 font-psemibold ">
            Sign Up to Airly
        </Text>
        <FormField
          title = "Username"
          value = {form.username}
          handleChangeText={(e) => setForm({...form,
          username: e })}
          otherStyles="mt-10"
        />

        <FormField
          title = "Email"
          value = {form.email}
          handleChangeText={(e) => setForm({...form,
          email: e })}
          otherStyles="mt-7"
          keyboardType="email-address"
        />

        <FormField
          title = "Password"
          value = {form.password}
          handleChangeText={(e) => setForm({...form,
          password: e })}
          otherStyles="mt-7"
        />

        <CustomButton 
          title="Sign up"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={isSubmitting}
        />

        <View className="justify-center pt-5 flex-row-gap-2">
          <Text className="text-lg text-gray-100 font-pregular">
            Have an Account Already?    
            <Link href="/signin" className="text-lg font-psemibold text-secondary-200">  Sign In</Link>
          </Text>
        </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default signup

const styles = StyleSheet.create({})