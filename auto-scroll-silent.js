// Auto Scroll Silent - Tự động cuộn trang chậm (chạy ngầm hoàn toàn, không có UI)
(function () {
    // Cấu hình
    const config = {
        scrollSpeed: 0.8,        // Tốc độ cuộn (pixel/frame) - càng nhỏ càng chậm
        pauseDuration: 3000,     // Thời gian dừng khi user tương tác (ms)
        startDelay: 2000,        // Delay trước khi bắt đầu auto scroll (ms)
        smoothness: true,        // Cuộn mượt mà
        stopAtBottom: true,      // Dừng khi đến cuối trang và cuộn ngược
        resumeAfterPause: true   // Tiếp tục sau khi user ngừng tương tác
    };

    // Biến trạng thái
    let isAutoScrolling = false;
    let scrollInterval = null;
    let pauseTimeout = null;
    let userInteracted = false;
    let scrollDirection = 'down';

    // Kiểm tra đã đến cuối trang
    function isAtBottom() {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const clientHeight = window.innerHeight;
        return scrollTop + clientHeight >= scrollHeight - 50; // 50px buffer
    }

    // Kiểm tra đã ở đầu trang
    function isAtTop() {
        return window.pageYOffset <= 50;
    }

    // Hàm cuộn trang
    function performScroll() {
        if (!isAutoScrolling || userInteracted) return;

        // Kiểm tra vị trí và đổi hướng nếu cần
        if (config.stopAtBottom && isAtBottom()) {
            scrollDirection = 'up';
        } else if (isAtTop()) {
            scrollDirection = 'down';
        }

        // Thực hiện cuộn
        const scrollAmount = scrollDirection === 'down' ? config.scrollSpeed : -config.scrollSpeed;

        if (config.smoothness) {
            window.scrollBy({
                top: scrollAmount,
                behavior: 'instant' // Dùng instant vì chúng ta đã control speed
            });
        } else {
            window.scrollBy(0, scrollAmount);
        }
    }

    // Bắt đầu auto scroll
    function startAutoScroll() {
        if (isAutoScrolling) return;

        isAutoScrolling = true;
        userInteracted = false;

        // Bắt đầu scroll với requestAnimationFrame cho smooth
        function scrollLoop() {
            if (!isAutoScrolling) return;
            performScroll();
            scrollInterval = requestAnimationFrame(scrollLoop);
        }

        scrollLoop();
        console.log('Auto scroll started (silent mode)');
    }

    // Dừng auto scroll
    function stopAutoScroll(temporary = false) {
        isAutoScrolling = false;

        if (scrollInterval) {
            cancelAnimationFrame(scrollInterval);
            scrollInterval = null;
        }

        if (!temporary) {
            console.log('Auto scroll stopped');
        }
    }

    // Toggle auto scroll
    function toggleAutoScroll() {
        if (isAutoScrolling) {
            stopAutoScroll(false);
        } else {
            startAutoScroll();
        }
    }

    // Xử lý khi user tương tác
    function handleUserInteraction() {
        // Chỉ xử lý khi đang auto scroll
        if (!isAutoScrolling) return;

        userInteracted = true;
        stopAutoScroll(true);

        // Clear timeout cũ
        if (pauseTimeout) {
            clearTimeout(pauseTimeout);
        }

        // Resume sau một khoảng thời gian nếu được config
        if (config.resumeAfterPause) {
            pauseTimeout = setTimeout(() => {
                userInteracted = false;
                startAutoScroll();
            }, config.pauseDuration);
        }
    }

    // Khởi tạo
    function init() {
        // Đợi modal welcome đóng
        const checkModalClosed = setInterval(() => {
            const modal = document.getElementById('welcome-modal');
            if (!modal || modal.style.display === 'none') {
                clearInterval(checkModalClosed);

                // Bắt đầu auto scroll sau delay
                setTimeout(() => {
                    startAutoScroll();
                }, config.startDelay);
            }
        }, 100);

        // Lắng nghe các sự kiện user interaction

        // Scroll event
        window.addEventListener('wheel', handleUserInteraction, { passive: true });

        // Touch events cho mobile
        window.addEventListener('touchstart', handleUserInteraction, { passive: true });

        // Keyboard events
        window.addEventListener('keydown', (e) => {
            // Các phím liên quan đến scroll
            const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
            if (scrollKeys.includes(e.key)) {
                handleUserInteraction();
            }
        });

        // Mouse click events (cho scrollbar)
        document.addEventListener('mousedown', (e) => {
            // Kiểm tra nếu click vào scrollbar
            if (e.clientX >= document.documentElement.clientWidth - 20) {
                handleUserInteraction();
            }
        });

        // Keyboard shortcut để toggle (phím S) - tùy chọn ẩn
        document.addEventListener('keypress', (e) => {
            if (e.key === 's' || e.key === 'S') {
                toggleAutoScroll();
            }
        });
    }

    // Chờ DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// Silent mode - chỉ log minimal
console.log('Auto Scroll Silent Mode loaded. Press S to toggle on/off.');
