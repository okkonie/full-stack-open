import { useState, useEffect } from 'react'
import services from './services'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState({text: null, error: false})

  useEffect(() => {
    services.getAll().then((response) => setPersons(response))

  }, [])

  const handleChange = (setter) => (event) => {
    setter(event.target.value)
  }

  const handleMessage = (message, error = false) => {

    setMessage({text: message, error: error})
    setTimeout(() => {setMessage({text: null, error: false})}, 5000)
  } 

  const addPerson = (event) => {

    event.preventDefault()

    const found = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())

    if(!found){
      services.create({name: newName, number: newNumber})
        .then((response) => {

          setPersons(persons.concat(response))
          handleMessage(`Added ${newName}`)

        }).catch(error => {
            handleMessage(error.response.data.error, true)
        })
    }

    if(found && confirm(`${newName} is already added to phonebook, replace old number with new one?`)){

      const updatedPerson = { ...found, number: newNumber }

      services.update(found.id, updatedPerson)
        .then((response) => {

          setPersons(persons.map((person) => person.id !== found.id ? person : response))
          handleMessage(`Changed number of ${found.name}`)
          
        }).catch(error => {
          handleMessage(`Information of ${updatedPerson.name} has already been removed from server`, true)
        })
    }

    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (person) => {
    if(confirm(`Delete ${person.name}?`)){

      services.deleteObj(person.id).then(() => {

        setPersons(persons.filter((p) => p.id !== person.id))
        handleMessage(`Deleted ${person.name}`)

      })
    }
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} />

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