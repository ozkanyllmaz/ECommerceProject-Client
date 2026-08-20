import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api'; // API yolunu kendi projene göre ayarla

// Para birimini formatlayan yardımcı fonksiyon (Tooltip'te 506.900,00 ₺ göstermek için)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0
  }).format(value);
};

export default function CustomBarChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await api.get('/Dashboards/GetBarChartDatas');
        if (response.data && response.data.isSuccessfull) {
          // Backend'den gelen veri dizisini state'e atıyoruz
          setChartData(response.data.data);
        }
      } catch (error) {
        console.error("BarChart verileri çekilirken hata: ", error);
      }
    };

    fetchChartData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
        
        {/* X Ekseni: API'den gelen "dayName" (Pzt, Sal, Çar vb.) */}
        <XAxis dataKey="dayName" axisLine={false} tickLine={false} />
        
        {/* 
            Y Ekseni: Büyük sayıları k ile kısaltıyoruz (Örn: 506900 -> 506.9k). 
            Eğer sayı 0 ise direkt 0 yazsın.
        */}
        <YAxis 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={(value) => value > 0 ? `₺${(value / 1000).toFixed(1)}k` : '0'} 
        />
        
        {/* Tooltip: Fareyle üzerine gelince tam kuruşlu parayı göstersin */}
        <Tooltip 
            cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            formatter={(value) => [formatCurrency(value), 'Günlük Ciro']}
        />
        
        {/* 
            Tek Bar: Sadece Ciro'yu (totalRevenue) göstereceğiz.
            Senin seçtiğin o şık koyu yeşili kullandık. 
        */}
        <Bar dataKey="totalRevenue" name="Ciro" fill="#173617" radius={[4, 4, 0, 0]} />
        
      </BarChart>
    </ResponsiveContainer>
  );
}