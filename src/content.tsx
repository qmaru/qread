import { localTranslate } from "@/utils/translate"
import "content.css"

let translateButton: HTMLDivElement | null = null

const removeTranslateButton = () => {
  translateButton?.remove()
  translateButton = null
}

const getSelectionRect = (range: Range) => {
  const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0 && r.height > 0)

  return rects.length ? rects[rects.length - 1] : range.getBoundingClientRect()
}

const showTranslationPopup = (translatedText: string) => {
  const selection = window.getSelection()
  if (!selection?.rangeCount) return

  const range = selection.getRangeAt(0)
  const rect = getSelectionRect(range)

  document.querySelectorAll(".translator-popup").forEach((el) => el.remove())

  const div = document.createElement("div")
  div.className = "translator-popup"
  div.innerText = translatedText

  div.style.position = "fixed"
  div.style.visibility = "hidden"
  div.style.zIndex = "2147483647"
  div.style.pointerEvents = "auto"
  div.style.left = "12px"
  div.style.top = "12px"
  div.style.maxWidth = "min(420px, calc(100vw - 24px))"
  div.style.maxHeight = "calc(100vh - 24px)"
  div.style.overflow = "auto"
  div.style.whiteSpace = "pre-wrap"
  div.style.wordBreak = "break-word"

  div.addEventListener("mousedown", (e) => e.stopPropagation())
  div.addEventListener("click", (e) => e.stopPropagation())

  document.body.appendChild(div)

  const gap = 8
  const padding = 12
  const popupRect = div.getBoundingClientRect()

  const left = Math.min(
    Math.max(rect.left, padding),
    Math.max(padding, window.innerWidth - popupRect.width - padding),
  )

  const top = rect.bottom + gap

  div.style.left = `${left}px`
  div.style.top = `${top}px`
  div.style.visibility = "visible"

  const maxHeight = window.innerHeight - top - padding
  if (maxHeight > 0) {
    div.style.maxHeight = `${maxHeight}px`
  }

  let autoRemoveTimer = window.setTimeout(() => {
    div.remove()
  }, 5000)

  div.addEventListener("mouseenter", () => {
    clearTimeout(autoRemoveTimer)
  })

  div.addEventListener("mouseleave", () => {
    autoRemoveTimer = window.setTimeout(() => {
      div.remove()
    }, 3000)
  })
}

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "TRANSLATE") {
    const text = message.text
    const lang = message.lang

    try {
      const translated = await localTranslate(text, lang)
      showTranslationPopup(translated)
    } catch (e) {
      const errmsg = chrome.i18n.getMessage("translate_message_get_error")
      console.error(errmsg + ": ", e)
    }
  }
})

document.addEventListener("mouseup", (e) => {
  const target = e.target as HTMLElement | null

  if (target?.closest(".translator-trigger")) {
    return
  }

  setTimeout(() => {
    const selection = window.getSelection()

    if (!selection || !selection.rangeCount) {
      removeTranslateButton()
      return
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect()

    if (!selection || !selection.rangeCount) {
      removeTranslateButton()
      return
    }

    const text = selection.toString().trim()

    if (!text) {
      removeTranslateButton()
      return
    }

    removeTranslateButton()

    const wrapper = document.createElement("div")
    wrapper.className = "translator-trigger"

    wrapper.style.position = "absolute"
    wrapper.style.left = `${rect.right + window.scrollX + 6}px`
    wrapper.style.top = `${rect.top + window.scrollY - 4}px`
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
        console.error(errmsg + ": ", err)
      }

      removeTranslateButton()
    })

    document.body.appendChild(wrapper)

    translateButton = wrapper
  }, 0)
})

document.addEventListener("mousedown", (event) => {
  const target = event.target as HTMLElement | null

  if (!target || !target.closest(".translator-popup")) {
    document.querySelectorAll(".translator-popup").forEach((el) => el.remove())
  }

  if (!target || !target.closest(".translator-trigger")) {
    removeTranslateButton()
  }
})
