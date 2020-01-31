let fs = require('fs')
var path = require('path')
module.exports = {
  /** Line圖片 */
  line: () => { return { img: fs.readFileSync(path.join(__dirname) + '/line.jpg'), name: 'line.jpg' } },
  /** appium圖片 */
  appium: () => { return { img: fs.readFileSync(path.join(__dirname) + '/appium.jpg'), name: 'appium.jpg' } },
  /** chrome圖片 */
  chrome: () => { return { img: fs.readFileSync(path.join(__dirname) + '/chrome.jpg'), name: 'chrome.jpg' } },
  /** laragon圖片 */
  laragon: () => { return { img: fs.readFileSync(path.join(__dirname) + '/laragon.jpg'), name: 'laragon.jpg' } },
  /** file圖片 */
  file: () => { return { img: fs.readFileSync(path.join(__dirname) + '/file.jpg'), name: 'file.jpg' } },
  /** win10圖片 */
  win10: () => { return { img: fs.readFileSync(path.join(__dirname) + '/win10.jpg'), name: 'win10.jpg' } },
  /** test圖片 */
  test: () => { return { img: fs.readFileSync(path.join(__dirname) + '/test.jpg'), name: 'test.jpg' } }
}
