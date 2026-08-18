import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import styles from './LogManagement.module.css'
import api from "../../../services/api";

const LogManagement = () => {
    const [logs, setLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('Exception');

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(8);
    const [totalPages, setTotalPages] = useState(1);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(false);

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchExceptionLogs = async () => {
            setIsLoading(true);
            try {
                let endpoint = '';
                if (activeTab === 'Exception') endpoint = '/Logs/ListExceptionLogs';
                else if (activeTab === 'Request') endpoint = '/Logs/ListRequestLogs';
                else if (activeTab === 'Audit') endpoint = '/Logs/ListAuditLogs';


                const response = await api.get(`${endpoint}?paginationParameter.PageNumber=${currentPage}&paginationParameter.PageSize=${pageSize}`);
                const responseException = response.data.data;
                if (response.data && response.data.isSuccessfull) {
                    setLogs(responseException.data || []);
                    setCurrentPage(responseException.currentPage);
                    setPageSize(responseException.pageSize);
                    setTotalPages(responseException.totalPages);
                    setHasPreviousPage(responseException.hasPreviousPage);
                    setHasNextPage(responseException.hasNextPage);
                }
            } catch (error) {
                console.error("Exception logları çekilirken hata oluştu: ", error);
                toast.error("Exception logları getirilemedi");
            } finally {
                setIsLoading(false);
            }
        }
        fetchExceptionLogs();
    }, [currentPage, pageSize, activeTab]);

    // Sekme değiştiğinde yapılacak işlemler
    const handleTabChange = (tabName) => {
        if (activeTab === tabName) return; // Zaten aynı sekmedeyse işlem yapma
        setActiveTab(tabName);
        setCurrentPage(1); // Sayfayı sıfırla
        setLogs([]); // Yüklenirken eski veriler görünmesin diye listeyi temizle
    };


    const getPageNumbers = () => {
        const pages = [];

        if (totalPages <= 7) {
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        }

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        // Başlardaysak, sağ tarafa biraz daha sayfa aç
        if (currentPage <= 3) {
            endPage = 5;
        }
        // Sonlardaysak, sol tarafa biraz daha sayfa aç
        if (currentPage >= totalPages - 2) {
            startPage = totalPages - 4;
        }

        // 1. Sayfayı ve gerekirse sol "..." işaretini ekle
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push('...');
            }
        }

        // Ortadaki hareketli sayıları ekle
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Son sayfayı ve gerekirse sağ "..." işaretini ekle
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    }


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Sipariş Yönetimi</h1>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'Exception' ? styles.activeTab : ''}`}
                        onClick={() => { handleTabChange('Exception'); }}
                    >
                        Exception Logları
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'Request' ? styles.activeTab : ''}`}
                        onClick={() => { handleTabChange('Request'); }}
                    >
                        Request Logları
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'Audit' ? styles.activeTab : ''}`}
                        onClick={() => { handleTabChange('Audit'); }}
                    >
                        Audit Logları
                    </button>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.colMessage}>Mesaj</th>
                            <th className={styles.colTemplate}>Mesaj Template</th>
                            <th className={styles.colLevel}>Seviye</th>
                            <th className={styles.colDate}>Tarih</th>
                            {(activeTab === 'Request' || activeTab === 'Exception') && <th className={styles.colUser}>Kullanıcı (Email)</th>}
                            {activeTab === 'Exception' && <th className={styles.colException}>Hata Detayı</th>}
                        </tr>
                    </thead>
                    <tbody style={{ opacity: isLoading ? 0.5 : 1 }}>
                        {logs.length === 0 && !isLoading ? (
                            <tr>
                                <td colSpan={activeTab === 'Audit' ? "4" : "5"} style={{ textAlign: 'center', padding: '2rem' }}>
                                    {activeTab} logu bulunamadı.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log, index) => (
                                // Backend'den gelen id varsa onu, yoksa index'i key olarak ver
                                <tr key={log.id || index}>
                                    <td className={styles.colMessage}>
                                        {activeTab === 'Audit' ? (
                                            <div className={styles.exceptionBox}>{log.message}</div>
                                        ) : (
                                            log.message
                                        )}
                                    </td>
                                    <td className={styles.colTemplate}>{log.messageTemplate}</td>
                                    <td className={styles.colLevel}>{log.level}</td>
                                    <td className={styles.colDate}>{log.timeStamp}</td>

                                    {activeTab !== 'Audit' && (
                                        <td className={styles.colUser}>{log.user || "-"}</td>
                                    )}

                                    {activeTab === 'Exception' && (
                                        <td className={styles.exceptionBox}>
                                            <div className={styles.exceptionBox}>
                                                {log.exception || "-"}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}

                    </tbody>
                </table>
            </div>

            <div className={styles.pagination}>
                <button
                    className={styles.pageBtn}
                    onClick={() => { if (hasPreviousPage) setCurrentPage(prev => prev - 1) }}
                    disabled={!hasPreviousPage || isLoading}
                >
                    önceki
                </button>

                <div className={styles.pageNumbers}>
                    {getPageNumbers().map((page, index) => {
                        if (page === '...') {
                            return (
                                <span key={index} className={styles.dots}>
                                    ...
                                </span>
                            )
                        }
                        return (
                            <button
                                key={index}
                                className={`${styles.pageBtn} ${currentPage === page ? styles.activePage : ''}`}
                                onClick={() => setCurrentPage(page)}

                            >
                                {page}
                            </button>
                        )
                    })}
                </div>

                <button
                    className={styles.pageBtn}
                    onClick={() => { if (hasNextPage) setCurrentPage(prev => prev + 1) }}
                    disabled={!hasNextPage}
                >
                    Sonraki
                </button>
            </div>

        </div>
    )
}

export default LogManagement