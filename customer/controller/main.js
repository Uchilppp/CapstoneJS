import { Service } from '../services/phoneService.js';
import { CartItem } from '../model/cartItem.js';
import { Product } from '../model/product.js';

const getEle = (id) => document.getElementById(id);
const service = new Service();

// ===== BIẾN TOÀN CỤC =====
// Mảng giỏ hàng - chứa các đối tượng CartItem
let cart = [];

// ===========================
// PHẦN 1 - TASK 3: Hiển thị danh sách sản phẩm
// ===========================
const renderList = (phoneList) => {
  let content = '';
  phoneList.forEach((ele) => {
    content += `
    <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
      <div class="card product-card h-100">
        <div class="content-overlay"></div>
        <img
          src="${ele.img}"
          class="card-img"
          alt="${ele.name}"
          onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'"
        />
        <div class="content-details fadeIn-top">
          <h3 class="spec-title">Specifications</h3>
          <div class="spec-item">
            <span><b>Screen:</b>&nbsp;${ele.screen}</span>
          </div>
          <div class="spec-item">
            <span><b>Back Camera:</b>&nbsp;${ele.backCamera}</span>
          </div>
          <div class="spec-item">
            <span><b>Front Camera:</b>&nbsp;${ele.frontCamera}</span>
          </div>
          <p class="click-detail"><u>Click for more details</u></p>
        </div>
        <div class="card-body d-flex flex-column">
          <div class="text-center">
            <h5 class="card-title">${ele.name}</h5>
            <div class="price-group">
              <span class="price-current">$${ele.price}</span>
              <span class="price-old"><s>$${Number(ele.price) + 300}</s></span>
            </div>
          </div>
          <div class="brand-box text-center mt-2">
            <span class="brand-tag">${ele.type}</span>
          </div>
          <div class="description mt-2">
            <span><b>Description:</b> ${ele.desc}</span>
          </div>
          <div class="d-flex justify-content-between mt-2">
            <div class="rating text-warning">
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star-half-alt"></i>
            </div>
            <span class="text-success"><b>In Stock</b></span>
          </div>
          <button
            type="button"
            class="btn btn-add-cart mt-3"
            onclick="btnAddToCart('${ele.id}')"
            id="addCart-${ele.id}"
          >
            <i class="fa fa-cart-plus me-2"></i>Add to cart
          </button>
        </div>
      </div>
    </div>`;
  });
  getEle('phoneList').innerHTML = content;
};

// ===========================
// PHẦN 1 - TASK 8 + 10: Render giỏ hàng + Tổng tiền
// ===========================
const renderCart = (cart) => {
  let content = '';
  cart.forEach((ele) => {
    content += `
    <div class="cart-product">
      <div class="cart-product__left">
        <div class="cart-thumbnail">
          <img src="${ele.product.img}" alt="${ele.product.name}" onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'">
        </div>
        <div class="cart-details">
          <div class="cart-name"><b>${ele.product.name}</b></div>
          <div class="cart-spec">Screen: <span class="spec-value">${ele.product.screen}</span></div>
          <div class="cart-spec">Back Camera: <span class="spec-value">${ele.product.backCamera}</span></div>
          <div class="cart-spec">Front Camera: <span class="spec-value">${ele.product.frontCamera}</span></div>
          <div class="cart-remove">
            <a href="#!" onclick="btnRemove('${ele.product.id}')" class="remove-link">
              <i class="fa fa-trash me-1"></i>Remove
            </a>
          </div>
        </div>
      </div>
      <div class="cart-product__right">
        <div class="qty-control">
          <span><b>Qty:</b></span>
          <span class="qty-btn minus" onclick="btnMinus('${ele.product.id}')">−</span>
          <span class="qty-value">${ele.quantity}</span>
          <span class="qty-btn plus" onclick="btnAdd('${ele.product.id}')">+</span>
        </div>
        <div class="cart-item-price"><b>$${ele.quantity * ele.product.price}</b></div>
      </div>
    </div>`;
  });
  getEle('cartList').innerHTML = content;

  // Tính số lượng hiển thị trên icon giỏ hàng
  let cartCount = 0;
  cart.forEach((ele) => { cartCount += ele.quantity; });

  // TASK 10: Tính tổng tiền
  const subTotal = calculateSubTotal(cart);
  const shipping = subTotal > 0 ? 10 : 0;
  const tax = Math.floor(subTotal * 0.1);

  getEle('cartCount').innerHTML = cartCount;
  getEle('shipping').innerHTML = '$' + shipping;
  getEle('subTotal').innerHTML = '$' + subTotal;
  getEle('tax').innerHTML = '$' + tax;
  getEle('priceTotal').innerHTML = '$' + Math.floor(subTotal * 1.1 + shipping);
};

