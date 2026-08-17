import { useState } from 'react';
import styles from './CategoryModal.module.css';
import api from '../../../services/api';
import { toast } from 'react-toastify';

const CategoryModal = ({ isOpen, onClose, categoryToEdit, onSuccess }) => {
    const [name, setName] = useState(categoryToEdit ? categoryToEdit.name : '');
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name.trim()) {
            toast.warning("Kategori adı boş bırakılamaz!");
            return;
        }

        setIsSaving(true);
        try {
            if (categoryToEdit) {
                // DÜZENLEME (PUT)
                const payload = { id: categoryToEdit.id, name: name };
                const response = await api.put('/Categories/UpdateCategory', payload);
                if (response.data && response.data.isSuccessfull) {
                    toast.success("Kategori başarıyla güncellendi.");
                    onSuccess(); // Tabloyu yenilemek için tetikle
                    onClose();   // Modalı kapat
                }
            } else {
                // YENİ EKLEME (POST)
                const payload = { name: name };
                const response = await api.post('/Categories/CreateCategory', payload);
                if (response.data && response.data.isSuccessfull) {
                    toast.success("Yeni kategori başarıyla eklendi.");
                    onSuccess(); 
                    onClose();
                }
            }
        } catch (error) {
            console.error("Kategori kaydedilirken hata:", error);
            toast.error("İşlem sırasında bir sorun oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>{categoryToEdit ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}</h2>
                    <button className={styles.closeBtn} onClick={onClose} disabled={isSaving}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.modalBody}>
                        <div className={styles.formGroup}>
                            <label>Kategori Adı</label>
                            <input 
                                type="text" 
                                className={styles.formInput} 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                placeholder="Örn: Elektronik"
                                autoFocus
                            />
                        </div>
                    </div>
                    
                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>
                            İptal
                        </button>
                        <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;