import * as React from 'react'
import * as ReactDOM from 'react-dom'
import useInput from '@rooks/use-input'
import {ReactJason, themes} from '../src/react-jason'

const prefersDarkMode =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false // use light theme by default?

const data = {
  string: 'Heisann',
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
            name="Quote props"
            onChange={setQuoteAttributes}
            checked={quoteAttributes}
          />
        </label>
      </div>

      <ReactJason value={data} theme={theme} quoteAttributes={quoteAttributes} />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
