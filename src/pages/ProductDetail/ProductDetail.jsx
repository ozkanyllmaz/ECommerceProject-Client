import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import styles from './ProductDetail.module.css'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { FiChevronLeft, FiChevronRight, FiPenTool, FiTruck } from 'react-icons/fi'
import { BiShield } from 'react-icons/bi'


const ProductDetail = () => {
    // Url den dinamik id paramatresini yaakalr
    const { id } = useParams();
    const navigate = useNavigate();

    const similarProductsRef = useRef(null);

    // Uygulama durumları
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [openAccordion, setOpenAccordion] = useState('info');
    const [similarProducts, setSimilarProducts] = useState([]);


    useEffect(() => {
        const fetchProductDetail = async () => {
            setIsLoading(true);

            try {
                const response = await api.get(`/Products/GetProductById?Id=${id}`);

                if (response.data && response.data.isSuccessfull) {
                    const fetchedProduct = response.data.data;

                    setProduct(response.data.data);

                    const similarResponse = await api.get(`Products/GetAllProduct?CategoryId=${fetchedProduct.categoryId}&paginationParameter.PageNumber=1&paginationParameter.PageSize=10`);

                    if (similarResponse.data && similarResponse.data.isSuccessfull) {
                        setSimilarProducts(similarResponse.data.data.data || []);
                    }

                } else {
                    navigate('/products');
                }


            } catch (error) {
                console.error("Ürün getirilirken bir hata oluştu: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProductDetail();
        }
    }, [id, navigate]);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0 && value <= (product.stock || 10)) {
            setQuantity(value);
        } else if (value > (product.stock || 10)) {
            toast.warn('Ürün stoğu yetersiz');
            setQuantity(product.stock || 10)
        }
    };


    const handleAddToCart = async () => {
        const isAuthenticated = localStorage.getItem('accessToken');

        if (isAuthenticated) {
            // Login olan kullanıcı için sepete ürün ekleme
            try {
                const command = {
                    productId: product.id,
                    quantity: quantity
                };

                const response = await api.post('/ShoppingCarts/AddItemInCart', command);

                if (response.data && response.data.isSuccessfull) {
                    toast.success(response.data.message || 'Ürün sepete eklendi');
                } else {
                    toast.error(response.data.message || 'Ürün sepete eklenemedi');
                }
            } catch (error) {
                console.error("Ürün sepete eklenirken hata oluştu: ", error);
                toast.error('Sunucu ile iletişim kurulamadı. Lütfen tekrar deneyiniz.');
            }
        } else {
            // misafir kullanıcı için sepete ürün ekleme
            try {
                let guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];

                // eklenen ürün sepette var mı
                const existingItemIndex = guestCart.findIndex(item => item.productId === product.id);
                if (existingItemIndex > -1) {
                    guestCart[existingItemIndex].quantity += quantity;
                } else {
                    guestCart.push({
                        productId: product.id,
                        quantity: quantity,
                        productName: product.name,
                        productPrice: product.price,
                        productImage: product.imageUrl
                    });
                }
                localStorage.setItem('guestCart', JSON.stringify(guestCart));
                toast.success('Ürün sepete eklendi');

            } catch (error) {
                console.error("Misafir sepetine ekleme hatası: ", error);
                toast.error('Tarayıcı belleğine (localStorage) yazılamadı');
            }
        }
    };

    const toggleAccordion = (panel) => {
        setOpenAccordion(openAccordion === panel ? '' : panel);
    };

    // --- YÜKLENME VE HATA DURUMLARI ---
    if (isLoading) {
        return <div className={styles.pageContainer} style={{ textAlign: 'center', paddingTop: '5rem' }}>Ürün bilgileri yükleniyor...</div>;
    }

    if (!product) {
        return null; // useEffect içindeki navigate devreye girecektir.
    }


    const inStock = product.stock > 0;


    return (
        <div className={styles.pageContainer}>
            <div className={styles.detailGrid}>

                {/* SOL BÖLÜM: GÖRSELLER */}
                <div className={styles.leftCol}>
                    <div className={styles.mainImageWrapper}>
                        <img src={product.imageUrl} alt={product.name} className={styles.mainImage} />
                    </div>
                    {/* Görseldeki gibi altta küçük bir thumbnail (Aynı resmi küçük gösteriyoruz) */}
                    <div className={styles.thumbnailContainer}>
                        <div className={styles.thumbnailWrapper}>
                            <img src={product.imageUrl} alt="Thumbnail" />
                        </div>
                    </div>
                </div>

                {/* SAĞ BÖLÜM: DETAYLAR */}
                <div className={styles.rightCol}>
                    <h1 className={styles.productTitle}>{product.name}</h1>

                    <div className={styles.priceBlock}>
                        <span className={styles.oldPrice}>
                            ₺{(product.price + (product.price > 10000 ? 1499 : 379))?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className={styles.currentPrice}>
                            ₺{product.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    <div className={styles.actionArea}>
                        <span className={styles.quantityLabel}>Adet</span>
                        <div className={styles.actionRow}>
                            {/* Görseldeki gibi input şeklinde dropdown stili */}
                            <input
                                type="number"
                                className={styles.quantitySelect}
                                value={quantity}
                                onChange={handleQuantityChange}
                                min="1"
                                max={product.stock || 10}
                                disabled={!inStock}
                            />
                            <button
                                className={styles.addToCartBtn}
                                onClick={handleAddToCart}
                                disabled={!inStock}
                            >
                                SEPETE EKLE
                            </button>
                        </div>
                    </div>

                    <div className={styles.deliveryInfo}>
                        <FiTruck size={24} />
                        <div>
                            <div>Kargo Teslim Süresi</div>
                            <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.1rem' }}>2-4 İş Günü</div>
                        </div>
                    </div>

                    <div className={styles.infoBox}>
                        Sitemizde 4000'den fazla teknolojik aksesuar modeli bulunmaktadır. Sipariş üzerine depolarımızdan özenle paketleme işlemi yapılıp kargoya teslim edilir. Tüm bu süreç en fazla <strong>2-4 İŞ GÜNÜ</strong> sürebiliyor.
                    </div>

                    {/* AKORDİYON MENÜ */}
                    <div className={styles.accordionContainer}>

                        {/* 1. Ürün Bilgisi */}
                        <div className={styles.accordionItem}>
                            <button className={styles.accordionHeader} onClick={() => toggleAccordion('info')}>
                                Ürün Bilgisi <span className={styles.accordionIcon}>{openAccordion === 'info' ? '-' : '+'}</span>
                            </button>
                            {openAccordion === 'info' && (
                                <div className={styles.accordionContent}>
                                    {product.description || 'Bu ürün için detaylı bir açıklama girilmemiştir.'}
                                </div>
                            )}
                        </div>

                        {/* 2. Teknik Özellikler */}
                        <div className={styles.accordionItem}>
                            <button className={styles.accordionHeader} onClick={() => toggleAccordion('specs')}>
                                Teknik Özellikler <span className={styles.accordionIcon}>{openAccordion === 'specs' ? '-' : '+'}</span>
                            </button>
                            {openAccordion === 'specs' && (
                                <div className={styles.accordionContent}>
                                    <ul>
                                        <li><strong>Garanti:</strong> 2 Yıl Türkiye Garantili</li>
                                        <li><strong>Stok Durumu:</strong> {product.stock} adet stokta</li>
                                        <li><strong>Kutu İçeriği:</strong> Orijinal kapalı kutu, fatura ve garanti belgesi.</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* 3. Yorumlar */}
                        <div className={styles.accordionItem}>
                            <button className={styles.accordionHeader} onClick={() => toggleAccordion('comments')}>
                                Yorumlar <span className={styles.accordionIcon}>{openAccordion === 'comments' ? '-' : '+'}</span>
                            </button>
                            {openAccordion === 'comments' && (
                                <div className={styles.accordionContent}>
                                    <div className={styles.commentsSection}>
                                        <div className={styles.commentsText}>Bu ürüne ilk yorumu siz yapın</div>
                                        <button className={styles.commentBtn} disabled>
                                            Yorum Yap
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* BENZER ÜRÜNLER ALANI */}
            <section>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Benzer Ürünler</h2>
                    <div className={styles.sliderControls}>
                        <button onClick={() => scroll(similarProductsRef, 'left')} className={styles.sliderBtn}>
                            <FiChevronLeft size={20} />
                        </button>
                        <button onClick={() => scroll(similarProductsRef, 'right')} className={styles.sliderBtn}>
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className={styles.productRow} ref={similarProductsRef}>
                    {isLoading ? (
                        <p style={{ padding: '1rem', color: '#6c757d' }}>Ürünler yükleniyor...</p>
                    ) : similarProducts.length > 0 ? (
                        similarProducts.map((product) => (
                            <Link to={`/products/detail/${product.id}`} key={`pop-${product.id}`} className={styles.productCard}>
                                <div className={styles.imageWrapper}>
                                    <img src={product.image || 'https://img.magnific.com/free-photo/global-environmental-sustainability-background-green-technology_53876-124629.jpg?semt=ais_test_b&w=740&q=80'} alt={product.name} />
                                </div>
                                <div className={styles.priceBlock}>
                                    <span className={styles.oldPrice}>₺{(product.price + (product.price > 10000 ? 1499 : 379))?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                    <span className={styles.currentPrice}>
                                        ₺{product.price}
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
        </div>
    );
}

export default ProductDetail
