const STORAGE_KEYS = {
    CART_COUNT: 'ecomCartCount',
    FAVORITES: 'ecomFavorites'
};

document.addEventListener('DOMContentLoaded', () => {
    initDropdowns();
    initQuantitySelectors();
    initSearch();
    initTabSystem();
    initNavigationLinks();
    initCartState();
    initCartPageActions();
    initProductClicks();
    initCategoryLinks();
    initFavorites();
    initFilterChips();
    initFilterGroupToggles();
    initPriceRangeSlider();
    initCloseDropdownsOnOutsideClick();
    initCountdownTimer();
});

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('visible');
    }
}

function initDropdowns() {
    document.querySelectorAll('.dropbtn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const content = btn.nextElementSibling;
            if (content && content.classList.contains('dropdown-content')) {
                const isOpen = content.style.display === 'block';
                closeAllDropdowns();
                content.style.display = isOpen ? 'none' : 'block';
            }
        });
    });
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-content').forEach(content => {
        content.style.display = 'none';
    });
}

function initCloseDropdownsOnOutsideClick() {
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
            closeAllDropdowns();
        }
    });
}

function initQuantitySelectors() {
    document.querySelectorAll('.qty-select').forEach(btn => {
        btn.addEventListener('click', () => {
            const newQty = prompt('Enter Quantity:', '1');
            if (newQty && !isNaN(newQty) && Number(newQty) > 0) {
                btn.innerHTML = `Qty: ${newQty} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
            }
        });
    });
}

function initSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (!query) {
                alert('Please enter a search term');
                return;
            }
            alert(`Searching for: ${query}`);
        });
        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
}

function initTabSystem() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

function initNavigationLinks() {
    document.querySelectorAll('.sidebar-menu-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetUrl = resolveRouteFromText(link.textContent);
            if (targetUrl) {
                location.href = targetUrl;
            }
        });
    });

    document.querySelectorAll('.nav-icons .icon-link').forEach(link => {
        const text = link.textContent.toLowerCase();
        if (text.includes('my cart') || text.includes('orders')) {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                location.href = 'cart.html';
            });
        }
        if (text.includes('favorites')) {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                location.href = 'product-listing2.html';
            });
        }
    });

    document.querySelectorAll('.nav-menu-link').forEach(link => {
        link.addEventListener('click', (event) => {
            const targetUrl = resolveRouteFromText(link.textContent);
            if (targetUrl) {
                event.preventDefault();
                location.href = targetUrl;
            }
        });
    });
}

function resolveRouteFromText(text) {
    const label = text.trim().toLowerCase();
    if (label.includes('home')) return 'index.html';
    if (label.includes('categories') || label.includes('category') || label.includes('all category')) return 'product-listing2.html';
    if (label.includes('cart') || label.includes('orders')) return 'cart.html';
    if (label.includes('hot offers')) return 'product-listing2.html';
    if (label.includes('gift boxes') || label.includes('shop')) return 'shop.html';
    if (label.includes('help')) return 'index.html';
    return '';
}

function initCartState() {
    const storedCount = Number(localStorage.getItem(STORAGE_KEYS.CART_COUNT) || '0');
    const defaultCount = document.querySelectorAll('.cart-item').length || 0;
    setCartCount(storedCount || defaultCount);
}

function setCartCount(count) {
    const safeCount = Math.max(0, Number(count) || 0);
    localStorage.setItem(STORAGE_KEYS.CART_COUNT, String(safeCount));
    updateCartBadge(safeCount);
    updateCartHeader(safeCount);
}

function incrementCartCount(value = 1) {
    const currentCount = Number(localStorage.getItem(STORAGE_KEYS.CART_COUNT) || '0');
    setCartCount(currentCount + value);
}

function decrementCartCount(value = 1) {
    const currentCount = Number(localStorage.getItem(STORAGE_KEYS.CART_COUNT) || '0');
    setCartCount(currentCount - value);
}

function updateCartBadge(count) {
    const cartLink = Array.from(document.querySelectorAll('.nav-icons .icon-link')).find(link => /my cart/i.test(link.textContent));
    if (!cartLink) return;
    let badge = cartLink.querySelector('.cart-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'cart-badge';
        cartLink.appendChild(badge);
    }
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
}

function updateCartHeader(count) {
    const cartHeader = document.querySelector('.cart-header');
    if (cartHeader) {
        cartHeader.textContent = `My cart (${count})`;
    }
}

function initCartPageActions() {
    document.querySelectorAll('.cart-item').forEach(item => attachCartItemEvents(item));

    document.querySelectorAll('.btn-move-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const savedCard = btn.closest('.saved-card');
            moveSavedToCart(savedCard);
        });
    });

    const removeAll = document.querySelector('.link-remove-all');
    if (removeAll) {
        removeAll.addEventListener('click', (event) => {
            event.preventDefault();
            document.querySelectorAll('.cart-item').forEach(item => item.remove());
            setCartCount(0);
        });
    }
}

function attachCartItemEvents(item) {
    if (!item) return;

    const addBtn = item.querySelector('.btn-add');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            incrementCartCount(1);
        });
    }

    const removeBtn = item.querySelector('.btn-remove');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            item.remove();
            decrementCartCount(1);
        });
    }

    const saveBtn = item.querySelector('.btn-save');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            moveCartItemToSaved(item);
        });
    }
}

function moveCartItemToSaved(item) {
    if (!item) return;
    const savedGrid = document.querySelector('.saved-grid');
    if (!savedGrid) return;

    const title = item.querySelector('.item-title')?.textContent.trim() || 'Saved item';
    const price = item.querySelector('.item-price')?.textContent.trim() || '$0.00';
    const imageSrc = item.querySelector('img')?.src || '';
    const imageAlt = item.querySelector('img')?.alt || title;

    const savedCard = document.createElement('div');
    savedCard.className = 'saved-card';
    savedCard.innerHTML = `
        <div class="saved-card-img"><img src="${imageSrc}" alt="${imageAlt}"></div>
        <p class="saved-price">${price}</p>
        <p class="saved-name">${title}</p>
        <button type="button" class="btn-move-cart">Move to cart</button>
    `;
    savedGrid.appendChild(savedCard);

    savedCard.querySelector('.btn-move-cart')?.addEventListener('click', () => {
        moveSavedToCart(savedCard);
    });

    item.remove();
    decrementCartCount(1);
    showToast('Item saved for later');
}

function showToast(message) {
    let toast = document.querySelector('.toast-message');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-message';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast.hideTimeout);
    toast.hideTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2400);
}

function moveSavedToCart(savedCard) {
    if (!savedCard) return;
    const cartItemsCard = document.querySelector('.cart-items-card');
    if (!cartItemsCard) return;

    const title = savedCard.querySelector('.saved-name')?.textContent.trim() || 'Product';
    const price = savedCard.querySelector('.saved-price')?.textContent.trim() || '$0.00';
    const imageSrc = savedCard.querySelector('img')?.src || '';
    const imageAlt = savedCard.querySelector('img')?.alt || title;

    const cartItem = document.createElement('article');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
        <div class="item-thumb">
            <img src="${imageSrc}" alt="${imageAlt}">
        </div>
        <div class="item-info">
            <h3 class="item-title">${title}</h3>
            <p class="item-meta">Saved for later item</p>
            <div class="item-actions">
                <button type="button" class="btn-pill btn-add">Add</button>
                <button type="button" class="btn-pill btn-remove">Remove</button>
                <button type="button" class="btn-pill btn-save">Save for later</button>
            </div>
        </div>
        <div class="item-price-col">
            <span class="item-price">${price}</span>
            <button type="button" class="qty-select">
                Qty: 1
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
        </div>
    `;

    const footer = cartItemsCard.querySelector('.cart-card-footer');
    cartItemsCard.insertBefore(cartItem, footer || null);
    attachCartItemEvents(cartItem);

    savedCard.remove();
    incrementCartCount(1);
}

function initProductClicks() {
    document.querySelectorAll('.view-details').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            location.href = 'products-detail.html';
        });
    });

    document.querySelectorAll('.product-card, .grid-product-card').forEach(card => {
        card.addEventListener('click', (event) => {
            if (event.target.closest('button') || event.target.closest('a') || event.target.closest('.btn-wishlist') || event.target.closest('.fav-btn')) {
                return;
            }
            location.href = 'products-detail.html';
        });
    });

    document.querySelectorAll('.product-image img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            location.href = 'products-detail.html';
        });
    });
}

