import type {
  QuadraticBezierOptions,
  CubicBezierOptions,
  LineOptions,
  ArcOptions,
  BasicOptions,
  EllipseOptions
} from './types'

export class Point {
  public x: number
  public y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

class Geometry {
  public duration: number // 动画持续时间
  public waitBeforeStartDrawing: number // 画之前的停顿时间
  public waitAfterDrawingEnd: number // 画完后的停顿时间
  protected strokeColor: string
  protected lineWidth: number
  constructor(options: BasicOptions) {
    const {
      duration,
      waitAfterDrawingEnd = 0,
      waitBeforeStartDrawing = 0,
      strokeColor = '#000000',
      lineWidth = 1
    } = options
    this.duration = duration
    this.waitAfterDrawingEnd = waitAfterDrawingEnd
    this.waitBeforeStartDrawing = waitBeforeStartDrawing
    this.strokeColor = strokeColor
    this.lineWidth = lineWidth
  }
  public getProgress = (passedTime: number): number => {
    return (passedTime - this.waitBeforeStartDrawing) / this.duration
  }
  public draw(progress: number, ctx: CanvasRenderingContext2D) {
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.lineWidth = this.lineWidth
    ctx.strokeStyle = this.strokeColor
  }
}

/**
 * 二次贝塞尔曲线
 */
export class QuadraticBezier extends Geometry {
  private startPoint: Point
  private endPoint: Point
  private controlPoint: Point
  constructor(options: QuadraticBezierOptions) {
    super(options)
    const { startPoint, endPoint, controlPoint } = options
    this.startPoint = startPoint
    this.endPoint = endPoint
    this.controlPoint = controlPoint
  }

  private getSubControlPoint = (t: number) => {
    const subControlPointX =
      this.startPoint.x + (this.controlPoint.x - this.startPoint.x) * t
    const subControlPointY =
      this.startPoint.y + (this.controlPoint.y - this.startPoint.y) * t
    return new Point(subControlPointX, subControlPointY)
  }

  private getSubEndPoint = (t: number) => {
    const subEndPointX =
      (1 - t) * (1 - t) * this.startPoint.x +
      2 * (1 - t) * t * this.controlPoint.x +
      t * t * this.endPoint.x
    const subEndPointY =
      (1 - t) * (1 - t) * this.startPoint.y +
      2 * (1 - t) * t * this.controlPoint.y +
      t * t * this.endPoint.y
    return new Point(subEndPointX, subEndPointY)
  }

