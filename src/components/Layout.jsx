import { Link, Outlet, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';

const Layout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
    const isAuthenticated = Boolean(localStorage.getItem('accessToken'));

    let userRoles = [];

    if (isAuthenticated) {
        try {
            const decodedToken = jwtDecode(token);

            // ASP.NET Core varsayılan claim yapısı veya özel 'role' anahtarı kontrolü
            const roleClaim = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decodedToken.role;

            if (Array.isArray(roleClaim)) {
                userRoles = roleClaim;
            } else if (roleClaim) {
                userRoles = [roleClaim];
            }
        } catch (error) {
            console.error('Token çözümleme hatası: ', error);
            localStorage.removeItem('accessToken');
        }
    }
    // rol kullanıcıda var mı
    const hasRole = (role) => userRoles.includes(role);

    const handleLogout = () => {
        //oturum sonlandırma
        localStorage.removeItem('accessToken');
        toast.info('Oturum başarıyla sonlandı');
        navigate('/login');
    };

    return (
        <div className='layout-container'>
            <header className='navbar'>
                <div className='logo'>
                    <Link to="/">E-Commerce</Link>
                </div>
                <nav className='nav-links'>
                    <>
                        <Link to="/">Ana Sayfa</Link>
                        <Link to="/products">Ürünler</Link>
                    </>

                    {/* yetki durumuna göre dinamik menü gösterimi */}
                    {isAuthenticated ? (
                        <>
                            {(hasRole('Admin')) && (
                                <>
                                    <Link to="/reports">Raporlar</Link>
                                    <Link to="/logs">Loglar</Link>
                                </>
                            )}

                            {/* Sadece Yönetici veya Yönetici Yardımcısı rolüne sahip olanlar görebilir */}
                            {(hasRole('Admin') || hasRole('Manager')) && (
                                <Link to="/dashboard">Yönetim Paneli</Link>
                            )}

                            {/* Sadece Müşteri rolüne sahip olanlar görebilir */}
                            {hasRole('Customer') && (
                                <>
                                    <Link to="/cart">Sepetim</Link>
                                    <Link to="/my-orders">Siparişlerim</Link>
                                </>
                            )}

                            {/* Tüm roller erişebilir */}
                            {
                                (hasRole('Admin') || hasRole('Manager') || hasRole('Customer')) && (
                                    <Link to="/profile">Profil</Link>
                                )
                            }

                            <button onClick={handleLogout} className='logout-btn'>Çıkış Yap</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className='login-btn'>Giriş Yap</Link>
                        </>
                    )}
                </nav>
            </header>
            {/* Sayfa içeriklerinin dinamik yükleneceği alan*/}
            <main className='main-content'>
                <Outlet />
            </main>
            {/* Global bildirim yönetimi */}
            <ToastContainer position='bottom-right' autoClose={3000} hideProgressBar={false} />
        </div>
    )
}

export default Layout