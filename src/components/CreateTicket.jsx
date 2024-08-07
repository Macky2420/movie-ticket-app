import {useContext, useRef} from 'react';
import { useMutation, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import {Modal, Button, notification} from 'antd';
import { movieContext } from '../manager/Context';
import Ticket from '../assets/ticket.png';
import AddTicketForm from '../components/AddTicketForm';
import Loading from '../components/Loading';
import { useForm } from 'antd/es/form/Form';


const ADD_TICKET = gql`
mutation addTicket(
  $name: String!
  $address: String!
  $date: date!
  $time: timetz!
  $user_id: uuid!
  $movie_id: Int!
) {
  insert_tickets(
    objects: {
      name: $name
      address: $address
      date: $date
      time: $time
      user_id: $user_id
      movie_id: $movie_id
    }
  ) {
    affected_rows
  }
}
`;

const CreateTicket = () => {

  const { modalVisible, setModalVisible } = useContext(movieContext);
  const {user_id} = useParams();
  const formRef = useRef(null);
  const [form] = useForm();


// For not displaying the button using the cancel button
const handleCancelButton = () => {
  setModalVisible(false);
}

const [addTicketMutation, {loading}] = useMutation(ADD_TICKET);


const onFinish = (values) => {
  addTicketMutation({
    variables: {
      name: values.name,
      address: values.address,
      date: values.date.format('YYYY-MM-DD'),
      time: values.time.format('HH:mm:ss'),
      user_id: user_id,
      movie_id: parseInt(values.movie, 10), // Assuming you're storing the movie_id as an integer
    },
  })
  .then((result) => {
    // Handle successful mutation
    notification.success({
      message: 'Enjoy watching',
      description: 'Ticket added successfully',
    });
    // Close the modal after a successful mutation
    setModalVisible(false);
  })
  .catch((error) => {
    // Optionally, show a notification for the error
    notification.error({
      message: 'Error',
      description: 'Failed to add ticket',
    });
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
            open={modalVisible}
            onCancel={handleCancelButton}
            footer={[
              <Button className='px-6 border-indigo-950' key='cancel' onClick={handleCancelButton}>Cancel</Button>,
              <Button className='px-6 bg-indigo-950' key='submit' type='primary'  loading={loading} onClick={() => formRef.current.submit()}>Submit</Button>
            ]}
          >
            <div className='flex justify-center'>
              <img className='mr-4 h-12 w-12' src={Ticket} />
              <h1 className='mt-3 font-bold text-blue-950 text-lg'>Create Appointment</h1>
            </div>
            <AddTicketForm form={form} onFinish={onFinish} formRef={formRef}/>
            
          </Modal>
     
       
    </>
   
  )
};

export default CreateTicket;