function initCategoryLinks() {
    const categoryLinks = document.querySelectorAll('.category-list a');
    const toolbarTitle = document.querySelector('.toolbar-title strong');

    categoryLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            categoryLinks.forEach(item => item.classList.remove('is-active'));
            link.classList.add('is-active');
            if (toolbarTitle) {
                toolbarTitle.textContent = link.textContent.trim();
            }
            showToast(`${link.textContent.trim()} category selected`);
        });
    });
}

function initFavorites() {
    document.querySelectorAll('.btn-wishlist, .fav-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const isActive = button.classList.toggle('active');
            saveFavoriteStatus(getProductTitle(button), isActive);
        });

        const name = getProductTitle(button);
        if (isProductFavorite(name)) {
            button.classList.add('active');
        }
    });
}

function getProductTitle(element) {
    const card = element.closest('.product-card, .grid-product-card, .cart-item, .saved-card');
    if (!card) return '';
    return (
        card.querySelector('.product-name')?.textContent.trim() ||
        card.querySelector('.info h4')?.textContent.trim() ||
        card.querySelector('.item-title')?.textContent.trim() ||
        card.querySelector('.saved-name')?.textContent.trim() ||
        card.querySelector('.card-info h4')?.textContent.trim() ||
        ''
    );
}

function saveFavoriteStatus(name, isFavorite) {
    if (!name) return;
    const favorites = getStorageArray(STORAGE_KEYS.FAVORITES);
    const index = favorites.indexOf(name);
    if (isFavorite && index === -1) {
        favorites.push(name);
    } else if (!isFavorite && index !== -1) {
        favorites.splice(index, 1);
    }
    setStorageArray(STORAGE_KEYS.FAVORITES, favorites);
}

