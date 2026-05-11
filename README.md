
# Phishing Tracker Chrome Extension

Phishing Tracker is a Chrome extension that helps users identify and avoid phishing websites in real time. It combines local heuristics and Google Safe Browsing API to provide instant feedback and notifications about the safety of the websites you visit.

---

## 🚀 Features

- **Real-time phishing detection** using both local heuristics and Google Safe Browsing
- **Visual notifications** for safe, suspicious, and dangerous sites
- **Popup dashboard** with scan results and quick actions
- **Threat history console** to review past scans
- **Manual scan and threat reporting**
- **Modern, user-friendly UI**

---

## 🗂️ Project Structure

```
phishingtracker_extensionn/
├── src/
│   ├── background.ts        # Monitors tab updates and triggers scans
│   ├── content.ts           # Injects notifications into web pages
│   ├── popup.ts             # Logic for the popup dashboard
│   ├── popup.html           # Popup UI
│   ├── history.ts           # Logic for threat history page
│   ├── history.html         # Threat history UI
│   ├── styles/
│   │   ├── popup.css        # Popup styles
│   │   └── notification.css # Notification styles
│   ├── utils/
│   │   ├── api.ts           # Google Safe Browsing API integration
│   │   └── phishingDetector.ts # Local heuristic detection
│   └── types/
│       └── index.ts         # TypeScript types/interfaces
├── public/
│   └── manifest.json        # Chrome extension manifest
├── dist/                    # Compiled JS output (after build)
├── package.json             # npm configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

---

## 🛠️ Setup & Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/akhilesh-reddy2005/phishingtracker_extensionn.git
   cd phishingtracker_extensionn
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Build the extension:**
   ```sh
   npm run build
   ```

---

## 🧑‍💻 Development

- **Watch for changes:**
  ```sh
  npm run watch
  ```
- **Development build:**
  The build output will be in the `dist/` folder. Make sure to load this folder in Chrome for testing.

---

## 🧩 Loading the Extension in Chrome

1. Open `chrome://extensions/` in your browser.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select the `public` directory (or the root if your manifest points to built files in `dist/`).
4. The extension icon should appear in your toolbar.

---

## 📊 Threat History

- Access the **History Console** from the popup or by opening `src/history.html` in your browser.
- View, search, and clear your scan history.

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome! Please open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.