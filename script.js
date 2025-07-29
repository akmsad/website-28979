// Sample data
let properties = [
    {
        id: 1,
        title: "Prime Land in Kathmandu",
        location: "Kathmandu, Nepal",
        type: "land",
        bedrooms: null,
        bathrooms: null,
        area: 10,
        price: 5000000,
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        ],
        description: "Premium land in prime location of Kathmandu, suitable for commercial or residential purposes.",
        userId: 1
    },
    {
        id: 2,
        title: "Luxury Hotel in Pokhara",
        location: "Pokhara, Nepal",
        type: "hotel",
        bedrooms: 20,
        bathrooms: 25,
        area: 50,
        price: 25000000,
        images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        ],
        description: "Beautiful luxury hotel with lake view in Pokhara. Fully furnished with modern amenities.",
        userId: 2
    },
    {
        id: 3,
        title: "Family House in Lalitpur",
        location: "Lalitpur, Nepal",
        type: "housing",
        bedrooms: 4,
        bathrooms: 3,
        area: 8,
        price: 12000000,
        images: [
            "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        ],
        description: "Spacious family house in quiet neighborhood with garden and parking space.",
        userId: 1
    }
];

let users = [
    {
        id: 1,
        firstName: "Ram",
        lastName: "Sharma",
        email: "ram@example.com",
        password: "password123",
        phone: "9841000001",
        bio: "Property developer based in Kathmandu",
        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
    },
    {
        id: 2,
        firstName: "Sita",
        lastName: "Gurung",
        email: "sita@example.com",
        password: "password123",
        phone: "9841000002",
        bio: "Hotel owner in Pokhara",
        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"
    }
];

let currentUser = null;
let sortAscending = true;
let propertyImages = [];
let dropzone;

// DOM Elements
const featuredPropertiesContainer = document.getElementById('featured-properties-container');
const allPropertiesContainer = document.getElementById('all-properties-container');
const userPropertiesContainer = document.getElementById('user-properties-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const sortPriceBtn = document.getElementById('sort-price');
const viewAllBtn = document.getElementById('view-all-properties');
const propertyForm = document.getElementById('property-form');
const modal = document.getElementById('property-modal');
const closeModal = document.querySelector('.close-modal');
const modalContent = document.getElementById('modal-content');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const toggleThemeBtn = document.getElementById('toggle-theme');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const authButtons = document.getElementById('auth-buttons');
const userMenu = document.getElementById('user-menu');
const userAvatar = document.getElementById('user-avatar');
const logoutBtn = document.getElementById('logout-btn');
const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
const profileForm = document.getElementById('profile-form');
const avatarUpload = document.getElementById('avatar-upload');
const profileAvatar = document.getElementById('profile-avatar');
const avatarImg = document.getElementById('avatar-img');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const mobileLoginBtn = document.getElementById('mobile-login-btn');
const mobileSignupBtn = document.getElementById('mobile-signup-btn');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const authMobile = document.getElementById('auth-mobile');
const userMobile = document.getElementById('user-mobile');

// Initialize the app
function init() {
    setupEventListeners();
    displayFeaturedProperties();
    displayAllProperties();
    setupDropzone();
    checkAuthState();
}

// Setup Dropzone for image uploads
function setupDropzone() {
    dropzone = new Dropzone("#property-image-upload", {
        url: "/fake-url",
        autoProcessQueue: false,
        addRemoveLinks: true,
        maxFiles: 10,
        acceptedFiles: "image/*",
        dictDefaultMessage: "",
        previewsContainer: "#image-preview",
        previewTemplate: `
            <div class="image-preview-item dz-preview dz-file-preview">
                <img data-dz-thumbnail />
                <button class="remove-image" data-dz-remove><i class="fas fa-times"></i></button>
            </div>
        `
    });

    dropzone.on("addedfile", function(file) {
        propertyImages.push(file);
        const removeButtons = document.querySelectorAll('.remove-image');
        removeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const previewElement = this.parentNode;
                const file = dropzone.files.find(f => f.previewElement === previewElement);
                if (file) {
                    dropzone.removeFile(file);
                    propertyImages = propertyImages.filter(f => f !== file);
                }
                previewElement.remove();
            });
        });
    });

    dropzone.on("removedfile", function(file) {
        propertyImages = propertyImages.filter(f => f !== file);
    });
}

