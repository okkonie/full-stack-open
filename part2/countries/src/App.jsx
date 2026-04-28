import { useState, useEffect } from 'react'
import axios from 'axios'
import Countryinfo from './components/Countryinfo'

const App = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => setResults(response.data))
  }, [])

  const handleQuery = (event) => {
    setQuery(event.target.value);
  }
  
  const shownResults = results.filter(result => result.name.common.toLowerCase().includes(query.toLowerCase()))

  return (
    <div>
      find countries <input value={query} onChange={handleQuery} />

      {shownResults.length < 10 && shownResults.length >= 2 && 
        shownResults.map((result, i) => (
          <p key={i}>
            {result.name.common} <button onClick={() => setQuery(result.name.common)}>Show</button>
          </p>
        ))
      }

      {shownResults.length == 1 && <Countryinfo country={shownResults[0]}/>}
    </div>
  )
}

export default App