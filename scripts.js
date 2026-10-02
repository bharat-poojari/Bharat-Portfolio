// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const terminalTheme = document.getElementById('terminal-theme');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
        updateThemeIcons(savedTheme === 'dark-theme');
    }

    function updateThemeIcons(isDark) {
        // Update theme toggle icons
        if (themeToggle) {
            const sunIcon = themeToggle.querySelector('.fa-sun');
            const moonIcon = themeToggle.querySelector('.fa-moon');
            if (sunIcon && moonIcon) {
                if (isDark) {
                    sunIcon.style.opacity = '0.5';
                    moonIcon.style.opacity = '1';
                } else {
                    sunIcon.style.opacity = '1';
                    moonIcon.style.opacity = '0.5';
                }
            }
        }

        // Update terminal theme button
        if (terminalTheme) {
            const icon = terminalTheme.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    function toggleTheme() {
        const isDark = body.classList.contains('dark-theme');
        if (isDark) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light-theme');
            updateThemeIcons(false);
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark-theme');
            updateThemeIcons(true);
        }
    }

    // Theme toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Terminal theme button sync
    if (terminalTheme) {
        terminalTheme.addEventListener('click', function() {
            toggleTheme();
        });
    }
}

// Enhanced Skills Section Functionality
function initEnhancedSkillsSection() {
    initSkillsAnimation();
}

function initSkillsAnimation() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        const skillLevel = item.getAttribute('data-skill');
        const skillName = item.querySelector('.skill-name')?.textContent.trim();
        const skillBar = item.querySelector('.skill-bar');
        if (skillBar) {
            skillBar.setAttribute('role', 'progressbar');
            skillBar.setAttribute('aria-label', `${skillName} proficiency`);
            skillBar.setAttribute('aria-valuemin', '0');
            skillBar.setAttribute('aria-valuemax', '100');
            skillBar.setAttribute('aria-valuenow', skillLevel);
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItem = entry.target;
                const skillLevel = skillItem.getAttribute('data-skill');
                const progressBar = skillItem.querySelector('.skill-progress');

                const delay = Array.from(skillItems).indexOf(skillItem) * 80;
                setTimeout(() => {
                    if (progressBar) {
                        progressBar.style.width = `${skillLevel}%`;
                        setTimeout(() => {
                            progressBar.style.animation = 'pulseGlow 2s ease-in-out';
                        }, 1500);
                    }
                }, delay);

                observer.unobserve(skillItem);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    skillItems.forEach(item => {
        observer.observe(item);
    });
}

// Hero Section Functionality
function initHeroSection() {
    initTypewriter();
}

async function initGithubProjectStats(projects) {
    const projectCount = document.getElementById('github-project-count');
    const lineCount = document.getElementById('github-line-count');
    const languageCount = document.getElementById('github-language-count');
    const starCount = document.getElementById('github-repo-stars');
    const status = document.getElementById('github-stats-status');
    if (!projectCount || !lineCount || !languageCount || !starCount || !status) return;

    const sourceExtensions = /\.(c|cc|cpp|cs|css|go|h|hpp|html|java|js|jsx|kt|php|py|rb|rs|scss|sh|sql|swift|ts|tsx|vue|xml|yaml|yml)$/i;
    const ignoredPath = /(^|\/)(node_modules|vendor|dist|build|coverage|\.git)(\/|$)/i;
    const cacheKey = 'github-project-stats-v2';
    const repos = [...new Map(projects
        .filter(project => project.github)
        .map(project => {
            const match = project.github.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)/i);
            return match ? [`${match[1]}/${match[2].replace(/\.git$/i, '')}`, { owner: match[1], name: match[2].replace(/\.git$/i, '') }] : null;
        })
        .filter(Boolean)).values()];

    let cached = null;
    try {
        cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    } catch {}
    if (cached && Date.now() - cached.cachedAt < 6 * 60 * 60 * 1000) {
        projectCount.textContent = cached.projects.toLocaleString();
        lineCount.textContent = cached.lines.toLocaleString();
        languageCount.textContent = cached.languages.toLocaleString();
        starCount.textContent = cached.stars.toLocaleString();
        status.textContent = `Live from ${cached.projects} public GitHub repositories`;
        return;
    }

    try {
        const accountResponse = await fetch('https://api.github.com/users/bharat-poojari/repos?per_page=100');
        if (!accountResponse.ok) throw new Error(`GitHub returned ${accountResponse.status}`);
        const accountRepos = await accountResponse.json();
        const repositories = await Promise.all(repos.map(async repo => {
            const metadata = accountRepos.find(item => item.full_name.toLowerCase() === `${repo.owner}/${repo.name}`.toLowerCase());
            if (!metadata) throw new Error(`Repository ${repo.name} was not returned by GitHub`);
            const response = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}/git/trees/${encodeURIComponent(metadata.default_branch)}?recursive=1`);
            if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
            const tree = await response.json();
            if (tree.truncated) throw new Error(`Repository tree for ${repo.name} was truncated`);
            return { repo, metadata, tree };
        }));

        const sourceFiles = repositories.flatMap(({ repo, metadata, tree }) => tree.tree
            .filter(entry => entry.type === 'blob' && sourceExtensions.test(entry.path) && !ignoredPath.test(entry.path) && !/\.min\./i.test(entry.path))
            .map(entry => ({ repo, metadata, path: entry.path })));
        let nextFile = 0;
        let totalLines = 0;
        const workers = Array.from({ length: Math.min(6, sourceFiles.length) }, async () => {
            while (nextFile < sourceFiles.length) {
                const file = sourceFiles[nextFile++];
                const response = await fetch(`https://raw.githubusercontent.com/${file.repo.owner}/${file.repo.name}/${encodeURIComponent(file.metadata.default_branch)}/${file.path.split('/').map(encodeURIComponent).join('/')}`);
                if (!response.ok) throw new Error(`GitHub source returned ${response.status}`);
                const contents = await response.text();
                const lines = contents.split(/\r\n|\r|\n/);
                totalLines += lines.length - (lines[lines.length - 1] === '' ? 1 : 0);
            }
        });
        await Promise.all(workers);

        const languages = new Set(repositories.map(repository => repository.metadata.language).filter(Boolean));
        const stars = repositories.reduce((total, repository) => total + (repository.metadata.stargazers_count || 0), 0);
        projectCount.textContent = repositories.length.toLocaleString();
        lineCount.textContent = totalLines.toLocaleString();
        languageCount.textContent = languages.size.toLocaleString();
        starCount.textContent = stars.toLocaleString();
        status.textContent = `Live from ${repositories.length} public GitHub repositories`;
        try {
            localStorage.setItem(cacheKey, JSON.stringify({
                projects: repositories.length,
                lines: totalLines,
                languages: languages.size,
                stars,
                cachedAt: Date.now()
            }));
        } catch {}
    } catch (error) {
        projectCount.textContent = '--';
        lineCount.textContent = '--';
        languageCount.textContent = '--';
        starCount.textContent = '--';
        status.textContent = error.message.includes('403') ?
            'GitHub API limit reached; stats unavailable' :
            'GitHub stats are temporarily unavailable';
    }
}

function initParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;

    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = 2 + Math.random() * 8;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const duration = 15 + Math.random() * 15;
        const delay = Math.random() * 10;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        container.appendChild(particle);
    }
}

function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;

    const texts = [
        "Full-Stack Developer",
        "Web Application Developer",
        "Open Source Contributor"
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 1500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}

