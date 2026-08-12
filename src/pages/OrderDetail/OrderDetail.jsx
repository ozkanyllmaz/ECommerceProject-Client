import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import styles from './OrderDetail.module.css'
import api from '../../services/api'
import { toast } from "react-toastify"

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            if (!localStorage.getItem('accessToken')) {
                navigate('/login');
                return;
            }

            setIsLoading(true);

            try {
                const response = await api.get(`/Orders/ListOrderDetail?OrderId=${id}`)
                if (response.data && response.data.isSuccessfull) {
                    const orderData = response.data.data[0];
                    if (orderData) {
                        setOrder(orderData);
                    } else {
                        toast.error("Sipariş detayı bulunamadı.");
                        navigate('/my-orders');
                    }
                }
            } catch (error) {
                console.error("Sipariş detayı çekilirken hata:", error);
                toast.error("Sipariş detayı yüklenemedi.");
                navigate('/my-orders');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetail();
    }, [id, navigate]);

    const getStatusStyle = (statusCode) => {
        switch (statusCode) {
            case 1:
                return { text: 'Sipariş Alındı', bg: '#e8f5e9', color: '#4caf50' };
            case 2:
                return { text: 'Onaylandı', bg: '#fff3e0', color: '#2dd100' };
            case 3:
                return { text: 'Tamamlandı', bg: '#e3f2fd', color: '#2196f3' };
            case 4:
                return { text: 'İptal Edildi', bg: '#ffebee', color: '#f45936f4' };
            case 5:
                return { text: 'İade Edildi', bg: '#ffebee', color: '#f49b36' };
            case 6:
                return { text: 'Reddedildi', bg: '#ffebee', color: '#f44336' };
            default:
                return { text: 'Bilinmiyor', bg: '#eeeeee', color: '#757575' };
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const formatMoney = (amount) => {
        return amount ? amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' TL' : '0,00 TL';
    };

    if (isLoading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Sipariş Detayları Yükleniyor...</div>;
    if (!order) return null;

    const statusUI = getStatusStyle(order.status);


    return (
        <div className={styles.detailContainer}>
            <div className={styles.topContainer}>
                <div className={styles.topLeft}>
                    <h1 className={styles.pageTitle}>Sipariş Detayı</h1>
                    <div className={styles.infoRow}>
                        <span>Sipariş No: <strong>{order.orderNumber}</strong></span>
                        <span>•</span>
                        <span>Tarih: <strong>{formatDate(order.orderDate)}</strong></span>
                        <span>•</span>
                        <span className={styles.statusBadge} style={{ backgroundColor: statusUI.bg, color: statusUI.color }}>
                            {statusUI.text}
                        </span>
                    </div>
                </div>
                
                <div className={styles.topRight}>
                    <Link to="/my-orders" className={styles.backBtn}>← Siparişlerime Dön</Link>
                </div>
            </div>

            <div className={styles.grid}>
                {/* SOL TARAF: Ürün Listesi */}
                <div className={styles.leftColumn}>
                    <div className={styles.sectionCard}>
                        <h2 className={styles.sectionTitle}>Sipariş Edilen Ürünler</h2>
                        <table className={styles.itemsTable}>
                            <thead>
                                <tr>
                                    <th>Ürün Adı</th>
                                    <th>Birim Fiyat</th>
                                    <th>Adet</th>
                                    <th>Toplam</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.orderItems && order.orderItems.map((item) => (
                                    <tr key={item.productId}>
                                        <td className={styles.productName}>{item.productName}</td>
                                        <td>{formatMoney(item.unitPrice)}</td>
                                        <td>{item.quantity}</td>
                                        <td><strong>{formatMoney(item.totalPrice)}</strong></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SAĞ TARAF: Adresler ve Özet */}
                <div className={styles.rightColumn}>
                    <div className={styles.sectionCard}>
                        <h2 className={styles.sectionTitle}>Teslimat Bilgileri</h2>

                        <div className={styles.addressBlock}>
                            <div className={styles.addressTitle}>Teslimat Adresi</div>
                            <div className={styles.addressText}>
                                {order.shippingAddress.firstName} {order.shippingAddress.lastName} <br />
                                {order.shippingAddress.phoneNumber} <br />
                                {order.shippingAddress.fullAddress} <br />
                                {order.shippingAddress.district} / {order.shippingAddress.city}
                            </div>
                        </div>

                        <div className={styles.addressBlock} style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            <div className={styles.addressTitle}>Fatura Adresi</div>
                            <div className={styles.addressText}>
                                {order.billingAddress.firstName} {order.billingAddress.lastName} <br />
                                {order.billingAddress.fullAddress} <br />
                                {order.billingAddress.district} / {order.billingAddress.city} <br />

                                {/* Kurumsal Fatura ise ekstra bilgileri göster */}
                                {order.billingAddress.invoiceType === 'Kurumsal' && (
                                    <div style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.85rem' }}>
                                        <strong>Firma:</strong> {order.billingAddress.companyName} <br />
                                        <strong>VD:</strong> {order.billingAddress.taxOffice} - <strong>VN:</strong> {order.billingAddress.taxNumber}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.sectionCard}>
                            <h2 className={styles.sectionTitle}>Sipariş Özeti</h2>
                            <div className={styles.summaryItem}>
                                <span>Ara Toplam</span>
                                <span>{formatMoney(order.totalAmount)}</span>
                            </div>
                            <div className={styles.summaryItem}>
                                <span>Kargo Ücreti</span>
                                <span>Ücretsiz</span>
                            </div>
                            <div className={`${styles.summaryItem} ${styles.totalRow}`}>
                                <span style={{ whiteSpace: 'nowrap' }}>Genel Toplam: </span>
                                <span style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>{formatMoney(order.totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetail