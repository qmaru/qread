export const localTranslate = async (text: string, targetLang: string) => {
    let detector = null

    try {
        // @ts-ignore
        detector = await LanguageDetector.create()
    } catch {
        return chrome.i18n.getMessage("detector_message_init_error")
    }

    let sourceLan = ""
    let warnMsg = ""

    try {
        // @ts-ignore
        const results = await detector.detect(text)

        const resultTop1 = results[0]
        if ("confidence" in resultTop1 && "detectedLanguage" in resultTop1) {
            const confidence = resultTop1.confidence
            sourceLan = resultTop1.detectedLanguage
            if (Number(confidence) < 0.70) {
                warnMsg = `[${sourceLan}?] `
            }

            if (sourceLan === targetLang) {
                return text
            }
        }
    } catch (e) {
        const errmsg = chrome.i18n.getMessage("detector_message_get_error")
        console.log(e)
        console.log(errmsg + ": ", text)
        return errmsg
    }

    try {
        const translator = await (window as any).Translator.create({
            sourceLanguage: sourceLan,
            targetLanguage: targetLang
        })

        const translated = await translator.translate(text)
        return warnMsg + translated
    } catch (e) {
        const errmsg = chrome.i18n.getMessage("translate_message_get_error")
        console.log(errmsg + ": ", e)
        return errmsg
    }
}
