import { Box, Flex, Table, Thead, Tbody, Tr, Th, Td, Input, Button, Text, Link } from "@chakra-ui/react";
import Papa from "papaparse";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
const DynamicTable = ({
    data,
    columns,
    rowsPerPageInitial = 5,
    enableExport = true,
    enableGlobalSearch = false,
    enableFieldSearch = true,
    fieldSearchPosition = 'top',  // 'top' or 'bottom'
    tableHeight = "auto",
    enableSorting = true,
    bgcolor = "blue.500",
    textcolor = "white",
    enableSerialNumbers = false,
    

}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageInitial);
    const [searchText, setSearchText] = useState({});
    const [globalSearch, setGlobalSearch] = useState("");
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(columns[0]?.id);



    const augmentedColumns = enableSerialNumbers
        ? [
            {
                id: "serial_number",
                label: "S/N",
                minWidth: 50,
                // Add any additional configuration for the serial number column here
            },
            ...columns,
        ]
        : columns;

    // Modify the data to include serial numbers if enabled
    const augmentedData = data.map((row, index) => {
        if (enableSerialNumbers) {
            return { serial_number: index + 1, ...row };
        }
        return row;
    });


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSearch = (e, id) => {
        setSearchText({ ...searchText, [id]: e.target.value });
    };

    const handleGlobalSearch = (e) => {
        setGlobalSearch(e.target.value);
    };
    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    };
    const handleSort = (columnId) => {
        if (enableSorting) {
            const isAsc = orderBy === columnId && order === "asc";
            setOrder(isAsc ? "desc" : "asc");
            setOrderBy(columnId);
        }
    };

    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    };

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };


    const applyNumericFilter = (value, filter) => {
        if (!filter) return true;

        // If filter is only an operator, don't filter
        if (["<", ">", "=", "<=", ">="].includes(filter)) return true;

        const numValue = parseFloat(value);

        if (isNaN(numValue)) {
            return value.includes(filter);
        }

        if (filter.startsWith(">=")) {
            return numValue >= parseFloat(filter.slice(2));
        } else if (filter.startsWith("<=")) {
            return numValue <= parseFloat(filter.slice(2));
        } else if (filter.startsWith(">")) {
            return numValue > parseFloat(filter.slice(1));
        } else if (filter.startsWith("<")) {
            return numValue < parseFloat(filter.slice(1));
        } else if (filter.startsWith("=")) {
            return numValue === parseFloat(filter.slice(1));
        } else {
            return value.includes(filter);
        }
    };


    const filteredData = stableSort(data, getComparator(order, orderBy))
        .filter((row) => {
            return columns.every((column) => {
                const value = row[column.id] ? row[column.id].toString().toLowerCase() : "";
                const searchValue = searchText[column.id]
                    ? searchText[column.id].toLowerCase()
                    : "";

                if (column.numeric) {
                    return applyNumericFilter(value, searchValue);
                } else {
                    return value.includes(searchValue);
                }
            });
        })
        .filter((row) => {
            const searchValue = globalSearch.toLowerCase();
            return Object.values(row).some((value) =>
                value && value.toString().toLowerCase().includes(searchValue)
            );
        });


    const exportToCSV = () => {
        const csv = Papa.unparse(filteredData);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("hidden", "");
        a.setAttribute("href", url);
        a.setAttribute("download", "export.csv");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };


    const range = (start, end) => {
        let length = end - start + 1;
        return Array.from({ length }, (_, idx) => idx + start);
    };

    const renderPageNumbers = (totalPages, page, setPage) => {
        const pageNeighbours = 1; // pages to show around the current page, reduced to 1
        const fixedPagesAtStartEnd = 1; // only show the first and the last page

        let pages = [];
        const rangeWithDots = (start, end) => {
            const range = [];
            for (let i = start; i <= end; i++) {
                range.push(i);
            }
            return range;
        };

        const createPageButton = (pageNumber) => (
            <Button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                disabled={page === pageNumber}
                bg={page === pageNumber ? bgcolor : undefined}
                color={page === pageNumber ? textcolor : undefined}
                mx={1}
            >
                {pageNumber + 1}
            </Button>
        );

        if (totalPages <= (4 + (pageNeighbours * 2))) {
            for (let i = 0; i < totalPages; i++) {
                pages.push(createPageButton(i));
            }
        } else {
            let leftSide = (pageNeighbours * 2) + 1;
            let rightSide = (pageNeighbours * 2) + 1;
            let startPage, endPage;

            if (page > totalPages - (pageNeighbours * 2) - 1) {
                startPage = totalPages - (pageNeighbours * 4);
                endPage = totalPages - 1;
            } else if (page < (pageNeighbours * 2) + 1) {
                startPage = 0;
                endPage = leftSide;
            } else {
                startPage = page - pageNeighbours;
                endPage = page + pageNeighbours;
            }

            let itPage = 0;
            if (startPage > 0) {
                pages.push(createPageButton(itPage)); // First page
                if (startPage > 1) {
                    pages.push(<Text key="start-ellipsis" mx={2}>...</Text>); // Start ellipsis
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(createPageButton(i));
            }

            if (endPage < totalPages - 1) {
                if (endPage < totalPages - 2) {
                    pages.push(<Text key="end-ellipsis" mx={2}>...</Text>); // End ellipsis
                }
                pages.push(createPageButton(totalPages - 1)); // Last page
            }
        }

        return pages;
    };



    return (
        <Flex
          direction="column"
          h="full" // ensure the Flex container takes up the full height
        >
          {/* Global Search and Export Button */}
          {enableGlobalSearch && (
            <Flex justifyContent="flex-end" mb="2">
              <Input
                placeholder="Global Search"
                onChange={handleGlobalSearch}
              />
            </Flex>
          )}
      
          {enableExport && (
            <Flex justifyContent="flex-end" mb="2">
              <Button onClick={exportToCSV}>
                Export to CSV
              </Button>
            </Flex>
          )}
      
          {/* Table Container */}
          <Box flex="1" overflowY="auto" boxShadow="sm" p="4" bg="white" borderRadius="md">
            <Table variant="simple" size="sm">
              {/* Field Search */}
              {enableFieldSearch && fieldSearchPosition === 'top' && (
                <Thead>
                  <Tr>
                    {augmentedColumns.map((column) => (
                      <Th key={`search-${column.id}`}>
                        <Input
                          placeholder={`Search ${column.label}`}
                          size="xs"
                          onChange={(e) => handleSearch(e, column.id)}
                        />
                      </Th>
                    ))}
                  </Tr>
                </Thead>
              )}
      
              {/* Table Head */}
              <Thead position="sticky" top="0" zIndex="sticky" bg="white">
                <Tr>
                  {augmentedColumns.map((column) => (
                    <Th
                      key={column.id}
                      onClick={() => handleSort(column.id)}
                      cursor={enableSorting ? "pointer" : "auto"}
                    >
                      {column.label}
                      {enableSorting && orderBy === column.id && (order === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />)}
                    </Th>
                  ))}
                </Tr>
              </Thead>
      
              {/* Table Body */}
              <Tbody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, rowIndex) => (
                    <Tr key={rowIndex}>
                      {augmentedColumns.map((column) => (
                        <Td key={column.id}>
                          {column.id === "serial_number"
                            ? rowIndex + 1 + page * rowsPerPage // Display the calculated S/N
                            : column.format
                                ? column.format(row[column.id])
                                : column.link // Check if column has a link property
                                    ? (
                                        <Link
                                          href={column.link(row)}
                                          isExternal
                                          color="blue.500"
                                        >
                                          {row[column.id]}
                                        </Link>
                                    )
                                    : row[column.id]}
                        </Td>
                      ))}
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Box>
      
          {/* Pagination */}
          <Flex
            mt="4"
            justify="space-between"
            align="center"
            borderTop="1px solid"
            borderColor="gray.200"
            py="2"
            position="sticky"
            bottom="0"
            bg="white"
            zIndex="sticky"
          >
            <Button
              leftIcon={<ChevronLeftIcon />}
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              isDisabled={page === 0}
            >
              Previous
            </Button>
      
            {/* Page numbers */}
            <Flex>
              {renderPageNumbers(Math.ceil(filteredData.length / rowsPerPage), page, setPage)}
            </Flex>
      
            <Button
              rightIcon={<ChevronRightIcon />}
              onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(filteredData.length / rowsPerPage) - 1))}
              isDisabled={page >= Math.ceil(filteredData.length / rowsPerPage) - 1}
            >
              Next
            </Button>
          </Flex>
        </Flex>
      );
      
};

export default DynamicTable;
