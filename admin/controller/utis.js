const getEle = (id) => document.getElementById(id);

// Helper class - giúp thao tác với form inputs
export class Helper {
  // ID các input trong form
  inpArr = ['name', 'price', 'screen', 'backCam', 'frontCam', 'img', 'desc', 'type'];
  // ID các span hiển thị lỗi validation
  tbArr = ['tbname', 'tbprice', 'tbscreen', 'tbbackCam', 'tbfrontCam', 'tbimg', 'tbdesc', 'tbtype'];

  // Lấy giá trị tất cả inputs trong form
  getInputValue() {
    return this.inpArr.map((ele) => getEle(ele).value);
  }

  // Điền dữ liệu vào form (khi edit)
  fill(arr) {
    let fields = this.inpArr.map((ele) => getEle(ele));
    fields.forEach((ele, id) => {
      ele.value = arr[id];
    });
  }

  // Xóa thông báo lỗi validation
  clearTB() {
    let fields = this.tbArr.map((ele) => getEle(ele));
    fields.forEach((ele) => {
      ele.innerHTML = '&#8205'; // Ký tự vô hình giữ khoảng cách
    });
  }
}

// CustomModal - hiển thị thông báo bằng SweetAlert2
export class CustomModal {
  // Thông báo thành công
  static alertSuccess = (message) => {
    return Swal.fire({
      position: 'top-right',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  // Hộp thoại xác nhận xóa
  static alertDelete = (message) => {
    return Swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    });
  };
}
