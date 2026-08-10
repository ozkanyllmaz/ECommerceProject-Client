import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import styles from './Product.module.css';
import api from '../../services/api'; // API yapılandırma yolunuza göre güncelleyiniz

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // URL'den Gelen Aktif Parametreler
    const activeCategoryId = searchParams.get('categoryId') || '';
    const activeSearch = searchParams.get('search') || '';
    const activeMinPrice = searchParams.get('minPrice') || '';
    const activeMaxPrice = searchParams.get('maxPrice') || '';

    // Uygulama Durumları (State)
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filtre Formu Durumları (Kullanıcının girdiği anlık değerler)
    const [formCategory, setFormCategory] = useState(activeCategoryId);
    const [formMinPrice, setFormMinPrice] = useState(activeMinPrice);
    const [formMaxPrice, setFormMaxPrice] = useState(activeMaxPrice);

    // URL'deki önceki parametreleri hafızada tutuyoruz
    const [prevUrlParams, setPrevUrlParams] = useState({
        category: activeCategoryId,
        min: activeMinPrice,
        max: activeMaxPrice
    });

    // Eğer tarayıcıda geri/ileri tuşuna basılırsa ve URL değişirse, formu render esnasında eşitliyoruz
    if (
        activeCategoryId !== prevUrlParams.category ||
        activeMinPrice !== prevUrlParams.min ||
        activeMaxPrice !== prevUrlParams.max
    ) {
        // Hafızayı yeni URL ile güncelliyoruz
        setPrevUrlParams({ category: activeCategoryId, min: activeMinPrice, max: activeMaxPrice });

        // Form alanlarını yeni URL ile eşitliyoruz
        setFormCategory(activeCategoryId);
        setFormMinPrice(activeMinPrice);
        setFormMaxPrice(activeMaxPrice);
    }

    // Kategori Listesini Backend'den Çekme
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/Categories/ListCategory?paginationParameter.PageNumber=1&paginationParameter.PageSize=50');
                if (response.data && response.data.isSuccessfull) {
                    setCategories(response.data.data.data || []);
                }
            } catch (error) {
                console.error("Kategoriler yüklenirken hata oluştu:", error);
            }
        };
        fetchCategories();
    }, []);

    // Ürün Listesini Çekme (Filtrelere Göre)
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                // Dinamik Query String Oluşturma
                const params = new URLSearchParams();
                params.append('paginationParameter.PageNumber', '1');
                params.append('paginationParameter.PageSize', '50');

                if (activeCategoryId) params.append('CategoryId', activeCategoryId);
                if (activeSearch) params.append('SearchTerm', activeSearch);
                if (activeMinPrice) params.append('MinPrice', activeMinPrice);
                if (activeMaxPrice) params.append('MaxPrice', activeMaxPrice);

                const response = await api.get(`/Products/GetAllProduct?${params.toString()}`);

                if (response.data && response.data.isSuccessfull) {
                    setProducts(response.data.data.data || []);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Ürünler getirilirken hata oluştu:", error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();

    }, [activeCategoryId, activeSearch, activeMinPrice, activeMaxPrice]);


    // Filtreleri Uygula Butonu İşlemi
    const handleFilterSubmit = () => {
        const params = new URLSearchParams();
        if (formCategory) params.set('categoryId', formCategory);
        if (activeSearch) params.set('search', activeSearch); // Arama terimini koru
        if (formMinPrice) params.set('minPrice', formMinPrice);
        if (formMaxPrice) params.set('maxPrice', formMaxPrice);

        setSearchParams(params);
    };

    // Filtreleri Temizle Butonu İşlemi
    const handleClearFilters = () => {
        setFormCategory('');
        setFormMinPrice('');
        setFormMaxPrice('');
        navigate('/products'); // Tüm parametreleri temizler
    };

    const selectedCategoryObj = categories.find(c => (c.id || c.Id) === formCategory);
    const selectedCategoryName = selectedCategoryObj ? (selectedCategoryObj.name || selectedCategoryObj.Name) : '';

    return (
        <div className={styles.pageContainer}>

            {/* --- SOL BÖLÜM: FİLTRELEME MENÜSÜ --- */}
            <aside className={styles.sidebar}>
                <div className={styles.filterGroup}>
                    <h3 className={styles.filterTitle}>Kategoriler</h3>
                    <div className={styles.filterList}>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="category"
                                value=""
                                checked={formCategory === ''}
                                onChange={(e) => setFormCategory(e.target.value)}
                            />
                            Tüm Ürünler
                        </label>

                        {categories.map((cat) => (
                            <label key={cat.id || cat.Id} className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="category"
                                    value={cat.id || cat.Id}
                                    checked={formCategory === (cat.id || cat.Id)}
                                    onChange={(e) => setFormCategory(e.target.value)}
                                />
                                {cat.name || cat.Name}
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.filterGroup}>
                    <h3 className={styles.filterTitle}>Fiyat Aralığı</h3>
                    <div className={styles.priceInputs}>
                        <input
                            type="number"
                            placeholder="Min"
                            className={styles.priceInput}
                            value={formMinPrice}
                            onChange={(e) => setFormMinPrice(e.target.value)}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            className={styles.priceInput}
                            value={formMaxPrice}
                            onChange={(e) => setFormMaxPrice(e.target.value)}
                        />
                    </div>

                    <button onClick={handleFilterSubmit} className={styles.filterBtn}>
                        Filtrele
                    </button>
                    <button onClick={handleClearFilters} className={styles.clearFilterBtn}>
                        Filtreleri Temizle
                    </button>
                </div>
            </aside>

            {/* --- SAĞ BÖLÜM: ÜRÜN LİSTESİ --- */}
            <main className={styles.mainContent}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>
                        {activeSearch ? `"${activeSearch}" için sonuçlar` : selectedCategoryName + " Ürünleri"}
                    </h1>
                    <span className={styles.productCount}>
                        {isLoading ? 'Yükleniyor...' : `${products.length} ürün listeleniyor`}
                    </span>
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>Ürünler Yükleniyor...</div>
                ) : (
                    <div className={styles.productGrid}>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <Link to={`/products/detail/${product.id}`} key={`pop-${product.id}`} className={styles.productCard}>
                                    <div className={styles.imageWrapper}>
                                        <img src={product.image || 'https://img.magnific.com/free-photo/global-environmental-sustainability-background-green-technology_53876-124629.jpg?semt=ais_test_b&w=740&q=80'} alt={product.name} />
                                    </div>
                                    <div className={styles.priceBlock}>
                                        <span className={styles.oldPrice}>₺{(product.price + (product.price > 10000 ? 1499 : 379))?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                        <span className={styles.currentPrice}>
                                            ₺{product.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <h3 className={styles.productTitle}>{product.name}</h3>
                                </Link>
                            ))
                        ) : (
                            <p style={{ color: '#6c757d' }}>Belirlediğiniz kriterlere uygun ürün bulunamadı.</p>
                        )}
                    </div>
                )}
            </main>

        </div>
    );
};

export default Products;