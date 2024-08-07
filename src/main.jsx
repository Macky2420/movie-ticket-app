import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
} from "react-router-dom";
import './index.css'
import {router} from './routes/Routers';
import MovieContextProvider from './manager/MovieContextProvider';
import { ApolloProvider } from '@apollo/client';
import { client } from './data/connection';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MovieContextProvider>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </MovieContextProvider>
  </React.StrictMode>,
)

