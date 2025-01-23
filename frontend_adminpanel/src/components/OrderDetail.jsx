import React from "react";
import {
  Modal,
  Box,
  Typography,
  Grid,
  TextField,
  useTheme,
  useMediaQuery,
  IconButton,
  TextareaAutosize
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Height } from "@mui/icons-material";

const OrderDetail = ({ open, onClose, order }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!open || !order) {
    return null;
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          borderRadius: "10px",
          padding: isSmallScreen ? "10px" : "20px",
          maxWidth: "80vw",
          maxHeight: "auto",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${theme.palette.divider}`,
            paddingBottom: "10px",
            marginBottom: "10px",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Order Details
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={2} justifyContent="center" mt={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" mb={1}>
              Service Provider
            </Typography>
            <TextField
              disabled
              fullWidth
              value={order.service_provider_id}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" mb={1}>
              Customer ID
            </Typography>
            <TextField
              disabled
              fullWidth
              value={order.customer_id}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" mb={1}>
              Payment Method
            </Typography>
            <TextField
              disabled
              fullWidth
              value={order.payment_method}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" mb={1}>
              Order Completion Date
            </Typography>
            <TextField
              disabled
              fullWidth
              value={order.cancellation_reason ? order.cancellation_reason : "N/A"}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body1" mb={1}>
              City
            </Typography>
            <TextField
              disabled
              fullWidth
              value={order.customer_address.city}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body1" mb={1}>
              State
            </Typography>
            <TextField
              disabled
              fullWidth
              value={order.customer_address.state}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body1" mb={1}>
              Country
            </Typography>
            <TextField
              disabled
              value={order.customer_address.country}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" mb={1}>
              Additional notes
            </Typography>
            <TextField
              disabled
              multiline
              minRows={5}
              value={order.additional_notes}
              fullWidth
              sx={{
                '& .MuiInputBase-root': {
                  padding: '8.5px 14px',
                },
                '& .MuiOutlinedInput-root': {
                  padding: '8.5px 14px',
                  borderRadius: '4px',
                },
                '& .Mui-disabled': {
                  WebkitTextFillColor: theme.palette.text.primary,
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" mb={1}>
              Cancellation reasons
            </Typography>
            <TextField
              disabled
              multiline
              minRows={5}
              value={order.cancellation_reason ? order.cancellation_reason : "N/A"}
              fullWidth
              sx={{
                '& .MuiInputBase-root': {
                  padding: '8.5px 14px',
                },
                '& .MuiOutlinedInput-root': {
                  padding: '8.5px 14px',
                  borderRadius: '4px',
                },
                '& .Mui-disabled': {
                  WebkitTextFillColor: theme.palette.text.primary,
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default OrderDetail;
