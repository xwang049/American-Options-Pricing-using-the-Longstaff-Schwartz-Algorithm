document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // 1. 名字滚动切换 (保持原样)
    // =================================================================
    const nameContainer = document.getElementById('name-container');
    if (nameContainer) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 120) {
                nameContainer.classList.add('switched');
            } else {
                nameContainer.classList.remove('switched');
            }
        });
    }

    // =================================================================
    // 2. 真实世界地图 (保持原样)
    // =================================================================
    const mapElement = document.getElementById('migration-map');
    if (mapElement && typeof L !== 'undefined') {
        const coords = [
            [41.80, 126.91], // 临江
            [43.81, 125.32], // 长春
            [1.35, 103.81]   // 新加坡
        ];

        const map = L.map('migration-map', {
            center: [30, 115], 
            zoom: 3,
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: false
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
        }).addTo(map);

        coords.forEach(coord => {
            L.circleMarker(coord, {
                color: '#2563eb', 
                fillColor: '#2563eb',
                fillOpacity: 0.8,
                radius: 6
            }).addTo(map);
        });

        L.polyline(coords, {
            color: '#00f2ff', 
            weight: 2,
            opacity: 0.8,
            smoothFactor: 1
        }).addTo(map);
    }

    // =================================================================
    // 3. 项目展示 (配置了 data.xiaoni.xyz)
    // =================================================================
    
    // 定义数据
    const projects = [
        {
            title: "TRADING_DASHBOARD",
            status: "DEVELOPING", 
            desc: "Real-time PnL & Risk monitoring dashboard using Python/Dash. Integrated with internal pricing engine.",
            
            // --- 核心修改在这里 ---
            isDoubleEntry: true,
            repoLink: "https://github.com/xwang049/trading-dashboard", // 你的代码库地址(假设)
            executeLink: "http://data.xiaoni.xyz" // 你的 Dashboard 地址
        },
        {
            title: "XIAONI_PORTFOLIO",
            status: "SYSTEM NODE",
            desc: "The current responsive web portfolio. Built with raw HTML/CSS/JS focusing on industrial aesthetics.",
            repoLink: "https://github.com/xwang049/xiaoni-portfolio"
        },
        {
            title: "AMERICAN_OPTIONS_PRICING",
            status: "STABLE",
            desc: "Implemented Binomial Tree and Black-Scholes models for option pricing logic verification.",
            repoLink: "https://github.com/xwang049" // 如果没有特定repo，指向主页
        },
        {
            title: "JAPAN_SND_REGRESSION",
            status: "SYSTEM NODE",
            desc: "A Streamlit App for Japan Import LNG Supply and Demand Model - Multivariable linear regression.",
            repoLink: "https://github.com/xwang049"
        },
        {
            title: "ALPHA_CHALLENGE",
            status: "SYSTEM NODE",
            desc: "Quant algorithm backtesting framework focused on intraday signals and transaction cost analysis.",
            repoLink: "https://github.com/xwang049"
        },
        {
            title: "QARB",
            status: "SYSTEM NODE",
            desc: "A Framework for Data-Driven Mathematical Modeling & Scalable Computation (Statistical Arbitrage).",
            repoLink: "https://github.com/xwang049"
        },
        {
            title: "DRYBULK",
            status: "SYSTEM NODE",
            desc: "Analysis of Baltic Dry Index correlation with major commodity flows using Pandas & Seaborn.",
            repoLink: "https://github.com/xwang049"
        },
        {
            title: "PROJ2_PYOPENCL_BINANCE",
            status: "SYSTEM NODE",
            desc: "High-performance crypto market data processing using PyOpenCL for parallel computing.",
            repoLink: "https://github.com/xwang049"
        }
    ];

    // 分页初始化
    let currentPage = 1;
    let itemsPerPage = 4;

    // 响应式计算
    function calculateItemsPerPage() {
        if (window.innerWidth > 1200) {
            return 6;
        }
        return 4;
    }

    itemsPerPage = calculateItemsPerPage();

    window.addEventListener('resize', () => {
        const newItemsPerPage = calculateItemsPerPage();
        if (newItemsPerPage !== itemsPerPage) {
            itemsPerPage = newItemsPerPage;
            currentPage = 1; 
            renderProjects();
        }
    });

    // 渲染函数
    function renderProjects() {
        const grid = document.getElementById('repo-grid');
        if (!grid) return;

        grid.innerHTML = ''; 

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = projects.slice(startIndex, endIndex);

        pageItems.forEach(proj => {
            // 1. Tag 逻辑
            let tagHtml = '';
            if (proj.status === 'DEVELOPING') {
                tagHtml = `<span class="status-tag-sm developing" style="color:#00c853; border:1px solid #00c853; padding:2px 6px; font-size:10px; font-weight:bold; background:rgba(0,200,83,0.05); margin-left:10px; font-family:'JetBrains Mono';">● ${proj.status}</span>`;
            }

            // 2. 底部链接逻辑 (修复版)
            // 左边永远是 REPO，指向 proj.repoLink
            const footerLeft = `<span class="footer-link" onclick="window.open('${proj.repoLink}', '_blank')" style="cursor:pointer; transition:color 0.2s;">// REPO</span>`;
            
            // 右边根据是否双入口决定
            let footerRight = `<span></span>`; // 默认为空
            
            if (proj.isDoubleEntry) {
                // 如果是 Dashboard，右边显示 EXECUTE 并指向 data.xiaoni.xyz
                footerRight = `<span class="highlight-link" onclick="window.open('${proj.executeLink}', '_blank')" style="color:#000; font-weight:900; text-decoration:underline; cursor:pointer;">>> EXECUTE</span>`;
            }

            // 3. 生成 HTML
            const cardHTML = `
                <div class="repo-card" style="margin-bottom:0;">
                    <div class="repo-main">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                            <span class="repo-name">${proj.title}</span>
                            ${tagHtml}
                        </div>
                        <p class="repo-desc">${proj.desc}</p>
                    </div>
                    <div class="repo-footer">
                        <span class="repo-lang" style="width:100%; display:flex; justify-content:space-between; align-items:center;">
                            ${footerLeft}
                            ${footerRight}
                        </span>
                    </div>
                </div>
            `;
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cardHTML;
            grid.appendChild(tempDiv.firstElementChild);
        });

        updateControls();
    }

    function updateControls() {
        const totalPages = Math.ceil(projects.length / itemsPerPage) || 1;
        const indicator = document.getElementById('pageIndicator');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (indicator) indicator.innerText = `PAGE ${currentPage} / ${totalPages}`;
        
        if (prevBtn) {
            prevBtn.disabled = currentPage === 1;
            prevBtn.style.opacity = currentPage === 1 ? '0.3' : '1';
        }
        if (nextBtn) {
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.style.opacity = currentPage === totalPages ? '0.3' : '1';
        }
    }

    window.changePage = function(direction) {
        const totalPages = Math.ceil(projects.length / itemsPerPage);
        const newPage = currentPage + direction;

        if (newPage >= 1 && newPage <= totalPages) {
            currentPage = newPage;
            renderProjects();
        }
    }

    renderProjects();
});