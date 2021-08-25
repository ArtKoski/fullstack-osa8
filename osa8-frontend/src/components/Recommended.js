
import { useLazyQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { ALL_BOOKS, ME } from '../queries'

const Recommended = ({token, show}) => { 
  
  //found fetch policy workaround from full-stack telegram , still doesnt work perfect though 
  const [getMe, user_result] = useLazyQuery(ME, {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
        getBooks({variables: { genre: data.me.favoriteGenre }})
        setFavoriteGenre(data.me.favoriteGenre)
      }
      })

  const [getBooks, books_result] = useLazyQuery(ALL_BOOKS)

  const [favoriteGenre, setFavoriteGenre] = useState(null)
 
  useEffect(() => {
    if(token && token !== undefined && token !== "undefined") { 
        getMe() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (books_result.loading || user_result.loading)  {
    return <div>loading...</div>
  }


  if (!show || books_result.data === undefined) {
    return null
  }

  const books = books_result.data.allBooks
  

  return (
    <div>
      <h2>books based on your favourite genre: {favoriteGenre}</h2>

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
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended