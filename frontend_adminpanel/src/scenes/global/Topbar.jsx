import { Box, IconButton, useTheme, Menu, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"; // Importing dropdown icon
import { appContext } from "../../Utils/context"; // Importing context for user data
import util from "../../Utils/util";

const Topbar = () => {
  const navigate = useNavigate()
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { user } = useContext(appContext); // Access user data from context
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    util.logout()
    navigate("/login")
    handleMenuClose();
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        {/* <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" /> */}
        {/* <IconButton type="button" sx={{ p: 1 }}> */}
        {/* <SearchIcon /> */}
        {/* </IconButton> */}
      </Box>

      {/* ICONS */}
      <Box display="flex" alignItems="center">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        {/* <Typography variant="body1" color={colors.grey[100]} mr={1}>
          {user?.users?.email}
        </Typography> */}
        <IconButton onClick={handleMenuOpen} sx={{
          '&:hover': {
            backgroundColor: 'transparent', // Disable hover color
          },
          '&:active': {
            backgroundColor: 'transparent', // Disable active color
          },
          '&:focus': {
            backgroundColor: 'transparent', // Disable focus color
          },
        }}>
          <Typography variant="body1" color={colors.grey[100]} mr={1}>
            {user?.users?.email}
          </Typography>
          <ArrowDropDownIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
