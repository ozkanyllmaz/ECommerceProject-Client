
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import api from "../services/api"
import Loading from "../components/Loading"

const Profile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    // Sayfa ilk açıldığında çalışır. (kullanıcı bilgilerini getirir.)
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get('/Users/GetLoginUser');

                const { data, isSuccessfull } = response.data;

                if (isSuccessfull && data) {
                    setFormData({
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        email: data.email || '',
                        password: data.password || '',
                    });
                }
            } catch (error) {
                console.error("Profil bilgileri alınırken hata oluştu: ", error);
                //401 veya 403 hataları interceptor tarafından yakalanıp yönetilecektir.
            } finally {
                setIsLoading(false);
            }
        }
        fetchUserProfile();
    }, []);

    // From alanındaki değişiklikleri state'e yansıtan fonksiyon
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Profil güncelleme işlemi
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.firstName || !formData.lastName || !formData.email) {
            toast.warn('Lütfen tüm alanları doldurunuz.');
            return;
        }

        setIsUpdating(false);

        try {
            const response = await api.put('/Users/UpdateUser', formData);
            const { isSuccessfull, message } = response.data;

            if (isSuccessfull) {
                toast.success(message || 'Profil bilgileriniz başarıyla güncellendi');

                
                
            } else {
                toast.error(message || 'Profil bilgileri güncellenemedi.');
                setIsUpdating(false)
            }
        } catch (error) {
            console.error("Profil bilgileri güncellenirken bir hata oluştu: ", error);
            setIsUpdating(false)
        } 
    };

    if(isLoading){
        return <Loading />;
    }


    return (
        <div className="page-container">
            <div className="page-card">
                <h2>Profil Bilgileri</h2>
                <hr className="divider" />
                <form onSubmit={handleSubmit} className="profile-form">

                    <div className="form-group">
                        <div className="label-row">
                            <div className="input-column">
                                <label htmlFor="firstName">Ad</label>
                                <input 
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    disabled={isUpdating}
                                />
                            </div>

                            <div className="input-column">
                                <label htmlFor="lastName">Soyad</label>
                                <input 
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    disabled={isUpdating}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">E-Posta</label>
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={true}
                            className="disabled-input"
                        />
                        <smal className="form-text text-muted">E-Posta adresinizi değiştirmek için sistem yöneticiniz ile iletişime geçiniz.</smal>
                    </div>

                    <button type="submit" className="btn-primary" disabled={isUpdating}>
                        {isUpdating ? 'Güncelleniyor' : 'Bilgileri Kaydet'}
                    </button>
                </form>

            </div>

        </div>
    )
}

export default Profile