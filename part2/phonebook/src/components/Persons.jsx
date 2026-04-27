export default function Persons({persons, deletePerson}){

  return persons.map((person, i) => 
    <div key={person.id}>
      <p>{person.name} {person.number}</p>
      <button onClick={() => deletePerson(person)}>delete</button>
    </div>
  )
}