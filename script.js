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

const PROJECT_CONFIG = {
    "serveeasy-flutter-firebase": {
        title: "ServeEasy",
        description:
            "A cross-platform service booking application built using Flutter and Firebase.\nIncludes admin dashboard, technician management, and real-time updates.",
        category: "mobile" // flutter → mobile
    },

    "pokepedia": {
        title: "Pokepedia",
        description:
            "A Flutter-powered Pokédex app delivering Pokémon insights with smooth UI and clean architecture.\nBuilt for performance and fan-focused storytelling.",
        category: "mobile"
    },

    "bmi-calculator": {
        title: "BMI Calculator",
        description:
            "A sleek Flutter application that calculates BMI and provides instant health categorization.\nDesigned with intuitive UI and dynamic visual feedback.",
        category: "mobile"
    },

    "squid-game": {
        title: "Squid Game",
        description:
            "A browser-based 3D Red Light Green Light game inspired by Squid Game.\nBuilt using React Three Fiber with immersive gameplay mechanics.",
        category: "web"
    },

    "cinemapatti-movie-recommendation-system": {
        title: "CinemaPatti",
        description:
            "An intelligent movie recommendation system that allows users to add films, post reviews,\nand receive personalized recommendations based on preferences.",
        category: "basic"
    },

    "python_chat_application": {
        title: "Python Chat Application",
        description:
            "A simple socket-based chat application built using Python.\nSupports real-time communication with client-server connectivity.",
        category: "basic"
    }
};
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

const ALLOWED_REPOS = Object.keys(PROJECT_CONFIG);
const GITHUB_API = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;

async function loadGitHubProjects() {
    try {
        const res = await fetch(GITHUB_API);
        const repos = await res.json();

        projectsGrid.innerHTML = "";

        const filteredRepos = repos.filter(
            repo =>
                !repo.fork &&
                ALLOWED_REPOS.includes(repo.name.toLowerCase())
        );
        if (!Array.isArray(repos)) {
            throw new Error("GitHub API error");
        }


        // maintain your preferred order
        filteredRepos.sort(
            (a, b) =>
                ALLOWED_REPOS.indexOf(a.name.toLowerCase()) -
                ALLOWED_REPOS.indexOf(b.name.toLowerCase())
        );

        filteredRepos.forEach(repo => {
            const key = repo.name.toLowerCase();
            const config = PROJECT_CONFIG[key];

            const card = document.createElement("article");
            card.className = "project-card tilt";
            card.dataset.type = config.category;

            card.innerHTML = `
        <div class="project-info">
          <h3>${config.title}</h3>
          <p>${config.description.replace(/\n/g, "<br>")}</p>

<div class="project-footer">
  <div class="project-stats">
    <span>⭐ ${repo.stargazers_count}</span>
    <span>🍴 ${repo.forks_count}</span>
  </div>

  <a href="${repo.html_url}" 
     target="_blank" 
     class="github-btn"
     aria-label="View on GitHub">

    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.94.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.54-3.87-1.54-.53-1.35-1.29-1.71-1.29-1.71-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.27-5.23-5.64 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.17a11.1 11.1 0 0 1 5.8 0c2.2-1.48 3.18-1.17 3.18-1.17.62 1.59.23 2.76.11 3.05.73.8 1.18 1.82 1.18 3.07 0 4.38-2.69 5.35-5.25 5.63.41.36.77 1.08.77 2.18v3.23c0 .31.21.68.8.56A10.51 10.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/>
    </svg>

    <span>View on GitHub</span>
  </a>


    ${repo.homepage
                    ? `<a class="demo-link" href="${repo.homepage}" target="_blank" aria-label="Live Demo">
             <!-- External link icon -->
             <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
               <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"/>
               <path d="M5 5h5V3H3v7h2V5zm0 14v-5H3v7h7v-2H5zm14 0h-5v2h7v-7h-2v5z"/>
             </svg>
           </a>`
                    : ""
                }
  </div>
</div>


        </div>
      `;

            projectsGrid.appendChild(card);
        });

    } catch (err) {
        projectsGrid.innerHTML = "<p>Failed to load projects.</p>";
        console.error(err);
    }
}

loadGitHubProjects();

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

