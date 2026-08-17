import { useState, useEffect } from 'react';
import styles from './ProductModal.module.css';
import api from '../../../services/api';
import { toast } from 'react-toastify';

const ProductModal = ({ isOpen, onClose, productToEdit, onSuccess }) => {
    const [name, setName] = useState(productToEdit?.name || '');
    const [description, setDescription] = useState(productToEdit?.description || '');
    const [price, setPrice] = useState(productToEdit?.price || '');
    const [stock, setStock] = useState(productToEdit?.stock || '');
    const [imageUrl, setImageUrl] = useState(productToEdit?.imageUrl || '');
    
    // YENİ: Kategori ID'si ve Kategoriler Listesi için State'ler
    const [categoryId, setCategoryId] = useState(productToEdit?.categoryId || '');
    const [categories, setCategories] = useState([]);
    
    const [isSaving, setIsSaving] = useState(false);

    // YENİ: Modal açıldığında kategorileri backend'den çekiyoruz
    useEffect(() => {
        if (isOpen) {
            const fetchCategories = async () => {
                try {
                    // Tüm kategorileri getirmek için yüksek bir PageSize veriyoruz (Örn: 100)
                    const response = await api.get('/Categories/ListCategory?paginationParameter.PageNumber=1&paginationParameter.PageSize=100');
                    if (response.data && response.data.isSuccessfull) {
                        setCategories(response.data.data.data); // İç içe data yapınızdan dolayı
                    }
                } catch (error) {
                    console.error("Kategoriler çekilirken hata:", error);
                    toast.error("Kategoriler yüklenemedi.");
                }
            };
            fetchCategories();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Kategori seçimini de zorunlu kılıyoruz
        if (!name || !price || !stock || !categoryId) {
            toast.warning("Lütfen zorunlu alanları (Ad, Kategori, Fiyat, Stok) doldurun.");
            return;
        }

        setIsSaving(true);
        try {
            // YENİ: payload içine categoryId eklendi
            if (productToEdit) {
                const payload = { 
                    id: productToEdit.id, 
                    name, 
                    description, 
                    price: Number(price), 
                    stock: Number(stock), 
                    imageUrl,
                    categoryId 
                };
                const response = await api.put('/Products/UpdateProduct', payload);
                if (response.data && response.data.isSuccessfull) {
                    toast.success("Ürün başarıyla güncellendi.");
                    onSuccess();
                    onClose();
                }
            } else {
                const payload = { 
                    name, 
                    description, 
                    price: Number(price), 
                    stock: Number(stock), 
                    imageUrl,
                    categoryId 
                };
                const response = await api.post('/Products/CreateProduct', payload);
                if (response.data && response.data.isSuccessfull) {
                    toast.success("Yeni ürün başarıyla eklendi.");
                    onSuccess();
                    onClose();
                }
            }
        } catch (error) {
            console.error("Ürün kaydedilirken hata:", error);
            toast.error("İşlem sırasında bir sorun oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>{productToEdit ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h2>
                    <button className={styles.closeBtn} onClick={onClose} disabled={isSaving}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.modalBody}>
                        
                        {/* YENİ: Kategori Seçim Alanı */}
                        <div className={styles.formGroup}>
                            <label>Kategori *</label>
                            <select 
                                className={styles.formInput} 
                                value={categoryId} 
                                onChange={(e) => setCategoryId(e.target.value)} 
                                required
                            >
                                <option value="" disabled>Lütfen Kategori Seçin</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Ürün Adı *</label>
                            <input type="text" className={styles.formInput} value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Açıklama</label>
                            <textarea className={styles.formInput} value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Fiyat (TL) *</label>
                                <input type="number" step="0.01" className={styles.formInput} value={price} onChange={(e) => setPrice(e.target.value)} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Stok Adedi *</label>
                                <input type="number" className={styles.formInput} value={stock} onChange={(e) => setStock(e.target.value)} required />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Görsel URL</label>
                            <input type="text" className={styles.formInput} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
                        </div>
                    </div>
                    
                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>İptal</button>
                        <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;