let currentDetector: any = null
let currentTranslator: any = null

const createDetector = async () => {
  if (!("LanguageDetector" in self)) {
    throw new Error("LanguageDetector API is not available in this environment.")
  }

  try {
    // @ts-ignore
    return await LanguageDetector.create()
  } catch (err) {
    throw new Error("Failed to initialize LanguageDetector: " + err)
  }
}

const createTranslator = async (sourceLang: string, targetLang: string) => {
  if (!("Translator" in self)) {
    throw new Error("Translator API is not available in this environment.")
  }

  // @ts-ignore
  const translatorCapabilities = await Translator.availability({
    sourceLanguage: "es",
    targetLanguage: "fr",
  })

  if (translatorCapabilities !== "available" && translatorCapabilities !== "downloadable") {
    throw new Error("Translator API is not available for the specified languages.")
  }

  try {
    // @ts-ignore
    return await Translator.create({
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    })
  } catch (err) {
    throw new Error("Failed to initialize Translator: " + err)
  }
}

export const localTranslate = async (text: string, targetLang: string) => {
  try {
    currentDetector = await createDetector()
    if (!currentDetector) return chrome.i18n.getMessage("detector_message_init_error")
  } catch {
    return chrome.i18n.getMessage("detector_message_init_error")
  }

  let sourceLan = ""
  let warnMsg = ""

  try {
    // @ts-ignore
    const results = await currentDetector.detect(text)

    const resultTop1 = results[0]
    if ("confidence" in resultTop1 && "detectedLanguage" in resultTop1) {
      const confidence = resultTop1.confidence
      sourceLan = resultTop1.detectedLanguage
      if (Number(confidence) < 0.7) {
        warnMsg = `[${sourceLan}?] `
      }

      if (sourceLan === targetLang) {
        return text
      }
    }
  } catch (e) {
    const errmsg = chrome.i18n.getMessage("detector_message_get_error")
    console.error(e)
    console.error(errmsg + ": ", text)
    return errmsg
  }

  try {
    currentTranslator = await createTranslator(sourceLan, targetLang)
    if (!currentTranslator) return chrome.i18n.getMessage("translate_message_get_error")
    const translated = await currentTranslator.translate(text)
    return warnMsg + translated
  } catch (e) {
    const errmsg = chrome.i18n.getMessage("translate_message_get_error")
    console.log(errmsg + ": ", e)
    return errmsg
  }
}
