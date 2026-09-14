// API URL MockAPI - Project: capstone-js
const API_URL = 'https://6aa7e1fc9b08676cd32b9c0d.mockapi.io/Products';

export class Service {
  // Lấy tất cả sản phẩm
  getPhones = async () => {
    try {
      const res = await axios({
        url: API_URL,
        method: 'GET',
      });
      return res.data;
    } catch (err) {
      console.log('Error getPhones:', err);
    }
  };

  // Lấy sản phẩm theo ID
  getPhoneById = async (id) => {
    try {
      const res = await axios({
        url: `${API_URL}/${id}`,
        method: 'GET',
      });
      return res.data;
    } catch (err) {
      console.log('Error getPhoneById:', err);
    }
  };
}
