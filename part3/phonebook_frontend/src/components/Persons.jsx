export default function Persons({persons, deletePerson}){

  return persons.map((person, i) => 
    <p key={person.id}>{person.name} {person.number} <button onClick={() => deletePerson(person)}>delete</button></p>
  )
}