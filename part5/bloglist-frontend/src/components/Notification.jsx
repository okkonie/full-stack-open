export default function Notification({message}){
  if(!message) return null
  return <p className="message">{message}</p>
}