const codeExamples = [{
        icon: 'fab fa-js',
        title: 'JavaScript',
        code: [
            '<span class="keyword">const</span> <span class="variable">developer</span> = {',
            ' <span class="variable">name</span>: <span class="string">"Bharat"</span>,',
            ' <span class="variable">skills</span>: [<span class="string">"React"</span>, <span class="string">"Node.js"</span>]',
            '};',
            '<span class="comment">// Modern ES6+ features</span>'
        ]
    },
    {
        icon: 'fab fa-react',
        title: 'React',
        code: [
            '<span class="keyword">function</span> <span class="function">App</span>() {',
            ' <span class="keyword">return</span> (',
            ' <span class="variable">&lt;div&gt;</span>',
            ' <span class="variable">&lt;h1&gt;</span>Hello World<span class="variable">&lt;/h1&gt;</span>',
            ' <span class="variable">&lt;/div&gt;</span>',
            ' );',
            '}'
        ]
    },
    {
        icon: 'fab fa-node-js',
        title: 'Node.js',
        code: [
            '<span class="keyword">const</span> <span class="variable">express</span> = <span class="function">require</span>(<span class="string">\'express\'</span>);',
            '<span class="keyword">const</span> <span class="variable">app</span> = <span class="function">express</span>();',
            '',
            '<span class="variable">app</span>.<span class="function">get</span>(<span class="string">\'/\'</span>, (<span class="variable">req</span>, <span class="variable">res</span>) => {',
            ' <span class="variable">res</span>.<span class="function">send</span>(<span class="string">\'Hello API\'</span>);',
            '});'
        ]
    }
];

