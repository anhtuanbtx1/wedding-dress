// Script để fix đường dẫn ảnh trong index.html
// Chạy script này để tự động cập nhật tất cả đường dẫn ảnh

document.addEventListener('DOMContentLoaded', function() {
    // Lấy base URL từ config hoặc tự động detect
    const getBaseUrl = () => {
        // Nếu đang ở local
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return '';
        }
        // Nếu đang ở production, lấy protocol + hostname
        return window.location.protocol + '//' + window.location.hostname;
    };

    const BASE_URL = getBaseUrl();

    // Fix cho tất cả thẻ img với src hoặc data-src
    const fixImagePaths = () => {
        // Fix img tags với src
        const images = document.querySelectorAll('img[src]');
        images.forEach(img => {
            let src = img.getAttribute('src');
            if (src && !src.startsWith('http') && !src.startsWith('//')) {
                // Nếu src bắt đầu với /, loại bỏ nó
                if (src.startsWith('/')) {
                    src = src.substring(1);
                }
                img.setAttribute('src', BASE_URL + '/' + src);
            }
        });

        // Fix img tags với data-src (lazy loading)
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            let dataSrc = img.getAttribute('data-src');
            if (dataSrc && !dataSrc.startsWith('http') && !dataSrc.startsWith('//')) {
                // Nếu data-src bắt đầu với /, loại bỏ nó
                if (dataSrc.startsWith('/')) {
                    dataSrc = dataSrc.substring(1);
                }
                img.setAttribute('data-src', BASE_URL + '/' + dataSrc);
            }
        });

        // Fix background images trong data-bg attributes
        const bgElements = document.querySelectorAll('[data-bg]');
        bgElements.forEach(el => {
            let bgUrl = el.getAttribute('data-bg');
            if (bgUrl && !bgUrl.startsWith('http') && !bgUrl.startsWith('//')) {
                if (bgUrl.startsWith('/')) {
                    bgUrl = bgUrl.substring(1);
                }
                el.setAttribute('data-bg', BASE_URL + '/' + bgUrl);
            }
        });

        // Fix link tags (favicon, apple-touch-icon)
        const links = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
        links.forEach(link => {
            let href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('//')) {
                if (href.startsWith('/')) {
                    href = href.substring(1);
                }
                link.setAttribute('href', BASE_URL + '/' + href);
            }
        });

        // Fix meta tags
        const metaTags = document.querySelectorAll('meta[content*="wp-content/pic/"]');
        metaTags.forEach(meta => {
            let content = meta.getAttribute('content');
            if (content && !content.startsWith('http') && !content.startsWith('//')) {
                if (content.startsWith('/')) {
                    content = content.substring(1);
                }
                meta.setAttribute('content', BASE_URL + '/' + content);
            }
        });

        // Fix preload resources trong array
        if (typeof resources !== 'undefined' && Array.isArray(resources)) {
            for (let i = 0; i < resources.length; i++) {
                if (!resources[i].startsWith('http') && !resources[i].startsWith('//')) {
                    if (resources[i].startsWith('/')) {
                        resources[i] = resources[i].substring(1);
                    }
                    resources[i] = BASE_URL + '/' + resources[i];
                }
            }
        }
    };

    // Chạy fix ngay khi DOM ready
    fixImagePaths();

    // Chạy lại khi có lazy load trigger
    document.addEventListener('lazyloaded', fixImagePaths);
    
    // Log để debug
    console.log('Base URL được sử dụng:', BASE_URL);
    console.log('Đã fix đường dẫn ảnh cho hosting');
});
