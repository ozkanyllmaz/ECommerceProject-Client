import styles from './AdminDashboard.module.css'
import TwoLevelPieChart from '../../../components/Charts/TwoLevelPieChart';
import CustomBarChart from '../../../components/Charts/CustomBarChart';
import { useEffect, useState } from 'react';
import api from '../../../services/api'


const AdminDashboard = () => {
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/Dashboards/GetDashboardAnalytic');
                if(response.data && response.data.isSuccessfull){
                    const responseData = response.data.data;
                    setTotalUsers(responseData.totalUsers);
                    setTotalOrders(responseData.totalOrders);
                    setTotalRevenue(responseData.totalRevenue);
                }
            } catch (error) {
                console.error("Dashboard verileri çekilirken hata oluştu: ", error);
            }
        }
        fetchData();
    },[])



    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.pageTitle}>Dashboard Analizleri</h1>

            {/* Sayısal Kartlar (Özet Bilgiler) */}
            <div className={styles.summaryCards}>
                <div className={styles.card}>
                    <h3>Toplam Sipariş</h3>
                    <p className={styles.cardValue}>{totalOrders}</p>
                </div>
                <div className={styles.card}>
                    <h3>Toplam Gelir</h3>
                    <p className={styles.cardValue}>₺{totalRevenue.toLocaleString('tr-TR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}</p>
                </div>
                <div className={styles.card}>
                    <h3>Aktif Kullanıcı</h3>
                    <p className={styles.cardValue}>{totalUsers}</p>
                </div>
            </div>

            {/* Grafikler Alanı */}
            <div className={styles.chartsGrid}>

                {/* İleride eklenecek 1. Grafik Kartı (Örn: Aylık Satış Bar Chart) */}
                <div className={styles.chartCard}>
                    <h2 className={styles.chartTitle}>Aylık Sipariş Özeti</h2>
                    <CustomBarChart />
                </div>

                {/* 2. Grafik Kartı */}
                <div className={styles.chartCard}>
                    <h2 className={styles.chartTitle}>Kategori Bazlı Satış Dağılımı</h2>
                    <TwoLevelPieChart />
                </div>
            </div>

            <div className={styles.chartsGridBottom}>
                <div className={styles.chartCard}>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;