import { Link } from 'react-router-dom'
import styles from './Footer.module.css'
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
        <div className={styles.footerGrid}>

            {/* 1.Kolon: kurumsal bilgi */}
            <div className={styles.footerColumn}>
                <h3 className={styles.footerTitle}>E-Commerce</h3>
                <p className={styles.footerText}>
                    En kaliteli ürünleri, en uygun fiyatlar ve güvenilir alışveriş deneyimi ile sizlere sunmak için buradayız. 
                    Bizi tercih ettiğiniz için teşekkür ederiz.
                </p>
            </div>

            {/* 2.Kolon: Hızlı bağlantılar */}
            <div className={styles.footerColumn}>
                <h3 className={styles.footerTitle}>Hızlı Bağlantılar</h3>
                <ul className={styles.footerLinks}>
                    <li><Link to="/about" className={styles.footerLink}>Hakkımızda</Link></li>
                    <li><Link to="/campaigns" className={styles.footerLink}>Kampanyalar</Link></li>
                    <li><Link to="/stores" className={styles.footerLink}>Mağazalarımız</Link></li>
                    <li><Link to="/contact" className={styles.footerLink}>İletişim</Link></li>
                </ul>
            </div>

            {/* 3. Kolon: Müşteri Hizmetleri */}
            <div className={styles.footerColumn}>
                <h3 className={styles.footerTitle}>Müşteri Hizmetleri</h3>
                <ul className={styles.footerLinks}>
                    <li><Link to="/faq" className={styles.footerLink}>Sıkça Sorulan Sorular</Link></li>
                    <li><Link to="/shipping" className={styles.footerLink}>Teslimat ve Kargo</Link></li>
                    <li><Link to="/returns" className={styles.footerLink}>İade ve Değişim</Link></li>
                    <li><Link to="/privacy" className={styles.footerLink}>Gizlilik Politikası</Link></li>
                </ul>
            </div>

            {/* 4. Kolon: İletişim Bilgileri */}
            <div className={styles.footerColumn}>
                <h3 className={styles.footerTitle}>Bize Ulaşın</h3>
                <p className={styles.footerText}>
                    <strong>Email: </strong> destek@ecommerce.com <br/>
                    <strong>Telefon:</strong> 0850 123 45 67 <br/>
                    <strong>Çalışma Saatleri: </strong> Pzt-Cuma: 09:00 - 18:00
                </p>
            </div>

            {/* Alt Bilgi Telif Hakkı ve Bildirimler */}
            <div className={styles.footerBottom}>
                <p>&copy; {new Date().getFullYear()} E-Commerce Tüm Hakları Saklıdır.</p>
            </div>

            <div className={styles.socialIcons}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                        <FiInstagram size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
                        <FiTwitter size={20} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                    <FiFacebook size={20} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="YouTube">
                    <FiYoutube size={20} />
                </a>

            </div>

        </div>

    </footer>
  )
}

export default Footer