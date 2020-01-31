const Image = require('../image')
const Yue = require('../core/yue');

(async () => {
  await Yue.Wait({ img: Image.desk.file(), region: { width: 300, height: 350 } }, 30000, true)
  await Yue.Drag({ img: Image.desk.file() }, { x: 260, y: 142 })
})()
