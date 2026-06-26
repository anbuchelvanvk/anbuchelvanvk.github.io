/* =========================================================
   CURSOR GLOW — smooth lag + bloom (reference behaviour)
========================================================= */
const glow = document.querySelector('.cursor-glow');
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateGlow() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    glow.style.transform =
        `translate(${currentX - 160}px, ${currentY - 160}px)`;

    requestAnimationFrame(animateGlow);
}

animateGlow();

/* =========================================================
   SCROLL REVEAL — stagger + blur (non-linear feel)
========================================================= */
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 120);
            }
        });
    },
    { threshold: 0.15 }
);

reveals.forEach(el => revealObserver.observe(el));

/* =========================================================
   TILT EFFECT — clamped, soft, spring-like return
========================================================= */
document.querySelectorAll('.tilt').forEach(card => {
    let rect;

    card.addEventListener('mouseenter', () => {
        rect = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', (e) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = Math.max(
            -6,
            Math.min(6, (y / rect.height - 0.5) * 12)
        );

        const rotateY = Math.max(
            -6,
            Math.min(6, (x / rect.width - 0.5) * -12)
        );

        card.style.transform =
            `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform =
            'rotateX(0deg) rotateY(0deg) scale(1)';
    });
});

/* =========================================================
   NAVBAR ACTIVE LINK ON SCROLL (workflow polish)
========================================================= */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

/* =========================================================
   FLOATING CHAT — subtle pulse (no distraction)
========================================================= */

const PROJECTS = [
    {
        title: "QualityPixels",
        description: "A platform for high-quality image albums and FLAC music downloads with an exceptional user interface.",
        category: "web",
        demoLink: "https://qualitypixels.in",
        image: "images/qualitypixels.png"
    },
    {
        title: "Mouli's Life Care",
        description: "A professional healthcare website designed to provide medical information and patient care services.",
        category: "web",
        demoLink: "https://moulislifecare.in",
        image: "images/healthcare.png"
    },
    {
        title: "Mayajaal x LIK",
        description: "A dynamic web application for live scoring and event tracking for the Mayajaal x LIK event.",
        category: "web",
        demoLink: "https://mayaxlik.wasmer.app/",
        image: "images/score.png"
    },
    {
        title: "Christopher Nolan Tribute",
        description: "A visually immersive tribute website dedicated to the legendary filmmaker Christopher Nolan.",
        category: "web",
        repo: "ChrisNolanWeb",
        demoLink: "https://anbuchelvanvk.github.io/ChrisNolanWeb/",
        image: "images/cinema.png"
    },
    {
        title: "ServeEasy",
        description: "A cross-platform service booking application built using Flutter and Firebase.\nIncludes admin dashboard, technician management, and real-time updates.",
        category: "mobile",
        repo: "serveeasy-flutter-firebase",
        image: "images/service.png"
    },
    {
        title: "Pokepedia",
        description: "A Flutter-powered Pokédex app delivering Pokémon insights with smooth UI and clean architecture.\nBuilt for performance and fan-focused storytelling.",
        category: "mobile",
        repo: "pokepedia",
        image: "images/pokedex.png"
    },
    {
        title: "Squid Game",
        description: "A browser-based 3D Red Light Green Light game inspired by Squid Game.\nBuilt using React Three Fiber with immersive gameplay mechanics.",
        category: "web",
        repo: "squid-game",
        demoLink: "https://anbuchelvanvk.github.io/squid-game/",
        image: "images/game.png"
    },
    {
        title: "CinemaPatti",
        description: "An intelligent movie recommendation system that allows users to add films, post reviews,\nand receive personalized recommendations based on preferences.",
        category: "basic",
        repo: "cinemapatti-movie-recommendation-system",
        image: "images/cinema.png"
    },
    {
        title: "Python Chat Application",
        description: "A simple socket-based chat application built using Python.\nSupports real-time communication with client-server connectivity.",
        category: "basic",
        repo: "python_chat_application",
        image: "images/chat.png"
    }
];
const chat = document.querySelector('.chat-float');
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        document.querySelectorAll(".project-card").forEach(card => {
            if (filter === "all" || card.dataset.type === filter) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
});


if (chat) {
    setInterval(() => {
        chat.classList.add('pulse');
        setTimeout(() => chat.classList.remove('pulse'), 600);
    }, 4000);
}

const username = "anbuchelvanvk";
const projectsGrid = document.getElementById("projectsGrid");

const GITHUB_API = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;

async function loadProjects() {
    try {
        let reposMap = {};
        try {
            const res = await fetch(GITHUB_API);
            const repos = await res.json();
            if (Array.isArray(repos)) {
                repos.forEach(repo => {
                    reposMap[repo.name.toLowerCase()] = repo;
                });
            }
        } catch (e) {
            console.warn("Could not fetch GitHub repos", e);
        }

        projectsGrid.innerHTML = "";

        PROJECTS.forEach(config => {
            let repo = config.repo ? reposMap[config.repo.toLowerCase()] : null;
            
            const card = document.createElement("article");
            card.className = "project-card tilt";
            card.dataset.type = config.category;

            let githubBtnHtml = "";
            let demoBtnHtml = "";

            if (repo) {
                githubBtnHtml = `
                  <a href="${repo.html_url}" 
                     target="_blank" 
                     class="project-action-btn github-btn"
                     aria-label="View on GitHub">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.94.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.54-3.87-1.54-.53-1.35-1.29-1.71-1.29-1.71-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.27-5.23-5.64 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.17a11.1 11.1 0 0 1 5.8 0c2.2-1.48 3.18-1.17 3.18-1.17.62 1.59.23 2.76.11 3.05.73.8 1.18 1.82 1.18 3.07 0 4.38-2.69 5.35-5.25 5.63.41.36.77 1.08.77 2.18v3.23c0 .31.21.68.8.56A10.51 10.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/>
                    </svg>
                    <span>Source</span>
                  </a>`;
            }

            const finalDemoLink = config.demoLink || (repo && repo.homepage ? repo.homepage : "");
            
            if (finalDemoLink) {
                demoBtnHtml = `
                   <a class="project-action-btn demo-btn" href="${finalDemoLink}" target="_blank" aria-label="Live Demo">
                     <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                       <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"/>
                       <path d="M5 5h5V3H3v7h2V5zm0 14v-5H3v7h7v-2H5zm14 0h-5v2h7v-7h-2v5z"/>
                     </svg>
                     <span>Visit</span>
                   </a>`;
            }

            let actionButtonsHtml = "";
            if (githubBtnHtml || demoBtnHtml) {
                actionButtonsHtml = `${githubBtnHtml}${demoBtnHtml}`;
            }

            let imageHtml = "";
            if (config.image) {
                imageHtml = `
                    <div class="project-img-wrapper">
                        <img src="${config.image}" alt="${config.title}" class="project-img">
                        <div class="project-img-overlay"></div>
                    </div>
                `;
            }

            card.innerHTML = `
                ${imageHtml}
                <div class="project-info">
                  <h3>${config.title}</h3>
                  <p>${config.description.replace(/\n/g, "<br>")}</p>
                  
                  <div class="project-footer">
                    <div class="project-actions">
                        ${actionButtonsHtml}
                    </div>
                  </div>
                </div>
            `;

            projectsGrid.appendChild(card);
            
            // Re-bind tilt effect
            card.addEventListener('mouseenter', () => {
                let rect = card.getBoundingClientRect();
                card.dataset.rectLeft = rect.left;
                card.dataset.rectTop = rect.top;
                card.dataset.rectWidth = rect.width;
                card.dataset.rectHeight = rect.height;
            });

            card.addEventListener('mousemove', (e) => {
                const x = e.clientX - parseFloat(card.dataset.rectLeft || 0);
                const y = e.clientY - parseFloat(card.dataset.rectTop || 0);
                const rotateX = Math.max(-6, Math.min(6, (y / parseFloat(card.dataset.rectHeight || 1) - 0.5) * 12));
                const rotateY = Math.max(-6, Math.min(6, (x / parseFloat(card.dataset.rectWidth || 1) - 0.5) * -12));
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            });
        });

    } catch (err) {
        projectsGrid.innerHTML = "<p>Failed to load projects.</p>";
        console.error(err);
    }
}

loadProjects();

/* =========================================================
   FETCH GITHUB PROFILE AVATAR
========================================================= */

const GITHUB_USERNAME = "anbuchelvanvk";

async function loadGitHubAvatar() {
    try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        const data = await res.json();

        const avatarImg = document.getElementById("github-avatar");

        if (data.avatar_url) {
            avatarImg.src = data.avatar_url;
        } else {
            avatarImg.src = "https://avatars.githubusercontent.com/u/0";
        }
    } catch (err) {
        console.error("Failed to load GitHub avatar", err);
    }
}

loadGitHubAvatar();
document.querySelectorAll('.contact-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-6px) scale(1.03)';
    });

    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0) scale(1)';
    });
});
const STACK_DATA = {
  languages: [
    { name: "HTML", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "JavaScript", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "Python", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
    { name: "Java", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
    { name: "Dart", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" }
  ],

  frameworks: [
    { name: "Flutter", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
    { name: "React", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Angular", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
    { name: "Node.js", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Express", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
    { name: "Flask", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" }
  ],

  databases: [
    { name: "MongoDB", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "MySQL", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    { name: "PostgreSQL", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" }
  ],

  tools: [
    { name: "Premiere Pro", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-original.svg" },
    { name: "Photoshop", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg" },
    { name: "After Effects", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg" }
  ]
};

const stackGrid = document.getElementById("stackGrid");
const stackTabs = document.querySelectorAll(".stack-tab");

function renderStack(category) {
  stackGrid.innerHTML = "";

  STACK_DATA[category].forEach(item => {
    const div = document.createElement("div");
    div.className = "stack-item tilt";
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <span>${item.name}</span>
    `;
    stackGrid.appendChild(div);
  });
}

