import {
  QuadraticBezier,
  CubicBezier,
  Line,
  Arc,
  Point,
  Ellipse
} from './classes'

export interface BasicOptions {
  duration: number
  waitBeforeStartDrawing?: number
  waitAfterDrawingEnd?: number
  strokeColor?: string
  lineWidth?: number
}

export interface QuadraticBezierOptions extends BasicOptions {
  startPoint: Point
  endPoint: Point
  controlPoint: Point
}

export interface CubicBezierOptions extends BasicOptions {
  startPoint: Point
  endPoint: Point
  controlPoint1: Point
  controlPoint2: Point
}

export interface LineOptions extends BasicOptions {
  startPoint: Point
  endPoint: Point
}

export interface ArcOptions extends BasicOptions {
  center: Point
  radius: number
  startAngle: number
  endAngle: number
  counterclockwise?: boolean
}

export interface EllipseOptions extends BasicOptions {
  center: Point
  radiusX: number
  radiusY: number
  rotation?: number
  startAngle: number
  endAngle: number
  counterclockwise?: boolean
}

export interface Config {
  canvasContainer: string
  items: Array<QuadraticBezier | CubicBezier | Line | Arc | Ellipse>
  auxiliaryLine?: boolean
  mouseCoordinate?: boolean
  canvasWidth: number
  canvasHeight: number
}
