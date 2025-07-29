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
        userId: 1,
        approved: true,
        createdAt: new Date('2023-01-15'),
        facing: "East",
        roadAccess: "Paved",
        electricity: true,
        waterSupply: "24/7"
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
        userId: 2,
        approved: true,
        createdAt: new Date('2023-02-20'),
        facing: "West",
        roadAccess: "Blacktop",
        electricity: true,
        waterSupply: "24/7"
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
        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
        verified: true
    },
    {
        id: 2,
        firstName: "Sita",
        lastName: "Gurung",
        email: "sita@example.com",
        password: "password123",
        phone: "9841000002",
        bio: "Hotel owner in Pokhara",
        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
        verified: false
    },
    {
        id: 3,
        firstName: "Admin",
        lastName: "User",
        email: "suss53661@gmail.com",
        password: "admin123",
        phone: "9800000000",
        bio: "System Administrator",
        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
        verified: true,
        isAdmin: true
    }
];

// App State
let currentUser = null;
let sortAscending = true;
let propertyImages = [];
let dropzone;
const ADMIN_EMAIL = "suss53661@gmail.com";

// DOM Elements
const featuredPropertiesContainer = document.getElementById('featured-properties-container');
const allPropertiesContainer = document.getElementById('all-properties-container');
const userPropertiesContainer = document.getElementById('user-properties-container');
const pendingApprovalsContainer = document.getElementById('pending-approvals-container');
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
    
    // Add admin section if admin is logged in
    if (currentUser?.email === ADMIN_EMAIL) {
        addAdminSection();
        displayPendingApprovals();
    }
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

// Property Display Functions
function displayFeaturedProperties() {
    featuredPropertiesContainer.innerHTML = '';
    
    const approvedProperties = properties.filter(p => p.approved);
    const featuredProperties = approvedProperties.slice(0, 3);
    
    if (featuredProperties.length === 0) {
        featuredPropertiesContainer.innerHTML = '<p class="no-results">No featured properties available</p>';
        return;
    }
    
    featuredProperties.forEach(property => {
        featuredPropertiesContainer.appendChild(createPropertyCard(property));
    });
}

function displayAllProperties() {
    allPropertiesContainer.innerHTML = '';
    
    const approvedProperties = properties.filter(p => p.approved);
    
    if (approvedProperties.length === 0) {
        allPropertiesContainer.innerHTML = '<p class="no-results">No properties available</p>';
        return;
    }
    
    approvedProperties.forEach(property => {
        allPropertiesContainer.appendChild(createPropertyCard(property));
    });
}

function displayPendingApprovals() {
    if (!pendingApprovalsContainer) return;
    
    const pendingProperties = properties.filter(p => !p.approved);
    pendingApprovalsContainer.innerHTML = '';
    
    if (pendingProperties.length === 0) {
        pendingApprovalsContainer.innerHTML = '<p class="no-results">No properties pending approval</p>';
        return;
    }
    
    pendingProperties.forEach(property => {
        const card = createPropertyCard(property, true);
        pendingApprovalsContainer.appendChild(card);
        
        // Add approve button event
        const approveBtn = card.querySelector('.approve-property');
        if (approveBtn) {
            approveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                approveProperty(property.id);
            });
        }
    });
}

function displayUserProperties() {
    if (!currentUser) return;
    
    const userProperties = properties.filter(property => 
        property.userId === currentUser.id || 
        (currentUser.email === ADMIN_EMAIL && !property.approved)
    );
    userPropertiesContainer.innerHTML = '';
    
    if (userProperties.length === 0) {
        userPropertiesContainer.innerHTML = '<p>You have no properties listed yet.</p>';
        return;
    }
    
    userProperties.forEach(property => {
        const card = createPropertyCard(property, currentUser.email === ADMIN_EMAIL);
        userPropertiesContainer.appendChild(card);
        
        // Add edit button for user's properties
        if (property.userId === currentUser.id) {
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-secondary edit-property';
            editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
            editBtn.setAttribute('data-id', property.id);
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                editProperty(property.id);
            });
            card.querySelector('.property-info').appendChild(editBtn);
        }
    });
}

