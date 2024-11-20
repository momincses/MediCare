import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Screens/Home/Home'
import './App.css'
import Registration from './Screens/Registration/Registration'

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/register' element={<Registration/>}></Route>

        
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
