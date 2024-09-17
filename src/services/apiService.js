import axios from 'axios';

export const generateCompanyProfile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/generate_company_profile`, formData, {
      headers: {
        'X-API-Key': import.meta.env.VITE_SERVICE_API_KEY,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to generate the company profile. Please try again.");
  }
};

