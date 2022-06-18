// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = (
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  const [value, setValue] = React.useState(() => {
    const localStorageItem = window.localStorage.getItem(key)

    if (localStorageItem) {
      return deserialize(localStorageItem)
    }

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevRefKey = React.useRef(key)

  React.useEffect(() => {
    console.log(key, prevRefKey)
    if (key !== prevRefKey.current) {
      window.localStorage.removeItem(prevRefKey.current)
    }
    prevRefKey.current = key
    window.localStorage.setItem(key, serialize(value))
  }, [key, serialize, value])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName={'Pepito'} />
}

export default App
