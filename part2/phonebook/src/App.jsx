import { useState, useEffect } from 'react'
import services from './services'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    services.getAll().then((response) => setPersons(response))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const found = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())

    if(found){
      if(confirm(`${newName} is already added to phonebook, replace old number with new one?`)){
        const updatedPerson = { ...found, number: newNumber }
        services.update(found.id, updatedPerson)
          .then((response) => {
            setPersons(persons.map((person) => person.id !== found.id ? person : response))
          })
      }
    } else {
      services.create({name: newName, number: newNumber})
        .then((response) => {
          setPersons(persons.concat(response))
        })
    }

    setNewName('')
    setNewNumber('')
  }

  const handleChange = (setter) => (event) => {
    setter(event.target.value)
  }

  const deletePerson = (person) => {
    if(confirm(`Delete ${person.name}?`)){
      services.deleteObj(person.id).then(() => {
        setPersons(persons.filter((p) => p.id !== person.id))
      })
    }
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} handleFilterChange={handleChange(setFilter)}/>

      <h3>Add a new</h3>

      <PersonForm 
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleChange(setNewName)}
        handleNumberChange={handleChange(setNewNumber)}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>
      
      <Persons persons={filteredPersons} deletePerson={deletePerson}/>
    </div>
  )

}

export default App