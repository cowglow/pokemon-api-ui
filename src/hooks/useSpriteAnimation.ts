import {useEffect, useState} from "react";

function preloadImage(url: string) {
    return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => resolve()
        img.src = url
    })
}

export function useSpriteAnimation(frames: string[], fps: number) {
    const [prevFrames, setPrevFrames] = useState(frames)
    const [frameIndex, setFrameIndex] = useState(0)
    const [ready, setReady] = useState(false)

    if (frames !== prevFrames) {
        setPrevFrames(frames)
        setFrameIndex(0)
        setReady(false)
    }

    useEffect(() => {
        if (frames.length === 0) return

        let cancelled = false
        Promise.all(frames.map(preloadImage)).then(() => {
            if (!cancelled) setReady(true)
        })
        return () => {
            cancelled = true
        }
    }, [frames])

    useEffect(() => {
        if (!ready || frames.length < 2) return
        const id = setInterval(() => {
            setFrameIndex(i => (i + 1) % frames.length)
        }, 1000 / fps)
        return () => clearInterval(id)
    }, [ready, frames, fps])

    return ready ? frames[frameIndex] : null
}
