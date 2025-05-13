import { useState } from 'react'
import { localTranslate } from './utils/translate'
import './App.css'


function App() {
  const [inputText, setInputText] = useState<string>("")
  const [inputLanguage, setInputLanguage] = useState<string>("zh")
  const [translated, setTranslated] = useState<string>("")

  const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value)
  }

  const inputLanguageOnChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setInputLanguage(e.target.value)
  }

  const CallTranslate = async () => {
    if (!inputText.trim()) return

    const result = await localTranslate(inputText, inputLanguage)
    setTranslated(result)
  }

  return (
    <div className="app-container">
      <div className="card">
        <h3>选择翻译目标语言</h3>
        <select
          id="language"
          value={inputLanguage}
          onChange={inputLanguageOnChange}
        >
          <option value="zh">中文</option>
          <option value="en">英文</option>
          <option value="ja">日文</option>
          <option value="fr">法文</option>
        </select>

        <h3>测试翻译功能</h3>
        <p>输入一段文字，查看翻译结果：</p>
        <input type="text" placeholder="例如: Hello" value={inputText} onChange={inputOnChange} />

        <div>
          <button disabled={!inputText.trim()} onClick={CallTranslate}>测试翻译</button>
        </div>

        <input type="text" readOnly value={translated} placeholder="结果" />
      </div>
    </div>
  )
}

export default App
