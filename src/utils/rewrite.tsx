export const localRewrite = async (text: string, style: string): Promise<string> => {
    let rewriter = null

    try {
        // @ts-ignore
        rewriter = await Rewriter.create()
    } catch {
        return chrome.i18n.getMessage("rewrite_message_init_error")
    }

    const result = await rewriter.rewrite(text, {
        context: style
    })

    return result
}

export const localSummarize = async (text: string): Promise<string> => {
    let summarizer = null

    try {
        // @ts-ignore
        summarizer = await Summarizer.create({ type: "tl;dr" })
    } catch {
        return chrome.i18n.getMessage("summarize_message_init_error")
    }

    const result = await summarizer.summarize(text)
    return result
}