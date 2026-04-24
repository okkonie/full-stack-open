const Part = ({part}) => <p>{part.name} {part.exercises}</p>

export default function Content({parts}){
  return parts.map((part) => <Part key={part.id} part={part}/>)
}