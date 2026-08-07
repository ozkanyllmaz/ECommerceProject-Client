import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = 'https://localhost:7277/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Intercepter: Her istekten önce çalışır
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        //başarılı yanıtlara doğrudan izin veriyor
        return response;
    },
    async (error) => {
        // backendden hata mesajı döndüyse
        if (error.response) {
            const message = error.response.data.message || 'Bir hata meydana geldi';
            toast.error(message);

            // 401 unAuthorize döndüyse oturumu sonlandır
            if (error.response.status === 401) {
                toast.error('Oturumunuz sonlanmış. Lütfen tekrar giriş yapınız.');
                localStorage.getItem('accessToken');
                localStorage.getItem('refreshToken');
                window.location.href = '/login';
            }
            // 403 Forbidden, token geçerli ama yetki yok 
            else if (error.response.status === 403){
                toast.error('Bu işlemi gerçekleştirmeye yetkiniz bulunmamaktadır.');
                window.location.href = '/unauthorized';
            } else {
                toast.error(message);
            }
        }
        else {
            /* sunucuya hiç ulaşılamaması durumunda */
            toast.error('Sunucu ile bağlantı kurulamıyor. Lütfen daha sonra tekrar deneyiniz.');
        }
        return Promise.reject(error);
    }
)

export default api;

