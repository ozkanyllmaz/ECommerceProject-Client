import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import styles from './Layout.module.css';
import { FiSearch, FiChevronDown, FiTruck, FiStar } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import api from '../../services/api'
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import Footer from '../Footer/Footer';


const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation(); // mevcut url yolunu almak için
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);

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

    // Duyuru çubuğu görünürlük kontrolü
    const hiddenPaths = ['/login', '/register'];
    const isHiddenPath = hiddenPaths.includes(location.pathname);
    const isStaff = hasRole('Admin') || hasRole('Manager');

    const showAnnouncment = !isStaff && !isHiddenPath;

    const hiddenFooterPaths = ['/login', '/register', '/reports', '/logs', '/dashboard'];
    const isFooterHidden = hiddenFooterPaths.some(path => location.pathname.startsWith(path));

    const handleLogout = () => {
        //oturum sonlandırma
        localStorage.removeItem('accessToken');
        toast.info('Oturum başarıyla sonlandı');
        navigate('/login');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/Categories/ListCategory?paginationParameter.PageNumber=1&paginationParameter.PageSize=10');
                console.log("Kategori yaniti: ", response.data.data.data);
                const data = response.data.data.data;

                if (data) {
                    setCategories(Array.isArray ? data : data.data || []);
                }
            } catch (error) {
                console.error("Kategoriler yüklenirken bir sorun oldu: ", error);
            }
        };

        fetchCategories();
    }, []);

    const marqueeContent = (
        <>
            <span className={styles.marqueeItem}>
                <FiTruck size={16} /> 1500 TL Üstü Siparişlerde Kargo Ücretsiz!
            </span>
            <span className={styles.marqueeItem}>
                <FiStar size={16} /> Özel İndirimler Ve Kampanyaları Kaçırmayın!
            </span>
            <span className={styles.marqueeItem}>
                <FiTruck size={16} /> 1500 TL Üstü Siparişlerde Kargo Ücretsiz!
            </span>
            <span className={styles.marqueeItem}>
                <FiStar size={16} /> Özel İndirimler Ve Kampanyaları Kaçırmayın!
            </span>
        </>
    )

    return (
        <div className={styles.layoutContainer}>

            {/* Duyuru çubuğu */}
            {showAnnouncment && (
                <div className={styles.announcementBar}>
                    <div className={styles.marqueeContainer}>
                        {/* kesintisiz döngü için içeririk iki kez render edilir */}
                        {marqueeContent}
                        {marqueeContent}
                    </div>
                </div>

            )}

            <header className={styles.globalHeader}>
                <div className={styles.headerContainer}>

                    {/* Sol bölüm: logo*/}
                    <div className={styles.logo}>
                        <Link to="/">E-Commerce</Link>
                    </div>

                    {/* Orta bölüm : arama*/}
                    <div className={styles.searchContainer}>
                        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                            <input
                                type='text'
                                placeholder='Ürün arayın..'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput} />

                            <button type='submit' className={styles.searchButton}>
                                <FiSearch size={20} />
                            </button>
                        </form>


                    </div>

                    {/* Sağ bölüm: menüler */}
                    <nav className={styles.rightNav}>
                        <Link to="/" className={styles.navLink}>Ana Sayfa</Link>

                        {/* kategori dropdown menu */}
                        <div className={styles.dropdown}>
                            <span className={styles.dropdownToggle}>
                                Kategoriler <FiChevronDown size={16} />
                            </span>
                            <div className={styles.dropdownMenu}>
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        to={`/categories=${category.id}`}
                                        className={styles.dropdownItem}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* yetki durumuna göre dinamik menü gösterimi */}
                        {isAuthenticated ? (
                            <>
                                {(hasRole('Admin')) && (
                                    <>
                                        <Link to="/reports" className={styles.navLink}>Raporlar</Link>
                                        <Link to="/logs" className={styles.navLink}>Loglar</Link>
                                    </>
                                )}

                                {/* Sadece Yönetici veya Yönetici Yardımcısı rolüne sahip olanlar görebilir */}
                                {(hasRole('Admin') || hasRole('Manager')) && (
                                    <Link to="/dashboard" className={styles.navLink}>Yönetim Paneli</Link>
                                )}

                                {/* Sadece Müşteri rolüne sahip olanlar görebilir */}
                                {hasRole('Customer') && (
                                    <>
                                    <Link to="/my-orders" className={styles.navLink}>Siparişlerim</Link>
                                        <Link to="/cart" className={styles.navLink}>
                                            <FaShoppingCart size={22}/>
                                        </Link>
                                    </>
                                )}

                                {/* Tüm roller erişebilir */}
                                {
                                    (hasRole('Admin') || hasRole('Manager') || hasRole('Customer')) && (
                                        <Link to="/profile" className={styles.navLink}>
                                            <FaUserCircle size={22} />
                                        </Link>
                                    )
                                }

                                <button onClick={handleLogout} className={styles.logoutBtn}>Çıkış Yap</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className={styles.loginBtn}>Giriş Yap</Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
            {/* Sayfa içeriklerinin dinamik yükleneceği alan*/}
            <main className={styles.mainContent}>
                <Outlet />
            </main>

            {!isFooterHidden && <Footer />}

            {/* Global bildirim yönetimi */}
            <ToastContainer position='bottom-right' autoClose={3000} hideProgressBar={false} />
        </div>
    )
}

export default Layout