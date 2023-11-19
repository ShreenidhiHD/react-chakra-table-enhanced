# React Chakra Enhanced Table

This project provides a feature-rich table component built with React and Chakra UI.

## Getting Started

1. Fork or clone this repository.

2. Install the dependencies:

\`\`\`bash
npm install
\`\`\`

3. Start the application:

\`\`\`bash
npm start
\`\`\`

## Features

The `DynamicTable` component includes the following features:

- Pagination
- Export to CSV
- Global and field-specific search
- Sorting
- Customizable table height, background color, and text color
- Optional serial numbers


## Usage

In `Table.js`, we pass the data and configuration to the `DynamicTable` component:

\`\`\`jsx
<DynamicTable
    data={data}
    columns={columns}
    rowsPerPageInitial={5}
    enableExport={true}
    enableGlobalSearch={true}
    enableFieldSearch={true}
    fieldSearchPosition='top'
    tableHeight="auto"
    enableSorting={true}
    bgcolor="blue.500"
    textcolor="white"
    enableSerialNumbers={false}
/>
\`\`\`


Here's what each prop does:

- `data`: The data to display in the table.
- `columns`: The columns of the table.
- `rowsPerPageInitial`: The initial number of rows per page.
- `enableExport`: Whether to enable exporting to CSV.
- `enableGlobalSearch`: Whether to enable global search.
- `enableFieldSearch`: Whether to enable field-specific search.
- `fieldSearchPosition`: The position of the field-specific search bar ('top' or 'bottom').
- `tableHeight`: The height of the table.
- `enableSorting`: Whether to enable sorting.
- `bgcolor`: The background color of the table.
- `textcolor`: The text color of the table.
- `enableSerialNumbers`: Whether to enable serial numbers.

Feel free to customize these props as needed.