import React, {useContext, Fragment} from 'react'
import {JasonContext} from './context'
import {defaultItemKeyGenerator} from './paths'
import {anOldHopeClassic as defaultTheme} from './themes'
import {createTokenMachine, useToken, useTokenMachine} from './context'
import {
  EsModuleJasonTheme,
  ItemKeyGenerator,
  JasonContextInstance,
  JasonTheme,
  NodeType,
  NodeWrapper as INodeWrapper,
  ObjectKeySorter,
} from './types'

export interface JasonProps {
  value: unknown
  theme?: JasonTheme | EsModuleJasonTheme
  nodeWrapper?: INodeWrapper
  quoteAttributes?: boolean
  itemKeyGenerator?: ItemKeyGenerator
  sortKeys?: boolean | ObjectKeySorter
}

const JSON_TYPES = ['string', 'number', 'object', 'boolean']
const isJsonType = (item: unknown): boolean => JSON_TYPES.includes(typeof item)

export const ReactJason = ({
  value,
  theme: wrappedTheme,
  nodeWrapper,
  itemKeyGenerator,
  sortKeys = false,
  quoteAttributes = true,
}: JasonProps) => {
  const token = React.useMemo(
    () => createTokenMachine(wrappedTheme ? unwrapTheme(wrappedTheme) : defaultTheme),
    [wrappedTheme],
  )

  const keySorter = sortKeys === true ? defaultKeySorter : sortKeys
  const getItemKey = itemKeyGenerator || defaultItemKeyGenerator
  const context = React.useMemo<JasonContextInstance>(
    () => ({token, getItemKey, quoteAttributes, nodeWrapper, sortKeys: keySorter}),
    [token, getItemKey, quoteAttributes, nodeWrapper, keySorter],
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
  const wrap = (children: React.ReactElement, type: NodeType) =>
    NodeWrapper ? (
      <NodeWrapper path={path} type={type}>
        {children}
      </NodeWrapper>
    ) : (
      children
    )

  if (value === null) {
    return wrap(<NullNode />, 'nil')
  }

  if (Array.isArray(value)) {
    return wrap(<ArrayNode value={value} path={path} depth={depth} />, 'array')
  }

  switch (typeof value) {
    case 'string':
      return wrap(<StringNode value={value} path={path} depth={depth} />, 'string')
    case 'number':
      return wrap(<NumberNode value={value} path={path} depth={depth} />, 'number')
    case 'boolean':
      return wrap(<BooleanNode value={value} path={path} depth={depth} />, 'boolean')
    case 'object':
      return wrap(
        <ObjectNode value={value as Record<string, unknown>} path={path} depth={depth} />,
        'object',
      )
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
  if (numItems === 0) {
    return token(
      'array',
      <>
        {char('[')}
        {char(']')}
      </>,
    )
  }

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
            {isJsonType(item) ? (
              node({value: item, path: itemPath, depth: depth + 1, nodeWrapper})
            ) : (
              <>&lt;{typeof item}&rt;</>
            )}
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

function ObjectNode({
  value: obj,
  path,
  depth,
}: {
  value: Record<string, unknown>
  path: string
  depth: number
}) {
  const {nodeWrapper, sortKeys} = useContext(JasonContext)
  const {token, char} = useTokenMachine()
  const value = obj as Record<string, unknown>
  const rawKeys = Object.keys(value)
  const keys = sortKeys ? rawKeys.sort((a, b) => sortKeys(a, b, value)) : rawKeys
  const numKeys = keys.length
  const lastKey = numKeys - 1
  if (numKeys === 0) {
    return token(
      'object',
      <>
        {char('{')}
        {char('}')}
      </>,
    )
  }

  return token(
    'object',
    <>
      {char('{')}
      {'\n'}
      {keys.map((key, index) => {
        const val = value[key]
        const propPath = path ? `${path}.${key}` : key
        if (!isJsonType(val)) {
          return null
        }

        return (
          <Fragment key={propPath}>
            <AttributePair
              attribute={key}
              value={val}
              depth={depth}
              path={propPath}
              nodeWrapper={nodeWrapper}
              isLastKey={index === lastKey}
            />
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

function AttributePair({
  attribute,
  value,
  path,
  depth,
  isLastKey,
  nodeWrapper: NodeWrapper,
}: {
  attribute: string
  value: unknown
  path: string
  depth: number
  nodeWrapper?: INodeWrapper
  isLastKey: boolean
}) {
  const {char} = useTokenMachine()
  const pair = (
    <Fragment key={path}>
      {indent(depth)}
      <AttributeNode value={attribute} />
      {node({value, path, depth: depth + 1, nodeWrapper: NodeWrapper})}
      {isLastKey ? (
        '\n'
      ) : (
        <>
          {char(',')}
          {'\n'}
        </>
      )}
    </Fragment>
  )

  return NodeWrapper ? (
    <NodeWrapper type="attributePair" path={path}>
      {pair}
    </NodeWrapper>
  ) : (
    pair
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

function unwrapTheme(theme: JasonTheme | EsModuleJasonTheme): JasonTheme {
  return '__esModule' in theme ? theme.default : theme
}

function defaultKeySorter(keyA: string, keyB: string): number {
  return keyA.localeCompare(keyB)
}
