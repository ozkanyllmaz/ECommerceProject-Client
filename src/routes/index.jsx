import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/Layout";
import Register from "../pages/Register";
import UnAuthorized from "../pages/UnAuthorized";
import Profile from "../pages/Profile";

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
                path: 'unauthorized',
                element: <UnAuthorized />
            },
            // Admin in erişebileceği sayfalar
            {
                // yalnızca giriş yapmış kullanıcıların erişebileceği rotalar
                element: <ProtectedRoute allowedRoles={['Admin']}/>,
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
                ]
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />
    },
]);