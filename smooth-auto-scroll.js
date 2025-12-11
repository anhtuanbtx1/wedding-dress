// Smooth Auto Scroll - v3 Final
(function () {
    'use strict';

    console.log('🎬 Auto Scroll Slow Motion v3 Ready (Waiting for signal)...');

    // Cấu hình
    const CONFIG = {
        speed: 0.8,
        pauseTime: 2500,      // Dừng 2.5s khi user tương tác
        loopAtEnd: true,
        touchThreshold: 5
    };

    let isScrolling = false;
    let animationId = null;
    let pauseTimeout = null;

    // Kiểm tra đã đến cuối trang
    function isAtBottom() {
        return (window.innerHeight + window.pageYOffset) >= document.documentElement.scrollHeight - 50;
    }

    // Hàm cuộn chính
    function performScroll() {
        if (!isScrolling) return;

        // Logic lặp lại khi đến cuối
        if (isAtBottom() && CONFIG.loopAtEnd) {
            console.log('🔄 Reached bottom, looping...');
            isScrolling = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => startScroll(), 2000);
            return;
        }

        // Scroll từng chút một
        window.scrollBy(0, CONFIG.speed);
        animationId = requestAnimationFrame(performScroll);
    }

    // Bắt đầu scroll
    function startScroll() {
        if (isScrolling) return;
        isScrolling = true;
        console.log('▶️ Auto scroll running...');

        // Trigger Audio nếu chưa bật (dự phòng)
        const audio = document.getElementById('audio');
        if (audio && audio.paused) {
            audio.play().catch(() => { });
        }

        if (animationId) cancelAnimationFrame(animationId);
        performScroll();
    }

    // Dừng scroll
    function stopScroll() {
        isScrolling = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    // Xử lý interaction thông minh
    function handleUserScroll(e) {
        if (!isScrolling) return;

        // Bỏ qua wheel/touch nhỏ (rung tay)
        if (e.type === 'wheel' && Math.abs(e.deltaY) < 1.5) return;

        // Nếu user scroll -> Dừng tạm thời
        console.log('👆 User interaction, pausing...');
        stopScroll();

        if (pauseTimeout) clearTimeout(pauseTimeout);

        // Resume sau thời gian nghỉ
        pauseTimeout = setTimeout(() => {
            console.log('▶️ Auto-resuming...');
            startScroll();
        }, CONFIG.pauseTime);
    }

    // Init
    function init() {
        console.log(`⏳ Auto scroll initialized. Waiting for manual start.`);

        // QUAN TRỌNG: KHÔNG GỌI startScroll() Ở ĐÂY NỮA
        // setTimeout(startScroll, 2000); <--- Đã bỏ dòng này

        // Listeners
        window.addEventListener('wheel', handleUserScroll, { passive: true });
        window.addEventListener('touchmove', handleUserScroll, { passive: true });

        // Phím S để toggle (cho debug)
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 's') {
                isScrolling ? stopScroll() : startScroll();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export ra ngoài để nút HTML gọi được
    window.autoScroll = { start: startScroll, stop: stopScroll };
})();