function initDynamicCodeCards(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let activeCard = null;
    let cardCount = 0;
    const maxCards = 6;

    function createCodeCard(data, index) {
        const card = document.createElement('div');
        card.className = 'tech-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="card-icon">
                    <i class="${data.icon}"></i>
                </div>
                <div class="card-title">${data.title}</div>
            </div>
            <div class="code-content">
                ${data.code.map(line => `<div class="code-line">${line}</div>`).join('')}
            </div>
        `;

        const left = 5 + Math.random() * 80;
        const top = 10 + Math.random() * 70;
        const delay = index * 1.5;

        card.style.left = `${left}%`;
        card.style.top = `${top}%`;
        card.style.animationDelay = `${delay}s`;

        card.addEventListener('click', function() {
            if (activeCard && activeCard !== this) {
                activeCard.classList.remove('active');
                activeCard.style.animation = `floatCard 25s linear infinite`;
            }

            if (this.classList.contains('active')) {
                this.classList.remove('active');
                this.style.animation = `floatCard 25s linear infinite`;
                activeCard = null;
            } else {
                this.classList.add('active');
                this.style.animation = 'cardPop 0.5s forwards';
                activeCard = this;
                createRippleEffect(this);
            }
        });

        container.appendChild(card);
        cardCount++;

        setTimeout(() => {
            if (card.parentNode && !card.classList.contains('active')) {
                card.parentNode.removeChild(card);
                cardCount--;
            }
        }, 25000);
    }

    function generateCards() {
        if (cardCount < maxCards) {
            const randomIndex = Math.floor(Math.random() * codeExamples.length);
            createCodeCard(codeExamples[randomIndex], cardCount);
        }
        setTimeout(generateCards, 2000);
    }

    generateCards();
}

function createRippleEffect(element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.position = 'absolute';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(37, 99, 235, 0.1)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.top = '50%';
    ripple.style.left = '50%';
    ripple.style.marginTop = `-${size / 2}px`;
    ripple.style.marginLeft = `-${size / 2}px`;
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '5';

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
        if (element.contains(ripple)) {
            element.removeChild(ripple);
        }
    }, 600);
}

// Enhanced Terminal Functionality
function initEnhancedTerminal() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutputContent = document.getElementById('terminal-output-content');
    const terminalSuggestions = document.getElementById('terminal-suggestions');
    const commandsExecuted = document.getElementById('commands-executed');
    const terminalTime = document.getElementById('terminal-time');
    const terminalClear = document.getElementById('terminal-clear');
    const terminalCopy = document.getElementById('terminal-copy');
    const terminalTheme = document.getElementById('terminal-theme');

    let commandCount = 0;
    let startTime = Date.now();
    let isDarkMode = !document.body.classList.contains('light-theme');

    function updateTerminalTime() {
        const now = Date.now();
        const diff = now - startTime;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        if (terminalTime) {
            terminalTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    setInterval(updateTerminalTime, 1000);

    const commands = {
        hello: {
            execute: () => `Hello! I'm Bharat, a BCA graduate focused on full-stack web development.`,
            description: "Say hello"
        },
        help: {
            execute: () => `Available commands:
about - Learn about me and my background
skills - View my technical skills and expertise
projects - Explore my featured projects
education - Check my academic qualifications
contact - Get my contact information
clear - Clear the terminal screen
github - Open my GitHub profile
linkedin - Open my LinkedIn profile
kaggle - Open my Kaggle profile
welcome - Show welcome message
date - Show current date and time
echo - Echo back your input
theme - Toggle between light/dark mode`,
            description: "Show available commands"
        },
        about: {
            execute: () => `I'm Bharat Poojari - A passionate developer from Sirsi, Karnataka.
🎓 BCA Graduate (2022-2025)
💻 Full-Stack Developer
🚀 Building practical, user-focused web applications
🌱 Currently learning: TypeScript, React, and application architecture
💡 Interests: Web Development, Open Source

I believe in writing clean, efficient code and creating user-friendly applications that solve real-world problems.`,
            description: "Learn about me"
        },
        skills: {
            execute: () => `Technical Skills:

Frontend Development:
• HTML5, CSS3, JavaScript (ES6+)
• Responsive Web Design
• Modern CSS (Grid, Flexbox, Animations)

Backend Development:
• Python, Node.js
• MySQL, Database Design
• RESTful APIs

Tools & Technologies:
• Git & GitHub
• VS Code, Chrome DevTools
• Docker, Linux Command Line

Currently Learning:
• React.js, TypeScript
• Full-stack application architecture
• Advanced JavaScript`,
            description: "View technical skills"
        },
        projects: {
            execute: () => `Featured Projects:

1. Portfolio Website
   - Responsive design with animations
   - Built with pure HTML, CSS, JavaScript
   - Live: bharat-poojari.vercel.app

2. Dynamic College Website
   - Full-stack website with admin panel
   - Technologies: HTML, CSS, JS, PHP, MySQL
   - Live: jmj-institution.kesug.com

3. Code Polish (VS Code Extension)
   - Code formatting and minification
   - Built with TypeScript
   - GitHub: github.com/bharat-poojari/codepolish`,
            description: "Explore projects"
        },
        education: {
            execute: () => `Education History:

🎓 Bachelor of Computer Applications (BCA)
• J.M.J BCA Degree College, Chipgi
• 2022 - 2025 | CGPA: 9.02/10

🎓 Pre-University Education (PUC)
• Shree Marikamba Govt PU College, Sirsi
• 2019 - 2021 | Percentage: 87.3%

🎓 SSLC
• Surya Narayana High School, Sirsi
• 2018 - 2019 | Percentage: 93%`,
            description: "View education"
        },
        contact: {
            execute: () => `Contact Information:

📧 Email: bharatp0316@gmail.com
📱 Phone: +91 80737 50997
📍 Location: Sirsi, Karnataka, India

Social Links:
• GitHub: github.com/bharat-poojari
• LinkedIn: linkedin.com/in/bharat-poojari
• Kaggle: kaggle.com/bharatpoojari

Feel free to reach out for collaborations or opportunities!`,
            description: "Get contact info"
        },
        clear: {
            execute: () => {
                if (terminalOutputContent) {
                    terminalOutputContent.innerHTML = '';
                }
                return '';
            },
            description: "Clear terminal"
        },
        github: {
            execute: () => {
                window.open('https://github.com/bharat-poojari', '_blank');
                return 'Opening GitHub profile in new tab... 🚀';
            },
            description: "Open GitHub"
        },
        linkedin: {
            execute: () => {
                window.open('https://linkedin.com/in/bharat-poojari', '_blank');
                return 'Opening LinkedIn profile in new tab... 💼';
            },
            description: "Open LinkedIn"
        },
        kaggle: {
            execute: () => {
                window.open('https://kaggle.com/bharatpoojari', '_blank');
                return 'Opening Kaggle profile in new tab... 📊';
            },
            description: "Open Kaggle"
        },
        welcome: {
            execute: () => `Welcome to Bharat's Interactive Portfolio Terminal! 👋

This terminal simulates a real command-line interface where you can:
• Learn about my skills and experience
• Explore my projects and education
• Get my contact information
• Practice basic terminal commands

Type 'help' to see all available commands.
Try 'skills' or 'projects' to get started!`,
            description: "Show welcome message"
        },
        date: {
            execute: () => {
                const now = new Date();
                return `Current date and time: ${now.toLocaleString()} 📅`;
            },
            description: "Show current date/time"
        },
        echo: {
            execute: (args) => args.join(' '),
            description: "Echo back input"
        },
        theme: {
            execute: () => {
                const body = document.body;
                const isDark = body.classList.contains('dark-theme');

                if (isDark) {
                    body.classList.remove('dark-theme');
                    body.classList.add('light-theme');
                    localStorage.setItem('theme', 'light-theme');
                } else {
                    body.classList.remove('light-theme');
                    body.classList.add('dark-theme');
                    localStorage.setItem('theme', 'dark-theme');
                }

                // Update theme toggle
                const themeToggle = document.getElementById('themeToggle');
                if (themeToggle) {
                    const sunIcon = themeToggle.querySelector('.fa-sun');
                    const moonIcon = themeToggle.querySelector('.fa-moon');
                    if (sunIcon && moonIcon) {
                        if (isDark) {
                            sunIcon.style.opacity = '1';
                            moonIcon.style.opacity = '0.5';
                        } else {
                            sunIcon.style.opacity = '0.5';
                            moonIcon.style.opacity = '1';
                        }
                    }
                }

                // Update terminal theme button
                if (terminalTheme) {
                    const icon = terminalTheme.querySelector('i');
                    if (icon) {
                        icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
                    }
                }

                return `Switched to ${isDark ? 'light' : 'dark'} theme 🌗`;
            },
            description: "Toggle theme"
        },
    };

    let commandHistory = [];
    let historyIndex = -1;
    let currentInput = '';

    function showSuggestions(input) {
        if (!terminalSuggestions) return;

        if (!input) {
            terminalSuggestions.style.display = 'none';
            return;
        }

        const matchingCommands = Object.entries(commands)
            .filter(([cmd, data]) => cmd.startsWith(input.toLowerCase()))
            .slice(0, 5);

        if (matchingCommands.length === 0) {
            terminalSuggestions.style.display = 'none';
            return;
        }

        terminalSuggestions.innerHTML = matchingCommands
            .map(([cmd, data]) => `
                <div class="terminal-suggestion" data-command="${cmd}">
                    <strong>${cmd}</strong> - ${data.description}
                </div>
            `)
            .join('');

        terminalSuggestions.style.display = 'block';
    }

    function executeCommand(input) {
        const normalizedInput = input.trim();
        const [command, ...args] = normalizedInput.split(/\s+/);
        const lowerCommand = command.toLowerCase();

        if (input.trim()) {
            commandHistory.unshift(input.trim());
            historyIndex = -1;
            commandCount++;
            if (commandsExecuted) {
                commandsExecuted.textContent = commandCount;
            }
        }

        addTerminalLine(normalizedInput);

        let output = '';
        if (commands.hasOwnProperty(lowerCommand)) {
            try {
                output = commands[lowerCommand].execute(args);
            } catch (error) {
                output = `Error executing command: ${error.message}`;
            }
        } else {
            output = `Command not found: ${command}. Type 'help' for available commands.`;
        }

        if (output) {
            addTerminalOutput(output);
        }

        autoScrollTerminal();
    }

    function addTerminalLine(text) {
        if (!terminalOutputContent) return;
        const line = document.createElement('div');
        line.className = 'terminal-line';
        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = 'bharat@portfolio:~$';
        const command = document.createElement('span');
        command.className = 'terminal-command';
        command.textContent = text;
        line.append(prompt, command);
        terminalOutputContent.appendChild(line);
    }

    function addTerminalOutput(text) {
        if (!terminalOutputContent) return;
        const lines = text.split('\n');
        lines.forEach(line => {
            const output = document.createElement('div');
            output.className = 'terminal-output-line';
            output.textContent = line;
            terminalOutputContent.appendChild(output);
        });
    }

    function autoScrollTerminal() {
        if (!terminalOutputContent) return;
        setTimeout(() => {
            terminalOutputContent.scrollTop = terminalOutputContent.scrollHeight;
        }, 10);
    }

    if (terminalInput) {
        terminalInput.addEventListener('input', function(e) {
            showSuggestions(this.value);
        });

        terminalInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const command = this.value.trim();
                this.value = '';
                if (terminalSuggestions) {
                    terminalSuggestions.style.display = 'none';
                }
                if (command) {
                    executeCommand(command);
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (commandHistory.length > 0) {
                    if (historyIndex < commandHistory.length - 1) {
                        historyIndex++;
                        this.value = commandHistory[historyIndex];
                    }
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    this.value = commandHistory[historyIndex];
                } else {
                    historyIndex = -1;
                    this.value = currentInput;
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                if (terminalSuggestions) {
                    const suggestions = terminalSuggestions.querySelectorAll('.terminal-suggestion');
                    if (suggestions.length > 0) {
                        const firstSuggestion = suggestions[0];
                        const command = firstSuggestion.getAttribute('data-command');
                        this.value = command;
                        terminalSuggestions.style.display = 'none';
                    }
                }
            } else if (e.key.length === 1) {
                currentInput = this.value;
                historyIndex = -1;
            }
        });
    }

    if (terminalSuggestions) {
        terminalSuggestions.addEventListener('click', function(e) {
            const suggestion = e.target.closest('.terminal-suggestion');
            if (suggestion && terminalInput) {
                const command = suggestion.getAttribute('data-command');
                terminalInput.value = command;
                terminalInput.focus();
                terminalSuggestions.style.display = 'none';
            }
        });
    }

    if (terminalClear) {
        terminalClear.addEventListener('click', function() {
            if (terminalOutputContent) {
                terminalOutputContent.innerHTML = '';
            }
            addTerminalOutput('Terminal output cleared.');
            autoScrollTerminal();
        });
    }

    if (terminalCopy) {
        terminalCopy.addEventListener('click', async function() {
            if (!terminalOutputContent) return;
            const content = terminalOutputContent.textContent;
            const button = this;

            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(content);
                } else {
                    const textArea = document.createElement('textarea');
                    textArea.value = content;
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    document.body.appendChild(textArea);
                    textArea.select();
                    const copied = document.execCommand('copy');
                    textArea.remove();
                    if (!copied) throw new Error('Clipboard access is unavailable');
                }

                button.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>';
                button.setAttribute('aria-label', 'Terminal output copied');
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy" aria-hidden="true"></i>';
                    button.setAttribute('aria-label', 'Copy terminal output');
                }, 1500);
            } catch (error) {
                button.setAttribute('aria-label', 'Could not copy terminal output');
            }
        });
    }

    if (terminalTheme) {
        terminalTheme.addEventListener('click', function() {
            commands.theme.execute();
        });
    }

    const terminalBody = document.getElementById('terminal-body');
    if (terminalBody) {
        terminalBody.addEventListener('click', function() {
            if (terminalInput) {
                terminalInput.focus();
            }
        });
    }

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.terminal-input-container') && terminalSuggestions) {
            terminalSuggestions.style.display = 'none';
        }
    });

    autoScrollTerminal();
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'var(--navbar-bg)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'var(--navbar-bg)';
                navbar.style.boxShadow = 'none';
            }
        }
    });
}

