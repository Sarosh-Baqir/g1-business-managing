import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, useTheme, Grid } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import util from "../../Utils/util";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CancelIcon from '@mui/icons-material/Cancel';
import OrderDetail from "../../components/OrderDetail";
import { toast } from "react-toastify";


const Orders = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const token = util.getToken();
  const [mockDataOrders, setMockDataOrders] = useState([]);
  const [orderDetailsModalOpen, setOrderDetailsModalOpen] = useState(false);

  const handleDelete = (id) => {
    setSelectedOrder(id);
    setDeleteConfirmationOpen(true);
  };

  const handleCloseOrderDetailsModal = () => {
    setOrderDetailsModalOpen(false);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/admin/order/${selectedOrder}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },

      });
      toast.success(response.data.message)
      setSelectedOrder(null)
      setDeleteConfirmationOpen(false);
      getOrders()
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

  const handleEdit = async (row) => {
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/admin/order/${row.id}`,
        {
          order_status: "cancelled",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message)
      getOrders()
      // alert(response.data.message);
    } catch (error) {
      console.log("error", error);
      if (error.response && error.response.status === 401) {
        toast.info("Autentication token has been expired or you are not a admin.")
        navigate("/login");
      } else if (error.response) {
        toast.error(error.response.data.message)
        // alert(error.response.data.message);
      }
    }


  };

  const handleOrderDetailClick = (row) => {
    setSelectedOrder(row);
    setOrderDetailsModalOpen(true);
  };

  const getOrders = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/admin/order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },

      });
      const res = response.data.data;
      // toast.success(response.data.message)
      console.log(res)
      setMockDataOrders(res)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.info("Autentication token has been expired or you are not a admin.")
        navigate("/login")
      }
      else if (error.response) {
        toast.info(error.response.data.message)
        // alert(error.response.data.message)
      }
    }
  };
  useEffect(() => {
    getOrders();
  }, []);

  const columns = [
    {
      field: "service_id", headerName: "Service ID", flex: 0.5, minWidth: 300, sortable: false,
      filterable: false
    },
    {
      field: "order_date", headerName: "Order Date", flex: 0.5, minWidth: 100, sortable: false,
      filterable: false
    },
    {
      field: "order_status", headerName: "Order Status", flex: 0.5, minWidth: 50, sortable: false,
      filterable: false
    },
    {
      field: "order_price", headerName: "Order Price", flex: 0.5, minWidth: 30, sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Typography>
          $ {row.order_price}
        </Typography>
      ),
    },
    {
      field: "payment_status", headerName: "Payment Status", flex: 0.5, minWidth: 30, sortable: false,
      filterable: false
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
          <IconButton onClick={() => handleOrderDetailClick(row)}>
            <InfoOutlinedIcon />
          </IconButton>
          <IconButton
            onClick={() => handleEdit(row)}
            disabled={row.order_status === "completed" || row.order_status === "cancelled"}
          >
            <CancelIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => handleDelete(row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="0px 20px">
      <Header title="All Orders" />
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
            <div style={{ width: '100%', height: '70vh' }}>
              <DataGrid
                rows={mockDataOrders}
                style={{ maxHeight: '70vh' }}
                overflow="auto"
                columns={columns}
              />
            </div>
          </Grid>
        </Grid>
      </Box>
      {orderDetailsModalOpen && (
        <OrderDetail
          open={orderDetailsModalOpen}
          onClose={handleCloseOrderDetailsModal}
          order={selectedOrder}
        />
      )}
      <DeleteConfirmationModal
        open={deleteConfirmationOpen}
        onClose={handleDeleteCancel}
        onDeleteConfirmed={handleDeleteConfirmed}
      />
    </Box>
  );
};

export default Orders;
