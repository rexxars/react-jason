export type TokenType =
  | 'array'
  | 'attribute'
  | 'attributePair'
  | 'boolean'
  | 'nil'
  | 'number'
  | 'object'
  | 'punctuation'
  | 'quotation'
  | 'root'
  | 'string'
  | 'unquotedAttribute'

export type NodeType =
  | 'array'
  | 'attributePair'
  | 'boolean'
  | 'nil'
  | 'number'
  | 'object'
  | 'string'

export type TokenMachine = (token: TokenType, content?: React.ReactNode, as?: string) => JSX.Element
export type ItemKeyGenerator = (item: unknown, basePath: string, index: number) => string
export type NodeWrapper = React.ComponentType<{path: string; type: NodeType}>

export type JasonStyles = Partial<Record<TokenType, React.CSSProperties>>
export type JasonClasses = Partial<Record<TokenType, string>>

export interface EsModuleJasonTheme {
  __esModule: true
  default: JasonTheme
}

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
