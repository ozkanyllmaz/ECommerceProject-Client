import { useEffect, useState, useCallback } from 'react'
import styles from './CartSideBar.module.css'
import api from '../../services/api';
import { FiShoppingCart, FiTrash2, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const CartSideBar = ({ isOpen, onClose }) => {

    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    const navigate = useNavigate();

    const fetchCartData = useCallback(async () => {
        await Promise.resolve();

        const isAuthenticated = localStorage.getItem('accessToken');

        if (isAuthenticated) {
            setIsLoading(true);

            try {
                const response = await api.get('/ShoppingCarts/GetCartSummary');

                if (response.data && response.data.isSuccessfull) {
                    const summary = response.data.data;
                    setCartItems(summary.cartItems);
                    setCartTotal(summary.totalPrice);
                } else {
                    toast.error('Sepet bilgileri alınamadı');
                }
            } catch (error) {
                console.error("Sepet çekilirken hata oluştu:", error);
                toast.error("Sunucu bağlantı hatası.");
            } finally {
                setIsLoading(false);
            }
        } else {
            // misafir kullanıcı
            const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
            setCartItems(guestCart);

            const calculatedTotal = guestCart.reduce((total, item) => {
                return total + (item.productPrice * item.quantity);
            }, 0);
            setCartTotal(calculatedTotal);
        }
    }, []);


    useEffect(() => {
        if (!isOpen) return;
        const timeoutId = setTimeout(() => {
            fetchCartData();
        }, 0);
        return () => clearTimeout(timeoutId);
    }, [isOpen, fetchCartData]);


    const handleRemoveItem = async (item) => {
        const isAuthenticated = localStorage.getItem('accessToken');

        if (isAuthenticated) {
            try {
                const response = await api.delete(`/ShoppingCarts/DeleteItemInCart?ProductId=${item.productId}`);
                if (response.data && response.data.isSuccessfull) {
                    toast.success('Ürün sepetten silindi');
                    fetchCartData();
                    if(location.pathname.startsWith('/checkout')){
                        window.location.reload();
                    }
                }
            } catch (error) {
                console.error("Ürün sepetten silinirken bir hata oluştu: ", error);
            }
        } else {
            const updatedCart = cartItems.filter(x => x.productId !== item.productId);
            setCartItems(updatedCart);
            localStorage.setItem('guestCart', JSON.stringify(updatedCart));

            const newTotal = updatedCart.reduce((total, i) => total + (i.productPrice * i.quantity), 0);
            setCartTotal(newTotal);
        }
    }

    const handleGoToCheckout = () => {
        navigate('/checkout');
        onClose();
    }

    const handleContinueShopping = () => {
        onClose();
    }
    const isAuthenticated = localStorage.getItem('accessToken');

    return (
        <>
            {/* Arka Plan Karartması (Overlay) */}
            <div className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`} onClick={onClose}></div>

            {/* Sağdan Açılan Çekmece */}
            <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>

                <div className={styles.header}>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <FiX />
                    </button>
                    <h2 className={styles.title}>ALIŞVERİŞ SEPETİ</h2>
                    <p className={styles.subtitle}>
                        {isLoading ? 'Sepetiniz Yükleniyor..' : cartItems.length === 0 ? 'Sepetiniz boş.' : `Sepetinizde ${cartItems.length} adet ürün var.`}
                    </p>
                </div>

                <div className={styles.content}>
                    {isLoading ? (
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>Yükleniyor...</div>
                    ) : cartItems.length === 0 ? (
                        /* Boş sepet görünümü */
                        <div className={styles.emptyState}>
                            <FiShoppingCart size={100} strokeWidth={1} />
                            <button className={styles.primaryBtn} onClick={handleContinueShopping}>
                                ALIŞVERİŞE BAŞLA
                            </button>
                        </div>
                    ) : (
                        /* Dolu sepet görünümü */
                        <div className={styles.cartList}>
                            {isAuthenticated ? (
                                cartItems.map((item) => (
                                    <div key={item.cartItemId} className={styles.cartItem}>
                                        <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />

                                        <div className={styles.itemInfo}>
                                            <span className={styles.itemName}>{item.name}</span>
                                            <div className={styles.itemPriceRow}>
                                                {item.quantity} Adet - <span className={styles.itemPrice}>
                                                    {item.price?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                                                </span>
                                            </div>
                                        </div>

                                        <button className={styles.deleteBtn} onClick={() => handleRemoveItem(item)}>
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item.productId} className={styles.cartItem}>
                                        <img src={item.productImage} alt={item.productName} className={styles.itemImage} />

                                        <div className={styles.itemInfo}>
                                            <span className={styles.itemName}>{item.productName}</span>
                                            <div className={styles.itemPriceRow}>
                                                {item.quantity} Adet - <span className={styles.itemPrice}>
                                                    {item.productPrice?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleRemoveItem(item)}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* DOLU SEPET İÇİN ALT BUTONLAR */}
                {cartItems.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.totalLabel}>Sepet Toplamı</div>
                        <div className={styles.totalPrice}>
                            {cartTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                        </div>

                        <div className={styles.btnGroup}>
                            <button onClick={handleGoToCheckout} className={styles.primaryBtn}>
                                SATIN AL
                            </button>
                            <button className={styles.secondaryBtn} onClick={handleContinueShopping}>
                                ALIŞVERİŞE DEVAM ET
                            </button>
                        </div>
                    </div>
                )}

            </div>

        </>
    )
}


export default CartSideBar;