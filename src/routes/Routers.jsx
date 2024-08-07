import React from 'react';
import {
  createBrowserRouter
} from "react-router-dom";
import MovieLayout from '../layout/MovieLayout';
import MovieList from '../pages/MovieList';
import AddTicket from '../pages/AddTicket';
import ViewTicketData from '../pages/ViewTicketData';
import HelpPage from '../pages/HelpPage';
import Login from '../pages/Login';
import Register from '../pages/Register';

 export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login/>,
  },
  {
    path: '/register',
    element: <Register/>
  },
  {
    path: "/movielist/:user_id",
    element: <MovieLayout />,
    children: [{
      path: "/movielist/:user_id",
      element: <MovieList />,
    }]
  },
  {
    path: "/addticket/:user_id",
    element: <MovieLayout />,
    children: [{
      path: "/addticket/:user_id",
      element: <AddTicket />,
    }]
  },
  {
    path: "/addticket/view/:user_id",
    element: <MovieLayout />,
    children: [{
      path: "/addticket/view/:user_id/:ticket_id",
      element: <ViewTicketData />,
    }]
  },
  {
    path: '/help/:user_id',
    element: <MovieLayout />,
    children: [{
      path: '/help/:user_id',
      element: <HelpPage/>,
    }]

  },
]);