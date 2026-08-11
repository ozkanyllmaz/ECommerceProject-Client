import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import NotFound from "../pages/NotFound/NotFound";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/Layout/Layout";
import Register from "../pages/Register/Register";
import UnAuthorized from "../pages/UnAuthorized/UnAuthorized";
import Profile from "../pages/Profile/Profile";
import Product from "../pages/Product/Product";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import Checkout from "../pages/Checkout/Checkout";

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
            // Admin in erişebileceği sayfalar
            {
                // yalnızca giriş yapmış kullanıcıların erişebileceği rotalar
                element: <ProtectedRoute allowedRoles={['Admin']} />,
                children: [
                    {
                        path: 'dashboard',
                        element: <Dashboard />,
                    },
                    // sepet onaylama, sipariş geçmişi vs..
                ]
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
                ]
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />
    },
]);