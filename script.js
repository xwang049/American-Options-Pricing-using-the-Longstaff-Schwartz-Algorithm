document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. 名字滚动切换
    // ----------------------------------------------------
    const nameContainer = document.getElementById('name-container');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 120) {
            nameContainer.classList.add('switched');
        } else {
            nameContainer.classList.remove('switched');
        }
    });

    // ----------------------------------------------------
    // 2. 真实世界地图 (Leaflet.js)
    // ----------------------------------------------------
    // 坐标: 临江, 长春, 新加坡
    const coords = [
        [41.80, 126.91], // 临江
        [43.81, 125.32], // 长春
        [1.35, 103.81]   // 新加坡
    ];

    // 初始化地图，禁用缩放控件保持极简
    const map = L.map('migration-map', {
        center: [30, 115], 
        zoom: 3,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false
    });

    // 加载暗黑底图 (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(map);

    // 添加自定义圆形标记
    coords.forEach(coord => {
        L.circleMarker(coord, {
            color: '#2563eb', // 蓝色光圈
            fillColor: '#2563eb',
            fillOpacity: 0.8,
            radius: 6
        }).addTo(map);
    });

    // 绘制连接线 (CSS中已添加流动动画)
    L.polyline(coords, {
        color: '#00f2ff', // 霓虹青色线条
        weight: 2,
        opacity: 0.8,
        smoothFactor: 1
    }).addTo(map);

    // ----------------------------------------------------
    // 3. GitHub API
    // ----------------------------------------------------
    const GITHUB_USERNAME = 'xwang049';
    const repoGrid = document.getElementById('repo-grid');

    async function fetchRepos() {
        try {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`);
            if (!response.ok) throw new Error();
            const repos = await response.json();
            renderRepos(repos.filter(repo => !repo.fork));
        } catch (e) {
            repoGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#999;">API_OFFLINE</div>`;
        }
    }

    function renderRepos(repos) {
        repoGrid.innerHTML = ''; 
        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'repo-card';
            card.onclick = () => window.open(repo.html_url, '_blank');
            const stars = repo.stargazers_count > 0 ? `<span>STARS: ${repo.stargazers_count}</span>` : '<span></span>';
            
            card.innerHTML = `
                <div class="repo-main">
                    <span class="repo-name">${repo.name.replace(/-/g, '_')}</span>
                    <p class="repo-desc">${repo.description || 'System node documentation.'}</p>
                </div>
                <div class="repo-footer">
                    <span class="repo-lang">// ${repo.language || 'DATA'}</span>
                    ${stars}
                </div>
            `;
            repoGrid.appendChild(card);
        });
    }
    fetchRepos();
});