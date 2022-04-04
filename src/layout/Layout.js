import * as React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useContext } from "react";
import { auth, db } from "../firebse";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { AuthContext } from "../context/auth";
import { Paid } from "@mui/icons-material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DGMlogo from "../assets/images/dgm.jpg";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CollectionsIcon from "@mui/icons-material/Collections";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import TodayIcon from "@mui/icons-material/Today";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GroupsIcon from "@mui/icons-material/Groups";
import CreateIcon from "@mui/icons-material/Create";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer({ layout }) {
  const location = useLocation();
  const pathName = location.pathname;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignout = async () => {
    await updateDoc(doc(db, "DGM_YOUTH_users", auth.currentUser?.uid), {
      isOnline: false,
    });
    await signOut(auth);
    navigate("/login");
  };
  return (
    <Box>
      <CssBaseline />
      <AppBar
        style={{ backgroundColor: "purple" }}
        position="fixed"
        open={open}
      >
        <Toolbar
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {user ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
          ) : null}

          <div>
            <Link to="/dashboard">
              <Typography
                style={{
                  color: "white",
                }}
                variant="h6"
                noWrap
                component="div"
              >
                <img src={DGMlogo} alt="Lgo" className="navbar_logos" />
                DGM Youth
              </Typography>
            </Link>
          </div>

          <div>
            {user ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    color: "white",
                    justifyContent: "space-between",
                    paddingLeft: "5px",
                    paddingRight: "5px",
                  }}
                >
                  <Typography
                    style={{ cursor: "pointer" }}
                    onClick={handleSignout}
                  >
                    Logout
                  </Typography>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingLeft: "5px",
                  paddingRight: "5px",
                }}
              >
                <Link
                  style={{
                    color: "white",
                    justifyContent: "space-between",
                    paddingLeft: "5px",
                    paddingRight: "5px",
                  }}
                  to="/register"
                >
                  Register
                </Link>

                <Link
                  style={{
                    color: "white",
                    justifyContent: "space-between",
                    paddingLeft: "5px",
                    paddingRight: "5px",
                  }}
                  to="/login"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>
      {user ? (
        <Drawer sx={{ flexGrow: 1 }} variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <Link to="/dashboard">
            <List>
              <ListItem sx={{ cursor: "pointer" }}>
                <ListItemIcon>
                  <DashboardIcon
                    style={{
                      color: `${
                        pathName === "/dashboard" ? "orange" : "purple"
                      }`,
                    }}
                    fontSize="large"
                  />
                </ListItemIcon>
                <ListItemText
                  style={{
                    color: `${pathName === "/dashboard" ? "orange" : "purple"}`,
                  }}
                >
                  <b>Dashboard</b>
                </ListItemText>
              </ListItem>
            </List>
          </Link>
          <Divider />
          <Link to="/">
            <List>
              <ListItem sx={{ cursor: "pointer" }}>
                <ListItemIcon>
                  <AccountBoxIcon
                    style={{
                      color: `${pathName === "/" ? "orange" : "purple"}`,
                    }}
                    fontSize="large"
                  />
                </ListItemIcon>
                <ListItemText
                  style={{
                    color: `${pathName === "/" ? "orange" : "purple"}`,
                  }}
                >
                  <b>Profile</b>
                </ListItemText>
              </ListItem>
            </List>
          </Link>
          <Divider />
          <Link to="/add-account">
            <ListItem className="drawerIcons" sx={{ cursor: "pointer" }}>
              <ListItemIcon>
                <PersonAddIcon
                  style={{
                    color: `${
                      pathName === "/add-account" ? "orange" : "purple"
                    }`,
                  }}
                  fontSize="large"
                />
              </ListItemIcon>
              <ListItemText
                style={{
                  color: `${pathName === "/add-account" ? "orange" : "purple"}`,
                }}
              >
                <b>Add Acount</b>
              </ListItemText>
            </ListItem>
          </Link>
          <Divider />
          <Link to="/new-converts-manageme">
            <ListItem className="drawerIcons" sx={{ cursor: "pointer" }}>
              <ListItemIcon>
                <ManageAccountsIcon
                  style={{
                    color: `${
                      pathName === "/new-converts-manageme" ? "orange" : "purple"
                    }`,
                  }}
                  fontSize="large"
                />
              </ListItemIcon>
              <ListItemText
                style={{
                  color: `${
                    pathName === "/new-converts-manageme" ? "orange" : "purple"
                  }`,
                }}
              >
                <b>Converts</b>
              </ListItemText>
            </ListItem>
          </Link>
          <Divider />

          <ListItem className="drawerIcons" sx={{ cursor: "pointer" }}>
            <ListItemIcon>
              <GroupsIcon
                style={{
                  color: `${pathName === "/contact" ? "orange" : "purple"}`,
                }}
                fontSize="large"
              />
            </ListItemIcon>
            <ListItemText
              style={{
                color: `${pathName === "/contact" ? "orange" : "purple"}`,
              }}
            >
              <b>Groups</b>
            </ListItemText>
          </ListItem>
          <Divider />
          <Link to="/events">
            <ListItem className="drawerIcons" sx={{ cursor: "pointer" }}>
              <ListItemIcon>
                <TodayIcon
                  style={{
                    color: `${pathName === "/events" ? "orange" : "purple"}`,
                  }}
                  fontSize="large"
                />
              </ListItemIcon>
              <ListItemText
                style={{
                  color: `${pathName === "/events" ? "orange" : "purple"}`,
                }}
              >
                <b>Events</b>
              </ListItemText>
            </ListItem>
          </Link>

          <Divider />
          <Link to="/finance">
            <ListItem className="drawerIcons" sx={{ cursor: "pointer" }}>
              <ListItemIcon>
                <Paid
                  style={{
                    color: `${pathName === "/finance" ? "orange" : "purple"}`,
                  }}
                  fontSize="large"
                />
              </ListItemIcon>
              <ListItemText
                style={{
                  color: `${pathName === "/finance" ? "orange" : "purple"}`,
                }}
              >
                <b>Finace</b>
              </ListItemText>
            </ListItem>
          </Link>

          <Divider />
          <Link to="/reports">
            <ListItem className="drawerIcons" sx={{ cursor: "pointer" }}>
              <ListItemIcon>
                <CreateIcon
                  style={{
                    color: `${pathName === "/reports" ? "orange" : "purple"}`,
                  }}
                  fontSize="large"
                />
              </ListItemIcon>
              <ListItemText
                style={{
                  color: `${pathName === "/reports" ? "orange" : "purple"}`,
                }}
              >
                <b>Reports</b>
              </ListItemText>
            </ListItem>
          </Link>
          <Divider />
        </Drawer>
      ) : null}

      <Box
        className={
          location.pathname === "/login"
            ? "loginLogoutbackround"
            : "layoutbackround"
        }
        component="main"
        sx={{
          p: 1,
          height: "100vh",
        }}
      >
        <DrawerHeader />
        {layout}
      </Box>
    </Box>
  );
}
