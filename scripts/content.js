const baseUrl = "http://localhost:3113/api/oversea-ordering";
// const baseUrl = "https://api.mby.vn/api/oversea-ordering";
const isTaobao = location.hostname === 'item.taobao.com'
const isTMall = location.hostname === 'detail.tmall.com'
var tigia;
var token;
var varientContainer = document.getElementsByClassName("tb-skin");
var varientTMallContainer = document.getElementsByClassName("tm-clear");
chrome.storage.local.get("aaltoToken", (result) => {
  token = result.aaltoToken;
});

function updateGiaTMallItem(rate) {
  setTimeout(() => {
    const regex = /Price--priceText-.*/;
    const elements = document.querySelectorAll('*');

    const matchingElements = Array.from(elements).filter(element => {
      return Array.from(element.classList).some(className => regex.test(className));
    });

    const giaMoi = matchingElements[0].innerHTML
    if (!!giaMoi) {
      document.getElementById("aalto-daily-gia-ban").innerHTML = giaMoi;
    }
    const sanpham = document.querySelectorAll(".tb-amount dd em")[1].innerHTML;
    const sanphamconlai = parseInt(sanpham.match(/\d+/)[0]);
    document.getElementById("aalto-daily-con-lai").innerHTML = sanphamconlai;
  }, 200);
}

function updateGiaTaobaoItem(rate) {
  setTimeout(() => {
    const giaCu = document.getElementById("J_PromoPriceNum").innerHTML;
    const giaMoi = giaCu
      .split("-")
      .map((e) => (e * rate).toFixed(3) + "đ ")
      .join("-");
    document.getElementById("aalto-daily-gia-ban").innerHTML = giaMoi;
  }, 200);
}

function fetchTiGia() {
  fetch(`${baseUrl}/variables?name=exchangeRate&page=1&perPage=1`)
    .then((response) => response.json())
    .then((data) => {
      const exRate = data[0].value;
      const tiGiaEl = document.getElementById("aalto-daily-ti-gia");
      if (tiGiaEl) {
        tiGiaEl.innerHTML = exRate;
      }
      tigia = exRate;
      updateGiaTaobaoItem(exRate);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function addToCartTaobaoItem() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const pickProperty = document.querySelectorAll(".tb-skin .tb-selected");
  const properties = [];
  pickProperty.forEach((e) => {
    properties.push(e.dataset.value);
  });

  const quantity = document.getElementById("J_IptAmount").value;

  fetch(`${baseUrl}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "access-token": `${token}`,
    },
    body: JSON.stringify({
      id: productId,
      pvid: properties,
      volume: Number(quantity),
    }),
  })
    .then((response) => response.json()) // or .text() for text
    .then((data) => console.log(data))
    .catch((error) => {
      console.error("Error:", error);
    });
}

function purchase() { }

function main() {

  if (!!varientContainer.length && isTaobao) {
    const customActionsContainer = document.createElement("div");
    customActionsContainer.id = "to-platform";
    customActionsContainer.innerHTML = `
      <ul>
        <li>Giá bán: <span id="aalto-daily-gia-ban">200đ</span></li>
        <li>Tỷ giá 1 ¥: <span id="aalto-daily-ti-gia">3.480đ</span></li>
        <li>Còn <span id="aalto-daily-con-lai">200</span> sản phẩm</li>
      </ul>
  
      <div id="to-actions-container">
        <button id="purchase-btn">Mua hàng</button>
        <button id="cart-btn" onclick="addToCart()">
          <svg
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z"
              stroke-width="1.5"
            />
            <path
              d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z"
              stroke-width="1.5"
            />
            <path
              d="M11 10.8L12.1429 12L15 9"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2 3L2.26121 3.09184C3.5628 3.54945 4.2136 3.77826 4.58584 4.32298C4.95808 4.86771 4.95808 5.59126 4.95808 7.03836V9.76C4.95808 12.7016 5.02132 13.6723 5.88772 14.5862C6.75412 15.5 8.14857 15.5 10.9375 15.5H12M16.2404 15.5C17.8014 15.5 18.5819 15.5 19.1336 15.0504C19.6853 14.6008 19.8429 13.8364 20.158 12.3075L20.6578 9.88275C21.0049 8.14369 21.1784 7.27417 20.7345 6.69708C20.2906 6.12 18.7738 6.12 17.0888 6.12H11.0235M4.95808 6.12H7"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
          Thêm vào giỏ
        </button>
      </div>
          `;

    fetchTiGia();

    // On click product
    document.querySelectorAll(".J_TSaleProp li").forEach((item) => {
      item.addEventListener("click", (e) => {
        updateGiaTaobaoItem(tigia);
      });
    });

    // actions container
    const [purchaseButton, addToCartButton] =
      customActionsContainer.getElementsByTagName("button");
    purchaseButton.addEventListener("click", purchase);
    addToCartButton.addEventListener("click", addToCartTaobaoItem);

    varientContainer[0].append(customActionsContainer);
  }

  if (!!varientTMallContainer.length && isTMall) {
    const customActionsContainer = document.createElement("div");
    customActionsContainer.id = "to-platform";
    customActionsContainer.innerHTML = `
      <ul>
        <li>Giá bán: <span id="aalto-daily-gia-ban">200đ</span></li>
        <li>Tỷ giá 1 ¥: <span id="aalto-daily-ti-gia">3.480đ</span></li>
        <li>Còn <span id="aalto-daily-con-lai">200</span> sản phẩm</li>
      </ul>
  
      <div id="to-actions-container">
        <button id="purchase-btn">Mua hàng</button>
        <button id="cart-btn" onclick="addToCart()">
          <svg
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z"
              stroke-width="1.5"
            />
            <path
              d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z"
              stroke-width="1.5"
            />
            <path
              d="M11 10.8L12.1429 12L15 9"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2 3L2.26121 3.09184C3.5628 3.54945 4.2136 3.77826 4.58584 4.32298C4.95808 4.86771 4.95808 5.59126 4.95808 7.03836V9.76C4.95808 12.7016 5.02132 13.6723 5.88772 14.5862C6.75412 15.5 8.14857 15.5 10.9375 15.5H12M16.2404 15.5C17.8014 15.5 18.5819 15.5 19.1336 15.0504C19.6853 14.6008 19.8429 13.8364 20.158 12.3075L20.6578 9.88275C21.0049 8.14369 21.1784 7.27417 20.7345 6.69708C20.2906 6.12 18.7738 6.12 17.0888 6.12H11.0235M4.95808 6.12H7"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
          Thêm vào giỏ
        </button>
      </div>
          `;

    fetchTiGia();

    document.querySelectorAll(".skuCate .skuItemWrapper .skuItem").forEach((item) => {
      item.addEventListener("click", (e) => {
        updateGiaTMallItem(tigia);
      });
    });

    const [purchaseButton, addToCartButton] =
      customActionsContainer.getElementsByTagName("button");
    purchaseButton.addEventListener("click", purchase);
    addToCartButton.addEventListener("click", addToCartTaobaoItem);

    varientTMallContainer[0].append(customActionsContainer);
  }
}

document.addEventListener("readystatechange", (event) => {
  main();
})