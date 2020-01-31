const robot = require('robotjs')
const { sleep, waitUntil } = require('./tools')
class Action {
  /**
   * 於指定座標點擊滑鼠按鈕
   * @param {*} coordinate 座標
   * @param {*} button 按鍵('left', 'right', 'middle')
   * @param {*} isSmooth 滑鼠移動是否為滑順的
   */
  async Click (coordinate = {}, times = 1, button = 'left', isSmooth = false) {
    try {
      if (coordinate.x && coordinate.y) {
        let doMethod = isSmooth ? robot.moveMouseSmooth : robot.moveMouse
        doMethod(coordinate.x, coordinate.y)
        while (times > 0) {
          robot.mouseClick(button)
          await sleep(200)
          times--
        }
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }
  /**
   * 於指定座標點擊滑鼠按鈕
   * @param {*} coordinate 座標
   * @param {*} button 按鍵('left' | 'right' | 'middle')
   * @param {*} isSmooth 滑鼠移動是否為滑順的
   */
  async DoubleClick (coordinate = {}, times = 1, button = 'left', isSmooth = false) {
    try {
      if (coordinate.x && coordinate.y) {
        let doMethod = isSmooth ? robot.moveMouseSmooth : robot.moveMouse
        doMethod(coordinate.x, coordinate.y)
        while (times > 0) {
          robot.mouseClick(button)
          robot.mouseClick(button)
          await sleep(200)
          times--
        }
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }
  /**
   * 移動滑鼠至指定座標
   * @param {*} coordinate 座標
   * @param {*} isSmooth 滑鼠移動是否為滑順的
   */
  Hover (coordinate = {}, isSmooth = false) {
    try {
      if (coordinate.x && coordinate.y) {
        let doMethod = isSmooth ? robot.moveMouseSmooth : robot.moveMouse
        doMethod(coordinate.x, coordinate.y)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error(error)
      return false
    }
  }
  /**
   * 拖拉
   * @param {*} source 起始點
   * @param {*} target 目的地
   * @param {*} isSmooth 滑鼠移動是否為滑順的
   */
  Drag (source = {}, target = {}, isSmooth = false) {
    try {
      robot.moveMouse(source.x, source.y)
      robot.mouseToggle('down')
      if (isSmooth) {
        robot.dragMouse(target.x, target.y)
      } else {
        robot.moveMouse(target.x, target.y)
      }
      robot.mouseToggle('up')
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
}

module.exports = Action
