import axios from 'axios'
import React, { useState } from 'react'

const baseURL = process.env.REACT_APP_PROD_URL

const getData = async () => {
  try {
    return await axios.get(baseURL + "api/data")
  } catch (error) {
    console.error(error)
  }
}


const SnackForm = ({snacks, setSnacks}) => {
  const addSnack = (event) => {
    event.preventDefault()
    const snackName = event.target.name.value
    if (snackName === '') {
      window.alert("Must include name for tasty snack!")
    } else {
      const sendSnack = async () => {
        try {
          await axios.post(baseURL + 'api/data/snack', { name: snackName, })
          const updatedSnacks = await axios.get(baseURL + "api/data")
          setSnacks(updatedSnacks.data)
          window.alert(`Tasty snack named '${snackName}' added to the treats!`) 
        } catch (err) {
          console.error(err)
        }
      }
      sendSnack()
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
