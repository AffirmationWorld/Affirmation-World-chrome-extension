# How to install

1. Install this repository as and extract it to a folder.
2. Navigate to extensions by clicking the menu button in the top left of your browser (the three lines)
3. Enable developer mode in the top right.
4. Click load unpacked on the top left and select the folder.

Always scan files before installing

you can copy and paste this repository link into whatever virus scanner you prefer.

https://www.virustotal.com/

# Showcase Video

https://www.youtube.com/watch?v=2U6b8AaqZY4

# Scheduled Affirmations Chrome Extension

A Chrome extension that displays motivational affirmations every hour via Chrome notifications.

## Features

- Scheduled motivational affirmations
- Random selection from a curated list of positive affirmations
- Simple popup interface to see current affirmation
- Options page to enable/disable notifications and test the feature
- Enhanced security with tiered permissions model
- Customizable popup design

## Usage

- Click on the extension icon in your browser toolbar to see the current affirmation
- Use the toggle in the popup to enable or disable scheduled notifications
- Click "New Affirmation" to see a different affirmation immediately
- Click "Options" to access the options page

## Security Implementation

This extension implements a tiered security approach:

- **Basic functionality works on all websites** using content scripts without requiring host permissions
- **Enhanced functionality** (like direct script injection) is **only used on sites with strict CSPs** where we explicitly request host permissions
- This provides a balance between functionality and security

### Sites with Enhanced Permissions

The extension requests host permissions only for domains known to have strong Content Security Policies (CSPs), including:
- Google services (google.com, gmail.com, youtube.com)
- GitHub (github.com, github.io)
- Twitter/X (twitter.com, x.com)
- Facebook (facebook.com, instagram.com)
- Microsoft services (microsoft.com, live.com, office.com)
- LinkedIn (linkedin.com)
- Other major secure platforms (apple.com, amazon.com, dropbox.com, slack.com, zoom.us)

## Options Page

The options page allows you to:
- Enable or disable scheduled affirmation popups
- Test and preview how popup design will appear

## Icon Credits
All icons and design crafted by the development team of Affirmation World

## License

This project is open source and available under the [MIT License](LICENSE). 
