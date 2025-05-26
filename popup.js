document.addEventListener('DOMContentLoaded', () => {
  try {
    // Check if there's a stored affirmation first
    chrome.storage.local.get(['currentAffirmation'], (data) => {
      const affirmationElement = document.getElementById('currentAffirmation');
      if (!affirmationElement) {
        console.error('Could not find currentAffirmation element');
        return;
      }
      
      if (data.currentAffirmation) {
        // Display the stored affirmation
        affirmationElement.textContent = data.currentAffirmation;
        // Clear it after displaying
        chrome.storage.local.remove('currentAffirmation');
        // Add a special highlight effect for new affirmations
        highlightNewAffirmation();
      } else {
        // No stored affirmation, display a random one
        displayRandomAffirmation();
      }
    });
    
    // Set up event listeners
    const newAffirmationBtn = document.getElementById('newAffirmation');
    if (newAffirmationBtn) {
      newAffirmationBtn.addEventListener('click', () => {
        // Add fade-out animation before changing text
        const affirmationElement = document.getElementById('currentAffirmation');
        if (affirmationElement) {
          affirmationElement.style.opacity = '0';
          
          // After animation completes, get new affirmation
          setTimeout(() => {
            displayRandomAffirmation();
          }, 300);
        }
      });
    }
    
    const optionsButton = document.getElementById('optionsButton');
    if (optionsButton) {
      optionsButton.addEventListener('click', openOptionsPage);
    }
    
    // Set up toggle switch
    const enableToggle = document.getElementById('enableToggle');
    
    if (enableToggle) {
      // Load current state
      chrome.storage.sync.get(['enabled'], (data) => {
        try {
          // Enable toggle
          enableToggle.checked = data.enabled !== false;
          
          // Update the toggle tooltip based on state
          updateToggleTooltip(enableToggle.checked);
        } catch (error) {
          console.error('Error setting toggle state:', error);
        }
      });
      
      // Save state when changed
      enableToggle.addEventListener('change', () => {
        try {
          chrome.storage.sync.set({ enabled: enableToggle.checked });
          updateToggleTooltip(enableToggle.checked);
        } catch (error) {
          console.error('Error saving toggle state:', error);
        }
      });
    }
  } catch (error) {
    console.error('Error in popup initialization:', error);
  }
});

/**
 * Display a random affirmation in the popup
 */
function displayRandomAffirmation() {
  const affirmationElement = document.getElementById('currentAffirmation');
  if (!affirmationElement) {
    console.error('Could not find currentAffirmation element');
    return;
  }
  
  // Get a random affirmation by messaging the background script
  chrome.runtime.sendMessage({ action: 'getRandomAffirmation' }, (response) => {
    if (response && response.affirmation) {
      affirmationElement.textContent = response.affirmation;
    } else {
      affirmationElement.textContent = "I am becoming the best version of myself.";
    }
    
    // Fade in the new affirmation
    setTimeout(() => {
      affirmationElement.style.opacity = '1';
    }, 50);
  });
}

/**
 * Open the options page
 */
function openOptionsPage() {
  try {
    chrome.runtime.openOptionsPage();
  } catch (error) {
    console.error('Could not open options page:', error);
  }
}

/**
 * Update the toggle tooltip based on state
 */
function updateToggleTooltip(isEnabled) {
  const toggleContainer = document.querySelector('.toggle-container');
  if (toggleContainer) {
    toggleContainer.title = isEnabled ? 'Affirmations enabled' : 'Affirmations disabled';
  }
}

/**
 * Adds a visual highlight effect to indicate a new affirmation
 */
function highlightNewAffirmation() {
  const content = document.querySelector('.content');
  if (content) {
    content.classList.add('highlight-new');
    
    // Remove the highlight effect after animation completes
    setTimeout(() => {
      content.classList.remove('highlight-new');
    }, 1500);
  }
} 