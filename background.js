// List of motivational affirmations
const affirmations = [
  "I am capable of achieving anything I set my mind to.",
  "I am worthy of success and happiness.",
  "I embrace challenges as opportunities for growth.",
  "My potential is limitless.",
  "I trust my intuition and make wise decisions.",
  "I am becoming the best version of myself.",
  "I radiate confidence, self-respect, and inner harmony.",
  "I am in charge of how I feel, and today I choose happiness.",
  "I am grateful for everything I have in my life.",
  "My positive thoughts create positive outcomes.",
  "I am resilient and can overcome any obstacle.",
  "I celebrate my achievements, both big and small.",
  "I attract abundance and prosperity.",
  "I am surrounded by positive energy.",
  "I believe in myself and my abilities.",
  "I am deserving of love and respect.",
  "I am focused and productive.",
  "I turn obstacles into stepping stones.",
  "I am constantly growing and evolving.",
  "I am enough just as I am.",
  "My life is filled with endless possibilities.",
  "I am at peace with my past and excited about my future.",
  "I am in the process of becoming the best version of myself.",
  "I have the power to create change in my life.",
  "I am aligned with my purpose and passion.",
  "I am grateful for the abundance that exists in my life.",
  "I release all negativity and embrace positivity.",
  "I am strong, confident, and capable.",
  "I am worthy of all the good things that happen in my life.",
  "I am in control of my thoughts and emotions.",
  "I am surrounded by love and support.",
  "I am making a difference in this world.",
  "I am committed to my personal growth and development.",
  "I am attracting positive people and experiences into my life.",
  "I am deserving of my dreams and goals.",
  "I am proud of myself and all that I have accomplished.",
  "I am open to receiving everything life has to offer.",
  "I am whole and complete exactly as I am.",
  "I am creating the life of my dreams.",
  "I am filled with creativity and inspiration.",
  "I am capable of overcoming any challenge that comes my way.",
  "I am grateful for my body and all that it does for me.",
  "I am living in alignment with my highest values.",
  "I am deserving of rest and self-care.",
  "I am letting go of all that no longer serves me.",
  "I am trusting the timing of my life.",
  "I am worthy of love and belonging.",
  "I am open to receiving guidance from the universe.",
  "I am creating healthy boundaries in my relationships.",
  "I am choosing thoughts that empower me.",
  "I am at peace with who I am.",
  "I am proud of the person I am becoming.",
  "I am grateful for this present moment.",
  "I am releasing the need for perfection.",
  "I am worthy of my own love and affection.",
  "I am choosing to see the beauty in today.",
  "I am deserving of my own compassion and forgiveness.",
  "I am embracing my authentic self.",
  "I am allowing abundance to flow freely in my life.",
  "I am grateful for the lessons that challenges bring.",
  "I am living with intention and purpose.",
  "I am worthy of success and prosperity.",
  "I am becoming more confident and stronger each day.",
  "I am creating positive changes in my life.",
  "I am capable of making difficult decisions.",
  "I am allowing myself to grow at my own pace.",
  "I am attracting opportunities that align with my goals.",
  "I am worthy of respect and acceptance.",
  "I am releasing all doubts.",
  "I am grateful for the support I receive from others.",
  "I am creating a life filled with joy and meaning.",
  "I am choosing to focus on what I can control.",
  "I am deserving of peace and tranquility.",
  "I am open to receiving guidance and wisdom.",
  "I am proud of my resilience and strength.",
  "I am creating a positive impact on the world.",
  "I am worthy of celebrating my progress.",
  "I am embracing all aspects of myself with love.",
  "I am grateful for the abundance of opportunities before me.",
  "I am capable of creating the change I wish to see.",
  "I am deserving of time to rest and recharge.",
  "I am embracing my unique gifts and talents.",
  "I am trusting my journey, even when I don't understand it.",
  "I am worthy of my dreams and aspirations.",
  "I am creating a life that aligns with my values.",
  "I am grateful for the beauty that surrounds me.",
  "I am capable of handling whatever comes my way.",
  "I am allowing myself to be fully present in this moment.",
  "I am deserving of all good things that come to me.",
  "I am releasing comparison and embracing my unique path.",
  "I forgive myself for my mistakes."
];

