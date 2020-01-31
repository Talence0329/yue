/**
 * CCTV 監視器
 * 提供程序桌面監控畫面
 */
// #region 參數設定
// #endregion
// #region reqire
var robotjs = require('robotjs')
var screenshot = require('screenshot-desktop')
var sharp = require('sharp')
// #endregion
// ./ffmpeg -f gdigrab -framerate 60 -offset_x 0 -offset_y 0 -video_size 1920x1080 -i desktop -c:v libx264rgb -crf 0 -pix_fmt bgra -preset ultrafast test.mp4
class CCTV {
  constructor (offsetX = 0, offsetY = 0, sizeX = robotjs.getScreenSize().width, sizeY = robotjs.getScreenSize().height) {
    this.offsetX = offsetX
    this.offsetY = offsetY
    this.sizeX = sizeX
    this.sizeY = sizeY
    this.maxWidth = robotjs.getScreenSize().width
    this.maxHeight = robotjs.getScreenSize().height
  }
  /**
   * 取得當前畫面圖片
   * @param {*} offsetX 設定x座標偏移量(預設為CCTV的值)
   * @param {*} offsetY 設定y座標偏移量(預設為CCTV的值)
   * @param {*} sizeX 設定x軸距(預設為CCTV的值)
   * @param {*} sizeY 設定y軸距(預設為CCTV的值)
   */
  async getFrame (offsetX = 0, offsetY = 0, sizeX = this.sizeX, sizeY = this.sizeY) {
    let frame
    await screenshot().then(
      (img) => {
        frame = img
      })
    offsetX = offsetX + this.offsetX
    offsetY = offsetY + this.offsetY
    sizeX = sizeX + offsetX > this.maxWidth ? this.maxWidth - offsetX : sizeX
    sizeY = sizeY + offsetY > this.maxHeight ? this.maxHeight - offsetY : sizeY
    await sharp(frame).extract({ width: sizeX, height: sizeY, left: offsetX, top: offsetY }).toBuffer().then((image) => {
      frame = image
    })
    return frame
  }
}

module.exports = CCTV
