import React, { useState, useEffect } from 'react';
import { Popconfirm, Button, notification } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useMutation, gql } from '@apollo/client';
import Loading from '../components/Loading';

const DELETE_TICKET = gql`
  mutation deleteTicket($ticket_id: Int!) {
    delete_tickets(where: { id: { _eq: $ticket_id } }) {
      affected_rows
    }
  }
`;

const Delete = ({ record, refetch }) => {
  const [deleteTicketMutation, {loading}] = useMutation(DELETE_TICKET);
  const [deleteId, setDeleteId] = useState();



  useEffect(() => {
    if (deleteId !== null) {
      deleteTicketMutation({
        variables: { ticket_id: deleteId },
      })
        .then((result) => {
          // Handle successful deletion
          notification.success({
            message:'Successfully Deleted',
            description:"You've successfully removed this Ticket",
          });
          refetch();
        })
    }
  }, [deleteId, deleteTicketMutation, refetch]);

  const handleClickdelete = (key) => {
    setDeleteId(key); // Set the ticketId state with the clicked ticket key

  };

  return (
    <>
      

      {/* Delete Pop confirm */}
      <Popconfirm
        title="Delete the ticket"
        description="Are you sure to delete this ticket?"
        onConfirm={() => handleClickdelete(record.key)}
        okText="Yes"
        cancelText="No"
        okButtonProps={{
          style: { backgroundColor: '#172554' },
        }}
        cancelButtonProps={{
          style: { borderColor: '#172554' },
        }}
      >
        <Button type="text" className="border-none">
          <DeleteOutlined style={{ fontSize: '17px', color: '#172554' }} />
        </Button>
      </Popconfirm>
    </>
  );
};

export default Delete;
