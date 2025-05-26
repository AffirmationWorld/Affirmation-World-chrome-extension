// Create a popup element
function createAffirmationPopup(affirmationText) {
  // Check if popup already exists and remove it
  const existingPopup = document.getElementById('affirmation-world-popup');
  if (existingPopup) {
    document.body.removeChild(existingPopup);
  }
  
  // Get gradient colors from storage or use defaults
  try {
    // Try to access chrome.storage.sync
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(['gradientStart', 'gradientEnd', 'textColor'], (data) => {
        createPopupWithStyles(affirmationText, data);
      });
    } else {
      // Fallback to default styles if chrome API is not available
      createPopupWithStyles(affirmationText, {});
    }
  } catch (error) {
    console.error('Error accessing chrome storage:', error);
    // Fallback to default styles
    createPopupWithStyles(affirmationText, {});
  }
}

// Helper function to create popup with given styles
function createPopupWithStyles(affirmationText, data) {
  const gradientStart = data.gradientStart || '#6e8efb';
  const gradientEnd = data.gradientEnd || '#a777e3';
  const textColor = data.textColor || 'white';
  
  // Create container
  const popupContainer = document.createElement('div');
  popupContainer.id = 'affirmation-world-popup';
  popupContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    background: linear-gradient(135deg, ${gradientStart}, ${gradientEnd});
    color: ${textColor};
    padding: 8px;
    border-radius: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 9999999;
    font-family: "Courier New", monospace;
    transition: opacity 0.3s ease;
    opacity: 0;
  `;
  
  // Create header
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  `;
  
  // Create title
  const title = document.createElement('div');
  title.textContent = 'Affirmation World';
  title.style.cssText = `
    font-weight: bold;
    font-size: 16px;
    font-family: "Courier New", monospace;
  `;
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.style.cssText = `
    background: none;
    border: none;
    color: ${textColor};
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    font-family: "Courier New", monospace;
  `;
  closeButton.addEventListener('click', () => {
    popupContainer.style.opacity = '0';
    setTimeout(() => {
      if (document.body.contains(popupContainer)) {
        document.body.removeChild(popupContainer);
      }
    }, 300);
  });
  
  // Add title and close button to header
  header.appendChild(title);
  header.appendChild(closeButton);
  
  // Create affirmation text
  const affirmationElement = document.createElement('div');
  affirmationElement.textContent = affirmationText;
  affirmationElement.style.cssText = `
    margin: 4px 0;
    font-size: 18px;
    font-weight: bold;
    line-height: 1.2;
    font-family: "Courier New", monospace;
  `;
  
  // Add all elements to container
  popupContainer.appendChild(header);
  popupContainer.appendChild(affirmationElement);
  
  // Add to page
  document.body.appendChild(popupContainer);
  
  // Fade in
  setTimeout(() => {
    popupContainer.style.opacity = '1';
  }, 10);
  
  // Auto-close after 10 seconds
  setTimeout(() => {
    popupContainer.style.opacity = '0';
    setTimeout(() => {
      if (document.body.contains(popupContainer)) {
        document.body.removeChild(popupContainer);
      }
    }, 300);
  }, 10000);
}

// Listen for messages from the background script
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  try {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'showAffirmation') {
        createAffirmationPopup(message.affirmation);
        sendResponse({ success: true });
        return true;
      }
    });
  } catch (error) {
    console.error('Error setting up message listener:', error);
  }
}

// If this script is loaded directly with a URL parameter, show the affirmation
try {
  const urlParams = new URLSearchParams(window.location.search);
  const affirmation = urlParams.get('affirmation');

  // Wait for the DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadAffirmation(affirmation);
    });
  } else {
    // DOM already loaded, execute immediately
    loadAffirmation(affirmation);
  }
} catch (error) {
  console.error('Error processing URL parameters:', error);
  // Fallback to default affirmation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createAffirmationPopup("I am becoming the best version of myself.");
    });
  } else {
    createAffirmationPopup("I am becoming the best version of myself.");
  }
}

// Helper function to load affirmation with storage
function loadAffirmation(affirmation) {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    // Make sure storage is synced before showing the affirmation
    chrome.storage.sync.get(['gradientStart', 'gradientEnd', 'textColor'], () => {
      if (affirmation) {
        createAffirmationPopup(affirmation);
      } else {
        createAffirmationPopup("I am becoming the best version of myself.");
      }
    });
  } else {
    // Fallback if chrome storage API is not available
    if (affirmation) {
      createAffirmationPopup(affirmation);
    } else {
      createAffirmationPopup("I am becoming the best version of myself.");
    }
  }
} 