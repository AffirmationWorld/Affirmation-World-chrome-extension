document.addEventListener('DOMContentLoaded', () => {
  // Set up toggle switches
  const scheduleTypeSelect = document.getElementById('scheduleType');
  
  // Load current state
  chrome.storage.sync.get(['enabled', 'scheduleType', 'intervalMinutes', 'scheduledTimes', 'gradientStart', 'gradientEnd', 'textColor'], (data) => {
    // Enable toggle removed from HTML, but keep the enabled state in storage
    const isEnabled = data.enabled !== false;
    
    // Schedule type
    const scheduleType = data.scheduleType || 'interval';
    scheduleTypeSelect.value = scheduleType;
    toggleScheduleOptions(scheduleType);
    
    // Interval minutes
    const intervalMinutes = data.intervalMinutes || 60;
    document.getElementById('intervalMinutes').value = intervalMinutes;
    
    // Scheduled times
    if (data.scheduledTimes && data.scheduledTimes.length > 0) {
      displayScheduledTimes(data.scheduledTimes);
    }
    
    // Gradient colors
    const gradientStart = data.gradientStart || '#6e8efb';
    const gradientEnd = data.gradientEnd || '#a777e3';
    const textColor = data.textColor || 'white';
    document.getElementById('gradientStart').value = gradientStart;
    document.getElementById('gradientEnd').value = gradientEnd;
    document.getElementById('textColor').value = textColor;
    updateGradientPreview(gradientStart, gradientEnd, textColor);
  });
  
  // Handle schedule type changes
  scheduleTypeSelect.addEventListener('change', () => {
    const scheduleType = scheduleTypeSelect.value;
    toggleScheduleOptions(scheduleType);
    chrome.storage.sync.set({ scheduleType: scheduleType });
  });
  
  // Save interval button
  document.getElementById('saveIntervalButton').addEventListener('click', () => {
    const intervalMinutes = parseInt(document.getElementById('intervalMinutes').value);
    if (intervalMinutes >= 1 && intervalMinutes <= 1440) {
      chrome.storage.sync.set({ intervalMinutes: intervalMinutes });
      chrome.runtime.sendMessage({ 
        action: 'updateSchedule', 
        scheduleType: 'interval',
        intervalMinutes: intervalMinutes
      });
      showMessage('Interval saved successfully!');
    } else {
      showMessage('Please enter a valid interval between 1 and 1440 minutes.');
    }
  });
  
  // Add time button
  document.getElementById('addTimeButton').addEventListener('click', () => {
    const timeInput = document.getElementById('specificTime');
    if (timeInput.value) {
      chrome.storage.sync.get('scheduledTimes', (data) => {
        const scheduledTimes = data.scheduledTimes || [];
        if (!scheduledTimes.includes(timeInput.value)) {
          scheduledTimes.push(timeInput.value);
          scheduledTimes.sort();
          chrome.storage.sync.set({ scheduledTimes: scheduledTimes });
          chrome.runtime.sendMessage({ 
            action: 'updateSchedule', 
            scheduleType: 'specificTime',
            scheduledTimes: scheduledTimes
          });
          displayScheduledTimes(scheduledTimes);
          timeInput.value = '';
          showMessage('Time added successfully!');
        } else {
          showMessage('This time is already scheduled.');
        }
      });
    }
  });
  
  // Gradient color inputs
  document.getElementById('gradientStart').addEventListener('input', function() {
    updateGradientPreview(this.value, document.getElementById('gradientEnd').value, document.getElementById('textColor').value);
  });
  
  document.getElementById('gradientEnd').addEventListener('input', function() {
    updateGradientPreview(document.getElementById('gradientStart').value, this.value, document.getElementById('textColor').value);
  });
  
  document.getElementById('textColor').addEventListener('change', function() {
    updateGradientPreview(document.getElementById('gradientStart').value, document.getElementById('gradientEnd').value, this.value);
  });
  
  // Save gradient button
  document.getElementById('saveGradientButton').addEventListener('click', () => {
    const gradientStart = document.getElementById('gradientStart').value;
    const gradientEnd = document.getElementById('gradientEnd').value;
    const textColor = document.getElementById('textColor').value;
    
    chrome.storage.sync.set({ 
      gradientStart: gradientStart,
      gradientEnd: gradientEnd,
      textColor: textColor
    });
    
    showMessage('Appearance settings saved successfully!');
  });
  
  // Set up test buttons
  document.getElementById('testBrowserButton').addEventListener('click', showTestBrowserDisplay);
});

