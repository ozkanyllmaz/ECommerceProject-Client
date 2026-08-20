import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { FiChevronLeft, FiChevronRight, FiTruck, FiPenTool } from 'react-icons/fi';
import { useState, useEffect, useRef } from "react";
import api from '../../services/api'
import { BiShield } from 'react-icons/bi';


const Home = () => {
    const popularProductsRef = useRef(null);
    const pcProductsRef = useRef(null);
    const keyboardProductsRef = useRef(null);

    const [popularProducts, setPopularProducts] = useState([]);
    const [pcProducts, setPcProducts] = useState([]);
    const [keyboardProducts, setKeyboardProducts] =useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const scroll = (ref, direction) => {
        if (ref.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }

    useEffect(() => {
        const fetchHomeData = async () => {
            setIsLoading(true);
            try {
                const popularResponse = await api.get('/Products/GetAllProduct?MinPrice=10000&paginationParameter.PageNumber=1&paginationParameter.PageSize=10');
                if (popularResponse.data && popularResponse.data.isSuccessfull) {
                    setPopularProducts(popularResponse.data.data.data || []);
                }

                const pcResponse = await api.get('/Products/GetAllProduct?CategoryId=aa5ddda8-72e9-4f89-44a2-08deed724037&paginationParameter.PageNumber=1&paginationParameter.PageSize=10');
                if (pcResponse.data && pcResponse.data.isSuccessfull) {
                    setPcProducts(pcResponse.data.data.data || []);
                }

                const keyboardResponse = await api.get('/Products/GetAllProduct?CategoryId=6915c9cb-e42e-4981-afe8-08defddd979f&paginationParameter.PageNumber=1&paginationParameter.PageSize=10'); 
                if(keyboardResponse.data && keyboardResponse.data.isSuccessfull){
                    setKeyboardProducts(keyboardResponse.data.data.data || []);
                }
            } catch (error) {
                console.error("Ana sayfa verileri yüklenirken sistemsel bir hata oluştu:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchHomeData();
    }, [])



    return (
        <div className={styles.homeContainer}>
            <section className={styles.heroGrid}>
                <Link to="/products/" className={`${styles.bannerItem} ${styles.mainBanner}`}>
                    <img src="src/images/productBannersss.jpg" alt="Elektronik Ürünler" className={styles.bannerImage} />

                    <div className={styles.bannerOverlay}></div>

                    <div className={styles.bannerContent}>
                        <p>Keşfetmeye başla</p>
                        <button className={styles.bannerButton}>Şimdi Satın Al</button>
                    </div>
                </Link>
                <Link to="/products?categoryId=eff798d3-1a6a-4e6a-c9c2-08defdf4d14d" className={styles.bannerItem}>
                    <img src="src/images/electronikProductsBannersss.jpg" alt="Elektronik Ürünler" className={styles.bannerImage} />
                    <div className={styles.bannerOverlay}></div>
                    <div className={styles.bannerContent}>
                        <h2>Akıllı Saatleri Keşfet</h2>
                    </div>
                </Link>
                <Link to="/products?categoryId=aa5ddda8-72e9-4f89-44a2-08deed724037" className={styles.bannerItem}>
                    <img src="src/images/pcBanners.jpg" alt="Elektronik Ürünler" className={styles.bannerImage} />
                    <div className={styles.bannerOverlay}></div>
                    <div className={styles.bannerContent}>
                        <h2>Bilgisayarları Keşfet</h2>
                    </div>
                </Link>
            </section>

            {/* POPÜLER ÜRÜNLER ALANI */}
            <section>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Popüler Ürünler</h2>
                    <div className={styles.sliderControls}>
                        <button onClick={() => scroll(popularProductsRef, 'left')} className={styles.sliderBtn}>
                            <FiChevronLeft size={20} />
                        </button>
                        <button onClick={() => scroll(popularProductsRef, 'right')} className={styles.sliderBtn}>
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className={styles.productRow} ref={popularProductsRef}>
                    {isLoading ? (
                        <p style={{ padding: '1rem', color: '#6c757d' }}>Ürünler yükleniyor...</p>
                    ) : popularProducts.length > 0 ? (
                        popularProducts.map((product) => (
                            <Link to={`/products/detail/${product.id}`} key={`pop-${product.id}`} className={styles.productCard}>
                                <div className={styles.imageWrapper}>
                                    <img src={product.imageUrl || 'https://img.magnific.com/free-photo/global-environmental-sustainability-background-green-technology_53876-124629.jpg?semt=ais_test_b&w=740&q=80'} alt={product.name} />
                                </div>
                                <div className={styles.priceBlock}>
                                    <span className={styles.oldPrice}>₺{(product.price + (product.price > 10000 ? 1499 : 379))?.toLocaleString('tr-TR', { minimumFractionDigits: 2}) }</span>
                                    <span className={styles.currentPrice}>
                                        ₺{product.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2})}
                                    </span>
                                </div>
                                <h3 className={styles.productTitle}>{product.name}</h3>
                            </Link>
                        ))
                    ) : (
                        <p style={{ padding: '1rem', color: '#6c757d' }}>Görüntülenecek ürün bulunamadı.</p>
                    )}
                </div>
            </section>

            {/* KATEGORİ BAZLI ÜRÜNLER ALANI */}
            <section>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Öne Çıkan Bilgisayarlar</h2>
                    <div className={styles.sliderControls}>
                        <button onClick={() => scroll(pcProductsRef, 'left')} className={styles.sliderBtn}>
                            <FiChevronLeft size={20} />
                        </button>
                        <button onClick={() => scroll(pcProductsRef, 'right')} className={styles.sliderBtn}>
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className={styles.productRow} ref={pcProductsRef}>
                    {isLoading ? (
                        <p style={{ padding: '1rem', color: '#6c757d' }}>Ürünler yükleniyor...</p>
                    ) : pcProducts.length > 0 ? (
                        pcProducts.map((product) => (
                            <Link to={`/products/detail/${product.id}`} key={`pop-${product.id}`} className={styles.productCard}>
                                <div className={styles.imageWrapper}>
                                    <img src={product.imageUrl || 'https://img.magnific.com/free-photo/global-environmental-sustainability-background-green-technology_53876-124629.jpg?semt=ais_test_b&w=740&q=80'} alt={product.name} />
                                </div>
                                <div className={styles.priceBlock}>
                                    <span className={styles.oldPrice}>₺{(product.price + (product.price > 10000 ? 1499 : 379))?.toLocaleString('tr-TR', { minimumFractionDigits: 2})}</span>
                                    <span className={styles.currentPrice}>
                                        ₺{product.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2})}
                                    </span>
                                </div>
                                <h3 className={styles.productTitle}>{product.name}</h3>
                            </Link>
                        ))
                    ) : (
                        <p style={{ padding: '1rem', color: '#6c757d' }}>Bu kategoriye ait ürün bulunamadı.</p>
                    )}
                </div>
            </section>

            {/* KATEGORİ BAZLI ÜRÜNLER ALANI */}
            <section>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Öne Çıkan Televizyonlar</h2>
                    <div className={styles.sliderControls}>
                        <button onClick={() => scroll(keyboardProductsRef, 'left')} className={styles.sliderBtn}>
                            <FiChevronLeft size={20} />
                        </button>
                        <button onClick={() => scroll(keyboardProductsRef, 'right')} className={styles.sliderBtn}>
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className={styles.productRow} ref={keyboardProductsRef}>
                    {isLoading ? (
                        <p style={{ padding: '1rem', color: '#6c757d' }}>Ürünler yükleniyor...</p>
                    ) : keyboardProducts.length > 0 ? (
                        keyboardProducts.map((product) => (
                            <Link to={`/products/detail/${product.id}`} key={`pop-${product.id}`} className={styles.productCard}>
                                <div className={styles.imageWrapper}>
                                    <img src={product.imageUrl || 'https://img.magnific.com/free-photo/global-environmental-sustainability-background-green-technology_53876-124629.jpg?semt=ais_test_b&w=740&q=80'} alt={product.name} />
                                </div>
                                <div className={styles.priceBlock}>
                                    <span className={styles.oldPrice}>₺{(product.price + (product.price > 10000 ? 1499 : 379))?.toLocaleString('tr-TR', { minimumFractionDigits: 2})}</span>
                                    <span className={styles.currentPrice}>
                                        ₺{product.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2})}
                                    </span>
                                </div>
                                <h3 className={styles.productTitle}>{product.name}</h3>
                            </Link>
                        ))
                    ) : (
                        <p style={{ padding: '1rem', color: '#6c757d' }}>Bu kategoriye ait ürün bulunamadı.</p>
                    )}
                </div>
            </section>

            {/* --- GÜVEN VE DEĞER TEKLİFİ ALANI --- */}
            <section className={styles.featuresGrid}>
                
                <div className={styles.featureCard1}>
                    <div className={styles.featureIcon2}>
                        <FiPenTool />
                    </div>
                    <div className={styles.featureContent}>
                        <h4 className={styles.featureTitle2}>Benzersiz Tasarımlar</h4>
                        <p className={styles.featureDesc2}>
                            4000'den fazla özgün tasarım ve özenle seçilmiş kaliteli ürünlerle tarzınızı yansıtın.
                        </p>
                    </div>
                </div>

                <div className={styles.featureCard2}>
                    <div className={styles.featureIcon}>
                        <BiShield />
                    </div>
                    <div className={styles.featureContent}>
                        <h4 className={styles.featureTitle}>%100 Güvenli Alışveriş</h4>
                        <p className={styles.featureDesc}>
                            256-bit SSL güvenlik sertifikası ve 3D Secure ile korunan ödemeler, 9 aya varan taksit seçenekleri.
                        </p>
                    </div>
                </div>

                <div className={styles.featureCard3}>
                    <div className={styles.featureIcon2}>
                        <FiTruck />
                    </div>
                    <div className={styles.featureContent}>
                        <h4 className={styles.featureTitle2}>Hızlı Teslimat</h4>
                        <p className={styles.featureDesc2}>
                            Siparişiniz kısa süre içinde hazırlanır, anlaşmalı kargo firmaları ile en geç 1-3 iş günü içinde teslim edilir.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- MARKA ODAKLI DİKEY KARTLAR --- */}
            <section className={styles.brandCardsGrid}>
                
                <Link to="/products?search=Monster" className={styles.brandCard} style={{ backgroundColor: '#1a1a1a' }}>
                    {/* Görsel yolu projenizin public klasörüne göre güncellenmelidir */}
                    <img src="src/images/monster.jpg" alt="Monster Notebook" className={styles.brandCardImage} />
                    <span className={styles.brandCardBadge}>Monster Notebook</span>
                </Link>

                <Link to="/products?search=Logitech" className={styles.brandCard} style={{ backgroundColor: '#0058a6' }}>
                    <img src="src/images/logi.jpg" alt="Logitech Ürünleri" className={styles.brandCardImage} />
                    <span className={styles.brandCardBadge}>Logitech</span>
                </Link>

                <Link to="/products?search=Apple" className={styles.brandCard} style={{ backgroundColor: '#f5f5f7' }}>
                    <img src="src/images/apple.jpg" alt="Apple Ürünleri" className={styles.brandCardImage} />
                    <span className={styles.brandCardBadge}>Apple</span>
                </Link>

            </section>

        </div>
    );
};

export default Home;