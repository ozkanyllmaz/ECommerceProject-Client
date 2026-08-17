import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './AdminLayout.module.css';
import { jwtDecode } from 'jwt-decode';


const AdminLayout = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem('accessToken');

    let userRoles = [];

    const decodedToken = jwtDecode(token);

    const roleClaim = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decodedToken.role;

    if (Array.isArray(roleClaim)) {
        userRoles = roleClaim;
    } else {
        userRoles = [roleClaim];
    }

    const hasRole = (role) => userRoles.includes(role);
    const isAdmin = hasRole('Admin');
    const isManager = hasRole('Manager');

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    return (
        <div className={styles.adminContainer}>

            {/* SOL MENÜ */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <>
                        {isAdmin ? (
                            <h2>Admin Panel</h2>
                        ) : (
                            <h2>Manager Panel</h2>
                        )}
                    </>
                </div>
                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <NavLink to="/management/dashboard" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}>
                            Dashboard
                        </NavLink>
                    </li>

                    <li className={styles.navItem}>
                        <NavLink to="/management/orders" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}>
                            Sipariş Yönetimi
                        </NavLink>
                    </li>
                    
                    {/* Manager */}
                    {isManager && (
                        <>
                            <li className={styles.navItem}>
                                <NavLink to="/management/products" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}>
                                    Ürün Yönetimi
                                </NavLink>
                            </li>
                            <li className={styles.navItem}>
                                <NavLink to="/management/categories" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}>
                                    Kategori Yönetimi
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* Admin */}
                    {isAdmin && (
                        <>
                            <li className={styles.navItem}>
                                <NavLink to="/management/users" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}>
                                    Kullanıcı Yönetimi
                                </NavLink>
                            </li>
                            <li className={styles.navItem}>
                                <NavLink to="/management/logs" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}>
                                    Log Kayıtları
                                </NavLink>
                            </li>
                            <li className={styles.navItem}>
                                <NavLink to="/management/reports" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink}>
                                    Raporlar
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </aside>

            {/* SAĞ İÇERİK */}
            <main className={styles.mainContent}>
                {/* Üst Bar */}
                <header className={styles.topbar}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>Çıkış Yap</button>
                </header>

                {/* Değişen İçerik Alanı (Ürünler, Siparişler buraya yüklenecek) */}
                <div className={styles.contentWrapper}>
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default AdminLayout;