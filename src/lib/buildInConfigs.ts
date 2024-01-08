import { Arc, Ellipse, Point, QuadraticBezier } from './classes'

const buildInConfigs = {
  heart: [
    new QuadraticBezier({
      startPoint: new Point(500, 300),
      controlPoint: new Point(900, 200),
      endPoint: new Point(500, 600),
      duration: 1500
    }),
    new QuadraticBezier({
      startPoint: new Point(500, 300),
      controlPoint: new Point(100, 200),
      endPoint: new Point(500, 600),
      duration: 1500
    })
  ],
  chanelLogo: [
    new Arc({
      center: new Point(400, 400),
      radius: 200,
      startAngle: (Math.PI * 7) / 6,
      endAngle: (Math.PI * 5) / 6,
      duration: 1000,
      lineWidth: 45
    }),
    new Arc({
      center: new Point(700, 400),
      radius: 200,
      startAngle: (Math.PI * 11) / 6,
      endAngle: Math.PI / 6,
      duration: 1000,
      lineWidth: 45,
      counterclockwise: true
    })
  ],
  appleLogo: [
    new Arc({
      center: new Point(700, 400),
      radius: 300,
      startAngle: 0,
      endAngle: Math.PI * 2,
      duration: 100
    }),
    new Arc({
      center: new Point(850, 250),
      radius: 180,
      startAngle: 0,
      endAngle: Math.PI * 2,
      duration: 100
    }),
    new Arc({
      center: new Point(550, 250),
      radius: 180,
      startAngle: 0,
      endAngle: Math.PI * 2,
      duration: 100
    }),
    new Ellipse({
      center: new Point(700, 800),
      radiusX: 300,
      radiusY: 150,
      startAngle: (Math.PI * 7) / 8 + Math.PI,
      endAngle: Math.PI / 8 + Math.PI,
      duration: 100,
      counterclockwise: true
    }),
    new Arc({
      center: new Point(700, 350),
      radius: 350,
      startAngle: 0,
      endAngle: Math.PI * 2,
      duration: 100
    })
    // new Arc({
    //   center: new Point(500, 200),
    //   radius: Math.sqrt(500 * 500 + 200 * 200),
    //   startAngle: 0,
    //   endAngle: Math.PI * 2,
    //   duration: 100
    // })
  ]
}

export default buildInConfigs
