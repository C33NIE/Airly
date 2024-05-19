import {Account,Avatars,Client, Databases, ID,Query,Storage} from 'react-native-appwrite'

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.air.airly",
  projectId: "6625431e7fa09dea72f7",
  storageId: "6636582f002f6cce4c7b",
  databaseId: "663654ac002c1baa352a",
  userCollectionId: "663656ae0018be12a135",
  MessageCollectionId: "663656c1003610e55f39",
  VideoCollectionId: "6640f3f1001cad1ff926",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw new Error('Account creation failed');

    const avatarUrl = avatars.getInitials(username);
    
    await signIn(email, password);
    
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountID: newAccount.$id,
        email,
        username,
        avatar: avatarUrl
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw new Error('No current account');

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountID', currentAccount.$id)]
    );

    if (!currentUser.documents.length) throw new Error('User not found');

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.MessageCollectionId,
      [Query.orderDesc('$createdAt'),Query.limit(100)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getlatestVideos = async () => {
  try {
    const videos = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.VideoCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(15)]
    );

    return videos.documents;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.MessageCollectionId,
      [Query.search('message', query)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserPosts = async (userID) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.MessageCollectionId,
      [Query.equal('users', userID)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession('current');
    return session;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === 'video') {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === 'image') {
      fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, 'top', 100);
    } else {
      throw new Error('Invalid file type');
    }

    if (!fileUrl) throw new Error('File URL generation failed');

    return fileUrl;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const uploadFile = async (file, type) => {
  if (!file) return null;

  const { mimeType, ...rest } = file;
  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.Thumbnail, 'image'),
      uploadFile(form.Video, 'video')
    ]);

    const newVideo = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.VideoCollectionId,
      ID.unique(),
      {
        Title: form.Title,
        Thumbnail: thumbnailUrl,
        Video: videoUrl,
        users: form.userID
      }
    );

    return newVideo;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createMessage = async (form) => {
  try {
    let imageUrl = null;

    if (form.Image) {
      imageUrl = await uploadFile(form.Image, 'image');
    }

    const newMessage = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.MessageCollectionId,
      ID.unique(),
      {
        message: form.Message,
        image: imageUrl,
        users: form.userID
      }
    );

    return newMessage;
  } catch (error) {
    throw new Error(error.message);
  }
};
