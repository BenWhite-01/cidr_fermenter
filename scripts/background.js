import { isValidIPv4, isValidCidr } from "./cidr_utils.js";

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

    // Validate selected text
    if (!isValidIPv4(info.selectionText) && !isValidCidr(info.selectionText)) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => alert("Bad Apples! Invalid CIDR or IP address selected."),
      });
      return;
    }

    // Open popup menu
    chrome.storage.local.set({ cidr: info.selectionText }, () => {
      chrome.windows.create({
        url: chrome.runtime.getURL("popup/popup.html"),
        type: "popup",
        width: 360,
        height: 500
      });
    });
  }
});
