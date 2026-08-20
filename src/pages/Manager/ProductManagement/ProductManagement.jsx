import { useState, useEffect } from 'react';
import styles from './ProductManagement.module.css';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import ProductModal from './ProductModal';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sayfalama State'leri
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);

    // Modal ve Yenileme State'leri
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/Categories/ListCategory?paginationParameter.PageNumber=1&paginationParameter.PageSize=15');
                if (response.data && response.data.isSuccessfull) {
                    setCategories(response.data.data.data);
                }
            } catch (error) {
                console.error("Kategoriler çekilirken hata:", error);
                toast.error("Kategoriler yüklenemedi.");
            }
        }
        fetchCategories();
    }, [])

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const url = selectedCategory
                    ? `/Products/GetProductsByCategory?CategoryId=${selectedCategory}&paginationParameter.PageNumber=${currentPage}&paginationParameter.PageSize=${pageSize}`
                    : `/Products/GetAllProduct?paginationParameter.PageNumber=${currentPage}&paginationParameter.PageSize=${pageSize}`

                const response = await api.get(url);

                if (response.data && response.data.isSuccessfull) {
                    const paginationData = response.data.data;

                    setProducts(paginationData.data);
                    setTotalPages(paginationData.totalPages);
                    setCurrentPage(paginationData.currentPage);
                    setPageSize(paginationData.pageSize);
                    setHasNextPage(paginationData.hasNextPage);
                    setHasPreviousPage(paginationData.hasPreviousPage);
                }
            } catch (error) {
                console.error("Ürünler çekilirken hata:", error);
                toast.error("Ürünler yüklenirken bir sorun oluştu.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, pageSize, refreshTrigger, selectedCategory]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1);
    }

    // Sayfa Değiştirme Fonksiyonları
    const handleNextPage = () => { if (hasNextPage) setCurrentPage(prev => prev + 1); };
    const handlePrevPage = () => { if (hasPreviousPage) setCurrentPage(prev => prev - 1); };

    // İşlem Fonksiyonları
    const handleAddProduct = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (id) => {
        const isConfirmed = window.confirm("Bu ürünü kalıcı olarak silmek istediğinize emin misiniz?");
        if (!isConfirmed) return;

        try {
            const response = await api.delete(`/Products/DeleteProduct?id=${id}`);
            if (response.data && response.data.isSuccessfull) {
                toast.success("Ürün başarıyla silindi.");
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            console.error("Ürün silinirken hata:", error);
            toast.error("Ürün silinirken bir sorun oluştu.");
        }
    };

    const formatMoney = (amount) => {
        return amount ? amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' TL' : '0,00 TL';
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Ürün Yönetimi</h1>

                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className={styles.categoryDropdown}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc' }}
                    >
                        <option value="">Tüm Kategoriler</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <button className={styles.addBtn} onClick={handleAddProduct}>
                        + Yeni Ürün Ekle
                    </button>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '70px' }}>Görsel</th>
                            <th>Ürün Adı</th>
                            <th>Kategori</th>
                            <th>Fiyat</th>
                            <th>Stok</th>
                            <th style={{ width: '150px' }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody style={{ opacity: isLoading ? 0.5 : 1 }}>
                        {products.length === 0 && !isLoading ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Ürün bulunamadı.</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <img src={product.imageUrl} alt={product.name} className={styles.productImage} />
                                    </td>
                                    <td className={styles.productName}>{product.name}</td>
                                    <td>
                                        <span className={styles.categoryBadge}>{product.categoryName}</span>
                                    </td>
                                    <td style={{ fontWeight: '600', color: '#e3000f' }}>
                                        {formatMoney(product.price)}
                                    </td>
                                    <td>{product.stock} Adet</td>
                                    <td className={styles.actions}>
                                        <button className={styles.editBtn} onClick={() => handleEditProduct(product)}>Düzenle</button>
                                        <button className={styles.deleteBtn} onClick={() => handleDeleteProduct(product.id)}>Sil</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button className={styles.pageBtn} onClick={handlePrevPage} disabled={!hasPreviousPage || isLoading}>
                        Önceki
                    </button>

                    <div className={styles.pageNumbers}>
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`${styles.pageBtn} ${currentPage === pageNumber ? styles.activePage : ''}`}
                                    disabled={isLoading}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}
                    </div>

                    <button className={styles.pageBtn} onClick={handleNextPage} disabled={!hasNextPage || isLoading}>
                        Sonraki
                    </button>
                </div>
            )}

            {/* Ürün Ekleme/Düzenleme Modalı buraya gelecek */}
            {isModalOpen && (
                <ProductModal
                    key={selectedProduct ? selectedProduct.id : 'new'}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    productToEdit={selectedProduct}
                    onSuccess={() => setRefreshTrigger(prev => prev + 1)}
                />
            )}
        </div>
    );
};

export default ProductManagement;