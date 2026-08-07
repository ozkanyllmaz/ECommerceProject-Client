import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import styles from './Login.module.css';


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

                toast.success(message || 'Giriş işlemi başarılı');

                navigate('/');
            } else {
                toast.error(message || 'Giriş işlemi başarısız oldu');
            }
        } catch (error) {
            console.error("Giriş işlemi sırasında sunucu veya ağ hatası: ", error)
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

                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        { isLoading ? 'Giriş Yapılıyor' : 'Giriş Yap'}
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