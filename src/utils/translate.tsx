export const localTranslate = async (text: string, targetLang: string) => {
    const errMsg = "无法翻译，客户端不支持端侧模型"
    try {
        // @ts-ignore
        await LanguageDetector.create()
    } catch {
        return errMsg
    }

    let sourceLan = ""
    let warnMsg = ""

    try {
        // @ts-ignore
        const detector = await LanguageDetector.create()
        const results = await detector.detect(text)

        const resultTop1 = results[0]
        if ("confidence" in resultTop1 && "detectedLanguage" in resultTop1) {
            const confidence = resultTop1.confidence
            sourceLan = resultTop1.detectedLanguage
            if (Number(confidence) < 0.70) {
                warnMsg = `[${sourceLan}?]`
            }

            if (sourceLan === targetLang) {
                return text
            }
        }
    } catch (e) {
        console.log(e)
        console.log("无法识别该语言: ", text)
        return "无法识别该语言"
    }

    try {
        const translator = await (window as any).Translator.create({
            sourceLanguage: sourceLan,
            targetLanguage: targetLang
        })

        const translated = await translator.translate(text)
        return warnMsg + translated
    } catch (e) {
        console.log("翻译出错: ", e)
        return "翻译出错"
    }
}
