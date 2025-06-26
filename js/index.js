// Supabase Client Initialization (REPLACE WITH YOUR ACTUAL KEYS!)

const SUPABASE_URL = "https://fnwmwbiycfzmgpoczpnm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZud213Yml5Y2Z6bWdwb2N6cG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NDc3OTksImV4cCI6MjA2NjUyMzc5OX0.iHGZL_shA1G5p0aFzfix2jxSFDzz_ZhQotc5s7tYrQU"

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- DOM Elements ---
const authModal = document.getElementById('auth-modal');
const authModalCloseBtn = document.getElementById('auth-modal-close');
const loginNavBtn = document.getElementById('login-nav-btn');
const signupNavBtn = document.getElementById('signup-nav-btn');
const loginSidebarBtn = document.getElementById('login-sidebar-btn');
const signupSidebarBtn = document.getElementById('signup-sidebar-btn');
const loginFormContainer = document.getElementById('login-form-container');
const signupFormContainer = document.getElementById('signup-form-container');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginErrorMessage = document.getElementById('login-error-message');
const signupErrorMessage = document.getElementById('signup-error-message');
const appDashboard = document.getElementById('app-dashboard');
const userEmailDisplay = document.getElementById('user-email-display');
const logoutBtn = document.getElementById('logout-btn');
const startPlanningBtn = document.getElementById('start-planning-btn');
const hamburgerMenu = document.getElementById('hamburger-menu');
const sidebarMenu = document.getElementById('sidebar-menu');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');

// Travel Planning Elements
const countryInput = document.getElementById('country-input');
const activitiesInput = document.getElementById('activities-input');
const budgetAccommodation = document.getElementById('budget-accommodation');
const budgetTransport = document.getElementById('budget-transport');
const budgetActivities = document.getElementById('budget-activities');
const getSuggestionsBtn = document.getElementById('get-suggestions-btn');
const suggestionsResults = document.getElementById('suggestions-results');


// --- Functions ---

/**
 * Updates the UI based on the current authentication state.
 * Shows/hides login/signup forms, or the main app dashboard.
 */
async function updateUI() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        // User is logged in
        authModal.classList.remove('active'); // Hide modal if open
        document.body.classList.remove('modal-open'); // Remove scroll lock
        
        loginNavBtn.style.display = 'none';
        signupNavBtn.style.display = 'none';
        
        // Hide sidebar login/signup if they exist
        if (loginSidebarBtn) loginSidebarBtn.style.display = 'none';
        if (signupSidebarBtn) signupSidebarBtn.style.display = 'none';

        appDashboard.style.display = 'block'; // Show dashboard
        userEmailDisplay.textContent = user.email;
        startPlanningBtn.style.display = 'none'; // Hide start planning btn on landing page
        
        // Adjust header nav for logged-in user if needed (e.g., show profile link)
        // For now, just hide login/signup
        const mainNavList = document.querySelector('.main-nav ul');
        if (!mainNavList.querySelector('#logout-nav-item')) {
            const logoutItem = document.createElement('li');
            logoutItem.id = 'logout-nav-item';
            logoutItem.innerHTML = `<a href="#" id="logout-nav-btn-header">Log Out</a>`;
            mainNavList.appendChild(logoutItem);
            document.getElementById('logout-nav-btn-header').addEventListener('click', handleLogout);
        }

    } else {
        // User is logged out
        loginNavBtn.style.display = 'inline-block';
        signupNavBtn.style.display = 'inline-block';

        if (loginSidebarBtn) loginSidebarBtn.style.display = 'block';
        if (signupSidebarBtn) signupSidebarBtn.style.display = 'block';

        appDashboard.style.display = 'none'; // Hide dashboard
        startPlanningBtn.style.display = 'inline-block'; // Show start planning btn
        
        const logoutNavItem = document.getElementById('logout-nav-item');
        if (logoutNavItem) {
            logoutNavItem.remove();
        }
    }
}

/**
 * Handles user login.
 * @param {Event} event The form submission event.
 */
async function handleLogin(event) {
    event.preventDefault();
    loginErrorMessage.textContent = ''; // Clear previous error

    const email = loginForm.elements['login-email'].value;
    const password = loginForm.elements['login-password'].value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        loginErrorMessage.textContent = error.message;
    } else {
        authModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        updateUI(); // Update UI after successful login
    }
}

/**
 * Handles user signup.
 * @param {Event} event The form submission event.
 */
