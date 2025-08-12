import "./App.css";
import AdminLayout from "./layout/AdminLayout";
import { ROUTES } from "./lib/constants";
import Dashboard from "./features/Dashboard/pages/Dashboard";
import { Routes, Route } from "react-router-dom";
import Login from "./features/Auth/pages/Login";
import MainCategory from "./features/Categories/pages/MainCategory";
import Subcategory from "./features/Categories/pages/Subcategory";
import Category from "./features/Categories/pages/Category";
import ProductList from "./features/Product/Pages/ProductList";
import OrderList from "./features/Orders/pages/OrderList";
import Customers from "./features/Customers/pages/Customers";
import ProductSingleView from "./features/Product/Pages/ProductSingleView";
import CouponList from "./features/Coupons/Pages/CouponList";
import SubAdminList from "./features/SubAdmin/Pages/SubAdminList";
import AddSubAdmin from "./features/SubAdmin/Pages/AddSubAdmin";
import CarouselList from "./features/Carousel/Pages/CarouselList";

function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.MAINCATEGORY} element={<MainCategory />} />
        <Route path={ROUTES.CATEGORY} element={<Category />} />
        <Route path={ROUTES.SUBCATEGORY} element={<Subcategory />} />
        <Route path={ROUTES.PRODUCT_LIST} element={<ProductList />} />
        <Route path={ROUTES.ORDERS_LIST} element={<OrderList />} />
        <Route path={ROUTES.CUSTOMERS} element={<Customers />} />
        <Route path={ROUTES.PRODUCT_SINGLE} element={<ProductSingleView />} />
        <Route path={ROUTES.COUPONS} element={<CouponList />} />
        <Route path={ROUTES.SUBADMIN} element={<SubAdminList />} />
        <Route path={ROUTES.ADDSUBADMIN} element={<AddSubAdmin />} />
        <Route path={ROUTES.CAROUSEL} element={<CarouselList />} />
      </Route>
      <Route path={ROUTES.LOGIN} element={<Login />} />
    </Routes>
  );
}

export default App;
