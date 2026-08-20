
import { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../../services/api';

// Grafikte kullanılacak veriler (İleride API'den gelecek)
const COLORS = [
  '#0d00ff',
  'rgb(0, 33, 100)',
  '#5ae4ff',
  '#00db54',
  '#489500',
  '#f7ff04',
  '#ffaa00' 
];

export default function TwoLevelPieChart() {
  const [chartDatas, setChartDatas] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await api.get('/Dashboards/GetPieChartDatas');
        if (response.data && response.data.isSuccessfull) {
          setChartDatas(response.data.data.productSalesResults);
        }
      } catch (error) {
        console.error("PieChart verileri çekilirken hata: ", error);
      }
    }
    fetchChartData();
  }, [])




  return (
    // Dashboard kartına tam sığması için ResponsiveContainer kullanıyoruz
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={chartDatas}
          dataKey="value"
          nameKey="productName"
          cx="50%"
          cy="50%"
          outerRadius={100} // Grafiğin büyüklüğü
          label // Dilimlerin yanında isimlerinin yazması için
        >
          {/* Her dilime kendi özel rengini veriyoruz */}
          {chartDatas.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        {/* Üzerine gelindiğinde açılan bilgi kutucuğu */}
        <Tooltip
          formatter={(value, name) => [`${value}`, name.substring(0,15)]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}