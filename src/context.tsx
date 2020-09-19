import React, {createContext, createElement, useCallback, useContext} from 'react'
import {defaultTheme} from './themes'
import {JasonContextInstance, JasonTheme, TokenMachine, TokenType} from './types'
import {defaultItemKeyGenerator} from './paths'

export const JasonContext = createContext<JasonContextInstance>({
  token: createTokenMachine(defaultTheme),
  getItemKey: defaultItemKeyGenerator,
  quoteAttributes: true,
})

export function useTokenMachine(): {token: TokenMachine; char: (sym: string) => JSX.Element} {
  const {token} = useContext(JasonContext)
  const char = useCallback(
    (sym: string) => token(sym === '"' || sym === "'" ? 'quotation' : 'punctuation', sym),
    [token],
  )
  return {token, char}
}

export function useToken(token: TokenType, children?: React.ReactNode, as = 'span'): JSX.Element {
  return useTokenMachine().token(token, children, as)
}

export function createTokenMachine(theme: JasonTheme): TokenMachine {
  return function tokenMachine(
    token: TokenType,
    children?: React.ReactNode,
    as = 'span',
  ): JSX.Element {
    const style = theme.styles ? theme.styles[token] : undefined
    const className = theme.classes ? theme.classes[token] : undefined
    const styled = Boolean(style || className)
    return styled ? createElement(as, {style, className}, children) : <>{children}</>
  }
}
