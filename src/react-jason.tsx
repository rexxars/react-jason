import React, {useContext, Fragment} from 'react'
import {JasonContext} from './context'
import {defaultItemKeyGenerator} from './paths'
import {defaultTheme} from './themes'
import {createTokenMachine, useToken, useTokenMachine} from './context'
import {JasonTheme, JasonContextInstance, ItemKeyGenerator, NodeWrapper as INodeWrapper} from './types'

export * as themes from './themes'

export interface JasonProps {
  value: unknown
  theme?: JasonTheme
  nodeWrapper?: INodeWrapper
  quoteAttributes?: boolean
  itemKeyGenerator?: ItemKeyGenerator
}

export const ReactJason = ({
  value,
  theme,
  nodeWrapper,
  itemKeyGenerator,
  quoteAttributes = true,
}: JasonProps) => {
  const token = createTokenMachine(theme || defaultTheme)
  const getItemKey = itemKeyGenerator || defaultItemKeyGenerator
  const context = React.useMemo<JasonContextInstance>(
    () => ({token, getItemKey, quoteAttributes, nodeWrapper}),
    [token, getItemKey, quoteAttributes, nodeWrapper],
  )

  return (
    <JasonContext.Provider value={context}>
      {token('root', node({value, path: '', depth: 1, nodeWrapper}), 'pre')}
    </JasonContext.Provider>
  )
}

function node({
  value,
  path,
  depth,
  nodeWrapper: NodeWrapper,
}: {
  value: unknown
  path: string
  depth: number
  nodeWrapper?: INodeWrapper
}): JSX.Element {
  const wrap = (children: React.ReactElement) =>
    NodeWrapper ? <NodeWrapper path={path}>{children}</NodeWrapper> : children

  if (value === null) {
    return wrap(<NullNode />)
  }

  if (Array.isArray(value)) {
    return wrap(<ArrayNode value={value} path={path} depth={depth} />)
  }

  switch (typeof value) {
    case 'string':
      return wrap(<StringNode value={value} path={path} depth={depth} />)
    case 'number':
      return wrap(<NumberNode value={value} path={path} depth={depth} />)
    case 'boolean':
      return wrap(<BooleanNode value={value} path={path} depth={depth} />)
    case 'object':
      return wrap(<ObjectNode value={value as Record<string, unknown>} path={path} depth={depth} />)
    default:
      throw new Error(`Unhandled type ${typeof value}`)
  }
}

function StringNode({value}: {value: string; path: string; depth: number}) {
  const {char} = useTokenMachine()
  const unquoted = json(value).slice(1, -1)
  return useToken(
    'string',
    <>
      {char('"')}
      {unquoted}
      {char('"')}
    </>,
  )
}

function NumberNode({value}: {value: number; path: string; depth: number}) {
  return useToken('number', value)
}

function BooleanNode({value}: {value: boolean; path: string; depth: number}) {
  return useToken('boolean', value ? 'true' : 'false')
}

function ArrayNode({value, path, depth}: {value: unknown[]; path: string; depth: number}) {
  const {token, char} = useTokenMachine()
  const {getItemKey, nodeWrapper} = useContext(JasonContext)
  const numItems = value.length
  return token(
    'array',
    <>
      {char('[')}
      {`\n${indent(depth)}`}
      {value.map((item, index) => {
        const itemPath = getItemKey(item, path, index)
        const isLast = index === numItems - 1
        return (
          <Fragment key={itemPath}>
            {node({value: item, path: itemPath, depth: depth + 1, nodeWrapper})}
            {isLast ? (
              `\n${indent(depth - 1)}`
            ) : (
              <>
                {char(',')}
                {`\n${indent(depth)}`}
              </>
            )}
          </Fragment>
        )
      })}
      {char(']')}
    </>,
  )
}

function ObjectNode({value: obj, path, depth}: {value: Record<string, unknown>; path: string; depth: number}) {
  const {nodeWrapper} = useContext(JasonContext)
  const {token, char} = useTokenMachine()
  const value = obj as Record<string, unknown>
  const keys = Object.keys(value)
  const lastKey = keys.length - 1
  return token(
    'object',
    <>
      {char('{')}
      {'\n'}
      {keys.map((key, index) => {
        const val = value[key]
        const propPath = path ? `${path}.${key}` : key
        return (
          <Fragment key={propPath}>
            {indent(depth)}
            <AttributeNode value={key}/>
            {node({value: val, path: propPath, depth: depth + 1, nodeWrapper})}
            {index < lastKey ? (
              <>
                {char(',')}
                {'\n'}
              </>
            ) : (
              '\n'
            )}
          </Fragment>
        )
      })}
      {indent(depth - 1)}
      {char('}')}
    </>,
  )
}

function AttributeNode({value}: {value: string}) {
  const {quoteAttributes} = useContext(JasonContext)
  const {token, char} = useTokenMachine()
  const attributeName = json(value).slice(1, -1)

  let attribute: React.ReactNode
  if (quoteAttributes || attributeName.includes('"')) {
    attribute = token(
      'attribute',
      <>
        {char('"')}
        {attributeName}
        {char('"')}
      </>,
    )
  } else {
    attribute = token('unquotedAttribute', attributeName)
  }

  return (
    <>
      {attribute}
      {char(':')}{' '}
    </>
  )
}

function NullNode() {
  return useToken('nil', 'null')
}

function json(value: unknown) {
  return JSON.stringify(value)
}

function indent(depth: number): string {
  return '  '.repeat(depth)
}
