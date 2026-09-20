// Curated Products for Lumina Store
const products = [
    {
        id: 1,
        name: "Zen Monk Figurine Set (4 Pieces)",
        category: "Figurines",
        price: "₹193",
        description: "A charming set of 4 handcrafted resin monk figurines, each in a unique meditative pose. Perfect for tabletop decoration, these miniature monks bring serenity and a touch of Zen philosophy to your living space. Made from premium quality resin with fine detailing.",
        image: "https://images.meesho.com/images/products/400197189/7yhqs_512.webp",
        images: [
            "https://images.meesho.com/images/products/400197189/7yhqs_512.webp",
            "images/monk_lifestyle.jpg"
        ]
    },
    {
        id: 2,
        name: "Kerala Boat Metal Showpiece with Pen Stand",
        category: "Showpieces",
        price: "₹560",
        description: "Sail into culture with this handcrafted Kerala boat showpiece – complete with traditional paddlers and a built-in metal pen stand. A unique piece of ethnic desk decor, this golden-tone boat blends traditional artistry with daily utility. Dimensions: 10x8 inch.",
        image: "https://images.meesho.com/images/products/537185017/0wami_512.webp",
        images: [
            "https://images.meesho.com/images/products/537185017/0wami_512.webp",
            "images/boat_lifestyle.jpg"
        ]
    },
    {
        id: 3,
        name: "Golden Human Face Sculpture – Resting on Hands",
        category: "Sculptures",
        price: "₹488",
        description: "Transform your living space with this stunning golden resin human face statue, depicted peacefully sleeping on hands. A symbol of relaxation and inner peace, this handcrafted polyresin showpiece makes a meaningful gift for housewarmings, weddings, and special occasions. Size: 14×8×21 cm.",
        image: "https://images.meesho.com/images/products/533401170/wru59_512.webp",
        images: [
            "https://images.meesho.com/images/products/533401170/wru59_512.webp",
            "images/face_lifestyle.jpg"
        ]
    }
];

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
function openModal(product) {
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

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentProduct = null;
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
