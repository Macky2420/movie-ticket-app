import React, { useContext, useRef, useEffect } from 'react';
import { Modal, Button, notification } from 'antd';
import Ticket from '../assets/ticket.png';
import { movieContext } from '../manager/Context';
import AddTicketForm from './AddTicketForm';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import Loading from '../components/Loading';

const GET_USER_TICKETS = gql`
  query getUserTickets($ticket_id: Int!) {
    tickets(where: { id: { _eq: $ticket_id } }) {
      name
      address
      date
      time
      tickets_movie {
        id
      }
    }
  }
`;

// Updated mutation
const UPDATE_TICKET = gql`
  mutation MyMutation(
    $name: String!
    $address: String!
    $movie_id: Int!
    $date: date!
    $time: timetz!
    $ticketId: Int!
  ) {
    update_tickets_by_pk(
      pk_columns: { id: $ticketId }
      _set: {
        name: $name
        address: $address
        date: $date
        time: $time
        movie_id: $movie_id
      }
    ) {
      id
    }
  }
`;



const EditTicket = ({ticketId}) => {

  const { editModalVisible, setEditModalVisible } = useContext(movieContext);
  const formRef = useRef(null);
  const [form] = useForm();

  const { data, refetch } = useQuery(GET_USER_TICKETS, {
    variables: { ticket_id: ticketId },
  });

  const [updateTicket, {loading }] = useMutation(UPDATE_TICKET);

  useEffect(() => {
    if (data && data.tickets && data.tickets.length > 0) {
      refetch();
      // Extract the ticket details from the data
      const { name, address, date, time, tickets_movie } = data.tickets[0];

      const formattedDate = dayjs(date);
      const formattedTime = dayjs(time, 'HH:mm');

      form.setFields([  
        { name: 'name', value: name },
        { name: 'address', value: address },
        { name: 'date', value: formattedDate },
        { name: 'time', value: formattedTime },
        { name: 'movie', value: tickets_movie.id},
        // Set other form fields based on your form structure
      ]);
    }
  }, [data, form, refetch]);
  
  // For handle cancel modal
  const handleCancelEdit = () => {
    setEditModalVisible(false);
  };

  // Updated onFinish function
const onFinish = (values) => {

  updateTicket({
    variables: {
      ticketId: parseInt(ticketId, 10),
      name: values.name,
      address: values.address,
      date: values.date.format('YYYY-MM-DD'),
      time: values.time.format('HH:mm:ss'),
      movie_id: parseInt(values.movie, 10),
    },
  })
    .then((result) => {
      // Handle successful mutation
      notification.success({
        message: 'Edit Successfully',
        description: 'Updated ticket successfully',
      });
      // Close the modal after a successful mutation
      setEditModalVisible(false);
    })
    .catch((error) => {
      // Optionally, show a notification for the error
      console.error('Error: ', error);
      notification.error({
        message: 'Edit Error',
        description: 'Failed to update ticket',
      });
      // Close the modal after a successful mutation
      setEditModalVisible(false);
    });
};
  return (
    <>
      {/* Loading spinner */}
      {loading && (
        <div className="fixed -translate-x-2/4 -translate-y-2/4 z-[9999] left-2/4 top-2/4">
          <Loading />
        </div>
      )}
       {/* Display the Create ticket modal */}
        <Modal
          className='rounded-lg overflow-hidden shadow-lg'
            open={editModalVisible}
            onCancel={handleCancelEdit}
            footer={[
              <Button className='px-6 border-indigo-950' key='cancel' onClick={handleCancelEdit}>Cancel</Button>,
              <Button className='px-6 bg-indigo-950' key='submit' type='primary'  onClick={() => formRef.current.submit()}>Submit</Button>
            ]}
          >
            <div className='flex justify-center'>
              <img className='mr-4 h-12 w-12' src={Ticket} />
              <h1 className='mt-3 font-bold text-blue-950 text-lg'>Edit Appointment</h1>
            </div>
            <AddTicketForm form={form} formRef={formRef} onFinish={onFinish}/>
            
          </Modal>
    </>
  );
};

export default EditTicket;
