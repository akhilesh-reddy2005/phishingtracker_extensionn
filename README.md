# Phishing Tracker Chrome Extension

## Overview
The Phishing Tracker Chrome Extension is designed to help users identify potentially unsafe websites by providing real-time notifications about phishing threats. The extension checks the current website against a list of known phishing sites and alerts the user with a visually appealing popup.

## Features
- Real-time phishing detection
- User-friendly popup interface
- Notifications for safe and unsafe websites
- Customizable styles for a better user experience

## Project Structure
```
phishing-tracker-extension
├── src
│   ├── background.ts        # Background script for monitoring tab updates
│   ├── content.ts           # Injected script for displaying notifications
│   ├── popup.ts             # Logic for the popup interface
│   ├── popup.html           # HTML structure for the popup
│   ├── popup.css            # Styles for the popup interface
│   ├── styles
│   │   ├── popup.css        # Additional styles for the popup
│   │   └── notification.css  # Styles for notification popups
│   ├── utils
│   │   ├── phishingDetector.ts # Functions for detecting phishing sites
│   │   └── api.ts           # API request handling
│   └── types
│       └── index.ts         # TypeScript interfaces and types
├── public
│   └── manifest.json        # Chrome extension configuration
├── package.json             # npm configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd phishing-tracker-extension
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `public` directory of the project.
2. Click on the extension icon in the toolbar to open the popup.
3. Activate the phishing tracker to start receiving notifications about website safety.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.