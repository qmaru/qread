import { useState } from "react"
import { localTranslate } from "../utils/translate"

import "./common.css"

interface languageData {
  label: string
  value: string
}

const languages: languageData[] = [
  { label: "中文", value: "zh" },
  { label: "英文", value: "en" },
  { label: "日文", value: "ja" },
  { label: "法文", value: "fr" },
]

const Translate = () => {
  const [inputText, setInputText] = useState<string>("")
  const [inputLanguage, setInputLanguage] = useState<string>("zh")
  const [translated, setTranslated] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value)
    setTranslated("")
  }

  const inputLanguageOnChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setInputLanguage(e.target.value)
  }

  const CallTranslate = async () => {
    if (!inputText.trim()) return

    setLoading(true)
    const result = await localTranslate(inputText, inputLanguage)
    setTranslated(result)
    setLoading(false)
  }

  return (
    <div className="card">
      <header>
        <h3>选择翻译目标语言</h3>
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
        <h3>测试翻译功能</h3>
        <p>输入一段文字，查看翻译结果：</p>
        <input type="text" placeholder="例如: Hello" value={inputText} onChange={inputOnChange} />

        <div>
          <button disabled={!inputText.trim() || loading} onClick={CallTranslate}>测试翻译</button>
        </div>

        <input type="text" readOnly value={translated} placeholder="结果" />
      </main>
    </div>
  )
}

export default Translate