// Display featured properties (max 3)
function displayFeaturedProperties() {
    featuredPropertiesContainer.innerHTML = '';
    
    const featuredProperties = properties.slice(0, 3);
    
    if (featuredProperties.length === 0) {
        featuredPropertiesContainer.innerHTML = '<p class="no-results">No featured properties available</p>';
        return;
    }
    
    featuredProperties.forEach(property => {
        featuredPropertiesContainer.appendChild(createPropertyCard(property));
    });
}

// Display all properties
function displayAllProperties() {
    allPropertiesContainer.innerHTML = '';
    
    if (properties.length === 0) {
        allPropertiesContainer.innerHTML = '<p class="no-results">No properties available</p>';
        return;
    }
    
    properties.forEach(property => {
        allPropertiesContainer.appendChild(createPropertyCard(property));
    });
}

// Create property card element
function createPropertyCard(property) {
    const propertyCard = document.createElement('div');
    propertyCard.className = 'property-card';
    
    propertyCard.innerHTML = `
        <div class="property-image">
            <img src="${property.images[0]}" alt="${property.title}">
        </div>
        <div class="property-info">
            <h4>${property.title}</h4>
            <p class="location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
            <div class="property-details">
                ${property.bedrooms ? `<span><i class="fas fa-bed"></i> ${property.bedrooms} beds</span>` : ''}
                ${property.bathrooms ? `<span><i class="fas fa-bath"></i> ${property.bathrooms} baths</span>` : ''}
                <span><i class="fas fa-ruler-combined"></i> ${property.area} aana</span>
            </div>
            <p class="property-price">$${property.price.toLocaleString()}</p>
            <button class="btn btn-primary view-details" data-id="${property.id}">View Details</button>
            ${currentUser && currentUser.id === property.userId ? 
                `<button class="delete-property" data-id="${property.id}"><i class="fas fa-trash"></i></button>` : ''}
        </div>
    `;
    
    // Add event listeners
    propertyCard.querySelector('.view-details').addEventListener('click', (e) => {
        const propertyId = parseInt(e.target.getAttribute('data-id'));
        showPropertyDetails(propertyId);
    });

    const deleteBtn = propertyCard.querySelector('.delete-property');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            const propertyId = parseInt(e.target.closest('.delete-property').getAttribute('data-id'));
            deleteProperty(propertyId);
            e.stopPropagation();
        });
    }

    return propertyCard;
}

// Show property details in modal
function showPropertyDetails(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    const imagesHTML = property.images.map(img => `
        <div class="property-detail-image">
            <img src="${img}" alt="${property.title}">
        </div>
    `).join('');

    modalContent.innerHTML = `
        <div class="property-detail">
            ${imagesHTML}
            <div class="property-detail-info">
                <h2>${property.title}</h2>
                <p class="property-detail-location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
                <div class="property-detail-meta">
                    <div><i class="fas fa-home"></i> ${property.type.charAt(0).toUpperCase() + property.type.slice(1)}</div>
                    ${property.bedrooms ? `<div><i class="fas fa-bed"></i> ${property.bedrooms} Bedrooms</div>` : ''}
                    ${property.bathrooms ? `<div><i class="fas fa-bath"></i> ${property.bathrooms} Bathrooms</div>` : ''}
                    <div><i class="fas fa-ruler-combined"></i> ${property.area} aana</div>
                </div>
                <p class="property-detail-price">$${property.price.toLocaleString()}</p>
                <p class="property-detail-description">${property.description || 'No description available.'}</p>
                ${currentUser && currentUser.id === property.userId ? 
                    `<button class="btn btn-secondary edit-property" data-id="${property.id}">Edit Property</button>` : ''}
            </div>
        </div>
    `;

    modal.style.display = 'block';

    const editBtn = document.querySelector('.edit-property');
    if (editBtn) {
        editBtn.addEventListener('click', (e) => {
            const propertyId = parseInt(e.target.getAttribute('data-id'));
            editProperty(propertyId);
            modal.style.display = 'none';
        });
    }
}

// Close modal
function closeModalHandler() {
    modal.style.display = 'none';
    loginModal.style.display = 'none';
    signupModal.style.display = 'none';
}

// Edit property
function editProperty(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    // Fill the form with property data
    document.getElementById('property-title').value = property.title;
    document.getElementById('property-location').value = property.location;
    document.getElementById('property-type-select').value = property.type;
    document.getElementById('property-bedrooms').value = property.bedrooms || '';
    document.getElementById('property-bathrooms').value = property.bathrooms || '';
    document.getElementById('property-area').value = property.area;
    document.getElementById('property-price').value = property.price;
    document.getElementById('property-description').value = property.description;

    // Clear existing images
    propertyImages = [];
    document.getElementById('image-preview').innerHTML = '';
    dropzone.removeAllFiles(true);

    // Switch to add property section
    switchSection('add-property-section');

    // Change form to update mode
    propertyForm.dataset.mode = 'edit';
    propertyForm.dataset.id = propertyId;
    document.querySelector('#add-property-section h2').textContent = 'Edit Property';
}