function isProductFavorite(name) {
    if (!name) return false;
    return getStorageArray(STORAGE_KEYS.FAVORITES).includes(name);
}

function getStorageArray(key) {
    try {
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (error) {
        return [];
    }
}

function setStorageArray(key, array) {
    localStorage.setItem(key, JSON.stringify(array));
}

function initFilterChips() {
    document.querySelectorAll('.filter-chips .chip button').forEach(btn => {
        btn.addEventListener('click', () => {
            const chip = btn.closest('.chip');
            chip?.remove();
            updateFilterChipsState();
        });
    });

    const clearAll = document.querySelector('.link-clear-all');
    if (clearAll) {
        clearAll.addEventListener('click', (event) => {
            event.preventDefault();
            document.querySelectorAll('.filter-chips .chip').forEach(chip => chip.remove());
            updateFilterChipsState();
        });
    }
}

function initFilterGroupToggles() {
    document.querySelectorAll('.filter-group .filter-group-header').forEach(header => {
        header.addEventListener('click', () => {
            const group = header.closest('.filter-group');
            if (group) {
                group.classList.toggle('is-collapsed');
            }
        });
    });
}

function initPriceRangeSlider() {
    const slider = document.querySelector('.range-slider');
    if (!slider) return;

    const minMaxRow = document.querySelector('.min-max-row');
    let minInput = null;
    let maxInput = null;
    if (minMaxRow) {
        const inputs = minMaxRow.querySelectorAll('input');
        minInput = inputs[0];
        maxInput = inputs[1];
    }

    const activeTrack = slider.querySelector('.range-track-active');
    const handles = slider.querySelectorAll('.range-handle');
    if (handles.length < 2) return;

    const minHandle = handles[0];
    const maxHandle = handles[1];

    const minValue = 0;
    const maxValue = 999999;
    
    // MATCHES YOUR INITIAL IMAGE VIEW EXACTLY (0% and 100%)
    let currentLeftPercent = 0;
    let currentRightPercent = 100;
    let activeMovingElement = null;

    // Direct inline styles to force correct z-index placement over the tracks
    minHandle.style.zIndex = "99";
    maxHandle.style.zIndex = "99";

    function updateSliderUI() {
        // Calculate corresponding raw numbers
        const leftValue = Math.round(minValue + (maxValue - minValue) * (currentLeftPercent / 100));
        const rightValue = Math.round(minValue + (maxValue - minValue) * (currentRightPercent / 100));

        // Update your input placeholders or direct text values without adding commas
        if (minInput) minInput.value = leftValue;
        if (maxInput) maxInput.value = rightValue;

        // Position the circle handles on the track line
        minHandle.style.left = `${currentLeftPercent}%`;
        maxHandle.style.left = `${currentRightPercent}%`;

        // Draw the inner blue bar highlight strip
        if (activeTrack) {
            activeTrack.style.left = `${currentLeftPercent}%`;
            activeTrack.style.right = `${100 - currentRightPercent}%`;
        }
    }

    function processMove(event) {
        if (!activeMovingElement) return;
        
        event.stopPropagation();
        
        const rect = slider.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const offsetX = clientX - rect.left;
        let percentageMoved = (offsetX / rect.width) * 100;
        
        if (percentageMoved < 0) percentageMoved = 0;
        if (percentageMoved > 100) percentageMoved = 100;

        if (activeMovingElement === minHandle) {
            // Keep a clean minimum boundary distance between the knobs
            if (percentageMoved < currentRightPercent - 5) {
                currentLeftPercent = percentageMoved;
            }
        } else if (activeMovingElement === maxHandle) {
            if (percentageMoved > currentLeftPercent + 5) {
                currentRightPercent = percentageMoved;
            }
        }
        
        updateSliderUI();
    }

    function processRelease() {
        activeMovingElement = null;
        window.removeEventListener('mousemove', processMove, true);
        window.removeEventListener('mouseup', processRelease, true);
        window.removeEventListener('touchmove', processMove, true);
        window.removeEventListener('touchend', processRelease, true);
    }

    function processPress(event, targetedHandle) {
        event.stopPropagation();
        activeMovingElement = targetedHandle;
        
        // Use capturing phase (true) to intercept inputs before other container scripts can freeze it
        window.addEventListener('mousemove', processMove, true);
        window.addEventListener('mouseup', processRelease, true);
        window.addEventListener('touchmove', processMove, { passive: false, capture: true });
        window.addEventListener('touchend', processRelease, true);
    }

    // Attach listeners directly via standard element nodes
    minHandle.onmousedown = (e) => processPress(e, minHandle);
    minHandle.ontouchstart = (e) => processPress(e, minHandle);
    
    maxHandle.onmousedown = (e) => processPress(e, maxHandle);
    maxHandle.ontouchstart = (e) => processPress(e, maxHandle);

    // Run layout sync loop right away on load
    updateSliderUI();
}
function initCountdownTimer() {
    // Set target date to 4 days from right now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 4); 

    function updateTimer() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        // If the countdown is finished
        if (difference < 0) {
            clearInterval(timerInterval);
            const container = document.querySelector('.timer-container');
            if (container) {
                container.innerHTML = "<div class='timer-block'><span class='time-label'>Offer Expired!</span></div>";
            }
            return;
        }

        // Time calculations for days, hours, minutes, and seconds
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Target all the timer-blocks
        const blocks = document.querySelectorAll('.timer-container .timer-block');
        
        if (blocks.length >= 4) {
            // Update Days (Index 0)
            blocks[0].querySelector('.time-num').textContent = String(days).padStart(2, '0');
            // Update Hours (Index 1)
            blocks[1].querySelector('.time-num').textContent = String(hours).padStart(2, '0');
            // Update Minutes (Index 2)
            blocks[2].querySelector('.time-num').textContent = String(minutes).padStart(2, '0');
            // Update Seconds (Index 3)
            blocks[3].querySelector('.time-num').textContent = String(seconds).padStart(2, '0');
        }
    }

    // Run immediately on page load, then refresh every 1 second
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
}