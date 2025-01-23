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
const UserDetail = ({ open, onClose, user }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!open || !user) {
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
            User Details
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={2} justifyContent="center" mt={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" mb={1}>
              Phone number
            </Typography>
            <TextField
              value={user.users.phone}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" mb={1}>
              Gender
            </Typography>
            <TextField
              value={user.users.gender}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" mb={1}>
              City
            </Typography>
            <TextField
              value={user.users.address?.city || "N/A"}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" mb={1}>
              State
            </Typography>
            <TextField
              value={user.users.address?.state || "N/A"}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" mb={1}>
              Country
            </Typography>
            <TextField
              value={user.users.address?.country || "N/A"}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" mb={1}>
              CNIC
            </Typography>
            <TextField
              value={user.users.cnic ? user.users.cnic : "N/A"}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" mb={1}>
              Bio
            </Typography>
            <TextField
              disabled
              multiline
              minRows={5}
              value={user.users.bio ? user.users.bio : "N/A"}
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

export default UserDetail;
