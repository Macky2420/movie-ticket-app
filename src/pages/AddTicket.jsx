import {useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import { Space, Table, Button } from 'antd';
import { EditOutlined, ZoomInOutlined } from '@ant-design/icons';
import EditTicket from '../components/EditTicket';
import CreateTicket from '../components/CreateTicket';
import { movieContext } from '../manager/Context';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import Delete from '../components/Delete';
import Loading from '../components/Loading';
import classNames from 'classnames';

const AddTicket = () => {
 
  const { setModalVisible, setEditModalVisible } = useContext(movieContext);
  const { user_id } = useParams();
  const [ticketId, setTicketId] = useState(null); // Initialize ticketId state to null

  const DISPLAY_TICKET = gql`
    query displayTicket($user_id: uuid!) {
      tickets(where: { user_id: { _eq: $user_id } }, order_by: { id: desc }) {
        id
        name
        address
        date
        time
        tickets_movie {
          title
          prize
        }
      }
    }
  `;


  const { loading, error, data, refetch } = useQuery(DISPLAY_TICKET, {
    variables: { user_id },
  });

  if (loading) return ( <div className='relative top-40 flex justify-center'>
                          <Loading/>
                        </div>);
  if (error) return console.log("Error: ", error.message);

  // Extract the user tickets data from the 'data' object.
  const userTickets = data.tickets;

  const dataSource = userTickets.map((ticket) => ({
    key: ticket.id, // Use a unique identifier for each ticket, e.g., 'id'.
    name: ticket.name,
    address: ticket.address,
    movie: ticket.tickets_movie.title,
    date: ticket.date,
    time: ticket.time,
    prize: ticket.tickets_movie.prize,
  }));

  // Triggered the button to display the modal
  const handleClickButton = () => {
    setModalVisible(true);
  };

  const handleClickEdit = (key) => {
    setTicketId(key); // Set the ticketId state with the clicked ticket key
    setEditModalVisible(true); // Show the modal
  };
// Columns in the table
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name', 
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Movie',
    key: 'movie',
    dataIndex: 'movie',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Prize',
    dataIndex: 'prize',
    key: 'prize',
  },
  {
    title: 'Action',
    key: 'action',
    render: (record) => {
      refetch();
      return(
        <>
          <div className={classNames('', { 'blur-sm pointer-events-none': loading })}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Space size="middle">

                {/* Edit Modal */}
                <Button className='border-none hover:bg-gray-200' onClick={() => handleClickEdit(record.key)} >
                  <EditOutlined style={{fontSize: '17px', color: '#172554'}}/>
                </Button>

                {/* Delete option */}
                <Delete record={record} refetch={refetch}/>

                {/* View ticket data in other page */}
                <Link to={`/addticket/view/${user_id}/${record.key}`}>
                  <Button className='border-none hover:bg-gray-200'>
                    <ZoomInOutlined style={{fontSize: '17px', color: '#172554'}} />
                  </Button>
                </Link>
              </Space>
            </div> 
          </div>
        </>
    );
    },  
  },
]; 


  return (
    <>
      {/* Ticket */}
      <div>
        <div className='container mx-auto p-2 mt-5 rounded'>
          {/* Create ticket button */}
          <div >
            <button 
              type="button" 
              onClick={handleClickButton}
              className="inline-block rounded-lg bg-indigo-950 px-8 pb-3 pt-3 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
              Add ticket
            </button>
    
          </div>
          <hr className="w-full h-1 mx-auto bg-gray-100 border-0 rounded md:my-5 dark:bg-gray-700" />

          {/* Display the data submitted by user */}
          <div>
            <Table style={{fontSize: '20px'}} columns={columns} dataSource={dataSource} />
          </div>

          {/* Create Ticket */}
          <CreateTicket/>
          
          {/* Edit Ticket */}
          <EditTicket ticketId={ticketId} refetch={refetch}/>

            
        </div>
      </div>
      

    </>
  );
};

export default AddTicket;