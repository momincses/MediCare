import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Screens/Home/Home'
import './App.css'
import Registration from './Screens/Registration/Registration'
import Student from './Screens/Student/Student'
import Doctor from './Screens/Doctor/Doctor'

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/register' element={<Registration/>}></Route>
        <Route path='/student' element={<Student/>}></Route>
        <Route path='/doctor' element={<Doctor/>}></Route>

        
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