// Projects initialization with filtering
async function initLiveProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const filterButtons = document.querySelectorAll('#projects-filter .filter-btn');
    const noProjectsMessage = document.getElementById('no-projects');
    const status = document.getElementById('projects-status');
    const categoryLabels = { frontend: 'Web', fullstack: 'Full Stack', desktop: 'Desktop', extension: 'VS Code Extension', backend: 'AI & Models' };
    const priorityOrder = ['offyai', 'furniqo', 'shadow-portfolio', 'codepolish', 'bharat-portfolio', 'primenews'];
    const priorityRank = new Map(priorityOrder.map((name, index) => [name, index]));
    const titleOverrides = {
        offyai: 'OffyAI',
        furniqo: 'Furniqo',
        'shadow-portfolio': 'Shadow Portfolio',
        codepolish: 'CodePolish',
        'bharat-portfolio': 'This Portfolio',
        primenews: 'PrimeNews'
    };
    const fullStackRepos = new Set(['furniqo', 'student-management-system', 'college-website']);
    const desktopRepos = new Set(['offyai', 'offyai-website']);
    function render(projects, filter = 'all') {
        if (!projectsGrid) return;
        projectsGrid.replaceChildren();
        const visibleProjects = filter === 'all' ? projects : projects.filter(project => project.category === filter);
        visibleProjects.forEach(project => projectsGrid.appendChild(createProjectCard(project)));
        if (noProjectsMessage) noProjectsMessage.style.display = visibleProjects.length ? 'none' : 'block';
        if (status) status.textContent = `Showing ${visibleProjects.length} of ${projects.length} public repositories, updated from GitHub`;
    }

    try {
        if (status) status.textContent = 'Fetching public repositories from GitHub...';
        if (projectsGrid) projectsGrid.setAttribute('aria-busy', 'true');
        const repositories = [];
        for (let page = 1; ; page++) {
            const response = await fetch(`https://api.github.com/users/bharat-poojari/repos?per_page=100&page=${page}&sort=updated&direction=desc`, { cache: 'no-store' });
            if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
            const pageRepositories = await response.json();
            repositories.push(...pageRepositories);
            if (pageRepositories.length < 100) break;
        }
        const publicRepositories = repositories
            .filter(repository => !repository.private && !repository.fork)
            .sort((first, second) => {
                const firstRank = priorityRank.get(first.name.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
                const secondRank = priorityRank.get(second.name.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
                return firstRank - secondRank || new Date(second.updated_at) - new Date(first.updated_at);
            });
        const projects = publicRepositories.map(repository => {
            const repoName = repository.name.toLowerCase();
            const category = desktopRepos.has(repoName) ? 'desktop' :
                repoName === 'codepolish' ? 'extension' :
                repoName === 'offy_ai' ? 'backend' :
                fullStackRepos.has(repoName) ? 'fullstack' : 'frontend';
            return {
                id: repository.id,
                title: titleOverrides[repoName] || repository.name,
                category,
                categoryLabel: categoryLabels[category],
                description: (repository.description || 'No description has been published for this repository.').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim(),
                gallery: [],
                repository
            };
        });
        let nextProject = 0;
        const imageWorkers = Array.from({ length: Math.min(6, projects.length) }, async () => {
            while (nextProject < projects.length) {
                const project = projects[nextProject++];
                project.gallery = await fetchRepositoryImagePaths(project.repository);
            }
        });
        await Promise.all(imageWorkers);
        if (!projects.length) throw new Error('No public repositories were returned');
        window.featuredProjects = projects;
        if (projectsGrid) projectsGrid.removeAttribute('aria-busy');
        render(projects);
        const projectCount = document.getElementById('github-project-count');
        const lineCount = document.getElementById('github-line-count');
        const languageCount = document.getElementById('github-language-count');
        const starCount = document.getElementById('github-repo-stars');
        const statsStatus = document.getElementById('github-stats-status');
        if (projectCount) projectCount.textContent = publicRepositories.length.toLocaleString();
        if (lineCount) lineCount.textContent = '--';
        if (languageCount) languageCount.textContent = new Set(publicRepositories.map(repository => repository.language).filter(Boolean)).size.toLocaleString();
        if (starCount) starCount.textContent = projects.reduce((total, project) => total + (project.repository.stargazers_count || 0), 0).toLocaleString();
        if (statsStatus) statsStatus.textContent = 'Live repository metadata from GitHub';
        void initGithubProjectStats(projects.map(project => ({ github: project.repository.html_url })));

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(filterButton => {
                    const isActive = filterButton === this;
                    filterButton.classList.toggle('active', isActive);
                    filterButton.setAttribute('aria-pressed', String(isActive));
                });
                render(projects, this.dataset.filter);
            });
        });
    } catch (error) {
        if (projectsGrid) projectsGrid.removeAttribute('aria-busy');
        if (status) {
            status.textContent = 'Projects could not be fetched from GitHub.';
            const retryButton = document.createElement('button');
            retryButton.className = 'projects-retry';
            retryButton.type = 'button';
            retryButton.textContent = 'Retry';
            retryButton.addEventListener('click', () => initLiveProjects(), { once: true });
            status.append(' ', retryButton);
        }
        if (noProjectsMessage) noProjectsMessage.style.display = 'none';
    }
}

function initProjects() {
    initLiveProjects();
}

function getRepositoryImageUrl(repository, path) {
    const branch = encodeURIComponent(repository.default_branch || 'main');
    const encodedPath = path.split('/').map(encodeURIComponent).join('/');
    return `https://raw.githubusercontent.com/${repository.full_name}/${branch}/${encodedPath}`;
}

async function fetchRepositoryImagePaths(repository) {
    try {
        const response = await fetch(`https://api.github.com/repos/${repository.full_name}/git/trees/${encodeURIComponent(repository.default_branch || 'main')}?recursive=1`);
        if (!response.ok) return [];
        const tree = await response.json();
        const imageFile = /\.(avif|bmp|gif|ico|jpe?g|jfif|png|svg|tiff?|webp)$/i;
        return (tree.tree || [])
            .filter(entry => entry.type === 'blob' && imageFile.test(entry.path))
            .map(entry => entry.path);
    } catch {
        return [];
    }
}

function createProjectLink(url, label, icon, className = '') {
    const link = document.createElement('a');
    link.className = `project-link ${className}`.trim();
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.innerHTML = `<i class="${icon}" aria-hidden="true"></i><span>${label}</span>`;
    return link;
}

function getProjectHomepage(repository) {
    try {
        const homepage = new URL(repository.homepage);
        return homepage.protocol === 'https:' ? homepage.href : null;
    } catch {
        return null;
    }
}

function createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.dataset.projectId = project.id;
    card.dataset.category = project.category;

    const imageFrame = document.createElement('div');
    imageFrame.className = 'project-image';
    if (project.gallery.length) {
        const image = document.createElement('img');
        image.src = getRepositoryImageUrl(project.repository, project.gallery[0]);
        image.alt = `${project.title} project preview`;
        image.loading = 'lazy';
        image.addEventListener('error', () => {
            image.remove();
            imageFrame.classList.add('project-image-fallback');
            const fallbackIcon = document.createElement('i');
            fallbackIcon.className = 'fas fa-laptop-code';
            fallbackIcon.setAttribute('aria-hidden', 'true');
            imageFrame.prepend(fallbackIcon);
        }, { once: true });
        imageFrame.appendChild(image);
    } else {
        imageFrame.classList.add('project-image-fallback');
        const fallbackIcon = document.createElement('i');
        fallbackIcon.className = 'fas fa-laptop-code';
        fallbackIcon.setAttribute('aria-hidden', 'true');
        imageFrame.appendChild(fallbackIcon);
    }

    const category = document.createElement('span');
    category.className = 'project-badge';
    category.textContent = project.categoryLabel;
    imageFrame.appendChild(category);

    const content = document.createElement('div');
    content.className = 'project-content';
    const heading = document.createElement('h3');
    heading.className = 'project-title';
    heading.textContent = project.title;
    const description = document.createElement('p');
    description.className = 'project-description';
    description.textContent = project.description;

    const tags = document.createElement('div');
    tags.className = 'project-tech';
    [project.repository.language, ...(project.repository.topics || []).slice(0, 2)].filter(Boolean).forEach(value => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = value;
        tags.appendChild(tag);
    });

    const metadata = document.createElement('div');
    metadata.className = 'project-card-meta';
    metadata.innerHTML = `<span><i class="far fa-star" aria-hidden="true"></i> ${project.repository.stargazers_count}</span><span><i class="fas fa-code-branch" aria-hidden="true"></i> ${project.repository.forks_count}</span>`;

    const links = document.createElement('div');
    links.className = 'project-links';
    const homepage = getProjectHomepage(project.repository);
    if (homepage) {
        links.classList.add('has-live-link');
        const isMarketplaceLink = new URL(homepage).hostname === 'marketplace.visualstudio.com';
        links.appendChild(createProjectLink(homepage, isMarketplaceLink ? 'Install' : 'Live', 'fas fa-arrow-up-right-from-square'));
    }
    links.appendChild(createProjectLink(project.repository.html_url, 'GitHub', 'fab fa-github'));
    links.appendChild(createProjectLink(`${project.repository.html_url}/tree/${encodeURIComponent(project.repository.default_branch)}`, 'View Code', 'fas fa-code'));
    const detailsButton = document.createElement('button');
    detailsButton.className = 'project-link secondary view-details';
    detailsButton.type = 'button';
    detailsButton.innerHTML = '<i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i><span>Details</span>';
    detailsButton.addEventListener('click', () => showProjectDetails(project));
    links.appendChild(detailsButton);

    content.append(heading, description, tags, metadata, links);
    card.append(imageFrame, content);
    return card;
}

// Modal functionality
function initModals() {
    const projectModal = document.getElementById('project-modal');
    const pdfModal = document.getElementById('pdf-modal');
    const certificateModal = document.getElementById('certificate-modal');
    const certificatePdfModal = document.getElementById('certificate-pdf-modal');
    const closeButtons = document.querySelectorAll('.modal-close');

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (projectModal) projectModal.style.display = 'none';
            if (pdfModal) pdfModal.style.display = 'none';
            if (certificateModal) certificateModal.style.display = 'none';
            if (certificatePdfModal) certificatePdfModal.style.display = 'none';
        });
    });

    window.addEventListener('click', function(e) {
        if (e.target === projectModal) {
            projectModal.style.display = 'none';
        }
        if (e.target === pdfModal) {
            pdfModal.style.display = 'none';
        }
        if (e.target === certificateModal) {
            certificateModal.style.display = 'none';
        }
        if (e.target === certificatePdfModal) {
            certificatePdfModal.style.display = 'none';
        }
    });

    document.querySelectorAll('.btn-view-docs').forEach(button => {
        button.addEventListener('click', function() {
            const docType = this.getAttribute('data-doc');
            showPDFDocument(docType);
        });
    });
}

function showProjectDetails(project) {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    if (!modal || !modalTitle || !modalContent) return;
    modalTitle.textContent = project.title;
    modalContent.replaceChildren();
    const details = document.createElement('div');
    details.className = 'project-details';
    const hero = document.createElement('div');
    hero.className = 'project-detail-hero';
    const gallery = document.createElement('div');
    gallery.className = 'project-gallery';
    gallery.setAttribute('aria-label', `${project.title} screenshot carousel`);
    gallery.innerHTML = '<div class="project-gallery-loading"><i class="fas fa-spinner fa-spin" aria-hidden="true"></i><span>Loading repository screenshots...</span></div>';

    const overview = document.createElement('div');
    overview.className = 'project-detail-overview';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'project-detail-eyebrow';
    eyebrow.textContent = project.categoryLabel;
    const title = document.createElement('h3');
    title.textContent = project.title;
    const description = document.createElement('p');
    description.className = 'project-detail-description';
    description.textContent = project.description;
    const actions = document.createElement('div');
    actions.className = 'project-detail-actions';
    actions.appendChild(createProjectLink(project.repository.html_url, 'GitHub', 'fab fa-github'));
    actions.appendChild(createProjectLink(`${project.repository.html_url}/tree/${encodeURIComponent(project.repository.default_branch)}`, 'View Code', 'fas fa-code'));
    const homepage = getProjectHomepage(project.repository);
    if (homepage) {
        const isMarketplaceLink = new URL(homepage).hostname === 'marketplace.visualstudio.com';
        actions.appendChild(createProjectLink(homepage, isMarketplaceLink ? 'Install' : 'Live Site', 'fas fa-arrow-up-right-from-square'));
    }
    overview.append(eyebrow, title, description, actions);
    hero.append(gallery, overview);

    const facts = document.createElement('div');
    facts.className = 'project-facts';
    const factEntries = [
        ['Stars', project.repository.stargazers_count],
        ['Forks', project.repository.forks_count],
        ['Open issues', project.repository.open_issues_count],
        ['Primary language', project.repository.language || 'Not specified'],
        ['License', project.repository.license?.spdx_id || 'Not specified'],
        ['Last updated', new Date(project.repository.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })]
    ];
    factEntries.forEach(([label, value]) => {
        const fact = document.createElement('div');
        fact.className = 'project-fact';
        const factLabel = document.createElement('span');
        factLabel.textContent = label;
        const factValue = document.createElement('strong');
        factValue.textContent = String(value);
        fact.append(factLabel, factValue);
        facts.appendChild(fact);
    });

    const languages = document.createElement('section');
    languages.className = 'project-language-panel';
    languages.innerHTML = '<div class="project-detail-section-heading"><span>Repository data</span><h4>Languages</h4></div><div class="project-language-list" role="status">Fetching language breakdown from GitHub...</div>';
    details.append(hero, facts, languages);
    modalContent.appendChild(details);
    modal.style.display = 'flex';
    modal.querySelector('.modal-body')?.scrollTo(0, 0);

    loadProjectGallery(project, gallery);
    fetch(project.repository.languages_url)
        .then(response => {
            if (!response.ok) throw new Error('GitHub language data unavailable');
            return response.json();
        })
        .then(languageData => renderProjectLanguages(languages.querySelector('.project-language-list'), languageData))
        .catch(() => {
            languages.querySelector('.project-language-list').textContent = 'GitHub language data is currently unavailable.';
        });
}

async function loadProjectGallery(project, container) {
    const paths = project.gallery || [];

    container.replaceChildren();
    if (!paths.length) {
        const emptyState = document.createElement('div');
        emptyState.className = 'project-gallery-empty';
        emptyState.innerHTML = '<i class="far fa-images" aria-hidden="true"></i><span>No public preview images were found in this repository.</span>';
        container.appendChild(emptyState);
        return;
    }

    const image = document.createElement('img');
    image.className = 'project-gallery-image';
    image.alt = `${project.title} repository screenshot 1 of ${paths.length}`;
    image.loading = 'eager';
    const caption = document.createElement('span');
    caption.className = 'project-gallery-caption';
    const controls = document.createElement('div');
    controls.className = 'project-gallery-controls';
    const previous = document.createElement('button');
    previous.type = 'button';
    previous.className = 'gallery-control';
    previous.setAttribute('aria-label', 'Previous screenshot');
    previous.innerHTML = '<i class="fas fa-arrow-left" aria-hidden="true"></i>';
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'gallery-control';
    next.setAttribute('aria-label', 'Next screenshot');
    next.innerHTML = '<i class="fas fa-arrow-right" aria-hidden="true"></i>';
    const count = document.createElement('span');
    count.className = 'project-gallery-count';
    controls.append(previous, count, next);
    container.append(image, caption, controls);

    let activeIndex = 0;
    function showImage(index) {
        activeIndex = (index + paths.length) % paths.length;
        image.src = getRepositoryImageUrl(project.repository, paths[activeIndex]);
        image.alt = `${project.title} repository screenshot ${activeIndex + 1} of ${paths.length}`;
        caption.textContent = paths[activeIndex].split('/').pop().replace(/[-_]/g, ' ');
        count.textContent = `${activeIndex + 1} / ${paths.length}`;
        previous.disabled = paths.length < 2;
        next.disabled = paths.length < 2;
    }
    previous.addEventListener('click', () => showImage(activeIndex - 1));
    next.addEventListener('click', () => showImage(activeIndex + 1));
    showImage(0);
}

