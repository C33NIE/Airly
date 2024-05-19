import React, { useState } from 'react';
import { View, Text, Image, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { icons } from '../constants';

const Message = ({ Message: { message, image, users: { username, avatar } } }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImage = (img) => {
    setSelectedImage(img);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} resizeMode="cover" />
          </View>
          <View style={styles.usernameContainer}>
            <Text style={styles.username} numberOfLines={1}>{username}</Text>
          </View>
        </View>
        <View style={styles.menuIconContainer}>
          <Image source={icons.menu} style={styles.menuIcon} resizeMode="contain" />
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.messageContainer}
      >
        <Text style={styles.messageText}>{message}</Text>
        {image && (
          <TouchableOpacity onPress={() => openImage(image)}>
            <Image source={{ uri: image }} style={styles.messageImage} resizeMode="cover" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'column', paddingHorizontal: 4, marginBottom: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { width: 46, height: 46, borderRadius: 23, borderColor: 'gray', borderWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 0.5 },
  avatar: { width: '100%', height: '100%', borderRadius: 23 },
  usernameContainer: { flex: 1, marginLeft: 3, justifyContent: 'center' },
  username: { fontSize: 12, color: 'gray' },
  menuIconContainer: { paddingTop: 2 },
  menuIcon: { width: 20, height: 20 },
  messageContainer: { width: '100%', borderRadius: 10, marginTop: 3, backgroundColor: '#007AFF' },
  messageText: { padding: 10, color: 'white' },
  messageImage: { width: '100%', height: 200, borderRadius: 10 },
  modalView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' },
  closeButton: { position: 'absolute', top: 40, right: 20, padding: 10, backgroundColor: '#fff', borderRadius: 10 },
  closeButtonText: { color: '#007AFF', fontWeight: 'bold' },
  fullImage: { width: '100%', height: '80%', borderRadius: 10 },
});

export default Message;
