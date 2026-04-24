export default function Persons({persons}){
  return persons.map((person, i) => <p key={i}>{person.name} {person.number}</p>)
}