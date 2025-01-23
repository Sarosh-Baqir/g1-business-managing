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

const AddCategoryPopup = ({ open, onClose, fetchCategories }) => {
  const token = util.getToken();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    is_available: false,
  });

  const validationSchema = yup.object().shape({
    title: yup
      .string()
      .required("Title is required")
      .trim()
      .min(1, "Title must be at least 1 character")
      .max(255, "Title cannot exceed 255 characters")
      .matches(/^[A-Za-z\s]+$/, "Title can only contain letters and spaces"),
    description: yup
      .string()
      .required("Description is required")
      .trim()
      .min(1, "Description must be at least 1 character"),
    // .matches(/^[A-Za-z\s]+$/, "Description can only contain letters and spaces"),
    is_available: yup
      .boolean()
      .required("Availability status is required"),
  });

  const handleFormSubmit = async (values) => {
    console.log("Form Values:", values);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/admin/category",
        {
          title: values.title,
          description: values.description,
          is_available: values.is_available,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setInitialValues({
        title: "",
        description: "",
        is_available: false,
      });
      onClose();
      fetchCategories();
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
          <Typography variant="h6" fontWeight="bold">
            Add Category
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
              <Box
                display="grid"
                gap="20px"
                sx={{
                  "& .MuiFormControl-root": {
                    width: "100%",
                  },
                }}
              >
                <TextField
                  fullWidth
                  type="text"
                  variant="outlined"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.title}
                  name="title"
                  label="Title"
                  error={touched.title && !!errors.title}
                  helperText={touched.title && errors.title}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Description"
                  multiline
                  rows={4}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  name="description"
                  error={touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                />
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={touched.is_available && !!errors.is_available}
                >
                  <InputLabel>Availability</InputLabel>
                  <Select
                    value={values.is_available}
                    onChange={handleChange}
                    name="is_available"
                    label="Availability"
                  >
                    <MenuItem value={true}>True</MenuItem>
                    <MenuItem value={false}>False</MenuItem>
                  </Select>
                  {touched.is_available && errors.is_available && (
                    <FormHelperText>{errors.is_available}</FormHelperText>
                  )}
                </FormControl>
                {/* Submit button */}
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    color="success"
                    variant="contained"
                    type="submit"
                  >
                    Create Category
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

export default AddCategoryPopup;
