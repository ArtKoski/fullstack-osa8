import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'


const BirthyearChange = ( {authors} ) => {

    const [name, setName] = useState('')
    const [born, setBorn] = useState('')

    const [ editAuthor ] = useMutation(EDIT_AUTHOR, 
        {
          refetchQueries: [ {query: ALL_AUTHORS} ]
        })
    

    const submit = async (event) => {
     event.preventDefault()
 
     editAuthor({variables: {name, born}})
 
     setName('')
     setBorn('')
  }    

  return (
    <div>
        <h3>set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          author
          <select value={name} onChange={({target}) => setName(target.value)}> 
              {authors.map(author => 
                <option key={author.name} value={author.name}>
                    {author.name}
                </option>
                    )}
          </select>
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type='submit'>update author</button>
        </form>
    </div>
    )
}

export default BirthyearChange