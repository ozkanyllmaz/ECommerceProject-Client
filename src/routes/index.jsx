import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/Layout/Layout";
import Register from "../pages/Register/Register";
import UnAuthorized from "../pages/UnAuthorized/UnAuthorized";
import Profile from "../pages/Profile/Profile";
import Product from "../pages/Product/Product";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import Checkout from "../pages/Checkout/Checkout";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import MyOrders from "../pages/MyOrders/MyOrders";
import OrderDetail from "../pages/OrderDetail/OrderDetail";
import AdminDashboard from "../pages/Manager/Dashboard/AdminDashboard";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import CategoryManagement from "../pages/Manager/CategoryManagement/CategoryManagement";
import ProductManagement from "../pages/Manager/ProductManagement/ProductManagement";
import OrderManagement from "../pages/Manager/OrderManagement/OrderManagement";
import UserManagement from "../pages/Manager/UserManagement/UserManagement";
import LogManagement from "../pages/Manager/LogManagement/LogManagement";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />, // navbar ve footer barındıran ana sarmalayıcı
        children: [
            {
                index: true, // varsayılan rota Anasayfa
                element: <Home />,
            },
            {
                path: 'register',
                element: <Register />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'products',
                element: <Product />,
            },
            {
                path: 'products/detail/:id',
                element: <ProductDetail />
            },
            {
                path: 'unauthorized',
                element: <UnAuthorized />
            },

            // Tüm rollerin erişebileceği sayfalar
            {
                element: <ProtectedRoute allowedRoles={['Admin', 'Manager', 'Customer']} />,
                children: [
                    {
                        path: 'profile',
                        element: <Profile />,
                    },
                    {
                        path: '/checkout',
                        element: <Checkout />
                    },
                    {
                        path: '/order-success/:ordernumber',
                        element: <OrderSuccess />
                    },
                    {
                        path: '/my-orders',
                        element: <MyOrders />
                    },
                    {
                        path: '/my-orders/:id',
                        element: <OrderDetail />
                    },
                ]
            },
        ],
    },
    {

        // yalnızca giriş yapmış yöneticilerin erişebileceği rotalar
        element: <ProtectedRoute allowedRoles={['Manager', 'Admin']} />,
        children: [
            {
                path: 'management',
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="dashboard" replace />
                    },
                    {
                        path: 'dashboard', // Kullanıcı sadece "/management" yazarsa varsayılan olarak bu sayfa açılır
                        element: <AdminDashboard />
                    },
                    {
                        path: 'orders',
                        element: <OrderManagement />
                    },
                    {
                        element: <ProtectedRoute allowedRoles={['Manager']} />,
                        children: [
                            {
                                path: 'categories',
                                element: <CategoryManagement />
                            },
                            {
                                path: 'products',
                                element: <ProductManagement />
                            },
                        ]
                    },
                    {
                        element: <ProtectedRoute allowedRoles={['Admin']} />,
                        children: [
                            {
                                path: 'users',
                                element: <UserManagement />
                            },
                            {
                                path: 'logs',
                                element: <LogManagement />
                            }
                        ]
                    },
                ]
            },
        ]
    },
    {
        path: '*',
        element: <NotFound />
    },
]);