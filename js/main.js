/* --- VARIABLES --- */
let isLoggedIn = false;
let userRole = 'student'; // 'student' or 'teacher'
let userName = '';

// UI Elements
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const loginModalOverlay = document.getElementById('modalOverlay');
const loginForm = document.getElementById('loginForm');
const closeLoginBtn = document.getElementById('closeLogin');

// Views
const publicView = document.getElementById('publicView');
const dashboardView = document.getElementById('dashboardView');

// Header Items
const headerLoginBtn = document.getElementById('headerLoginBtn');
const userProfileDisplay = document.getElementById('userProfileDisplay');
const userNameDisplay = document.getElementById('userNameDisplay');
const menuLoginItem = document.getElementById('menuLoginItem');
const menuLogoutItem = document.getElementById('menuLogoutItem');

// Dashboard Elements
const dashWelcome = document.getElementById('dashWelcome');
const dashRole = document.getElementById('dashRole');
const teacherControls = document.getElementById('teacherControls');

/* --- 1. SIDEBAR NAVIGATION --- */

function toggleSidebar() {
  sidebar.classList.toggle('open');
  sidebarOverlay.classList.toggle('active');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
}

// Handle standard navigation
function handleNav(viewId) {
  closeSidebar();
  switchView(viewId);
}

// Handle navigation that requires login
function handleNavProtected(viewId) {
  closeSidebar();
  if (isLoggedIn) {
    switchView(viewId);
  } else {
    // Small delay to allow sidebar to close first
    setTimeout(() => {
      alert("🔒 Restricted Access: Please log in to view the Dashboard.");
      openLoginModal('student');
    }, 300);
  }
}

function switchView(viewId) {
  // Hide all
  publicView.classList.add('hidden');
  publicView.classList.remove('active');
  dashboardView.classList.add('hidden');
  dashboardView.classList.remove('active');

  // Show Selected
  const target = document.getElementById(viewId);
  target.classList.remove('hidden');
  // Small timeout to allow 'display: block' to apply before adding active class for animation
  setTimeout(() => {
    target.classList.add('active');
    window.scrollTo(0,0);
  }, 10);
}


/* --- 2. LOGIN LOGIC --- */

function openLoginModal(role) {
  loginModalOverlay.classList.add('active');
  switchTab(role);
}

function switchTab(role) {
  userRole = role;
  const tabStudent = document.getElementById('tabStudent');
  const tabTeacher = document.getElementById('tabTeacher');
  const loginTitle = document.getElementById('loginTitle');
  const usernameInput = document.getElementById('usernameInput');

  if (role === 'student') {
    tabStudent.classList.add('active');
    tabTeacher.classList.remove('active');
    loginTitle.innerText = "Student Login";
    usernameInput.placeholder = "Enter Roll Number";
  } else {
    tabTeacher.classList.add('active');
    tabStudent.classList.remove('active');
    loginTitle.innerText = "Teacher Login";
    usernameInput.placeholder = "Enter Employee ID";
  }
}

// Close Button Event
if(closeLoginBtn) {
    closeLoginBtn.addEventListener('click', () => {
        loginModalOverlay.classList.remove('active');
    });
}

// Close modal if clicked outside
if(loginModalOverlay) {
    loginModalOverlay.addEventListener('click', (e) => {
        if(e.target === loginModalOverlay) {
            loginModalOverlay.classList.remove('active');
        }
    });
}

// Handle Login Submit
if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const idInput = document.getElementById('usernameInput').value;

        // SIMULATED AUTH
        isLoggedIn = true;
        userName = userRole === 'student' ? "Student " + idInput : "Prof. " + idInput;

        updateUIForLogin();
        loginModalOverlay.classList.remove('active');
        switchView('dashboardView');
        
        // Reset form
        document.getElementById('usernameInput').value = '';
    });
}

function handleLogout() {
  const confirmLogout = confirm("Are you sure you want to logout?");
  if(!confirmLogout) return;

  isLoggedIn = false;
  userRole = 'student';
  userName = '';
  
  updateUIForLogout();
  switchView('publicView');
  closeSidebar();
}

/* --- 3. UI UPDATES --- */

function updateUIForLogin() {
  headerLoginBtn.classList.add('hidden');
  userProfileDisplay.classList.remove('hidden');
  userNameDisplay.innerText = userName;

  menuLoginItem.classList.add('hidden');
  menuLogoutItem.classList.remove('hidden');

  dashWelcome.innerText = "Welcome, " + userName;
  dashRole.innerText = userRole === 'teacher' ? "Faculty Member" : "Student";

  if (userRole === 'teacher') {
    teacherControls.classList.remove('hidden');
  } else {
    teacherControls.classList.add('hidden');
  }
}

function updateUIForLogout() {
  headerLoginBtn.classList.remove('hidden');
  userProfileDisplay.classList.add('hidden');
  menuLoginItem.classList.remove('hidden');
  menuLogoutItem.classList.add('hidden');
}

/* --- 4. CHATBOT LOGIC --- */
function toggleChat() {
  const chatWindow = document.getElementById('chatWindow');
  chatWindow.classList.toggle('hidden');
}

// Enter key to send
const chatInput = document.getElementById('chatInput');
if(chatInput) {
    chatInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  const chatBody = document.getElementById('chatBody');
  const userText = input.value.trim();

  if (userText === "") return;

  // 1. Display User Message
  const userDiv = document.createElement('div');
  userDiv.className = 'user_msg';
  userDiv.innerText = userText;
  chatBody.appendChild(userDiv);
  input.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;

  // 2. Determine Bot Response
  setTimeout(() => {
    const botDiv = document.createElement('div');
    botDiv.className = 'bot_msg';
    
    const response = getBotResponse(userText);
    botDiv.innerHTML = response; 
    
    chatBody.appendChild(botDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600); 
}

// Knowledge Base
function getBotResponse(input) {
    const text = input.toLowerCase();

    // Greeting
    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
        return "Hello there! Welcome to the Student Resource Portal. How can I help you today?";
    }
    
    // Notes
    if (text.includes("note") || text.includes("pdf") || text.includes("material")) {
        if(isLoggedIn) {
            return "Since you are logged in, navigate to the <b>Dashboard</b> section to download your subject notes.";
        } else {
            return "To access class notes and PDFs, you need to <b>Log In</b> first using the button in the top right corner.";
        }
    }

    // Syllabus
    if (text.includes("syllabus")) {
        return "The latest syllabus for 2026 is available in the 'Public Info' section under Departments.";
    }

    // Exams
    if (text.includes("exam") || text.includes("test") || text.includes("schedule")) {
        return "Mid-semester exams are scheduled to begin on <b>January 20th</b>. Check the Notice Board for details.";
    }

    // Attendance
    if (text.includes("attendance")) {
        return "You can check your current attendance percentage on your Student Dashboard.";
    }

    // Admissions
    if (text.includes("admission") || text.includes("apply") || text.includes("join")) {
        return "Admissions for the 2026-27 session are currently open. Please visit the college administration office.";
    }

    // Contact
    if (text.includes("contact") || text.includes("support") || text.includes("help")) {
        return "You can reach the student helpdesk at <b>support@kkcm.edu</b> or call us at +91-1234567890.";
    }

    // Default
    return "I'm not sure about that. Try asking about <b>Notes, Exams, Admissions,</b> or <b>Attendance</b>.";
}
