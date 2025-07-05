import { isValidCidrOrIpv4 } from "./cidr_utils.js";

console.log('Mmmmmm cidr...')

// Add item to chrome context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "ferment-cidr",
    title: "Ferment cidr...",
    contexts: ["selection"]
  });
});

// Handle context menu item click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "ferment-cidr" && info.selectionText) {
    console.log('Fermenting cidr: ' + info.selectionText)
    let selection = info.selectionText.replace(/\s/g,'')
    // Validate selected text
    if (!isValidCidrOrIpv4(selection)) {
      console.log('Bad Apples! Invalid selection')
      // Custom toast
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const toast = document.createElement('div');
          toast.textContent = '⚠️ Invalid CIDR or IPv4 address selected';
          Object.assign(toast.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            padding: '10px 15px',
            background: '#ff4136',
            color: 'white',
            fontSize: '14px',
            borderRadius: '6px',
            zIndex: 9999,
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
          });
      
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 3000);
        }
      });
      return;
    }

    // Open popup menu
    chrome.storage.local.set({ cidr: selection }, () => {
      chrome.windows.create({
        url: chrome.runtime.getURL("popup/popup.html"),
        type: "popup",
        width: 360,
        height: 500
      });
    });
  }
});
