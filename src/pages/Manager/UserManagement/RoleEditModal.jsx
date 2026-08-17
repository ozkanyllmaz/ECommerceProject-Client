import { useState} from "react";
import styles from './RoleEditModal.module.css';
import { toast } from "react-toastify";
import api from "../../../services/api";

const RoleEditModal = ({ isOpen, onClose, user, allRoles, refreshUsers }) => {
    const [selectedRoleIds, setSelectedRoleIds] = useState(() => {
        if (user && user.userRoles) {
            return user.userRoles.map(r => r.roleId);
        }
        return []; // Kullanıcının rolü yoksa boş dizi
    });

    const [isSaving, setIsSaving] = useState(false);

    // Checkbox'a tıklandığında çalışacak fonksiyon
    const handleCheckboxChange = (roleId) => {
        setSelectedRoleIds(prev => {
            // eğer rol zaten seçiliyse diziden çıkart
            if (prev.includes(roleId)) {
                return prev.filter(id => id !== roleId);
            } else {
                return [...prev, roleId];
            }
        })
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                UserId: user.id,
                RoleIds: selectedRoleIds
            };

            const response = await api.put('/Users/UpdateUserRoles', payload);
            if (response.data && response.data.isSuccessfull) {
                toast.success('Yetkiler başarıyla güncellendi');
                if(refreshUsers) refreshUsers();
                onClose(); 
            }
        } catch (error) {
            toast.error("Yetkiler güncellenirken bir sorun oluştu");
            console.error("Rol güncelleneme hatası: ", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>Yetki Düzenleme</h2>
                    <button className={styles.closeIcon} onClick={onClose} disabled={isSaving}>&times;</button>
                </div>
                
                <div className={styles.modalBody}>
                    <p className={styles.userInfo}>
                        <strong>{user?.firstName} {user?.lastName}</strong> kullanıcısının yetkilerini belirleyin:
                    </p>
                    
                    <div className={styles.rolesList}>
                        {allRoles && allRoles.length > 0 ? (
                            allRoles.map(role => (
                                <label key={role.id} className={styles.checkboxLabel}>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedRoleIds.includes(role.id)}
                                        onChange={() => handleCheckboxChange(role.id)}
                                        className={styles.checkboxInput}
                                        disabled={isSaving}
                                    />
                                    <span className={styles.roleName}>{role.name}</span>
                                </label>
                            ))
                        ) : (
                            <p>Sistemde atanabilir rol bulunamadı.</p>
                        )}
                    </div>
                </div>

                <div className={styles.modalActions}>
                    <button className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>
                        İptal
                    </button>
                    <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Kaydediliyor...' : 'Yetkileri Güncelle'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RoleEditModal