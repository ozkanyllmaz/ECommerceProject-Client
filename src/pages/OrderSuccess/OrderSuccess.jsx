import styles from './OrderSuccess.module.css'
import { Link, useParams } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi';

const OrderSuccess = () => {
    const { ordernumber } = useParams();

    return (
        <div className={styles.successContainer}>
            <div className={styles.iconWrapper}>
                <FiCheckCircle size={40} />
            </div>
            
            <h1 className={styles.title}>Siparişiniz Başarıyla Alındı!</h1>
            <p className={styles.message}>
                Bizi tercih ettiğiniz için teşekkür ederiz. Siparişiniz hazırlanmak üzere işleme alınmıştır. 
                Siparişinizin durumunu 'Siparişlerim' sayfasından takip edebilirsiniz.
            </p>

            <div className={styles.orderNumberBox}>
                <span className={styles.orderNumberLabel}>Sipariş Numaranız</span>
                {/* Eğer URL'den numara geldiyse göster, gelmediyse varsayılan bir metin yaz */}
                <span className={styles.orderNumber}>{ordernumber || "Sipariş numaranız e-posta adresinize gönderildi"}</span>
            </div>

            <div className={styles.buttonGroup}>
                <Link to="/my-orders" className={styles.primaryBtn}>
                    Siparişlerimi Görüntüle
                </Link>
                <Link to="/products" className={styles.secondaryBtn}>
                    Alışverişe Devam Et
                </Link>
            </div>
        </div>
    )
}

export default OrderSuccess