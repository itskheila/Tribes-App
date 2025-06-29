// js/index.js

// --- SUPABASE CLIENT INITIALIZATION (IMPORTANT: REPLACE WITH YOUR ACTUAL KEYS!) ---

const SUPABASE_URL = "https://fnwmwbiycfzmgpoczpnm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZud213Yml5Y2Z6bWdwb2N6cG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDc3OTksImV4cCI6MjA2NjUyMzc5OX0.iHGZL_shA1G5p0aFzfix2jxSFDzz_ZhQotc5s7tYrQU";

// Initialize the Supabase client
const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- DOM Elements ---
const authModal = document.getElementById('auth-modal');
const authModalCloseBtn = document.getElementById('auth-modal-close');

// Header desktop nav buttons (IDs remain the same)
const signInBtn = document.getElementById('sign-in-btn');
const getStartedBtn = document.getElementById('get-started-btn');

// Hero section buttons (IDs remain the same)
const heroStartPlanningBtn = document.getElementById('hero-start-planning-btn');
const heroExploreDestinationsBtn = document.getElementById('hero-explore-destinations-btn');

// Bottom CTA button (ID remains the same)
const bottomCreateAccountBtn = document.getElementById('bottom-create-account-btn');

// Auth modal form containers (IDs remain the same)
const loginFormContainer = document.getElementById('login-form-container');
const signupFormContainer = document.getElementById('signup-form-container');
const showSignupLink = document.getElementById('show-signup'); // Link to switch to signup
const showLoginLink = document.getElementById('show-login');   // Link to switch to login

// Login/Signup form elements (IDs remain the same)
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginErrorMessage = document.getElementById('login-error-message');
const signupErrorMessage = document.getElementById('signup-error-message');

// Hamburger menu elements (IDs remain the same)
const hamburgerMenu = document.getElementById('hamburger-menu');
const sidebarMenu = document.getElementById('sidebar-menu');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
// Updated selector for sidebar links as class names have tk- prefix
const sidebarNavLinks = document.querySelectorAll('.tk-sidebar-menu a'); 

// Sidebar specific login/signup buttons (IDs remain the same)
const signInSidebarBtn = document.getElementById('sign-in-sidebar-btn');
const getStartedSidebarBtn = document.getElementById('get-started-sidebar-btn');

// Main app dashboard elements (initially hidden)
// Note: These are defined globally but will be used after content is dynamically changed.
const appDashboardContainerId = 'app-dashboard-container'; // ID for the dynamically created dashboard section
let logoutBtn = null; // Will be assigned after dynamic content creation


// --- Functions ---

/**
 * Displays the authentication modal and optionally switches between login/signup forms.
 * @param {boolean} showLogin If true, shows the login form; otherwise, shows the signup form.
 */
function showAuthModal(showLogin = true) {
    authModal.classList.add('active'); // Show the modal
    document.body.classList.add('modal-open'); // Add class to body to prevent scrolling
    
    // Hide sidebar if it's open (important for mobile UX)
    hideSidebar(); 

    if (showLogin) {
        loginFormContainer.style.display = 'block';
        signupFormContainer.style.display = 'none';
    } else {
        loginFormContainer.style.display = 'none';
        signupFormContainer.style.display = 'block';
    }
    // Clear form fields and any previous error messages
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    loginErrorMessage.textContent = '';
    signupErrorMessage.textContent = '';
}

/**
 * Hides the authentication modal.
 */
function hideAuthModal() {
    authModal.classList.remove('active'); // Hide the modal
    document.body.classList.remove('modal-open'); // Re-enable body scrolling
}

/**
 * Toggles the mobile sidebar menu open/close.
 */
function toggleSidebar() {
    sidebarMenu.classList.toggle('open');
    // Prevent body scrolling when sidebar is open
    document.body.classList.toggle('modal-open', sidebarMenu.classList.contains('open'));
}

/**
 * Hides the mobile sidebar menu.
 */
function hideSidebar() {
    sidebarMenu.classList.remove('open');
    document.body.classList.remove('modal-open');
}

/**
 * Handles user login.
 * @param {Event} event The submit event from the login form.
 */
async function handleLogin(event) {
    event.preventDefault(); // Prevent default form submission
    loginErrorMessage.textContent = ''; // Clear previous errors

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        console.error('Login error:', error.message);
        loginErrorMessage.textContent = `Login failed: ${error.message}`;
    } else {
        console.log('User logged in:', data.user);
        hideAuthModal();
        updateUI(); // Update UI after successful login
        alert('Logged in successfully! Welcome back.');
    }
}

