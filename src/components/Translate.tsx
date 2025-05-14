import { useState, useTransition } from "react"
import { localTranslate } from "../utils/translate"

import "./common.css"

interface languageData {
  label: string
  value: string
}

const languages: languageData[] = [
  { label: chrome.i18n.getMessage("translate_element_select_label_Chinese"), value: "zh" },
  { label: chrome.i18n.getMessage("translate_element_select_label_English"), value: "en" },
  { label: chrome.i18n.getMessage("translate_element_select_label_Japanese"), value: "ja" },
  { label: chrome.i18n.getMessage("translate_element_select_label_France"), value: "fr" },
]

const Translate = () => {
  const [inputText, setInputText] = useState<string>("")
  const [inputLanguage, setInputLanguage] = useState<string>("zh")
  const [translated, setTranslated] = useState<string>("")
  const [isTranslating, startTranslating] = useTransition()

  const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value)
    setTranslated("")
  }

  const inputLanguageOnChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setInputLanguage(e.target.value)
  }

  const CallTranslate = async () => {
    if (!inputText.trim()) return

    startTranslating(async () => {
      const result = await localTranslate(inputText, inputLanguage)
      setTranslated(result)
    })
  }

  return (
    <div className="card">
      <header>
        <h3>{chrome.i18n.getMessage("translate_element_select_label_style")}</h3>
        <select
          id="language"
          value={inputLanguage}
          onChange={inputLanguageOnChange}
        >
          {languages.map((lan: languageData, index: number) => {
            return (
              <option key={"lan" + index} value={lan.value}>{lan.label}</option>
            )
          })}
        </select>
      </header>

      <main>
        <h3>{chrome.i18n.getMessage("translate_element_h3_text")}</h3>
        <p>{chrome.i18n.getMessage("translate_element_p_text")}</p>
        <input type="text" placeholder="Hello" value={inputText} onChange={inputOnChange} />

        <div>
          <button disabled={!inputText.trim() || isTranslating} onClick={CallTranslate}>{chrome.i18n.getMessage("translate_element_button_title_test")}</button>
        </div>

        <input type="text" readOnly value={translated} placeholder={chrome.i18n.getMessage("translate_element_input_placeholder_title_result")} />
      </main>
    </div>
  )
}

export default Translate
