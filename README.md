# qread

client-side ai of gemini-nano / Phi-4-mini.

+ translate api (Edge does not support)
+ rewrite api
+ prompt api

## More

[AI on Chrome](https://developer.chrome.com/docs/ai/get-started)

[AI on Edge](https://learn.microsoft.com/en-us/microsoft-edge/web-platform/prompt-api)

## Setting

Tested and passed in Chrome 136 / Edge 139.

```shell
# Enabled BypassPerfRequirement
chrome://flags/#optimization-guide-on-device-model

# Enabled

## Chrome
chrome://flags/#prompt-api-for-gemini-nano
chrome://flags/#prompt-api-for-gemini-nano-multimodal-input
chrome://flags/#summarization-api-for-gemini-nano
chrome://flags/#writer-api-for-gemini-nano
chrome://flags/#rewriter-api-for-gemini-nano
chrome://flags/#language-detection-api
chrome://flags/#translation-api

## Edge
edge://flags/#edge-llm-prompt-api-for-phi-mini
edge://flags/#edge-llm-summarization-api-for-phi-mini
edge://flags/#edge-llm-writer-api-for-phi-mini
edge://flags/#edge-llm-rewriter-api-for-phi-mini

# F12 console

# If it is "available", skip it.
await LanguageModel.availability();

# If it is "downloadable", it needs to be executed.
await LanguageModel.create();

# Check ~ 3GB

# [Optimization Guide On Device Model]
chrome://components/

# [Edge LLM On Device Model]
edge://components/

# 1.Prompt API
const session = await LanguageModel.create();
const result = await session.prompt("Hello");
console.log(result);

# 2.Translate API (Edge does not support)
const translator = await Translator.create({
  sourceLanguage: "en",
  targetLanguage: "ja"
});

const text = await translator.translate("Hello, world!");
console.log(text);
```