/**
 * Handles user signup.
 * @param {Event} event The submit event from the signup form.
 */
async function handleSignup(event) {
    event.preventDefault(); // Prevent default form submission
    signupErrorMessage.textContent = ''; // Clear previous errors

    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        console.error('Signup error:', error.message);
        signupErrorMessage.textContent = `Signup failed: ${error.message}`;
    } else {
        console.log('User signed up:', data.user);
        hideAuthModal();
        alert('Signup successful! Please check your email to confirm your account.');
        // No need to update UI immediately for signup as user isn't fully logged in until email confirmed
    }
}


/**
 * Updates the UI based on the current authentication state.
 * Shows/hides login/signup buttons and switches between landing page/dashboard.
 */
async function updateUI() {
    const { data: { user } } = await supabase.auth.getUser();
    const mainContent = document.querySelector('main'); // Select the main content area

    // Get references to elements that might be hidden/shown, in case they're available
    const headerSignInBtn = document.getElementById('sign-in-btn');
    const headerGetStartedBtn = document.getElementById('get-started-btn');
    const heroStartBtn = document.getElementById('hero-start-planning-btn');
    const bottomCtaBtn = document.getElementById('bottom-create-account-btn');
    const sidebarSignIn = document.getElementById('sign-in-sidebar-btn');
    const sidebarGetStarted = document.getElementById('get-started-sidebar-btn');

    if (user) {
        // User is logged in
        console.log("User logged in:", user.email);
        hideAuthModal(); // Hide modal if it's open
        hideSidebar(); // Hide sidebar if it's open

        // Hide public-facing buttons if they exist
        if (headerSignInBtn) headerSignInBtn.style.display = 'none';
        if (headerGetStartedBtn) headerGetStartedBtn.style.display = 'none';
        if (heroStartBtn) heroStartBtn.style.display = 'none';
        if (bottomCtaBtn) bottomCtaBtn.style.display = 'none';
        if (sidebarSignIn) sidebarSignIn.style.display = 'none';
        if (sidebarGetStarted) sidebarGetStarted.style.display = 'none';
        
        // Hide existing landing page sections
        document.querySelector('.tk-hero-section').style.display = 'none';
        document.querySelector('.tk-section-padding').style.display = 'none';
        document.querySelector('.tk-cta-section').style.display = 'none';

        // Append or replace main content with dashboard
        let dashboardSection = document.getElementById(appDashboardContainerId);
        if (!dashboardSection) {
            dashboardSection = document.createElement('section');
            dashboardSection.id = appDashboardContainerId;
            dashboardSection.className = 'tk-app-dashboard tk-container'; // Add classes for styling
            mainContent.appendChild(dashboardSection);
        }

        // Clear existing content in dashboard section
        dashboardSection.innerHTML = `
            <h2 style="color: var(--dark-blue); font-size: 2.5em; margin-bottom: 20px; text-align: center;">Welcome, <span id="user-email-display">${user.email}</span>!</h2>
            <p style="font-size: 1.1em; color: var(--text-light); max-width: 800px; margin: 0 auto 30px auto; text-align: center;">Your adventure with Tribe Konnect truly begins now. Let's plan your next unforgettable trip!</p>
            <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 40px;">
                <button id="logout-btn" class="tk-btn tk-btn-outline">Log Out</button>
                <button class="tk-btn tk-btn-primary">Start Planning New Trip</button>
            </div>
            
            <div class="tk-card-grid" style="margin-top: 50px;">
                <!-- Placeholder for User's Upcoming Trips -->
                <div class="tk-card" style="padding: 30px; text-align: center;">
                    <h3>Upcoming Trips</h3>
                    <p>No trips planned yet. Click "Start Planning New Trip" to begin!</p>
                    <img src="https://placehold.co/300x200/FF6600/ffffff?text=Your+Trips" alt="Upcoming Trips" class="tk-card-image" style="height: 150px; margin-top: 15px;">
                </div>
                <!-- Placeholder for Saved Destinations -->
                <div class="tk-card" style="padding: 30px; text-align: center;">
                    <h3>Saved Destinations</h3>
                    <p>Favorite places you'd love to visit.</p>
                    <img src="https://placehold.co/300x200/002244/ffffff?text=Saved+Places" alt="Saved Destinations" class="tk-card-image" style="height: 150px; margin-top: 15px;">
                </div>
                <!-- Placeholder for Recent Activity -->
                <div class="tk-card" style="padding: 30px; text-align: center;">
                    <h3>Recent Activity</h3>
                    <p>View your past bookings and inquiries.</p>
                     <img src="https://placehold.co/300x200/FF6600/ffffff?text=Recent+Activity" alt="Recent Activity" class="tk-card-image" style="height: 150px; margin-top: 15px;">
                </div>
            </div>
        `;
        // Re-get logout button after it's added to DOM
        logoutBtn = document.getElementById('logout-btn'); // Assign to global logoutBtn variable
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

        // Add some basic styling for the dynamically added dashboard section
        dashboardSection.style.minHeight = '60vh';
        dashboardSection.style.display = 'flex';
        dashboardSection.style.flexDirection = 'column';
        dashboardSection.style.alignItems = 'center';
        dashboardSection.style.justifyContent = 'center';
        dashboardSection.style.padding = '80px 0';
        dashboardSection.style.backgroundColor = 'var(--light-grey)';

    } else {
        // User is logged out
        console.log("User is logged out.");
        
        // Show public-facing buttons if they exist
        if (headerSignInBtn) headerSignInBtn.style.display = 'inline-block';
        if (headerGetStartedBtn) headerGetStartedBtn.style.display = 'inline-block';
        if (heroStartBtn) heroStartBtn.style.display = 'inline-block';
        if (bottomCtaBtn) bottomCtaBtn.style.display = 'inline-block';
        if (sidebarSignIn) sidebarSignIn.style.display = 'block';
        if (sidebarGetStarted) sidebarGetStarted.style.display = 'block';

        // Show existing landing page sections
        document.querySelector('.tk-hero-section').style.display = 'flex'; // Use flex for centering
        document.querySelector('.tk-section-padding').style.display = 'block';
        document.querySelector('.tk-cta-section').style.display = 'block';

        // Remove dashboard section if it exists
        let dashboardSection = document.getElementById(appDashboardContainerId);
        if (dashboardSection) {
            dashboardSection.remove();
        }
    }
}

