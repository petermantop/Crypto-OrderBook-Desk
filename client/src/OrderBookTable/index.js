import React from "react";
import { useTable } from "react-table";

const calculateTotals = (data) => {
  let runningTotal = 0;
  return data.map((item) => {
    runningTotal = item.quantity * item.price;
    return { ...item, total: runningTotal };
  });
};

const OrderBook = ({ asks, bids }) => {
  bids.sort((a, b) => b.price - a.price);
  const columns = React.useMemo(
    () => [
      {
        Header: "Price",
        accessor: "price",
        width: "25%",
        color: "#E57373",
      },
      {
        Header: "Quantity",
        accessor: "quantity",
        width: "25%",
      },
      {
        Header: "Total",
        accessor: "total",
        width: "30%",
      },
      {
        Header: "Count",
        accessor: "count",
        width: "20%",
      },
    ],
    []
  );

  // Define bidColumns with the desired order for the bid table
  const bidColumns = React.useMemo(
    () => [
      {
        Header: "Count",
        accessor: "count",
        width: "20%",
      },
      {
        Header: "Total",
        accessor: "total",
        width: "30%",
      },
      {
        Header: "Quantity",
        accessor: "quantity",
        width: "25%",
      },
      {
        Header: "Price",
        accessor: "price",
        width: "25%",
        color: "#4E9A51",
      },
    ],
    []
  );

  const askData = React.useMemo(() => calculateTotals(asks), [asks]);
  const bidData = React.useMemo(() => calculateTotals(bids), [bids]);

  const askTableInstance = useTable({ columns, data: askData });
  const bidTableInstance = useTable({ columns: bidColumns, data: bidData });

  const renderTable = (tableInstance, tableType) => (
    <table
      {...tableInstance.getTableProps()}
      className="table table-hover table-sm"
      style={{ textAlign: "center" }}
    >
      <thead>
        {tableInstance.headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps({
                  style: {
                    width: column.width,
                    color: column.color,
                  },
                })}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...tableInstance.getTableBodyProps()}>
        {tableInstance.rows.map((row) => {
          tableInstance.prepareRow(row);
          return (
            <tr
              {...row.getRowProps()}
              className={`${
                tableType === "asks" ? "text-danger" : "text-success"
              }`}
            >
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps({
                      style: {
                        width: cell.column.width,
                        color: cell.column.color,
                      },
                    })}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className="container mt-4">
      <style>
        {`
          .table th, .table td {
            font-family: 'Arial', sans-serif;
            font-size: 0.75rem; // Adjust font size to small (12px equivalent)
            padding: 0.25rem; // Reduce padding to make rows more compact
            border: 0 !important; // Remove borders from all table cells
          }
        `}
      </style>
      <div className="row justify-content-center">
        <div className="col-md-4">{renderTable(bidTableInstance, "bids")}</div>
        <div className="col-md-4">{renderTable(askTableInstance, "asks")}</div>
      </div>
    </div>
  );
};

export default OrderBook;