function renderProjectLanguages(container, languageData) {
    if (!container) return;
    const languages = Object.entries(languageData).sort((first, second) => second[1] - first[1]);
    const totalBytes = languages.reduce((total, [, bytes]) => total + bytes, 0);
    container.replaceChildren();
    if (!totalBytes) {
        container.textContent = 'GitHub has no language breakdown for this repository.';
        return;
    }

    languages.forEach(([name, bytes]) => {
        const row = document.createElement('div');
        row.className = 'project-language-row';
        const label = document.createElement('div');
        label.className = 'project-language-label';
        const language = document.createElement('span');
        language.textContent = name;
        const percentage = document.createElement('span');
        percentage.textContent = `${Math.round(bytes / totalBytes * 100)}%`;
        label.append(language, percentage);
        const meter = document.createElement('div');
        meter.className = 'project-language-meter';
        meter.setAttribute('role', 'progressbar');
        meter.setAttribute('aria-label', `${name} share of repository languages`);
        meter.setAttribute('aria-valuemin', '0');
        meter.setAttribute('aria-valuemax', '100');
        meter.setAttribute('aria-valuenow', String(Math.round(bytes / totalBytes * 100)));
        const fill = document.createElement('span');
        fill.style.width = `${bytes / totalBytes * 100}%`;
        meter.appendChild(fill);
        row.append(label, meter);
        container.appendChild(row);
    });
}

// PDF Viewer functionality
function initPDFViewer() {
    const pdfModal = document.getElementById('pdf-modal');
    const pdfIframe = document.getElementById('pdf-iframe');
    const pdfTitle = document.getElementById('pdf-title');
    const pdfLoading = document.getElementById('pdf-loading');
    const pdfError = document.getElementById('pdf-error');
    const pdfModalClose = document.getElementById('pdf-modal-close');

    const pdfDocuments = {
        'bca-marks': {
            title: 'BCA Marksheet',
            file: 'certificates/BCA_Marksheet.pdf'
        },
        'puc-marks': {
            title: 'PUC Marksheet',
            file: 'certificates/PUC_Marksheet.pdf'
        },
        'sslc-marks': {
            title: 'SSLC Marksheet',
            file: 'certificates/SSLC_Marksheet.pdf'
        }
    };

    const certificatePDFs = {
        1: {
            title: 'Frontend Developer Certification',
            file: 'certificates/Frontend_Certificate.pdf'
        },
        2: {
            title: 'IoT Network Specialist',
            file: 'certificates/IoT_Certificate.pdf'
        },
    };

    if (pdfModalClose) {
        pdfModalClose.addEventListener('click', function() {
            closePDFModal();
        });
    }

    if (pdfModal) {
        pdfModal.addEventListener('click', function(e) {
            if (e.target === pdfModal) {
                closePDFModal();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && pdfModal && pdfModal.style.display === 'block') {
            closePDFModal();
        }
    });

    window.showPDFDocument = function(docType, certificateId = null) {
        let documentInfo;
        if (certificateId) {
            documentInfo = certificatePDFs[certificateId];
        } else {
            documentInfo = pdfDocuments[docType];
        }

        if (!documentInfo) {
            showError('Document not found');
            return;
        }

        if (pdfTitle) pdfTitle.textContent = documentInfo.title;
        if (pdfLoading) pdfLoading.style.display = 'flex';
        if (pdfError) pdfError.style.display = 'none';
        if (pdfIframe) pdfIframe.style.display = 'none';
        if (pdfModal) pdfModal.style.display = 'block';

        loadPDFInIframe(pdfIframe, documentInfo.file);
    };

    function loadPDFInIframe(iframe, url) {
        if (!iframe) return;

        if (pdfLoading) pdfLoading.style.display = 'flex';
        if (pdfError) pdfError.style.display = 'none';
        iframe.style.display = 'none';

        iframe.src = url;

        iframe.onload = function() {
            if (pdfLoading) pdfLoading.style.display = 'none';
            iframe.style.display = 'block';
        };

        iframe.onerror = function() {
            showError('Failed to load PDF. Please check if the file exists.');
        };
    }

    function showError(message = 'Failed to load document') {
        if (pdfLoading) pdfLoading.style.display = 'none';
        if (pdfIframe) pdfIframe.style.display = 'none';
        if (pdfError) {
            pdfError.style.display = 'block';
            const errorText = pdfError.querySelector('p');
            if (errorText) {
                errorText.textContent = message;
            }
        }
    }

    function closePDFModal() {
        if (pdfModal) pdfModal.style.display = 'none';
        if (pdfIframe) pdfIframe.src = '';
    }
}

// Certificate PDF Viewer
function initCertificatePDFViewer() {
    const pdfModal = document.getElementById('certificate-pdf-modal');
    const pdfIframe = document.getElementById('certificate-pdf-iframe');
    const pdfTitle = document.getElementById('certificate-pdf-title');
    const pdfLoading = document.getElementById('certificate-pdf-loading');
    const pdfError = document.getElementById('certificate-pdf-error');
    const pdfModalClose = document.getElementById('certificate-pdf-modal-close');

    if (pdfModalClose) {
        pdfModalClose.addEventListener('click', function() {
            closeCertificatePDFModal();
        });
    }

    if (pdfModal) {
        pdfModal.addEventListener('click', function(e) {
            if (e.target === pdfModal) {
                closeCertificatePDFModal();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && pdfModal && pdfModal.style.display === 'block') {
            closeCertificatePDFModal();
        }
    });

    window.showCertificatePDF = function(certificate) {
        if (!certificate || !certificate.file) {
            showCertificateError('Certificate PDF not available');
            return;
        }

        if (pdfTitle) pdfTitle.textContent = `${certificate.title} - Certificate`;
        if (pdfLoading) pdfLoading.style.display = 'flex';
        if (pdfError) pdfError.style.display = 'none';
        if (pdfIframe) pdfIframe.style.display = 'none';
        if (pdfModal) pdfModal.style.display = 'block';

        loadPDFInIframe(pdfIframe, certificate.file);
    };

    function loadPDFInIframe(iframe, url) {
        if (!iframe) return;

        if (pdfLoading) pdfLoading.style.display = 'flex';
        if (pdfError) pdfError.style.display = 'none';
        iframe.style.display = 'none';

        iframe.src = url;

        iframe.onload = function() {
            if (pdfLoading) pdfLoading.style.display = 'none';
            iframe.style.display = 'block';
        };

        iframe.onerror = function() {
            showCertificateError('Failed to load certificate. Please check if the file exists.');
        };
    }

    function showCertificateError(message = 'Failed to load certificate') {
        if (pdfLoading) pdfLoading.style.display = 'none';
        if (pdfIframe) pdfIframe.style.display = 'none';
        if (pdfError) {
            pdfError.style.display = 'block';
            const errorText = pdfError.querySelector('p');
            if (errorText) {
                errorText.textContent = message;
            }
        }
    }

    function closeCertificatePDFModal() {
        if (pdfModal) pdfModal.style.display = 'none';
        if (pdfIframe) pdfIframe.src = '';
    }
}

// Education Section
function initEducationSection() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.timeline-item, .stat-item').forEach(item => {
        observer.observe(item);
    });

    document.querySelectorAll('.btn-view-docs').forEach(button => {
        button.addEventListener('click', function() {
            const docType = this.getAttribute('data-doc');
            if (window.showPDFDocument) {
                window.showPDFDocument(docType);
            }
        });
    });
}

