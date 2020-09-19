import {JasonTheme} from '../types'
import {sharedRoot} from './__shared__'

const theme: JasonTheme = {
  styles: {
    root: Object.assign({}, sharedRoot, {backgroundColor: '#212121'}),
    attribute: {color: '#a5e1ff'},
    unquotedAttribute: {color: '#d9d9d9'},
    string: {color: '#d49a81'},
    nil: {color: '#5da8dd'},
    number: {color: '#bed4b0'},
    boolean: {color: '#5da8dd'},
    punctuation: {color: '#d9d9d9'},
  },
}

export default theme
