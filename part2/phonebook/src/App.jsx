import { useState, useEffect } from 'react'
import personsService from './services/persons'


const Register = ({ entry, eraseHandler }) => {
  return <div>
    {entry.name} {entry.number} <button onClick={eraseHandler}>delete</button>
  </div>
}

const Phonebook = ({ entries, setEntries, filter }) => {
  const filteredEntries = entries.filter(entry =>
    entry.name.toLowerCase().includes(filter.toLowerCase())
  );

  const generateEraseHandler = (toErase) => {
    return (
      () => {
        console.log(`${toErase.id} is going to be erased`)
        if (confirm(`are you sure you want to delete ${toErase.id} (${toErase.name})?`)) {
          personsService.erase(toErase.id)
          const updatedEntries = entries.filter(entry => entry.id != toErase.id)
          setEntries(updatedEntries)
          console.log(`${toErase.id} correctly deleted`)
        }
        else {
          console.log(`${toErase.id} was not deleted`)
        }
      }
    )
  }
  return (
    <div>
      {filteredEntries.map((entry) =>
        <Register
          key={entry.id}
          entry={entry}
          eraseHandler={generateEraseHandler(entry)}
        />
      )}
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

const RegisterForm = ({ newName, handleNameChange, newNumber, handleNumberChange, handleForm }) => {
  return (
    <div>
      <form onSubmit={handleForm}>
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
  const [filterString, setFilterString] = useState('')

  const fetchDataHook = () => {
    personsService.getAll()
      .then(response => {
      setPersons(response)
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

  const updateNumber = () => {
    let updateString = `${newName} already exists in phonebook, do you want to update his number?`
    if (confirm(updateString)) {
      const originalPerson = persons.find(person => person.name === newName)
      const updatedPerson = { ...originalPerson, number: newNumber }

      console.log(originalPerson)
      console.log(updatedPerson)

      personsService.
        update(originalPerson.id, updatedPerson)
        .then(
          returnedPerson => {
            setPersons(persons.map(person => person.id === originalPerson.id ? returnedPerson : person))
            setNewName("")
            setNewNumber("")
          }
        )
    }
  }

  const addNumber = () => {
    const newPerson = {
      name: newName,
      number: newNumber
    }

    personsService
      .create(newPerson)
      .then(response => {
        setPersons(persons.concat(response))
        setNewName("")
        setNewNumber("")
      })
  }

  const handleForm = (event) => {
    event.preventDefault()

    if (alreadyExists(newName, persons)) {
      updateNumber()
    } else {
      addNumber()
    }
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
        handleForm={handleForm}
      ></RegisterForm>

      <h2>Numbers</h2>
      <Phonebook
        entries={persons}
        setEntries={setPersons}
        filter={filterString}></Phonebook>
    </div>
  )
}

export default App
