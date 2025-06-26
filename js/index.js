// js/script.js

// --- SUPABASE CLIENT INITIALIZATION (IMPORTANT: REPLACE WITH YOUR ACTUAL KEYS!) ---

const SUPABASE_URL = "https://fnwmwbiycfzmgpoczpnm.supabase.co"
const SUPABASE_ANON_KEY = ""

// Initialize the Supabase client
const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- DOM Elements ---
const authModal = document.getElementById('auth-modal');
const authModalCloseBtn = document.getElementById('auth-modal-close');

// Header desktop nav buttons
const signInBtn = document.getElementById('sign-in-btn');
const getStartedBtn = document.getElementById('get-started-btn');

// Hero section buttons
const heroStartPlanningBtn = document.getElementById('hero-start-planning-btn');
const heroExploreDestinationsBtn = document.getElementById('hero-explore-destinations-btn');

// Bottom CTA button
const bottomCreateAccountBtn = document.getElementById('bottom-create-account-btn');

// Auth modal form containers
const loginFormContainer = document.getElementById('login-form-container');
const signupFormContainer = document.getElementById('signup-form-container');
const showSignupLink = document.getElementById('show-signup'); // Link to switch to signup
const showLoginLink = document.getElementById('show-login');   // Link to switch to login

// Login/Signup form elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginErrorMessage = document.getElementById('login-error-message');
const signupErrorMessage = document.getElementById('signup-error-message');

// Hamburger menu elements
const hamburgerMenu = document.getElementById('hamburger-menu');
const sidebarMenu = document.getElementById('sidebar-menu');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
const sidebarNavLinks = document.querySelectorAll('.ge-sidebar-menu a'); // All links within sidebar

// Sidebar specific login/signup buttons (if they exist)
const signInSidebarBtn = document.getElementById('sign-in-sidebar-btn');
const getStartedSidebarBtn = document.getElementById('get-started-sidebar-btn');

// Main app dashboard elements (initially hidden)
// You'll need to add this section to your HTML for it to work fully later!
// For now, it will just show a simple message or alert if auth is successful.
const appDashboard = document.getElementById('app-dashboard-container'); // Add a div with this ID in main
const userEmailDisplay = document.getElementById('user-email-display');
const logoutBtn = document.getElementById('logout-btn');


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
 * Updates the UI based on the current authentication state.
 * Shows/hides login/signup buttons and switches between landing page/dashboard.
 */
async function updateUI() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        // User is logged in
        console.log("User logged in:", user.email);
        hideAuthModal(); // Hide modal if it's open
        hideSidebar(); // Hide sidebar if it's open

        // Hide public-facing buttons
        if (signInBtn) signInBtn.style.display = 'none';
        if (getStartedBtn) getStartedBtn.style.display = 'none';
        if (heroStartPlanningBtn) heroStartPlanningBtn.style.display = 'none';
        if (bottomCreateAccountBtn) bottomCreateAccountBtn.style.display = 'none';
        
        // Hide sidebar login/signup (if they exist)
        if (signInSidebarBtn) signInSidebarBtn.style.display = 'none';
        if (getStartedSidebarBtn) getStartedSidebarBtn.style.display = 'none';

        // Show a placeholder dashboard or direct to app content
        // IMPORTANT: You'll eventually replace this with your actual app dashboard HTML
        const mainContent = document.querySelector('main'); // Select the main content area
        mainContent.innerHTML = `
            <section class="ge-app-dashboard ge-container" id="app-dashboard-container">
                <h2>Welcome, <span id="user-email-display">${user.email}</span>!</h2>
                <p>Your journey with Global Explorer begins now. Let's plan your next adventure!</p>
                <button id="logout-btn" class="ge-btn ge-btn-secondary">Log Out</button>
                <!-- This is where your full app features (planning, suggestions etc.) will go -->
                <div class="planning-area" style="margin-top: 40px; text-align: left;">
                    <h3>Plan Your Adventure (Coming Soon!)</h3>
                    <p>This is your personalized dashboard. Features like destination planning, budget tools, and partner integrations will appear here.</p>
                </div>
            </section>
        `;
        // Re-get logout button after it's added to DOM
        const newLogoutBtn = document.getElementById('logout-btn');
        if (newLogoutBtn) newLogoutBtn.addEventListener('click', handleLogout);


    } else {
        // User is logged out
        console.log("User is logged out.");
        
        // Show public-facing buttons
        if (signInBtn) signInBtn.style.display = 'inline-block';
        if (getStartedBtn) getStartedBtn.style.display = 'inline-block';
        if (heroStartPlanningBtn) heroStartPlanningBtn.style.display = 'inline-block'; // Or show login/signup modal directly
        if (bottomCreateAccountBtn) bottomCreateAccountBtn.style.display = 'inline-block';

        // Show sidebar login/signup (if they exist)
        if (signInSidebarBtn) signInSidebarBtn.style.display = 'block';
        if (getStartedSidebarBtn) getStartedSidebarBtn.style.display = 'block';

        // Revert main content to landing page (if it was changed to dashboard)
        // This is a basic way to revert, for more complex apps you'd swap content.
        const mainContent = document.querySelector('main');
        // Check if we are currently displaying the dashboard
        if (mainContent.querySelector('#app-dashboard-container')) {
            // Reload the page to go back to the original landing page
            // For a single page app without reload, you'd swap content instead.
            window.location.reload(); 
        }
    }
}

/**
 * Handles user logout.
 * @param {Event} event The click event.
 */
async function handleLogout(event) {
    event.preventDefault(); // Prevent default link behavior
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error logging out:', error.message);
        alert(`Logout error: ${error.message}`); // Provide user feedback
    } else {
        alert('You have been logged out successfully!');
        updateUI(); // Update UI after successful logout (will reload page to landing)
    }
}


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial UI update based on current auth state
    updateUI();

    // Header navigation buttons (desktop)
    signInBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(true); });
    getStartedBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(false); });

    // Hero section buttons
    heroStartPlanningBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(false); }); // "Start Planning" implies signup
    heroExploreDestinationsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Exploring destinations is coming soon! Please sign up or sign in to start planning.'); // Simple placeholder
    });

    // Bottom CTA button
    bottomCreateAccountBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(false); }); // "Create Your Account" implies signup

    // Modal close button
    authModalCloseBtn.addEventListener('click', hideAuthModal);

    // Close modal if clicked outside modal content
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            hideAuthModal();
        }
    });

    // Switch between login and signup forms within the modal
    showSignupLink.addEventListener('click', (e) => { e.preventDefault(); loginFormContainer.style.display = 'none'; signupFormContainer.style.display = 'block'; });
    showLoginLink.addEventListener('click', (e) => { e.preventDefault(); loginFormContainer.style.display = 'block'; signupFormContainer.style.display = 'none'; });

    // Auth form submissions
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);

    // Hamburger menu toggle
    hamburgerMenu.addEventListener('click', toggleSidebar);
    sidebarCloseBtn.addEventListener('click', hideSidebar);

    // Close sidebar when a navigation link inside it is clicked
    sidebarNavLinks.forEach(link => {
        link.addEventListener('click', hideSidebar);
    });

    // Sidebar specific login/signup buttons (these will also open the modal)
    if (signInSidebarBtn) signInSidebarBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(true); });
    if (getStartedSidebarBtn) getStartedSidebarBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(false); });
});

// Supabase Auth Listener (for real-time UI updates after login/logout, or page refresh)
// This is critical for updating the UI correctly even if user refreshes page or logs in from another tab
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session);
    updateUI();
});