import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";



const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('accessToken');

    // Kimlik doğrulama kontrolü
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    let isAuthorized = true;
    let isTokenValid = true;

    // Yetkilendirme kontrolü
    if (allowedRoles && allowedRoles.length > 0) {

        try {
            const decodedToken = jwtDecode(token);
            const roleClaim = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decodedToken.role;

            let userRoles = [];
            if (Array.isArray(roleClaim)) {
                userRoles = roleClaim;
            } else if (roleClaim) {
                userRoles = [roleClaim];
            }

            // sayfanın gerektirdiği roller mevcut mu, onun kontrolü
            isAuthorized = userRoles.some(role => allowedRoles.includes(role));

        } catch (error){
            console.error("Token çözümleme hatası: ", error);
            isTokenValid = false;
        }
    }

    // token bozuk çözülemiyorsa
    if(!isTokenValid){
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return <Navigate to="/login" replace />;
    }

    // token sağlam fakat yetki yoksa
    if(allowedRoles && allowedRoles.length > 0 && !isAuthorized){
        return <Navigate to="/unauthorized" replace/>
    }

    // token varsa ve yetki okayse devam et 
    return <Outlet />;
}

export default ProtectedRoute;