window.addEventListener('beforeunload', function () { window.scrollTo(0, 0); });
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', function () {

    // === STICKY MENU ===
    var header = document.getElementById('header');
    var menu = document.getElementById('menu');
    var lastScrollY = 0;

    window.addEventListener('scroll', function () {
        var y = window.scrollY;
        if (menu) {
            menu.classList.toggle('menu-sticky', y > header.offsetHeight);
            if (y > 300) {
                menu.classList.toggle('menu-hidden', y > lastScrollY);
            } else {
                menu.classList.remove('menu-hidden');
            }
        }
        lastScrollY = y;
    }, { passive: true });


    // === HÀM SCROLL REVEAL DÙNG CHUNG ===
    function scrollReveal(selector, effect, options) {
        var items = document.querySelectorAll(selector);
        if (!items.length) return;

        var cfg = Object.assign({ threshold: 0.1, stagger: 0, once: true }, options);

        items.forEach(function (el) {
            if (effect === 'zoom') {
                el.style.opacity = '0';
                el.style.transform = 'scale(0.5)';
            } else if (effect === 'fade-up') {
                el.style.opacity = '0';
                el.style.transform = 'translateY(40px)';
            }
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });

        var container = cfg.container ? document.querySelector(cfg.container) : null;
        var target = container || items[0].parentElement;

        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    items.forEach(function (el, i) {
                        setTimeout(function () {
                            el.style.opacity = '1';
                            el.style.transform = 'scale(1) translateY(0)';
                        }, cfg.stagger * i);
                    });
                    if (cfg.once) obs.unobserve(target);
                }
            });
        }, { threshold: cfg.threshold });

        obs.observe(target);
    }


    // === CAROUSEL CHƯƠNG TRÌNH (nút trái/phải) ===
    var slideContainer = document.querySelector('.danh-sach-chuong-trinh');
    var btnTrai = document.querySelector('.nut-slide.trai');
    var btnPhai = document.querySelector('.nut-slide.phai');

    if (slideContainer && btnTrai && btnPhai) {
        var getSlideWidth = function () {
            var s = slideContainer.querySelector('.chuong-trinh');
            return s ? s.offsetWidth + 10 : 300;
        };
        btnPhai.addEventListener('click', function () {
            slideContainer.scrollBy({ left: getSlideWidth(), behavior: 'smooth' });
        });
        btnTrai.addEventListener('click', function () {
            slideContainer.scrollBy({ left: -getSlideWidth(), behavior: 'smooth' });
        });
    }


    // === ZOOM-IN: Chương trình + Đối tác ===
    scrollReveal('.chuong-trinh', 'zoom', { stagger: 200, container: '.slide-chuong-trinh' });
    scrollReveal('.dt-o', 'zoom', { stagger: 80, container: '#doi-tac' });


    // === TIN NHỎ (auto-scroll dọc) ===
    var tinNhoList = document.getElementById('danhSachTinNho');
    var tinNhoPrev = document.querySelector('.tin-nho-prev');
    var tinNhoNext = document.querySelector('.tin-nho-next');

    if (tinNhoList && tinNhoPrev && tinNhoNext) {
        tinNhoList.style.overflowY = 'hidden';
        var getH = function () {
            var f = tinNhoList.querySelector('.tin-nho');
            return f ? f.offsetHeight + 20 : 100;
        };

        tinNhoNext.addEventListener('click', function () { tinNhoList.scrollBy({ top: getH(), behavior: 'smooth' }); });
        tinNhoPrev.addEventListener('click', function () { tinNhoList.scrollBy({ top: -getH(), behavior: 'smooth' }); });

        function autoScroll() {
            var max = tinNhoList.scrollHeight - tinNhoList.clientHeight;
            if (tinNhoList.scrollTop >= max - 5) {
                tinNhoList.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                tinNhoList.scrollBy({ top: getH(), behavior: 'smooth' });
            }
        }
        var autoTimer = setInterval(autoScroll, 3000);
        tinNhoList.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
        tinNhoList.addEventListener('mouseleave', function () { autoTimer = setInterval(autoScroll, 3000); });
    }


    // === SỰ KIỆN CAROUSEL ===
    var skDaView = document.getElementById('skDaView');
    var skPrev = document.querySelector('[data-sk-da-prev]');
    var skNext = document.querySelector('[data-sk-da-next]');

    if (skDaView && skPrev && skNext) {
        var getCardW = function () {
            var c = skDaView.querySelector('.sk-da-card');
            return c ? c.offsetWidth + 18 : 260;
        };
        skNext.addEventListener('click', function () { skDaView.scrollBy({ left: getCardW(), behavior: 'smooth' }); });
        skPrev.addEventListener('click', function () { skDaView.scrollBy({ left: -getCardW(), behavior: 'smooth' }); });
    }


    // === CON SỐ ẤN TƯỢNG (đếm số + hiện lần lượt) ===
    var soElements = document.querySelectorAll('.muc-so .so');
    var conSoSection = document.getElementById('con-so');
    var counterDone = false;

    if (conSoSection && soElements.length) {
        var mucSoItems = document.querySelectorAll('.muc-so');
        mucSoItems.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });

        new IntersectionObserver(function (entries, obs) {
            if (entries[0].isIntersecting && !counterDone) {
                counterDone = true;
                mucSoItems.forEach(function (el, i) {
                    setTimeout(function () {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, 200 + i * 200);
                });
                setTimeout(animateCounters, 400);
                obs.unobserve(conSoSection);
            }
        }, { threshold: 0.3 }).observe(conSoSection);
    }

    function animateCounters() {
        soElements.forEach(function (el) {
            var text = el.textContent.trim();
            var match = text.match(/^([\d,.]+)\s*(.*)$/);
            if (!match) return;
            var num = parseInt(match[1].replace(/[.,]/g, ''), 10);
            var suffix = match[2] || '';
            var start = performance.now();

            (function tick(now) {
                var p = Math.min((now - start) / 2000, 1);
                var eased = 1 - Math.pow(1 - p, 3);
                var cur = Math.floor(eased * num);
                el.textContent = (num >= 1000 ? (cur >= num ? num / 1000 : (cur / 1000).toFixed(0)) + 'k' : (cur >= num ? num : cur)) + suffix;
                if (p < 1) requestAnimationFrame(tick);
            })(start);
        });
    }


    // === NÚT SCROLL TO TOP ===
    var scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scroll-to-top';
    scrollTopBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', function () {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });


    // === FADE-UP: Các section chung ===
    ['.tieu-de-gt', '.thanh-lap', '.hop-mo-ta', '.cac-nut',
     '.anh-toa-nha', '.anh-nen-thanh-pho', '.tieu-de-phan',
     '.tin-lon', '.danh-sach-tin-nho-wrap', '.tieu-de-con-so',
     '.sk-tieu-de', '.sk-noi-bat', '.dt-tieu-de',
     '.tv-dau', '.tv-form-hop', '.tv-hero-anh'
    ].forEach(function (sel) { scrollReveal(sel, 'fade-up'); });

    scrollReveal('.sk-da-card', 'fade-up', { stagger: 200 });


    // === NÚT TREO (flip-left khi scroll tới) ===
    var nutTreoContainer = document.querySelector('.danh-sach-nut-treo');
    if (nutTreoContainer) {
        new IntersectionObserver(function (entries, obs) {
            if (entries[0].isIntersecting) {
                nutTreoContainer.querySelectorAll('.nut-treo-xanh, .nut-treo-do').forEach(function (n) {
                    n.classList.add('treo-visible');
                });
                obs.unobserve(nutTreoContainer);
            }
        }, { threshold: 0.3 }).observe(nutTreoContainer);
    }


    // === HÌNH SINH VIÊN (slide từ trái qua) ===
    var svWrap = document.querySelector('.tv-anh-sv-wrap');
    if (svWrap) {
        svWrap.classList.add('sv-hidden');
        new IntersectionObserver(function (entries, obs) {
            if (entries[0].isIntersecting) {
                svWrap.classList.replace('sv-hidden', 'sv-slide-in');
                obs.unobserve(svWrap);
            }
        }, { threshold: 0.2 }).observe(svWrap);
    }


    // === MASCOT NHÚN NHẢY ===
    var mascot = document.querySelector('.mascot.img-ab .in img');
    if (mascot) mascot.style.animation = 'mascotBounce 2s ease-in-out infinite';


    // === SEARCH FOCUS ===
    var searchInput = document.querySelector('.thanh-tim-kiem input');
    var searchBox = document.querySelector('.thanh-tim-kiem');
    if (searchInput && searchBox) {
        searchInput.addEventListener('focus', function () {
            searchBox.style.borderColor = '#E31B23';
            searchBox.style.boxShadow = '0 0 0 3px rgba(227,27,35,0.15)';
        });
        searchInput.addEventListener('blur', function () {
            searchBox.style.borderColor = '#CCC';
            searchBox.style.boxShadow = 'none';
        });
    }


    // === FORM TƯ VẤN ===
    var tuVanForm = document.querySelector('.tv-form');
    if (tuVanForm) {
        tuVanForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var fields = [
                { el: document.getElementById('tv-ten'), msg: 'Vui lòng nhập họ và tên' },
                { el: document.getElementById('tv-sdt'), msg: 'Vui lòng nhập số điện thoại', regex: /^0[0-9]{9,10}$/ },
                { el: document.getElementById('tv-email'), msg: 'Vui lòng nhập email', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
                { el: document.getElementById('tv-note'), msg: 'Vui lòng nhập nội dung' }
            ];
            var ok = true;
            document.querySelectorAll('.tv-error').forEach(function (e) { e.remove(); });

            fields.forEach(function (f) {
                if (!f.el) return;
                var v = f.el.value.trim();
                if (!v || (f.regex && !f.regex.test(v))) {
                    ok = false;
                    var err = document.createElement('span');
                    err.className = 'tv-error';
                    err.textContent = f.msg;
                    err.style.cssText = 'color:#E31B23;font-size:12px';
                    f.el.closest('.tv-field').appendChild(err);
                }
            });

            if (ok) {
                var btn = tuVanForm.querySelector('.tv-nut-gui');
                btn.textContent = 'Đang gửi...';
                btn.disabled = true;
                setTimeout(function () {
                    btn.textContent = '✓ Gửi thành công!';
                    btn.style.backgroundColor = '#28a745';
                    setTimeout(function () {
                        btn.textContent = 'Gửi thông tin';
                        btn.style.backgroundColor = '';
                        btn.disabled = false;
                        tuVanForm.reset();
                    }, 2500);
                }, 1500);
            }
        });
    }


    // === SMOOTH SCROLL ANCHOR ===
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var id = this.getAttribute('href');
            if (id === '#') return;
            var t = document.querySelector(id);
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

});
