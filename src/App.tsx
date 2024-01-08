import { useEffect, useRef } from 'react'
import './App.css'
import MyApp from './lib'
import { Ellipse, Line, Point } from './lib/classes'
import buildInConfigs from './lib/buildInConfigs'

function App() {
  const ref = useRef<HTMLDivElement>(null)
  const appRef = useRef<MyApp>()

  useEffect(() => {
    const boundingClientRect = ref.current?.getBoundingClientRect() as DOMRect
    const canvasEle = document.getElementById('canvas-element')
    canvasEle?.setAttribute('width', `${boundingClientRect.width}`)
    canvasEle?.setAttribute('height', `${boundingClientRect.height}`)

    if (!appRef.current) {
      appRef.current = new MyApp({
        canvasContainer: '#App',
        items: buildInConfigs.heart,
        canvasWidth: boundingClientRect.width,
        canvasHeight: boundingClientRect.height,
        auxiliaryLine: true,
        mouseCoordinate: true
      })
      appRef.current.start()
    }
  }, [])

  return <div id='App' ref={ref}></div>
}

export default App
