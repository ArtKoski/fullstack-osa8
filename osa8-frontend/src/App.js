import { useApolloClient, useSubscription } from '@apollo/client'
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Recommended from './components/Recommended'
import { BOOK_ADDED, ALL_BOOKS } from './queries'

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("bookApp-user-token");
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
    }
  }, []);

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`book '${addedBook.title}' added `)
      updateCacheWith(addedBook)
    }
  })

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })
    }   
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('books')
  }

  const setError = (error) => {
    console.log(error)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        { !token &&
        <button onClick={() => setPage('login')}>login</button>
        }
        { token &&
        <span>
        <button onClick={() => setPage('add')}>add book</button> 
        <button onClick={() => setPage('recommended')}>recommended</button> 
        <button onClick={() => logout()}>logout</button>
        </span>
        }
      </div>

      <Authors
        show={page === 'authors'}
      />  

      {token &&
      <span>
      <Recommended 
      show={page === 'recommended'}
      token={token}  />    
      
      <NewBook
        show={page === 'add'} setError={setError}
      />
      </span>
      }
      <Books
        show={page === 'books'}
      />

      <LoginForm show={page === 'login'} setError={setError} setToken={setToken} setPage={setPage}  />

    </div>
  )
}



export default App