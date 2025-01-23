import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import util from "../Utils/util";
import { toast } from "react-toastify";

const EditFormPopup = ({ user, onClose, fetchUsers }) => {
  const token = util.getToken();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [initialValues, setInitialValues] = useState({
    email: user.users.email || "",
    role_title: user.roles.title || "",
    is_verified: user.users.is_verified || false,
    is_admin: user.users.is_admin || false,
  });

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/admin/user/${user.users.id}`,
        {
          email: values.email,
          role_title: values.role_title,
          is_verified: values.is_verified,
          is_admin: values.is_admin,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setInitialValues({
        email: "",
        role_title: "",
        is_verified: false,
        is_admin: false,
      });
      onClose();
      fetchUsers();
    } catch (error) {
      console.log("error", error);
      if (error.response && error.response.status === 401) {
        toast.info("Authentication token has expired or you are not an admin.");
        navigate("/login");
      } else if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    role_title: yup.string().required("Role title is required"),
    is_verified: yup.boolean().required("Verification status is required"),
    is_admin: yup.boolean().required("Admin status is required"),
  });

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="edit-user-modal-title"
      aria-describedby="edit-user-modal-description"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          borderRadius: "10px",
          padding: isSmallScreen ? "20px" : "40px",
          width: isSmallScreen ? "90vw" : "60vw",
          maxWidth: "600px",
          boxShadow: 24,
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
            marginBottom: "20px",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Edit User
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            handleFormSubmit(values);
            resetForm();
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            validateForm,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box display="grid" gap="20px">
                <TextField
                  fullWidth
                  variant="outlined"
                  type="email"
                  label="Email"
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />

                <FormControl
                  fullWidth
                  variant="outlined"
                  error={touched.role_title && Boolean(errors.role_title)}
                >
                  <InputLabel>Role Title</InputLabel>
                  <Select
                    value={values.role_title}
                    onChange={handleChange}
                    name="role_title"
                    label="Role Title"
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="customer">Customer</MenuItem>
                    <MenuItem value="service_provider">Service Provider</MenuItem>
                  </Select>
                  {touched.role_title && errors.role_title && (
                    <FormHelperText>{errors.role_title}</FormHelperText>
                  )}
                </FormControl>

                <FormControl
                  fullWidth
                  variant="outlined"
                  error={touched.is_verified && Boolean(errors.is_verified)}
                >
                  <InputLabel>Verification Status</InputLabel>
                  <Select
                    labelId="is-verified-label"
                    id="isVerified"
                    value={values.is_verified}
                    onChange={handleChange}
                    name="is_verified"
                    label="Verification Status"
                  >
                    <MenuItem value={true}>Verified</MenuItem>
                    <MenuItem value={false}>Not Verified</MenuItem>
                  </Select>
                  {touched.is_verified && errors.is_verified && (
                    <FormHelperText>{errors.is_verified}</FormHelperText>
                  )}
                </FormControl>

                <FormControl
                  fullWidth
                  variant="outlined"
                  error={touched.is_admin && Boolean(errors.is_admin)}
                >
                  <InputLabel>Admin Status</InputLabel>
                  <Select
                    value={values.is_admin}
                    onChange={handleChange}
                    name="is_admin"
                    label="Admin Status"
                  >
                    <MenuItem value={true}>True</MenuItem>
                    <MenuItem value={false}>False</MenuItem>
                  </Select>
                  {touched.is_admin && errors.is_admin && (
                    <FormHelperText>{errors.is_admin}</FormHelperText>
                  )}
                </FormControl>

                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    color="success"
                    variant="contained"
                    type="submit"
                  >
                    Update User
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default EditFormPopup;
