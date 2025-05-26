// Create a popup element
function createAffirmationPopup(affirmationText) {
  // Check if popup already exists and remove it
  const existingPopup = document.getElementById('affirmation-world-popup');
  if (existingPopup) {
    document.body.removeChild(existingPopup);
  }
  
  try {
    // Get gradient colors from storage
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(['gradientStart', 'gradientEnd', 'textColor'], (data) => {
        createPopupWithStyles(affirmationText, data);
      });
    } else {
      // Fallback to default styles
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
    padding: 12px;
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
    margin-bottom: 8px;
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
    margin: 8px 0;
    font-size: 16px;
    line-height: 1.3;
    font-weight: bold;
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
      console.log('Content script received message:', message);
      
      if (message.action === 'showAffirmation') {
        createAffirmationPopup(message.affirmation);
        if (sendResponse) {
          sendResponse({ success: true });
        }
        return true;
      }
    });
  } catch (error) {
    console.error('Error setting up message listener:', error);
  }
} 