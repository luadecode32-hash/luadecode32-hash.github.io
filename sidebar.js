class SidebarMenu extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        /* The Hamburger Toggle Button */
        .hamburger-btn {
          font-size: 28px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 15px;
          position: relative; /* Changed from absolute to play nice with your top-bar */
          z-index: 1001;
          color: #fff; /* Changed to white so it stands out on dark headers */
          display: inline-block;
          vertical-align: middle;
        }
        
        /* The Navigation Sidebar Box */
        .sidebar {
          position: fixed;
          top: 0;
          left: -280px;
          width: 260px;
          height: 100%;
          background-color: #ffffff;
          box-shadow: 4px 0 10px rgba(0, 0, 0, 0.3);
          transition: left 0.3s ease-in-out;
          z-index: 99999; /* Super high so nothing overlaps it */
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
        
        /* Translucent dim overlay behind the open sidebar */
        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99998; /* Right below the sidebar */
        }
        
        .sidebar-overlay.active {
          display: block;
        }
      </style>

      <button class="hamburger-btn" id="nav-toggle">&#9776;</button>
      
      <nav class="sidebar" id="sidebar-menu">
        <button class="close-btn" id="nav-close">&times;</button>
        <div class="sidebar-logo">ANDROID ARENA</div>
        <ul class="sidebar-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="polls.html">Live Polls</a></li>
          <li><a href="#">Coding</a></li>
          <li><a href="#">Modding</a></li>
        </ul>
      </nav>

      <div class="sidebar-overlay" id="menu-overlay"></div>
    `;

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

customElements.define('sidebar-menu', SidebarMenu);
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
