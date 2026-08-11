import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Checkout.module.css'
import api from '../../services/api'
import { toast } from 'react-toastify'

const Checkout = () => {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSummary, setIsSummary] = useState([]);

    // Form state'leri
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        city: '',
        district: '',
        fullAddress: '',
        invoiceType: 'Bireysel',
        companyName: '',
        taxNumber: '',
        taxOffice: ''
    });

    useEffect(() => {
        const fetchCartForCheckout = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/ShoppingCarts/GetCartSummary');
                if (response.data && response.data.isSuccessfull) {
                    const summary = response.data.data;

                    if (summary.cartItems.length === 0) {
                        toast.warn('Sepetiniz boş, ödeme adımına geçilemez');
                        navigate('/');
                        return;
                    }
                    setIsSummary(summary);

                    setCartItems(summary.cartItems);
                    setCartTotal(summary.totalPrice)
                } else {
                    toast.error('Sepet bilgileri alınamadı');
                }
            } catch (error) {
                console.error("Ödeme sayfası sepet yükleme hatası:", error);
                toast.error("Sepet bilgileri alınamadı.");
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCartForCheckout();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckOutSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const addressDto = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            city: formData.city,
            district: formData.district,
            fullAddress: formData.fullAddress,
            invoiceType: formData.invoiceType,
            companyName: formData.invoiceType === 'Bireysel' ? formData.companyName : null,
            taxNumber: formData.invoiceType === 'Bireysel' ? formData.taxNumber : null,
            taxOffice: formData.invoiceType === 'Bireysel' ? formData.taxOffice : null,
        }


        const payload = {
            shippingAddress: addressDto,
            billingAddress: addressDto
        };

        try {
            const response = await api.post('/Orders/CreateOrder', payload);

            if (response.data && response.data.isSuccessfull) {
                toast.success('Siparişiniz başarıyla oluşturuldu.');
                // şimdilik anasayfaya atıyoruz sonra orderNumber ekleriz.
                navigate('/');
            } else {
                toast.error('Sipariş oluşturulamadı. Lütfen bilgilerinizi kontrol edin.');
            }

        } catch (error) {
            console.error("Sipariş hatası:", error);
            const errorMessage = error.response?.data?.message || 'Siparişiniz işlenirken bir hata oluştu.';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Ödeme Sayfası Hazırlanıyor...</div>;

    return (
        <div className={styles.checkoutContainer}>
            <h1 className={styles.pageTitle}>Ödeme ve Teslimat</h1>

            <form onSubmit={handleCheckOutSubmit} className={styles.checkoutGrid}>

                {/* SOL: FORM ALANI */}
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>Teslimat & Fatura Bilgileri</h2>
                    
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Adınız</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={styles.input} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Soyadınız</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={styles.input} required />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Telefon Numarası</label>
                            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className={styles.input} placeholder="05xxxxxxxxx" required />
                        </div>
                        <div className={styles.formGroup}></div> {/* Boşluk tutucu */}
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Şehir (İl)</label>
                            <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={styles.input} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>İlçe</label>
                            <input type="text" name="district" value={formData.district} onChange={handleInputChange} className={styles.input} required />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Açık Adres</label>
                        <textarea name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} className={styles.textarea} placeholder="Mahalle, sokak, bina ve daire no..." required />
                    </div>

                    {/* FATURA TİPİ SEÇİMİ */}
                    <div className={styles.formGroup} style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                        <label className={styles.label}>Fatura Tipi</label>
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="radio" name="invoiceType" value="Bireysel" checked={formData.invoiceType === 'Bireysel'} onChange={handleInputChange} />
                                Bireysel
                            </label>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="radio" name="invoiceType" value="Kurumsal" checked={formData.invoiceType === 'Kurumsal'} onChange={handleInputChange} />
                                Kurumsal
                            </label>
                        </div>
                    </div>

                    {/* KURUMSAL SEÇİLDİYSE AÇILAN ALANLAR */}
                    {formData.invoiceType === 'Kurumsal' && (
                        <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px', marginTop: '1rem' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Firma Adı</label>
                                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className={styles.input} required={formData.invoiceType === 'Kurumsal'} />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Vergi Dairesi</label>
                                    <input type="text" name="taxOffice" value={formData.taxOffice} onChange={handleInputChange} className={styles.input} required={formData.invoiceType === 'Kurumsal'} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Vergi No</label>
                                    <input type="text" name="taxNumber" value={formData.taxNumber} onChange={handleInputChange} className={styles.input} required={formData.invoiceType === 'Kurumsal'} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* SAĞ: SİPARİŞ ÖZETİ */}
                <div className={styles.summarySection}>
                    <h2 className={styles.sectionTitle}>Sipariş Özeti</h2>
                    
                    {cartItems.map((item) => (
                        <div key={item.cartItemId} className={styles.summaryItem}>
                            <span>{item.quantity}x {item.name}</span>
                            <span>{(item.price * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
                        </div>
                    ))}

                    <div className={styles.summaryItem} style={{ marginTop: '2rem' }}>
                        <span>Ara Toplam</span>
                        <span>{isSummary.subTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <span>KDV</span>
                        <span>{isSummary.taxAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <span>Kargo Ücreti</span>
                        <span>{isSummary.shippingCost === 0 ? 'ücretsiz' : isSummary.shippingCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
                    </div>

                    <div className={`${styles.summaryItem} ${styles.total}`}>
                        <span>Genel Toplam</span>
                        <span>{cartTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? 'İŞLENİYOR...' : 'SİPARİŞİ ONAYLA'}
                    </button>
                </div>

            </form>

        </div>
    )
}

export default Checkout