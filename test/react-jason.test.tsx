/* eslint-disable react/jsx-no-bind */
import * as React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import {renderToStaticMarkup} from 'react-dom/server'
import renderer from 'react-test-renderer'
import {github} from '../src/themes'
import {JasonTheme, NodeWrapper} from '../src/types'
import {ReactJason} from '../src/react-jason'
import {sanityItemKeyGenerator} from '../src/paths'

const value = {
  string: 'value',
  number: 13.37,
  bool: true,
  nil: null,
  array: ['primitive', 'values'],
  object: {nested: {arbitrarily: {deep: true}}},
  objectArray: [
    {_key: 'grrm', name: 'George. R. R. Martin'},
    {_key: 'jrrt', name: 'J. R. R. Tolkien'},
  ],
}

const classTheme: JasonTheme = {
  classes: {
    root: 'root',
    attribute: 'attribute',
    unquotedAttribute: 'unquotedAttribute',
    string: 'string',
    nil: 'nil',
    number: 'number',
    boolean: 'boolean',
    punctuation: 'punctuation',
  },
}

describe('react-jason', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div')
    render(<ReactJason value={value} />, div)
    unmountComponentAtNode(div)
  })

  it('renders expected values', () => {
    const component = renderer.create(<ReactJason value={value} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('can specify theme', () => {
    const defaultTheme = renderer.create(<ReactJason value={value} />).toJSON() as any
    const githubTheme = renderer.create(<ReactJason value={value} theme={github} />).toJSON()
    expect(githubTheme).toMatchSnapshot()
    expect(githubTheme).not.toMatchObject(defaultTheme)
  })

  it('can use class-based theme', () => {
    const classBased = renderer.create(<ReactJason value={value} theme={classTheme} />).toJSON()
    expect(classBased).toMatchSnapshot()
  })

  it('can render unquotes props', () => {
    const unquoted = renderToStaticMarkup(<ReactJason value={value} quoteAttributes={false} />)
    expect(unquoted).not.toMatch('&quot;string&quot;')

    const quoted = renderToStaticMarkup(<ReactJason value={value} quoteAttributes />)
    expect(quoted).toMatch('&quot;string&quot;')
  })

  it('can use custom node wrapper', () => {
    const nodeWrapper: NodeWrapper = ({path, children}) => <span data-path={path}>{children}</span>
    const wrapped = renderToStaticMarkup(<ReactJason value={value} nodeWrapper={nodeWrapper} />)
    expect(wrapped).toMatch('data-path="objectArray[1].name"')
  })

  it('can use custom item key generator', () => {
    const nodeWrapper: NodeWrapper = ({path, children}) => <span data-path={path}>{children}</span>
    const wrapped = renderToStaticMarkup(
      <ReactJason
        value={value}
        nodeWrapper={nodeWrapper}
        itemKeyGenerator={sanityItemKeyGenerator}
      />,
    )
    expect(wrapped).not.toMatch('data-path="objectArray[1].name"')
    expect(wrapped).toMatch('data-path="objectArray[_key==&quot;grrm&quot;].name"')
  })
})
