# 介绍

- 渐进式地画曲线，支持直线、圆弧、椭圆弧、二阶贝塞尔曲线、三阶贝塞尔曲线

# 使用

假设我要画一条圆弧，那么代码如下：

```typescript
new MyApp({
  canvasContainer: '#App', // canvas标签容器
  items: [
    new Arc({
      center: new Point(400, 400),
      radius: 200,
      startAngle: (Math.PI * 7) / 6,
      endAngle: (Math.PI * 5) / 6,
      duration: 1000, // 这个属性决定了用多长时间来画这个图形，单位：毫秒
      lineWidth: 45
    })
  ], // 要画的一系列图形
  canvasWidth: boundingClientRect.width, // 容器宽度
  canvasHeight: boundingClientRect.height, // 容器高度
  auxiliaryLine: true, // 是否需要辅助线
  mouseCoordinate: true // 是否需要显示鼠标坐标
})
```

如果我要画多个图形，那么在items数组后面追加就行了，如下：

```typescript
new MyApp({
  canvasContainer: '#App', // canvas标签容器
  items: [
    new Arc({
      center: new Point(400, 400),
      radius: 200,
      startAngle: (Math.PI * 7) / 6,
      endAngle: (Math.PI * 5) / 6,
      duration: 1000, // 这个属性决定了用多长时间来画这个图形，单位：毫秒
      lineWidth: 45
    }),
    new QuadraticBezier({
      startPoint: new Point(500, 300),
      controlPoint: new Point(100, 200),
      endPoint: new Point(500, 600),
      duration: 1500
    })
  ], // 要画的一系列图形
  canvasWidth: boundingClientRect.width, // 容器宽度
  canvasHeight: boundingClientRect.height, // 容器高度
  auxiliaryLine: true, // 是否需要辅助线
  mouseCoordinate: true // 是否需要显示鼠标坐标
})
```

items数组中的图形会按照顺序一个接一个地被画出来
