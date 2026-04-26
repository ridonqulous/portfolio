let currentProjectIndex = -1;

function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + id).classList.add('active');
}

function clearActive() {
    document.querySelectorAll('.nav-item, .project-nav-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.grid-cell').forEach(el => el.classList.remove('active'));
}

function setProjectHover(projectId, on) {
    document.querySelector(`.project-nav-item[data-id="${projectId}"]`)?.classList.toggle('hover', on);
    document.querySelector(`.grid-cell[data-id="${projectId}"]`)?.classList.toggle('hover', on);
}

function closeMobileMenu() {
    document.getElementById('mobile-menu').classList.remove('open');
}

async function openProject(index) {
    const project = projects[index];
    currentProjectIndex = index;

    clearActive();
    document.querySelector(`.project-nav-item[data-id="${project.id}"]`)?.classList.add('active');
    document.querySelector(`.grid-cell[data-id="${project.id}"]`)?.classList.add('active');

    const detailContent = document.getElementById('detail-content');
    detailContent.innerHTML = '';

    const titleEl = document.createElement('h2');
    titleEl.className = 'detail-title';
    titleEl.textContent = project.title;

    const yearEl = document.createElement('p');
    yearEl.className = 'detail-year';
    yearEl.textContent = project.year;

    const bodyEl = document.createElement('div');
    bodyEl.className = 'detail-body';

    try {
        const res = await fetch(`projects/${project.id}/content.html`);
        if (!res.ok) throw new Error();
        bodyEl.innerHTML = await res.text();
    } catch {
        bodyEl.innerHTML = '<p>Content could not be loaded.</p>';
    }

    detailContent.appendChild(titleEl);
    detailContent.appendChild(yearEl);
    detailContent.appendChild(bodyEl);

    document.getElementById('btn-prev').disabled = index === 0;
    document.getElementById('btn-next').disabled = index === projects.length - 1;

    showView('detail');
    window.scrollTo(0, 0);
}

async function openStaticView(viewId) {
    clearActive();
    document.getElementById('nav-' + viewId)?.classList.add('active');

    const contentEl = document.getElementById(viewId + '-content');
    if (contentEl && !contentEl.dataset.loaded) {
        try {
            const res = await fetch(viewId + '.html');
            if (!res.ok) throw new Error();
            contentEl.innerHTML = await res.text();
            contentEl.dataset.loaded = '1';
        } catch {
            contentEl.innerHTML = '<p>Content could not be loaded.</p>';
        }
    }

    showView(viewId);
    window.scrollTo(0, 0);
}

function buildSidebar() {
    const nav = document.getElementById('project-nav');
    projects.forEach((project, index) => {
        const item = document.createElement('a');
        item.className = 'project-nav-item';
        item.href = '#';
        item.dataset.id = project.id;
        item.textContent = project.title.toUpperCase();

        item.addEventListener('click', e => { e.preventDefault(); openProject(index); });
        item.addEventListener('mouseenter', () => setProjectHover(project.id, true));
        item.addEventListener('mouseleave', () => setProjectHover(project.id, false));

        nav.appendChild(item);
    });
}

function buildGrid() {
    const grid = document.getElementById('project-grid');
    projects.forEach((project, index) => {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.id = project.id;

        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'grid-cell-image-wrapper';

        const img = document.createElement('img');
        img.className = 'grid-cell-image';
        img.src = project.cover;
        img.alt = project.title;

        imgWrapper.appendChild(img);

        const titleEl = document.createElement('p');
        titleEl.className = 'grid-cell-title';
        titleEl.textContent = project.title;

        cell.appendChild(imgWrapper);
        cell.appendChild(titleEl);

        cell.addEventListener('click', () => openProject(index));
        cell.addEventListener('mouseenter', () => setProjectHover(project.id, true));
        cell.addEventListener('mouseleave', () => setProjectHover(project.id, false));

        grid.appendChild(cell);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    buildSidebar();
    buildGrid();

    // Desktop nav
    document.getElementById('nav-about').addEventListener('click', e => {
        e.preventDefault();
        openStaticView('about');
    });

    document.getElementById('nav-publications').addEventListener('click', e => {
        e.preventDefault();
        openStaticView('publications');
    });

    document.getElementById('btn-prev').addEventListener('click', () => {
        if (currentProjectIndex > 0) openProject(currentProjectIndex - 1);
    });

    document.getElementById('btn-next').addEventListener('click', () => {
        if (currentProjectIndex < projects.length - 1) openProject(currentProjectIndex + 1);
    });

    document.getElementById('site-name').addEventListener('click', () => {
        clearActive();
        showView('grid');
        window.scrollTo(0, 0);
    });

    // Mobile menu
    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
        document.getElementById('mobile-menu').classList.add('open');
    });

    document.getElementById('mobile-menu-close').addEventListener('click', closeMobileMenu);

    document.getElementById('mobile-nav-home').addEventListener('click', e => {
        e.preventDefault();
        closeMobileMenu();
        clearActive();
        showView('grid');
        window.scrollTo(0, 0);
    });

    document.getElementById('mobile-nav-about').addEventListener('click', e => {
        e.preventDefault();
        closeMobileMenu();
        openStaticView('about');
    });

    document.getElementById('mobile-nav-publications').addEventListener('click', e => {
        e.preventDefault();
        closeMobileMenu();
        openStaticView('publications');
    });
});
