import React from 'react';
import { Box } from '@chakra-ui/react';
import DynamicTable from '../components/DynamicTable';

const Table = () => {
    function createData(id, name, age) {
        return { id, name, age };
    }

    const names = ['John', 'Jane', 'Doe', 'Alice', 'Bob'];

    function generateData() {
        const data = [];
        for (let i = 0; i < 50; i++) {
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomAge = Math.floor(Math.random() * 50) + 20;
            data.push(createData(i, randomName, randomAge));
        }
        return data;
    }

    const data = generateData();

    const columns = [
        { id: 'id', label: 'ID', minWidth: 50 },
        { id: 'name', label: 'Name', minWidth: 100 },
        { id: 'age', label: 'Age', minWidth: 50 , numeric: true },
       
    ];

    return (
        <Box p={5}>
            <DynamicTable
                data={data}
                columns={columns}
                rowsPerPageInitial={5}
                enableExport={true}
                enableGlobalSearch={true}
                enableFieldSearch={true}
                fieldSearchPosition='bottom'
                tableHeight="auto"
                enableSorting={true}
                bgcolor="blue.500"
                textcolor="white"
                enableSerialNumbers={false}
            />
        </Box>
    );
};

export default Table;