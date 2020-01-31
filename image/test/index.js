let fs = require('fs')
var path = require('path')
module.exports = {
  /** chips圖片 */
  chips: () => { return { img: fs.readFileSync(path.join(__dirname) + '/chips.jpg'), name: 'chips.jpg' } },
  /** coin圖片 */
  coin: () => { return { img: fs.readFileSync(path.join(__dirname) + '/coin.jpg'), name: 'coin.jpg' } },
  /** folder圖片 */
  folder: () => { return { img: fs.readFileSync(path.join(__dirname) + '/folder.jpg'), name: 'folder.jpg' } },
  /** word圖片 */
  word: () => { return { img: fs.readFileSync(path.join(__dirname) + '/word.jpg'), name: 'word.jpg' } }
}
