import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Logout from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SpeedIcon from '@mui/icons-material/Speed';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

import { useAuthUser } from '../../hooks/useAuthUser';
import { useLogoutUserMutation } from '../../features/auth/authApiSlice';

export const AuthNav = () => {
  const {
    user: { user },
  } = useSelector((state) => state.auth);

  const { isAdmin } = useAuthUser();
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const [logoutUser] = useLogoutUserMutation();

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      handleCloseUserMenu();
      navigate('/login');
    } catch {
      /* empty */
    }
  };

  const capitalizedUsername = user?.username?.charAt(0).toUpperCase() || '';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: '#000',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.3)',
        minHeight: '8dvh',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 3,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'green.main',
              alignItems: 'center',
              letterSpacing: '-0.5px',
              textDecoration: 'none',
            }}
          >
            <ReceiptLongIcon sx={{ mr: 1 }} />
            BILLIFY
          </Typography>

          {/* Mobile Hamburger with Tooltip */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <Tooltip
              title="Open menu"
              arrow
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 4],
                      },
                    },
                  ],
                },
              }}
            >
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                sx={{ color: 'green.main' }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>

            {/* Dark Hamburger Menu */}
            <Menu
              disableScrollLock
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
              slotProps={{
                paper: {
                  sx: {
                    backgroundColor: '#000',
                    color: 'white',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                    mt: 1.5,
                  },
                },
                list: {
                  sx: {
                    '& .MuiMenuItem-root:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  },
                },
              }}
            >
              {[
                { label: 'Dashboard', icon: BarChartIcon, path: '/dashboard' },
                {
                  label: 'Documents',
                  icon: PointOfSaleIcon,
                  path: '/documents',
                },
                {
                  label: 'Customers',
                  icon: PeopleAltOutlinedIcon,
                  path: '/customers',
                },
                {
                  label: 'Manage Profile',
                  icon: ManageAccountsIcon,
                  path: '/profile',
                },
                ...(isAdmin
                  ? [
                      {
                        label: 'Admin Panel',
                        icon: AdminPanelSettingsIcon,
                        path: '/users',
                      },
                    ]
                  : []),
              ].map((item) => (
                <MenuItem
                  key={item.label}
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(item.path);
                  }}
                >
                  <ListItemIcon sx={{ color: 'green.main' }}>
                    <item.icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'green.main',
              textDecoration: 'none',
            }}
          >
            <ReceiptLongIcon sx={{ mr: 1 }} />
            BILLIFY
          </Typography>

          {/* Desktop Navigation */}
          <Box
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}
          >
            {[
              { label: 'Dashboard', path: '/dashboard' },
              { label: 'Documents', path: '/documents' },
              { label: 'Customers', path: '/customers' },
              { label: 'Manage Profile', path: '/profile' },
            ].map((item) => (
              <Button
                key={item.label}
                component={RouterLink}
                to={item.path}
                sx={{
                  color: 'white',
                  fontWeight: 500,
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                }}
              >
                {item.label}
              </Button>
            ))}
            {isAdmin && (
              <Button
                component={RouterLink}
                to="/users"
                sx={{
                  color: 'white',
                  fontWeight: 500,
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                }}
              >
                Admin Panel
              </Button>
            )}
          </Box>

          {/* Account Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip
              title={`${user.username}`}
              arrow
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 10],
                      },
                    },
                  ],
                },
              }}
            >
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {user?.avatar ? (
                  <Avatar
                    alt={user?.username}
                    src={user?.avatar}
                    sx={{
                      width: 36,
                      height: 36,
                      border: '2px solid',
                      borderColor: 'green.main',
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      bgcolor: 'green.main',
                      width: 36,
                      height: 36,
                      fontWeight: 700,
                    }}
                  >
                    {capitalizedUsername}
                  </Avatar>
                )}
              </IconButton>
            </Tooltip>
            {/* Account Menu Dropdown  */}
            <Menu
              disableScrollLock
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              slotProps={{
                paper: {
                  sx: {
                    backgroundColor: '#000',
                    color: 'white',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                    mt: 2.2,
                    ml: 0.8,
                  },
                },
                list: {
                  sx: {
                    '& .MuiMenuItem-root:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  },
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleCloseUserMenu();
                  navigate('/profile');
                }}
              >
                <ListItemIcon>
                  <VerifiedUserOutlinedIcon
                    fontSize="small"
                    sx={{ color: 'green.main' }}
                  />
                </ListItemIcon>
                <ListItemText disableTypography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Tooltip
                      placement="left"
                      arrow
                      title={`${user.firstName} ${user.lastName}`}
                    >
                      <Typography
                        variant="subtitle1"
                        noWrap
                        sx={{
                          maxWidth: '8ch',
                          fontSize: '1.2rem',
                          textTransform: 'capitalize',
                          lineHeight: 1.1,
                        }}
                      >
                        {user.firstName} {user.lastName}
                      </Typography>
                    </Tooltip>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontSize: '.6rem',
                        color: 'green.main',
                        marginTop: '-3px',
                      }}
                    >
                      ({isAdmin ? 'Project Admin' : 'Product User'})
                    </Typography>
                  </Box>
                </ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseUserMenu();
                  navigate('/profile');
                }}
              >
                <ListItemIcon>
                  <PersonOutlinedIcon
                    fontSize="small"
                    sx={{ color: 'green.main' }}
                  />
                </ListItemIcon>
                <ListItemText primary="View Profile" />
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleCloseUserMenu();
                  navigate('/dashboard');
                }}
              >
                <ListItemIcon>
                  <SpeedIcon fontSize="small" sx={{ color: 'green.main' }} />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </MenuItem>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" sx={{ color: 'error.main' }} />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
