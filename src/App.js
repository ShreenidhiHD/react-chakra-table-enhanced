import React from 'react';
import { ChakraProvider } from "@chakra-ui/react";
import Table from '../src/pages/Table';

function App() {
  return (
    <ChakraProvider>
      <Table />
    </ChakraProvider>
  );
}

export default App;