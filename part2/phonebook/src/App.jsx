import { useState } from 'react'

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

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newId, setNewId] = useState(5)
  const [filterString, setFilterString] = useState('')

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
      <h2>Phonebook</h2>
      <div>
          filter shpoown with<input value={filterString} onChange={handleFilterChange}></input>
      </div>
      <form onSubmit={addRegister}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
          phone: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Phonebook entries={persons} filter={filterString}></Phonebook>
    </div>
  )
}

export default App
