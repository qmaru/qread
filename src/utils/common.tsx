import { useState, useCallback } from "react"

export const useModelMonitor = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)

  const handleMonitor = useCallback((m: any) => {
    const onProgress = (e: any) => {
      const p = Math.min(100, e.loaded * 100)
      setProgress(p)
      setIsLoading(p < 100)
      console.log(`Downloaded ${p}%`)
    }

    m.addEventListener("downloadprogress", onProgress)

    return () => {
      m.removeEventListener("downloadprogress", onProgress)
    }
  }, [])

  return { isLoading, progress, handleMonitor }
}
