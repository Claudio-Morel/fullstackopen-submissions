import { useState } from 'react'

const Register = ({ entry }) => {
  return <p>{entry.name}</p>
}

const Phonebook = ({ entries }) => {
  return (
    <div>
      {entries.map(entry => <Register key={entry.name} entry={entry} /> )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

  const alreadyExists = (name, existentNames) => {
    for (let i = 0; i < existentNames.length; i++) {
      if (existentNames[i].name == name) {
        return true
      }
    }
    return false
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const addRegister = (event) => {
    event.preventDefault()

    if (alreadyExists(newName, persons)) {
      let alertString = `${newName} already exists`
        alert(alertString)
      return
    }

    const newPerson = {
      name : newName
    }
    setPersons(persons.concat(newPerson))
    setNewName("")
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addRegister}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Phonebook entries={persons} ></Phonebook>
    </div>
  )
}

export default App