// Store active alarms
let activeAlarms = {};

/**
 * Returns a random affirmation from the list
 * @returns {string} A random affirmation
 */
function getRandomAffirmation() {
  const randomIndex = Math.floor(Math.random() * affirmations.length);
  return affirmations[randomIndex];
}

/**
 * Returns the complete list of affirmations
 * @returns {string[]} The list of affirmations
 */
function getAllAffirmations() {
  return [...affirmations];
}

// Initialize when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed or updated');
  
  // Set default settings
  chrome.storage.sync.get(['enabled', 'browserDisplay', 'scheduleType', 'intervalMinutes', 'scheduledTimes'], (data) => {
    // Set defaults if not already set
    const defaults = {
      enabled: data.enabled !== false ? true : data.enabled,
      browserDisplay: data.browserDisplay !== undefined ? data.browserDisplay : false,
      scheduleType: data.scheduleType || 'interval',
      intervalMinutes: data.intervalMinutes || 60,
      scheduledTimes: data.scheduledTimes || []
    };
    
    chrome.storage.sync.set(defaults, () => {
      console.log('Default settings initialized:', defaults);
      
      // Initialize scheduling based on defaults
      if (defaults.enabled) {
        setupScheduling(defaults.scheduleType, defaults.intervalMinutes, defaults.scheduledTimes);
      }
    });
  });
});

// Show affirmation based on display preference
function showAffirmation() {
  const affirmation = getRandomAffirmation();
  console.log('Showing affirmation:', affirmation);
  
  // Always use browser display
  showBrowserAffirmation(affirmation);
}

// Listen for alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('Alarm triggered:', alarm.name);
  
  if (alarm.name.startsWith('affirmation_')) {
    chrome.storage.sync.get(['enabled'], (data) => {
      console.log('Checking if affirmations are enabled:', data.enabled);
      
      if (data.enabled) {
        showAffirmation();
      }
    });
  }
});

/**
 * Set up scheduling based on the selected type
 */
function setupScheduling(scheduleType, intervalMinutes, scheduledTimes) {
  // Clear all existing alarms first
  chrome.alarms.clearAll(() => {
    console.log('All alarms cleared');
    
    if (scheduleType === 'interval') {
      // Create interval-based alarm
      chrome.alarms.create('affirmation_interval', {
        periodInMinutes: intervalMinutes
      });
      console.log(`Interval alarm created with ${intervalMinutes} minute interval`);
    } else if (scheduleType === 'specificTime') {
      // Create alarms for specific times
      setupSpecificTimeAlarms(scheduledTimes);
    }
  });
}

/**
 * Set up alarms for specific times
 */
function setupSpecificTimeAlarms(times) {
  // Clear active alarms tracking
  activeAlarms = {};
  
  if (!times || times.length === 0) {
    console.log('No specific times to schedule');
    return;
  }
  
  console.log('Setting up alarms for specific times:', times);
  
  times.forEach(timeString => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const now = new Date();
    
    // Create a date object for today at the specified time
    const alarmTime = new Date();
    alarmTime.setHours(hours, minutes, 0, 0);
    
    // If the time has already passed today, schedule for tomorrow
    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }
    
    // Calculate delay in minutes
    const delayInMinutes = (alarmTime - now) / (1000 * 60);
    
    // Create the alarm
    const alarmName = `affirmation_time_${hours}_${minutes}`;
    chrome.alarms.create(alarmName, {
      delayInMinutes: delayInMinutes,
      periodInMinutes: 24 * 60 // Repeat daily
    });
    
    // Track active alarm
    activeAlarms[alarmName] = timeString;
    
    console.log(`Alarm created for ${timeString}, delay: ${delayInMinutes.toFixed(2)} minutes`);
  });
}

