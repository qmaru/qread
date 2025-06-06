chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "qred-translate",
    title: chrome.i18n.getMessage("translate_element_popup_title"),
    contexts: ["selection"]
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const tid = tab?.id
  if (tid) {
    if (info.menuItemId === "qred-translate") {
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