// Default load
renderStack("languages");

stackTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    stackTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderStack(tab.dataset.category);
  });
});

// --- NEW DYNAMIC FEATURES ---

// 1. Custom Glowing Cursor
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursorGlow.style.left = `${cursorX}px`;
        cursorGlow.style.top = `${cursorY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
}

// 2. Intersection Observer for Scroll Animations
// Auto-add reveal class to elements for easy animation
document.querySelectorAll('section:not(.hero), .activity-card, .stack-wrapper').forEach(el => {
    el.classList.add('reveal');
});

const scrollRevealElements = document.querySelectorAll('.reveal');
const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

scrollRevealElements.forEach(el => scrollRevealObserver.observe(el));

// 3. Floating Particles Generator for Hero
const hero = document.querySelector('.hero');
if (hero) {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 6 + 2; 
        const posX = Math.random() * 100; 
        const posY = Math.random() * 100; 
        const delay = Math.random() * 5; 
        const duration = Math.random() * 6 + 8; 
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        hero.appendChild(particle);
    }
}

// 4. Scroll Progress Bar
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
        const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (window.scrollY / scrollTotal) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
});

// 5. 3D Hover Tilt Effect for Project Cards
const cards = document.querySelectorAll('.project-card, .activity-card');
cards.forEach(card => {
    let tiltRafId;
    card.addEventListener('mousemove', (e) => {
        if (tiltRafId) cancelAnimationFrame(tiltRafId);
        tiltRafId = requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8; // Max 8deg tilt
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease-out';
            card.style.zIndex = '10';
        });
    });
    
    card.addEventListener('mouseleave', () => {
        if (tiltRafId) cancelAnimationFrame(tiltRafId);
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease-out';
        card.style.zIndex = '1';
    });
});

// 6. Magnetic Buttons
const magneticButtons = document.querySelectorAll('.btn, .nav-actions a, .resume-float');
magneticButtons.forEach(btn => {
    let hoverRafId;
    btn.addEventListener('mousemove', (e) => {
        if (hoverRafId) cancelAnimationFrame(hoverRafId);
        hoverRafId = requestAnimationFrame(() => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
            btn.style.transform = `translate(${x}px, ${y}px)`;
            btn.style.transition = 'transform 0.1s ease-out';
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    });
});

// 7. Spotlight Hover Effect on Cards
cards.forEach(card => {
    let spotRafId;
    card.addEventListener('mousemove', (e) => {
        if (spotRafId) cancelAnimationFrame(spotRafId);
        spotRafId = requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});

// 8. Click Ripple Effect
document.addEventListener('mousedown', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
});

// 9. Typing Effect for Hero Description
const heroDesc = document.querySelector('.hero-desc');
if (heroDesc) {
    const text = heroDesc.textContent.trim();
    heroDesc.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            heroDesc.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 30);
        }
    }
    
    setTimeout(typeWriter, 500);
}

// 10. Mouse Trail Particles
let lastMousePos = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
    const dist = Math.hypot(e.clientX - lastMousePos.x, e.clientY - lastMousePos.y);
    if (dist > 15) {
        lastMousePos = { x: e.clientX, y: e.clientY };
        
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = `${e.clientX}px`;
        trail.style.top = `${e.clientY}px`;
        
        const size = Math.random() * 6 + 4;
        trail.style.width = `${size}px`;
        trail.style.height = `${size}px`;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.remove();
        }, 600);
    }
});
