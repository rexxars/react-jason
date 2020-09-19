/* eslint-disable @typescript-eslint/ban-ts-comment */
import {ItemKeyGenerator} from './types'

export const defaultItemKeyGenerator: ItemKeyGenerator = (
  // @ts-ignore
  item: unknown,
  basePath: string,
  index: number,
) => {
  return `${basePath}[${index}]`
}

export const sanityItemKeyGenerator: ItemKeyGenerator = (
  item: unknown,
  basePath: string,
  index: number,
) => {
  return isKeyedObject(item) ? `${basePath}[_key=="${item._key}"]` : `${basePath}[${index}]`
}

function isObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

function isKeyedObject(obj: unknown): obj is {_key: string} {
  return isObject(obj) && typeof obj._key === 'string'
}
