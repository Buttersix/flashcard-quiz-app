import { useState, useEffect, useRef } from 'react'
import FlashcardList from './FlashcardList';
import './app.css'
import axios from 'axios'

function App() {
  const [flashcards, setFlashcards] = useState([])
  const [categories, setCategories] = useState([])

  const categoryEl = useRef()
  const amountEl = useRef()

  useEffect(() => {
    axios.get('https://opentdb.com/api_category.php')
      .then(response => {
        setCategories(response.data.trivia_categories)
      })
  })

  useEffect(() => {
    
  }, [])

  function decodeString(str) {
    const textArea = document.createElement('textarea')
    textArea.innerHTML = str
    return textArea.value
  }

  function handleSubmit(e) {
    e.preventDefault()
    axios
      .get('https://opentdb.com/api.php', {
        params: {
          amount: amountEl.current.value,
          category: categoryEl.current.value
        }
      })
      .then(response => {
        setFlashcards(response.data.results.map((questionItem, index) => {
          const answer = questionItem.correct_answer
          const options = [
            ...questionItem.incorrect_answers.map(answer => decodeString(answer)),
            decodeString(answer)
          ]
          return {
            id: `${index}-${Date.now()}`,
            question: decodeString(questionItem.question),
            answer: answer,
            options: options.sort(() => Math.random())
          }
        }))
      })
  }

  return (
    <>
    <form className='header' onSubmit={handleSubmit}>
      <div className='form-group'>
        <label htmlFor='category'>Category</label>
        <select id='category' ref={categoryEl}>
          {categories.map(category => {
            return <option value={category.id} key={category.id}>
              {category.name}
            </option>
          })}
        </select>
      </div>
      <div className='form-group'>
        <label htmlFor='amount'>Number of Questions</label>
        <input type='number' id='amount' min='1' step='1' defaultValue={10} ref={amountEl}></input>
      </div>
      <div className='form-group'>
        <button className='btn'>Generate</button>
      </div>
    </form>
      <div className='container'>
        <FlashcardList flashcards={flashcards} />
      </div>
    </>
  );
}

export default App;