function createPropertyCard(property, showAdminControls = false) {
    const propertyCard = document.createElement('div');
    propertyCard.className = 'property-card';
    
    // Add pending approval badge if needed
    const approvalBadge = !property.approved ? 
        '<div class="approval-badge">Pending Approval</div>' : '';
    
    // Add verified badge if user is verified
    const user = users.find(u => u.id === property.userId);
    const verifiedBadge = user?.verified ? 
        '<div class="verified-badge"><i class="fas fa-check-circle"></i> Verified</div>' : '';
    
    propertyCard.innerHTML = `
        ${approvalBadge}
        ${verifiedBadge}
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
            <div class="property-features">
                ${property.facing ? `<span><i class="fas fa-compass"></i> ${property.facing}</span>` : ''}
                ${property.roadAccess ? `<span><i class="fas fa-road"></i> ${property.roadAccess}</span>` : ''}
                ${property.electricity ? `<span><i class="fas fa-bolt"></i> Electricity</span>` : ''}
                ${property.waterSupply ? `<span><i class="fas fa-tint"></i> ${property.waterSupply}</span>` : ''}
            </div>
            <p class="property-price">Rs. ${property.price.toLocaleString()}</p>
            <button class="btn btn-primary view-details" data-id="${property.id}">View Details</button>
            ${currentUser && (currentUser.id === property.userId || currentUser.email === ADMIN_EMAIL) ? 
                `<button class="delete-property" data-id="${property.id}"><i class="fas fa-trash"></i></button>` : ''}
            ${showAdminControls && currentUser?.email === ADMIN_EMAIL && !property.approved ? 
                `<button class="btn btn-success approve-property" data-id="${property.id}">Approve</button>` : ''}
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

// Property Management Functions
function showPropertyDetails(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    const imagesHTML = property.images.map(img => `
        <div class="property-detail-image">
            <img src="${img}" alt="${property.title}">
        </div>
    `).join('');

    const user = users.find(u => u.id === property.userId);
    const contactInfo = currentUser ? `
        <div class="contact-info">
            <h4>Contact Information</h4>
            <p><i class="fas fa-user"></i> ${user.firstName} ${user.lastName}</p>
            <p><i class="fas fa-phone"></i> ${user.phone}</p>
            ${user.verified ? '<p><i class="fas fa-check-circle verified-icon"></i> Verified Seller</p>' : ''}
        </div>
    ` : '<p class="contact-message">Please login to view contact information</p>';

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
                <div class="property-detail-features">
                    <h4>Features</h4>
                    <ul>
                        ${property.facing ? `<li><i class="fas fa-compass"></i> Facing: ${property.facing}</li>` : ''}
                        ${property.roadAccess ? `<li><i class="fas fa-road"></i> Road Access: ${property.roadAccess}</li>` : ''}
                        ${property.electricity ? `<li><i class="fas fa-bolt"></i> Electricity Available</li>` : ''}
                        ${property.waterSupply ? `<li><i class="fas fa-tint"></i> Water Supply: ${property.waterSupply}</li>` : ''}
                    </ul>
                </div>
                <p class="property-detail-price">Rs. ${property.price.toLocaleString()}</p>
                <div class="property-detail-description">
                    <h4>Description</h4>
                    <p>${property.description || 'No description available.'}</p>
                </div>
                ${contactInfo}
                ${currentUser && (currentUser.id === property.userId || currentUser.email === ADMIN_EMAIL) ? 
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
    const facing = document.getElementById('property-facing').value;
    const roadAccess = document.getElementById('property-road-access').value;
    const electricity = document.getElementById('property-electricity').checked;
    const waterSupply = document.getElementById('property-water-supply').value;
    
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
                facing,
                roadAccess,
                electricity,
                waterSupply,
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
            facing,
            roadAccess,
            electricity,
            waterSupply,
            userId: currentUser.id,
            approved: currentUser.email === ADMIN_EMAIL, // Auto-approve for admin
            createdAt: new Date()
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
    
    // Update displays
    displayFeaturedProperties();
    displayAllProperties();
    displayUserProperties();
    if (currentUser.email === ADMIN_EMAIL) {
        displayPendingApprovals();
    }
    
    alert(`Property ${propertyForm.dataset.mode === 'edit' ? 'updated' : 'added'} successfully!`);
    switchSection('home-section');
}

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
    document.getElementById('property-facing').value = property.facing || '';
    document.getElementById('property-road-access').value = property.roadAccess || '';
    document.getElementById('property-electricity').checked = property.electricity || false;
    document.getElementById('property-water-supply').value = property.waterSupply || '';

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

function deleteProperty(propertyId) {
    if (confirm('Are you sure you want to delete this property?')) {
        properties = properties.filter(property => property.id !== propertyId);
        displayFeaturedProperties();
        displayAllProperties();
        displayUserProperties();
        if (currentUser?.email === ADMIN_EMAIL) {
            displayPendingApprovals();
        }
        alert('Property deleted successfully!');
    }
}

function approveProperty(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
        property.approved = true;
        displayFeaturedProperties();
        displayAllProperties();
        displayUserProperties();
        displayPendingApprovals();
        alert('Property approved successfully!');
    }
}

// User Management Functions
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
        
        // Add admin section if admin logs in
        if (currentUser.email === ADMIN_EMAIL) {
            addAdminSection();
            displayPendingApprovals();
        }
        
        alert('Login successful!');
    } else {
        alert('Invalid email or password');
    }
}

function handleSignup(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('signup-firstname').value;
    const lastName = document.getElementById('signup-lastname').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const phone = document.getElementById('signup-phone').value;
    
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
        phone,
        bio: '',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png',
        verified: false,
        isAdmin: email === ADMIN_EMAIL
    };
    
    users.push(newUser);
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    closeModalHandler();
    alert('Account created successfully!');
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    switchSection('home-section');
    alert('Logged out successfully');
}

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
    
    // Update in users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
    }
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    alert('Profile updated successfully!');
}

function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentUser.avatar = e.target.result;
            profileAvatar.src = e.target.result;
            avatarImg.src = e.target.result;
            
            // Update in users array
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex].avatar = e.target.result;
            }
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        };
        reader.readAsDataURL(file);
    }
}

// Helper Functions
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

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    toggleThemeBtn.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('darkMode', isDarkMode);
}

function checkAuthState() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
}

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

function addAdminSection() {
    const homeSection = document.getElementById('home-section');
    if (!homeSection.querySelector('#pending-approvals')) {
        const adminSection = document.createElement('div');
        adminSection.id = 'pending-approvals';
        adminSection.className = 'admin-section';
        adminSection.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <h3>Pending Approvals</h3>
                </div>
                <div class="properties-grid" id="pending-approvals-container"></div>
            </div>
        `;
        homeSection.appendChild(adminSection);
    }
}

