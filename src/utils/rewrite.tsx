let currentRewriterInstance: any = null
let currentRewriteAbort: AbortController | null = null

let currentSummarizerInstance: any = null
let currentSummarizeAbort: AbortController | null = null

const createRewriter = async (monitor?: (event: any) => void) => {
  if (!("Rewriter" in self)) {
    throw new Error("Rewriter API is not available in this environment.")
  }

  try {
    // @ts-ignore
    return await Rewriter.create({
      // expectedInputLanguages: ["en", "ja", "es"],
      // expectedContextLanguages: ["en", "ja", "es"],
      // outputLanguage: navigator.language.split("-")[0],
      monitor: monitor,
    })
  } catch (e) {
    throw new Error("Failed to initialize Rewriter: " + e)
  }
}

export const abortLocalRewrite = () => {
  if (currentRewriteAbort) {
    currentRewriteAbort.abort()
    currentRewriteAbort = null
  }

  if (currentRewriterInstance) {
    try {
      currentRewriterInstance.destroy?.()
    } catch {}
    currentRewriterInstance = null
  }
}

export const localRewrite = async (text: string, style: string, monitor?: (event: any) => void) => {
  try {
    currentRewriterInstance = await createRewriter(monitor)
    if (!currentRewriterInstance) return chrome.i18n.getMessage("rewrite_message_init_error")
  } catch (e) {
    console.error(e)
    return chrome.i18n.getMessage("rewrite_message_init_error")
  }

  currentRewriteAbort = new AbortController()

  // @ts-ignore
  const rewritten = await currentRewriterInstance.rewrite(text, {
    context: style,
    signal: currentRewriteAbort.signal,
  })

  return rewritten
}

export const localRewriteStream = async (
  text: string,
  style: string,
  monitor?: (event: any) => void,
) => {
  try {
    currentRewriterInstance = await createRewriter(monitor)
    if (!currentRewriterInstance) return chrome.i18n.getMessage("rewrite_message_init_error")
  } catch (e) {
    console.error(e)
    return chrome.i18n.getMessage("rewrite_message_init_error")
  }

  currentRewriteAbort = new AbortController()

  // @ts-ignore
  const stream = await currentRewriterInstance.rewriteStreaming(text, {
    context: style,
    signal: currentRewriteAbort.signal,
  })

  return stream
}

const createSummarizer = async (monitor?: (event: any) => void) => {
  if (!("Summarizer" in self)) {
    throw new Error("Summarizer API is not available in this environment.")
  }

  try {
    // @ts-ignore
    return await Summarizer.create({
      type: "tldr",
      // expectedInputLanguages: ["en", "ja", "es"],
      // expectedContextLanguages: ["en", "ja", "es"],
      // outputLanguage: navigator.language.split("-")[0],
      monitor: monitor,
    })
  } catch (e) {
    throw new Error("Failed to initialize Summarizer: " + e)
  }
}

export const abortLocalSummarize = () => {
  if (currentSummarizeAbort) {
    currentSummarizeAbort.abort()
    currentSummarizeAbort = null
  }

  if (currentSummarizerInstance) {
    try {
      currentSummarizerInstance.destroy?.()
    } catch {}
    currentSummarizerInstance = null
  }
}

export const localSummarize = async (
  text: string,
  monitor?: (event: any) => void,
): Promise<string> => {
  try {
    currentSummarizerInstance = await createSummarizer(monitor)
    if (!currentSummarizerInstance) return chrome.i18n.getMessage("summarize_message_init_error")
  } catch (e) {
    console.error(e)
    return chrome.i18n.getMessage("summarize_message_init_error")
  }

  currentSummarizeAbort = new AbortController()

  // @ts-ignore
  const summary = await currentSummarizerInstance.summarize(text, {
    signal: currentSummarizeAbort.signal,
  })

  return summary
}

export const localSummarizeStream = async (
  text: string,
  monitor?: (event: ProgressEvent) => void,
) => {
  try {
    currentSummarizerInstance = await createSummarizer(monitor)
    if (!currentSummarizerInstance) return chrome.i18n.getMessage("summarize_message_init_error")
  } catch (e) {
    console.error(e)
    return chrome.i18n.getMessage("summarize_message_init_error")
  }

  currentSummarizeAbort = new AbortController()

  // @ts-ignore
  const stream = await currentSummarizerInstance.summarizeStreaming(text, {
    signal: currentSummarizeAbort.signal,
  })
  return stream
}
