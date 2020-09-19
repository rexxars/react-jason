import {JasonTheme} from '../types'
import {sharedRoot} from './__shared__'

const theme: JasonTheme = {
  styles: {
    root: Object.assign({}, sharedRoot, {backgroundColor: '#23241e'}),
    attribute: {color: '#fa2572'},
    unquotedAttribute: {color: '#fa2572'},
    string: {color: '#e6db74'},
    nil: {color: '#ae81ff'},
    number: {color: '#ae81ff'},
    boolean: {color: '#ae81ff'},
    punctuation: {color: '#f8f8f2'},
  },
}

module.exports = theme
