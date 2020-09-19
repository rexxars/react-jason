import {JasonTheme} from '../types'
import {sharedRoot} from './__shared__'

const theme: JasonTheme = {
  styles: {
    root: Object.assign({}, sharedRoot, {backgroundColor: '#fff'}),
    attribute: {color: '#005db1'},
    unquotedAttribute: {color: '#000'},
    string: {color: '#ad0b04'},
    nil: {color: '#141aff'},
    number: {color: '#019162'},
    boolean: {color: '#141aff'},
    punctuation: {color: '#000'},
  },
}

module.exports = theme