async function handleSignup(event) {
    event.preventDefault();
    signupErrorMessage.textContent = ''; // Clear previous error

    const email = signupForm.elements['signup-email'].value;
    const password = signupForm.elements['signup-password'].value;

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
        signupErrorMessage.textContent = error.message;
    } else {
        alert('Signup successful! Please check your email to confirm your account.');
        // Optionally, close modal or switch to login form
        authModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        updateUI(); // Update UI, though user might not be immediately 'confirmed'
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
    } else {
        updateUI(); // Update UI after successful logout
    }
}

/**
 * Displays the authentication modal.
 * @param {boolean} showLogin If true, show login form; otherwise, show signup.
 */
function showAuthModal(showLogin = true) {
    authModal.classList.add('active');
    document.body.classList.add('modal-open'); // Prevent body scroll
    if (showLogin) {
        loginFormContainer.style.display = 'block';
        signupFormContainer.style.display = 'none';
    } else {
        loginFormContainer.style.display = 'none';
        signupFormContainer.style.display = 'block';
    }
    // Clear any previous error messages
    loginErrorMessage.textContent = '';
    signupErrorMessage.textContent = '';
}

/**
 * Handles getting travel suggestions.
 * (This is a placeholder; will be fleshed out with API calls later)
 */
async function handleGetSuggestions() {
    suggestionsResults.innerHTML = '<p class="placeholder-text">Searching for suggestions...</p>';
    
    const country = countryInput.value.trim();
    const activities = activitiesInput.value.trim();
    const budgetAcc = parseFloat(budgetAccommodation.value);
    const budgetTrans = parseFloat(budgetTransport.value);
    const budgetAct = parseFloat(budgetActivities.value);

    // Basic validation
    if (!country && !activities) {
        suggestionsResults.innerHTML = '<p class="error-message">Please enter a country or activities.</p>';
        return;
    }
    
    // Simulate API call (replace with actual Supabase data fetching later)
    setTimeout(() => {
        suggestionsResults.innerHTML = `
            <h3>Top Suggestions for ${country || 'Your Interests'}:</h3>
            <div class="suggestion-item">
                <h4>Example Destination: Coastal Getaway in ${country || 'Unknown'}</h4>
                <p>Perfect for beach lovers and scuba diving, staying within your budget of $${(budgetAcc + budgetTrans + budgetAct).toFixed(2)}.</p>
                <p>Partnership Transport: Safari Van (budget-friendly)</p>
                <p>Accommodation: Eco-Lodge ($${budgetAcc.toFixed(2)})</p>
            </div>
            <div class="suggestion-item">
                <h4>Example Destination: Mountain Trek in ${country || 'Unknown'}</h4>
                <p>Ideal for hiking and wildlife spotting. Great local food options.</p>
                <p>Partnership Transport: Matatu (local experience, very cheap)</p>
                <p>Accommodation: Local Guesthouse ($${budgetAcc.toFixed(2)})</p>
            </div>
            <p>More detailed suggestions will be added with real data!</p>
        `;
    }, 1500); // Simulate network delay
}

/**
 * Toggles the mobile sidebar menu.
 */
function toggleSidebar() {
    sidebarMenu.classList.toggle('open');
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    updateUI(); // Check auth state on page load

    // Header nav buttons
    loginNavBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(true); });
    signupNavBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(false); });

    // Sidebar nav buttons
    if (loginSidebarBtn) loginSidebarBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(true); toggleSidebar(); });
    if (signupSidebarBtn) signupSidebarBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(false); toggleSidebar(); });

    // Modal close button
    authModalCloseBtn.addEventListener('click', () => { authModal.classList.remove('active'); document.body.classList.remove('modal-open'); });
    // Close modal if clicked outside content
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    });

    // Auth form switches
    showSignupLink.addEventListener('click', (e) => { e.preventDefault(); loginFormContainer.style.display = 'none'; signupFormContainer.style.display = 'block'; });
    showLoginLink.addEventListener('click', (e) => { e.preventDefault(); loginFormContainer.style.display = 'block'; signupFormContainer.style.display = 'none'; });

    // Auth form submissions
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);

    // Logout button (in dashboard)
    logoutBtn.addEventListener('click', handleLogout);

    // Start Planning Button (on landing page)
    startPlanningBtn.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(true); });

    // Hamburger menu
    hamburgerMenu.addEventListener('click', toggleSidebar);
    sidebarCloseBtn.addEventListener('click', toggleSidebar);

    // Close sidebar if a link inside it is clicked (assuming it navigates or triggers an action)
    sidebarMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            // Give a small delay to allow navigation if it's an anchor link
            setTimeout(() => toggleSidebar(), 300);
        });
    });

    // Get Suggestions Button
    getSuggestionsBtn.addEventListener('click', handleGetSuggestions);
});

// Supabase Auth Listener (for real-time UI updates)
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session);
    updateUI();
});