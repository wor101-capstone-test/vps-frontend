import axios from 'axios'
//import './App.css';

const baseURL = "http://localhost:3001/"

const getData = async () => {
  try {
    return await axios.get(baseURL + "api/data")
  } catch (error) {
    console.error(error)
  }
}

const handleDataClick = (event) => {
  event.preventDefault()
  getData().then(response => {
      console.log("Data Retrieved")
      console.log(response.status)
      console.log(response.data)
    }
  )
}


function App() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <button onClick={handleDataClick}>Get Data</button>
    </div>
  );
}

export default App;