  public draw = (progress: number, ctx: CanvasRenderingContext2D) => {
    super.draw(0, ctx)
    const subControlPoint = this.getSubControlPoint(progress)
    const subEndPoint = this.getSubEndPoint(progress)
    ctx.moveTo(this.startPoint.x, this.startPoint.y)
    ctx.quadraticCurveTo(
      subControlPoint.x,
      subControlPoint.y,
      subEndPoint.x,
      subEndPoint.y
    )
    ctx.stroke()
  }
}

/**
 * 三次贝塞尔曲线
 */
export class CubicBezier extends Geometry {
  private startPoint: Point
  private endPoint: Point
  private controlPoint1: Point
  private controlPoint2: Point
  constructor(options: CubicBezierOptions) {
    super(options)
    const { startPoint, endPoint, controlPoint1, controlPoint2 } = options
    this.startPoint = startPoint
    this.endPoint = endPoint
    this.controlPoint1 = controlPoint1
    this.controlPoint2 = controlPoint2
  }
  private getSubControlPoint1 = (t: number) => {
    const subControlPoint1X =
      this.startPoint.x + (this.controlPoint1.x - this.startPoint.x) * t
    const subControlPoint1Y =
      this.startPoint.y + (this.controlPoint1.y - this.startPoint.y) * t
    return new Point(subControlPoint1X, subControlPoint1Y)
  }
  private getSubControlPoint2 = (t: number) => {
    const subControlPoint2X =
      (1 - t) * (1 - t) * this.startPoint.x +
      2 * (1 - t) * t * this.controlPoint1.x +
      t * t * this.controlPoint2.x
    const subControlPoint2Y =
      (1 - t) * (1 - t) * this.startPoint.y +
      2 * (1 - t) * t * this.controlPoint1.y +
      t * t * this.controlPoint2.y
    return new Point(subControlPoint2X, subControlPoint2Y)
  }
  private getSubEndPoint = (t: number) => {
    const subEndPointX =
      (1 - t) * (1 - t) * (1 - t) * this.startPoint.x +
      3 * t * (1 - t) * (1 - t) * this.controlPoint1.x +
      3 * t * t * (1 - t) * this.controlPoint2.x +
      t * t * t * this.endPoint.x
    const subEndPointY =
      (1 - t) * (1 - t) * (1 - t) * this.startPoint.y +
      3 * t * (1 - t) * (1 - t) * this.controlPoint1.y +
      3 * t * t * (1 - t) * this.controlPoint2.y +
      t * t * t * this.endPoint.y
    return new Point(subEndPointX, subEndPointY)
  }
  public draw = (progress: number, ctx: CanvasRenderingContext2D) => {
    super.draw(0, ctx)
    const subControlPoint1 = this.getSubControlPoint1(progress)
    const subControlPoint2 = this.getSubControlPoint2(progress)
    const subEndPoint = this.getSubEndPoint(progress)
    ctx.moveTo(this.startPoint.x, this.startPoint.y)
    ctx.bezierCurveTo(
      subControlPoint1.x,
      subControlPoint1.y,
      subControlPoint2.x,
      subControlPoint2.y,
      subEndPoint.x,
      subEndPoint.y
    )
    ctx.stroke()
  }
}

/**
 * 直线
 */
export class Line extends Geometry {
  private startPoint: Point
  private endPoint: Point
  constructor(options: LineOptions) {
    super(options)
    const { startPoint, endPoint } = options
    this.startPoint = startPoint
    this.endPoint = endPoint
  }
  public draw = (progress: number, ctx: CanvasRenderingContext2D) => {
    super.draw(0, ctx)
    const endX =
      this.startPoint.x + (this.endPoint.x - this.startPoint.x) * progress
    const endY =
      this.startPoint.y + (this.endPoint.y - this.startPoint.y) * progress
    ctx.moveTo(this.startPoint.x, this.startPoint.y)
    ctx.lineTo(endX, endY)
    ctx.stroke()
  }
}

/**
 * 圆弧
 */
export class Arc extends Geometry {
  private center: Point
  private radius: number
  private startAngle: number
  private endAngle: number
  private counterclockwise: boolean
  constructor(options: ArcOptions) {
    super(options)
    const {
      center,
      radius,
      startAngle,
      endAngle,
      counterclockwise = false
    } = options
    this.center = center
    this.radius = radius
    if (
      startAngle < 0 ||
      endAngle < 0 ||
      startAngle > Math.PI * 2 ||
      endAngle > Math.PI * 2
    ) {
      throw new Error('please pass a angle that is between 0 and 2π')
    }
    this.startAngle = startAngle
    this.endAngle = endAngle
    this.counterclockwise = counterclockwise
  }
  public draw = (progress: number, ctx: CanvasRenderingContext2D) => {
    super.draw(0, ctx)
    let diff = 0
    let end = 0
    if (this.counterclockwise) {
      if (this.startAngle > this.endAngle) {
        diff = this.startAngle - this.endAngle
      } else {
        diff = Math.PI * 2 - (this.endAngle - this.startAngle)
      }
      end = this.startAngle - progress * diff
    } else {
      if (this.startAngle > this.endAngle) {
        diff = Math.PI * 2 - (this.startAngle - this.endAngle)
      } else {
        diff = this.endAngle - this.startAngle
      }
      end = this.startAngle + progress * diff
    }
    ctx.arc(
      this.center.x,
      this.center.y,
      this.radius,
      this.startAngle,
      end,
      this.counterclockwise
    )
    ctx.stroke()
  }
}

/**
 * 椭圆弧
 */
export class Ellipse extends Geometry {
  private center: Point
  private radiusX: number
  private radiusY: number
  private rotation: number
  private startAngle: number
  private endAngle: number
  private counterclockwise: boolean
  constructor(options: EllipseOptions) {
    super(options)
    const {
      center,
      radiusX,
      radiusY,
      rotation = 0,
      startAngle,
      endAngle,
      counterclockwise = false
    } = options
    this.center = center
    this.radiusX = radiusX
    this.radiusY = radiusY
    if (
      startAngle < 0 ||
      endAngle < 0 ||
      startAngle > Math.PI * 2 ||
      endAngle > Math.PI * 2
    ) {
      throw new Error('please pass a angle that is between 0 and 2π')
    }
    this.startAngle = startAngle
    this.endAngle = endAngle
    this.rotation = rotation % (Math.PI * 2)
    if (this.startAngle < 0 || this.endAngle < 0) {
      throw new Error(
        'please pass a positive number as the startAngle or endAngle'
      )
    }
    this.counterclockwise = counterclockwise
  }
  public draw = (progress: number, ctx: CanvasRenderingContext2D) => {
    super.draw(0, ctx)
    let diff = 0
    let end = 0
    if (this.counterclockwise) {
      if (this.startAngle > this.endAngle) {
        diff = this.startAngle - this.endAngle
      } else {
        diff = Math.PI * 2 - (this.endAngle - this.startAngle)
      }
      end = this.startAngle - progress * diff
    } else {
      if (this.startAngle > this.endAngle) {
        diff = Math.PI * 2 - (this.startAngle - this.endAngle)
      } else {
        diff = this.endAngle - this.startAngle
      }
      end = this.startAngle + progress * diff
    }
    ctx.ellipse(
      this.center.x,
      this.center.y,
      this.radiusX,
      this.radiusY,
      this.rotation,
      this.startAngle,
      end,
      this.counterclockwise
    )
    ctx.stroke()
  }
}
