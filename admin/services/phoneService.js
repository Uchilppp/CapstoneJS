// API URL MockAPI - Project: capstone-js
const API_URL = 'https://6aa7e1fc9b08676cd32b9c0d.mockapi.io/Products';

export class Services {
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

  // Thêm sản phẩm mới (POST)
  addPhone = async (phone) => {
    try {
      await axios({
        url: API_URL,
        method: 'POST',
        data: phone,
      });
    } catch (err) {
      console.log('Error addPhone:', err);
    }
  };

  // Xóa sản phẩm theo ID (DELETE)
  deletePhone = async (id) => {
    try {
      await axios({
        url: `${API_URL}/${id}`,
        method: 'DELETE',
      });
    } catch (err) {
      console.log('Error deletePhone:', err);
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

  // Cập nhật sản phẩm (PUT)
  updatePhone = async (phone) => {
    try {
      await axios({
        url: `${API_URL}/${phone.id}`,
        method: 'PUT',
        data: phone,
      });
    } catch (err) {
      console.log('Error updatePhone:', err);
    }
  };
}
