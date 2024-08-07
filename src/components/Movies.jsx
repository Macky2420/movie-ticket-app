import { useQuery, gql } from '@apollo/client';
import Loading from '../components/Loading';
import { useContext, useEffect } from 'react';
import { movieContext } from '../manager/Context';

const GET_MOVIES = gql `
    query Movies {
      movies {
        id
        title
        poster_url
        prize
        description
      }
    } `;

const GET_TOTAL_MOVIES = gql`
  query Tickets {
    tickets {
      movie_id
    }
  }
`;

const Movies = () => {


  const { loading, error, data } = useQuery(GET_MOVIES);
  const { data: ticketData, loading: ticketLoading } = useQuery(GET_TOTAL_MOVIES);
  
  if (loading) {
    return (
      <div className='relative top-40 flex justify-center'>
        <Loading/>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>; 
  }

  // Helper function to calculate the number of people who added each movie
  const calculateNumOfPeopleAdded = (movieId) => {
    if (ticketLoading || !ticketData || !ticketData.tickets) {
      return 0;
    }
    return ticketData.tickets.filter((ticket) => ticket.movie_id === movieId).length;
  };  
  return (
    
    <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-12">
      <div className="-m-1 flex flex-wrap md:-m-2">
        {data.movies.map(({ id, title, poster_url, prize, description }) => {
          const numOfPeopleAdded = calculateNumOfPeopleAdded(id);

          return (
            <div key={id} className="flex w-1/3 flex-wrap">
              <div className="relative w-full group p-1 md:p-2">
                <img
                  alt={title}
                  className="block h-full w-full rounded-lg object-cover object-center shadow-none ease-in-out transition-all duration-300 cursor-pointer filter grayscale-0 hover:shadow-lg hover:shadow-black/30 hover:grayscale"
                  src={`${poster_url}`}
                />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full">
                  {numOfPeopleAdded} {/* Display the number of people who added the movie */}
                </span>
                <div className="absolute bottom-2 left-2 right-2 rounded-b-lg px-2 py-3 bg-gray-800 opacity-0 group-hover:opacity-80 transition-opacity duration-300 ">
                  <p className='text-sm font-bold text-blue-200'>PHP {prize}.00</p>
                  <p className="text-xm text-white text-justify">{description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


export default Movies;