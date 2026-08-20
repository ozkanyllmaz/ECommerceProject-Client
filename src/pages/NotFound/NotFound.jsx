import { useNavigate, Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import styles from './NotFound.module.css';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.errorCode}>404</h1>
                <h2 className={styles.title}>Eyvah! Sayfa Bulunamadı</h2>
                <p className={styles.description}>
                    Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak ulaşılamıyor olabilir. 
                    Endişelenmeyin, güvenli bölgeye dönmek için aşağıdaki butonları kullanabilirsiniz.
                </p>
                
                <div className={styles.actionButtons}>
                    {/* Tarayıcı geçmişinde bir adım geriye gider */}
                    <button onClick={() => navigate(-1)} className={styles.backButton}>
                        <FiArrowLeft size={18} /> Geri Dön
                    </button>
                    
                    {/* Doğrudan anasayfaya yönlendirir */}
                    <Link to="/" className={styles.homeButton}>
                        <FiHome size={18} /> Anasayfaya Git
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;