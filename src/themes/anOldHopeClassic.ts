import {JasonTheme} from '../types'
import {sharedRoot} from './__shared__'

const theme: JasonTheme = {
  styles: {
    root: Object.assign({}, sharedRoot, {backgroundColor: '#1e2024'}),
    attribute: {color: '#ef415a'},
    unquotedAttribute: {color: '#d1d3d7'},
    string: {color: '#57bedf'},
    nil: {color: '#f2851e'},
    number: {color: '#f2851e'},
    boolean: {color: '#f2851e'},
    punctuation: {color: '#d1d3d7'},
  },
}

export default theme
