import { useNavigate } from "react-router-dom"

const UnAuthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="unauthorized-container">
            <div className="unauthorized-content">
                <h1 className="error-code">403</h1>
                <h2 className="error-title">Yetkisiz Erişim</h2>
                <p className="error-message">Bu sayfayı görüntülemek veya ilgili işlemi gerçekleştirmek için gerekli sistem izinlerine sahip değilsiniz.
                    Erişim yetkiniz ile ilgili bir hata olduğunu düşünüyorsanız, lütfen sistem yöneticiniz ile iletişime geçiniz.</p>
                
                <div className="action-buttons">
                    <button onClick={() => navigate(-1)} className="btn-outline">Önceki Sayfaya Dön</button>
                    <button onClick={() => navigate('/')} className="btn-primary">Ana Sayfaya Dön</button>
                </div>
            </div> 
        </div>
    )
}

export default UnAuthorized