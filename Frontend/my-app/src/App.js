import "./App.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";

import LoginUser from "./views/FrmLoginUser";
import LoginAdmin from "./views/FrmLoginAdmin";
import Login from "./views/FrmLogin";
import HomePage from "./views/HomePage";
import CartPage from "./views/CartPage";
import ProductDetail from "./views/ProductDetail";
import FrmDashboard from "./views/FrmDashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/admin/PrivateRoute";
import CheckOut from "./views/CheckOut";
import InfoPage from "./views/InfoPage";
import CategoryPage from "./views/CategoryPage";
import AboutPage from "./views/AboutPage";
import OrderDetailPage from "./views/OrderDetailPage";
import PaymentSuccess from "./components/User/PaymentSuccess";
import PrivateRouteUser from "./components/User/PrivateRouteUser";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/cart"
          element={
            <PrivateRouteUser>
              <CartPage />
            </PrivateRouteUser>
          }
        />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<LoginAdmin />} />
        <Route path="/loginuser" element={<LoginUser />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route
          path="/checkout"
          element={
            <PrivateRouteUser>
              <CheckOut />
            </PrivateRouteUser>
          }
        />
        <Route
          path="/info"
          element={
            <PrivateRouteUser>
              <InfoPage />
            </PrivateRouteUser>
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/oder-detail/:id" element={<OrderDetailPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route
          path="/FrmDashboard"
          element={
            <PrivateRoute>
              <FrmDashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
