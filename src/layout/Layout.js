import * as React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import LogoutIcon from "@mui/icons-material/Logout";
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
import TodayIcon from "@mui/icons-material/Today";
import GroupsIcon from "@mui/icons-material/Groups";
import CreateIcon from "@mui/icons-material/Create";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";

const drawerWidth = "50px";

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
  const [loggedinUser, setLoggedinUser] = React.useState(
    localStorage.getItem("loggedinUser")
      ? JSON.parse(localStorage.getItem("loggedinUser"))
      : []
  );
  const location = useLocation();

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
    localStorage.clear();
    await signOut(auth);
    navigate("/login");
  };

  const pathname = window.location.pathname;

  const getPathname = () => {
    return pathname;
  };
  React.useEffect(() => {
    getPathname();
  }, [pathname]);

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
          {user && window.location.pathname !== "/upcoming-event" ? (
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
            <Link to="/">
              <Typography
                style={{
                  color: "white",
                }}
                variant="h6"
                noWrap
                component="div"
              >
                <img src={DGMlogo} alt="Logo" className="navbar_logos" />
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
                    Logout <LogoutIcon />
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
                {window.location.pathname !== "/login" && (
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
                )}
                {window.location.pathname !== "/upcoming-event" && (
                  <Link
                    style={{
                      color: "white",
                      justifyContent: "space-between",
                      paddingLeft: "5px",
                      paddingRight: "5px",
                    }}
                    to="/upcoming-event"
                  >
                    Event
                  </Link>
                )}
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>
      {user && window.location.pathname !== "/upcoming-event" ? (
        <Drawer className="left-drawer-width" sx={{ flexGrow: 1 }} variant="permanent" open={open}>
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
          <Link to="/">
            <List>
              <ListItem sx={{ cursor: "pointer" }}>
                <ListItemIcon>
                  <DashboardIcon
                    style={{
                      color: `${getPathname() === "/" ? "orange" : "purple"}`,
                    }}
                    fontSize="medium"
                  />
                </ListItemIcon>
                <ListItemText
                  style={{
                    color: `${getPathname() === "/" ? "orange" : "purple"}`,
                  }}
                >
                  <b>Dashboard</b>
                </ListItemText>
              </ListItem>
            </List>
          </Link>
          <Divider />
          <Link to="/profile">
            <List>
              <ListItem sx={{ cursor: "pointer" }}>
                <ListItemIcon>
                  <AccountBoxIcon
                    style={{
                      color: `${
                        getPathname() === "/profile" ? "orange" : "purple"
                      }`,
                    }}
                    fontSize="medium"
                  />
                </ListItemIcon>
                <ListItemText
                  style={{
                    color: `${
                      getPathname() === "/profile" ? "orange" : "purple"
                    }`,
                  }}
                >
                  <b>Profile</b>
                </ListItemText>
              </ListItem>
            </List>
          </Link>
          {loggedinUser?.role * 1 === 1 ||
          loggedinUser?.role * 1 === 2 ||
          loggedinUser?.role * 1 === 10 ? (
            <>
              <Divider />
              <Link to="/add-account">
                <ListItem className="drawerIcons" sx={{ cursor: "pointer" }}>
                  <ListItemIcon>
                    <PersonAddIcon
                      style={{
                        color: `${
                          getPathname() === "/add-account" ? "orange" : "purple"
                        }`,
                      }}
                      fontSize="medium"
                    />
                  </ListItemIcon>
                  <ListItemText
                    style={{
                      color: `${
                        getPathname() === "/add-account" ? "orange" : "purple"
                      }`,
                    }}
                  >
                    <b>Add Acount</b>
                  </ListItemText>
                </ListItem>
              </Link>
            </>
          ) : null}

          <Divider />
          <Link to="/new-converts-management">
            <ListItem className="drawerIcons" sx={{ cursor: "pointer" }}>
              <ListItemIcon>
                <GroupsIcon
                  style={{
                    color: `${
                      getPathname() === "/new-converts-management"
                        ? "orange"
                        : "purple"
                    }`,
                  }}
                  fontSize="medium"
                />
              </ListItemIcon>
              <ListItemText
                style={{
                  color: `${
                    getPathname() === "/new-converts-managementnt"
                      ? "orange"
                      : "purple"
                  }`,
                }}
              >
                <b>Converts</b>
              </ListItemText>
            </ListItem>
          </Link>
          <Divider />
          <Link to="/events">
            <ListItem className="drawerIcons" sx={{ cursor: "pointer" }}>
              <ListItemIcon>
                <TodayIcon
                  style={{
                    color: `${
                      getPathname() === "/events" ? "orange" : "purple"
                    }`,
                  }}
                  fontSize="medium"
                />
              </ListItemIcon>
              <ListItemText
                style={{
                  color: `${getPathname() === "/events" ? "orange" : "purple"}`,
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
                    color: `${
                      getPathname() === "/finance" ? "orange" : "purple"
                    }`,
                  }}
                  fontSize="medium"
                />
              </ListItemIcon>
              <ListItemText
                style={{
                  color: `${
                    getPathname() === "/finance" ? "orange" : "purple"
                  }`,
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
                    color: `${
                      getPathname() === "/reports" ? "orange" : "purple"
                    }`,
                  }}
                  fontSize="medium"
                />
              </ListItemIcon>
              <ListItemText
                style={{
                  color: `${
                    getPathname() === "/reports" ? "orange" : "purple"
                  }`,
                }}
              >
                <b>Reports</b>
              </ListItemText>
            </ListItem>
          </Link>
          <Divider />
          <Link to="/settings">
            <ListItem className="drawerIcons" sx={{ cursor: "pointer" }}>
              <ListItemIcon>
                <ManageAccountsIcon
                  style={{
                    color: `${
                      getPathname() === "/settings" ? "orange" : "purple"
                    }`,
                  }}
                  fontSize="medium"
                />
              </ListItemIcon>
              <ListItemText
                style={{
                  color: `${
                    getPathname() === "/settings" ? "orange" : "purple"
                  }`,
                }}
              >
                <b>Settings</b>
              </ListItemText>
            </ListItem>
          </Link>

          <Divider />
          <Link to="/program-contact">
            <ListItem className="drawerIcons" sx={{ cursor: "pointer" }}>
              <ListItemIcon>
                <ContactPhoneIcon
                  style={{
                    color: `${
                      getPathname() === "/program-contact" ? "orange" : "purple"
                    }`,
                  }}
                  fontSize="medium"
                />
              </ListItemIcon>
              <ListItemText
                style={{
                  color: `${
                    getPathname() === "/program-contact" ? "orange" : "purple"
                  }`,
                }}
              >
                <b>Contact</b>
              </ListItemText>
            </ListItem>
          </Link>
          <Divider />
          <Link to="/upcoming-event">
            <ListItem className="drawerIcons" sx={{ cursor: "pointer" }}>
              <ListItemIcon>
                <ConnectWithoutContactIcon
                  style={{
                    color: `${
                      getPathname() === "/upcoming-event" ? "orange" : "purple"
                    }`,
                  }}
                  fontSize="medium"
                />
              </ListItemIcon>
              <ListItemText
                style={{
                  color: `${
                    getPathname() === "/upcoming-event" ? "orange" : "purple"
                  }`,
                }}
              >
                <b>Program</b>
              </ListItemText>
            </ListItem>
          </Link>
        </Drawer>
      ) : null}

      <Box
        className={
          getPathname() === "/login"
            ? "loginLogoutbackround"
            : "layoutbackround"
        }
        component="main"
        style={{
          height: "100%",
        }}
      >
        <DrawerHeader />
        {layout}
      </Box>
    </Box>
  );
}
