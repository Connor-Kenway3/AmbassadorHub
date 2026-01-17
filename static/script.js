
let allPrograms = (window.programsData?.programs || []).sort((a, b) => 
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
);
let filteredPrograms = [...allPrograms];
let currentPage = 1;
const itemsPerPage = 10;

const categoryPalette = {
    'l1': '#3b82f6',
    'defi': '#a855f7',
    'ai': '#ca8a04',
    'finance': '#16a34a',
    'payment': '#dc2626',
    'rwa': '#db2777',
    'depin': '#0ea5e9',
    'infrastructure': '#6366f1',
    'privacy': '#14b8a6'
};

function getCategoryStyles(cat) {
    const key = cat.toLowerCase().trim();
    let color = categoryPalette[key];

    if (!color) {
        let hash = 0;
        for (let i = 0; i < cat.length; i++) {
            hash = cat.charCodeAt(i) + ((hash << 5) - hash);
        }
        const h = Math.abs(hash) % 360;
        color = `hsl(${h}, 70%, 40%)`;
    }

    const bgColor = color.startsWith('hsl') 
        ? color.replace('40%)', '40%, 0.1)') 
        : `${color}1A`; 
    
    return { color, bgColor };
}

const blob = document.getElementById('cursor-blob');

document.addEventListener('mousemove', (e) => {
    if (blob) {
        blob.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
    }

    const x = (e.clientX - window.innerWidth / 2) * 0.05;
    const y = (e.clientY - window.innerHeight / 2) * 0.05;
    document.body.style.setProperty('--grid-x', `${x}px`);
    document.body.style.setProperty('--grid-y', `${y}px`);

    const hoveredCard = e.target.closest('.program-row');
    if (hoveredCard) {
        const rect = hoveredCard.getBoundingClientRect();
        hoveredCard.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        hoveredCard.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }
});

// 4. Core Rendering Engine
function createCategoryTag(cat) {
    const span = document.createElement('span');
    span.className = 'program-category';
    span.textContent = cat;
    const styles = getCategoryStyles(cat);
    span.style.color = styles.color;
    span.style.backgroundColor = styles.bgColor;
    return span;
}

function renderPrograms() {
    const list = document.getElementById('programsList');
    if (!list) return;

    const fragment = document.createDocumentFragment();
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredPrograms.slice(startIndex, startIndex + itemsPerPage);

    paginatedItems.forEach(program => {
        const row = document.createElement('div');
        row.className = 'program-row';
        row.onclick = () => openModal(program);

        const logoDiv = document.createElement('div');
        logoDiv.className = 'program-logo';
        if (program.logo) {
            const img = document.createElement('img');
            img.src = program.logo;
            img.loading = "lazy";
            img.alt = `${program.name} logo`;
            img.onerror = () => { logoDiv.textContent = program.name.charAt(0); };
            logoDiv.appendChild(img);
        } else {
            logoDiv.textContent = program.name.charAt(0);
        }

        // Info & Tags
        const infoDiv = document.createElement('div');
        infoDiv.className = 'program-info';
        const nameSpan = document.createElement('span');
        nameSpan.className = 'program-name';
        nameSpan.textContent = program.name;

        const tagGroup = document.createElement('div');
        tagGroup.className = 'tag-group';
        const cats = Array.isArray(program.category) ? program.category : [program.category];
        cats.forEach(cat => tagGroup.appendChild(createCategoryTag(cat)));
        infoDiv.append(nameSpan, tagGroup);

        // Social Links
        const socialsDiv = document.createElement('div');
        socialsDiv.className = 'program-socials';
        socialsDiv.onclick = (e) => e.stopPropagation();

        const icons = {
            website: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
            twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>`,
            discord: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 11.721 11.721 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.23 10.23 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.158-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.158-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.419-2.157 2.419z"></path></svg>`
        };

        ['website', 'twitter', 'discord'].forEach(type => {
            if (program.socials?.[type]) {
                const a = document.createElement('a');
                a.href = program.socials[type];
                a.target = "_blank";
                a.className = "social-link";
                a.innerHTML = icons[type];
                socialsDiv.appendChild(a);
            }
        });

        // Status Badge
        const statusDiv = document.createElement('div');
        statusDiv.className = 'program-status';
        const statusText = program.status?.toUpperCase() || 'UNKNOWN';
        statusDiv.innerHTML = `<span class="status-badge ${statusText === 'ACTIVE' ? 'status-active' : 'status-closed'}">${statusText}</span>`;

        // Responsive Assembler
        if (window.innerWidth <= 750) {
            const mobileStack = document.createElement('div');
            mobileStack.className = 'mobile-right-stack';
            mobileStack.append(socialsDiv, statusDiv);
            row.append(logoDiv, infoDiv, mobileStack);
        } else {
            row.append(logoDiv, infoDiv, socialsDiv, statusDiv);
        }

        fragment.appendChild(row);
    });

    // Replace the DOM content in one go
    list.replaceChildren(fragment);
    
    updateCounter();
    renderPagination();
}

// 5. Utility Functions
function updateCounter() {
    const counterElement = document.getElementById('projectCounter');
    if (counterElement) {
        const count = filteredPrograms.length;
        counterElement.textContent = `${count} active opportunit${count === 1 ? 'y' : 'ies'} found`;
    }
}

function handleSearch(query) {
    const term = query.toLowerCase().trim();
    filteredPrograms = allPrograms.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(term);
        const categories = Array.isArray(p.category) ? p.category : [p.category];
        const catMatch = categories.some(c => c.toLowerCase().includes(term));
        return nameMatch || catMatch;
    });
    currentPage = 1;
    renderPrograms();
}

function openModal(program) {
    document.getElementById('modalTitle').textContent = program.name;
    document.getElementById('modalDescription').textContent = program.details?.description || 'No description provided.';
    document.getElementById('announcementBtn').href = program.details?.announcement_url || '#';
    document.getElementById('applyBtn').href = program.details?.apply_url || '#';

    const catContainer = document.getElementById('modalCategory');
    catContainer.innerHTML = '';
    const cats = Array.isArray(program.category) ? program.category : [program.category];
    cats.forEach(cat => catContainer.appendChild(createCategoryTag(cat)));

    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

function renderPagination() {
    const nav = document.getElementById('paginationNav');
    if (!nav) return;
    nav.innerHTML = '';
    const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentPage ? 'page-btn active' : 'page-btn';
        btn.onclick = () => {
            currentPage = i;
            renderPrograms();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        nav.appendChild(btn);
    }
}

// 6. Global Listeners
document.getElementById('searchInput')?.addEventListener('input', (e) => handleSearch(e.target.value));

document.getElementById('modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal' || e.target.classList.contains('modal-close')) {
        closeModal();
    }
});

// Using a debounce-like approach for resize to save CPU
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderPrograms, 150);
});

// Init
renderPrograms();