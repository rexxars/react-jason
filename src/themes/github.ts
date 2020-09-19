import {JasonTheme} from '../types'
import {sharedRoot} from './__shared__'

const theme: JasonTheme = {
  styles: {
    root: Object.assign({}, sharedRoot, {backgroundColor: '#f8f8f8'}),
    attribute: {color: '#333'},
    unquotedAttribute: {color: '#333'},
    string: {color: '#de1044'},
    nil: {color: '#008080'},
    number: {color: '#008080'},
    boolean: {color: '#008080'},
    punctuation: {color: '#333'},
  },
}

export default theme
