import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import styles from './Login.module.css';
import { jwtDecode } from "jwt-decode";


const Login = () => {
    const navigate = useNavigate();

    // form verilerini merkezi state üzerinden yönetimi
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // asenkron istek sırasındaki yükleme durumu
    const [isLoading, setIsLoading] = useState(false);

    // inputlardaki verileri state'e ekleme
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // sayfanın yenilenmesini engeller

        if (!formData.email || !formData.password) {
            toast.warn("Lütfen tüm eksik alanları doldurunuz.")
            return;
        }
        setIsLoading(true);

        try {
            const response = await api.post('/Auth/Login', formData);
            //customResponseData yapısına uygun olarak destruct edilme
            const { data, isSuccessfull, message } = response.data;

            if (isSuccessfull && data) {
                const { accessToken, refreshToken } = data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                try {
                    const token = localStorage.getItem('accessToken');

                    let userRoles = [];

                    const decodedToken = jwtDecode(token);
                    const roleClaim = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decodedToken.role;

                    if (Array.isArray(roleClaim)) {
                        userRoles = roleClaim;
                    } else if (roleClaim) {
                        userRoles = [roleClaim];
                    }
                    if(userRoles.includes('Admin') || userRoles.includes('Manager')){
                        navigate('/management/dashboard');
                    } else {
                        navigate('/');
                    }

                } catch (error) {
                    console.error('Token çözümleme hatası: ', error);
                }

                toast.success(message || 'Giriş işlemi başarılı');
            } else {
                toast.error(message || 'Giriş işlemi başarısız oldu');
            }
        } catch (error) {
            if(error.response && error.response.data){
                toast.error(error.response.data.detail || 'Giriş işlemi başarısız oldu.');
                console.warn("Giriş engellendi: ",error.response.data.detail);
            } else {
                console.error("Sunucuya ulaşılamadı: ", error);
                toast.warn('Sunucu ile iletişim kurulamadı. Lütfen daha sonra tekrar deneyiniz.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h2>Sisteme Giriş</h2>
                <form onSubmit={handleSubmit} className={styles.authForm}>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">E-Posta Adresi</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ornek@gmail.com"
                            autoComplete="email"
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Şifre</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="********"
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? 'Giriş Yapılıyor' : 'Giriş Yap'}
                    </button>
                    <div className={styles.authLinks}>
                        <p>Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link></p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Login;