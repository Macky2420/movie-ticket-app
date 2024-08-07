import {Select, Form, Input, DatePicker, TimePicker} from 'antd';
import { useQuery, gql } from '@apollo/client';
import Loading from '../components/Loading';

const GET_MOVIES = gql`
  query {
    movies {
      id
      title
    }
  }
`;

const AddTicketForm = ({form, onFinish, formRef}) => {

  const { loading, error, data } = useQuery(GET_MOVIES);


  if (loading) return <Loading/>;
  if (error) return <p>Error: {error.message}</p>;

  const handleFinish = (values) => {
    onFinish(values); // Call the onFinish function passed from the parent component
    form.resetFields();
  };

  return (
    <>
      <Form className='mt-5' form={form} onFinish={handleFinish} ref={formRef}>
        <Form.Item label='Name' name='name' rules={[{ required: true, message: 'Please provide your name.'}]}>
          <Input placeholder='Enter your Name'/>
        </Form.Item>
        <Form.Item label='Address' name='address' rules={[{ required: true, message: 'Please provide your address.'}]}>
          <Input placeholder='Enter your Address'/>
        </Form.Item>
          <Form.Item label='Movies' name='movie' rules={[{required: true, message: 'Please select a movie.'}]}>
            <Select placeholder='Select Movies'>
              {data.movies.map((movie) => (
                <Select.Option key={movie.id} value={movie.id}>
                  {movie.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        <Form.Item label='Date' name='date' rules={[{required: true, message: 'Please select a date.'}]}>
          <DatePicker className='w-full' placeholder='Select Date'/>
        </Form.Item>
        <Form.Item label='Time' name='time' rules={[{required: true, message: 'Please select a time.'}]}>
          <TimePicker className='w-full' placeholder='Select Time'/>
        </Form.Item>
      </Form>
    </>
  );
}

export default AddTicketForm;