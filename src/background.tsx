type TranslateSelectionMessage = {
  type: "TRANSLATE"
  text: string
  lang: string
}

type TranslatePageMessage = {
  type: "TRANSLATE_PAGE"
}

const getSelectedText = async (tabId: number) => {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => window.getSelection()?.toString().trim() ?? "",
  })

  return String(result ?? "").trim()
}

const getActiveTabId = async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  })

  return tab?.id ?? null
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "qred-translate",
    title: chrome.i18n.getMessage("translate_element_popup_title"),
    contexts: ["selection"],
  })
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "qred-translate") return
  if (!tab?.id) return

  const text = String(info.selectionText ?? "").trim() || (await getSelectedText(tab.id))

  if (!text) return

  const { targetLang } = await chrome.storage.sync.get(["targetLang"])

  const message: TranslateSelectionMessage = {
    type: "TRANSLATE",
    text,
    lang: String(targetLang ?? "zh"),
  }

  chrome.tabs.sendMessage(tab.id, message)
})

chrome.commands.onCommand.addListener(async (command) => {
  const tabId = await getActiveTabId()
  if (!tabId) return

  if (command === "translate-selection") {
    const text = await getSelectedText(tabId)
    if (!text) return

    const { targetLang } = await chrome.storage.sync.get(["targetLang"])

    const message: TranslateSelectionMessage = {
      type: "TRANSLATE",
      text,
      lang: String(targetLang ?? "zh"),
    }

    chrome.tabs.sendMessage(tabId, message)
    return
  }

  if (command === "translate-page") {
    const message: TranslatePageMessage = {
      type: "TRANSLATE_PAGE",
    }

    chrome.tabs.sendMessage(tabId, message)
  }
})
