import { CustomModal, Helper } from './utis.js';
import { Services } from '../services/phoneService.js';
import { Validate } from './validate.js';
import { Phone } from '../model/phone.js';

const getEle = (id) => document.getElementById(id);
const resetForm = (formId) => getEle(formId).reset();

const helper = new Helper();
const service = new Services();
const validate = new Validate();

// Lưu danh sách tất cả để phục vụ tìm kiếm và sắp xếp
let allPhoneList = [];

// ===========================
// PHẦN 2 - TASK 1: Hiển thị danh sách sản phẩm (dùng Axios)
// ===========================
const renderList = async (list = null) => {
  // Nếu không truyền list thì lấy từ API
  if (list === null) {
    allPhoneList = await service.getPhones();
    list = allPhoneList;
  }
  let content = '';
  list.forEach((ele) => {
    content += `
    <tr>
      <td>${ele.id}</td>
      <td><strong>${ele.name}</strong></td>
      <td>$${ele.price}</td>
      <td style="text-align: center">
        <img src="${ele.img}" alt="${ele.name}" width="80" height="80"
          onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'"
          style="border-radius: 8px; object-fit: cover;">
      </td>
      <td>${ele.desc}</td>
      <td class="text-center action-col">
        <button class="btn btn-edit me-2" data-bs-toggle="modal" data-bs-target="#phoneModal" onclick="btnEdit('${ele.id}')">
          <i class="fa fa-pencil-square me-1"></i>Edit
        </button>
        <button class="btn btn-delete" onclick="btnDelete('${ele.id}')">
          <i class="fa fa-trash me-1"></i>Delete
        </button>
      </td>
    </tr>`;
  });
  getEle('tablePhone').innerHTML = content;
};

// ===========================
// KHỞI ĐỘNG
// ===========================
window.onload = async () => {
  await renderList();
};

// ===========================
// PHẦN 2 - TASK 1: Nút mở modal Thêm sản phẩm
// ===========================
getEle('addPhoneForm').onclick = () => {
  helper.clearTB();
  resetForm('formPhone');
  // Ẩn nút Update, hiện nút Add
  getEle('btnUpdate').style.display = 'none';
  getEle('btnAddPhone').style.display = 'inline-block';
  // Cập nhật tiêu đề modal
  getEle('modalTitle').innerHTML = 'Add New Phone';
};

// ===========================
// PHẦN 2 - TASK 1+2: Nút Thêm sản phẩm (POST) + Validation
// ===========================
getEle('btnAddPhone').onclick = async () => {
  const phoneList = await service.getPhones();
  // TASK 2: Kiểm tra validation trước khi submit
  if (!validate.isValid(phoneList)) return;

  const inputs = helper.getInputValue();
  let phone = new Phone('', ...inputs);
  await service.addPhone(phone);
  await renderList();
  resetForm('formPhone');
  helper.clearTB();

  // Đóng modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('phoneModal'));
  modal.hide();

  CustomModal.alertSuccess('Phone added successfully!');
};

// ===========================
// PHẦN 2 - TASK 1: Xóa sản phẩm (DELETE)
// ===========================
window.btnDelete = async (id) => {
  let res = await CustomModal.alertDelete(
    `This phone will be deleted permanently. You can't undo this action.`
  );
  if (res.isConfirmed) {
    await service.deletePhone(id);
    await renderList();
    CustomModal.alertSuccess('Phone deleted successfully!');
  }
};

// ===========================
// PHẦN 2 - TASK 1: Cập nhật sản phẩm (PUT) - Mở modal Edit
// ===========================
window.btnEdit = async (id) => {
  helper.clearTB();
  // Ẩn nút Add, hiện nút Update
  getEle('btnUpdate').style.display = 'inline-block';
  getEle('btnAddPhone').style.display = 'none';
  getEle('modalTitle').innerHTML = 'Update Phone';

  // Lấy dữ liệu phone từ API rồi điền vào form
  let data = await service.getPhoneById(id);
  // Lấy các value theo đúng thứ tự (bỏ qua id)
  const { name, price, screen, backCamera, frontCamera, img, desc, type } = data;
  helper.fill([name, price, screen, backCamera, frontCamera, img, desc, type]);

  // Gán sự kiện cho nút Update
  getEle('btnUpdate').onclick = async () => {
    const phoneList = await service.getPhones();
    // Validate khi update (isUpdate = true → bỏ qua check trùng tên)
    if (!validate.isValid(phoneList, true)) return;
    const inputs = helper.getInputValue();
    let phone = new Phone(id, ...inputs);
    await service.updatePhone(phone);
    await renderList();

    // Đóng modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('phoneModal'));
    modal.hide();

    CustomModal.alertSuccess('Phone updated successfully!');
  };
};

// ===========================
// PHẦN 2 - TASK 3: Tìm kiếm sản phẩm theo tên
// ===========================
getEle('searchInput').oninput = () => {
  const keyword = getEle('searchInput').value.trim().toLowerCase();
  if (keyword === '') {
    renderList(allPhoneList);
    return;
  }
  const filtered = allPhoneList.filter((phone) =>
    phone.name.toLowerCase().includes(keyword)
  );
  renderList(filtered);
};

// ===========================
// PHẦN 2 - TASK 4: Sắp xếp sản phẩm theo giá
// ===========================
getEle('sortSelect').onchange = () => {
  const sortValue = getEle('sortSelect').value;
  let sorted = [...allPhoneList]; // clone mảng tránh mutate original

  if (sortValue === 'asc') {
    // Giá từ thấp đến cao
    sorted.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortValue === 'desc') {
    // Giá từ cao đến thấp
    sorted.sort((a, b) => Number(b.price) - Number(a.price));
  } else {
    // Default - hiện toàn bộ
    sorted = allPhoneList;
  }
  renderList(sorted);
};
