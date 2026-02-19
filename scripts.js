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
    initVisualizationToggles();
    initSkillsAnimation();
    initBubblesView();
}

function initVisualizationToggles() {
    const toggleButtons = document.querySelectorAll('.viz-toggle-btn');
    const views = {
        'cards': document.querySelector('.skills-cards-view'),
        'bubbles': document.querySelector('.skills-bubbles-view')
    };

    if (views.cards) {
        views.cards.classList.add('active');
        views.cards.style.display = 'block';
    }
    if (views.bubbles) {
        views.bubbles.classList.remove('active');
        views.bubbles.style.display = 'none';
    }

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const viewType = this.getAttribute('data-viz');

            toggleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            Object.values(views).forEach(view => {
                if (view) {
                    view.classList.remove('active');
                    view.style.display = 'none';
                }
            });

            if (views[viewType]) {
                views[viewType].classList.add('active');
                views[viewType].style.display = 'block';

                if (viewType === 'bubbles') {
                    setTimeout(initBubblesView, 100);
                } else if (viewType === 'cards') {
                    setTimeout(initSkillsAnimation, 100);
                }
            }
        });
    });
}

function initSkillsAnimation() {
    const skillItems = document.querySelectorAll('.skill-item');
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

function initBubblesView() {
    const bubblesContainer = document.getElementById('skills-bubbles');
    if (!bubblesContainer) return;

    bubblesContainer.innerHTML = '';

    const skills = [{
            name: 'HTML5',
            percentage: 95,
            category: 'frontend'
        },
        {
            name: 'CSS3',
            percentage: 90,
            category: 'frontend'
        },
        {
            name: 'JavaScript',
            percentage: 85,
            category: 'frontend'
        },
        {
            name: 'React',
            percentage: 70,
            category: 'frontend'
        },
        {
            name: 'Node.js',
            percentage: 80,
            category: 'backend'
        },
        {
            name: 'Python',
            percentage: 75,
            category: 'backend'
        },
        {
            name: 'MySQL',
            percentage: 85,
            category: 'backend'
        },
        {
            name: 'MongoDB',
            percentage: 50,
            category: 'backend'
        },
        {
            name: 'Java',
            percentage: 30,
            category: 'languages'
        },
        {
            name: 'C++',
            percentage: 25,
            category: 'languages'
        },
        {
            name: 'TypeScript',
            percentage: 55,
            category: 'languages'
        },
        {
            name: 'Git',
            percentage: 90,
            category: 'tools'
        },
        {
            name: 'VS Code',
            percentage: 85,
            category: 'tools'
        },
        {
            name: 'Docker',
            percentage: 75,
            category: 'tools'
        }
    ];

    const categoryColors = {
        'frontend': 'var(--primary)',
        'backend': 'var(--secondary)',
        'languages': 'var(--accent)',
        'tools': 'var(--success)'
    };

    skills.forEach((skill, index) => {
        const bubble = document.createElement('div');
        bubble.className = 'skill-bubble';
        bubble.innerHTML = `
            <div class="bubble-content">
                <div class="bubble-name">${skill.name}</div>
                <div class="bubble-percentage">${skill.percentage}%</div>
            </div>
        `;

        const baseSize = window.innerWidth < 768 ? 25 : 30;
        const size = baseSize + (skill.percentage / 100) * 40;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.background = categoryColors[skill.category];

        let positionSet = false;
        let attempts = 0;
        const maxAttempts = 150;

        while (!positionSet && attempts < maxAttempts) {
            const left = 5 + Math.random() * 85;
            const top = 5 + Math.random() * 85;
            bubble.style.left = `${left}%`;
            bubble.style.top = `${top}%`;

            const overlapping = checkOverlap(bubble, bubblesContainer.children);
            if (!overlapping) {
                positionSet = true;
            }
            attempts++;
        }

        bubble.style.animationDelay = `${Math.random() * 2}s`;
        bubble.style.animationDuration = `${6 + Math.random() * 4}s`;

        bubblesContainer.appendChild(bubble);

        bubble.addEventListener('click', function() {
            createBubbleRipple(this);

            document.querySelectorAll('.skill-bubble').forEach(b => {
                b.style.opacity = '0.7';
                b.style.transform = 'scale(0.9)';
            });

            this.style.opacity = '1';
            this.style.transform = 'scale(1.2)';
            this.style.zIndex = '100';

            setTimeout(() => {
                document.querySelectorAll('.skill-bubble').forEach(b => {
                    b.style.opacity = '1';
                    b.style.transform = '';
                    b.style.zIndex = '';
                });
            }, 2000);
        });
    });

    function checkOverlap(newBubble, existingBubbles) {
        if (existingBubbles.length === 0) return false;

        const newRect = {
            left: parseFloat(newBubble.style.left),
            top: parseFloat(newBubble.style.top),
            width: parseFloat(newBubble.style.width),
            height: parseFloat(newBubble.style.height)
        };

        for (let i = 0; i < existingBubbles.length; i++) {
            const existingBubble = existingBubbles[i];
            const existingRect = {
                left: parseFloat(existingBubble.style.left),
                top: parseFloat(existingBubble.style.top),
                width: parseFloat(existingBubble.style.width),
                height: parseFloat(existingBubble.style.height)
            };

            const centerX1 = newRect.left + newRect.width / 2;
            const centerY1 = newRect.top + newRect.height / 2;
            const centerX2 = existingRect.left + existingRect.width / 2;
            const centerY2 = existingRect.top + existingRect.height / 2;

            const distance = Math.sqrt(
                Math.pow(centerX1 - centerX2, 2) + Math.pow(centerY1 - centerY2, 2)
            );

            const minDistance = (newRect.width + existingRect.width) / 2.5;

            if (distance < minDistance) {
                return true;
            }
        }
        return false;
    }

    function createBubbleRipple(bubble) {
        const ripple = document.createElement('div');
        const rect = bubble.getBoundingClientRect();
        const bubbleRect = bubblesContainer.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2.5;

        ripple.style.position = 'absolute';
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.top = `${rect.top - bubbleRect.top - size / 2 + rect.height / 2}px`;
        ripple.style.left = `${rect.left - bubbleRect.left - size / 2 + rect.width / 2}px`;
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '5';

        bubblesContainer.appendChild(ripple);

        setTimeout(() => {
            if (bubblesContainer.contains(ripple)) {
                bubblesContainer.removeChild(ripple);
            }
        }, 600);
    }
}

// Hero Section Functionality
function initHeroSection() {
    initParticles();
    initTypewriter();
    initDynamicCodeCards('cardsContainer');
    initDynamicCodeCards('cardsContainerMobile');
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
        "Tech Innovator",
        "Problem Solver",
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

    function createPulseDots() {
        const container = document.getElementById('pulseDots');
        if (!container) return;

        for (let i = 0; i < 15; i++) {
            const dot = document.createElement('div');
            dot.className = 'pulse-dot';
            dot.style.left = `${Math.random() * 100}%`;
            dot.style.top = `${Math.random() * 100}%`;
            dot.style.animationDelay = `${Math.random() * 4}s`;
            container.appendChild(dot);
        }
    }

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
🎓 BCA Final Year Student (2022-2025)
💻 Full-Stack Developer & Tech Explorer
🚀 Passionate about creating innovative solutions
🌱 Currently learning: Advanced JavaScript, AI/ML
💡 Interests: Web Development, Open Source, Emerging Tech

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
• Machine Learning Basics
• Advanced Algorithms`,
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
• 2022 - 2025 | CGPA: 8.85/10

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
        const [command, ...args] = input.trim().split(' ');
        const lowerCommand = command.toLowerCase();

        if (input.trim()) {
            commandHistory.unshift(input.trim());
            historyIndex = -1;
            commandCount++;
            if (commandsExecuted) {
                commandsExecuted.textContent = commandCount;
            }
        }

        addTerminalLine(input);

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
        line.innerHTML = `<span class="terminal-prompt">bharat@portfolio:~$ </span><span class="terminal-command">${text}</span>`;
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
            addTerminalOutput('Terminal cleared. 🧹');
            autoScrollTerminal();
        });
    }

    if (terminalCopy) {
        terminalCopy.addEventListener('click', function() {
            if (terminalOutputContent) {
                const content = terminalOutputContent.textContent;
                navigator.clipboard.writeText(content).then(() => {
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                    }, 1500);
                });
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
    createPulseDots();
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
function initProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const filterButtons = document.querySelectorAll('#projects-filter .filter-btn');
    const noProjectsMessage = document.getElementById('no-projects');

    const projects = [{
            id: 1,
            title: "Portfolio Website",
            description: "Responsive portfolio website with smooth animations and modern design principles. Built with pure HTML, CSS, and JavaScript.",
            technologies: ["HTML", "CSS", "JavaScript"],
            category: "frontend",
            status: "completed",
            image: "images/projects/portfolio.png",
            github: "https://github.com/bharat-poojari/Bharat-Portfolio",
            github1s: "https://github1s.com/bharat-poojari/Bharat-Portfolio",
            details: {
                features: [
                    "Fully responsive design",
                    "Smooth scroll animations",
                    "Interactive elements",
                    "Modern UI/UX principles",
                    "Optimized performance"
                ],
                challenges: "Creating a balance between visual appeal and performance while maintaining accessibility standards.",
                solutions: "Implemented CSS Grid and Flexbox for layout, used Intersection Observer API for animations, and optimized images for fast loading.",
                timeline: "2 weeks",
                role: "Full-stack Developer"
            }
        },
        {
            id: 2,
            title: "Dynamic College Website",
            description: "Dynamic college website for JMJ with interactive pages and admin panel functionality. Includes content management system.",
            technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
            category: "fullstack",
            status: "completed",
            image: "images/projects/dynamiccollege.png",
            liveDemo: "https://jmj-institution.kesug.com",
            github: null,
            github1s: null,
            details: {
                features: [
                    "Dynamic content management",
                    "Admin panel for content updates",
                    "Responsive design",
                    "Contact forms",
                    "Image gallery",
                    "Event management"
                ],
                challenges: "Implementing a secure admin panel while maintaining ease of use for non-technical users.",
                solutions: "Created a custom CMS with role-based access control and an intuitive interface for content management.",
                timeline: "4 weeks",
                role: "Full-stack Developer"
            }
        },
        {
            id: 3,
            title: "Code Polish",
            description: "VS Code extension for beautifying and minifying code with one click functionality. Supports multiple programming languages.",
            technologies: ["TypeScript", "VS Code API"],
            category: "extension",
            status: "completed",
            image: "images/projects/codepolish.png",
            liveDemo: null,
            github: "https://github.com/bharat-poojari/codepolish",
            github1s: "https://github1s.com/bharat-poojari/codepolish",
            details: {
                features: [
                    "One-click code formatting",
                    "Support for multiple languages",
                    "Customizable formatting rules",
                    "Keyboard shortcuts",
                    "Real-time preview"
                ],
                challenges: "Integrating with VS Code's extension API and handling different code formatting requirements.",
                solutions: "Leveraged VS Code's Language Server Protocol and created configurable formatting rules.",
                timeline: "3 weeks",
                role: "Extension Developer"
            }
        },
        {
            id: 4,
            title: "Offyai Programming Assistant",
            description: "AI-powered programming assistant model for code optimization and debugging assistance using machine learning.",
            technologies: ["Python", "Machine Learning", "AI", "NLP"],
            category: "backend",
            status: "development",
            image: "images/projects/offyai.jpg",
            liveDemo: null,
            github: null,
            github1s: null,
            details: {
                features: [
                    "Code optimization suggestions",
                    "Debugging assistance",
                    "Natural language processing",
                    "Learning from user patterns",
                    "Multi-language support"
                ],
                challenges: "Training the model to understand programming context and provide accurate suggestions.",
                solutions: "Used transfer learning with pre-trained models and fine-tuned on programming-specific datasets.",
                timeline: "Ongoing",
                role: "AI Developer"
            }
        }
    ];


    function renderProjects(filter = 'all') {
        if (!projectsGrid) return;

        projectsGrid.innerHTML = '';
        const filteredProjects = filter === 'all' ? projects : projects.filter(project => project.category === filter);

        if (filteredProjects.length === 0) {
            if (noProjectsMessage) {
                noProjectsMessage.style.display = 'block';
            }
            return;
        }

        if (noProjectsMessage) {
            noProjectsMessage.style.display = 'none';
        }
        filteredProjects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            renderProjects(filter);
        });
    });

    renderProjects();
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-project-id', project.id);
    card.setAttribute('data-category', project.category);

    const techTags = project.technologies.map(tech =>
        `<span class="tech-tag">${tech}</span>`
    ).join('');

    const statusBadge = project.status === 'completed' ?
        '<div class="project-badge completed">Completed</div>' :
        '<div class="project-badge development">In Development</div>';

    const links = [];
    if (project.liveDemo) {
        links.push(`
            <a href="${project.liveDemo}" class="project-link" target="_blank">
                <i class="fas fa-external-link-alt"></i>
                Live Demo
            </a>
        `);
    }
    if (project.github) {
        links.push(`
            <a href="${project.github}" class="project-link" target="_blank">
                <i class="fab fa-github"></i>
                GitHub
            </a>
        `);
    }
    if (project.github1s) {
        links.push(`
            <a href="${project.github1s}" class="project-link" target="_blank">
                <i class="fas fa-code"></i>
                View Code
            </a>
        `);
    }

    links.push(`
        <button class="project-link secondary view-details" data-project-id="${project.id}">
            <i class="fas fa-info-circle"></i>
            Details
        </button>
    `);

    // Create image HTML with fallback
    const imageHtml = project.image ?
        `<img src="${project.image}" alt="${project.title}" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<i class=\'fas fa-laptop-code\'></i>';">` :
        `<i class="fas fa-laptop-code"></i>`;

    card.innerHTML = `
        <div class="project-image">
            ${imageHtml}
            ${statusBadge}
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${techTags}
            </div>
            <div class="project-links">
                ${links.join('')}
            </div>
        </div>
    `;

    card.querySelector('.view-details').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showProjectDetails(project);
    });

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

    const featuresList = project.details.features.map(feature =>
        `<li>${feature}</li>`
    ).join('');

    modalContent.innerHTML = `
        <div class="project-details">
            <div class="detail-section">
                <h3>Description</h3>
                <p>${project.description}</p>
            </div>
            <div class="detail-section">
                <div class="project-meta">
                    <div class="meta-item">
                        <strong>Timeline:</strong> ${project.details.timeline}
                    </div>
                    <div class="meta-item">
                        <strong>Role:</strong> ${project.details.role}
                    </div>
                    <div class="meta-item">
                        <strong>Status:</strong> ${project.status === 'completed' ? 'Completed' : 'In Development'}
                    </div>
                </div>
            </div>
            <div class="detail-section">
                <h3>Technologies Used</h3>
                <div class="tech-tags">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
            <div class="detail-section">
                <h3>Key Features</h3>
                <ul>
                    ${featuresList}
                </ul>
            </div>
            <div class="detail-section">
                <h3>Development Process</h3>
                <div class="process-step">
                    <h4>Challenges</h4>
                    <p>${project.details.challenges}</p>
                </div>
                <div class="process-step">
                    <h4>Solutions</h4>
                    <p>${project.details.solutions}</p>
                </div>
            </div>
            <div class="project-links-modal">
                ${project.liveDemo ? `
                    <a href="${project.liveDemo}" class="btn btn-primary" target="_blank">
                        <i class="fas fa-external-link-alt"></i>
                        Live Demo
                    </a>
                ` : ''}
                ${project.github ? `
                    <a href="${project.github}" class="btn btn-secondary" target="_blank">
                        <i class="fab fa-github"></i>
                        GitHub
                    </a>
                ` : ''}
                ${project.github1s ? `
                    <a href="${project.github1s}" class="btn btn-secondary" target="_blank">
                        <i class="fas fa-code"></i>
                        View Code
                    </a>
                ` : ''}
            </div>
        </div>
    `;

    modal.style.display = 'block';
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
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

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

    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }

        const originalText = submitBtn ? submitBtn.innerHTML : '';
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
                if (contactForm) contactForm.style.display = 'none';
                if (successMessage) successMessage.style.display = 'block';

                contactForm.reset();

                setTimeout(() => {
                    if (contactForm) contactForm.style.display = 'block';
                    if (successMessage) successMessage.style.display = 'none';
                }, 5000);
            } else {
                const data = await response.json();
                if (data.errors) {
                    alert(data.errors.map(error => error.message).join(', '));
                } else {
                    alert('Oops! There was a problem submitting your form.');
                }
            }
        } catch (error) {
            alert('Oops! There was a network error. Please try again.');
            console.error('Form submission error:', error);
        } finally {
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