// Check if the URL is a browser internal page
function isBrowserInternalPage(url) {
  if (!url) return true;
  
  // Chrome/Edge internal pages
  if (url.startsWith('chrome:') || 
      url.startsWith('chrome-extension:') ||
      url.startsWith('edge:') || 
      url.startsWith('devtools:')) {
    return true;
  }
  
  // Firefox internal pages
  if (url.startsWith('about:') || 
      url.startsWith('moz-extension:')) {
    return true;
  }
  
  // Safari internal pages
  if (url.startsWith('safari:') || 
      url.startsWith('safari-extension:')) {
    return true;
  }
  
  return false;
}

// Check if a page has a strict CSP based on its URL
function hasSiteStrictCSP(url) {
  try {
    if (!url) return false;
    const hostname = new URL(url).hostname;
    
    // List of domains known to use strict CSPs
    const strictCSPDomains = [
      'google.com', 'gmail.com', 'youtube.com',
      'github.com', 'github.io',
      'twitter.com', 'x.com',
      'facebook.com', 'fb.com', 'instagram.com',
      'microsoft.com', 'live.com', 'office.com',
      'linkedin.com',
      'chase.com', 'wellsfargo.com', 'bankofamerica.com',
      'apple.com', 
      'amazon.com',
      'dropbox.com',
      'slack.com',
      'zoom.us'
    ];
    
    // Check if the hostname matches or is a subdomain of any strict CSP domain
    return strictCSPDomains.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );
  } catch (error) {
    console.error('Error checking if site has strict CSP:', error);
    return false;
  }
}

// Show affirmation in a browser popup
function showBrowserAffirmation(affirmation) {
  if (!affirmation) {
    affirmation = getRandomAffirmation();
  }
  
  console.log('Showing browser affirmation:', affirmation);
  
  // Store the affirmation in storage so the popup can access it
  chrome.storage.local.set({ 'currentAffirmation': affirmation }, () => {
    console.log('Stored affirmation');
    
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        
        // Skip browser internal pages
        if (activeTab.url && !isBrowserInternalPage(activeTab.url)) {
          // Check if the site has a strict CSP
          const hasStrictCSP = hasSiteStrictCSP(activeTab.url);
          console.log(`Tab ${activeTab.id} (${activeTab.url}) has strict CSP: ${hasStrictCSP}`);
          
          // Try to send message to the content script - works on all sites
          try {
            const sendPromise = chrome.tabs.sendMessage(activeTab.id, {
              action: 'showAffirmation',
              affirmation: affirmation
            });
            
            // Handle both Promise and callback-style implementations
            if (sendPromise && typeof sendPromise.then === 'function') {
              sendPromise.then(response => {
                console.log(`Affirmation displayed in active tab: ${activeTab.title}`);
              }).catch(error => {
                console.log('Content script not ready, checking if direct injection is possible');
                
                // Only inject directly on sites with host permissions
                if (hasStrictCSP) {
                  injectDirectly(activeTab.id, affirmation);
                } else {
                  console.log('Cannot inject directly on this site due to host permission restrictions');
                }
              });
            }
          } catch (error) {
            console.log('Error with sendMessage:', error);
            
            // Only inject directly on sites with host permissions
            if (hasStrictCSP) {
              console.log('Falling back to direct injection (site has strict CSP)');
              injectDirectly(activeTab.id, affirmation);
            } else {
              console.log('Cannot inject directly on this site due to host permission restrictions');
            }
          }
        } else {
          console.error('Active tab is a special page, cannot inject affirmation');
          // Try to find another regular tab as fallback
          findAnyTabAndInject(affirmation);
        }
      } else {
        console.error('No active tab found');
        // Try to find another regular tab as fallback
        findAnyTabAndInject(affirmation);
      }
    });
  });
}

// Helper function to inject script directly
function injectDirectly(tabId, affirmation) {
  try {
    chrome.scripting.executeScript({
      target: {tabId: tabId},
      function: injectAffirmation,
      args: [affirmation]
    }).then(() => {
      console.log(`Affirmation injected directly in tab ${tabId}`);
    }).catch(error => {
      console.error('Error injecting affirmation:', error);
    });
  } catch (error) {
    console.error('Exception injecting script:', error);
  }
}

