// #region 參數設定
// #endregion
// #region reqire
var path = require('path')
const robotjs = require('robotjs')
const cv = require('opencv')
const sharp = require('sharp')
const imageType = require('image-type')
const { CCTV, Action, Position } = require('.')
const { sleep, waitUntil } = require('.').Tools
const YueExcute = require('.').YueExcute
// #endregion

class Yue {
  constructor (config) {
    // 相似度 範圍0.00~1.00
    this.similar = 0.9
    this.maxAmount = 5
    this.method = 6
    this.timeout = 5000
    this.interval = 200
    this.region = {}
    this.log = true
    this.CCTV = new CCTV()
    this.Action = new Action()
  }
  get robotjs () {
    return robotjs
  }
  get YueExcute () {
    return YueExcute
  }
  /**
   * 分析圖片於目前畫面存在狀況
   * @param {Object} imageItem 欲進行操作的圖片，{img: { img, name }, similar(相似度): 0.01~0.99, region(區塊): {x: x偏移量, y: y偏移量, width: 寬度, height: 高度}}
   * @param {Boolean} maxAmount 最多回傳組數
   * @returns {Position | Boolean | Error} 成功時回傳Position物件，失敗時依returnBoolean參數做相應處理
   */
  Analysis ({ img: { img: image, name, path: imgPathParam }, similar = this.similar, region: { x, y, width, height } = this.region }, maxAmount = this.maxAmount) {
    return new Promise(async (resolve, reject) => {
      let method = this.method
      // 基本檢查
      if (!image || !name) {
        console.error('lack of img or img not object')
        return reject(new Error(false))
      }
      let imgPath = name
      if (imgPathParam) {
        let referPiece = path.dirname(process.mainModule.filename).split('\\')
        imgPath = imgPathParam.split('\\').filter((element, index) => element !== referPiece[index]).join('\\')
      }
      // 檢查目標圖片格式
      if (!Yue.IsImage(image)) {
        return reject(new Error(imgPath + 'image type not valid'))
      }
      // 處理目標圖像
      let target = await Yue.TransToJpg(image)
      // 處理監視畫面範圍
      let screen = await this.CCTV.getFrame(...[x, y, width, height])
      // 開始分析處理
      let targetMat, targetWidth, targetHeight
      let screenMat, screenWidth, screenHeight
      let findResult = []
      // 裝載圖片
      try {
        cv.readImage(target, (err, mat) => {
          if (err) { throw Error(imgPath + ' ' + err) }
          targetMat = mat
          targetWidth = mat.width()
          targetHeight = mat.height()
        })
        cv.readImage(screen, (err, mat) => {
          if (err) { throw Error(imgPath + ' ' + err) }
          screenMat = mat
          screenWidth = mat.width()
          screenHeight = mat.height()
        })
      } catch (error) {
        return reject(new Error(imgPath + ' ' + error))
      }
      // 判斷目標圖片大小是否小於監視畫面範圍大小
      if (screenWidth < targetWidth || screenHeight < targetHeight) {
        return reject(new Error(imgPath + ' ' + 'image is too big for area to find'))
      }
      // 圖片比對
      try {
        let output = screenMat.matchTemplateByMatrix(targetMat, method)
        let matches = output.templateMatches(similar, 1.0, maxAmount, false)
        // 整理結果
        matches.forEach((element) => {
          let newElement = {}
          if (element.x || element.x === 0) newElement.x = element.x + targetWidth / 2 + (!x ? 0 : x)
          if (element.y || element.y === 0) newElement.y = element.y + targetHeight / 2 + (!y ? 0 : y)
          if (element.probability) newElement.probability = element.probability
          if (newElement) {
            findResult.push(new Position({ x: newElement.x, y: newElement.y }, newElement.probability, this.Action, name, image))
          }
        })
      } catch (error) {
        return reject(new Error(imgPath + ' ' + error))
      }
      // 回傳結果
      if (findResult.length === 0) {
        return resolve(false)
      } else {
        return resolve(findResult)
      }
    }).then((ret) => {
      return ret
    }).catch((error) => {
      if (error instanceof Error) {
        throw error
      } else {
        throw new Error(error)
      }
    })
  }
  /**
   * 傳入圖片和相似度，得到座標結果
   * @param {Object} imageItem 欲進行操作的圖片，{img: { img, name }, similar(相似度): 0.01~0.99, region(區塊): {x: x偏移量, y: y偏移量, width: 寬度, height: 高度}}
   * @param {Boolean} returnBoolean 是否回傳true/false
   * @returns {Position | Boolean | Error} 成功時回傳Position物件，失敗時依returnBoolean參數做相應處理
   */
  async Find (imageItem, returnBoolean = false) {
    return new Promise(async (resolve, reject) => {
      let result = false
      let imgPath = ''
      try {
        this.ConsoleLog()
        this.ConsoleLog('==========')
        imgPath = imageItem.img.name
        if (imageItem.img.path) {
          let referPiece = path.dirname(process.mainModule.filename).split('\\')
          imgPath = imageItem.img.path.split('\\').filter((element, index) => element !== referPiece[index]).join('\\')
        }
        this.ConsoleLog('Find ' + imgPath)
      } catch (error) {
        reject(new Error('missing img or name ' + error))
      }
      try {
        result = await this.Analysis(imageItem, 1).catch(error => { throw error })
        this.ConsoleLog()
      } catch (error) {
        return reject(error)
      }
      if (!result) {
        return reject(new Error(imgPath + ' not found'))
      } else {
        return resolve(result[0])
      }
    }).then((ret) => {
      this.ConsoleLog('success')
      this.Pause(this.interval)
      return ret
    }).catch((error) => {
      return this.HandleError(returnBoolean, error)
    })
  }
  /**
   * 傳入圖片和相似度，得到多個座標結果
   * @param {Object} imageItem 欲進行操作的圖片，{img: { img, name }, similar(相似度): 0.01~0.99, region(區塊): {x: x偏移量, y: y偏移量, width: 寬度, height: 高度}}
   * @param {Boolean} returnBoolean 是否回傳true/false
   * @param {number} maxAmount 最多回傳組數
   * @returns {Position | Boolean | Error} 成功時回傳Position物件，失敗時依returnBoolean參數做相應處理
   */
  async FindMulti (imageItem, returnBoolean = false, maxAmount = this.maxAmount) {
    return new Promise(async (resolve, reject) => {
      let result = false
      let imgPath = ''
      try {
        this.ConsoleLog()
        this.ConsoleLog('==========')
        imgPath = imageItem.img.name
        if (imageItem.img.path) {
          let referPiece = path.dirname(process.mainModule.filename).split('\\')
          imgPath = imageItem.img.path.split('\\').filter((element, index) => element !== referPiece[index]).join('\\')
        }
        this.ConsoleLog('Find Multi ' + imgPath)
      } catch (error) {
        reject(new Error('missing img or name ' + error))
      }
      try {
        result = await this.Analysis(imageItem, maxAmount).catch(error => { throw error })
        this.ConsoleLog()
      } catch (error) {
        return reject(error)
      }
      if (!result) {
        return reject(new Error(imgPath + ' not found'))
      } else {
        return resolve(result)
      }
    }).then((ret) => {
      this.ConsoleLog('success')
      this.Pause(this.interval)
      return ret
    }).catch((error) => {
      return this.HandleError(returnBoolean, error)
    })
  }
  /**
   * 傳入圖片和相似度，等待相符結果出現
   * @param {Object} imageItem 欲進行操作的圖片，{img: { img, name }, similar(相似度): 0.01~0.99, region(區塊): {x: x偏移量, y: y偏移量, width: 寬度, height: 高度}}
   * @param {Number} timeout 等待時間
   * @param {Boolean} returnBoolean 是否回傳true/false
   * @param {Number} interval 時間間隔
   * @requires {Boolean | Error} 成功時回傳true，失敗時依returnBoolean參數做相應處理
   */
  async Wait (imageItem, timeout = this.timeout, returnBoolean = false, interval = this.interval) {
    let result = false
    let imgPath = ''
    try {
      this.ConsoleLog()
      this.ConsoleLog('==========')
      imgPath = imageItem.img.name
      if (imageItem.img.path) {
        let referPiece = path.dirname(process.mainModule.filename).split('\\')
        imgPath = imageItem.img.path.split('\\').filter((element, index) => element !== referPiece[index]).join('\\')
      }
      this.ConsoleLog('Wait ' + imgPath + ' ' + timeout + 'ms')
    } catch (error) {
      return this.HandleError(returnBoolean, 'missing img or name')
    }
    await waitUntil(async () => {
      try {
        let tempRet = await this.Analysis(imageItem).catch(error => { throw error })
        return tempRet
      } catch (error) {
        throw error
      }
    }, timeout, interval, imgPath + ' wait over ' + timeout).then((ret) => {
      result = true
    }).catch((error) => {
      return this.HandleError(returnBoolean, error)
    })
    if (result) {
      this.ConsoleLog('success')
      this.Pause(this.interval)
      return result
    } else {
      return this.HandleError(returnBoolean, imgPath + ' wait over ' + timeout)
    }
  }
  /**
   * 傳入圖片和相似度，等待相符結果出現的同時執行其他動作
   * @param {Object} imageItem 欲進行操作的圖片，{img: { img, name }, similar(相似度): 0.01~0.99, region(區塊): {x: x偏移量, y: y偏移量, width: 寬度, height: 高度}}
   * @param {Number} timeout 等待時間
   * @param {Boolean} returnBoolean 是否回傳true/false
   * @param {Number} interval 時間間隔
   * @requires {Boolean | Error} 成功時回傳true，失敗時依returnBoolean參數做相應處理
   */
  /*
  async WaitWhile (imageItem, callFlow = async () => {}, timeout = this.timeout, returnBoolean = false, interval = this.interval) {
    let result = false
    try {
      this.ConsoleLog()
      this.ConsoleLog('==========')
      this.ConsoleLog('Wait ' + imageItem.img.name + ' ' + timeout + 'ms')
    } catch (error) {
      return this.HandleError(returnBoolean, 'missing img or name')
    }
    try {
      waitUntil(async () => {
        let tempRet = await this.Analysis(imageItem)
        return tempRet
      }, timeout, interval, imageItem.img.name + ' wait over ' + timeout).then((ret) => {
        result = true
      }).catch((error) => {
        console.error(error)
        result = false
      })
      callFlow()
      await waitUntil(() => {
        return result === true
      }, timeout, 1000).then(() => {
        this.ConsoleLog('success')
        return result
      }).catch((error) => {
        console.error(error)
        return this.HandleError(returnBoolean, imageItem.img.name + ' wait over ' + timeout)
      })
    } catch (error) {
      console.log('catch!')
      console.log(error)
    }
    // if (result) {
    //   this.ConsoleLog('success')
    //   return result
    // } else {
    //   return this.HandleError(returnBoolean, imageItem.img.name + ' wait over ' + timeout)
    // }
  }
  */
  /**
   * 傳入圖片和相似度，將滑鼠移動到目標上
   * @param {Object} imageItem 欲進行操作的圖片，{img: { img, name }, similar(相似度): 0.01~0.99, region(區塊): {x: x偏移量, y: y偏移量, width: 寬度, height: 高度}}
   * @param {Boolean} returnBoolean 是否回傳true/false
   * @param {Boolean} isSmooth 是否滑順移動
   * @requires {Boolean | Error} 成功時回傳true，失敗時依returnBoolean參數做相應處理
   */
  async Hover (imageItem, returnBoolean = false, isSmooth = false) {
    let result = false
    let imgPath = ''
    try {
      this.ConsoleLog()
      this.ConsoleLog('==========')
      imgPath = imageItem.img.name
      if (imageItem.img.path) {
        let referPiece = path.dirname(process.mainModule.filename).split('\\')
        imgPath = imageItem.img.path.split('\\').filter((element, index) => element !== referPiece[index]).join('\\')
      }
      this.ConsoleLog('Hover ' + imgPath)
    } catch (error) {
      return this.HandleError(returnBoolean, 'missing img or name')
    }
    try {
      result = await this.Analysis(imageItem, 1).catch(error => { throw error })
      this.ConsoleLog()
    } catch (error) {
      return this.HandleError(returnBoolean, error)
    }
    if (!result) {
      return this.HandleError(returnBoolean, imgPath + ' not found')
    }
    if (result[0].Hover(isSmooth)) {
      this.ConsoleLog('success')
      this.Pause(this.interval)
      return true
    } else {
      return this.HandleError(returnBoolean, 'Hover ' + imgPath + ' fail')
    }
  }
  /**
   * 傳入兩組圖片和相似度，將滑鼠從起始點拖拉到目的地
   * @param {Object} source 欲進行操作的圖片，{img: { img, name }, similar(相似度): 0.01~0.99, region(區塊): {x: x偏移量, y: y偏移量, width: 寬度, height: 高度}}
   * @param {Object} target 欲進行操作的圖片，{img: { img, name }, similar(相似度): 0.01~0.99, region(區塊): {x: x偏移量, y: y偏移量, width: 寬度, height: 高度}}
   * @param {Boolean} returnBoolean 是否回傳true/false
   * @param {Boolean} isSmooth 是否滑順移動
   * @requires {Boolean | Error} 成功時回傳true，失敗時依returnBoolean參數做相應處理
   */
  async Drag (source, target, returnBoolean = false, isSmooth = false) {
    let sourcePosition, targetPosition
    let sourcePath = ''
    let targetPath = ''
    try {
      this.ConsoleLog()
      this.ConsoleLog('==========')
      sourcePath = source.img.name
      targetPath = target.img.name
      let referPiece = path.dirname(process.mainModule.filename).split('\\')
      if (source.img.path) {
        sourcePath = source.img.path.split('\\').filter((element, index) => element !== referPiece[index]).join('\\')
      }
      if (target.img.path) {
        targetPath = target.img.path.split('\\').filter((element, index) => element !== referPiece[index]).join('\\')
      }
      let sourceName = source.x && source.y ? 'x: ' + source.x + ' y: ' + source.y : sourcePath
      let targetName = target.x && target.y ? 'x: ' + target.x + ' y: ' + target.y : targetPath
      this.ConsoleLog('Drag ' + sourceName + ' to ' + targetName)
    } catch (error) {
      return this.HandleError(returnBoolean, 'missing img or name')
    }
    try {
      if (source.x && source.y) {
        sourcePosition = { coordinate: { x: source.x, y: source.y } }
      } else {
        sourcePosition = await this.Analysis(source, 1)
        sourcePosition = sourcePosition[0]
      }
      if (target.x && target.y) {
        targetPosition = { coordinate: { x: target.x, y: target.y } }
      } else {
        targetPosition = await this.Analysis(target, 1)
        targetPosition = targetPosition[0]
      }
      this.ConsoleLog()
    } catch (error) {
      console.log(error)
      return this.HandleError(returnBoolean, sourcePath + ' ' + targetPath + ' analysis fail' + error)
    }
    if (!sourcePosition || !targetPosition) {
      return this.HandleError(returnBoolean, sourcePath + ' ' + targetPath + ' not found')
    }
    if (this.Action.Drag(sourcePosition.coordinate, targetPosition.coordinate, isSmooth)) {
      this.ConsoleLog('success')
      this.Pause(this.interval)
      return true
    } else {
      return this.HandleError(returnBoolean, 'Drag ' + sourcePath + ' to ' + targetPath + ' fail')
    }
  }
  /**
   * 傳入圖片和相似度，將滑鼠移動到目標上並點擊
   * @param {Object} imageItem 欲進行操作的圖片，{img: { img, name }, similar(相似度): 0.01~0.99, region(區塊): {x: x偏移量, y: y偏移量, width: 寬度, height: 高度}}
   * @param {Boolean} returnBoolean 是否回傳true/false
   * @param {String} button 按鍵('left' | 'right' | 'middle')
   * @param {Boolean} isSmooth 是否滑順移動
   * @requires {Boolean | Error} 成功時回傳true，失敗時依returnBoolean參數做相應處理
   */
  async Click (imageItem, returnBoolean = false, times = 1, button = 'left', isSmooth = false) {
    let result = false
    let imgPath = ''
    try {
      this.ConsoleLog()
      this.ConsoleLog('==========')
      imgPath = imageItem.img.name
      if (imageItem.img.path) {
        let referPiece = path.dirname(process.mainModule.filename).split('\\')
        imgPath = imageItem.img.path.split('\\').filter((element, index) => element !== referPiece[index]).join('\\')
      }
      this.ConsoleLog('Click ' + imgPath)
    } catch (error) {
      return this.HandleError(returnBoolean, 'missing img or name')
    }
    try {
      result = await this.Analysis(imageItem, 1)
      this.ConsoleLog()
    } catch (error) {
      return this.HandleError(returnBoolean, error)
    }
    if (!result) {
      return this.HandleError(returnBoolean, imgPath + ' not found')
    }
    if (result[0].Click(times, button, isSmooth)) {
      this.ConsoleLog('success')
      this.Pause(this.interval)
      return true
    } else {
      return this.HandleError(returnBoolean, 'Click ' + imgPath + ' fail')
    }
  }
  /**
   * 傳入圖片和相似度，將滑鼠移動到目標上並雙點擊
   * @param {Object} imageItem 欲進行操作的圖片，{img: { img, name }, similar(相似度): 0.01~0.99, region(區塊): {x: x偏移量, y: y偏移量, width: 寬度, height: 高度}}
   * @param {Boolean} returnBoolean 是否回傳true/false
   * @param {String} button 按鍵('left' | 'right' | 'middle')
   * @param {Boolean} isSmooth 是否滑順移動
   * @requires {Boolean | Error} 成功時回傳true，失敗時依returnBoolean參數做相應處理
   */
  async DoubleClick (imageItem, returnBoolean = false, times = 1, button = 'left', isSmooth = false) {
    let result = false
    let imgPath
    try {
      this.ConsoleLog()
      this.ConsoleLog('==========')
      imgPath = imageItem.img.name
      if (imageItem.img.path) {
        let referPiece = path.dirname(process.mainModule.filename).split('\\')
        imgPath = imageItem.img.path.split('\\').filter((element, index) => element !== referPiece[index]).join('\\')
      }
      this.ConsoleLog('DoubleClick ' + imgPath)
    } catch (error) {
      return this.HandleError(returnBoolean, 'missing img or name')
    }
    try {
      result = await this.Analysis(imageItem, 1)
      this.ConsoleLog()
    } catch (error) {
      return this.HandleError(error)
    }
    if (!result) {
      return this.HandleError(returnBoolean, imgPath + ' not found')
    }
    if (result[0].DoubleClick(times, button, isSmooth)) {
      this.ConsoleLog('success')
      this.Pause(this.interval)
      return true
    } else {
      return this.HandleError(returnBoolean, 'DoubleClick ' + imgPath + ' fail')
    }
  }
  /**
   * 暫停
   * @param {*} waittime 暫停時間(ms)
   */
  async Pause (waittime = 0) {
    await sleep(waittime)
  }
  /**
   * 將PNG轉成JPG
   * @param {Buffer} image 欲進行操作的圖片，Buffer
   */
  static async TransToJpg (image) {
    if (imageType(image).ext === 'png') {
      return new Promise(async (resolve, reject) => {
        try {
          let result = await sharp(image).jpeg().toBuffer()
          if (result) {
            return resolve(result)
          } else { return reject(new Error(false)) }
        } catch (error) {
          return reject(error)
        }
      }).then((ret) => {
        return ret
      }).catch((err) => {
        console.error('Yue.TransToJpg: ' + err)
        return false
      })
    }
    return image
  }
  /**
   * 檢查圖片是否可為Yue所用
   * @param {Buffer} image 欲檢查的圖片(需先轉成Buffer，不可為路徑)
   * @returns {boolean} 是/否
   */
  static IsImage (image) {
    return ['jpg', 'png'].indexOf(imageType(image).ext) > -1
  }
  HandleError (returnBoolean = false, msg = '') {
    this.Pause(this.interval)
    if (returnBoolean) {
      console.error(msg)
      return false
    } else {
      if (msg instanceof Error) {
        throw msg
      } else {
        throw Error(msg)
      }
    }
  }
  Config (config) {
    if (typeof config === 'object') {
      try {
        Object.keys(config).forEach((element, index) => {
          this[element] = config[element]
        })
      } catch (error) {
        console.error('something wrong with config')
      }
    }
  }
  ConsoleLog (msg) {
    if (this.log && msg) {
      console.log(msg)
    } else if (this.log) {
      console.log()
    }
  }
}

module.exports = new Yue()
