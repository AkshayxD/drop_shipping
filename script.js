// Placeholder Curated Products using Unsplash luxury images
const products = [
    {
        id: 1,
        name: "Handcrafted Kerala Boat Metal Showpiece",
        category: "Showpieces",
        price: "₹1,499",
        description: "An exquisite metal showpiece inspired by the traditional Kerala snake boats. Handcrafted by artisans, it adds a touch of royal heritage to any living space.",
        image: "https://images.meesho.com/images/products/537185017/1_512.webp"
    },
    {
        id: 2,
        name: "Rajasthani Musician Showpiece (Set of 2)",
        category: "Showpieces",
        price: "₹1,299",
        description: "A beautiful set of two iron handpainted musicians that celebrate Indian classical art. Perfect for elevating your home decor with cultural elegance.",
        image: "https://images.meesho.com/images/products/254543953/1_512.webp"
    },
    {
        id: 3,
        name: "Black Gold Buddha Statue",
        category: "Showpieces",
        price: "₹899",
        description: "Bring tranquility and minimalist luxury to your home with this Black Gold Buddha statue. Designed to inspire peace and mindfulness.",
        image: "https://images.meesho.com/images/products/87402599/1_512.webp"
    },
    {
        id: 4,
        name: "Seven Chakra Crystal Energy Tree",
        category: "Showpieces",
        price: "₹799",
        description: "A stunning decorative crystal tree designed to channel positive energy and balance. Hand-wired with natural healing stones on a sturdy base.",
        image: "https://images.meesho.com/images/products/239027670/1_512.webp"
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