// Sort properties by price
function sortProperties() {
    const sortedProperties = [...properties];
    sortedProperties.sort((a, b) => sortAscending ? a.price - b.price : b.price - a.price);
    sortAscending = !sortAscending;
    sortPriceBtn.textContent = sortAscending ? 'Sort by Price (Low to High)' : 'Sort by Price (High to Low)';
    properties = sortedProperties;
    displayAllProperties();
}

// Add new property
function addProperty(event) {
    event.preventDefault();
    
    if (!currentUser) {
        alert('Please login to add a property');
        return;
    }
    
    const title = document.getElementById('property-title').value;
    const location = document.getElementById('property-location').value;
    const type = document.getElementById('property-type-select').value;
    const bedrooms = document.getElementById('property-bedrooms').value ? parseInt(document.getElementById('property-bedrooms').value) : null;
    const bathrooms = document.getElementById('property-bathrooms').value ? parseInt(document.getElementById('property-bathrooms').value) : null;
    const area = parseInt(document.getElementById('property-area').value);
    const price = parseInt(document.getElementById('property-price').value);
    const description = document.getElementById('property-description').value;
    
    // Get image URLs (in a real app, these would be uploaded to a server)
    const imageUrls = propertyImages.map(file => URL.createObjectURL(file));
    
    if (propertyForm.dataset.mode === 'edit') {
        // Update existing property
        const propertyId = parseInt(propertyForm.dataset.id);
        const propertyIndex = properties.findIndex(p => p.id === propertyId);
        
        if (propertyIndex !== -1) {
            properties[propertyIndex] = {
                ...properties[propertyIndex],
                title,
                location,
                type,
                bedrooms,
                bathrooms,
                area,
                price,
                description,
                images: imageUrls.length > 0 ? imageUrls : properties[propertyIndex].images
            };
        }
    } else {
        // Add new property
        const newProperty = {
            id: properties.length > 0 ? Math.max(...properties.map(p => p.id)) + 1 : 1,
            title,
            location,
            type,
            bedrooms,
            bathrooms,
            area,
            price,
            images: imageUrls,
            description,
            userId: currentUser.id
        };
        
        properties.push(newProperty);
    }
    
    // Reset form
    propertyForm.reset();
    document.getElementById('image-preview').innerHTML = '';
    dropzone.removeAllFiles(true);
    propertyImages = [];
    propertyForm.dataset.mode = '';
    propertyForm.dataset.id = '';
    document.querySelector('#add-property-section h2').textContent = 'Add New Property';
    
    displayFeaturedProperties();
    displayAllProperties();
    displayUserProperties();
    switchSection('home-section');
    
    alert(`Property ${propertyForm.dataset.mode === 'edit' ? 'updated' : 'added'} successfully!`);
}

// Delete property
function deleteProperty(propertyId) {
    if (confirm('Are you sure you want to delete this property?')) {
        properties = properties.filter(property => property.id !== propertyId);
        displayFeaturedProperties();
        displayAllProperties();
        displayUserProperties();
    }
}

// Switch between sections
function switchSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId.replace('-section', '')) {
            link.classList.add('active');
        }
    });

    // Close mobile menu if open
    mobileMenu.classList.remove('active');
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    toggleThemeBtn.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('darkMode', isDarkMode);
}

// Check authentication state
function checkAuthState() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
}

// Update UI based on authentication state
function updateAuthUI() {
    if (currentUser) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        authMobile.style.display = 'none';
        userMobile.style.display = 'flex';
        avatarImg.src = currentUser.avatar;
        
        // Update profile section
        document.getElementById('profile-firstname').value = currentUser.firstName;
        document.getElementById('profile-lastname').value = currentUser.lastName;
        document.getElementById('profile-phone').value = currentUser.phone || '';
        document.getElementById('profile-bio').value = currentUser.bio || '';
        document.getElementById('profile-name').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        document.getElementById('profile-email').textContent = currentUser.email;
        profileAvatar.src = currentUser.avatar;
        
        // Display user properties
        displayUserProperties();
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
        authMobile.style.display = 'flex';
        userMobile.style.display = 'none';
    }
}

