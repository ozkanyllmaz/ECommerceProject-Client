import { useState, useEffect } from 'react';
import styles from './OrderManagement.module.css';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import OrderDetailModal from './OrderDetailModal';
import { jwtDecode } from 'jwt-decode';

const OrderManagement = () => {
    // Sekme Kontrolü ('pending' veya 'all')
    const [activeTab, setActiveTab] = useState('pending');

    // Veri State'leri
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Sayfalama State'leri (Sadece 'all' sekmesi için kullanılacak)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const token = localStorage.getItem('accessToken');
    const decodedToken = jwtDecode(token);
    const roleClaim = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decodedToken.role;

    const userRoles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];

    const isAdmin = userRoles.includes('Admin');


    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                if (activeTab === 'pending') {
                    const endpoint = isAdmin
                        ? '/Orders/ListOrderByAdmin'
                        : '/Orders/ListOrderByManager'

                    // 1. ONAY BEKLEYENLER (Sayfalama yok, dizi dönüyor)
                    const response = await api.get(endpoint);
                    if (response.data && response.data.isSuccessfull) {
                        setOrders(response.data.data || []);
                        setTotalPages(1); // Sayfalama butonlarını gizlemek için
                    }
                } else {
                    // 2. TÜM SİPARİŞLER (Sayfalamalı)
                    const response = await api.get(`/Orders/ListAllOrders?paginationParameter.PageNumber=${currentPage}&paginationParameter.PageSize=${pageSize}`);
                    if (response.data && response.data.isSuccessfull) {
                        const paginationData = response.data.data;
                        setOrders(paginationData.data || []);
                        setTotalPages(paginationData.totalPages);
                        setCurrentPage(paginationData.currentPage);
                        setPageSize(paginationData.pageSize);
                        setHasNextPage(paginationData.hasNextPage);
                        setHasPreviousPage(paginationData.hasPreviousPage);
                    }
                }
            } catch (error) {
                console.error("Siparişler çekilirken hata:", error);
                toast.error("Siparişler yüklenirken bir sorun oluştu.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [activeTab, currentPage, pageSize, refreshTrigger, isAdmin]);

    const handleApprove = async (orderId) => {
        const isConfirmed = window.confirm("Bu siparişi onaylamak istediğinize emin misiniz?");
        if (!isConfirmed) return;
        try {
            const response = await api.put(`/Orders/ApproveOrderByAdmin?OrderId=${orderId}`);

            if (response.data && response.data.isSuccessfull) {
                toast.success("Sipariş başarıyla onaylandı.");
                setRefreshTrigger(prev => prev + 1); // Tabloyu anında yenile
            }
        } catch (error) {
            console.error("Sipariş onaylanırken hata:", error);
            toast.error("Sipariş onaylanırken bir sorun oluştu.");
        }
    };

    const handleManagerApprove = async (orderId) => {
        const isConfirmed = window.confirm("Bu siparişi onaylamak istediğinize emin misiniz");
        if (!isConfirmed) return;
        try {
            const response = await api.put(`/Orders/ApproveOrderByManager?OrderId=${orderId}`);
            if (response.data && response.data.isSuccessfull) {
                toast.success("Sipariş yönetici onayına gönderildi");
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            console.error("Sipariş onaylanırken hata:", error);
            toast.error("Sipariş onaylanırken bir sorun oluştu");
        }
    }

    const handleReject = async (orderId) => {
        const isConfirmed = window.confirm("Bu siparişi reddetmek/iptal etmek istediğinize emin misiniz?");
        if (!isConfirmed) return;

        try {
            // PUT isteği atıyoruz ve ID'yi URL'den gönderiyoruz
            const response = await api.put(`/Orders/RejectOrderByAdmin?OrderId=${orderId}`);

            if (response.data && response.data.isSuccessfull) {
                toast.success("Sipariş reddedildi.");
                setRefreshTrigger(prev => prev + 1); // Tabloyu anında yenile
            }
        } catch (error) {
            console.error("Sipariş reddedilirken hata:", error);
            toast.error("Sipariş reddedilirken bir sorun oluştu.");
        }
    };

    const handleViewDetail = (orderId) => {
        setSelectedOrderId(orderId);
        setIsDetailModalOpen(true);
    };

    // Yardımcı Format Fonksiyonları
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const formatMoney = (amount) => amount ? amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' TL' : '0,00 TL';

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
    };


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Sipariş Yönetimi</h1>

                {/* Sekmeler */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'pending' ? styles.activeTab : ''}`}
                        onClick={() => { setActiveTab('pending'); setCurrentPage(1); }}
                    >
                        Onay Bekleyenler
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'all' ? styles.activeTab : ''}`}
                        onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
                    >
                        Tüm Siparişler
                    </button>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Sipariş No</th>
                            <th>Tarih</th>
                            <th>Tutar</th>
                            <th>Ürün Adedi</th>
                            <th>Durum</th>
                            <th style={{ width: '200px' }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody style={{ opacity: isLoading ? 0.5 : 1 }}>
                        {orders.length === 0 && !isLoading ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                                    {activeTab === 'pending' ? 'Bekleyen sipariş bulunmuyor.' : 'Hiç sipariş bulunamadı.'}
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => {
                                const statusUI = getStatusStyle(order.status);
                                return (
                                    <tr key={order.orderNumber}>
                                        <td className={styles.orderNumber}>{order.orderNumber}</td>
                                        <td>{formatDate(order.orderDate)}</td>
                                        <td style={{ fontWeight: '600' }}>{formatMoney(order.totalAmount)}</td>
                                        <td>{order.totalItemCount} Adet</td>
                                        <td>
                                            <span className={styles.statusBadge} style={{ backgroundColor: statusUI.bg, color: statusUI.color }}>
                                                {statusUI.text}
                                            </span>
                                        </td>
                                        <td className={styles.actions}>
                                            <button className={`${styles.actionBtn} ${styles.viewBtn}`} onClick={() => handleViewDetail(order.orderId || order.id)}>
                                                İncele
                                            </button>

                                            {/* Sadece onay bekleyenler sekmesindeyse Onayla/Reddet butonlarını göster */}
                                            {activeTab === 'pending' && userRoles.includes('Admin') && (
                                                <>
                                                    <button className={`${styles.actionBtn} ${styles.approveBtn}`} onClick={() => handleApprove(order.orderId)}>Onayla</button>
                                                    <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => handleReject(order.orderId)}>Reddet</button>
                                                </>
                                            )}
                                            {activeTab === 'pending' && userRoles.includes('Manager') && (
                                                <>
                                                    <button className={`${styles.actionBtn} ${styles.approveBtn}`} onClick={() => handleManagerApprove(order.orderId)}>Onayla</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Sayfalama (Sadece 'all' sekmesinde ve totalPages > 1 ise görünür) */}
            {activeTab === 'all' && totalPages > 0 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        // DÜZELTME: setHasPreviousPage değil, state'in kendisi olan hasPreviousPage'i kontrol ediyoruz
                        onClick={() => { if (hasPreviousPage) setCurrentPage(prev => prev - 1) }}
                        disabled={!hasPreviousPage || isLoading}
                    >
                        Önceki
                    </button>

                    <div className={styles.pageNumbers}>
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`${styles.pageBtn} ${currentPage === pageNumber ? styles.activePage : ''}`}
                                    disabled={isLoading}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        className={styles.pageBtn}
                        onClick={() => { if (hasNextPage) setCurrentPage(prev => prev + 1) }}
                        disabled={!hasNextPage || isLoading}
                    >
                        Sonraki
                    </button>
                </div>
            )}
            {/* Modal Çağrısı */}
            <OrderDetailModal
                key={selectedOrderId || 'empty-modal'}
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                orderId={selectedOrderId}
            />
        </div>
    );
};

export default OrderManagement;