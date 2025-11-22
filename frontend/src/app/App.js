// Import all the rendering modules
import { renderSidebar } from './layouts/SidebarLayout.js';
import { renderHeader } from './layouts/HeaderLayout.js';
import { initializeRouter } from './Router.js';

// Main app initialization function
function initApp() {
  // Find the container elements in the DOM
  const sidebarContainer = document.getElementById('sidebar-container');
  const headerContainer = document.getElementById('header-container');
  const mainContentContainer = document.getElementById('main-content');

  // Check if all containers exist before rendering
  if (sidebarContainer && headerContainer && mainContentContainer) {
    // Render each part of the layout
    renderSidebar(sidebarContainer);
    renderHeader(headerContainer);
    
    // Initialize the router to handle page navigation
    initializeRouter();
  } else {
    console.error('One or more layout containers are missing from the DOM.');
  }
}

// Wait for the DOM to be fully loaded before running the app
document.addEventListener('DOMContentLoaded', initApp);
