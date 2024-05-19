import { StyleSheet, Text, View,FlatList, TouchableOpacity, ImageBackground,Image } from 'react-native'
import React, {useState} from 'react';
import * as Animatable from 'react-native-animatable';
import { icons } from '../constants';
import { Video,resizeMode } from 'expo-av';

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1.0,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};


const TrendingItem = ({activeItem,item}) => {
 const [play, setPlay] = useState(false);

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration ={500}>
        {play ? (
          <Video
            source={{uri:item.Video}}
            className="w-52 h-72 rouned-[35px] mt-3 bg-white/10"
            resizeMode='{resizeMode.CONTAIN'
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={(status)=> {
              if(status.didJustFinish) {
                setPlay(false);
              }
            }}
          />
        ) : (
        <TouchableOpacity className="relative justify-center items-center" activeOpacity={0.7} onPress={() =>setPlay(true)}>
           <ImageBackground 
           source={{
            uri: item.Thumbnail
           }}
           className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
           resizeMode='cover'
           />

           <Image 
           source ={icons.play}
           className = "w-12 h-12 absolute"
           resizeMode = "contain"
           />
        </TouchableOpacity>
        )}
    </Animatable.View>
  )
}

const Trending = ({videos}) => {
  const [activeItem, setActiveItem] = useState(videos[1]);
  
  const viewableItemsChanged = ({viewableItems}) => {
    if(viewableItems.length > 0)
      {
        setActiveItem(viewableItems[0].key)
      }
  }
  return (
    <FlatList
    data={videos}
    keyExtractor={(item) => item.$id}
    renderItem={({item}) => (
      <TrendingItem activeItem={activeItem} item = {item}/>
  )}
  onViewableItemsChanged={viewableItemsChanged}
  viewabilityConfig={{
    itemVisiblePercentThreshold: 70
  }}
  conetnOffset = {{x:170}} //meaning after this point change key 
  horizontal
  />
)
}

export default Trending

const styles = StyleSheet.create({})
