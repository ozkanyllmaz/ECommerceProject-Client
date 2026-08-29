# ECommerceProject - Client

Bu proje, bir e-ticaret platformunun **frontend (istemci)** uygulamasıdır. React ve Vite üzerine kurulu, müşteri (Customer), yönetici (Manager) ve admin (Admin) rollerine özel arayüzler sunan tam kapsamlı bir SPA (Single Page Application) olarak geliştirilmiştir.

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
