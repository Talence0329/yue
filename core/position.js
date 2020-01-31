const Action = require('./action')

class Position {
  constructor (coordinate, probability, action = new Action(), name = '', image) {
    this.name = name
    this.image = image
    this.coordinate = coordinate
    this.probability = probability
    this.action = action
  }
  Click (times = 1, button = 'left', isSmooth = false) {
    return this.action.Click(this.coordinate, times, button, isSmooth)
  }
  DoubleClick (times = 1, button = 'left', isSmooth = false) {
    return this.action.DoubleClick(this.coordinate, times, button, isSmooth)
  }
  Hover (isSmooth = false) {
    return this.action.Hover(this.coordinate, isSmooth)
  }
}

module.exports = Position
