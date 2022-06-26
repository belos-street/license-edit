/**
 * 开始括号 openBracket
 * 逻辑符号 logical
 * 许可证 license
 * 闭括号 closeBracket
 */
export type TOpenBracket = {
  type: 'openBracket'
  value: '('
  level: number
  uid: string
}
export type TCloseBracket = {
  type: 'closeBracket'
  value: ')'
  level: number
  uid: string
}
export type TLogical = {
  type: 'logical'
  value: 'or' | 'and'
  level: number
  uid: string
}

export type TLicence = {
  type: 'licence'
  value: string
  level: number
  uid: string
}

export type IEditItem = TOpenBracket | TCloseBracket | TLogical | TLicence

export type IEditData = (
  | Omit<TOpenBracket, 'level' | 'uid'>
  | Omit<TCloseBracket, 'level' | 'uid'>
  | Omit<TLogical, 'level' | 'uid'>
  | Omit<TLicence, 'level' | 'uid'>
)[]

export type TState = 'view' | 'edit'
