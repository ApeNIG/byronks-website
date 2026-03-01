// BY RONKS - Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initMobileMenu();
    initCart();
    initNewsletterForm();
    initSmoothScroll();
    initBookingButton();
    initQuickAdd();
});

// Mobile Menu
function initMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeMenuBtn && mobileMenu) {
        closeMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close menu when clicking nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Cart functionality
function initCart() {
    const cartBtn = document.querySelector('.cart-btn');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = JSON.parse(localStorage.getItem('byronks-cart')) || [];

    // Update cart count display
    function updateCartCount() {
        if (cartCount) {
            cartCount.textContent = cartItems.length;
            if (cartItems.length > 0) {
                cartCount.classList.add('show');
            } else {
                cartCount.classList.remove('show');
            }
        }
    }

    // Add to cart function
    window.addToCart = function(product) {
        cartItems.push(product);
        localStorage.setItem('byronks-cart', JSON.stringify(cartItems));
        updateCartCount();
        showNotification(`${product.name} added to bag`);
    };

    // Initial cart count
    updateCartCount();

    // Cart button click
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            if (cartItems.length === 0) {
                showNotification('Your bag is empty');
            } else {
                showNotification(`${cartItems.length} item(s) in your bag`);
            }
        });
    }
}

// Quick Add buttons on products
function initQuickAdd() {
    const quickAddBtns = document.querySelectorAll('.quick-add');

    quickAddBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = btn.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;

            window.addToCart({
                name: productName,
                price: productPrice,
                id: Date.now()
            });

            // Button animation
            btn.classList.add('added');
            setTimeout(() => btn.classList.remove('added'), 1000);
        });
    });
}

// Newsletter Form
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;

            if (validateEmail(email)) {
                // Store email (in real app, send to backend)
                const subscribers = JSON.parse(localStorage.getItem('byronks-subscribers')) || [];
                subscribers.push({ email, date: new Date().toISOString() });
                localStorage.setItem('byronks-subscribers', JSON.stringify(subscribers));

                showNotification('Welcome to the BY RONKS family!');
                form.reset();
            } else {
                showNotification('Please enter a valid email');
            }
        });
    }
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Booking Button
function initBookingButton() {
    const bookingBtn = document.getElementById('bookingBtn');

    if (bookingBtn) {
        bookingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Booking system coming soon! DM us on Instagram @byronks');
        });
    }
}

// Utility: Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Utility: Show notification
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Header scroll effect (always visible, just adds shadow on scroll)
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
