document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let cart = [];
    
    // --- Elements ---
    const cartNavBtn = document.getElementById('cart-nav-btn');
    const loginNavBtn = document.getElementById('login-nav-btn');
    
    const cartModal = document.getElementById('cart-modal');
    const loginModal = document.getElementById('login-modal');
    
    const closeCartBtn = document.getElementById('close-cart');
    const closeLoginBtn = document.getElementById('close-login');
    
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCountSpan = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    
    const loginForm = document.getElementById('login-form');

    // Create Toast Element
    const toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // --- Modal Logic ---
    function openModal(modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    function closeModal(modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    cartNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(cartModal);
    });
    
    loginNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(loginModal);
    });

    closeCartBtn.addEventListener('click', () => closeModal(cartModal));
    closeLoginBtn.addEventListener('click', () => closeModal(loginModal));

    // Close on overlay click
    [cartModal, loginModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // --- Cart Logic ---
    function updateCartUI() {
        // Update count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
        
        // Update items list
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            cartTotalPrice.textContent = '$0.00';
            return;
        }

        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn minus" data-id="${item.id}">-</button>
                    <span class="qty">${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-item" title="Remove" data-id="${item.id}">&times;</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
        
        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
        
        // Bind quantity buttons inside cart display
        bindCartButtons();
    }

    function bindCartButtons() {
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                changeQuantity(id, 1);
            });
        });
        
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                changeQuantity(id, -1);
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                removeFromCart(id);
            });
        });
    }

    function changeQuantity(id, delta) {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                removeFromCart(id);
            } else {
                updateCartUI();
            }
        }
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
        showToast('Item removed from cart');
    }

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.dataset.id;
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);
            
            // Check if exists
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }
            
            updateCartUI();
            
            // Button animation feedback
            const originalText = btn.textContent;
            btn.textContent = 'Added! ✓';
            btn.style.background = 'var(--primary)';
            btn.style.color = 'white';
            
            showToast(`${name} added to cart`);
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
            }, 1000);
        });
    });

    const checkoutBtn = document.getElementById('checkout-btn');
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
             if (cart.length === 0) {
                 showToast('Your cart is empty!');
                 return;
             }
             showToast('Order placed successfully! Thank you.');
             cart = [];
             updateCartUI();
             closeModal(cartModal);
        });
    }

    // --- Login form mock ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const name = email.split('@')[0];
        
        closeModal(loginModal);
        showToast(`Welcome back, ${name}!`);
        loginNavBtn.textContent = name;
        loginNavBtn.classList.remove('btn-primary');
        loginNavBtn.style.color = 'var(--primary)';
        loginNavBtn.style.fontWeight = 'bold';
    });

    // Initialize UI
    updateCartUI();
});
