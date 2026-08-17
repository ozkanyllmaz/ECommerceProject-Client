import { useCallback, useEffect, useState } from "react"
import api from "../../../services/api"
import { toast } from "react-toastify"
import styles from './UserManagement.module.css'
import RoleEditModal from "./RoleEditModal"

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState([]);

    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [allRoles, setAllRoles] = useState([]);

    const fetchAllRoles = useCallback(async () => {
        try {
            const response = await api.get('/Role/ListRole');
            if (response.data && response.data.isSuccessfull) {
                setAllRoles(response.data.data);
            }
        } catch (error) {
            console.error("Roller çekilirken hata oluştu: ", error);
        }
    }, []);

    const fetchUserData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/Users/GetAllUsers');

            if (response.data && response.data.isSuccessfull) {
                setUsers(response.data.data);
            }

        } catch (error) {
            console.error("Kullanıcılar çekilirken hata oluştu: ", error);
            toast.error('Kullanıclar çekilirken hata oluştu');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Fonksiyonları doğrudan değil, bir sarmalayıcı (wrapper) içinde çağırıyoruz
        const loadInitialData = async () => {
            fetchAllRoles();
            fetchUserData();
        };

        loadInitialData();
    }, [fetchAllRoles, fetchUserData, status, refreshTrigger]);



    const getRoleBadge = (roleName) => {
        switch (roleName?.toLowerCase()) {
            case 'admin': return styles.roleAdmin;
            case 'manager': return styles.roleManager;
            case 'customer': return styles.roleCustomer;
            default: return styles.roleNone;
        }
    }

    const handleChangeStatus = async (userId, status) => {
        if (status == true) {
            const isConfirmed = window.confirm(`${userId} kullanıcı hesabını askıya almak istediğinize emin misiniz?`);
            if (!isConfirmed) return;
        } else {
            const isConfirmed = window.confirm(`${userId} kullanıcı hesabını aktif etmek istediğinize emin misiniz?`);
            if (!isConfirmed) return;
        }

        try {
            const response = await api.put(`/Users/UpdateStatus?userId=${userId}&status=${status}`);
            if (response.data && response.data.isSuccessfull) {
                setStatus(status);
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            console.error("Kullanıcı güncellenirken bir sorun oluştu: ", error);
            toast.error('Kullanıcı durumu güncellenirken bir sorun oluştu');
        }
    };


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Kullanıcı Yönetimi</h1>
                <span styles={{ color: '#666', fontSize: '0.9rem' }}>
                    Toplam {users.length} Kullanıcı
                </span>

            </div>


            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <th>id</th>
                        <th>Ad</th>
                        <th>Soyad</th>
                        <th>Mail</th>
                        <th>Rol</th>
                        <th>Durum</th>
                        <th>Yetki İşlemleri</th>
                    </thead>
                    <tbody styles={{ opacity: isLoading ? 0.5 : 1 }}>
                        {users.length === 0 && !isLoading ? (
                            <tr colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                                Kullanıcı Bulunamadı
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td className={styles.userId} key={user.id}>{user.id}</td>
                                    <td className={styles.userName}>{user.firstName}</td>
                                    <td className={styles.userName}>{user.lastName}</td>
                                    <td className={styles.userEmail}>{user.email}</td>
                                    <td>
                                        <div className={styles.roleContainer}>
                                            {user.userRoles && user.userRoles.length > 0 ? (
                                                user.userRoles.map((role, roleId) => (
                                                    <span key={roleId} className={`${styles.badge} ${getRoleBadge(role.roleName)}`}>
                                                        {role.roleName}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className={`${styles.badge} ${styles.roleNone}`}>Yetki yok</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        {user.userRoles !== 'Admin' ? (
                                            <button
                                                className={`${styles.badge} ${user.status ? styles.statusActive : styles.statusPassive}`}
                                                onClick={() => handleChangeStatus(user.id, !status)}
                                                onSuccess={() => setRefreshTrigger(prev => prev + 1)}
                                            >
                                                {user.status ? 'Aktif' : 'Pasif'}
                                            </button>
                                        ) : (
                                            <button
                                                className={`${styles.badge} ${user.status ? styles.statusActive : styles.statusPassive}`}
                                                disabled={true}
                                            >
                                                {user.status ? 'Aktif' : 'Pasif'}
                                            </button>
                                        )}

                                    </td>
                                    <td>
                                        <button
                                            className={styles.editBtn}
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setIsRoleModalOpen(true);
                                            }}
                                        >
                                            Düzenle
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}

                    </tbody>
                </table>
            </div>
            {isRoleModalOpen && (
                <RoleEditModal
                    isOpen={isRoleModalOpen}
                    onClose={() => setIsRoleModalOpen(false)}
                    user={selectedUser}
                    allRoles={allRoles}
                    refreshUsers={fetchUserData} // tabloyu yenilemek için
                />
            )}
        </div>
    )
}

export default UserManagement