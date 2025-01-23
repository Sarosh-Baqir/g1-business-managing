import React, { useState, useEffect } from "react";
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
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import Header from "./Header";
import axios from "axios";
import util from "../Utils/util";
import { appContext } from "../Utils/context";
import { toast } from "react-toastify";

const AddFormPopup = ({ open, onClose, fetchUsers }) => {
  const token = util.getToken();
  const navigate = useNavigate()
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [initialValues, setInitialValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    cnic: "",
    role_title: "",
    is_verified: "",
    is_admin: "",
    gender: ""
  });
  const validationSchema = yup.object().shape({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
      .string()
      .matches(/^\d+$/, "Only digits are allowed")
      .min(11, "Phone must be at least 11 digits long")
      .max(15, "Phone cannot be more than 15 digits long")
      .required("Phone is required"),
    cnic: yup
      .string()
      .matches(
        /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/,
        "CNIC must be in the format XXXXX-XXXXXXX-X"
      )
      .required("CNIC is required"),
    role_title: yup.string().required("Role title is required"),
    is_verified: yup.string().required("Verification status is required"),
    is_admin: yup.string().required("Admin status is required"),
    gender: yup.string().required("Gender is required"),
  });
  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post("http://localhost:4000/api/admin/user", {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
        cnic: values.cnic,
        role_title: values.role_title,
        is_verified: values.is_verified,
        is_admin: values.is_admin,
        gender: values.gender
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response)
      toast.success(response.data.message)
      setInitialValues({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        cnic: "",
        role_title: "",
        is_verified: "",
        is_admin: "",
        gender: ""
      })
      onClose();
      fetchUsers()
    } catch (error) {
      console.log("error", error);
      if (error.response && error.response.status === 401) {
        toast.info("Autentication token has been expired or you are not a admin.")
        navigate("/login")
      }
      else if (error.response) {
        toast.error(error.response.data.message)
      }
    }
  };
  return (
    <Modal
      open={open}
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
          // backgroundColor: theme.palette.background.paper,
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
            Add User
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
              <Grid container spacing={2} justifyContent="center" mt={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="text"
                    label="First Name"
                    onChange={handleChange}
                    value={values.first_name}
                    name="first_name"
                    error={touched.first_name && !!errors.first_name}
                    helperText={touched.first_name && errors.first_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="text"
                    label="Last Name"
                    onChange={handleChange}
                    value={values.last_name}
                    name="last_name"
                    error={touched.last_name && !!errors.last_name}
                    helperText={touched.last_name && errors.last_name}
                  /></Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="text"
                    label="Email"
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  /></Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="text"
                    label="Phone number"
                    onChange={handleChange}
                    value={values.phone}
                    name="phone"
                    error={touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
                  /></Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="text"
                    label="CNIC"
                    onChange={handleChange}
                    value={values.cnic}
                    name="cnic"
                    error={touched.cnic && !!errors.cnic}
                    helperText={touched.cnic && errors.cnic}
                  /></Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Role Title</InputLabel>
                    <Select
                      value={values.role_title}
                      onChange={handleChange}
                      name="role_title"
                      error={touched.role_title && !!errors.role_title}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="customer">Customer</MenuItem>
                      <MenuItem value="service_provider">Service Provider</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Verification Satus</InputLabel>
                    <Select
                      value={values.is_verified}
                      onChange={handleChange}
                      name="is_verified"
                      error={touched.is_verified && !!errors.is_verified}
                    >
                      <MenuItem value="true">True</MenuItem>
                      <MenuItem value="false">False</MenuItem>=
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Admin</InputLabel>
                    <Select
                      value={values.is_admin}
                      onChange={handleChange}
                      name="is_admin"
                      error={touched.is_admin && !!errors.is_admin}
                    >
                      <MenuItem value={true}>True</MenuItem>
                      <MenuItem value={false}>False</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={values.gender}
                      onChange={handleChange}
                      name="gender"
                      error={touched.gender && !!errors.gender}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}></Grid>
              </Grid>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  color="success"
                  variant="contained"
                  type="submit"
                >
                  Add User
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Modal >
  )
}

export default AddFormPopup