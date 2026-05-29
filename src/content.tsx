import { localTranslate } from "@/utils/translate"
import "@/content.css"

let translateButton: HTMLDivElement | null = null
let currentPopup: HTMLDivElement | null = null

const removeTranslateButton = () => {
  translateButton?.remove()
  translateButton = null
}

const removePopup = () => {
  currentPopup?.remove()
  currentPopup = null
}

const getSelectionRect = (range: Range) => {
  const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0 && r.height > 0)

  return rects.length ? rects[rects.length - 1] : range.getBoundingClientRect()
}

const showTranslationPopup = (translatedText: string) => {
  const selection = window.getSelection()

  if (!selection?.rangeCount) {
    return
  }

  removePopup()

  const range = selection.getRangeAt(0)
  const rect = getSelectionRect(range)

  const popup = document.createElement("div")

  popup.className = "translator-popup"

  popup.style.position = "fixed"
  popup.style.visibility = "hidden"
  popup.style.left = "0"
  popup.style.top = "0"
  popup.style.zIndex = "2147483647"
  popup.style.maxWidth = "min(420px, calc(100vw - 24px))"
  popup.style.maxHeight = "calc(100vh - 24px)"
  popup.style.overflow = "auto"
  popup.style.whiteSpace = "pre-wrap"
  popup.style.wordBreak = "break-word"

  const body = document.createElement("div")

  body.className = "translator-popup-body"
  body.textContent = translatedText

  popup.appendChild(body)

  document.body.appendChild(popup)

  const popupRect = popup.getBoundingClientRect()

  const gap = 8
  const padding = 12

  const left = Math.min(
    Math.max(rect.left, padding),
    Math.max(padding, window.innerWidth - popupRect.width - padding),
  )

  let top = rect.bottom + gap

  if (top + popupRect.height + padding > window.innerHeight) {
    top = Math.max(padding, rect.top - popupRect.height - gap)
  }

  popup.style.left = `${left}px`
  popup.style.top = `${top}px`
  popup.style.visibility = "visible"

  const maxHeight = window.innerHeight - top - padding

  if (maxHeight > 0) {
    popup.style.maxHeight = `${maxHeight}px`
  }

  currentPopup = popup
}

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type !== "TRANSLATE") {
    return
  }

  try {
    const translated = await localTranslate(message.text, message.lang)

    showTranslationPopup(translated)
  } catch (e) {
    const errmsg = chrome.i18n.getMessage("translate_message_get_error")

    console.error(errmsg + ":", e)
  }
})

document.addEventListener("mouseup", (e) => {
  const target = e.target as HTMLElement | null

  if (target?.closest(".translator-trigger")) {
    return
  }

  setTimeout(() => {
    const selection = window.getSelection()

    if (!selection?.rangeCount) {
      removeTranslateButton()
      return
    }

    const text = selection.toString().trim()

    if (!text) {
      removeTranslateButton()
      return
    }

    const rect = getSelectionRect(selection.getRangeAt(0))

    removeTranslateButton()

    const wrapper = document.createElement("div")

    wrapper.className = "translator-trigger"
    wrapper.style.position = "absolute"
    wrapper.style.left = `${rect.right + window.scrollX + 8}px`
    wrapper.style.top = `${rect.top + window.scrollY - 0}px`
    wrapper.style.zIndex = "2147483647"
    wrapper.style.cursor = "pointer"
    wrapper.style.lineHeight = "0"

    const button = document.createElement("img")

    button.src = chrome.runtime.getURL("icon_32.png")
    button.style.width = "24px"
    button.style.height = "24px"
    button.style.border = "none"
    button.style.borderRadius = "0"
    button.style.boxShadow = "none"
    button.style.background = "transparent"
    button.draggable = false

    wrapper.appendChild(button)

    wrapper.addEventListener("mousedown", (ev) => {
      ev.preventDefault()
      ev.stopPropagation()
    })

    wrapper.addEventListener("click", async (ev) => {
      ev.preventDefault()
      ev.stopPropagation()

      try {
        const result = await chrome.storage.sync.get(["targetLang"])

        const translated = await localTranslate(text, String(result.targetLang ?? "zh"))

        showTranslationPopup(translated)
      } catch (err) {
        const errmsg = chrome.i18n.getMessage("translate_message_get_error")

        console.error(errmsg + ":", err)
      }

      removeTranslateButton()
    })

    document.body.appendChild(wrapper)

    translateButton = wrapper
  }, 0)
})

document.addEventListener(
  "mousedown",
  (event) => {
    const target = event.target as HTMLElement | null

    if (!target?.closest(".translator-popup")) {
      removePopup()
    }

    if (!target?.closest(".translator-trigger")) {
      removeTranslateButton()
    }
  },
  true,
)

window.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      removePopup()
      removeTranslateButton()
    }
  },
  true,
)
