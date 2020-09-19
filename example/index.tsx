import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {ReactJason} from '../src/react-jason'

const data = {
  string: 'Heisann',
  number: 123.45,
  boolean: true,
  'its "cool"': 'to fly',
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
      _type: 'image',
      text: 'Coolio',
    },
    {
      _key: 'xyz',
      _type: 'image',
      text: 'Yes',
    },
  ],
}

const App = () => {
  return (
    <div>
      <ReactJason value={data} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
