const media = [
    { src: 'media/optimised/1B6A5376.jpg', type: 'image', orientation: 'horizontal', name: 'PUBLICATION.PNG',          group: 'hyper'   },
    { src: 'media/optimised/1B6A5457.jpg', type: 'image', orientation: 'horizontal', name: 'PUBLICATION_OPEN.PNG',          group: 'hyper'   },
    { src: 'media/optimised/1B6A5465.jpg', type: 'image', orientation: 'horizontal', name: 'PUBLICATION_FOLD.PNG',          group: 'hyper'   },
    { src: 'media/optimised/1B6A5476.jpg', type: 'image', orientation: 'horizontal', name: 'POSTER_FLUO_VER.PNG',          group: 'hyper'   },
    { src: 'media/HyperPrintScans.gif',    type: 'image', orientation: 'larger',     name: 'SCANS_B4-B1.GIF',   group: 'hyper'   },
    { src: 'media/optimised/IMG_3825.jpg', type: 'image', orientation: 'vertical',   name: 'PAPER_STENCILS.JPG',          group: 'hyper'   },
    { src: 'media/IMG_8581.mp4',           type: 'video', orientation: 'horizontal', name: 'PRINT_PROCESS.MP4',          group: 'hyper'   },
    { src: 'media/optimised/IMG_9119.jpg', type: 'image', orientation: 'horizontal', name: 'DESIGN_PROCESS.JPG',          group: 'hyper'   },
    { src: 'media/optimised/IMG_9484.jpg', type: 'image', orientation: 'vertical',   name: 'FOLD_EXPERIMENTS.JPG',          group: 'hyper'   },
    { src: 'media/WEB_Rec.mp4',            type: 'video', orientation: 'horizontal', name: 'WEB_DOCU.MP4',           group: 'hyper',  link: 'https://jhkmr.github.io/hyper_print/' },
    { src: 'media/horizontal3.png',        type: 'image', orientation: 'horizontal', name: 'horizontal3.PNG',       group: 'project' },
    { src: 'media/horizontal3 copy.png',   type: 'image', orientation: 'horizontal', name: 'horizontal3 copy.PNG',  group: 'project' },
    { src: 'media/horizontal3 copy 2.png', type: 'image', orientation: 'horizontal', name: 'horizontal3 copy2.PNG', group: 'project' },
    { src: 'media/horizontal3 copy 3.png', type: 'image', orientation: 'horizontal', name: 'horizontal3 copy3.PNG', group: 'project' },
    { src: 'media/IMG_5463.jpeg',          type: 'image', orientation: 'vertical',   name: 'IMG_5463.JPG',         group: 'project' },
    { src: 'media/vertical3 copy.png',     type: 'image', orientation: 'vertical',   name: 'vertical3 copy.PNG',    group: 'project' },
    { src: 'media/vertical3 copy 2.png',   type: 'image', orientation: 'vertical',   name: 'vertical3 copy2.PNG',   group: 'project' },
    { src: 'media/vertical3 copy 3.png',   type: 'image', orientation: 'vertical',   name: 'vertical3 copy3.PNG',   group: 'project' },
];

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function filename(src) {
    return src.split('/').pop();
}

function createItem(item) {
    const wrapper = document.createElement('div');
    wrapper.className = 'media-item';
    wrapper.dataset.group = item.group;

    let el;
    if (item.type === 'video') {
        el = document.createElement('video');
        el.dataset.src = item.src;
        el.loop = true;
        el.muted = true;
        el.playsInline = true;
    } else {
        el = document.createElement('img');
        el.src = item.src;
        el.alt = filename(item.src);
        el.loading = 'lazy';
    }

    el.className = `media ${item.orientation}`;

    const tag = document.createElement('span');
    tag.className = 'media-tag';
    tag.textContent = item.name;

    if (item.link) {
        const a = document.createElement('a');
        a.href = item.link;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.appendChild(el);
        wrapper.appendChild(a);
    } else {
        wrapper.appendChild(el);
    }
    wrapper.appendChild(tag);

    wrapper.addEventListener('mouseenter', () => window.onMediaHover?.(item.group));
    wrapper.addEventListener('mouseleave', () => window.onMediaHoverOut?.());
    wrapper.addEventListener('click',      (e) => {
        if (item.link) return;
        window.onMediaClick?.(item.group);
    });

    return wrapper;
}

const container = document.getElementById('scroll-container');
const shuffled = shuffle(media);

const BUFFER_COPIES = 6;
const totalCopies = BUFFER_COPIES * 2 + 1;
for (let c = 0; c < totalCopies; c++) {
    shuffled.forEach(item => container.appendChild(createItem(item)));
}

const totalItems = container.children.length;
const midIndex   = Math.floor(totalItems / 2);
const midEl      = container.children[midIndex];

function centerOnElement(el) {
    const containerRect = container.getBoundingClientRect();
    const elTop    = el.offsetTop;
    const elHeight = el.offsetHeight;
    container.scrollTop = elTop - (containerRect.height / 2) + (elHeight / 2);
}

centerOnElement(midEl);

const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
            if (!video.src && video.dataset.src) {
                video.src = video.dataset.src;
            }
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    });
}, { root: container, rootMargin: '200px' });

document.querySelectorAll('video').forEach(v => videoObserver.observe(v));

container.addEventListener('scroll', () => {
    const scrollTop    = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const copyHeight   = scrollHeight / totalCopies;

    if (scrollTop < copyHeight) {
        container.scrollTop += copyHeight;
    } else if (scrollTop + clientHeight > scrollHeight - copyHeight) {
        container.scrollTop -= copyHeight;
    }
}, { passive: true });

function setActiveGroup(group) {
    document.querySelectorAll('.media-item').forEach(item => {
        if (!group || item.dataset.group === group) {
            item.classList.remove('dimmed');
        } else {
            item.classList.add('dimmed');
        }
    });
}

const triggers  = document.querySelectorAll('.trigger');
const panels    = document.querySelectorAll('.expandable');
const intro     = document.querySelector('.intro');
const goal      = document.querySelector('.goal');
const nameItems = document.querySelectorAll('.info-names li');

function reset() {
    triggers.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('visible'));
    intro.classList.remove('dimmed');
    goal.classList.remove('dimmed');
    nameItems.forEach(li => li.classList.remove('dimmed'));
    setActiveGroup(null);
    document.body.removeAttribute('data-hover-group');
}

function activate(target) {
    triggers.forEach(t => t.classList.remove('active'));
    triggers.forEach(t => { if (t.dataset.target === target) t.classList.add('active'); });
    panels.forEach(p => p.classList.remove('visible'));
    document.getElementById('panel-' + target).classList.add('visible');
    intro.classList.add('dimmed');
    goal.classList.add('dimmed');
    nameItems.forEach(li => {
        li.classList.toggle('dimmed', li.dataset.group !== target);
    });
    setActiveGroup(target);
    document.body.removeAttribute('data-hover-group');
}

triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const target   = trigger.dataset.target;
        const isActive = trigger.classList.contains('active');
        isActive ? reset() : activate(target);
    });
});

window.onMediaHover = (group) => {
    document.body.setAttribute('data-hover-group', group);
};
window.onMediaHoverOut = () => {
    document.body.removeAttribute('data-hover-group');
};
window.onMediaClick = (group) => {
    const alreadyActive = [...triggers].find(t => t.classList.contains('active'))?.dataset.target === group;
    alreadyActive ? reset() : activate(group);
};

document.addEventListener('click', (e) => {
    if (!e.target.closest('.info, .media-item')) reset();
});
