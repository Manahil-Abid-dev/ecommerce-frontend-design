document.addEventListener('DOMContentLoaded', () => {
    // 1. Load Sidebar Component
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (sidebarPlaceholder) {
        fetch('sidebar.html')
            .then(response => response.text())
            .then(data => {
                sidebarPlaceholder.innerHTML = data;
                setupSidebarEvents(); // Bind close buttons after loading
            })
            .catch(err => console.error("Error loading sidebar:", err));
    }

    // 2. Initialize Core Functionalities
    initDropdowns();
    initQuantitySelectors();
    initSearch();
    initTabSystem();
});

// Sidebar Toggle Logic
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    // Create overlay if it doesn't exist
    if (!overlay) {
        const newOverlay = document.createElement('div');
        newOverlay.className = 'sidebar-overlay';
        document.body.appendChild(newOverlay);
        newOverlay.addEventListener('click', toggleSidebar);
    }

    const activeOverlay = document.querySelector('.sidebar-overlay');
    sidebar.classList.toggle('active');
    activeOverlay.classList.toggle('visible');
}

function setupSidebarEvents() {
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.onclick = toggleSidebar;
    }
}

// Dropdown Toggle (for click-based interaction)
function initDropdowns() {
    const dropBtns = document.querySelectorAll('.dropbtn');
    dropBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const content = btn.nextElementSibling;
            if (content && content.classList.contains('dropdown-content')) {
                content.style.display = content.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
}

// Cart Quantity Counter
function initQuantitySelectors() {
    const qtyBtns = document.querySelectorAll('.qty-select');
    qtyBtns.forEach(btn => {
        btn.onclick = () => {
            const newQty = prompt("Enter Quantity:", "1");
            if (newQty && !isNaN(newQty)) {
                btn.innerHTML = `Qty: ${newQty} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
            }
        };
    });
}

// Search Functionality
function initSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    if (searchBtn) {
        searchBtn.onclick = () => {
            const val = searchInput.value;
            alert(val ? `Searching for: ${val}` : "Please enter a search term");
        };
    }
}

// Tab Switching (Product Detail Page)
function initTabSystem() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        };
    });
}