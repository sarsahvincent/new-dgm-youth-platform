import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { db } from "../firebse";
import { collection } from "firebase/firestore";
import UserTableAvatar from "./UserTableAvatar";
import { Link } from "react-router-dom";
import Loading from "./Loading";

const columns = [
  { id: "picture", label: "Picture", minWidth: 170 },
  { id: "name", label: "Name", minWidth: 100 },
  {
    id: "phone",
    label: "Phone Number",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "email",
    label: "Email",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

function createData(picture, name, phone, email) {
  return { picture, name, phone, email };
}

export default function HomepageUserList() {
  const usersCollectiion = collection(db, "DGM_YOUTH_users");
  const [searchResults, setSearchReults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  let rows = [];

  let getAllConverts = JSON.parse(localStorage.getItem("allNewConvert"))
    ? JSON.parse(localStorage.getItem("allNewConvert"))
    : null;

  rows = searchResults?.map((user) =>
    createData(
      <Link to={`/profile-details/${user.uid}`}>
        <UserTableAvatar url={user.avatar} />
      </Link>,
      <Link to={`/profile-details/${user.uid}`}>
        {user.firstName + " " + user.lastName}
      </Link>,
      <Link to={`/profile-details/${user.uid}`}>{user.phone}</Link>,
      <Link to={`/profile-details/${user.uid}`}>{user.email}</Link>
    )
  );

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const filteredData = getAllConverts?.filter(
      (user) =>
        user?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchReults(filteredData);
  }, [searchTerm]);

  return (
    <div className="dashboard-user-search">
      <input
        placeholder="Search by key word"
        type="text"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      {usersCollectiion ? (
        <div className="membersListContainer">
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{}}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          color: "purple",
                          fontWeight: "bolder",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.code}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
