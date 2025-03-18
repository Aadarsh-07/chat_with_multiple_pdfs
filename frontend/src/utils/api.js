import axios from 'axios';

export const uploadFiles = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  try {
    const response = await axios.post('http://localhost:8000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response);
    return { success: true, message: response.data.message };
  } catch (error) {
    console.error('Error uploading files:', error);
    return { success: false, error: error.response?.data?.detail || error.message };
  }
};

export const searchQuery = async (query, collection_name) => {
  try {
    const response = await axios.post('http://localhost:8000/search', { query, collection_name });
    return response.data.answer;
  } catch (error) {
    console.error('Error searching query:', error);
    return { error: error.response?.data?.detail || error.message };
  }
};

export const getCollections = async () => {
  try {
    const response = await axios.get('http://localhost:8000/collections');
    return { success: true, collections: response.data.collections };
  } catch (error) {
    console.error('Error fetching collections:', error);
    return { success: false, error: error.response?.data?.detail || error.message };
  }
};
