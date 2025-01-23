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

const ServiceDetail = ({ open, onClose, service }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!open || !service) {
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
          maxWidth: "50vw",
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
            Service Details
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={2} justifyContent="center" mt={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" mb={1}>
              Provider First Name
            </Typography>
            <TextField
              disabled
              fullWidth
              value={service.user.first_name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" mb={1}>
              Provider Last Name
            </Typography>
            <TextField
              disabled
              fullWidth
              value={service.user.last_name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" mb={1}>
              Category ID
            </Typography>
            <TextField
              disabled
              fullWidth
              value={service.category_id}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" mb={1}>
              Available
            </Typography>
            <TextField
              disabled
              fullWidth
              value={service.is_available}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" mb={1}>
              Description
            </Typography>
            <TextField
              disabled
              multiline
              minRows={5}
              value={service.description}
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

export default ServiceDetail;
