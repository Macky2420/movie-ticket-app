import React, { useState } from 'react';
import { movieContext } from './Context';

const MovieContextProvider = (props) => {
  const [modalVisible, setModalVisible] = useState(false); // Ensure '_modalVisible' is initialized with 'false'.
  const [editModalVisible, setEditModalVisible] = useState(false);



  return (
    <movieContext.Provider value={{ modalVisible, setModalVisible, editModalVisible, setEditModalVisible }}>
      {props.children}
    </movieContext.Provider>
  );
};

export default MovieContextProvider;