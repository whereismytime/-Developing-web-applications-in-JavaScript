const CART_PRODUCT_LABEL = "cart-products";

const getProducts = async () => {
    $('.preloader').show();
    const response = await fetch("https://fakestoreapi.com/products?limit=12");
    const products = await response.json();
    return products;
}

const renderProducts = async () => {
    const products = await getProducts();
    const container = document.querySelector(".products-container");
    for (const item of products) {
        const productWrapper = document.createElement("li");
        const productImg = document.createElement("img");
        const productContent = document.createElement("div");
        const productTitle = document.createElement("h4");
        const productDescription = document.createElement("p");
        const productPriceSection = document.createElement("div");
        const productPrice = document.createElement("span");
        const productBuyBtn = document.createElement("button");

        productWrapper.classList.add("product-item");
        productContent.classList.add("product-content");
        productTitle.classList.add("product-title");
        productDescription.classList.add("product-description");
        productPriceSection.classList.add("product-item-price");

        productImg.src = item.image;
        productTitle.innerText = item.title;
        productDescription.innerText = item.description;
        productPrice.innerText = `${item.price} $`;
        productBuyBtn.innerText = "Buy";

        productBuyBtn.addEventListener("click", () => addToCart(item));

        productPriceSection.append(productPrice, productBuyBtn);
        productContent.append(productTitle, productDescription, productPriceSection);
        productWrapper.append(productImg, productContent);
        container.append(productWrapper);
    }
    $('.preloader').hide();
    renderInitialCart();
}

const renderInitialCart = () => {
    const currentCartProducts = getCurrentCartItems();
    if (!currentCartProducts.length) {
        return;
    }
    currentCartProducts.array.forEach(item => renderCartItem(item, item.amount));
    getCartTotal();
}
const getCurrentCartItems = () => JSON.parse(localStorage.getItem(CART_PRODUCT_LABEL)) || [];
const setCurrentCartItems = (products) => {
    localStorage.setItem(CART_PRODUCT_LABEL, JSON.stringify(products));
}
const renderCartItem = (product, inputnumber) => {
    $('.preloader').show();
    const cart = document.querySelector(".cart-list");
    const emptyCartTitle = document.querySelector(".cart-empty-title");
    const cartListWrapper = document.querySelector(".cart-list-wrapper");
    const cartListItem = document.createElement("li");
    const cartListImgSection = document.createElement("section");
    const cartListPriceSection = document.createElement("section");
    const cartListQuantitySection = document.createElement("section");
    const image = document.createElement("img");
    const title = document.createElement("h4");
    const price = document.createElement("span");
    const quantity = document.createElement("input");
    const removeBtn = document.createElement("button");
    quantity.addEventListener("change", () => getCartTotal(product));
    removeBtn.addEventListener("click", (event) => removeProductFromCart(event, product))
    cartListItem.classList.add("cart-list-item");
    cartListImgSection.classList.add(
        "cart-list-item-section",
        "cart-list-img-section"
    );
    cartListQuantitySection.classList.add(
        "cart-list-item-section",
        "cart-list-quantity-section"
    );
    cartListPriceSection.classList.add(
        "cart-list-item-section",
        "cart-list-price-section"
    );
    image.src = product.image;
    title.innerText = product.title;
    price.innerText = `${product.price} $`;
    quantity.type = "number";
    quantity.value = inputnumber || 1;
    quantity.min = 1;
    removeBtn.innerText = "Remove";
    emptyCartTitle.style.display = "none";
    cartListWrapper.style.display = "block";
    cartListImgSection.append(image, title);
    cartListPriceSection.appendChild(price);
    cartListQuantitySection.append(quantity, removeBtn);
    cartListItem.setAttribute("id", product.id);
    cartListItem.append(
        cartListImgSection,
        cartListPriceSection,
        cartListQuantitySection
    );
    cart.appendChild(cartListItem);
    $('.preloader').hide();
}
const addToCart = (product) => {
    const cartItems = document.getElementsByClassName("cart-list-item");
    for (const item of cartItems) {
        if (product.id === +item.getAttribute("id")) {
            const quantityInput = item.querySelector(".cart-list-quantity-section > input");
            quantityInput.value++;
            getCartTotal(product);
            return;
        }
    }
    renderCartItem(product);
    getCartTotal(product);
}
const getCartTotal = (product) => {
    const totalAmount = document.querySelector(".total-amount > span");
    const cartItems = document.getElementsByClassName("cart-list-item");
    let total = 0;
    for (const item of cartItems) {
        const price = item.querySelector(".cart-list-price-section > span");
        const quantity = item.querySelector(".cart-list-quantity-section > input");
        const currentAmount = parseFloat(price.innerText) * quantity.value;
        total += currentAmount;
    }
    totalAmount.innerText = `${total.toFixed(2)}`;
    localStorage.setItem("total", total.toFixed(2));
    saveProduct(product);
}
const saveProduct = (product) => {
    if (!product) return;
    const currentCartProducts = getCurrentCartItems();
    const productInCart = currentCartProducts.findIndex((item) => item.id == product.id);
    if (productInCart > -1) {
        product.amount++;
        currentCartProducts.splice(productInCart, 1, product);
    }
    else {
        product.amount = 1;
        currentCartProducts.push(product);
    }
    setCurrentCartItems(currentCartProducts);
}
const removeProductFromCart = (event, product) => {
    event.target.parentElement.parentElement.remove();
    const cartListItems = document.getElementsByClassName("cart-list-item");
    if (!cartListItems.length) {
        const cartListWrapper = document.querySelector(".cart-list-wrapper");
        const emptyCartTitle = document.querySelector(".cart-empty-title");
        cartListWrapper.style.display = "none";
        emptyCartTitle.style.display = "block";
        localStorage.clear();
        return;
    }
    const currentCartProducts = getCurrentCartItems();
    const filteredArr = currentCartProducts.filter((item) => item.id !== product.id);
    setCurrentCartItems(filteredArr);
    getCartTotal();
}


function openCheckoutForm() {
    document.querySelector('.checkout-form').style.display = 'block';
}


function submitOrder() {
    const name = document.getElementById('customer-name').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const totalAmount = document.querySelector('.total-amount > span').innerText;

   
    const namePattern = /^[a-zA-Z\s]{2,50}$/; 
    const phonePattern = /^\+?[0-9]{10,15}$/; 

    
    if (!namePattern.test(name)) {
        alert("Please enter a valid name (only letters, 2-50 characters).");
        return;
    }

    
    if (!phonePattern.test(phone)) {
        alert("Please enter a valid phone number (10-15 digits, optional + at start).");
        return;
    }

    
    if (!address) {
        alert("Please enter your address.");
        return;
    }

    
    alert(`Order confirmed!\nName: ${name}\nAddress: ${address}\nPhone: ${phone}\nOrder Total: ${totalAmount} $`);

    
    localStorage.clear();
    document.querySelector('.cart-list').innerHTML = '';
    document.querySelector('.total-amount > span').innerText = '0';
    document.querySelector('.checkout-form').style.display = 'none';
    document.querySelector('.cart-empty-title').style.display = 'block';
    document.querySelector('.cart-list-wrapper').style.display = 'none';
}

renderProducts();
