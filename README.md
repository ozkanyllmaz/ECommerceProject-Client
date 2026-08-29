# ECommerceProject - Client

Bu proje, bir e-ticaret platformunun **frontend (istemci)** uygulamasıdır. React ve Vite üzerine kurulu, müşteri (Customer), yönetici (Manager) ve admin (Admin) rollerine özel arayüzler sunan tam kapsamlı bir SPA (Single Page Application) olarak geliştirilmiştir.

## 🎥 Proje Tanıtımı

💡 **Not:** Projenin yeteneklerini ve arayüzünü detaylı incelemek için aşağıdaki görsele veya YouTube butonuna tıklayabilirsiniz.


[![E-Ticaret Projesi Önizleme](https://img.youtube.com/vi/5CzMRY2dNUI/maxresdefault.jpg)](https://www.youtube.com/watch?v=5CzMRY2dNUI)

[![YouTube'da İzle](https://img.shields.io/badge/YouTube'da_İzle-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=5CzMRY2dNUI)

## 📸 Ekran Görüntüleri

| Ana Sayfa ve Ürünler Vitrini | Admin Dashboard (Yönetim Paneli) |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/6e7b623b-c8b4-4c70-bbc7-003c1259721b" width="400"/> | <img src="https://github.com/user-attachments/assets/7c81507d-4395-4b1a-9221-5a21bae63ad8" width="400"/> |

<details>
<summary><b>✨ Daha Fazla Ekran Görüntüsü Göster (Sepet, Siparişler, Alt Paneller ve Loglar)</b></summary>
<br>

**🛒 Müşteri Deneyimi ve Satın Alma Akışı**

| Ürün Listeleme (Devamı) | Sepet (Cart) |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/9f7b0965-cf53-4883-8e27-9a94225bf72b" width="100%"/> | <img src="https://github.com/user-attachments/assets/e37c1d78-04cb-433d-879f-24e8c8ef58f3" width="100%"/> |

| Sipariş Tamamlama Ekranı | Sipariş Başarılı (Onay) |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/61a630c3-8589-4c19-9a63-108ca001e804" width="100%"/> | <img src="https://github.com/user-attachments/assets/21c82054-19e3-4050-960e-03543d3a2d26" width="100%"/> |

<br>

**⚙️ Yönetim Paneli İşlemleri (Admin/Manager)**

| Yönetim Paneli Arayüzü 1 | Yönetim Paneli Arayüzü 2 |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/f73d835b-98bb-4317-a86d-2922ac31f6d5" width="100%"/> | <img src="https://github.com/user-attachments/assets/95c8cc5d-0671-47e9-9af9-fe0559720c9f" width="100%"/> |

| Yönetim Paneli Arayüzü 3 | Yönetim Paneli Arayüzü 4 |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/2c8514a6-b03c-4460-a7b5-40c5f6ce0f98" width="100%"/> | <img src="https://github.com/user-attachments/assets/c189eef1-6876-447c-99e8-3d3fd9818061" width="100%"/> |

<br>

**📝 Sistem ve Güvenlik Logları**

| Log Ekranı 1 | Log Ekranı 2 |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/39ccf04b-1fe7-4a39-801f-725c83e53cae" width="100%"/> | <img src="https://github.com/user-attachments/assets/6b6a70de-4157-4cfe-b5dd-8e0a8ec30bb8" width="100%"/> |

| Log Ekranı 3 | |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/532a0e03-e1fd-48f3-9aa9-9c13557b82cb" width="100%"/> | |

</details>

## 🚀 Teknoloji Yığını

| Teknoloji | Açıklama |
|---|---|
| **React 19** | UI kütüphanesi |
| **Vite** | Geliştirme sunucusu ve build aracı |
| **React Router DOM v7** | Sayfa yönlendirme (`createBrowserRouter`) ve rol bazlı korumalı rotalar |
| **Axios** | HTTP istemcisi; interceptor'lar ile merkezi kimlik doğrulama ve hata yönetimi |
| **jwt-decode** | JWT token'larının çözümlenmesi (rol/kullanıcı bilgisi çıkarımı) |
| **React Toastify** | Kullanıcıya bildirim (toast) gösterimi |
| **Recharts** | Admin panelindeki grafik ve dashboard bileşenleri |
| **React Icons** | İkon seti |

### Custom UI Bileşenleri ve Stil İzolasyonu

Bu projede **Material UI, Ant Design, Bootstrap gibi hazır UI kütüphaneleri kullanılmamaktadır.** Tüm arayüz bileşenleri (`Layout`, `CartSideBar`, `Loading`, modallar, formlar vb.) sıfırdan, projeye özgü olarak yazılmıştır.

Stil yönetimi için **CSS Modules** (`*.module.css`) yaklaşımı benimsenmiştir. Bu sayede:
- Her bileşenin stili kendi kapsamına (scope) hapsedilir, global class çakışmaları önlenir.
- Bileşenler taşınabilir ve bağımsız hale gelir (bir bileşeni klasörüyle birlikte kopyalayıp başka bir projeye taşımak mümkündür).
- Üçüncü parti bir tasarım sistemine bağımlılık olmadığı için tasarım üzerinde tam kontrol sağlanır.

## 📁 Proje Yapısı

```
src/
├── components/          # Tekrar kullanılabilir custom UI bileşenleri (Layout, Footer, CartSideBar, Loading, Charts...)
├── layouts/             # Sayfa iskeletleri (AdminLayout)
├── pages/               # Sayfa bazlı bileşenler
│   ├── Manager/         # Yönetim paneli sayfaları (Dashboard, ürün/kategori/sipariş/kullanıcı/log yönetimi)
│   └── ...              # Home, Product, Checkout, Profile, Orders, Auth sayfaları vb.
├── routes/              # Routing yapılandırması ve rol bazlı korumalı rota (ProtectedRoute)
├── services/            # API iletişim katmanı (axios instance ve interceptor'lar)
├── images/              # Statik görseller
├── App.jsx              # Uygulama kök bileşeni (RouterProvider)
└── main.jsx             # Uygulama giriş noktası
```

## 🧭 Mimari Notlar

- **Routing:** `src/routes/index.jsx` içinde `createBrowserRouter` ile tanımlanmıştır. Genel kullanıcı sayfaları `Layout` bileşeni; yönetim paneli sayfaları ise `AdminLayout` bileşeni ile sarmalanır.
- **Yetkilendirme:** `ProtectedRoute` bileşeni, `allowedRoles` prop'u ile belirli rotaları yalnızca izin verilen rollere (`Admin`, `Manager`, `Customer`) açar; iç içe kullanılarak granüler erişim kontrolü sağlanır (örn. `categories` ve `products` yalnızca `Manager`, `users` ve `logs` yalnızca `Admin`).
- **Kimlik Doğrulama Akışı:** Access/refresh token çifti `localStorage`'da tutulur; axios response interceptor'ı 401 hatalarında otomatik token yenileme (refresh) işlemi yürütür ve bekleyen istekleri kuyruğa alarak yeniden dener. Refresh de başarısız olursa oturum sonlandırılıp kullanıcı login sayfasına yönlendirilir.

## 🔌 API Entegrasyonu

> **Yer Tutucu:** Bu proje, backend tarafında geliştirilmiş bir **.NET (ASP.NET Core Web API)** servisi ile REST API üzerinden haberleşmektedir. İstekler `src/services/api.js` içinde tanımlanan merkezi `axios` instance'ı üzerinden yürütülür (base URL, JWT header enjeksiyonu, 401/403 yönetimi ve otomatik token yenileme burada ele alınır).
>
> Backend endpoint listesi, DTO şemaları ve API dokümantasyonu (Swagger/OpenAPI vb.) için ilgili backend reposuna bakınız. *(Detaylar sonradan eklenecektir.)*

## 🛠️ Kurulum ve Çalıştırma

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Production build alın
npm run build

# Build'i önizleyin
npm run preview

# Lint kontrolü
npm run lint
```

> **Not:** API base URL'i `src/services/api.js` dosyasında tanımlıdır. Farklı bir backend adresi kullanmak için bu dosyadaki `BASE_URL` değişkenini güncelleyin.
