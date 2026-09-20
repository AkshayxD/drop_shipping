// Placeholder Curated Products using Unsplash luxury images
const products = [
    {
        id: 1,
        name: "The Obsidian Chronograph",
        category: "Timepieces",
        price: "₹12,499",
        description: "A masterclass in precision engineering. Features a brushed steel case, sapphire crystal, and an automatic movement designed for the modern gentleman.",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" // Luxury Watch
    },
    {
        id: 2,
        name: "Verona Emerald Tote",
        category: "Leather Goods",
        price: "₹8,999",
        description: "Crafted from full-grain Italian leather. The Verona Tote offers unparalleled elegance with gold-plated hardware and a spacious suede interior.",
        image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" // Premium Bag
    },
    {
        id: 3,
        name: "Aura Gold Aviators",
        category: "Eyewear",
        price: "₹4,299",
        description: "Polarized lenses set in a lightweight 18k gold-plated frame. Designed to provide 100% UV protection while making a bold statement.",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" // Sunglasses
    },
    {
        id: 4,
        name: "Midnight Silk Robe",
        category: "Loungewear",
        price: "₹5,499",
        description: "Experience true comfort. Made from 100% pure mulberry silk, this robe drapes beautifully and feels cool against the skin.",
        image: "https://images.unsplash.com/photo-1610410784260-1e582ae44bf2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" // Silk Fabric / Robe aesthetic
    }
];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const modal = document.getElementById('checkout-modal');
const closeBtn = document.querySelector('.close-btn');
const orderForm = document.getElementById('order-form');

// Modal Elements
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDesc = document.getElementById('modal-desc');

let currentProduct = null;

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

// Modal Logic
function openModal(product) {
    currentProduct = product;
    modalImg.src = product.image;
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

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentProduct = null;
}

closeBtn.addEventListener('click', closeModal);

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
