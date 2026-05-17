import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const FILES_API = `${REMOTE_SERVER}/api/files`;

export const uploadFile = async (file: any, itemId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("itemId", itemId);

  
    const response = await axios.post(`${FILES_API}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  
    return response.data;
  };


  export const fetchFiles = async () => {
    const response = await axios.get(`${FILES_API}`);
    return response.data; 
  };


  export const deleteFile = async (fileId: string) => {
    try {
      const response = await axios.delete(`${FILES_API}/${fileId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete file:", error);
      throw error;
    }
  };