import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import styles from './Register.module.css';


const Register = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.warn('Lütfen tüm alanları doldurunuz');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.warn('Şifreler uyuşmamaktadır.');
            return;
        }

        setIsLoading(true);

        try {
            // backend tarafında istek atılması 
            const formDto = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            };

            const response = await api.post('/Auth/Register', formDto);

            //customResponseDto yapısına uygun ayrıştırma
            const { isSuccessfull, message } = response.data;

            if (isSuccessfull) {
                toast.success(message || 'Kayıt işlemi başarıyla oluşturuldu. Giriş yapabilirsiniz.');
                navigate('/login');
            } else {
                toast.error(message || 'Kayıt işlemi sırasında bir hata oluştu.');
            }
        } catch (error) {
            console.error("Kayıt işlemi hatası: ", error)
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h2>Yeni Kullanıcı Kaydı</h2>
                <form onSubmit={handleSubmit} className={styles.authForm}>
                    <div className={styles.formGroup}>
                        <div className={styles.labelRow}>
                            <div className={styles.inputColumn}>
                                <label htmlFor="firstName">Ad</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className={styles.inputColumn}>
                                <label htmlFor="lastName">Soyad</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                        </div>

                        <label htmlFor="email">E-Posta</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                            autoComplete="off"
                        />

                        <label htmlFor="password">Şifre</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            autoComplete="new-password"
                        />

                        <label htmlFor="confirmPassword">Şifre Tekrar</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                    </div>
                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? 'İşleminiz Gerçekleştiriliyor' : 'Kayıt Ol'}
                    </button>
                </form>
                <div className={styles.authLinks}>
                    <p>Zaten bir hesabınız var mı? <Link to="/login">Giriş Yapın</Link></p>
                </div>

            </div >

        </div >
    )
}

export default Register