/**
 * Handles user logout.
 * @param {Event} event The click event.
 */
async function handleLogout(event) {
    if (event) event.preventDefault(); // Prevent default link behavior if applicable
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error logging out:', error.message);
        alert(`Logout error: ${error.message}`); // Provide user feedback
    } else {
        alert('You have been logged out successfully!');
        // The onAuthStateChange listener will call updateUI, which will revert to landing page
    }
}


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial UI update based on current auth state
    updateUI();

    // Header navigation buttons (desktop)
    if (signInBtn) signInBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(true); });
    if (getStartedBtn) getStartedBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(false); });

    // Hero section buttons
    if (heroStartPlanningBtn) heroStartPlanningBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(false); }); // "Start Planning" implies signup
    if (heroExploreDestinationsBtn) heroExploreDestinationsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Exploring destinations is coming soon! Please sign up or sign in to start planning.'); // Simple placeholder
    });

    // Bottom CTA button
    if (bottomCreateAccountBtn) bottomCreateAccountBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(false); }); // "Create Your Account" implies signup

    // Modal close button
    if (authModalCloseBtn) authModalCloseBtn.addEventListener('click', hideAuthModal);

    // Close modal if clicked outside modal content
    if (authModal) authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            hideAuthModal();
        }
    });

    // Switch between login and signup forms within the modal
    if (showSignupLink) showSignupLink.addEventListener('click', (e) => { e.preventDefault(); loginFormContainer.style.display = 'none'; signupFormContainer.style.display = 'block'; });
    if (showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); loginFormContainer.style.display = 'block'; signupFormContainer.style.display = 'none'; });

    // Auth form submissions
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);

    // Hamburger menu toggle
    if (hamburgerMenu) hamburgerMenu.addEventListener('click', toggleSidebar);
    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', hideSidebar);

    // Close sidebar when a navigation link inside it is clicked
    sidebarNavLinks.forEach(link => {
        link.addEventListener('click', hideSidebar);
    });

    // Sidebar specific login/signup buttons (these will also open the modal)
    if (signInSidebarBtn) signInSidebarBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(true); });
    if (getStartedSidebarBtn) getStartedSidebarBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(false); });
    
    // Supabase Auth Listener (for real-time UI updates after login/logout, or page refresh)
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session);
        updateUI();
    });
});