// Certificates Section
function initCertificatesSection() {
    const certificatesGrid = document.getElementById('certificates-grid');
    const filterButtons = document.querySelectorAll('#certificates-filter .filter-btn');
    const noCertificatesMessage = document.getElementById('no-certificates');

    const certificates = [{
            id: 1,
            title: "Frontend Developer Certification",
            description: "Comprehensive frontend development certification covering modern web technologies, responsive design, and user experience principles.",
            category: "development",
            status: "verified",
            image: "images/certificates/FrontendDeveloper.webp",
            provider: "SIDH & Reliance Foundation Skilling Academy",
            issueDate: "July 2025",
            expiryDate: "July 2028",
            skills: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "UI/UX"],
            file: "certificates/Frontend_Certificate.pdf",
            details: {
                overview: "This certification validates expertise in modern frontend development practices, including responsive web design, JavaScript frameworks, and user experience optimization.",
                learningOutcomes: [
                    "Master modern HTML5 and CSS3 features",
                    "Build responsive and accessible web applications",
                    "Implement JavaScript ES6+ features effectively",
                    "Optimize web performance and user experience",
                    "Work with modern development tools and workflows"
                ],
                projects: [
                    "Responsive portfolio website",
                    "Interactive web applications",
                    "Mobile-first design implementations"
                ],
            }
        },
        {
            id: 2,
            title: "IoT Network Specialist",
            description: "Specialized certification in Internet of Things networking, protocols, and implementation strategies for connected devices.",
            category: "iot",
            status: "verified",
            image: "images/certificates/IoT-Network-specialist.webp",
            provider: "SIDH & Reliance Foundation Skilling Academy",
            issueDate: "July 2025",
            expiryDate: "July 2028",
            skills: ["IoT Protocols", "Network Security", "Embedded Systems", "Cloud Integration"],
            file: "certificates/IoT_Certificate.pdf",
            details: {
                overview: "This certification demonstrates proficiency in IoT network architecture, protocol implementation, and security considerations for connected device ecosystems.",
                learningOutcomes: [
                    "Design and implement IoT network architectures",
                    "Configure and secure IoT communication protocols",
                    "Integrate IoT devices with cloud platforms",
                    "Implement data collection and analysis pipelines",
                    "Ensure security and privacy in IoT deployments"
                ],
                projects: [
                    "Smart home automation system",
                    "Industrial IoT monitoring solution",
                    "Agricultural IoT implementation"
                ],
            }
        }
    ];

    function renderCertificates(filter = 'all') {
        if (!certificatesGrid) return;

        certificatesGrid.innerHTML = '';
        const filteredCertificates = filter === 'all' ? certificates : certificates.filter(cert => cert.category === filter);

        if (filteredCertificates.length === 0) {
            if (noCertificatesMessage) {
                noCertificatesMessage.style.display = 'block';
            }
            return;
        }

        if (noCertificatesMessage) {
            noCertificatesMessage.style.display = 'none';
        }
        filteredCertificates.forEach(certificate => {
            const certificateCard = createCertificateCard(certificate);
            certificatesGrid.appendChild(certificateCard);
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(filterButton => {
                const isActive = filterButton === this;
                filterButton.classList.toggle('active', isActive);
                filterButton.setAttribute('aria-pressed', String(isActive));
            });

            const filter = this.getAttribute('data-filter');
            renderCertificates(filter);
        });
    });

    renderCertificates();
    window.certificatesData = certificates;
}

function createCertificateCard(certificate) {
    const card = document.createElement('div');
    card.className = 'certificate-card';
    card.setAttribute('data-certificate-id', certificate.id);
    card.setAttribute('data-category', certificate.category);

    const skillTags = certificate.skills.map(skill =>
        `<span class="tech-tag skill-tag">${skill}</span>`
    ).join('');

    const statusBadge = certificate.status === 'verified' ?
        '<div class="certificate-badge verified">Verified</div>' :
        certificate.status === 'pending' ?
        '<div class="certificate-badge pending">Pending</div>' :
        '<div class="certificate-badge expired">Expired</div>';

    const links = [];
    if (certificate.file) {
        links.push(`
            <button class="certificate-link view-certificate-pdf" data-certificate-id="${certificate.id}">
                <i class="fas fa-file-pdf"></i>
                View PDF
            </button>
        `);
    } else {
        links.push(`
            <button class="certificate-link disabled">
                <i class="fas fa-clock"></i>
                Coming Soon
            </button>
        `);
    }

    links.push(`
        <button class="certificate-link secondary view-certificate-details" data-certificate-id="${certificate.id}">
            <i class="fas fa-info-circle"></i>
            Details
        </button>
    `);

    // Create image HTML with fallback
    const imageHtml = certificate.image ?
        `<img src="${certificate.image}" alt="${certificate.title}" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<i class=\'fas fa-award\'></i>';">` :
        `<i class="fas fa-award"></i>`;

    card.innerHTML = `
        <div class="certificate-image">
            ${imageHtml}
            ${statusBadge}
        </div>
        <div class="certificate-content">
            <h3 class="certificate-title">${certificate.title}</h3>
            <p class="certificate-description">${certificate.description}</p>
            <div class="certificate-meta">
                <div class="meta-item">
                    <i class="fas fa-building"></i>
                    <span>${certificate.provider}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Issued: ${certificate.issueDate}</span>
                </div>
                ${certificate.expiryDate ? `
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>Expires: ${certificate.expiryDate}</span>
                    </div>
                ` : ''}
            </div>
            <div class="project-tech skills-tags">
                ${skillTags}
            </div>
            <div class="certificate-links">
                ${links.join('')}
            </div>
        </div>
    `;

    card.querySelector('.view-certificate-details').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const certificate = getCertificateById(parseInt(this.getAttribute('data-certificate-id')));
        showCertificateDetails(certificate);
    });

    if (certificate.file) {
        card.querySelector('.view-certificate-pdf').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const certificate = getCertificateById(parseInt(this.getAttribute('data-certificate-id')));
            showCertificatePDF(certificate);
        });
    }

    return card;
}

function getCertificateById(id) {
    if (!window.certificatesData) return null;
    return window.certificatesData.find(cert => cert.id === id);
}

// Certificate Modal functionality
function initCertificateModals() {
    const certificateModal = document.getElementById('certificate-modal');
    const certificateModalClose = document.getElementById('certificate-modal-close');

    if (certificateModalClose) {
        certificateModalClose.addEventListener('click', function() {
            if (certificateModal) {
                certificateModal.style.display = 'none';
            }
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === certificateModal) {
            certificateModal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && certificateModal && certificateModal.style.display === 'block') {
            certificateModal.style.display = 'none';
        }
    });
}

