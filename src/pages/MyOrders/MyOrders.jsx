import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import styles from './MyOrders.module.css'
import api from '../../services/api'
import { toast } from "react-toastify"

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyOrders = async () => {
            if (!localStorage.getItem('accessToken')) {
                navigate('/login');
                return;
            }

            setIsLoading(true);

            try {
                const response = await api.get(`/Orders/ListOrders?paginationParameter.PageNumber=${currentPage}&paginationParameter.PageSize=${pageSize}`);
                if (response.data && response.data.isSuccessfull) {
                    const paginationData = response.data.data;
                    setOrders(paginationData.data);
                    setPageSize(paginationData.pageSize);
                    setTotalPages(paginationData.totalPages);
                    setCurrentPage(paginationData.currentPage);
                    setHasNextPage(paginationData.hasNextPage);
                    setHasPreviousPage(paginationData.hasPreviousPage);
                }
            } catch (error) {
                console.error("Siparişler çekilirken hata:", error);
                toast.error("Siparişleriniz yüklenirken bir sorun oluştu.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyOrders();
    }, [currentPage, pageSize, navigate]);

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

    const handleNextPage = () => {
        if (hasNextPage) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (hasPreviousPage) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    if (isLoading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Siparişleriniz Yükleniyor...</div>;


    return (
        <div className={styles.ordersContainer}>
            <h1 className={styles.pageTitle}>Siparişlerim</h1>

            {orders.length === 0 && !isLoading ? (
                <div className={styles.emptyState}>
                    <p>Henüz hiç siparişiniz bulunmamaktadır.</p>
                    {currentPage > 1 ? (
                        <button onClick={handlePrevPage} className={styles.primaryBtn}>Önceki Sayfaya Dön</button>
                    ) : (
                        <Link to="/products" className={styles.primaryBtn}>Alışverişe Başla</Link>
                    )}
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.ordersTable}>
                        <thead>
                            <tr>
                                <th>Sipariş Numarası</th>
                                <th>Sipariş Tarihi</th>
                                <th>Ürün Adedi</th>
                                <th>Toplam Tutar</th>
                                <th>Durum</th>
                                <th>Detay</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => {
                                const statusUI = getStatusStyle(order.status);
                                return (
                                    <tr key={order.orderId}>
                                        <td className={styles.orderNumber}>{order.orderNumber}</td>
                                        <td>{formatDate(order.orderDate)}</td>
                                        <td>{order.totalItemCount} Ürün</td>
                                        <td className={styles.totalAmount}>
                                            {order.totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                                        </td>
                                        <td>
                                            <span
                                                className={styles.statusBadge}
                                                style={{ backgroundColor: statusUI.bg, color: statusUI.color }}
                                            >
                                                {statusUI.text}
                                            </span>
                                        </td>
                                        <td>
                                            {/* Kullanıcı Detay linkine tıkladığında siparişin içerisindeki ürünleri göreceği sayfaya gidecek */}
                                            <Link to={`/my-orders/${order.orderId}`} style={{ color: '#e3000f', textDecoration: 'none', fontWeight: '600' }}>
                                                Görüntüle
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* --- SAYFALAMA BUTONLARI (PAGINATION UI) --- */}
                    <div className={styles.pagination}>

                        <button
                            className={styles.pageBtn}
                            onClick={handlePrevPage}
                            disabled={!hasPreviousPage || isLoading}
                        >
                            Önceki
                        </button>

                        {/* SAYFA NUMARALARI BURADA ÜRETİLİYOR */}
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
                            onClick={handleNextPage}
                            disabled={!hasNextPage || isLoading}
                        >
                            Sonraki
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}

export default MyOrders