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
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import util from "../Utils/util";
import { toast } from "react-toastify";

const EditServiceFormPopup = ({ service, onClose, fetchServices }) => {
  const token = util.getToken();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [initialValues, setInitialValues] = useState({
    is_available: service.is_available || false,
  });

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/admin/services/${service.id}`,
        {
          is_available: values.is_available,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInitialValues({ is_available: false })
      onClose();
      toast.success("Service updated succesfully")
      fetchServices()
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

  const validationSchema = yup.object().shape({
    is_available: yup.boolean().required("Availability status is required"),
  });

  return (
    <Modal
      open={true}
      onClose={onClose}
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
            Edit Service
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            validateForm,
          }) => (
            <Box
              display="grid"
              gap="20px"
              sx={{
                "& .MuiFormControl-root": {
                  width: "100%",
                },
              }}
            >
              <FormControl fullWidth variant="outlined">
                <InputLabel>Available</InputLabel>
                <Select
                  value={values.is_available}
                  onChange={handleChange}
                  name="is_available"
                  onBlur={handleBlur}
                  error={touched.is_available && !!errors.is_available}
                >
                  <MenuItem value={true}>True</MenuItem>
                  <MenuItem value={false}>False</MenuItem>
                </Select>
              </FormControl>

              {/* Submit button */}
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  color="success"
                  variant="contained"
                  onClick={() => {
                    validateForm().then((errors) => {
                      if (Object.keys(errors).length === 0) {
                        handleFormSubmit(values);
                      }
                    });
                  }}
                >
                  Update Service
                </Button>
              </Box>
            </Box>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default EditServiceFormPopup;
