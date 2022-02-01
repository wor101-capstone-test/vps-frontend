import axios from 'axios'
import React, { useEffect, useState } from 'react'

const baseURL = process.env.REACT_APP_PROD_URL
//const baseURL = process.env.REACT_APP_DEV_URL

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

const Snacks = ({snacks, setSnacks, scallets, setScallets}) => {
  const feedOwlbear = (event) => {
    event.preventDefault()
    const snackId = event.target.snackId.value
    const snackName = event.target.snackName.value
    const snack = snacks.find(snack => snack.id === parseInt(snackId, 10))
    console.log('snack: ', snack)
    try {
      axios.delete(baseURL + `api/data/snack/${snackId}`, {data: snack}).then(response => {
        console.log(response)
        console.log(typeof snackId)
        console.log(typeof snacks[0].id)
        setSnacks(snacks.filter(snack => snack.id !== parseInt(snackId, 10)))
        setScallets([snack, ...scallets])
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
  const [scallets, setScallets] = useState([])
  
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

  // set scallets on loading page
  useEffect(() => {
    console.log('Effect triggered')
    axios
      .get(baseURL + 'api/data/bowels')
      .then(response => {
        setScallets(response.data)
      })
      .catch(error => console.error(error))
  }, [])

  const dropScallet = (event) => {
    event.preventDefault()
    console.log('scallets: ', scallets)
    console.log('Preparing to send scallet drop request')
    console.log(scallets.length)
    if (scallets.length > 0) {
      axios
      .delete(baseURL + 'api/data/bowels', {data: scallets[-1]})
      .then(res => {
        const scallet = scallets[scallets.length - 1]
        window.alert(`One scallet of mostly digested ${scallet.name} left behind`)
        setScallets(scallets.slice(0,scallets.length - 1))
        console.log('New scallets:', scallets)
      })
      .catch(err => {
        console.error('Error adding to bowels', err)
      })
    } else {
      window.alert('Stomach empty! Need snacks!!')
    }

  }


  return (
    <div>
      <h1>I am Owlbear. Feed me!</h1>
      <img alt="Owlbear" src="owlbear.jpg"/><br/>
      <button onClick={getSnacks}>Get Snacks</button>
      <Snacks snacks={snacks} setSnacks={setSnacks}  scallets={scallets} setScallets={setScallets}/>
      <SnackForm snacks={snacks} setSnacks={setSnacks} getSnacks={getSnacks}/>
      <button onClick={dropScallet}>Drop a scallet</button>
      <p>One scallet of a mostly digested</p>
    </div>
  );
}

export default App;
