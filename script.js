// Products are loaded from products.js

// DOM Elements
const productGrid = document.getElementById('product-grid');
const modal = document.getElementById('checkout-modal');
const backBtn = document.getElementById('back-btn');
const orderForm = document.getElementById('order-form');

// Modal Elements
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDesc = document.getElementById('modal-desc');

let currentProduct = null;
let currentImageIndex = 0;

// Inject Products
function renderProducts() {
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price}</p>
            </div>
        `;

        card.addEventListener('click', () => openModal(product));
        productGrid.appendChild(card);
    });
}

function goToImage(index) {
    if (!currentProduct) return;
    const images = document.querySelectorAll('.carousel-img');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (images[currentImageIndex]) images[currentImageIndex].classList.remove('active');
    if (dots[currentImageIndex]) dots[currentImageIndex].classList.remove('active');
    
    currentImageIndex = index;
    
    if (images[currentImageIndex]) images[currentImageIndex].classList.add('active');
    if (dots[currentImageIndex]) dots[currentImageIndex].classList.add('active');
}

// Modal Logic
function openModal(product, skipHistory = false) {
    if (!skipHistory) {
        const url = new URL(window.location);
        url.searchParams.set('product', product.id);
        window.history.pushState({}, '', url);
    }

    currentProduct = product;
    currentImageIndex = 0;
    
    // Setup carousel
    const carousel = document.getElementById('image-carousel');
    const dotsContainer = document.getElementById('carousel-dots');
    carousel.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    product.images.forEach((imgSrc, index) => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.className = index === 0 ? 'carousel-img active' : 'carousel-img';
        carousel.appendChild(img);
        
        const dot = document.createElement('div');
        dot.className = index === 0 ? 'carousel-dot active' : 'carousel-dot';
        dot.addEventListener('click', () => goToImage(index));
        dotsContainer.appendChild(dot);
    });

    modalTitle.textContent = product.name;
    modalPrice.textContent = product.price;
    modalDesc.textContent = product.description;

    // Set hidden form fields
    document.getElementById('form-product').value = product.name;
    document.getElementById('form-price').value = product.price;

    // Clear inputs
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-address').value = '';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

document.getElementById('carousel-prev').addEventListener('click', () => {
    if (currentProduct) {
        const newIndex = (currentImageIndex - 1 + currentProduct.images.length) % currentProduct.images.length;
        goToImage(newIndex);
    }
});

document.getElementById('carousel-next').addEventListener('click', () => {
    if (currentProduct) {
        const newIndex = (currentImageIndex + 1) % currentProduct.images.length;
        goToImage(newIndex);
    }
});

function closeModal(skipHistory = false) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentProduct = null;

    if (!skipHistory) {
        const url = new URL(window.location);
        url.searchParams.delete('product');
        window.history.pushState({}, '', url);
    }
}

backBtn.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxuBzn-u3a8UlmyFmMUjFB3HT0nhOj1h3sOhpVxWyeagElAB6CMFyJsvggbWpW48mpp/exec'; // Replace this with your generated URL

// Form Submission Logic (Google Sheets)
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
        alert("Developer: Please set up the Google Sheet and paste the Web App URL in script.js!");
        return;
    }

    const submitBtn = document.getElementById('submit-order-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    const formData = new FormData(orderForm);

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
    })
        .then(() => {
            alert("Order placed successfully! We will contact you shortly to confirm your delivery.");
            closeModal();
            orderForm.reset();
        })
        .catch((error) => {
            alert("There was an error placing your order. Please try again.");
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
});

// Initialize
renderProducts();

// Check if URL has a product ID and open it automatically
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('product');
if (productId) {
    const productToOpen = products.find(p => p.id === productId);
    if (productToOpen) {
        openModal(productToOpen, true);
    }
}

// Handle browser back/forward buttons for modal routing
window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    const pId = params.get('product');
    if (pId) {
        const pToOpen = products.find(p => p.id === pId);
        if (pToOpen) openModal(pToOpen, true);
    } else if (modal.classList.contains('active')) {
        closeModal(true);
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.style.padding = '1rem 4rem';
        nav.style.background = 'rgba(5, 5, 5, 0.9)';
    } else {
        nav.style.padding = '1.5rem 4rem';
        nav.style.background = 'rgba(17, 17, 17, 0.7)';
    }
});
