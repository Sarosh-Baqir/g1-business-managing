import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, IconButton, useTheme, Grid, FormControl, MenuItem, Select, InputLabel,TextField,Button,InputAdornment } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { citiesOfPakistan } from "../../data/mockData";
import Header from "../../components/Header";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import EditServiceFormPopup from "../../components/EditServiceModal";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CreateServiceForm from "../../components/AddServiceModal";
import axios from "axios"
import util from "../../Utils/util";
import { appContext } from "../../Utils/context";
import ServiceDetail from "../../components/ServiceDetail";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { toast } from "react-toastify";

const Services = () => {
  const theme = useTheme();
  const token = util.getToken();
  const colors = tokens(theme.palette.mode);
  const [categories, setCategories] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [editService, setEditService] = useState(null);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [createServicePopupOpen, setCreateServicePopupOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [serviceDetailsModalOpen, setServiceDetailsModalOpen] = useState(false);
  const [filterEmail,setFilterEmail] = useState("")
  const navigate = useNavigate();

  const [mockDataServices, setMockDataServices] = useState([]);
  const handleDelete = (id) => {
    setSelectedService(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/admin/services/${selectedService}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },

      });
      toast.success(response.data.message)
      // alert(response.data.message)
      setMockDataServices(response);
      setDeleteConfirmationOpen(false);
      filterServices()
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

  const handleEmailFilter = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/admin/services", {
        params: {
          email: filterEmail
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFilterEmail("")
      toast.success("Services fetched successfully")
      setMockDataServices(response.data.data)
    } catch (error) {
      toast.error("User with this email does not exist.")
      console.error("Error filtering services:", error);
    }
  };



  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleEdit = (row) => {
    setEditService(row);
    setEditPopupOpen(true);
  };


  const handleServiceDetailClick = (row) => {
    setSelectedService(row);
    setServiceDetailsModalOpen(true);
  };
  const handleCloseServiceDetailsModal = () => {
    setServiceDetailsModalOpen(false);
  };

  const columns = [
    {
      field: "service_name",
      headerName: "Service Name",
      flex: 0.5,
      minWidth: 150,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.3,
      minWidth: 100,
      renderCell: ({ row }) => (
        <Typography>
          $ {row.price}
        </Typography>
      ),
    },
    {
      field: "cover_photo",
      headerName: "Cover Photo",
      flex: 0.4,
      minWidth: 100,
      renderCell: ({ row }) => (
        <img
          src={row?.cover_photo ? `http://localhost:4000/${row?.cover_photo.replace(/\\/g, '/').replace('public/', '')}`
            : "./assets/noAvatar.png"}

          alt="Cover"
          style={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      field: "start_time",
      headerName: "Start Time",
      flex: 0.4,
      minWidth: 150,
    },
    {
      field: "end_time",
      headerName: "End Time",
      flex: 0.4,
      minWidth: 150,
    },
    {
      field: "city",
      headerName: "City",
      flex: 0.4,
      minWidth: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center">
          <IconButton onClick={() => handleServiceDetailClick(row)}>
            <InfoOutlinedIcon />
          </IconButton>
          <IconButton aria-label="edit" onClick={() => handleEdit(row)}>
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
      // toast.success("Categories Feteched Successfully")
      setCategories(response.data.data);
    } catch (error) {
      toast.error("Error while fetching categories data")
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory || selectedCity || selectedPrice) {
      filterServices();
    }
    else {
      filterServices();
    }
  }, [selectedCategory, selectedCity, selectedPrice]);


  const filterServices = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/admin/services", {
        params: {
          city: selectedCity,
          category_id: selectedCategory,
          ...(selectedPrice === 'PLTH' && { PLTH: true }),
          ...(selectedPrice === 'PHTL' && { PHTL: true }),

        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Services fetched successfully")
      setMockDataServices(response.data.data)
    } catch (error) {
      toast.error("Error while fetching services")
      console.error("Error filtering services:", error);
    }
  };
  return (
    <Box>
      <Header title="All Services" />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px"
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Choose a Category</InputLabel>
              <Select
                onChange={(e) => setSelectedCategory(e.target.value)}
                value={selectedCategory}
              >
                <MenuItem value="">Choose a Category</MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category.id}>{category.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Choose a City</InputLabel>
              <Select
                onChange={(e) => setSelectedCity(e.target.value)}
                value={selectedCity}
              >
                <MenuItem value="">
                  Select a City
                </MenuItem>
                {citiesOfPakistan.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Choose Price Range</InputLabel>
              <Select
                onChange={(e) => setSelectedPrice(e.target.value)}
                value={selectedPrice}
              >
                <MenuItem value="">Choose Price Range</MenuItem>
                <MenuItem value="PHTL">Price high to Low</MenuItem>
                <MenuItem value="PLTH">Price low to High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
         
          <Grid item xs={12} sm={3}>
        <FormControl fullWidth>
              <TextField
                type="email"
            label="Enter User Email"
            onChange={(e) => setFilterEmail(e.target.value)}
            value={filterEmail}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button 
                    variant="contained" 
                    sx={{ backgroundColor: 'blue', color: 'white' }}  
                    onClick={handleEmailFilter}
                  >
                    Get
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </Grid>

        </Grid>
        <IconButton
          onClick={() => setCreateServicePopupOpen(true)}
        >
          <AddIcon />
          <Typography variant="body2">Add Service</Typography>
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
            <div style={{ width: '100%', height: '60vh' }}>
              <DataGrid
                rows={mockDataServices}
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
      {serviceDetailsModalOpen && (
        <ServiceDetail
          open={serviceDetailsModalOpen}
          onClose={handleCloseServiceDetailsModal}
          service={selectedService}
        />
      )}
      {editService && (
        <EditServiceFormPopup
          fetchServices={filterServices}
          service={editService}
          onClose={() => setEditService(null)}
        />
      )}
      <CreateServiceForm
        fetchServices={filterServices}
        open={createServicePopupOpen}
        onClose={() => setCreateServicePopupOpen(false)}
      />
    </Box>
  );
};

export default Services;
