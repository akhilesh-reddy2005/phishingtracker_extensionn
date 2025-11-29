
// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showNotification") {
        showNotification(request.status);
    }
});
function showNotification(status) {
    const notification = document.createElement("div");
    notification.className = `notification ${status.isSafe ? "notification-safe" : "notification-unsafe"}`;
    const icon = status.isSafe ? "✓" : "⚠";
    const title = status.isSafe ? "Safe Website" : "Suspicious Website";
    notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-size: 24px; font-weight: bold;">${icon}</span>
      <div>
        <strong>${title}</strong>
        <p style="margin: 5px 0 0 0; font-size: 12px;">${status.message}</p>
        <p style="margin: 5px 0 0 0; font-size: 11px;">Confidence: ${(status.confidence * 100).toFixed(0)}%</p>
      </div>
    </div>
  `;
    document.body.appendChild(notification);
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.add("hide");
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}