// Helper function to find any available tab and inject affirmation as fallback
function findAnyTabAndInject(affirmation) {
  chrome.tabs.query({}, function(tabs) {
    // Filter out extension tabs and special pages
    const regularTabs = tabs.filter(tab => 
      tab.url && !isBrowserInternalPage(tab.url)
    );
    
    if (regularTabs.length > 0) {
      // Try to find a tab with strict CSP first (where we have host permissions)
      const secureTab = regularTabs.find(tab => hasSiteStrictCSP(tab.url));
      
      if (secureTab) {
        console.log(`Found secure tab with strict CSP: ${secureTab.title}`);
        // Try to send message to the content script
        try {
          const sendPromise = chrome.tabs.sendMessage(secureTab.id, {
            action: 'showAffirmation',
            affirmation: affirmation
          });
          
          // Handle both Promise and callback-style implementations
          if (sendPromise && typeof sendPromise.then === 'function') {
            sendPromise.then(response => {
              console.log(`Affirmation displayed in secure fallback tab: ${secureTab.title}`);
            }).catch(error => {
              console.log('Content script not ready in secure fallback tab, injecting directly');
              injectDirectly(secureTab.id, affirmation);
            });
          }
        } catch (error) {
          console.log('Error sending message to secure fallback tab, trying direct injection');
          injectDirectly(secureTab.id, affirmation);
        }
      } else {
        // No secure tab found, try any regular tab
        const targetTab = regularTabs[0];
        console.log(`No secure tab found, trying regular tab: ${targetTab.title}`);
        
        // Try to send message to the content script
        try {
          const sendPromise = chrome.tabs.sendMessage(targetTab.id, {
            action: 'showAffirmation',
            affirmation: affirmation
          });
          
          if (sendPromise && typeof sendPromise.then === 'function') {
            sendPromise.then(response => {
              console.log(`Affirmation displayed in fallback tab: ${targetTab.title}`);
            }).catch(error => {
              console.log('Content script not ready in fallback tab, cannot inject directly due to host permission restrictions');
            });
          }
        } catch (error) {
          console.log('Error sending message to fallback tab, cannot inject directly due to host permission restrictions');
        }
      }
    } else {
      console.log('No regular web page tabs found for fallback');
    }
  });
}

// Function to inject directly into the page
function injectAffirmation(affirmation) {
  // Get gradient colors from storage or use defaults
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
        document.body.removeChild(popupContainer);
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

// Listen for changes in storage
chrome.storage.onChanged.addListener((changes, area) => {
  console.log('Storage changes detected:', changes);
  
  if (area === 'sync') {
    // Check if enabled state changed
    if (changes.enabled) {
      console.log('Enabled state changed from', changes.enabled.oldValue, 'to', changes.enabled.newValue);
      
      if (changes.enabled.newValue) {
        // Re-enable scheduling
        chrome.storage.sync.get(['scheduleType', 'intervalMinutes', 'scheduledTimes'], (data) => {
          setupScheduling(data.scheduleType, data.intervalMinutes, data.scheduledTimes);
        });
      } else {
        // Disable all alarms
        chrome.alarms.clearAll();
        console.log('All alarms cleared due to disabled state');
      }
    }
  }
});

// Listen for messages from popup and options pages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  
  if (request.action === 'getRandomAffirmation') {
    const affirmation = getRandomAffirmation();
    console.log('Sending random affirmation:', affirmation);
    sendResponse({ affirmation: affirmation });
  } else if (request.action === 'getAllAffirmations') {
    const allAffirmations = getAllAffirmations();
    console.log('Sending all affirmations, count:', allAffirmations.length);
    sendResponse({ affirmations: allAffirmations });
  } else if (request.action === 'updateSchedule') {
    // Update scheduling based on new settings
    if (request.scheduleType === 'interval') {
      setupScheduling('interval', request.intervalMinutes, []);
    } else if (request.scheduleType === 'specificTime') {
      setupScheduling('specificTime', 0, request.scheduledTimes);
    }
    sendResponse({ success: true });
  } else if (request.action === 'showBrowserAffirmation') {
    showBrowserAffirmation(request.affirmation);
    sendResponse({ success: true });
  }
  return true; // Required to use sendResponse asynchronously
}); 