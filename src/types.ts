export type TokenType =
  | 'array'
  | 'attribute'
  | 'boolean'
  | 'nil'
  | 'number'
  | 'object'
  | 'punctuation'
  | 'quotation'
  | 'root'
  | 'string'
  | 'unquotedAttribute'

export type TokenMachine = (token: TokenType, content?: React.ReactNode, as?: string) => JSX.Element
export type ItemKeyGenerator = (item: unknown, basePath: string, index: number) => string
export type NodeWrapper = React.ComponentType<{path: string}>

export type JasonStyles = Partial<Record<TokenType, React.CSSProperties>>
export type JasonClasses = Partial<Record<TokenType, string>>

export interface JasonTheme {
  styles?: JasonStyles
  classes?: JasonClasses
}

export interface JasonContextInstance {
  token: TokenMachine
  getItemKey: ItemKeyGenerator
  nodeWrapper?: NodeWrapper
  quoteAttributes: boolean
}
