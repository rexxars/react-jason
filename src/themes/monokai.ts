import {JasonTheme} from '../types'
import {sharedRoot} from './__shared__'

const theme: JasonTheme = {
  styles: {
    root: Object.assign({}, sharedRoot, {backgroundColor: '#2c2d25'}),
    attribute: {color: '#ddd'},
    unquotedAttribute: {color: '#ddd'},
    string: {color: '#a7e12e'},
    nil: {color: '#fa2572'},
    number: {color: '#ddd'},
    boolean: {color: '#fa2572'},
    punctuation: {color: '#ddd'},
  },
}

module.exports = theme
