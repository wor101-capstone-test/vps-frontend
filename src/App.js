import axios from 'axios'
import React, { useState } from 'react'

//import './App.css';

//const baseURL = "http://localhost:3001/"
const baseURL = "http://www.dirtyowlbear.com/"

const getData = async () => {
  try {
    return await axios.get(baseURL + "api/data")
  } catch (error) {
    console.error(error)
  }
}


const SnackForm = ({snacks, setSnacks, getSnacks}) => {
  const addSnack = (event) => {
    event.preventDefault()
    const snackName = event.target.name.value
    if (snackName === '') {
      window.alert("Must include name for tasty snack!")
    } else {
      try {
        axios.post(baseURL + 'api/data/snack', {
          name: snackName,
        })
        event.target.name.value = ''
        window.alert(`Tasty snack named '${snackName}' added to the treats!`)    
      } catch (error) {
        console.error(error)
      }
    }  
  }
  return (
    <form onSubmit={addSnack}>
      <label for="name">Name:</label>
      <input name="name" /><br/>
      <button type="submit">Create Snack</button>
    </form>
  )
}

const Snacks = ({snacks, setSnacks}) => {
  const feedOwlbear = (event) => {
    event.preventDefault()
    const snackId = event.target.snackId.value
    const snackName = event.target.snackName.value
    try {
      axios.delete(baseURL + `api/data/snack/${snackId}`).then(response => {
        console.log(response)
        console.log(typeof snackId)
        console.log(typeof snacks[0].id)
        setSnacks(snacks.filter(snack => snack.id !== parseInt(snackId, 10)))
        window.alert(`Yum yum! '${snackName} was tasty snack!`)
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <ul>
      {snacks.map(snack =>
        <form key={snack.id} onSubmit={feedOwlbear}>
          <input type="hidden" name="snackId" value={snack.id}/>
          <input type="hidden" name="snackName" value={snack.name}/>
          <li>{snack.name} <button type="submit">feed owlbear</button></li>
        </form>
          )}
    </ul>
  )
}


function App() {
  const [snacks, setSnacks] = useState([])
  //const [alert, setAlert] = useState('')

  const getSnacks = (event) => {
    event.preventDefault()
    getData().then(response => {
        console.log("Data Retrieved")
        console.log(response.status)
        console.log(response.data)
        setSnacks(response.data)
      }
    )
  }


  return (
    <div>
      <h1>I am Owlbear. Feed me!</h1>
      <img alt="Owlbear" src="owlbear.jpg"/><br/>
      <button onClick={getSnacks}>Get Snacks</button>
      <Snacks snacks={snacks} setSnacks={setSnacks} />
      <SnackForm snacks={snacks} setSnacks={setSnacks} getSnacks={getSnacks} />
    </div>
  );
}

export default App;
