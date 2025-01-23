import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Grid,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import EditCategoryFormPopup from "../../components/EditCategoryModal";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import util from "../../Utils/util";
import { appContext } from "../../Utils/context";
import axios from "axios"
import AddCategoryPopup from "../../components/AddCategoryModal";
import { toast } from "react-toastify";

const Category = () => {
  const token = util.getToken();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [addCategoryPopupOpen, setAddCategoryPopupOpen] = useState(false);

  const [mockDataCategories, setMockDataCategories] = useState([]);
  const handleDelete = (id) => {
    setSelectedCategory(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/admin/category/${selectedCategory}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },

      });
      toast.success(response.data.message)
      // alert(response.data.message)
      setDeleteConfirmationOpen(false);
      fetchCategories()
    } catch (error) {
      console.log("error", error);
      if (error.response && error.response.status === 401) {
        toast.info("Autentication token has been expired or you are not a admin.")
        navigate("/login")
      }
      else if (error.response) {
        toast.error(error.response.data.message)
        // alert(error.response.data.message)
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleEdit = (row) => {
    setEditCategory(row);
  };

  const columns = [
    {
      field: "title",
      headerName: "Category Name",
      flex: 0.5,
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Typography>
          {row.title}
        </Typography>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      minWidth: 200,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box sx={{
          marginTop: "20px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          height: "100%",
          overflowWrap: "break-word",
          whiteSpace: "pre-wrap"
        }}>
          <Typography>
            {row.description.split(' ').slice(0, 15).join(' ')}
          </Typography>
        </Box>
      ),
    },
    {
      field: "is_available",
      headerName: "Availability",
      flex: 0.5,
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Typography>
          {row.is_available ? "True" : "False"}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center">
          <IconButton onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => handleDelete(row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];


  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/admin/category"
        , {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Categories fetched successfully")
      setMockDataCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setAddCategoryPopupOpen(true)
  }
  return (
    <Box>
      <Header title="All Categories" />
      <IconButton
        color="inherit"
        aria-label="add category"
        onClick={handleAddCategory}
      // onClick={() => navigate("/categoryForm")}
      >
        <AddIcon />
        <Typography variant="body2">Add Category</Typography>
      </IconButton>
      <Box
        m="20px 0"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
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
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div style={{ width: '100%', height: '60vh' }}>
              <DataGrid
                rows={mockDataCategories
                  .map((row, index) => ({
                    id: index + 1,
                    ...row,
                  }))}
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
      {editCategory && (
        <EditCategoryFormPopup
          fetchCategories={fetchCategories}
          category={editCategory}
          onClose={() => setEditCategory(null)}
        />
      )}
      <AddCategoryPopup
        fetchCategories={fetchCategories}
        open={addCategoryPopupOpen}
        onClose={() => setAddCategoryPopupOpen(false)}
      />
    </Box>

  );
};

export default Category;
