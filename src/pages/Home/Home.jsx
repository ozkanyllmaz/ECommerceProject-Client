
import { useRef } from "react";
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';


const Home = () => {
    const populerProductsRef = useRef(null);
    const footballProductsRef = useRef(null);

    const scroll = (ref, direction) => {
        if(ref.current){
            const scrollAmount = direction === 'left' ? -300 : 300;
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }
 
    const mockProducts = [
        { id: 1, title: 'Gordon Freeman, Black Mesa Tişört', oldPrice: '599,90', currentPrice: '479,90', image: 'src/images/black-mesa.jpg', colors: ['#000', '#fff', '#0d6efd'] },
        { id: 2, title: 'Almanya Dünya Kupası 2026 Tişört', oldPrice: '499,90', currentPrice: '429,90', image: 'src/images/black-mesa.jpg', colors: ['#fff', '#000'] },
        { id: 3, title: 'Meksika Dünya Kupası 2026 Tişört', oldPrice: '499,90', currentPrice: '429,90', image: 'src/images/black-mesa.jpg', colors: ['#fff', '#198754'] },
        { id: 4, title: 'Fransa 2026 Tişört', oldPrice: '459,90', currentPrice: '379,90', image: 'src/images/black-mesa.jpg', colors: ['#fff', '#0d6efd'] },
    ];
    

    return (
        <div className={styles.homeContainer}>
            <section className={styles.heroGrid}>
                <Link to="/products?categoryId=aa5ddda8-72e9-4f89-44a2-08deed724037" className={`${styles.bannerItem} ${styles.mainBanner}`}>
                    <img src="src/images/productBanner.jpg" alt="Elektronik Ürünler"className={styles.bannerImage}/>
                </Link>
                <Link to="/Categories" className={styles.bannerItem}>
                    <img src="src/images/electronikProductsBanner.jpg" alt="Elektronik Ürünler"className={styles.bannerImage}/>
                </Link>
                <Link to="/Categories" className={styles.bannerItem}>
                    <img src="src/images/pcBanner.jpg" alt="Elektronik Ürünler"className={styles.bannerImage}/>
                </Link>
            </section>

            <section>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Popüler Ürünler</h2>
                    <div className={styles.sliderControls}>
                        <button onClick={() => scroll(populerProductsRef, 'left')} className={styles.sliderBtn}>
                            <FiChevronLeft size={20}/>
                        </button>
                        <button onClick={() => scroll(populerProductsRef, 'right')} className={styles.sliderBtn}>
                            <FiChevronRight size={20}/>
                        </button>
                    </div>
                </div>

                <div className={styles.productRow} ref={populerProductsRef}>
                    {mockProducts.map((product) => (
                        <Link to='/' className={styles.productCard}>
                            <div className={styles.imageWrapper}>
                                <img src={product.image} alt={product.title} />
                                <div className={styles.colorOptions}>
                                    {product.colors.slice(0, 3).map((color, idx) => (
                                        <span key={idx} className={styles.colorDot} style={{ backgroundColor: color }}></span>
                                    ))}
                                    {product.colors.length > 3 && <span>+{product.colors.length - 3}</span>}
                                </div>
                            </div>
                            <div className={styles.priceBlock}>
                                    <span className={styles.oldPrice}>₺{product.oldPrice}</span>
                                    <span className={styles.currentPrice}>₺{product.currentPrice}</span>
                            </div>
                            <h3 className={styles.productTitle}>{product.title}</h3>
                        </Link>
                    ))}

                </div>
            </section>

            <section>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Futbol Ürünleri</h2>
                    <div className={styles.sliderControls}>
                        <button onClick={() => scroll(footballProductsRef, 'left')} className={styles.sliderBtn}>
                            <FiChevronLeft size={20} />
                        </button>
                        <button onClick={() => scroll(footballProductsRef, 'right')} className={styles.sliderBtn}>
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                </div>
                
                <div className={styles.productRow} ref={footballProductsRef}>
                    {/* Backend entegrasyonunda bu alan api.get('/Products?category=futbol') verisi ile beslenecektir */}
                    {mockProducts.map((product) => (
                        <Link to={`/product/${product.id}`} key={`ftb-${product.id}`} className={styles.productCard}>
                            <div className={styles.imageWrapper}>
                                <img src={product.image} alt={product.title} />
                            </div>
                            <div className={styles.priceBlock}>
                                <span className={styles.oldPrice}>₺{product.oldPrice}</span>
                                <span className={styles.currentPrice}>₺{product.currentPrice}</span>
                            </div>
                            <h3 className={styles.productTitle}>{product.title}</h3>
                        </Link>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default Home;