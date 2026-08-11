import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = 'https://localhost:7277/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false; // O an token yenileniyor mu?
let failedQueue = []; // Token yenilenirken gelen diğer istekleri bekleteceğimiz kuyruk

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
}

// Request Intercepter: Her istekten önce çalışır
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        //başarılı yanıtlara doğrudan izin veriyor
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        // backendden hata mesajı döndüyse
        if (error.response) {
            const status = error.response.status;
            
            // 401 unAuthorize döndüyse oturumu sonlandır
            if (status === 401) {
                if (!originalRequest._retry) {

                    // Eğer o saniyede halihazırda bir Refresh işlemi devam ediyorsa
                    // Gelen bu yeni isteği kuyruğa (failedQueue) at ve yeni token gelene kadar beklet.
                    if (isRefreshing) {
                        return new Promise(function (resolve, reject) {
                            failedQueue.push({ resolve, reject })
                        }).then(token => {
                            originalRequest.headers.Authorization = 'Bearer ' + token;
                            return api(originalRequest);
                        }).catch(err => {
                            return Promise.reject(err);
                        });
                    }
                }

                // İlk kez 401 alındı, refresh süreci başlıyor
                originalRequest._retry = true; // Sonsuz döngüye girmemesi için bayrak dikiyoruz
                isRefreshing = true; // Diğer istekleri durdurmak için sistemi kilitliyoruz

                try {
                    const accessToken = localStorage.getItem('accessToken');
                    const refreshToken = localStorage.getItem('refreshToken');

                    const refreshResponse = await axios.post('https://localhost:7277/api/Auth/RefreshToken', {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    });

                    if (refreshResponse.data && refreshResponse.data.isSuccessfull) {
                        const newTokens = refreshResponse.data.data;

                        localStorage.setItem('accessToken', newTokens.accessToken);
                        localStorage.setItem('refreshToken', newTokens.refreshToken);

                        api.defaults.headers.common['Authorization'] = 'Bearer ' + newTokens.accessToken;

                        originalRequest.headers.Authorization = 'Bearer ' + newTokens.accessToken;

                        processQueue(null, newTokens.accessToken);

                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    // EĞER REFRESH TOKEN DA SÜRESİNİ DOLDURDUYSA (Örn: 30 gün girilmediyse)
                    processQueue(refreshError, null); // Kuyruktakileri hata ile iptal et

                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');

                    toast.warn("Oturum süreniz tamamen doldu. Lütfen tekrar giriş yapın.");
                    window.location.href = '/login'; // Login sayfasına yönlendir

                    return Promise.reject(refreshError);
                } finally {
                    // İşlem bittiğinde kilitleri aç
                    isRefreshing = false;
                }
            }
            // 403 Forbidden, token geçerli ama yetki yok 
            else if (status === 403) {
                toast.error('Bu işlemi gerçekleştirmeye yetkiniz bulunmamaktadır.');
                window.location.href = '/unauthorized';
            } else {
                const message = error.response.data.message || 'Bir hata meydana geldi';
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

