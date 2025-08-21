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
import AddProduct from "./features/Product/Pages/AddProduct";
import OrderList from "./features/Orders/pages/OrderList";
import Customers from "./features/Customers/pages/Customers";
import ProductSingleView from "./features/Product/Pages/ProductSingleView";
import CouponList from "./features/Coupons/Pages/CouponList";
import SubAdminList from "./features/SubAdmin/Pages/SubAdminList";
import AddSubAdmin from "./features/SubAdmin/Pages/AddSubAdmin";
import CarouselList from "./features/Carousel/Pages/CarouselList";
import AddCoupon from "./features/Coupons/Pages/AddCoupon";
import DealPage from "./features/Dealoffer/Pages/DealPage";
import AddDealofTheDay from "./features/Dealoffer/Pages/AddDealofTheDay";
import HomeOffer from "./features/HomeOffer/Pages/HomeOffer";
import AddHome from "./features/HomeOffer/Pages/AddHome";
import ReferralPointsManager from "./features/Customers/pages/Referals";
import EditDeal from "./features/Dealoffer/Components/AddDeal/EditDeal";
import Editproduct from "./features/Product/Pages/Editproduct";
import CustomerDetailPage from "./features/Customers/pages/CustomerDetailPage";
import OrderView from "./features/Orders/pages/OrderView";
import EditSubadmin from "./features/SubAdmin/Pages/EditSubadmin";
import CouponEdit from "./features/Coupons/Pages/CouponEdit";
import ViewNotification from "./features/Notification/Pages/ViewNotification";

function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.MAINCATEGORY} element={<MainCategory />} />
        <Route path={ROUTES.CATEGORY} element={<Category />} />
        <Route path={ROUTES.SUBCATEGORY} element={<Subcategory />} />
        <Route path={ROUTES.PRODUCT_LIST} element={<ProductList />} />
        <Route path={ROUTES.ADD_PRODUCT} element={<AddProduct />} />
        <Route path={ROUTES.EDIT_PRODUCT} element={<Editproduct />} />
        <Route path={ROUTES.ORDERS_LIST} element={<OrderList />} />
        <Route path={ROUTES.ORDERVIEW} element={<OrderView />} />
        <Route path={ROUTES.CUSTOMERS} element={<Customers />} />
        <Route path={ROUTES.CUSTOMER_VIEW} element={<CustomerDetailPage />} />
        <Route path={ROUTES.PRODUCT_SINGLE} element={<ProductSingleView />} />
        <Route path={ROUTES.COUPONS} element={<CouponList />} />
        <Route path={ROUTES.SUBADMIN} element={<SubAdminList />} />
        <Route path={ROUTES.EDIT_SUBADMIN} element={<EditSubadmin />} />
        <Route path={ROUTES.ADDSUBADMIN} element={<AddSubAdmin />} />
        <Route path={ROUTES.CAROUSEL} element={<CarouselList />} />
        <Route path={ROUTES.ADDCOUPON} element={<AddCoupon />} />
        <Route path={ROUTES.EDIT_COUPON} element={< CouponEdit/>} />
        <Route path={ROUTES.DEALPAGE} element={<DealPage />} />
        <Route path={ROUTES.ADDDEAL} element={<AddDealofTheDay />} />
        <Route path={ROUTES.EDITDEAL} element={<EditDeal />} />
        <Route path={ROUTES.HOMEOFFER} element={<HomeOffer />} />
        <Route path={ROUTES.HOMEOFFERADD} element={<AddHome />} />
        <Route path={ROUTES.REFERAL} element={<ReferralPointsManager />} />
        <Route path={ROUTES.NOTIFICATION} element={<ViewNotification />} />
      </Route>
      <Route path={ROUTES.LOGIN} element={<Login />} />
    </Routes>
  );
}

export default App;
