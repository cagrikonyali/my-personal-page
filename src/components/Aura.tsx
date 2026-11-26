import { useEffect, useRef, useState } from 'react'

// Loop lengths of the four shapes (must match path0–path3 in index.css)
const LOOPS = [15, 18, 16, 14]

// Soft abstract color shapes wandering along the bottom, with a fine film grain on top.
export function Aura() {
  // each visit starts the shapes at a different point of their paths
  const [delays] = useState(() => LOOPS.map((l) => (Math.random() * l).toFixed(1)))
  const grainRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const g = grainRef.current
    if (!g) return
    // one random noise tile, repeated; with overlay it only shows on color and leaves white clean
    const tile = document.createElement('canvas')
    tile.width = tile.height = 256
    const tc = tile.getContext('2d')
    if (!tc) return
    const img = tc.createImageData(256, 256)
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.round(Math.random() * 255)
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v
      img.data[i + 3] = 255
    }
    tc.putImageData(img, 0, 0)

    const paint = () => {
      const r = g.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 3)
      g.width = Math.max(1, Math.round(r.width * dpr))
      g.height = Math.max(1, Math.round(r.height * dpr))
      const ctx = g.getContext('2d')
      const pattern = ctx?.createPattern(tile, 'repeat')
      if (!ctx || !pattern) return
      ctx.fillStyle = pattern
      ctx.fillRect(0, 0, g.width, g.height)
    }
    paint()
    window.addEventListener('resize', paint)
    return () => window.removeEventListener('resize', paint)
  }, [])

  return (
    <div className="aura" aria-hidden="true">
      {delays.map((d, i) => (
        <div key={i} className={`blob b${i}`} style={{ animationDelay: `-${d}s` }} />
      ))}
      <div className="veil" />
      <canvas ref={grainRef} className="grain" />
    </div>
  )
}
