import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  useTheme,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam as mockDataTeamInitialState } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import Header from "../../components/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import UserDetail from "../../components/UserDetail";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import EditFormPopup from "../../components/EditUserModal";
import AddFormPopup from "../../components/AddUserModal";
import axios from "axios";
import util from "../../Utils/util";
import { appContext } from "../../Utils/context";
import { toast } from "react-toastify";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  // const [addUser, setAddUser] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false); // State variable for edit popup
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [mockDataTeam, setMockDataTeam] = useState([]);
  const token = util.getToken();

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (id) => {
    setSelectedUser(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/user/${selectedUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      getUsers();
      setDeleteConfirmationOpen(false);
    } catch (error) {
      console.log("error", error);
      if (error.response && error.response.status === 401) {
        toast.info(
          "Autentication token has been expired or you are not a admin."
        );
        navigate("/login");
      } else if (error.response) {
        toast.error(error.response.data.message);
        // alert(error.response.data.message)
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleUserDetailClick = (row) => {
    setSelectedUser(row);
    setUserDetailsModalOpen(true);
  };

  const handleCloseUserDetailsModal = () => {
    setUserDetailsModalOpen(false);
  };

  const handleEdit = (row) => {
    setEditUser(row);
    setEditPopupOpen(true); // Open the edit popup
  };

  const handleAddUser = () => {
    setAddPopupOpen(true); // Open the add user popup
  };
  const getUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/user/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Users data fetched successfully");
      const res = response.data.data;
      console.log("res", res);
      setMockDataTeam(res);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.info(
          "Autentication token has been expired or you are not a admin."
        );
        navigate("/login");
      } else if (error.response) {
        toast.error(error.response.data.message);
        // alert(error.response.data.message)
      }
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      field: "Full Name",
      headerName: "Full Name",
      flex: 0.5,
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Typography>
          {row.users.first_name} {row.users.last_name}
        </Typography>
      ),
    },
    {
      headerName: "Email",
      flex: 0.5,
      minWidth: 200,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => <Typography>{row.users.email}</Typography>,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => <Typography>{row?.roles?.title}</Typography>,
    },
    {
      field: "admin",
      headerName: "Admin",
      flex: 0.3,
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Typography>{row.users.is_admin ? "True" : "False"}</Typography>
      ),
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 0.4,
      sortable: false,
      filterable: false,
      minWidth: 150,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center">
          <IconButton onClick={() => handleUserDetailClick(row)}>
            <InfoOutlinedIcon />
          </IconButton>
          <IconButton onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(row.users.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Header title="All Users" />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <Typography variant="h5" component="div">
          Manage Users
        </Typography>
        <IconButton
          onClick={handleAddUser}
          // onClick={() => navigate("/form")}
        >
          <AddIcon />
          <Typography variant="body2">Add User</Typography>
        </IconButton>
      </Box>
      <Box
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div style={{ width: "100%", height: "60vh" }}>
              <DataGrid
                rows={mockDataTeam.map((row, index) => ({
                  id: row.users.id,
                  ...row,
                }))}
                style={{ maxHeight: "60vh" }}
                overflow="auto"
                columns={columns}
              />
            </div>
          </Grid>
        </Grid>
      </Box>
      <DeleteConfirmationModal
        open={deleteConfirmationOpen}
        onClose={handleDeleteCancel}
        onDeleteConfirmed={handleDeleteConfirmed}
      />
      {userDetailsModalOpen && (
        <UserDetail
          open={userDetailsModalOpen}
          onClose={handleCloseUserDetailsModal}
          user={selectedUser}
        />
      )}
      {editUser && (
        <EditFormPopup
          user={editUser}
          fetchUsers={getUsers}
          onClose={() => setEditUser(null)}
        />
      )}
      <AddFormPopup
        fetchUsers={getUsers}
        open={addPopupOpen}
        onClose={() => setAddPopupOpen(false)}
      />
    </Box>
  );
};

export default Team;
