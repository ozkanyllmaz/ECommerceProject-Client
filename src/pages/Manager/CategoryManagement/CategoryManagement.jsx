import { useState, useEffect } from 'react';
import styles from './CategoryManagement.module.css';
import api from '../../../services/api'; // API yolunuzu kendinize göre ayarlayın
import { toast } from 'react-toastify';
import CategoryModal from './CategoryModal';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sayfalama State'leri
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);

    // Mevcut state'lerinizin (currentPage vs.) hemen altına ekleyin:
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Tabloyu yenilemek için tetikleyici


    useEffect(() => {
        // Fonksiyonu doğrudan useEffect'in içine alıyoruz
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/Categories/ListCategory?paginationParameter.PageNumber=${currentPage}&paginationParameter.PageSize=${pageSize}`);

                if (response.data && response.data.isSuccessfull) {
                    const paginationData = response.data.data;

                    setCategories(paginationData.data);
                    setTotalPages(paginationData.totalPages);
                    setCurrentPage(paginationData.currentPage);

                    setPageSize(paginationData.pageSize);

                    setHasNextPage(paginationData.hasNextPage);
                    setHasPreviousPage(paginationData.hasPreviousPage);
                }
            } catch (error) {
                console.error("Kategoriler çekilirken hata:", error);
                toast.error("Kategoriler yüklenirken bir sorun oluştu.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, [currentPage, pageSize, refreshTrigger]);

    // Sayfa Değiştirme Fonksiyonları
    const handleNextPage = () => { if (hasNextPage) setCurrentPage(prev => prev + 1); };
    const handlePrevPage = () => { if (hasPreviousPage) setCurrentPage(prev => prev - 1); };


    const handleAddCategory = () => {
        setSelectedCategory(null); // Null olması "Yeni Ekleme" olduğunu gösterir
        setIsModalOpen(true);
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category); // Obje dolu olması "Düzenleme" olduğunu gösterir
        setIsModalOpen(true);
    };

    const handleDeleteCategory = async (id) => {
        const isConfirmed = window.confirm("Bu kategoriyi kalıcı olarak silmek istediğinize emin misiniz?");

        if (!isConfirmed) {
            return; // Kullanıcı iptal ederse işlemi durdur
        }

        try {
            const response = await api.delete(`/Categories/DeleteCategory?Id=${id}`);

            if (response.data && response.data.isSuccessfull) {
                toast.success("Kategori başarıyla silindi.");
                setRefreshTrigger(prev => prev + 1); // Başarılı silme sonrası tabloyu anında yenile
            }
        } catch (error) {
            console.error("Kategori silinirken hata:", error);
            toast.error("Kategori silinirken bir sorun oluştu. Lütfen tekrar deneyin.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Kategori Yönetimi</h1>
                <button className={styles.addBtn} onClick={handleAddCategory}>
                    + Yeni Kategori Ekle
                </button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Kategori ID</th>
                            <th>Kategori Adı</th>
                            <th style={{ width: '150px' }}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody style={{ opacity: isLoading ? 0.5 : 1 }}>
                        {categories.length === 0 && !isLoading ? (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>Kategori bulunamadı.</td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id}>
                                    <td style={{ fontSize: '0.85rem', color: '#666' }}>{category.id}</td>
                                    <td style={{ fontWeight: '600' }}>{category.name}</td>
                                    <td className={styles.actions}>
                                        <button className={styles.editBtn} onClick={() => handleEditCategory(category)}>Düzenle</button>
                                        <button className={styles.deleteBtn} onClick={() => handleDeleteCategory(category.id)}>Sil</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Sayfalama Alanı */}
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
            {/* Sayfalama div'inin altında olacak */}
            {isModalOpen && (
                <CategoryModal
                    key={selectedCategory ? selectedCategory.id : 'new'}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    categoryToEdit={selectedCategory}
                    onSuccess={() => setRefreshTrigger(prev => prev + 1)} // Başarılı olursa listeyi yenile
                />
            )}
        </div>
    );
};

export default CategoryManagement;