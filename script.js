// Store data
const storeDetails = {
    whatsappNumber: "918848833763", // Dummy number, replace with actual
    storeEmail: "akshayeldhose123@gmail.com", // Dummy email, replace with actual
    storeName: "Lumina"
};

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
const whatsappBtn = document.getElementById('whatsapp-btn');
const emailBtn = document.getElementById('email-btn');

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

// WhatsApp Checkout Logic
whatsappBtn.addEventListener('click', () => {
    const { name, address } = getCustomerDetails();
    if (!name || !address) return;

    const message = `Hello ${storeDetails.storeName} Team,%0A%0A` +
        `I would like to place an order:%0A` +
        `*Product:* ${currentProduct.name}%0A` +
        `*Price:* ${currentProduct.price}%0A%0A` +
        `*Delivery Details:*%0A` +
        `Name: ${name}%0A` +
        `Address: ${address}%0A%0A` +
        `Please confirm my order and let me know the next steps.`;

    const whatsappUrl = `https://wa.me/${storeDetails.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
});

// Email Checkout Logic
emailBtn.addEventListener('click', () => {
    const { name, address } = getCustomerDetails();
    if (!name || !address) return;

    const subject = encodeURIComponent(`New Order: ${currentProduct.name}`);
    const body = encodeURIComponent(
        `Hello ${storeDetails.storeName} Team,\n\n` +
        `I would like to place an order:\n` +
        `Product: ${currentProduct.name}\n` +
        `Price: ${currentProduct.price}\n\n` +
        `Delivery Details:\n` +
        `Name: ${name}\n` +
        `Address: ${address}\n\n` +
        `Please confirm my order and let me know the next steps.`
    );

    window.location.href = `mailto:${storeDetails.storeEmail}?subject=${subject}&body=${body}`;
});

function getCustomerDetails() {
    const name = document.getElementById('customer-name').value.trim();
    const address = document.getElementById('customer-address').value.trim();

    if (!name || !address) {
        alert("Please enter your name and delivery address to continue.");
        return { name: null, address: null };
    }
    return { name, address };
}

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
