// Complete Real Estate Listing Script with All Fixes
document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // DATA STORAGE
    // ======================
    let properties = JSON.parse(localStorage.getItem('realEstateProperties')) || [
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
            description: "Premium land in prime location of Kathmandu.",
            userId: 1,
            approved: true,
            createdAt: new Date('2023-01-15').toISOString(),
            facing: "East",
            roadAccess: "Paved",
            electricity: true,
            waterSupply: "24/7"
        }
    ];

    let users = JSON.parse(localStorage.getItem('realEstateUsers')) || [
        {
            id: 1,
            firstName: "Ram",
            lastName: "Sharma",
            email: "ram@example.com",
            password: "password123",
            phone: "9841000001",
            bio: "Property developer",
            avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
            verified: true
        },
        {
            id: 2,
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

    // ======================
    // APP STATE
    // ======================
    const ADMIN_EMAIL = "suss53661@gmail.com";
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let sortAscending = true;
    let propertyImages = [];
    let dropzone;

    // ======================
    // INITIALIZATION
    // ======================
    function init() {
        setupEventListeners();
        setupDropzone();
        setupMobileFileUpload();
        setupMobileMenu();
        checkAuthState();
        displayFeaturedProperties();
        displayAllProperties();
        
        // Check if mobile device
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            document.body.classList.add('mobile-device');
        }
    }

    // ======================
    // CORE FUNCTIONALITY
    // ======================
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
            setupRemoveImageButtons();
        });

        dropzone.on("removedfile", function(file) {
            propertyImages = propertyImages.filter(f => f !== file);
        });
    }

    function setupMobileFileUpload() {
        const dropzoneElement = document.getElementById('property-image-upload');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'property-image-upload-fallback';
        fileInput.multiple = true;
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        
        dropzoneElement.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                fileInput.click();
            }
        });
        
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                const previewContainer = document.getElementById('image-preview');
                previewContainer.innerHTML = '';
                
                for (let i = 0; i < fileInput.files.length; i++) {
                    const file = fileInput.files[i];
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        const previewItem = document.createElement('div');
                        previewItem.className = 'image-preview-item';
                        previewItem.innerHTML = `
                            <img src="${e.target.result}" />
                            <button class="remove-image"><i class="fas fa-times"></i></button>
                        `;
                        previewContainer.appendChild(previewItem);
                        
                        previewItem.querySelector('.remove-image').addEventListener('click', () => {
                            previewItem.remove();
                        });
                        
                        // Add to propertyImages for form submission
                        propertyImages.push(file);
                    };
                    
                    reader.readAsDataURL(file);
                }
            }
        });
        
        document.body.appendChild(fileInput);
    }

    function setupRemoveImageButtons() {
        document.querySelectorAll('.remove-image').forEach(button => {
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
    }

    // ======================
    // PROPERTY DISPLAY
    // ======================
    function displayFeaturedProperties() {
        const container = document.getElementById('featured-properties-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        const approvedProperties = properties.filter(p => p.approved);
        const featured = approvedProperties.slice(0, 3);
        
        if (featured.length === 0) {
            container.innerHTML = '<p class="no-results">No featured properties</p>';
            return;
        }
        
        featured.forEach(property => {
            container.appendChild(createPropertyCard(property));
        });
    }

    function displayAllProperties() {
        const container = document.getElementById('all-properties-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        const approved = properties.filter(p => p.approved);
        
        if (approved.length === 0) {
            container.innerHTML = '<p class="no-results">No properties available</p>';
            return;
        }
        
        approved.forEach(property => {
            container.appendChild(createPropertyCard(property));
        });
    }

    function displayUserProperties() {
        const container = document.getElementById('user-properties-container');
        if (!container || !currentUser) return;
        
        container.innerHTML = '';
        
        const userProps = properties.filter(p => 
            p.userId === currentUser.id || 
            (currentUser.email === ADMIN_EMAIL && !p.approved)
        );
        
        if (userProps.length === 0) {
            container.innerHTML = '<p>No properties listed yet</p>';
            return;
        }
        
        userProps.forEach(property => {
            const card = createPropertyCard(property, currentUser.email === ADMIN_EMAIL);
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
            container.appendChild(card);
        });
    }

    function createPropertyCard(property, showAdminControls = false) {
        const card = document.createElement('div');
        card.className = 'property-card';
        
        const user = users.find(u => u.id === property.userId);
        const isOwner = currentUser && currentUser.id === property.userId;
        
        card.innerHTML = `
            ${!property.approved ? '<div class="approval-badge">Pending Approval</div>' : ''}
            ${user?.verified ? '<div class="verified-badge"><i class="fas fa-check-circle"></i> Verified</div>' : ''}
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
                <p class="property-price">Rs. ${property.price.toLocaleString()}</p>
                <button class="btn btn-primary view-details" data-id="${property.id}">View Details</button>
                ${(isOwner || currentUser?.email === ADMIN_EMAIL) ? 
                    `<button class="delete-property" data-id="${property.id}"><i class="fas fa-trash"></i></button>` : ''}
                ${showAdminControls && !property.approved ? 
                    `<button class="btn btn-success approve-property" data-id="${property.id}">Approve</button>` : ''}
            </div>
        `;
        
        card.querySelector('.view-details').addEventListener('click', () => {
            showPropertyDetails(property.id);
        });

        const deleteBtn = card.querySelector('.delete-property');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteProperty(property.id);
            });
        }

        const approveBtn = card.querySelector('.approve-property');
        if (approveBtn) {
            approveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                approveProperty(property.id);
            });
        }

        return card;
    }

    // ======================
    // PROPERTY MANAGEMENT
    // ======================
    function addProperty(event) {
        event.preventDefault();
        
        if (!currentUser) {
            alert('Please login to add property');
            return;
        }
        
        // Get form values
        const formData = {
            title: document.getElementById('property-title').value,
            location: document.getElementById('property-location').value,
            type: document.getElementById('property-type-select').value,
            bedrooms: document.getElementById('property-bedrooms').value || null,
            bathrooms: document.getElementById('property-bathrooms').value || null,
            area: parseInt(document.getElementById('property-area').value),
            price: parseInt(document.getElementById('property-price').value),
            description: document.getElementById('property-description').value,
            facing: document.getElementById('property-facing').value,
            roadAccess: document.getElementById('property-road-access').value,
            electricity: document.getElementById('property-electricity').checked,
            waterSupply: document.getElementById('property-water-supply').value,
            userId: currentUser.id,
            approved: currentUser.email === ADMIN_EMAIL,
            createdAt: new Date().toISOString()
        };

        // Handle image uploads
        const imageInput = document.getElementById('property-image-upload-fallback');
        formData.images = [];
        
        // Mobile upload
        if (imageInput.files.length > 0) {
            for (let i = 0; i < imageInput.files.length; i++) {
                formData.images.push(URL.createObjectURL(imageInput.files[i]));
            }
        } 
        // Desktop upload
        else if (propertyImages.length > 0) {
            formData.images = propertyImages.map(file => URL.createObjectURL(file));
        } else {
            alert('Please upload at least one image');
            return;
        }

        // Create or update property
        if (propertyForm.dataset.mode === 'edit') {
            const id = parseInt(propertyForm.dataset.id);
            const index = properties.findIndex(p => p.id === id);
            if (index !== -1) {
                properties[index] = { ...properties[index], ...formData };
            }
        } else {
            formData.id = properties.length ? Math.max(...properties.map(p => p.id)) + 1 : 1;
            properties.push(formData);
        }

        saveData();
        resetPropertyForm();
        updatePropertyDisplays();
        alert(`Property ${propertyForm.dataset.mode === 'edit' ? 'updated' : 'added'} successfully!`);
        switchSection('home-section');
    }

    function editProperty(id) {
        const property = properties.find(p => p.id === id);
        if (!property) return;

        // Fill form
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

        // Set edit mode
        propertyForm.dataset.mode = 'edit';
        propertyForm.dataset.id = id;
        document.querySelector('#add-property-section h2').textContent = 'Edit Property';

        // Clear images
        document.getElementById('image-preview').innerHTML = '';
        if (dropzone) {
            dropzone.removeAllFiles(true);
        }
        propertyImages = [];

        // Show current images
        property.images.forEach(img => {
            const preview = document.createElement('div');
            preview.className = 'image-preview-item';
            preview.innerHTML = `
                <img src="${img}" />
                <button class="remove-image"><i class="fas fa-times"></i></button>
            `;
            document.getElementById('image-preview').appendChild(preview);
            
            preview.querySelector('.remove-image').addEventListener('click', () => {
                preview.remove();
                property.images = property.images.filter(i => i !== img);
            });
        });

        switchSection('add-property-section');
    }

    function deleteProperty(id) {
        if (!confirm('Are you sure you want to delete this property?')) return;
        
        properties = properties.filter(p => p.id !== id);
        saveData();
        updatePropertyDisplays();
        alert('Property deleted successfully!');
    }

    function approveProperty(id) {
        const property = properties.find(p => p.id === id);
        if (property) {
            property.approved = true;
            saveData();
            updatePropertyDisplays();
            alert('Property approved!');
        }
    }

    function resetPropertyForm() {
        propertyForm.reset();
        propertyForm.dataset.mode = '';
        propertyForm.dataset.id = '';
        document.getElementById('image-preview').innerHTML = '';
        if (dropzone) dropzone.removeAllFiles(true);
        propertyImages = [];
        document.querySelector('#add-property-section h2').textContent = 'Add New Property';
    }

    function updatePropertyDisplays() {
        displayFeaturedProperties();
        displayAllProperties();
        displayUserProperties();
        if (currentUser?.email === ADMIN_EMAIL) {
            displayPendingApprovals();
        }
    }

    // ======================
    // USER MANAGEMENT
    // ======================
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
        
        const formData = {
            firstName: document.getElementById('signup-firstname').value,
            lastName: document.getElementById('signup-lastname').value,
            email: document.getElementById('signup-email').value,
            password: document.getElementById('signup-password').value,
            confirmPassword: document.getElementById('signup-confirm-password').value,
            phone: document.getElementById('signup-phone').value
        };

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (users.some(u => u.email === formData.email)) {
            alert('Email already in use');
            return;
        }

        const newUser = {
            id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
            ...formData,
            bio: '',
            avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png',
            verified: false,
            isAdmin: formData.email === ADMIN_EMAIL
        };

        users.push(newUser);
        currentUser = newUser;
        saveData();
        updateAuthUI();
        closeModalHandler();
        alert('Account created successfully!');
    }

    function updateProfile(event) {
        event.preventDefault();
        
        if (!currentUser) return;
        
        currentUser.firstName = document.getElementById('profile-firstname').value;
        currentUser.lastName = document.getElementById('profile-lastname').value;
        currentUser.phone = document.getElementById('profile-phone').value;
        currentUser.bio = document.getElementById('profile-bio').value;
        
        // Update in users array
        const index = users.findIndex(u => u.id === currentUser.id);
        if (index !== -1) {
            users[index] = currentUser;
        }
        
        saveData();
        updateAuthUI();
        alert('Profile updated successfully!');
    }

    function handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            currentUser.avatar = e.target.result;
            profileAvatar.src = e.target.result;
            avatarImg.src = e.target.result;
            
            // Update in users array
            const index = users.findIndex(u => u.id === currentUser.id);
            if (index !== -1) {
                users[index].avatar = e.target.result;
            }
            
            saveData();
        };
        reader.readAsDataURL(file);
    }

    function handleLogout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateAuthUI();
        switchSection('home-section');
        alert('Logged out successfully');
    }

    // ======================
    // UTILITY FUNCTIONS
    // ======================
    function saveData() {
        localStorage.setItem('realEstateProperties', JSON.stringify(properties));
        localStorage.setItem('realEstateUsers', JSON.stringify(users));
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }

    function checkAuthState() {
        const savedUser = localStorage.getItem('currentUser');
        const savedUsers = localStorage.getItem('realEstateUsers');
        const savedProperties = localStorage.getItem('realEstateProperties');
        
        if (savedUsers) users = JSON.parse(savedUsers);
        if (savedProperties) properties = JSON.parse(savedProperties);
        if (savedUser) currentUser = JSON.parse(savedUser);
        
        updateAuthUI();
    }

    function updateAuthUI() {
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        const authMobile = document.getElementById('auth-mobile');
        const userMobile = document.getElementById('user-mobile');
        
        if (currentUser) {
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) userMenu.style.display = 'flex';
            if (authMobile) authMobile.style.display = 'none';
            if (userMobile) userMobile.style.display = 'flex';
            
            if (avatarImg) avatarImg.src = currentUser.avatar;
            if (profileAvatar) profileAvatar.src = currentUser.avatar;
            
            // Update profile form
            if (profileForm) {
                document.getElementById('profile-firstname').value = currentUser.firstName;
                document.getElementById('profile-lastname').value = currentUser.lastName;
                document.getElementById('profile-phone').value = currentUser.phone || '';
                document.getElementById('profile-bio').value = currentUser.bio || '';
                document.getElementById('profile-name').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
                document.getElementById('profile-email').textContent = currentUser.email;
            }
            
            displayUserProperties();
        } else {
            if (authButtons) authButtons.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
            if (authMobile) authMobile.style.display = 'flex';
            if (userMobile) userMobile.style.display = 'none';
        }
    }

    function setupMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');
        
        if (!menuBtn || !menu) return;
        
        menuBtn.addEventListener('click', () => {
            menu.classList.toggle('active');
            menuBtn.innerHTML = menu.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

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

        // Close mobile menu
        const menu = document.getElementById('mobile-menu');
        const menuBtn = document.getElementById('mobile-menu-btn');
        if (menu && menuBtn) {
            menu.classList.remove('active');
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }

    function closeModalHandler() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // ======================
    // EVENT LISTENERS
    // ======================
    function setupEventListeners() {
        // Navigation
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                switchSection(`${link.getAttribute('data-section')}-section`);
            });
        });

        // Auth forms
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        if (signupForm) signupForm.addEventListener('submit', handleSignup);
        
        // Profile
        if (profileForm) profileForm.addEventListener('submit', updateProfile);
        if (avatarUpload) avatarUpload.addEventListener('change', handleAvatarUpload);
        
        // Property form
        if (propertyForm) propertyForm.addEventListener('submit', addProperty);
        
        // Modal
        if (closeModal) closeModal.addEventListener('click', closeModalHandler);
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeModalHandler();
            }
        });
        
        // Buttons
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
        if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);
        if (viewAllBtn) viewAllBtn.addEventListener('click', () => switchSection('properties-section'));
        if (toggleThemeBtn) toggleThemeBtn.addEventListener('click', toggleDarkMode);
        
        // Auth modals
        const authModalButtons = [
            { btn: loginBtn, modal: 'login-modal' },
            { btn: signupBtn, modal: 'signup-modal' },
            { btn: mobileLoginBtn, modal: 'login-modal' },
            { btn: mobileSignupBtn, modal: 'signup-modal' },
            { btn: showSignup, modal: 'signup-modal', hide: 'login-modal' },
            { btn: showLogin, modal: 'login-modal', hide: 'signup-modal' }
        ];
        
        authModalButtons.forEach(item => {
            if (item.btn) {
                item.btn.addEventListener('click', (e) => {
                    if (item.hide) {
                        document.getElementById(item.hide).style.display = 'none';
                    }
                    document.getElementById(item.modal).style.display = 'block';
                    if (e.preventDefault) e.preventDefault();
                });
            }
        });
    }

    // ======================
    // INITIALIZE APP
    // ======================
    init();
});