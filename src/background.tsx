chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate-selection",
    title: "qRead Translate",
    contexts: ["selection"]
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const tid = tab?.id
  if (tid) {
    if (info.menuItemId === "translate-selection") {
      chrome.storage.sync.get(["targetLang"], ({ targetLang }) => {
        chrome.tabs.sendMessage(tid, {
          type: "TRANSLATE",
          text: info.selectionText,
          lang: targetLang || "zh"
        })
      })
    }
  }
})