/**
 * Toggle between interval and specific time options
 */
function toggleScheduleOptions(scheduleType) {
  const intervalOptions = document.getElementById('intervalOptions');
  const specificTimeOptions = document.getElementById('specificTimeOptions');
  
  if (scheduleType === 'interval') {
    intervalOptions.style.display = 'block';
    specificTimeOptions.style.display = 'none';
  } else {
    intervalOptions.style.display = 'none';
    specificTimeOptions.style.display = 'block';
  }
}

/**
 * Display scheduled times in the UI
 */
function displayScheduledTimes(times) {
  const scheduleList = document.getElementById('scheduleList');
  scheduleList.innerHTML = '';
  
  if (times.length === 0) {
    scheduleList.innerHTML = '<p>No times scheduled yet.</p>';
    return;
  }
  
  times.forEach(time => {
    const item = document.createElement('div');
    item.className = 'schedule-item';
    
    const timeText = document.createElement('span');
    timeText.textContent = formatTime(time);
    item.appendChild(timeText);
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Remove';
    deleteButton.addEventListener('click', () => removeScheduledTime(time));
    item.appendChild(deleteButton);
    
    scheduleList.appendChild(item);
  });
}

/**
 * Format time for display
 */
function formatTime(timeString) {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours));
  date.setMinutes(parseInt(minutes));
  
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Remove a scheduled time
 */
function removeScheduledTime(time) {
  chrome.storage.sync.get('scheduledTimes', (data) => {
    let scheduledTimes = data.scheduledTimes || [];
    scheduledTimes = scheduledTimes.filter(t => t !== time);
    
    chrome.storage.sync.set({ scheduledTimes: scheduledTimes });
    chrome.runtime.sendMessage({ 
      action: 'updateSchedule', 
      scheduleType: 'specificTime',
      scheduledTimes: scheduledTimes
    });
    
    displayScheduledTimes(scheduledTimes);
    showMessage('Time removed successfully!');
  });
}

/**
 * Helper function to check if a URL is a browser internal page
 */
function isBrowserInternalPage(url) {
  if (!url) return true;
  
  return url.startsWith('chrome://') || 
         url.startsWith('chrome-extension://') || 
         url.startsWith('chrome-search://') ||
         url.startsWith('devtools://') ||
         url.startsWith('edge://') ||
         url.startsWith('brave://') ||
         url.startsWith('about:') ||
         url.startsWith('moz-extension://') ||
         url.startsWith('mozilla://') ||
         url.startsWith('firefox://') ||
         url.startsWith('view-source:') ||
         url.startsWith('vivaldi://') ||
         url.startsWith('opera://');
}

/**
 * Show a test browser popup with a random affirmation
 */
