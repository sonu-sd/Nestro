'use client'

import React, { useEffect } from 'react'
import store from './store'
import { Provider, useDispatch } from 'react-redux'
import { lsToCart } from './features/Cartslice'

function CartHydrator() {
  const dispatch = useDispatch()

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart'))
      if (savedCart) dispatch(lsToCart(savedCart))
    } catch {
      localStorage.removeItem('cart')
    }
  }, [dispatch])

  return null
}

export default function Storeprovider({children}) {
  return (
     <Provider store={store}>
     <CartHydrator />
     {children}
    </Provider>
  )
}