// Display user properties in profile
function displayUserProperties() {
    if (!currentUser) return;
    
    const userProperties = properties.filter(property => property.userId === currentUser.id);
    userPropertiesContainer.innerHTML = '';
    
    if (userProperties.length === 0) {
        userPropertiesContainer.innerHTML = '<p>You have no properties listed yet.</p>';
        return;
    }
    
    userProperties.forEach(property => {
        userPropertiesContainer.appendChild(createPropertyCard(property));
    });
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        closeModalHandler();
        alert('Login successful!');
    } else {
        alert('Invalid email or password');
    }
}

// Handle signup
function handleSignup(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('signup-firstname').value;
    const lastName = document.getElementById('signup-lastname').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (users.some(u => u.email === email)) {
        alert('Email already in use');
        return;
    }
    
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        firstName,
        lastName,
        email,
        password,
        phone: '',
        bio: '',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'
    };
    
    users.push(newUser);
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    closeModalHandler();
    alert('Account created successfully!');
}

// Handle logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    switchSection('home-section');
    alert('Logged out successfully');
}

// Update profile
function updateProfile(event) {
    event.preventDefault();
    
    if (!currentUser) return;
    
    const firstName = document.getElementById('profile-firstname').value;
    const lastName = document.getElementById('profile-lastname').value;
    const phone = document.getElementById('profile-phone').value;
    const bio = document.getElementById('profile-bio').value;
    
    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    currentUser.phone = phone;
    currentUser.bio = bio;
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    alert('Profile updated successfully!');
}

// Handle avatar upload
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentUser.avatar = e.target.result;
            profileAvatar.src = e.target.result;
            avatarImg.src = e.target.result;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        };
        reader.readAsDataURL(file);
    }
}

// Search functionality with live results
function handleSearchInput() {
    const searchValue = searchInput.value.toLowerCase();
    searchResults.innerHTML = '';
    
    if (searchValue.length < 2) {
        searchResults.classList.remove('active');
        return;
    }
    
    const filteredProperties = properties.filter(property => 
        property.title.toLowerCase().includes(searchValue) || 
        property.location.toLowerCase().includes(searchValue) ||
        property.type.toLowerCase().includes(searchValue)
    );
    
    if (filteredProperties.length > 0) {
        filteredProperties.forEach(property => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.textContent = `${property.title} - ${property.location}`;
            resultItem.addEventListener('click', () => {
                searchInput.value = '';
                searchResults.classList.remove('active');
                showPropertyDetails(property.id);
            });
            searchResults.appendChild(resultItem);
        });
        searchResults.classList.add('active');
    } else {
        const noResults = document.createElement('div');
        noResults.className = 'search-result-item';
        noResults.textContent = 'No results found';
        searchResults.appendChild(noResults);
        searchResults.classList.add('active');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search events
    searchInput.addEventListener('input', handleSearchInput);
    searchBtn.addEventListener('click', () => {
        handleSearchInput();
        switchSection('properties-section');
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
    
    // Sort event
    sortPriceBtn.addEventListener('click', sortProperties);
    
    // View all properties
    viewAllBtn.addEventListener('click', () => switchSection('properties-section'));
    
    // Form submission
    propertyForm.addEventListener('submit', addProperty);
    
    // Modal events
    closeModal.addEventListener('click', closeModalHandler);
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModalHandler();
        }
    });
    
    // Navigation events
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            switchSection(`${section}-section`);
        });
    });
    
    // Theme toggle
    toggleThemeBtn.addEventListener('click', toggleDarkMode);
    
    // Auth modals
    loginBtn.addEventListener('click', () => loginModal.style.display = 'block');
    signupBtn.addEventListener('click', () => signupModal.style.display = 'block');
    mobileLoginBtn.addEventListener('click', () => loginModal.style.display = 'block');
    mobileSignupBtn.addEventListener('click', () => signupModal.style.display = 'block');
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'block';
    });
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.style.display = 'none';
        loginModal.style.display = 'block';
    });
    
    // Auth forms
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
    mobileLogoutBtn.addEventListener('click', handleLogout);
    
    // Profile
    profileForm.addEventListener('submit', updateProfile);
    avatarUpload.addEventListener('change', handleAvatarUpload);
    
    // Mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
    
    // Desktop profile menu
    userAvatar.addEventListener('click', (e) => {
        if (window.innerWidth > 768) {
            userMenu.classList.toggle('active');
            e.stopPropagation();
        }
    });
    
    // Close dropdown when clicking outside (desktop)
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu') && window.innerWidth > 768) {
            userMenu.classList.remove('active');
        }
    });
    
    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        toggleThemeBtn.textContent = 'Light Mode';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);