// Dummy Product Data
const products = [
    {
        id: 1,
        name: "Minimalist Cotton Tee",
        category: "men",
        price: 45,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "A staple for any wardrobe. Made from 100% organic cotton, this tee offers a relaxed fit and breathable comfort.",
        isBestSeller: true
    },
    
    },
    {
        id: 4,
        name: "Slim Fit Chinos",
        category: "men",
        price: 85,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Perfectly tailored chinos for a smart-casual look. Available in neutral tones.",
        isBestSeller: false
    },
    {
        id: 5,
        name: "Silk Blouse",
        category: "women",
        price: 110,
        image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Luxurious silk blouse that adds a touch of sophistication to any outfit.",
        isBestSeller: true
    },
    {
        id: 6,
        name: "Leather Weekend Bag",
        category: "essentials",
        price: 320,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Handcrafted leather bag, spacious enough for all your weekend getaway essentials.",
        isBestSeller: true
    },
    {
        id: 7,
        name: "Cashmere Sweater",
        category: "women",
        price: 180,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Soft, warm, and incredibly comfortable. The ultimate luxury essential.",
        isBestSeller: false
    },
    {
        id: 8,
        name: "Oxford Shirt",
        category: "men",
        price: 75,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Crisp white oxford shirt. A timeless classic for professional and casual wear.",
        isBestSeller: false
    }
];

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const bestSellersGrid = document.getElementById('best-sellers-grid');
const cartCount = document.querySelector('.cart-count');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    if (bestSellersGrid) {
        renderBestSellers();
    }

    if (productGrid) {
        renderShopProducts();
        setupFilters();
    }

    if (document.getElementById('product-detail-container')) {
        renderProductDetail();
    }

    if (document.getElementById('contact-form')) {
        setupContactForm();
    }

    if (document.getElementById('cart-content')) {
        renderCartPage();
    }
});

// Render Functions
function renderProductCard(product) {
    return `
        <div class="product-card">
            <a href="product.html?id=${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="product-price">$${product.price}</p>
                </div>
            </a>
        </div>
    `;
}

function renderBestSellers() {
    const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
    bestSellersGrid.innerHTML = bestSellers.map(renderProductCard).join('');
}

function renderShopProducts(filteredProducts = products) {
    productGrid.innerHTML = filteredProducts.map(renderProductCard).join('');
}

// Shop Filters
function setupFilters() {
    const categoryInputs = document.querySelectorAll('input[name="category"]');
    const priceInputs = document.querySelectorAll('input[name="price"]');

    function filterProducts() {
        const selectedCategories = Array.from(categoryInputs)
            .filter(input => input.checked)
            .map(input => input.value);

        const selectedPrices = Array.from(priceInputs)
            .filter(input => input.checked)
            .map(input => input.value);

        let filtered = products;

        if (selectedCategories.length > 0) {
            filtered = filtered.filter(p => selectedCategories.includes(p.category));
        }

        if (selectedPrices.length > 0) {
            filtered = filtered.filter(p => {
                return selectedPrices.some(range => {
                    const [min, max] = range.split('-').map(Number);
                    if (max) return p.price >= min && p.price <= max;
                    return p.price >= min; // For "200+"
                });
            });
        }

        renderShopProducts(filtered);
    }

    categoryInputs.forEach(input => input.addEventListener('change', filterProducts));
    priceInputs.forEach(input => input.addEventListener('change', filterProducts));
}

// Product Detail Page
function renderProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    const product = products.find(p => p.id === productId);

    if (!product) {
        document.getElementById('product-detail-container').innerHTML = '<p>Product not found.</p>';
        return;
    }

    // Update DOM
    document.getElementById('main-image').src = product.image;
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `$${product.price}`;
    document.getElementById('product-description').textContent = product.description;

    // Update Thumbnails (using main image for now as we don't have multiple images in data)
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.src = product.image;
    });

    // Size Selection
    const sizeBtns = document.querySelectorAll('.size-btn');
    let selectedSize = null;

    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedSize = btn.dataset.size;
        });
    });

    // Add to Cart
    document.getElementById('add-to-cart').addEventListener('click', () => {
        if (!selectedSize) {
            alert('Please select a size.');
            return;
        }
        addToCart(product, selectedSize);
    });
}

// Cart Logic
function addToCart(product, size) {
    cart.push({ ...product, size, cartId: Date.now() });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Added to cart!');
}

function updateCartCount() {
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(el => {
        el.textContent = cart.length;
    });
}

function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartPage();
}

function renderCartPage() {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;

    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <br>
                <a href="shop.html" class="btn">Start Shopping</a>
            </div>
        `;
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    cartContent.innerHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${cart.map(item => `
                    <tr>
                        <td>
                            <div class="cart-item-info">
                                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                                <span>${item.name}</span>
                            </div>
                        </td>
                        <td>${item.size}</td>
                        <td>$${item.price}</td>
                        <td><button class="remove-btn" onclick="removeFromCart(${item.cartId})">Remove</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="cart-summary">
            <div class="summary-row">
                <span>Subtotal</span>
                <span>$${total}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>Free</span>
            </div>
            <div class="summary-row total-row">
                <span>Total</span>
                <span>$${total}</span>
            </div>
            <a href="checkout.html" class="btn" style="width: 100%; margin-top: 1rem; text-align: center;">Proceed to Checkout</a>
        </div>
    `;
}

// Checkout Page Logic
if (window.location.pathname.includes('checkout.html')) {
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    const checkoutForm = document.getElementById('checkout-form');

    if (cart.length === 0) {
        window.location.href = 'cart.html';
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    checkoutItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.name} (x1)</span>
            <span>$${item.price}</span>
        </div>
    `).join('');

    checkoutTotal.textContent = `$${total}`;

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your order! This is a demo site, so no payment was processed.');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });
}


// Contact Form Validation
function setupContactForm() {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Simple validation
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        if (name.value.trim() === '') {
            showError(name, 'Name is required');
            isValid = false;
        } else {
            clearError(name);
        }

        if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email');
            isValid = false;
        } else {
            clearError(email);
        }

        if (message.value.trim() === '') {
            showError(message, 'Message is required');
            isValid = false;
        } else {
            clearError(message);
        }

        if (isValid) {
            alert('Message sent successfully! (Demo only)');
            form.reset();
        }
    });
}

function showError(input, message) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message');
    error.textContent = message;
    error.style.display = 'block';
    input.style.borderColor = 'red';
}

function clearError(input) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message');
    error.style.display = 'none';
    input.style.borderColor = '#ddd';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
