import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const uploadImage = async (file: File, path: string): Promise<string> => {
  const filename = `${Date.now()}-${file.name}`;
  const storageRef = ref(storage, `${path}/${filename}`);
  
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};
