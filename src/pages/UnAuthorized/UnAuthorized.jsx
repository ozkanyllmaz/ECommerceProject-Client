import { useNavigate } from "react-router-dom"
import styles from './UnAuthorized.module.css'

const UnAuthorized = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.unauthorizedContainer}>
            <div className={styles.unauthorizedContent}>
                <h1 className={styles.errorCode}>403</h1>
                <h2 className={styles.errorTitle}>Yetkisiz Erişim</h2>
                <p className={styles.errorMessage}>Bu sayfayı görüntülemek veya ilgili işlemi gerçekleştirmek için gerekli sistem izinlerine sahip değilsiniz.
                    Erişim yetkiniz ile ilgili bir hata olduğunu düşünüyorsanız, lütfen sistem yöneticiniz ile iletişime geçiniz.</p>
                
                <div className={styles.actionButtons}>
                    <button onClick={() => navigate(-1)} className={styles.btnOutline}>Önceki Sayfaya Dön</button>
                    <button onClick={() => navigate('/')} className={styles.btnPrimary}>Ana Sayfaya Dön</button>
                </div>
            </div> 
        </div>
    )
}

export default UnAuthorized