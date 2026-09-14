const getEle = (id) => document.getElementById(id);

// Validate class - kiểm tra dữ liệu form trước khi submit
export class Validate {
  // Regex chỉ cho phép số
  numRegex = /^[0-9]+$/;

  // Hiển thị/ẩn thông báo lỗi
  messageSwitch = (isFalse, idTB, message = '') => {
    if (isFalse == false) {
      getEle(idTB).style.display = 'block';
      getEle(idTB).innerHTML = message;
      return false;
    } else if (isFalse == true) {
      getEle(idTB).innerHTML = '&#8205'; // Ký tự vô hình
      return true;
    }
  };

  // Kiểm tra field không được rỗng
  isNotEmpty(id, idTB) {
    let text = getEle(id).value.trim();
    return text == ''
      ? this.messageSwitch(false, idTB, `(*)This field can't be empty`)
      : this.messageSwitch(true, idTB);
  }

  // Kiểm tra dropdown đã chọn (không ở vị trí mặc định)
  isSelected(id, idTB) {
    let theSelect = getEle(id);
    return theSelect.selectedIndex == 0
      ? this.messageSwitch(false, idTB, '(*)Please select one option')
      : this.messageSwitch(true, idTB);
  }

  // Kiểm tra format bằng regex
  isMatch(id, idTB, format) {
    let text = getEle(id).value;
    return !text.match(format)
      ? this.messageSwitch(false, idTB, '(*)Price must be a number')
      : this.messageSwitch(true, idTB);
  }

  // Kiểm tra sản phẩm có trùng tên chưa
  isNotExist(phoneList, isUpdate = false) {
    if (isUpdate) return this.messageSwitch(true, 'tbname');
    for (let i = 0; i < phoneList.length; i++) {
      if (phoneList[i].name == getEle('name').value) {
        return this.messageSwitch(false, 'tbname', '(*)This phone already exists');
      }
    }
    return this.messageSwitch(true, 'tbname');
  }

  // Validate toàn bộ form - trả về true nếu hợp lệ
  isValid(phoneList, isUpdate) {
    let valid = true;
    valid &= this.isNotEmpty('name', 'tbname') && this.isNotExist(phoneList, isUpdate);
    valid &= this.isNotEmpty('price', 'tbprice') && this.isMatch('price', 'tbprice', this.numRegex);
    valid &= this.isNotEmpty('screen', 'tbscreen');
    valid &= this.isNotEmpty('backCam', 'tbbackCam');
    valid &= this.isNotEmpty('frontCam', 'tbfrontCam');
    valid &= this.isNotEmpty('img', 'tbimg');
    valid &= this.isNotEmpty('desc', 'tbdesc');
    valid &= this.isSelected('type', 'tbtype');
    return valid;
  }
}
