export default function({parts}){
  const total = parts.reduce((s, p) => s + p.exercises, 0);

  return <p><b>total of {total} exercises</b></p>
}