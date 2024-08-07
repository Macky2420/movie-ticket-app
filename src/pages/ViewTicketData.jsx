import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import extraction from '../assets/movie-poster/extraction.jpg';

const GET_TICKET_CONTENT = gql`
  query getTickets($ticket_id: Int!) {
    tickets(where: { id: { _eq: $ticket_id } }) {
      address
      date
      name
      time
      tickets_movie {
        description
        title
        poster_url
      }
    }
  }
`;

const ViewTicketData = () => {
  const { ticket_id } = useParams();
  const { data, loading, error } = useQuery(GET_TICKET_CONTENT, {
    variables: { ticket_id: parseInt(ticket_id) },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const ticket = data?.tickets[0];
  const movie = ticket?.tickets_movie;

  return (
    <div className='flex justify-center items-center mt-10'>
      {ticket && (
        <div className="flex flex-col rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 md:max-w-xl md:flex-row">
          <img
            className="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
            src={movie?.poster_url || extraction}
            alt={movie?.title || 'Movie Poster'}
          />
          <div className="flex flex-col justify-start p-6">
            <h5 className="mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50">
              {movie?.title || 'Movie Title'}
            </h5>
            <p className="mb-4 text-neutral-600 dark:text-neutral-200">
              {movie?.description || 'Movie Description'}
            </p>
            <hr />
            <h5 className="mt-2 mb-2 text-xl font-medium text-neutral-800 dark:text-neutral-50">
              {ticket.name || 'User Name'}
            </h5>
            <p className="mb-4 text-neutral-600 dark:text-neutral-200">
              {ticket.address || 'User Address'}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-300">
              {`${ticket.date} - ${ticket.time}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTicketData;
