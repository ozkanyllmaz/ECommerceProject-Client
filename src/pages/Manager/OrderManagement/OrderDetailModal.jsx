import { useState, useEffect } from 'react';
import styles from './OrderDetailModal.module.css';
import api from '../../../services/api';
import { toast } from 'react-toastify';

const OrderDetailModal = ({ isOpen, onClose, orderId }) => {
    const [orderDetail, setOrderDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen && orderId) {
            const fetchOrderDetail = async () => {
                setIsLoading(true);
                try {
                    const response = await api.get(`/Orders/ListOrderDetail?OrderId=${orderId}`);
                    
                    if (response.data && response.data.isSuccessfull) {
                        // Backend veriyi array içinde data[0] olarak dönüyor
                        setOrderDetail(response.data.data[0]);
                    }
                } catch (error) {
                    console.error("Sipariş detayı çekilirken hata:", error);
                    toast.error("Sipariş detayı yüklenemedi.");
                    onClose(); // Hata varsa modalı kapat
                } finally {
                    setIsLoading(false);
                }
            };
            fetchOrderDetail();
        }
    }, [isOpen, orderId, onClose]);

    if (!isOpen) return null;

    // Yardımcı Formatlayıcılar
    const formatMoney = (amount) => amount ? amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' TL' : '0,00 TL';
    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleString('tr-TR') : '';

    const getStatusText = (statusNum) => {
        switch (statusNum) {
            case 1:
                return 'Sipariş Alındı';
            case 2:
                return 'Onaylandı';
            case 3:
                return 'Tamamlandı';
            case 4:
                return 'İptal Edildi';
            case 5:
                return 'İade Edildi';
            case 6:
                return 'Reddedildi';
            default:
                return 'Bilinmiyor';
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>Sipariş Detayı {orderDetail && `- #${orderDetail.orderNumber}`}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>
                
                <div className={styles.modalBody}>
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>Yükleniyor...</div>
                    ) : orderDetail ? (
                        <>
                            {/* 1. Sipariş Özeti */}
                            <div>
                                <h3 className={styles.sectionTitle}>Sipariş Bilgileri</h3>
                                <p><strong>Tarih:</strong> {formatDate(orderDetail.orderDate)}</p>
                                <p><strong>Durum:</strong> {getStatusText(orderDetail.status)}</p>
                                <p><strong>Müşteri ID:</strong> {orderDetail.userId}</p>
                            </div>

                            {/* 2. Adres Bilgileri */}
                            <div>
                                <h3 className={styles.sectionTitle}>Adres Bilgileri</h3>
                                <div className={styles.addressGrid}>
                                    <div className={styles.addressCard}>
                                        <h4>Teslimat Adresi (Shipping)</h4>
                                        <p><strong>İsim:</strong> {orderDetail.shippingAddress.firstName} {orderDetail.shippingAddress.lastName}</p>
                                        <p><strong>Tel:</strong> {orderDetail.shippingAddress.phoneNumber}</p>
                                        <p><strong>İl/İlçe:</strong> {orderDetail.shippingAddress.city} / {orderDetail.shippingAddress.district}</p>
                                        <p><strong>Adres:</strong> {orderDetail.shippingAddress.fullAddress}</p>
                                    </div>
                                    <div className={styles.addressCard}>
                                        <h4>Fatura Adresi (Billing)</h4>
                                        <p><strong>İsim/Firma:</strong> {orderDetail.billingAddress.companyName || `${orderDetail.billingAddress.firstName} ${orderDetail.billingAddress.lastName}`}</p>
                                        <p><strong>Fatura Tipi:</strong> {orderDetail.billingAddress.invoiceType}</p>
                                        {orderDetail.billingAddress.taxNumber && (
                                            <p><strong>Vergi Dairesi/No:</strong> {orderDetail.billingAddress.taxOffice} - {orderDetail.billingAddress.taxNumber}</p>
                                        )}
                                        <p><strong>İl/İlçe:</strong> {orderDetail.billingAddress.city} / {orderDetail.billingAddress.district}</p>
                                        <p><strong>Adres:</strong> {orderDetail.billingAddress.fullAddress}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Sipariş Kalemleri (Ürünler) */}
                            <div>
                                <h3 className={styles.sectionTitle}>Sipariş Edilen Ürünler</h3>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Ürün Adı</th>
                                            <th>Birim Fiyat</th>
                                            <th>Adet</th>
                                            <th>Toplam</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderDetail.orderItems.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.productName}</td>
                                                <td>{formatMoney(item.unitPrice)}</td>
                                                <td>{item.quantity}</td>
                                                <td>{formatMoney(item.totalPrice)}</td>
                                            </tr>
                                        ))}
                                        <tr className={styles.totalRow}>
                                            <td colSpan="3" style={{ textAlign: 'right' }}>Genel Toplam:</td>
                                            <td>{formatMoney(orderDetail.totalAmount)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', color: 'red' }}>Sipariş detayı bulunamadı.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;