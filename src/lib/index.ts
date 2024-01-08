import type { Config } from './types'
import { Point } from './classes'

const auxiliaryLineGap = 100

class MyApp {
  private contentCtx: CanvasRenderingContext2D
  private auxiliaryCtx: CanvasRenderingContext2D
  private coordinateCtx: CanvasRenderingContext2D
  private items: Config['items']
  private canvasWidth: number
  private canvasHeight: number
  private startTime = 0
  private stopped = false
  private mousePoint: Point | null = null
  private mouseCoordinate: boolean
  constructor(options: Config) {
    const {
      canvasContainer,
      items,
      auxiliaryLine = false,
      canvasWidth,
      canvasHeight,
      mouseCoordinate = false
    } = options

    this.items = items
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.mouseCoordinate = mouseCoordinate

    const container = document.querySelector(canvasContainer) as HTMLDivElement
    const auxiliaryCanvas = document.createElement('canvas')
    auxiliaryCanvas.id = `auxiliaryCanvas`
    auxiliaryCanvas.style.position = 'absolute'
    auxiliaryCanvas.style.left = `0`
    auxiliaryCanvas.style.right = `0`
    auxiliaryCanvas.style.top = `0`
    auxiliaryCanvas.style.bottom = `0`
    auxiliaryCanvas.width = canvasWidth
    auxiliaryCanvas.height = canvasHeight
    this.auxiliaryCtx = auxiliaryCanvas.getContext(
      '2d'
    ) as CanvasRenderingContext2D
    container.appendChild(auxiliaryCanvas)
    if (auxiliaryLine) {
      requestAnimationFrame(this.drawAuxiliaryLine)
    }

    const contentCanvas = document.createElement('canvas')
    contentCanvas.id = `contentCanvas`
    contentCanvas.style.position = 'absolute'
    contentCanvas.style.left = `0`
    contentCanvas.style.right = `0`
    contentCanvas.style.top = `0`
    contentCanvas.style.bottom = `0`
    contentCanvas.width = canvasWidth
    contentCanvas.height = canvasHeight
    this.contentCtx = contentCanvas.getContext('2d') as CanvasRenderingContext2D
    container.appendChild(contentCanvas)

    const coordinateCanvas = document.createElement('canvas')
    coordinateCanvas.id = `coordinateCanvas`
    coordinateCanvas.style.position = 'absolute'
    coordinateCanvas.style.left = `0`
    coordinateCanvas.style.right = `0`
    coordinateCanvas.style.top = `0`
    coordinateCanvas.style.bottom = `0`
    coordinateCanvas.width = canvasWidth
    coordinateCanvas.height = canvasHeight
    this.coordinateCtx = coordinateCanvas.getContext(
      '2d'
    ) as CanvasRenderingContext2D
    container.appendChild(coordinateCanvas)
    coordinateCanvas.addEventListener('mousemove', (e) => {
      this.mousePoint = new Point(e.clientX, e.clientY)
    })
    coordinateCanvas.addEventListener('mouseleave', () => {
      this.mousePoint = null
    })
  }
  private drawAuxiliaryLine = () => {
    this.auxiliaryCtx.beginPath()
    this.auxiliaryCtx.lineWidth = 1
    const horizontalLineCount = Math.floor(this.canvasHeight / auxiliaryLineGap)
    for (let i = 1; i <= horizontalLineCount; i++) {
      this.auxiliaryCtx.moveTo(0, i * auxiliaryLineGap)
      this.auxiliaryCtx.lineTo(this.canvasWidth, i * auxiliaryLineGap)
    }

    const verticallLineCount = Math.floor(this.canvasWidth / auxiliaryLineGap)
    for (let i = 1; i <= verticallLineCount; i++) {
      this.auxiliaryCtx.moveTo(i * auxiliaryLineGap, 0)
      this.auxiliaryCtx.lineTo(i * auxiliaryLineGap, this.canvasHeight)
    }

    this.auxiliaryCtx.setLineDash([1, 2])
    this.auxiliaryCtx.stroke()
  }
  private drawContent = (now: number) => {
    if (this.stopped) {
      return
    }

    let timePassed = now - this.startTime
    if (timePassed <= 0) {
      requestAnimationFrame(this.drawContent)
      return
    }

    this.contentCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

    this.contentCtx.setLineDash([])

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      const { duration, waitAfterDrawingEnd, waitBeforeStartDrawing } = item
      const sum = duration + waitAfterDrawingEnd + waitBeforeStartDrawing
      if (timePassed > sum) {
        item.draw(1, this.contentCtx)

        if (i === this.items.length - 1) {
          this.stop()
        }

        timePassed -= sum
        continue
      }

      const progress = item.getProgress(timePassed)
      if (progress >= 1) {
        item.draw(1, this.contentCtx)
      } else {
        item.draw(progress, this.contentCtx)
      }
      break
    }

    requestAnimationFrame(this.drawContent)
  }
  private drawCoordinate = () => {
    if (!this.mousePoint) {
      this.coordinateCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      requestAnimationFrame(this.drawCoordinate)
      return
    }

    const { x, y } = this.mousePoint

    this.coordinateCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

    this.coordinateCtx.font = `20px serif`

    if (x > this.canvasWidth / 2) {
      this.coordinateCtx.textAlign = 'end'
      if (y > this.canvasHeight / 2) {
        this.coordinateCtx.fillText(`(${x},${y})`, x - 10, y - 10)
      } else {
        this.coordinateCtx.fillText(`(${x},${y})`, x - 10, y + 30)
      }
    } else {
      this.coordinateCtx.textAlign = 'start'
      if (y > this.canvasHeight / 2) {
        this.coordinateCtx.fillText(`(${x},${y})`, x + 10, y - 10)
      } else {
        this.coordinateCtx.fillText(`(${x},${y})`, x + 20, y + 40)
      }
    }

    requestAnimationFrame(this.drawCoordinate)
  }
  private stop = () => {
    this.stopped = true
  }
  public start = () => {
    this.startTime = performance.now()
    requestAnimationFrame(this.drawContent)

    if (this.mouseCoordinate) {
      requestAnimationFrame(this.drawCoordinate)
    }
  }
}

export default MyApp
