import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import util from "../Utils/util";
import { appContext } from "../Utils/context";
import { toast } from "react-toastify";

const AuthForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const handleFormSubmit = async (values) => {
    try {
      await axios
        .post("http://localhost:5000/api/users/login", {
          email: values.email,
          password: values.password,
        })
        .then((response) => {
          console.log("Success ========>", response);
          toast.success("Successfully Logged In");
          util.setToken(response.data.data.token);
          navigate("/team");
        })
        .catch((error) => {
          if (error.response.status == 401) {
            toast.error(error.response.data.message);
            // alert(error.response.data.message)
          } else if (error.response.status == 403) {
            toast.error(error.response.data.message);
            // alert(error.response.data.message)
          }
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(5, "Password must be more than five characters"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      p="20px"
    >
      <Box
        width={isNonMobile ? "50%" : "100%"}
        maxWidth="600px"
        m="0 auto"
        p="20px"
        border="1px solid #ccc"
        borderRadius="8px"
        boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)"
      >
        <Typography variant="h4" align="center" gutterBottom>
          Enter details to sign in
        </Typography>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
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
              <Box display="grid" gap="30px">
                <TextField
                  fullWidth
                  variant="filled"
                  type="email"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{
                    "& .MuiFilledInput-root": {
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    },
                    "& .MuiFilledInput-underline:before": {
                      borderBottom: "none",
                    },
                    "& .MuiFilledInput-underline:after": {
                      borderBottom: "none",
                    },
                  }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{
                    "& .MuiFilledInput-root": {
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    },
                    "& .MuiFilledInput-underline:before": {
                      borderBottom: "none",
                    },
                    "& .MuiFilledInput-underline:after": {
                      borderBottom: "none",
                    },
                  }}
                />
                <Box>
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    onClick={() => {
                      validateForm().then((errors) => {
                        if (Object.keys(errors).length === 0) {
                          handleFormSubmit(values);
                        }
                      });
                    }}
                  >
                    Login
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default AuthForm;