function showTestBrowserDisplay() {
  chrome.runtime.sendMessage({ action: 'getRandomAffirmation' }, (response) => {
    if (response && response.affirmation) {
      // Find all tabs, not just the active one
      chrome.tabs.query({}, function(tabs) {
        // Filter out extension tabs and special pages
        const regularTabs = tabs.filter(tab => 
          tab.url && !isBrowserInternalPage(tab.url)
        );
        
        if (regularTabs.length > 0) {
          // Use the first regular tab found
          const targetTab = regularTabs[0];
          
          // Try to send message to the content script
          try {
            const sendPromise = chrome.tabs.sendMessage(targetTab.id, {
              action: 'showAffirmation',
              affirmation: response.affirmation
            });
            
            // Handle both Promise and callback-style implementations
            if (sendPromise && typeof sendPromise.then === 'function') {
              sendPromise.then(response => {
                showMessage(`Affirmation displayed in tab: ${targetTab.title}`);
              }).catch(error => {
                console.log('Content script not ready, trying direct injection');
                injectDirectlyForTest(targetTab.id, response.affirmation);
              });
            }
          } catch (error) {
            console.log('Error sending message, trying direct injection:', error);
            injectDirectlyForTest(targetTab.id, response.affirmation);
          }
        } else {
          showMessage('No regular web page tabs found. Please open a webpage in another tab first.');
        }
      });
    }
  });
}

/**
 * Helper function to inject script directly for testing
 */
function injectDirectlyForTest(tabId, affirmation) {
  try {
    chrome.scripting.executeScript({
      target: {tabId: tabId},
      function: injectAffirmation,
      args: [affirmation]
    }).then(() => {
      showMessage(`Affirmation displayed in tab successfully`);
    }).catch(error => {
      console.error('Error injecting affirmation:', error);
      showMessage('Could not display affirmation. Please ensure you have a regular web page open in another tab.');
    });
  } catch (error) {
    console.error('Exception injecting script:', error);
    showMessage('Could not display affirmation due to a browser compatibility issue. Try refreshing your tab first.');
  }
}

/**
 * Function to inject an affirmation directly into the page
 */
function injectAffirmation(affirmation) {
  // Check if popup already exists and remove it
  const existingPopup = document.getElementById('affirmation-world-popup');
  if (existingPopup) {
    document.body.removeChild(existingPopup);
  }
  
  // Get gradient colors from storage
  chrome.storage.sync.get(['gradientStart', 'gradientEnd', 'textColor'], (data) => {
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
      padding: 15px;
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
      margin-bottom: 10px;
    `;
    
    // Create title
    const title = document.createElement('div');
    title.textContent = 'Affirmation World';
    title.style.cssText = `
      font-weight: bold;
      font-size: 16px;
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
    affirmationElement.textContent = affirmation;
    affirmationElement.style.cssText = `
      margin: 10px 0;
      font-size: 20px;
      font-weight: bold;
      line-height: 1.4;
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
  });
}

/**
 * Show a message to the user
 */
function showMessage(message) {
  // Check if a message element already exists
  let messageElement = document.getElementById('statusMessage');
  
  if (!messageElement) {
    // Create a new message element
    messageElement = document.createElement('div');
    messageElement.id = 'statusMessage';
    messageElement.style.position = 'fixed';
    messageElement.style.top = '20px';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translateX(-50%)';
    messageElement.style.backgroundColor = '#4285f4';
    messageElement.style.color = 'white';
    messageElement.style.padding = '10px 20px';
    messageElement.style.borderRadius = '4px';
    messageElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    messageElement.style.zIndex = '1000';
    document.body.appendChild(messageElement);
  }
  
  // Set the message text
  messageElement.textContent = message;
  
  // Show the message
  messageElement.style.display = 'block';
  
  // Hide the message after 3 seconds
  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 3000);
}

/**
 * Update the gradient preview with selected colors
 */
function updateGradientPreview(startColor, endColor, textColor) {
  const preview = document.getElementById('gradientPreview');
  preview.style.background = `linear-gradient(135deg, ${startColor}, ${endColor})`;
  
  // Clear previous content
  preview.innerHTML = '';
  
  // Add sample text to preview
  const sampleText = document.createElement('div');
  sampleText.textContent = 'Sample Affirmation Text';
  sampleText.style.cssText = `
    color: ${textColor};
    font-family: "Courier New", monospace;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  `;
  
  preview.appendChild(sampleText);
} 