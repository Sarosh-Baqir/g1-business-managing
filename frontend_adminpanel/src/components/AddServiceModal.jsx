import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  IconButton,
  Grid,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { citiesOfPakistan, mockDataContacts as mockDataContactsInitialState } from "../data/mockData";
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import axios from "axios"
import util from "../Utils/util";
import { appContext } from "../Utils/context";
import { toast } from "react-toastify";

const CreateServiceForm = ({ open, onClose, fetchServices }) => {
  const theme = useTheme();
  const token = util.getToken();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [mockDataContacts] = useState(mockDataContactsInitialState);
  const [categories, setCategories] = useState([])
  const [initialValues, setInitialValues] = useState({
    service_name: "",
    // user_id: "",
    email: "",
    city: "",
    category_id: "",
    description: "",
    price: 0,
    is_available: "",
    start_time: "",
    end_time: "",
  })

  const handleFormSubmit = async (values) => {
    console.log(values)
    try {
      const response = await axios.post("http://localhost:4000/api/admin/services", {
        service_name: values.service_name,
        description: values.description,
        category_id: values.category_id,
        price: parseInt(values.price),
        is_available: values.is_available,
        start_time: values.start_time,
        end_time: values.end_time,
        // user_id: values.user_id
        email: values.email
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response)
      toast.success("Service is created successfully")
      // alert(response.data.message)
      setInitialValues({
        service_name: "",
        category_id: "",
        description: "",
        price: 0,
        is_available: "",
        start_time: "",
        end_time: "",
        email: "",
        city: ""
      })
      onClose();
      fetchServices()
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

  const validationSchema = yup.object().shape({
    service_name: yup
      .string()
      .required("Service name is required")
      .matches(/^[A-Za-z\s]+$/, "Service name can only contain letters and spaces")
      .trim(),
    description: yup
      .string()
      .required("Description is required")
      .min(1, "Description must be at least 1 character")
      .max(1000, "Description cannot exceed 1000 characters"),
    category_id: yup
      .string()
      .required("Category ID is required")
      .test("is-uuid", "Category ID must be a valid UUID", (value) => isUuid(value)),
    price: yup
      .number()
      .positive("Price must be a positive number")
      .required("Price is required"),
    is_available: yup
      .boolean()
      .required("Availability status is required"),
    start_time: yup
      .string()
      .required("Start time is required")
      .min(1, "Start time must be at least 1 character"),
    end_time: yup
      .string()
      .required("End time is required")
      .min(1, "End time must be at least 1 character"),
    // user_id: yup
    //   .string()
    //   .required("User ID is required")
    //   .test("is-uuid", "User ID must be a valid UUID", (value) => isUuid(value)),
    email: yup.string().email("Invalid email").required("Email is required"),
    city: yup
      .string()
      .required("City is required"),
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/admin/category"
          , {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(response.data.data);
        // toast.success("Categories fetched Successfully")
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-service-modal-title"
      aria-describedby="create-service-modal-description"
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
          <Typography variant="h6"  fontWeight="bold">
            Create Service
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
            handleBlur,
            handleChange,
            handleSubmit,
            validateForm,
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="text"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.service_name}
                    name="service_name"
                    label="Service Name"
                    error={touched.service_name && !!errors.service_name}
                    helperText={touched.service_name && errors.service_name}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* <TextField
                    fullWidth
                    type="text"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.user_id}
                    name="user_id"
                    label="User ID"
                    error={touched.user_id && !!errors.user_id}
                    helperText={touched.user_id && errors.user_id}
                  /> */}
                  <TextField
                    fullWidth
                    type="text"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    label="Provider Email"
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category_id"
                      value={values.category_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="category_id"
                      error={touched.category_id && !!errors.category_id}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.title}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.category_id && errors.category_id && (
                      <Typography variant="caption" color="error">
                        {errors.category_id}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    variant="outlined"
                    label="Price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.price}
                    name="price"
                    error={touched.price && !!errors.price}
                    helperText={touched.price && errors.price}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="is_available-label">Avability Status</InputLabel>
                    <Select
                      labelId="is_available-label"
                      id="is_available"
                      value={values.is_available}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="is_available"
                      error={touched.is_available && !!errors.is_available}
                    >
                      <MenuItem value={true}>
                        True
                      </MenuItem>
                      <MenuItem value={false}>
                        False
                      </MenuItem>
                    </Select>
                    {touched.is_available && errors.is_available && (
                      <Typography variant="caption" color="error">
                        {errors.is_available}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="text"
                    variant="outlined"
                    label="Start Time"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.start_time}
                    name="start_time"
                    error={touched.start_time && !!errors.start_time}
                    helperText={touched.start_time && errors.start_time}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="text"
                    variant="outlined"
                    label="End Time"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.end_time}
                    name="end_time"
                    error={touched.end_time && !!errors.end_time}
                    helperText={touched.end_time && errors.end_time}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="city-label">City</InputLabel>
                    <Select
                      labelId="city-label"
                      id="city"
                      value={values.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="city"
                      error={touched.city && !!errors.city}
                    >
                      {citiesOfPakistan.map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.city && errors.city && (
                      <Typography variant="caption" color="error">
                        {errors.city}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    type="text"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    name="description"
                    label="Description"
                    error={touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
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
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  color="success"
                  variant="contained"
                  type="submit"
                // onClick={() => {
                //   validateForm().then((errors) => {
                //     if (Object.keys(errors).length === 0) {
                //       handleFormSubmit(values);
                //     }
                //   });
                // }}
                >
                  Create Service
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default CreateServiceForm;
