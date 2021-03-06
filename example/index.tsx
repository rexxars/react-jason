import * as React from 'react'
import * as ReactDOM from 'react-dom'
import useInput from '@rooks/use-input'
import {ReactJason} from '../src/react-jason'
import * as themes from '../src/themes'

const prefersDarkMode =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : true // use dark theme if we can't infer from OS

const data = {
  string: 'Hello, GitHub',
  number: 123.45,
  boolean: true,
  null: null,
  array: ['one', 'two', 'three'],
  object: {
    nested: {
      fields: 'yes',
    },
  },
  keyedArray: [
    {
      _key: 'abc',
      _type: 'span',
      text: 'Coolio',
    },
    {
      _key: 'xyz',
      _type: 'span',
      text: 'Yes',
    },
  ],
}

const themeList = {
  '': 'VS Code (auto)',
  anOldHopeClassic: 'An Old Hope Classic',
  github: 'GitHub',
  monokai: 'Monokai',
  monokaiSublime: 'Monokai Sublime',
  vscodeDark: 'VS Code (Dark)',
  vscodeLight: 'VS Code (Light)',
}

const App = () => {
  const {value: selectedTheme, onChange: onChangeTheme} = useInput('')
  const [quoteAttributes, setQuoteAttributes] = React.useReducer(prev => !prev, true)
  const [sortKeys, setSortKeys] = React.useReducer(prev => !prev, false)

  let theme = prefersDarkMode ? themes.vscodeDark : themes.vscodeLight
  if (selectedTheme !== '') {
    theme = themes[selectedTheme]
  }

  return (
    <>
      <h1>
        <a href="https://github.com/rexxars/react-jason">react-jason</a> demo
      </h1>

      <div id="controls">
        <select id="theme" onChange={onChangeTheme as any} defaultValue={selectedTheme}>
          {Object.keys(themeList).map(themeName => (
            <option key={themeName} value={themeName}>
              {themeList[themeName]}
            </option>
          ))}
        </select>

        <label>
          Quote properties
          <input
            type="checkbox"
            name="quoteProps"
            onChange={setQuoteAttributes}
            checked={quoteAttributes}
          />
        </label>

        <label>
          Sort keys
          <input type="checkbox" name="sortKeys" onChange={setSortKeys} checked={sortKeys} />
        </label>
      </div>

      <ReactJason
        value={data}
        theme={theme}
        quoteAttributes={quoteAttributes}
        sortKeys={sortKeys}
      />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
