import { useState, useEffect } from 'react'
import axios  from 'axios'


const Register = ({ entry }) => {
  return <p>{entry.name} {entry.number}</p>
}

const Phonebook = ({ entries, filter }) => {
  const filteredEntries = entries.filter(entry =>
    entry.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {filteredEntries.map(entry => <Register key={entry.id} entry={entry} /> )}
    </div>
  )
}

const Filter = ({ filterString, handleFilterChange }) => {
  return (
    <div>
        filter shown with<input value={filterString} onChange={handleFilterChange}></input>
    </div>
  )
}

const RegisterForm = ({ newName, handleNameChange, newNumber, handleNumberChange, addRegister }) => {
  return (
    <div>
      <form onSubmit={addRegister}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
          phone: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newId, setNewId] = useState(5)
  const [filterString, setFilterString] = useState('')

  const fetchDataHook = () => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }

  useEffect(fetchDataHook, [])

  const alreadyExists = (name, existentNames) => {
    for (let i = 0; i < existentNames.length; i++) {
      if (existentNames[i].name == name) {
        return true
      }
    }
    return false
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterString(event.target.value)
  }

  const addRegister = (event) => {
    event.preventDefault()

    if (alreadyExists(newName, persons)) {
      let alertString = `${newName} already exists`
        alert(alertString)
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber,
      id: newId
    }
    setPersons(persons.concat(newPerson))
    setNewId(newId + 1)
    setNewName("")
    setNewNumber("")
  }

  return (
    <div>
      <h1>Phonebook</h1>

      <Filter
        filterString={filterString}
        handleFilterChange={handleFilterChange}>
      </Filter>

      <h2>Add new</h2>
      <RegisterForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addRegister={addRegister}
      ></RegisterForm>

      <h2>Numbers</h2>
      <Phonebook entries={persons} filter={filterString}></Phonebook>
    </div>
  )
}

export default App
