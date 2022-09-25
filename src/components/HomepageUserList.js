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
// import { read, writeFileXLSX, XLSX } from "xlsx";
import * as XLSX from "xlsx/xlsx.mjs";
import { collection, getDocs } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { getAllUsers } from "../services/redux/reducers/userSlice";
import UserTableAvatar from "./UserTableAvatar";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ClearIcon from "@mui/icons-material/Clear";
import PhoneIcon from "@mui/icons-material/Phone";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

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

export default function HomepageUserList({ allDepartment }) {
  const [users, setUsers] = useState([]);
  const usersCollectiion = collection(db, "DGM_YOUTH_users");
  const [searchResults, setSearchReults] = useState([]);
  const [filterBySex, setFilterBySex] = useState("");
  const [filterByDepartment, setFilterByDepartment] = useState("");
  const [filterByMembership, setFilterByMemberShip] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  let rows = [];

  const dispatch = useDispatch();

  rows = searchResults?.map((user, index) =>
    createData(
      <Link to={`/profile-details/${user.uid}`}>
        <UserTableAvatar url={user.avatar} />
      </Link>,
      <Link to={`/profile-details/${user.uid}`}>
        {user.firstName + " " + user.lastName}
      </Link>,
      <Link to={`/profile-details/${user.uid}`}>
        {" "}
        {user?.phone ? <PhoneIcon /> : "Not available"} {user.phone}
      </Link>,
      <Link to={`/profile-details/${user.uid}`}>
        {" "}
        {user.email} {user?.email ? <EmailIcon /> : "Not available"}
      </Link>
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

  const clearFilters = () => {
    setFilterBySex("");
    setSearchTerm("");
    setFilterByMemberShip("");
    setFilterByDepartment("");
  };

  const handleChangeMembership = (e) => {
    setFilterByMemberShip(e.target.value);
    setFilterBySex("");
    setSearchTerm("");

    setFilterByDepartment("");
  };
  const handleChangeSex = (e) => {
    setFilterBySex(e.target.value);
    setSearchTerm("");
    setFilterByMemberShip("");
    setFilterByDepartment("");
  };
  const handleChangeDepartment = (e) => {
    setFilterByDepartment(e.target.value);
    setFilterBySex("");
    setSearchTerm("");
    setFilterByMemberShip("");
  };

  const downloadList = () => {
    const worksheet = XLSX.utils.json_to_sheet(searchResults);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DGM YOUTH MEMBERS");
    let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFileXLSX(workbook, "DGM_YOUTH.xlsx");
  };
  useEffect(() => {
    const filteredData = users?.filter(
      (user) =>
        user?.fullName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        user?.firstName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        user?.lastName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        user?.phone?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        user?.sex?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    setSearchReults(filteredData);
  }, [searchTerm, users]);

  useEffect(() => {
    const filteredByGender = users?.filter((user) =>
      user?.sex?.includes(filterBySex)
    );

    setSearchReults(filteredByGender);
  }, [users, filterBySex]);

  useEffect(() => {
    const filteredByMemberShip = users?.filter((user) =>
      user?.membershipStatus?.includes(filterByMembership)
    );

    setSearchReults(filteredByMemberShip);
  }, [users, filterByMembership]);

  useEffect(() => {
    const filteredByDepartment = users?.filter((user) =>
      user?.department?.includes(filterByDepartment)
    );

    setSearchReults(filteredByDepartment);
  }, [users, filterByDepartment]);

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectiion);
      setUsers(data?.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    dispatch(getAllUsers(users));

    getUsers();
  }, []);

  setTimeout(() => {
    dispatch(getAllUsers(users));
  }, 1000);

  return (
    <div className="dashboard-user-search">
      <div className="d-flex align-items-center justify-content-between">
        <input
          placeholder="Search by key word"
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />

        <button onClick={clearFilters} className="clear-filter-btn">
          Clear Filters
          <span>
            {" "}
            <ClearIcon />
          </span>
        </button>
        <LightTooltip title="Download List">
          <div
            style={{ color: "purple", marginLeft: 10, cursor: "pointer" }}
            onClick={downloadList}
          >
            <DownloadIcon />
          </div>
        </LightTooltip>
      </div>
      <div className="d-flex align-items-center justify-content-between filter-container">
        <div>
          <Box sx={{ m: 0.5, width: "25ch" }} className="filter-input">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Filter by Membership
              </InputLabel>
              <Select
                name="salutation"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterByMembership}
                label=" Filter by Membership"
                onChange={handleChangeMembership}
              >
                <MenuItem value="Member">Members</MenuItem>
                <MenuItem value="New Convert">New Convert</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
        <div>
          <Box sx={{ m: 0.5, width: "25ch" }} className="filter-input">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Filter by Department
              </InputLabel>
              <Select
                name="salutation"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterByDepartment}
                label="Filter by Department"
                onChange={handleChangeDepartment}
              >
                {allDepartment?.map((department, index) => (
                  <MenuItem key={index} value={department?.departmentName}>
                    {department?.departmentName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div>
          <Box sx={{ m: 0.5, width: "25ch" }} className="filter-input">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Filter by Gender
              </InputLabel>
              <Select
                name="salutation"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterBySex}
                label="Filter by Gender"
                onChange={handleChangeSex}
              >
                <MenuItem value="Male">Males</MenuItem>
                <MenuItem value="Female">Females</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>
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
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ padding: 5 }}
                              >
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
