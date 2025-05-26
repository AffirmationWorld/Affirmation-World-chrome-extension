document.addEventListener('DOMContentLoaded', () => {
  // Apply custom gradient colors from storage
  chrome.storage.sync.get(['gradientStart', 'gradientEnd', 'textColor'], (data) => {
    const gradientStart = data.gradientStart || '#6e8efb';
    const gradientEnd = data.gradientEnd || '#a777e3';
    const textColor = data.textColor || 'white';
    document.body.style.background = `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`;
    document.body.style.color = textColor;
    
    // Update button colors to match text color
    const buttons = document.querySelectorAll('.btn, .close-btn');
    buttons.forEach(button => {
      button.style.color = textColor;
    });
  });

  // Get the affirmation text element
  const affirmationText = document.getElementById('affirmation-text');
  if (!affirmationText) {
    console.error('Could not find affirmation-text element');
    return;
  }
  
  // Get buttons
  const closeBtn = document.querySelector('.close-btn');
  const nextBtn = document.getElementById('next-btn');
  const copyBtn = document.getElementById('copy-btn');
  
  // Get the affirmation from the URL parameters
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const affirmation = urlParams.get('affirmation');
    
    // Display the affirmation
    if (affirmation) {
      affirmationText.textContent = affirmation;
    } else {
      // If no affirmation provided, get a random one
      chrome.runtime.sendMessage({ action: 'getRandomAffirmation' }, (response) => {
        if (response && response.affirmation) {
          affirmationText.textContent = response.affirmation;
        } else {
          affirmationText.textContent = 'Believe in yourself and all that you are.';
        }
      });
    }
  } catch (error) {
    console.error('Error parsing URL parameters:', error);
    affirmationText.textContent = 'Believe in yourself and all that you are.';
  }
  
  // Close button event
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      window.close();
    });
  }
  
  // New affirmation button event
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'getRandomAffirmation' }, (response) => {
        if (response && response.affirmation) {
          // Simple fade out/fade in animation
          affirmationText.style.opacity = '0';
          
          setTimeout(() => {
            affirmationText.textContent = response.affirmation;
            affirmationText.style.opacity = '1';
          }, 300);
        }
      });
    });
  }
  
  // Copy button event
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      // Implement copy to clipboard functionality
      const text = affirmationText.textContent;
      navigator.clipboard.writeText(text).then(() => {
        // Show a brief "Copied!" message
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 1000);
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    });
  }
  
  // Auto-close after 10 seconds
  setTimeout(() => {
    try {
      window.close();
    } catch (error) {
      console.error('Could not close window:', error);
    }
  }, 10000);
  
  // Simple fade-in animation on load
  affirmationText.style.opacity = '0';
  affirmationText.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    affirmationText.style.opacity = '1';
  }, 100);
}); 