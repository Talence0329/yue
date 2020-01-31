const Image = require('../image')
const Yue = require('../core/yue')
Yue.similar = 0.96;

(async () => {
  await Yue.Wait({ img: Image.desk.win10() }, 30000, true)
  await Yue.Click({ img: Image.desk.win10() })
})()
