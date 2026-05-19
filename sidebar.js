class SidebarMenu extends HTMLElement {
  connectedCallback() {
    // 1. ALL YOUR CSS AND HTML COMBINED HERE
    this.innerHTML = `
      <style>
        .hamburger-btn {
          font-size: 28px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 15px;
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 10;
          color: #333;
        }
        .sidebar {
          position: fixed;
          top: 0;
          left: -280px;
          width: 260px;
          height: 100%;
          background-color: #ffffff;
          box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
          transition: left 0.3s ease-in-out;
          z-index: 1000;
          padding: 20px;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }
        .sidebar.active {
          left: 0;
        }
        .close-btn {
          position: absolute;
          top: 15px;
          right: 20px;
          font-size: 32px;
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
        }
        .sidebar-logo {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 40px;
          margin-top: 20px;
          color: #00bcd4;
        }
        .sidebar-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .sidebar-links li a {
          display: block;
          padding: 12px 10px;
          color: #333;
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 500;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.2s;
        }
        .sidebar-links li a:hover {
          background-color: #f9f9f9;
          color: #00bcd4;
        }
        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          z-index: 999;
        }
        .sidebar-overlay.active {
          display: block;
          }
      </style>

      <button class="hamburger-btn" id="nav-toggle">&#9776;</button>
      
      <nav class="sidebar" id="sidebar-menu">
        <button class="close-btn" id="nav-close">&times;</button>
        <div class="sidebar-logo">My Site</div>
        <ul class="sidebar-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </nav>

      <div class="sidebar-overlay" id="menu-overlay"></div>
    `;

    // 2. ALL YOUR JAVASCRIPT CLICK LOGIC HERE
    const navToggle = this.querySelector('#nav-toggle');
    const navClose = this.querySelector('#nav-close');
    const sidebarMenu = this.querySelector('#sidebar-menu');
    const menuOverlay = this.querySelector('#menu-overlay');

    navToggle.addEventListener('click', () => {
      sidebarMenu.classList.add('active');
      menuOverlay.classList.add('active');
    });

    const closeMenu = () => {
      sidebarMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
    };

    navClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);
  }
}

// Registering our custom HTML tag
customElements.define('sidebar-menu', SidebarMenu);