function showCertificateDetails(certificate) {
    const modal = document.getElementById('certificate-modal');
    const modalTitle = document.getElementById('certificate-modal-title');
    const modalStatus = document.getElementById('certificate-modal-status');
    const modalContent = document.getElementById('certificate-modal-content');

    if (!modal || !modalTitle || !modalContent) return;

    modalTitle.textContent = certificate.title;

    if (modalStatus) {
        modalStatus.textContent = certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1);
        modalStatus.className = `certificate-status-badge ${certificate.status}`;
    }

    const learningOutcomesList = certificate.details.learningOutcomes.map(outcome =>
        `<li>${outcome}</li>`
    ).join('');

    const projectsList = certificate.details.projects.map(project =>
        `<li>${project}</li>`
    ).join('');

    const skillTags = certificate.skills.map(skill =>
        `<span class="skill-tag">${skill}</span>`
    ).join('');

    modalContent.innerHTML = `
        <div class="certificate-details">
            <div class="certificate-main-content">
                <div class="detail-section">
                    <h3><i class="fas fa-info-circle"></i> Overview</h3>
                    <p>${certificate.details.overview}</p>
                </div>
                <div class="detail-section">
                    <h3><i class="fas fa-graduation-cap"></i> Learning Outcomes</h3>
                    <ul>
                        ${learningOutcomesList}
                    </ul>
                </div>
                <div class="detail-section">
                    <h3><i class="fas fa-tasks"></i> Projects</h3>
                    <ul>
                        ${projectsList}
                    </ul>
                </div>
            </div>
            <div class="certificate-sidebar">
                <div class="sidebar-section">
                    <h4><i class="fas fa-certificate"></i> Certificate Details</h4>
                    <div class="certificate-meta-grid">
                        <div class="meta-card">
                            <strong>Provider</strong>
                            <span>${certificate.provider}</span>
                        </div>
                        <div class="meta-card">
                            <strong>Issue Date</strong>
                            <span>${certificate.issueDate}</span>
                        </div>
                        ${certificate.expiryDate ? `
                            <div class="meta-card">
                                <strong>Expiry Date</strong>
                                <span>${certificate.expiryDate}</span>
                            </div>
                        ` : ''}
                        <div class="meta-card">
                            <strong>Status</strong>
                            <span class="certificate-status-badge ${certificate.status}">
                                ${certificate.status.charAt(0).toUpperCase() + certificate.status.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="sidebar-section">
                    <h4><i class="fas fa-cogs"></i> Skills</h4>
                    <div class="skills-tags">
                        ${skillTags}
                    </div>
                </div>
            </div>
        </div>
        <div class="certificate-links-modal">
            ${certificate.file ? `
                <button class="btn btn-primary view-certificate-pdf" data-certificate-id="${certificate.id}">
                    <i class="fas fa-file-pdf"></i>
                    View PDF Certificate
                </button>
            ` : `
                <button class="btn btn-secondary disabled">
                    <i class="fas fa-clock"></i>
                    PDF Coming Soon
                </button>
            `}
            <button class="btn btn-secondary" onclick="printCertificateDetails()">
                <i class="fas fa-print"></i>
                Print Details
            </button>
        </div>
    `;

    if (certificate.file) {
        const pdfButton = modalContent.querySelector('.view-certificate-pdf');
        if (pdfButton) {
            pdfButton.addEventListener('click', function() {
                if (window.showCertificatePDF) {
                    window.showCertificatePDF(certificate);
                }
                modal.style.display = 'none';
            });
        }
    }

    modal.style.display = 'block';
}

function showCertificatePDF(certificate) {
    if (window.showCertificatePDF) {
        window.showCertificatePDF(certificate);
    }
}

function printCertificateDetails() {
    const modal = document.getElementById('certificate-modal');

    const originalDisplay = modal.style.display;
    const originalOverflow = document.body.style.overflow;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    modal.classList.add('print-mode');

    void modal.offsetHeight;

    setTimeout(() => {
        window.print();

        setTimeout(() => {
            modal.classList.remove('print-mode');
            modal.style.display = originalDisplay;
            document.body.style.overflow = originalOverflow;
        }, 100);
    }, 100);
}

// Contact form with Formspree integration
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('form-success');
    const formStatus = document.getElementById('form-status');
    const resetButton = document.getElementById('send-another-message');

    if (!contactForm) return;

    const hideSuccessMessage = () => {
        if (successMessage) successMessage.hidden = true;
        if (formStatus) {
            formStatus.textContent = '';
            formStatus.removeAttribute('data-state');
        }
    };

    hideSuccessMessage();
    contactForm.hidden = false;

    if (resetButton) {
        resetButton.addEventListener('click', function() {
            contactForm.reset();
            contactForm.hidden = false;
            hideSuccessMessage();
            document.getElementById('name')?.focus();
        });
    }

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        if (!contactForm.reportValidity()) {
            return;
        }

        hideSuccessMessage();

        const originalText = submitBtn ? submitBtn.innerHTML : '';
        contactForm.setAttribute('aria-busy', 'true');
        if (formStatus) {
            formStatus.textContent = 'Sending your message...';
            formStatus.dataset.state = 'sending';
        }
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
        }

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                contactForm.reset();
                contactForm.hidden = true;
                if (successMessage) successMessage.hidden = false;
                if (formStatus) {
                    formStatus.textContent = '';
                    formStatus.removeAttribute('data-state');
                }
            } else {
                const data = await response.json().catch(() => ({}));
                const message = data.errors?.map(error => error.message).join(', ') || 'Your message could not be sent. Please try again.';
                if (formStatus) {
                    formStatus.textContent = message;
                    formStatus.dataset.state = 'error';
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            if (formStatus) {
                formStatus.textContent = 'A network error prevented sending. Please try again.';
                formStatus.dataset.state = 'error';
            }
        } finally {
            contactForm.removeAttribute('aria-busy');
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-category, .project-card, .timeline-item, .certificate-card').forEach(el => {
        observer.observe(el);
    });
}

// preload images for better performance
function preloadImages() {
    const imageUrls = [
        'images/projects/portfolio.jpg',
        'images/projects/college-website.jpg',
        'images/projects/code-polish.jpg',
        'images/projects/offyai.jpg',
        'images/certificates/frontend-cert.jpg',
        'images/certificates/iot-cert.jpg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Call this in initPortfolio
preloadImages();

// Main initialization function
function initPortfolio() {
    initThemeToggle();
    initHeroSection();
    initNavigation();
    initEnhancedTerminal();
    initEnhancedSkillsSection();
    initProjects();
    initModals();
    initContactForm();
    initScrollAnimations();
    initEducationSection();
    initPDFViewer();
    initCertificatesSection();
    initCertificatePDFViewer();
    initCertificateModals();
    preloadImages();

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .slide-in-left').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });

    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-certificate-pdf')) {
            const button = e.target.closest('.view-certificate-pdf');
            const certificateId = button.getAttribute('data-certificate-id');

            if (window.certificatesData && window.showCertificatePDF) {
                const certificate = window.certificatesData.find(cert => cert.id == certificateId);
                if (certificate) {
                    window.showCertificatePDF(certificate);
                } else {
                    alert('Certificate not found');
                }
            }
        }
    });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}

// Add additional styles
const style = document.createElement('style');
style.textContent = `
    .certificate-details .detail-section {
        margin-bottom: 2rem;
    }
    
    .certificate-details .detail-section h3 {
        color: var(--primary);
        margin-bottom: 1rem;
    }
    
    .certificate-details ul {
        padding-left: 1.5rem;
    }
    
    .certificate-details li {
        margin-bottom: 0.5rem;
    }
    
    .certificate-meta-grid {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .meta-card {
        background: var(--light-secondary);
        padding: 1rem;
        border-radius: var(--border-radius);
        border-left: 4px solid var(--primary);
    }
    
    .meta-card strong {
        display: block;
        color: var(--text-primary);
        margin-bottom: 0.25rem;
    }
    
    .meta-card span {
        color: var(--gray);
    }
    
    .certificate-links-modal {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
        flex-wrap: wrap;
    }
    
    .btn.w-100 {
        width: 100%;
    }
    
    @media (max-width: 768px) {
        .certificate-links-modal {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(style);