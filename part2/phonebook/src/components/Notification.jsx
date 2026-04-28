export default function Notification({message}){
  return message.text != null 
    ? <h3 className={message.error ? "errorMessage" : "goodMessage"}>{message.text}</h3> 
    : null
}