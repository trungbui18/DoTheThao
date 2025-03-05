import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import Inventory2SharpIcon from "@mui/icons-material/Inventory2Sharp";
import LogoutIcon from "@mui/icons-material/Logout";
import CategoryIcon from "@mui/icons-material/Category";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import KTLogo from "../../assets/image/KTlogo.png";
import Content from "./Content";
import ContentUser from "./ContentUser";
import ContentProduct from "./ContentProduct";
import ContentCategories from "./ContentCategories";
import ContentOrder from "./ContentOrder";
import { useNavigate } from "react-router-dom";

const NAVIGATION = [
  { kind: "header", title: "Main items" },
  { segment: "dashboard", title: "Bảng Điều Khiển", icon: <DashboardIcon /> },
  { segment: "manage-user", title: "Khách Hàng", icon: <GroupIcon /> },
  {
    segment: "manage-product",
    title: "Sản Phẩm ",
    icon: <Inventory2SharpIcon />,
  },
  { segment: "order", title: "Đơn Hàng", icon: <AccountBoxIcon /> },
  { segment: "categories", title: "Danh Mục", icon: <CategoryIcon /> },
  { segment: "logout", title: "Đăng Xuất", icon: <LogoutIcon /> },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  let content;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  switch (pathname) {
    case "/dashboard":
      content = <Content />;
      break;
    case "/manage-user":
      content = <ContentUser />;
      break;
    case "/manage-product":
      content = <ContentProduct />;
      break;
    case "/order":
      content = <ContentOrder />;
      break;
    case "/logout":
      handleLogout();
      break;
    case "/categories":
      content = <ContentCategories />;
      break;
    default:
      content = <Box>Chọn một mục trong menu!</Box>;
  }

  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {content}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function MenuAdminHome(props) {
  const { window } = props;
  const router = useDemoRouter("/dashboard");
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src={KTLogo} alt="Logo" />,
        title: "",
      }}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout
        sx={{
          overflowX: "auto",
          width: "100%",
        }}
      >
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

MenuAdminHome.propTypes = {
  window: PropTypes.func,
};

export default MenuAdminHome;