// Hàm tính tổng tiền (price * quantity cho tất cả items)
const calculateSubTotal = (cart) => {
  let subTotal = 0;
  cart.forEach((ele) => {
    subTotal += ele.product.price * ele.quantity;
  });
  return subTotal;
};

// Hàm tìm CartItem trong giỏ hàng theo ID sản phẩm
const findItemById = (cart, id) => {
  let item;
  cart.forEach((ele) => {
    if (ele.product.id == id) {
      item = ele;
    }
  });
  return item;
};

// ===========================
// KHỞI ĐỘNG: Load sản phẩm + load giỏ từ localStorage
// ===========================
window.onload = async () => {
  // TASK 3: Load và hiển thị danh sách sản phẩm
  const phoneList = await service.getPhones();
  renderList(phoneList);

  // TASK 11: Load giỏ hàng từ localStorage
  cart = localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : [];
  renderCart(cart);
};

// ===========================
// PHẦN 1 - TASK 4: Filter theo loại sản phẩm (dropdown)
// ===========================
getEle('selectList').onchange = async () => {
  const data = await service.getPhones();
  const selectValue = getEle('selectList').value;
  // Nếu chọn "all" thì hiện hết, ngược lại filter theo type
  let filterData = selectValue == 'all'
    ? data
    : data.filter((ele) => ele.type == selectValue);
  renderList(filterData);
};

// ===========================
// PHẦN 1 - TASK 5, 6, 7: Thêm sản phẩm vào giỏ hàng
// ===========================
window.btnAddToCart = async (productId) => {
  // Gọi API lấy thông tin sản phẩm theo ID
  const phoneData = await service.getPhoneById(productId);
  const { id, name, price, screen, backCamera, frontCamera, img, desc, type } = phoneData;

  // TASK 6: Tạo đối tượng Product
  const product = new Product(id, name, price, screen, backCamera, frontCamera, img, desc, type);

  // TASK 6: Tạo CartItem riêng biệt (không push Product thẳng vào cart)
  const newCartItem = new CartItem(product, 1);

  // TASK 7: Kiểm tra logic thêm vào giỏ
  let cartItem = findItemById(cart, newCartItem.product.id);
  if (!cartItem) {
    // Chưa có trong giỏ → push với quantity = 1
    cart.push(newCartItem);
  } else {
    // Đã có → chỉ tăng quantity lên 1
    cartItem.quantity++;
  }

  renderCart(cart);
  // TASK 11: Lưu giỏ hàng vào localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
};

// ===========================
// PHẦN 1 - TASK 9: Tăng số lượng trong giỏ hàng
// ===========================
window.btnAdd = (id) => {
  let cartItem = findItemById(cart, id);
  if (cartItem) cartItem.quantity++;
  renderCart(cart);
  localStorage.setItem('cart', JSON.stringify(cart));
};

// ===========================
// PHẦN 1 - TASK 9: Giảm số lượng trong giỏ hàng
// ===========================
window.btnMinus = (id) => {
  let cartItem = findItemById(cart, id);
  if (cartItem) cartItem.quantity--;
  // Tự động xóa nếu số lượng về 0
  cart = cart.filter((ele) => ele.quantity != 0);
  renderCart(cart);
  localStorage.setItem('cart', JSON.stringify(cart));
};

// ===========================
// PHẦN 1 - TASK 13: Xóa sản phẩm khỏi giỏ hàng
// ===========================
window.btnRemove = (id) => {
  cart = cart.filter((ele) => ele.product.id != id);
  renderCart(cart);
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Empty cart (dùng trong thanh toán)
window.emptyCart = () => {
  cart = [];
  renderCart(cart);
  localStorage.setItem('cart', JSON.stringify(cart));
};

// ===========================
// PHẦN 1 - TASK 12: Nút thanh toán - clear giỏ hàng
// ===========================
window.payNow = () => {
  if (cart.length > 0) {
    Swal.fire({
      icon: 'success',
      title: 'Your order is completed!',
      text: 'Thank you for shopping with us!',
      showConfirmButton: false,
      timer: 2000,
    });
    emptyCart();
    localStorage.setItem('cart', JSON.stringify(cart));
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Your cart is empty!',
    });
  }
};
