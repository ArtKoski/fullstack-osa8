
import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { ALL_BOOKS } from '../queries'

const Books = (props) => { 
  const resultAll = useQuery(ALL_BOOKS)

  const [filter, setFilter] = useState('all')  
  

  if (resultAll.loading)  {
    return <div>loading...</div>
  }
  const books = resultAll.data.allBooks
    
  let allGenres = []
  books.map(book => book.genres).map(genre => allGenres.push(genre))
  let genresCombined = ([...new Set(allGenres.map(book => book))]) 
    
  const filteredBooks = filter !== 'all' ? books.filter(book => book.genres.includes(filter[0])) : books

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {filteredBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={() => setFilter('all')}>all</button>
      {genresCombined.map(genre => 
          <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>
        )}
    </div>
  )
}

export default Books