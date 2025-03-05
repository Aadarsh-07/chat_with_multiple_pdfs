import axios from 'axios';

export const uploadFiles = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  try {
    await axios.post(`${process.env.API_ENDPOINT}upload`, formData);
    return { success: true };
  } catch (error) {
    console.error('Error uploading files:', error);
    return { success: false };
  }
};

export const searchQuery = async (query) => {
  try {
    const response = await axios.post(`${process.env.API_ENDPOINT}search`, { query });
    return response.data.answer;
  } catch (error) {
    console.error('Error searching query:', error);
    return null;
  }
};
