// Configuration file cho môi trường development và production
const config = {
    // Thay đổi BASE_URL tùy theo môi trường
    // Development (local): ""
    // Production (Mắt Bão): "https://your-domain.matbao.net" hoặc domain thực tế của bạn
    BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? "" 
        : "https://n8n.zenstores.com.vn/", // Thay bằng domain thực tế từ Mắt Bão
    
    // Đường dẫn tới thư mục chứa ảnh
    IMAGE_PATH: "/wp-content/pic/",
    THEME_PATH: "/wp-content/themes/",
};

// Hàm helper để lấy đường dẫn đầy đủ cho ảnh
function getImageUrl(imageName) {
    // Nếu là URL đầy đủ (bắt đầu với http/https), trả về nguyên bản
    if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
        return imageName;
    }
    
    // Nếu bắt đầu với /, loại bỏ để tránh duplicate
    if (imageName.startsWith('/')) {
        imageName = imageName.substring(1);
    }
    
    // Nếu đã có wp-content trong đường dẫn
    if (imageName.includes('wp-content')) {
        return config.BASE_URL + '/' + imageName;
    }
    
    // Ngược lại, thêm IMAGE_PATH
    return config.BASE_URL + config.IMAGE_PATH + imageName;
}

// Export cho các file khác sử dụng
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { config, getImageUrl };
}