function handleSearchInput() {
    const searchValue = searchInput.value.toLowerCase();
    searchResults.innerHTML = '';
    
    if (searchValue.length < 2) {
        searchResults.classList.remove('active');
        return;
    }
    
    const filteredProperties = properties.filter(property => 
        property.approved && (
            property.title.toLowerCase().includes(searchValue) || 
            property.location.toLowerCase().includes(searchValue) ||
            property.type.toLowerCase().includes(searchValue) ||
            property.description.toLowerCase().includes(searchValue))
    );
    
    if (filteredProperties.length > 0) {
        filteredProperties.forEach(property => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <img src="${property.images[0]}" alt="${property.title}" class="search-result-image">
                <div>
                    <h5>${property.title}</h5>
                    <p><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
                    <p>Rs. ${property.price.toLocaleString()}</p>
                </div>
            `;
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
        noResults.className = 'search-result-item no-results';
        noResults.textContent = 'No results found';
        searchResults.appendChild(noResults);
        searchResults.classList.add('active');
    }
}

// Setup Event Listeners
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
    sortPriceBtn.addEventListener('click', () => {
        sortAscending = !sortAscending;
        sortPriceBtn.textContent = sortAscending ? 'Sort by Price (Low to High)' : 'Sort by Price (High to Low)';
        properties.sort((a, b) => sortAscending ? a.price - b.price : b.price - a.price);
        displayAllProperties();
        displayFeaturedProperties();
        displayUserProperties();
    });
    
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