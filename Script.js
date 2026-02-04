// ============================================
// MAIN PORTFOLIO SCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initLoadingScreen();
    initCosmicParticles();
    initNavigation();
    initHero3D();
    initTerminal();
    initSkills3D();
    initProjects3D();
    initEducation3D();
    initCertificates3D();
    initContact3D();
    initMiniOS();
    initEasterEggs();
    initScrollAnimations();
    initResponsive();
    initAccessibility();
});

// ============================================
// LOADING SCREEN
// ============================================

function initLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-logo">
            <div class="logo-cube">
                <div class="face">B</div>
                <div class="face">P</div>
                <div class="face">D</div>
                <div class="face">E</div>
                <div class="face">V</div>
                <div class="face">S</div>
            </div>
        </div>
        <div class="loading-text">Initializing Portfolio...</div>
        <div class="loading-bar">
            <div class="loading-progress"></div>
        </div>
    `;
    
    document.body.appendChild(loadingScreen);
    
    // Simulate loading progress
    const progressBar = loadingScreen.querySelector('.loading-progress');
    const totalLoadTime = 2000; // 2 seconds
    const steps = 20;
    const stepTime = totalLoadTime / steps;
    let progress = 0;
    
    const loadInterval = setInterval(() => {
        progress += (100 / steps);
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(loadInterval);
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.remove();
                    // Initialize main animations after loading
                    animateStats();
                    initScrollTriggers();
                }, 500);
            }, 500);
        }
    }, stepTime);
}

// ============================================
// COSMIC PARTICLES
// ============================================

function initCosmicParticles() {
    const particlesContainer = document.getElementById('cosmic-particles');
    if (!particlesContainer) return;
    
    const particleCount = 100;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'cosmic-particle';
        
        // Random properties
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const opacity = Math.random() * 0.5 + 0.1;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        // Apply styles
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, #fff, transparent);
            border-radius: 50%;
            left: ${posX}%;
            top: ${posY}%;
            opacity: ${opacity};
            animation: floatParticle ${duration}s infinite linear ${delay}s;
            box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.5);
        `;
        
        particlesContainer.appendChild(particle);
        particles.push(particle);
    }
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0%, 100% {
                transform: translate(0, 0) rotate(0deg);
            }
            25% {
                transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) rotate(90deg);
            }
            50% {
                transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 10 - 5}px) rotate(180deg);
            }
            75% {
                transform: translate(${Math.random() * 10 - 5}px, ${Math.random() * 20 - 10}px) rotate(270deg);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Interactive particles
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        particles.forEach((particle, i) => {
            const speed = (i % 3 + 1) * 0.5;
            const dx = (mouseX - 0.5) * 20 * speed;
            const dy = (mouseY - 0.5) * 20 * speed;
            
            particle.style.transform = `translate(${dx}px, ${dy}px)`;
        });
    });
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Animate hamburger bars
            const bars = hamburger.querySelectorAll('.holo-bar');
            bars.forEach((bar, i) => {
                if (hamburger.classList.contains('active')) {
                    bar.style.transform = i === 0 ? 'rotate(45deg) translate(6px, 6px)' :
                                          i === 1 ? 'opacity: 0' :
                                          'rotate(-45deg) translate(6px, -6px)';
                } else {
                    bar.style.transform = '';
                    bar.style.opacity = '';
                }
            });
        });
    }
    
    // Smooth scroll to sections
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            const target = document.getElementById(section);
            
            if (target) {
                // Close mobile menu if open
                if (hamburger.classList.contains('active')) {
                    hamburger.click();
                }
                
                // Scroll to section
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav item
                navItems.forEach(navItem => navItem.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('nav-theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const icon = themeToggle.querySelector('i');
            icon.classList.toggle('fa-moon');
            icon.classList.toggle('fa-sun');
        });
    }
    
    // 3D Mode toggle
    const mode3DToggle = document.getElementById('nav-3d-toggle');
    if (mode3DToggle) {
        mode3DToggle.addEventListener('click', () => {
            document.body.classList.toggle('3d-mode');
            // Add any 3D mode specific effects here
            if (document.body.classList.contains('3d-mode')) {
                enable3DEffects();
            } else {
                disable3DEffects();
            }
        });
    }
    
    // Navigation scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.cosmic-nav');
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(10, 10, 26, 0.95)';
            nav.style.backdropFilter = 'blur(20px)';
            nav.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
        } else {
            nav.style.background = 'rgba(10, 10, 26, 0.9)';
            nav.style.backdropFilter = 'blur(20px)';
            nav.style.boxShadow = 'none';
        }
        
        // Update active nav based on scroll position
        updateActiveNav();
    });
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === currentSection) {
            item.classList.add('active');
        }
    });
}

// ============================================
// HERO SECTION 3D
// ============================================

function initHero3D() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        alpha: true,
        antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create floating 3D elements
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshPhongMaterial({
        color: 0x2563eb,
        shininess: 100,
        transparent: true,
        opacity: 0.8
    });
    
    const meshes = [];
    const meshCount = 15;
    
    for (let i = 0; i < meshCount; i++) {
        const mesh = new THREE.Mesh(geometry, material.clone());
        mesh.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10
        );
        mesh.scale.setScalar(Math.random() * 0.5 + 0.3);
        mesh.userData = {
            speed: Math.random() * 0.02 + 0.01,
            rotation: new THREE.Vector3(
                Math.random() * 0.02,
                Math.random() * 0.02,
                Math.random() * 0.02
            ),
            wave: Math.random() * Math.PI * 2
        };
        scene.add(mesh);
        meshes.push(mesh);
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x2563eb, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0x7c3aed, 1, 100);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);
    
    camera.position.z = 15;
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        // Update meshes
        meshes.forEach((mesh, i) => {
            const data = mesh.userData;
            mesh.rotation.x += data.rotation.x;
            mesh.rotation.y += data.rotation.y;
            
            // Floating animation
            data.wave += data.speed;
            mesh.position.y += Math.sin(data.wave) * 0.01;
            
            // Mouse interaction
            mesh.position.x += (mouseX * 2 - mesh.position.x) * 0.05;
            mesh.position.y += (mouseY * 2 - mesh.position.y) * 0.05;
        });
        
        // Camera animation
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Shooting stars
    initShootingStars();
    
    // Floating elements animation
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, i) => {
        gsap.to(element, {
            y: 20,
            duration: 2 + i,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.5
        });
        
        gsap.to(element, {
            rotation: 360,
            duration: 10 + i * 2,
            repeat: -1,
            ease: "none"
        });
    });
}

function initShootingStars() {
    const container = document.querySelector('.shooting-stars');
    if (!container) return;
    
    function createShootingStar() {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8);
        `;
        
        // Random start position
        const startX = Math.random() * 100;
        const startY = Math.random() * 50;
        const distance = 100 + Math.random() * 200;
        const angle = Math.random() * Math.PI / 4 + Math.PI / 8;
        const duration = 1 + Math.random() * 2;
        const delay = Math.random() * 10;
        
        star.style.left = `${startX}%`;
        star.style.top = `${startY}%`;
        container.appendChild(star);
        
        // Animate
        gsap.to(star, {
            x: `+=${Math.cos(angle) * distance}px`,
            y: `+=${Math.sin(angle) * distance}px`,
            duration: duration,
            delay: delay,
            ease: "power1.out",
            onComplete: () => {
                star.remove();
                createShootingStar();
            }
        });
        
        // Trail effect
        const trail = document.createElement('div');
        trail.className = 'star-trail';
        trail.style.cssText = `
            position: absolute;
            width: 100px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #fff, transparent);
            transform-origin: left center;
            transform: rotate(${angle}rad);
            left: 0;
            top: 0;
            opacity: 0;
        `;
        star.appendChild(trail);
        
        gsap.to(trail, {
            opacity: 0.5,
            duration: duration / 2,
            ease: "power1.in",
            onComplete: () => {
                gsap.to(trail, {
                    opacity: 0,
                    duration: duration / 2
                });
            }
        });
    }
    
    // Create multiple shooting stars
    for (let i = 0; i < 5; i++) {
        setTimeout(createShootingStar, i * 2000);
    }
}

function animateStats() {
    const statValues = document.querySelectorAll('.stat-3d-value');
    
    statValues.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const start = 0;
        const startTime = Date.now();
        
        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
            const current = Math.floor(easeProgress * target);
            
            stat.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                stat.textContent = target.toLocaleString();
            }
        }
        
        setTimeout(update, 100);
    });
}

// ============================================
// TERMINAL
// ============================================

function initTerminal() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalCommands = document.getElementById('terminal-commands');
    const quickCommands = document.querySelectorAll('.quick-command');
    
    if (!terminalInput || !terminalOutput) return;
    
    let commandCount = 0;
    const commands = {
        help: 'Available commands: about, skills, projects, education, certificates, contact, clear, theme, date, time, echo [text], github, linkedin',
        about: 'Bharat Poojari - Full-Stack Developer from Sirsi, Karnataka. BCA final year student passionate about technology and innovation.',
        skills: 'Frontend: HTML, CSS, JavaScript, React, Vue.js | Backend: Node.js, Python, Express | Database: MongoDB, MySQL | Tools: Git, Docker, AWS',
        projects: '20+ projects including web apps, mobile apps, and developer tools. Type "projects list" for details.',
        education: 'Bachelor of Computer Applications at J.M.J College, Chipgi. CGPA: 8.85/10. Expected graduation: 2025.',
        certificates: 'Multiple certifications in web development, cloud computing, and programming. Type "certificates list" for details.',
        contact: 'Email: bharatp0316@gmail.com | Phone: +91 80737 50997 | Location: Sirsi, Karnataka, India',
        github: 'Opening GitHub profile...',
        linkedin: 'Opening LinkedIn profile...',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    };
    
    // Initial terminal output
    addTerminalOutput('Welcome to Bharat\'s Interactive Terminal!');
    addTerminalOutput('Type "help" to see available commands.');
    addTerminalOutput('');
    
    // Terminal 3D
    initTerminal3D();
    
    // Input handler
    terminalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';
            
            if (command) {
                addTerminalOutput(`$ ${command}`);
                processCommand(command);
                commandCount++;
                if (terminalCommands) {
                    terminalCommands.textContent = commandCount;
                }
            }
        }
    });
    
    // Quick commands
    quickCommands.forEach(button => {
        button.addEventListener('click', () => {
            const command = button.getAttribute('data-command');
            addTerminalOutput(`$ ${command}`);
            processCommand(command);
            commandCount++;
            if (terminalCommands) {
                terminalCommands.textContent = commandCount;
            }
        });
    });
    
    // Clear terminal
    const clearBtn = document.getElementById('terminal-clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            terminalOutput.innerHTML = '';
            addTerminalOutput('Terminal cleared.');
            addTerminalOutput('');
        });
    }
    
    // Theme toggle
    const themeBtn = document.getElementById('terminal-theme');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.querySelector('.terminal-ui').classList.toggle('dark-mode');
            addTerminalOutput('Terminal theme toggled.');
        });
    }
    
    // Update time
    function updateTime() {
        const timeElement = document.getElementById('terminal-time');
        if (timeElement) {
            timeElement.textContent = new Date().toLocaleTimeString();
        }
    }
    setInterval(updateTime, 1000);
    
    function addTerminalOutput(text) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.textContent = text;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    function processCommand(cmd) {
        const args = cmd.split(' ');
        const baseCmd = args[0];
        
        if (commands[baseCmd]) {
            if (baseCmd === 'github') {
                addTerminalOutput(commands.github);
                setTimeout(() => {
                    window.open('https://github.com/bharat0316-a', '_blank');
                }, 1000);
            } else if (baseCmd === 'linkedin') {
                addTerminalOutput(commands.linkedin);
                setTimeout(() => {
                    window.open('https://linkedin.com/in/bharat-poojari', '_blank');
                }, 1000);
            } else if (baseCmd === 'echo') {
                addTerminalOutput(args.slice(1).join(' '));
            } else if (baseCmd === 'projects' && args[1] === 'list') {
                addTerminalOutput('Featured Projects:');
                addTerminalOutput('1. 3D Portfolio Website (Current)');
                addTerminalOutput('2. E-commerce Platform');
                addTerminalOutput('3. Task Management App');
                addTerminalOutput('4. Weather Dashboard');
                addTerminalOutput('5. Chat Application');
            } else if (baseCmd === 'certificates' && args[1] === 'list') {
                addTerminalOutput('Certifications:');
                addTerminalOutput('1. Full-Stack Web Development');
                addTerminalOutput('2. JavaScript Advanced Concepts');
                addTerminalOutput('3. React Developer');
                addTerminalOutput('4. Node.js Backend Development');
                addTerminalOutput('5. AWS Cloud Practitioner');
            } else {
                addTerminalOutput(commands[baseCmd]);
            }
        } else if (cmd === 'clear') {
            terminalOutput.innerHTML = '';
            addTerminalOutput('');
        } else {
            addTerminalOutput(`Command not found: ${cmd}. Type "help" for available commands.`);
        }
        addTerminalOutput('');
    }
}

function initTerminal3D() {
    const canvas = document.getElementById('terminal-canvas');
    if (!canvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        alpha: true,
        antialias: true 
    });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    
    // Create floating code particles
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const material = new THREE.MeshBasicMaterial({ 
            color: Math.random() > 0.5 ? 0x2563eb : 0x06d6a0,
            transparent: true,
            opacity: 0.5
        });
        
        const particle = new THREE.Mesh(geometry, material);
        particle.position.set(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 2,
            Math.random() * 5
        );
        
        particle.userData = {
            speed: Math.random() * 0.02 + 0.01,
            rotation: new THREE.Vector3(
                Math.random() * 0.02,
                Math.random() * 0.02,
                Math.random() * 0.02
            )
        };
        
        scene.add(particle);
        particles.push(particle);
    }
    
    camera.position.z = 5;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        particles.forEach(particle => {
            const data = particle.userData;
            particle.rotation.x += data.rotation.x;
            particle.rotation.y += data.rotation.y;
            particle.position.z -= data.speed;
            
            if (particle.position.z < 0) {
                particle.position.z = 5;
                particle.position.x = (Math.random() - 0.5) * 4;
                particle.position.y = (Math.random() - 0.5) * 2;
            }
        });
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
}

// ============================================
// SKILLS 3D BUBBLES
// ============================================

function initSkills3D() {
    const canvas = document.getElementById('skills-canvas');
    if (!canvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        alpha: true,
        antialias: true 
    });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    
    // Skills data
    const skills = [
        { name: 'HTML5', level: 95, color: '#E34F26', category: 'frontend' },
        { name: 'CSS3', level: 90, color: '#1572B6', category: 'frontend' },
        { name: 'JavaScript', level: 88, color: '#F7DF1E', category: 'frontend' },
        { name: 'React', level: 85, color: '#61DAFB', category: 'frontend' },
        { name: 'Node.js', level: 82, color: '#339933', category: 'backend' },
        { name: 'Python', level: 80, color: '#3776AB', category: 'backend' },
        { name: 'MongoDB', level: 78, color: '#47A248', category: 'database' },
        { name: 'MySQL', level: 75, color: '#4479A1', category: 'database' },
        { name: 'Git', level: 90, color: '#F05032', category: 'tools' },
        { name: 'Docker', level: 70, color: '#2496ED', category: 'tools' },
        { name: 'AWS', level: 65, color: '#FF9900', category: 'tools' },
        { name: 'Three.js', level: 75, color: '#000000', category: 'frontend' }
    ];
    
    // Create skill bubbles
    const skillBubbles = [];
    const bubbleGeometry = new THREE.SphereGeometry(1, 32, 32);
    
    skills.forEach((skill, i) => {
        const material = new THREE.MeshPhongMaterial({
            color: skill.color,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        
        const bubble = new THREE.Mesh(bubbleGeometry, material);
        
        // Position in a spherical formation
        const phi = Math.acos(-1 + (2 * i) / skills.length);
        const theta = Math.sqrt(skills.length * Math.PI) * phi;
        
        bubble.position.setFromSphericalCoords(
            8, // radius
            phi,
            theta
        );
        
        bubble.userData = {
            skill,
            originalPosition: bubble.position.clone(),
            hover: false
        };
        
        scene.add(bubble);
        skillBubbles.push(bubble);
        
        // Create HTML bubble
        createHTMLSkillBubble(skill, bubble.position);
    });
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    camera.position.z = 20;
    
    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Mouse movement
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });
    
    // Animation
    let time = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;
        
        // Update skill bubbles
        skillBubbles.forEach((bubble, i) => {
            const data = bubble.userData;
            
            // Floating animation
            bubble.position.y = data.originalPosition.y + Math.sin(time + i) * 0.5;
            bubble.rotation.x += 0.01;
            bubble.rotation.y += 0.01;
            
            // Hover effect
            if (data.hover) {
                bubble.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
                bubble.position.z = data.originalPosition.z - 2;
            } else {
                bubble.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
                bubble.position.lerp(data.originalPosition, 0.1);
            }
        });
        
        // Raycasting for interaction
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(skillBubbles);
        
        // Reset all bubbles
        skillBubbles.forEach(bubble => {
            bubble.userData.hover = false;
        });
        
        // Handle intersections
        if (intersects.length > 0) {
            const bubble = intersects[0].object;
            bubble.userData.hover = true;
            
            // Update skill info panel
            updateSkillInfo(bubble.userData.skill);
        } else {
            // Reset skill info panel
            resetSkillInfo();
        }
        
        // Rotate camera
        camera.position.x = Math.sin(time * 0.2) * 20;
        camera.position.z = Math.cos(time * 0.2) * 20;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
    
    // View toggle
    const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
    viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewToggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const view = btn.getAttribute('data-view');
            document.querySelectorAll('.skills-bubble-view, .skills-grid-view').forEach(v => {
                v.style.display = 'none';
            });
            
            if (view === 'bubble') {
                document.getElementById('bubble-view').style.display = 'block';
            } else if (view === 'grid') {
                document.getElementById('grid-view').style.display = 'block';
                renderSkillsGrid();
            }
        });
    });
    
    // Category filters
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            categoryFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            const category = filter.getAttribute('data-category');
            filterSkillsByCategory(category);
        });
    });
}

function createHTMLSkillBubble(skill, position3D) {
    const container = document.getElementById('bubble-view');
    if (!container) return;
    
    const bubble = document.createElement('div');
    bubble.className = 'skill-bubble';
    bubble.setAttribute('data-skill', skill.name.toLowerCase());
    bubble.style.setProperty('--bubble-color', skill.color);
    
    bubble.innerHTML = `
        <div class="skill-icon">
            <i class="fab fa-${skill.name.toLowerCase()}"></i>
        </div>
        <div class="skill-name">${skill.name}</div>
        <div class="skill-level">
            <div class="skill-level-fill" style="width: ${skill.level}%"></div>
        </div>
    `;
    
    // Convert 3D position to 2D screen position
    // This is a simplified version - in production you'd want to use proper projection
    const x = 50 + (position3D.x / 20) * 25;
    const y = 50 + (position3D.y / 20) * 25;
    
    bubble.style.left = `${x}%`;
    bubble.style.top = `${y}%`;
    
    bubble.addEventListener('mouseenter', () => {
        updateSkillInfo(skill);
    });
    
    bubble.addEventListener('mouseleave', () => {
        resetSkillInfo();
    });
    
    container.appendChild(bubble);
}

function updateSkillInfo(skill) {
    const nameElement = document.getElementById('skill-name');
    const levelFill = document.getElementById('skill-level-fill');
    const levelText = document.getElementById('skill-level-text');
    const description = document.getElementById('skill-description');
    const projects = document.getElementById('skill-projects');
    
    if (nameElement) nameElement.textContent = skill.name;
    if (levelFill) {
        levelFill.style.width = `${skill.level}%`;
        levelFill.style.background = `linear-gradient(90deg, ${skill.color}, var(--cosmic-accent))`;
    }
    if (levelText) levelText.textContent = `${skill.level}%`;
    if (description) description.textContent = getSkillDescription(skill.name);
    
    if (projects) {
        projects.innerHTML = `
            <h4>Projects using ${skill.name}</h4>
            <div class="project-chips">
                ${getSkillProjects(skill.name).map(project => 
                    `<span class="project-chip">${project}</span>`
                ).join('')}
            </div>
        `;
    }
    
    // Show panel
    document.querySelector('.skill-info-panel').classList.add('active');
}

function resetSkillInfo() {
    const panel = document.querySelector('.skill-info-panel');
    panel.classList.remove('active');
    
    setTimeout(() => {
        if (!panel.classList.contains('active')) {
            const nameElement = document.getElementById('skill-name');
            const description = document.getElementById('skill-description');
            
            if (nameElement) nameElement.textContent = 'Select a Skill';
            if (description) description.textContent = 'Hover over any skill bubble to see details';
        }
    }, 300);
}

function getSkillDescription(skillName) {
    const descriptions = {
        'HTML5': 'Semantic markup, accessibility, modern HTML5 APIs',
        'CSS3': 'Advanced animations, flexbox, grid, responsive design',
        'JavaScript': 'ES6+, asynchronous programming, DOM manipulation',
        'React': 'Component-based architecture, hooks, state management',
        'Node.js': 'Server-side JavaScript, REST APIs, real-time applications',
        'Python': 'Backend development, scripting, data processing',
        'MongoDB': 'NoSQL database, document storage, aggregation',
        'MySQL': 'Relational database, SQL queries, data modeling',
        'Git': 'Version control, branching strategies, collaboration',
        'Docker': 'Containerization, microservices, deployment',
        'AWS': 'Cloud computing, serverless, infrastructure',
        'Three.js': '3D graphics, WebGL, interactive visualizations'
    };
    
    return descriptions[skillName] || 'Advanced proficiency in this technology.';
}

function getSkillProjects(skillName) {
    const projectMap = {
        'HTML5': ['Portfolio Website', 'E-commerce Platform', 'Blog System'],
        'CSS3': ['Animated UI Components', 'Responsive Layouts', 'Creative Designs'],
        'JavaScript': ['Interactive Apps', 'Game Development', 'API Integration'],
        'React': ['Single Page Apps', 'Dashboard Interfaces', 'Component Libraries']
    };
    
    return projectMap[skillName] || ['Multiple Projects', 'Various Applications'];
}

function renderSkillsGrid() {
    const grid = document.querySelector('.skills-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const skills = [
        { name: 'HTML5', level: 95, color: '#E34F26' },
        { name: 'CSS3', level: 90, color: '#1572B6' },
        { name: 'JavaScript', level: 88, color: '#F7DF1E' },
        { name: 'React', level: 85, color: '#61DAFB' },
        { name: 'Node.js', level: 82, color: '#339933' },
        { name: 'Python', level: 80, color: '#3776AB' },
        { name: 'MongoDB', level: 78, color: '#47A248' },
        { name: 'MySQL', level: 75, color: '#4479A1' },
        { name: 'Git', level: 90, color: '#F05032' },
        { name: 'Docker', level: 70, color: '#2496ED' },
        { name: 'AWS', level: 65, color: '#FF9900' },
        { name: 'Three.js', level: 75, color: '#000000' }
    ];
    
    skills.forEach(skill => {
        const item = document.createElement('div');
        item.className = 'skill-grid-item';
        item.style.setProperty('--skill-color', skill.color);
        
        item.innerHTML = `
            <div class="skill-grid-header">
                <div class="skill-grid-icon">
                    <i class="fab fa-${skill.name.toLowerCase()}"></i>
                </div>
                <div class="skill-grid-name">${skill.name}</div>
                <div class="skill-grid-percentage">${skill.level}%</div>
            </div>
            <div class="skill-grid-bar">
                <div class="skill-grid-fill" style="width: ${skill.level}%"></div>
            </div>
        `;
        
        grid.appendChild(item);
        
        // Animate bar on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = item.querySelector('.skill-grid-fill');
                    fill.style.width = `${skill.level}%`;
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(item);
    });
}

function filterSkillsByCategory(category) {
    const bubbles = document.querySelectorAll('.skill-bubble');
    const gridItems = document.querySelectorAll('.skill-grid-item');
    
    bubbles.forEach(bubble => {
        const skillName = bubble.getAttribute('data-skill');
        const shouldShow = category === 'all' || 
                          (category === 'frontend' && ['html5', 'css3', 'javascript', 'react', 'three.js'].includes(skillName)) ||
                          (category === 'backend' && ['node.js', 'python'].includes(skillName)) ||
                          (category === 'database' && ['mongodb', 'mysql'].includes(skillName)) ||
                          (category === 'tools' && ['git', 'docker', 'aws'].includes(skillName));
        
        bubble.style.display = shouldShow ? 'flex' : 'none';
    });
    
    // Similar logic for grid view
    gridItems.forEach(item => {
        // Implement category filtering for grid view
    });
}

// ============================================
// PROJECTS 3D UNIVERSE
// ============================================

function initProjects3D() {
    const canvas = document.getElementById('project-canvas');
    if (!canvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        alpha: true,
        antialias: true 
    });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    
    // Projects data
    const projects = [
        { 
            name: '3D Portfolio', 
            type: 'web',
            color: 0x2563eb,
            size: 1.5,
            position: { x: -5, y: 0, z: 0 }
        },
        { 
            name: 'E-commerce Platform', 
            type: 'web',
            color: 0x7c3aed,
            size: 1.2,
            position: { x: 3, y: 4, z: -2 }
        },
        { 
            name: 'Task Manager', 
            type: 'mobile',
            color: 0x06d6a0,
            size: 1.0,
            position: { x: -3, y: -4, z: 1 }
        },
        { 
            name: 'Weather App', 
            type: 'web',
            color: 0x3b82f6,
            size: 0.9,
            position: { x: 6, y: 2, z: -3 }
        },
        { 
            name: 'Chat System', 
            type: 'web',
            color: 0xf59e0b,
            size: 1.1,
            position: { x: -6, y: 3, z: 2 }
        },
        { 
            name: 'AI Assistant', 
            type: 'ai',
            color: 0xef4444,
            size: 1.3,
            position: { x: 4, y: -3, z: -1 }
        }
    ];
    
    // Create project planets
    const projectPlanets = [];
    
    projects.forEach((project, i) => {
        // Create planet
        const geometry = new THREE.SphereGeometry(project.size, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: project.color,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });
        
        const planet = new THREE.Mesh(geometry, material);
        planet.position.set(project.position.x, project.position.y, project.position.z);
        
        // Create ring for some planets
        if (i % 2 === 0) {
            const ringGeometry = new THREE.RingGeometry(project.size * 1.5, project.size * 1.7, 32);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: project.color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.3
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            planet.add(ring);
        }
        
        planet.userData = {
            project,
            hover: false,
            originalScale: new THREE.Vector3(1, 1, 1)
        };
        
        scene.add(planet);
        projectPlanets.push(planet);
        
        // Create orbit path
        createOrbitPath(project.position);
    });
    
    // Add stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 5000;
    const positions = new Float32Array(starsCount * 3);
    
    for (let i = 0; i < starsCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 1000;
        positions[i + 1] = (Math.random() - 0.5) * 1000;
        positions[i + 2] = (Math.random() - 0.5) * 1000;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        transparent: true
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    // Camera controls
    camera.position.z = 20;
    let cameraAngle = 0;
    let autoRotate = true;
    
    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    // Mouse events
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
    });
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        if (isDragging) {
            autoRotate = false;
            
            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };
            
            cameraAngle += deltaMove.x * 0.01;
            previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
        }
    });
    
    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    canvas.addEventListener('click', () => {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(projectPlanets);
        
        if (intersects.length > 0) {
            const planet = intersects[0].object;
            const project = planet.userData.project;
            showProjectDetails(project);
        }
    });
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        // Auto-rotate camera
        if (autoRotate) {
            cameraAngle += 0.002;
        }
        
        // Update camera position
        camera.position.x = Math.sin(cameraAngle) * 20;
        camera.position.z = Math.cos(cameraAngle) * 20;
        camera.lookAt(scene.position);
        
        // Update project planets
        projectPlanets.forEach((planet, i) => {
            const data = planet.userData;
            
            // Rotation
            planet.rotation.y += 0.01;
            
            // Floating animation
            const time = Date.now() * 0.001;
            planet.position.y = data.project.position.y + Math.sin(time + i) * 0.5;
            
            // Hover effect
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(planet);
            
            if (intersects.length > 0) {
                planet.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
                planet.userData.hover = true;
            } else {
                planet.scale.lerp(data.originalScale, 0.1);
                planet.userData.hover = false;
            }
        });
        
        // Stars rotation
        stars.rotation.y += 0.0005;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
    
    // Universe controls
    const controls = {
        zoomIn: document.getElementById('universe-zoom-in'),
        zoomOut: document.getElementById('universe-zoom-out'),
        rotateToggle: document.getElementById('universe-rotate-toggle'),
        reset: document.getElementById('universe-reset'),
        warp: document.getElementById('universe-warp')
    };
    
    if (controls.zoomIn) {
        controls.zoomIn.addEventListener('click', () => {
            camera.position.multiplyScalar(0.9);
        });
    }
    
    if (controls.zoomOut) {
        controls.zoomOut.addEventListener('click', () => {
            camera.position.multiplyScalar(1.1);
        });
    }
    
    if (controls.rotateToggle) {
        let isRotating = true;
        controls.rotateToggle.addEventListener('click', () => {
            isRotating = !isRotating;
            autoRotate = isRotating;
            controls.rotateToggle.querySelector('i').className = 
                isRotating ? 'fas fa-pause' : 'fas fa-play';
        });
    }
    
    if (controls.reset) {
        controls.reset.addEventListener('click', () => {
            camera.position.set(0, 0, 20);
            camera.lookAt(scene.position);
            cameraAngle = 0;
            autoRotate = true;
        });
    }
    
    if (controls.warp) {
        controls.warp.addEventListener('click', () => {
            activateWarpSpeed();
        });
    }
    
    // Project filter
    const filterSelect = document.getElementById('project-filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            const filter = e.target.value;
            filterProjects(filter);
        });
    }
}

function createOrbitPath(position) {
    // This would create visual orbit paths around the center
    // Implementation depends on desired visual effect
}

function showProjectDetails(project) {
    const title = document.getElementById('project-title');
    const description = document.getElementById('project-description');
    const tech = document.getElementById('project-tech');
    const links = document.getElementById('project-links');
    
    if (title) title.textContent = project.name;
    if (description) description.textContent = getProjectDescription(project.name);
    
    if (tech) {
        const technologies = getProjectTechnologies(project.name);
        tech.innerHTML = technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
    }
    
    if (links) {
        links.innerHTML = `
            <a href="#" class="project-link">
                <i class="fas fa-external-link-alt"></i>
                <span>Live Demo</span>
            </a>
            <a href="#" class="project-link">
                <i class="fab fa-github"></i>
                <span>Source Code</span>
            </a>
        `;
    }
    
    // Show panel
    document.querySelector('.project-info-panel').classList.add('active');
}

function getProjectDescription(projectName) {
    const descriptions = {
        '3D Portfolio': 'Interactive portfolio website with 3D elements and animations using Three.js and GSAP.',
        'E-commerce Platform': 'Full-featured online store with payment integration and admin dashboard.',
        'Task Manager': 'Productivity application with real-time updates and collaborative features.',
        'Weather App': 'Weather forecasting application with interactive maps and location-based services.',
        'Chat System': 'Real-time messaging application with file sharing and video call capabilities.',
        'AI Assistant': 'Intelligent assistant with natural language processing and machine learning.'
    };
    
    return descriptions[projectName] || 'A detailed project description will appear here.';
}

function getProjectTechnologies(projectName) {
    const techMap = {
        '3D Portfolio': ['Three.js', 'GSAP', 'HTML5', 'CSS3', 'JavaScript'],
        'E-commerce Platform': ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
        'Task Manager': ['Vue.js', 'Express', 'Socket.io', 'JWT', 'MySQL'],
        'Weather App': ['React Native', 'Redux', 'Weather API', 'Google Maps'],
        'Chat System': ['React', 'Node.js', 'Socket.io', 'WebRTC', 'MongoDB'],
        'AI Assistant': ['Python', 'TensorFlow', 'Flask', 'OpenAI API', 'Docker']
    };
    
    return techMap[projectName] || ['JavaScript', 'HTML', 'CSS'];
}

function filterProjects(filter) {
    // Filter project planets based on type
    // This would require storing references to all project planets
}

function activateWarpSpeed() {
    const warpEffect = document.getElementById('warp-speed');
    if (!warpEffect) return;
    
    warpEffect.classList.add('active');
    
    // Speed up universe rotation
    // Add other warp effects
    
    setTimeout(() => {
        warpEffect.classList.remove('active');
    }, 2000);
}

// ============================================
// EDUCATION 3D TIMELINE
// ============================================

function initEducation3D() {
    const canvas = document.getElementById('education-canvas');
    if (!canvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        alpha: true,
        antialias: true 
    });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    
    // Timeline points
    const timelinePoints = [
        { year: 2020, title: 'Started BCA', color: 0x2563eb },
        { year: 2021, title: 'Web Development', color: 0x7c3aed },
        { year: 2022, title: 'Full-Stack', color: 0x06d6a0 },
        { year: 2023, title: 'Advanced Tech', color: 0xf59e0b },
        { year: 2024, title: 'Projects', color: 0xef4444 },
        { year: 2025, title: 'Graduation', color: 0x3b82f6 }
    ];
    
    // Create timeline path
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 0, 0),
        new THREE.Vector3(-6, 3, 0),
        new THREE.Vector3(-2, -2, 0),
        new THREE.Vector3(2, 3, 0),
        new THREE.Vector3(6, -2, 0),
        new THREE.Vector3(10, 0, 0)
    ]);
    
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.5 });
    const curveObject = new THREE.Line(geometry, material);
    scene.add(curveObject);
    
    // Create timeline nodes
    const nodes = [];
    timelinePoints.forEach((point, i) => {
        const position = curve.getPoint(i / (timelinePoints.length - 1));
        
        // Create sphere
        const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: point.color,
            shininess: 100
        });
        
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(position);
        
        // Create glow
        const glowGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: point.color,
            transparent: true,
            opacity: 0.3
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        sphere.add(glow);
        
        sphere.userData = {
            point,
            originalPosition: position.clone(),
            hover: false
        };
        
        scene.add(sphere);
        nodes.push(sphere);
        
        // Create HTML point
        createHTMLTimelinePoint(point, position);
    });
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    camera.position.set(0, 0, 15);
    
    // Animation
    let time = 0;
    let activeNode = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;
        
        // Update nodes
        nodes.forEach((node, i) => {
            const data = node.userData;
            
            // Floating animation
            node.position.y = data.originalPosition.y + Math.sin(time + i) * 0.2;
            
            // Active node effect
            if (i === activeNode) {
                node.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
                node.children[0].scale.lerp(new THREE.Vector3(1.5, 1.5, 1.5), 0.1);
            } else {
                node.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
                node.children[0].scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
            }
            
            // Rotation
            node.rotation.y += 0.01;
        });
        
        // Camera follow curve
        const cameraPos = curve.getPoint((activeNode + 0.5) / timelinePoints.length);
        camera.position.lerp(new THREE.Vector3(cameraPos.x, cameraPos.y + 5, 15), 0.05);
        camera.lookAt(cameraPos);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
    
    // Timeline controls
    const controls = {
        prev: document.getElementById('timeline-prev'),
        next: document.getElementById('timeline-next'),
        autoplay: document.getElementById('timeline-autoplay')
    };
    
    let autoPlayInterval = null;
    
    if (controls.prev) {
        controls.prev.addEventListener('click', () => {
            activeNode = Math.max(0, activeNode - 1);
            updateEducationCard(activeNode);
        });
    }
    
    if (controls.next) {
        controls.next.addEventListener('click', () => {
            activeNode = Math.min(timelinePoints.length - 1, activeNode + 1);
            updateEducationCard(activeNode);
        });
    }
    
    if (controls.autoplay) {
        let isPlaying = false;
        controls.autoplay.addEventListener('click', () => {
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                controls.autoplay.querySelector('i').className = 'fas fa-pause';
                autoPlayInterval = setInterval(() => {
                    activeNode = (activeNode + 1) % timelinePoints.length;
                    updateEducationCard(activeNode);
                }, 3000);
            } else {
                controls.autoplay.querySelector('i').className = 'fas fa-play';
                clearInterval(autoPlayInterval);
            }
        });
    }
    
    // Initialize first card
    updateEducationCard(0);
}

function createHTMLTimelinePoint(point, position) {
    const container = document.querySelector('.timeline-points');
    if (!container) return;
    
    const pointElement = document.createElement('div');
    pointElement.className = 'timeline-point';
    pointElement.setAttribute('data-year', point.year);
    pointElement.style.setProperty('--point-color', `#${point.color.toString(16).padStart(6, '0')}`);
    
    pointElement.innerHTML = `<i class="fas fa-graduation-cap"></i>`;
    
    // Position based on 3D coordinates (simplified)
    const x = 50 + (position.x / 20) * 25;
    const y = 50 + (position.y / 20) * 25;
    
    pointElement.style.left = `${x}%`;
    pointElement.style.top = `${y}%`;
    
    pointElement.addEventListener('click', () => {
        const year = point.year;
        const index = Array.from(document.querySelectorAll('.timeline-point')).indexOf(pointElement);
        updateEducationCard(index);
    });
    
    container.appendChild(pointElement);
}

function updateEducationCard(index) {
    const cards = document.querySelectorAll('.education-card');
    const points = document.querySelectorAll('.timeline-point');
    
    // Update cards
    cards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
    
    // Update points
    points.forEach((point, i) => {
        point.classList.toggle('active', i === index);
    });
}

// ============================================
// CERTIFICATES 3D GALLERY
// ============================================

function initCertificates3D() {
    const canvas = document.getElementById('certificates-canvas');
    if (!canvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        alpha: true,
        antialias: true 
    });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    
    // Certificates data
    const certificates = [
        { 
            title: 'Full-Stack Web Development',
            provider: 'Coding Academy',
            date: '2023',
            color: 0x2563eb
        },
        { 
            title: 'JavaScript Advanced',
            provider: 'JS University',
            date: '2023',
            color: 0x7c3aed
        },
        { 
            title: 'React Developer',
            provider: 'React Masters',
            date: '2024',
            color: 0x06d6a0
        },
        { 
            title: 'Node.js Backend',
            provider: 'Backend School',
            date: '2024',
            color: 0xf59e0b
        },
        { 
            title: 'AWS Cloud',
            provider: 'Amazon Web Services',
            date: '2024',
            color: 0xef4444
        }
    ];
    
    // Create certificate cards
    const certificateCards = [];
    const radius = 8;
    
    certificates.forEach((cert, i) => {
        const angle = (i / certificates.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        // Create card geometry
        const geometry = new THREE.BoxGeometry(3, 4, 0.1);
        const material = new THREE.MeshPhongMaterial({
            color: cert.color,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });
        
        const card = new THREE.Mesh(geometry, material);
        card.position.set(x, 0, z);
        card.lookAt(new THREE.Vector3(0, 0, 0));
        
        card.userData = {
            cert,
            index: i,
            hover: false,
            originalPosition: card.position.clone()
        };
        
        scene.add(card);
        certificateCards.push(card);
        
        // Create HTML card
        createHTMLCertificateCard(cert, i);
    });
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    camera.position.set(0, 5, 15);
    
    // Animation
    let time = 0;
    let rotationSpeed = 0.002;
    
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;
        
        // Rotate certificates
        certificateCards.forEach((card, i) => {
            const data = card.userData;
            const angle = (i / certificates.length) * Math.PI * 2 + time * rotationSpeed;
            
            // Circular motion
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            card.position.x = x;
            card.position.z = z;
            card.lookAt(new THREE.Vector3(0, 0, 0));
            
            // Floating animation
            card.position.y = Math.sin(time + i) * 1;
            
            // Hover effect
            if (data.hover) {
                card.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
                card.position.y += 1;
            } else {
                card.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
            }
            
            // Rotation
            card.rotation.y += 0.01;
        });
        
        // Camera animation
        camera.position.x = Math.sin(time * 0.1) * 5;
        camera.position.y = 5 + Math.sin(time * 0.2) * 1;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
    
    // Gallery controls
    const controls = {
        prev: document.getElementById('gallery-prev'),
        next: document.getElementById('gallery-next'),
        toggle3d: document.getElementById('gallery-3d'),
        download: document.getElementById('gallery-download')
    };
    
    let currentIndex = 0;
    
    if (controls.prev) {
        controls.prev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + certificates.length) % certificates.length;
            updateGalleryFocus(currentIndex);
        });
    }
    
    if (controls.next) {
        controls.next.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % certificates.length;
            updateGalleryFocus(currentIndex);
        });
    }
    
    if (controls.toggle3d) {
        let is3D = true;
        controls.toggle3d.addEventListener('click', () => {
            is3D = !is3D;
            rotationSpeed = is3D ? 0.002 : 0;
            controls.toggle3d.querySelector('i').className = 
                is3D ? 'fas fa-th-large' : 'fas fa-cube';
        });
    }
    
    // Initialize gallery
    updateGalleryFocus(0);
    
    // Certificate preview
    const previewModal = document.getElementById('certificate-preview');
    const previewClose = document.getElementById('preview-close');
    
    if (previewClose) {
        previewClose.addEventListener('click', () => {
            previewModal.classList.remove('active');
        });
    }
    
    // Close modal on outside click
    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            previewModal.classList.remove('active');
        }
    });
}

function createHTMLCertificateCard(cert, index) {
    const container = document.querySelector('.certificate-cards-container');
    if (!container) return;
    
    const card = document.createElement('div');
    card.className = 'certificate-3d-card';
    card.style.transform = `rotateY(${index * (360 / 5)}deg) translateZ(250px)`;
    
    card.innerHTML = `
        <div class="certificate-front">
            <div class="certificate-icon">
                <i class="fas fa-award"></i>
            </div>
            <div class="certificate-title">${cert.title}</div>
            <div class="certificate-description">
                Certification in ${cert.title} from ${cert.provider}
            </div>
            <div class="certificate-meta">
                <div class="meta-item">
                    <i class="fas fa-building"></i>
                    <span>${cert.provider}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>${cert.date}</span>
                </div>
            </div>
        </div>
        <div class="certificate-back">
            <div class="certificate-title">${cert.title}</div>
            <div class="certificate-description">
                This certification validates skills and knowledge in ${cert.title}.
            </div>
            <div class="certificate-skills">
                <h4>Skills Gained</h4>
                <div class="skills-list">
                    <span class="skill-badge">Technology</span>
                    <span class="skill-badge">Development</span>
                    <span class="skill-badge">Best Practices</span>
                </div>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        showCertificatePreview(cert);
    });
    
    card.addEventListener('mouseenter', () => {
        card.style.transform = `rotateY(${index * (360 / 5)}deg) translateZ(300px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `rotateY(${index * (360 / 5)}deg) translateZ(250px)`;
    });
    
    container.appendChild(card);
}

function updateGalleryFocus(index) {
    const cards = document.querySelectorAll('.certificate-3d-card');
    const angleStep = 360 / cards.length;
    
    cards.forEach((card, i) => {
        const angle = i * angleStep - index * angleStep;
        card.style.transform = `rotateY(${angle}deg) translateZ(250px)`;
        
        // Highlight current card
        if (i === index) {
            card.style.zIndex = '10';
        } else {
            card.style.zIndex = '1';
        }
    });
}

function showCertificatePreview(cert) {
    const modal = document.getElementById('certificate-preview');
    const title = document.getElementById('preview-title');
    const provider = document.getElementById('preview-provider');
    const date = document.getElementById('preview-date');
    const description = document.getElementById('preview-description');
    
    if (title) title.textContent = cert.title;
    if (provider) provider.textContent = cert.provider;
    if (date) date.textContent = cert.date;
    if (description) description.textContent = `This certification was awarded for successfully completing the ${cert.title} course from ${cert.provider}. It validates practical skills and theoretical knowledge in the field.`;
    
    modal.classList.add('active');
}

// ============================================
// CONTACT 3D
// ============================================

function initContact3D() {
    const canvas = document.getElementById('contact-canvas');
    if (!canvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        alpha: true,
        antialias: true 
    });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    
    // Create floating particles
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({ 
            color: Math.random() > 0.5 ? 0x2563eb : 0x06d6a0,
            transparent: true,
            opacity: 0.5
        });
        
        const particle = new THREE.Mesh(geometry, material);
        particle.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        
        particle.userData = {
            speed: Math.random() * 0.02 + 0.01,
            direction: new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize()
        };
        
        scene.add(particle);
        particles.push(particle);
    }
    
    // Create connection lines
    const lines = [];
    const lineCount = 30;
    
    for (let i = 0; i < lineCount; i++) {
        const start = new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        
        const end = start.clone().add(
            new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).multiplyScalar(3)
        );
        
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const material = new THREE.LineBasicMaterial({ 
            color: 0x2563eb,
            transparent: true,
            opacity: 0.3
        });
        
        const line = new THREE.Line(geometry, material);
        line.userData = {
            start: start.clone(),
            end: end.clone(),
            phase: Math.random() * Math.PI * 2
        };
        
        scene.add(line);
        lines.push(line);
    }
    
    camera.position.z = 15;
    
    // Animation
    let time = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;
        
        // Update particles
        particles.forEach(particle => {
            const data = particle.userData;
            
            // Move particle
            particle.position.add(data.direction.clone().multiplyScalar(data.speed));
            
            // Bounce off boundaries
            if (Math.abs(particle.position.x) > 5) data.direction.x *= -1;
            if (Math.abs(particle.position.y) > 5) data.direction.y *= -1;
            if (Math.abs(particle.position.z) > 5) data.direction.z *= -1;
            
            // Pulsing effect
            particle.scale.setScalar(1 + Math.sin(time + particle.position.x) * 0.2);
        });
        
        // Update lines
        lines.forEach(line => {
            const data = line.userData;
            
            // Animate line ends
            const start = data.start.clone();
            const end = data.end.clone();
            
            start.y += Math.sin(time + data.phase) * 0.5;
            end.y += Math.sin(time + data.phase + 1) * 0.5;
            
            line.geometry.setFromPoints([start, end]);
            
            // Pulsing opacity
            line.material.opacity = 0.2 + Math.sin(time + data.phase) * 0.1;
        });
        
        // Camera rotation
        camera.position.x = Math.sin(time * 0.1) * 5;
        camera.position.y = Math.cos(time * 0.1) * 3;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    const responseModal = document.getElementById('contact-response');
    const responseClose = document.getElementById('response-close');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Show success message
            if (responseModal) {
                responseModal.classList.add('active');
            }
            
            // In a real application, you would send this data to a server
            console.log('Contact form submitted:', data);
            
            // Reset form
            contactForm.reset();
        });
    }
    
    if (responseClose) {
        responseClose.addEventListener('click', () => {
            if (responseModal) {
                responseModal.classList.remove('active');
            }
        });
    }
    
    // Floating cards animation
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, i) => {
        gsap.to(card, {
            y: 20,
            duration: 3 + i,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.5
        });
    });
}

// ============================================
// MINI OPERATING SYSTEM
// ============================================

function initMiniOS() {
    const miniOS = document.getElementById('mini-os');
    const osToggle = document.getElementById('nav-os-toggle');
    const bootScreen = document.getElementById('boot-screen');
    const desktop = document.getElementById('os-desktop');
    const startBtn = document.getElementById('os-start-btn');
    const startMenu = document.getElementById('start-menu');
    const shutdownBtn = document.getElementById('os-shutdown');
    
    if (!osToggle || !miniOS) return;
    
    // OS Toggle
    osToggle.addEventListener('click', () => {
        miniOS.classList.add('active');
        startBootSequence();
    });
    
    // Start boot sequence
    function startBootSequence() {
        const progressBar = document.getElementById('boot-progress-bar');
        const bootStatus = document.getElementById('boot-status');
        
        let progress = 0;
        const steps = [
            'Loading kernel...',
            'Mounting file system...',
            'Starting services...',
            'Initializing UI...',
            'Launching desktop...'
        ];
        
        const interval = setInterval(() => {
            progress += 20;
            progressBar.style.width = `${progress}%`;
            
            if (progress <= 100) {
                bootStatus.textContent = steps[Math.floor(progress / 20) - 1];
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    bootScreen.style.display = 'none';
                    desktop.style.display = 'block';
                    initDesktop();
                }, 1000);
            }
        }, 500);
    }
    
    function initDesktop() {
        // Start menu toggle
        if (startBtn && startMenu) {
            startBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                startMenu.classList.toggle('active');
            });
            
            // Close start menu when clicking elsewhere
            document.addEventListener('click', (e) => {
                if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
                    startMenu.classList.remove('active');
                }
            });
        }
        
        // Desktop icons
        const desktopIcons = document.querySelectorAll('.desktop-icon');
        desktopIcons.forEach(icon => {
            icon.addEventListener('dblclick', () => {
                const app = icon.getAttribute('data-app');
                openApp(app);
            });
        });
        
        // Taskbar apps
        const taskbarApps = document.querySelectorAll('.taskbar-app');
        taskbarApps.forEach(app => {
            app.addEventListener('click', () => {
                const appName = app.getAttribute('data-app');
                openApp(appName);
                
                // Update active state
                taskbarApps.forEach(a => a.classList.remove('active'));
                app.classList.add('active');
            });
        });
        
        // Start menu apps
        const startMenuApps = document.querySelectorAll('.app-tile');
        startMenuApps.forEach(app => {
            app.addEventListener('click', () => {
                const appName = app.getAttribute('data-app');
                openApp(appName);
                startMenu.classList.remove('active');
            });
        });
        
        // OS clock
        function updateOSClock() {
            const clock = document.getElementById('os-clock');
            const date = document.getElementById('os-date');
            
            if (clock) {
                const now = new Date();
                clock.querySelector('span').textContent = now.toLocaleTimeString();
            }
            
            if (date) {
                const now = new Date();
                date.querySelector('span').textContent = now.toLocaleDateString();
            }
        }
        
        setInterval(updateOSClock, 1000);
        updateOSClock();
        
        // Shutdown
        if (shutdownBtn) {
            shutdownBtn.addEventListener('click', () => {
                shutdownOS();
            });
        }
        
        const shutdownMenuBtn = document.getElementById('os-shutdown-menu');
        if (shutdownMenuBtn) {
            shutdownMenuBtn.addEventListener('click', () => {
                shutdownOS();
            });
        }
    }
    
    function openApp(appName) {
        const windowsContainer = document.getElementById('os-windows');
        
        // Check if window is already open
        const existingWindow = windowsContainer.querySelector(`.${appName}-window`);
        if (existingWindow) {
            existingWindow.style.zIndex = getHighestZIndex() + 1;
            return;
        }
        
        // Create window based on app
        let windowElement;
        
        switch(appName) {
            case 'portfolio':
                windowElement = createPortfolioWindow();
                break;
            case 'browser':
                windowElement = createBrowserWindow();
                break;
            case 'terminal':
                windowElement = createTerminalWindow();
                break;
            default:
                windowElement = createGenericWindow(appName);
        }
        
        windowsContainer.appendChild(windowElement);
        makeDraggable(windowElement);
        
        // Position window
        const offset = 30 * document.querySelectorAll('.os-window').length;
        windowElement.style.left = `${100 + offset}px`;
        windowElement.style.top = `${100 + offset}px`;
    }
    
    function createPortfolioWindow() {
        const template = document.getElementById('portfolio-window-template');
        const window = template.content.cloneNode(true).querySelector('.os-window');
        
        window.querySelector('.window-content').innerHTML = `
            <h3>Bharat Poojari - Portfolio</h3>
            <p>Full-Stack Developer from Sirsi, Karnataka</p>
            <div class="os-portfolio-content">
                <div class="os-stats">
                    <div class="os-stat">
                        <i class="fas fa-code"></i>
                        <span>20+ Projects</span>
                    </div>
                    <div class="os-stat">
                        <i class="fas fa-clock"></i>
                        <span>3 Years Experience</span>
                    </div>
                    <div class="os-stat">
                        <i class="fas fa-layer-group"></i>
                        <span>15+ Technologies</span>
                    </div>
                </div>
                <div class="os-quick-links">
                    <button class="os-btn" onclick="scrollToSection('projects')">
                        <i class="fas fa-rocket"></i>
                        View Projects
                    </button>
                    <button class="os-btn" onclick="scrollToSection('contact')">
                        <i class="fas fa-envelope"></i>
                        Contact Me
                    </button>
                </div>
            </div>
        `;
        
        return window;
    }
    
    function createBrowserWindow() {
        const template = document.getElementById('browser-window-template');
        return template.content.cloneNode(true).querySelector('.os-window');
    }
    
    function createTerminalWindow() {
        const template = document.getElementById('terminal-window-template');
        const window = template.content.cloneNode(true).querySelector('.os-window');
        
        window.querySelector('.window-content').innerHTML = `
            <div class="os-terminal">
                <div class="terminal-line">BharatOS Terminal v2.0</div>
                <div class="terminal-line">Type "help" for commands</div>
                <div class="terminal-line">
                    <span class="prompt">$</span>
                    <input type="text" class="os-terminal-input" placeholder="Enter command...">
                </div>
            </div>
        `;
        
        return window;
    }
    
    function createGenericWindow(appName) {
        const window = document.createElement('div');
        window.className = `os-window ${appName}-window`;
        
        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="fas fa-${appName === 'skills' ? 'cogs' : 
                                       appName === 'education' ? 'graduation-cap' :
                                       appName === 'certificates' ? 'award' :
                                       appName === 'contact' ? 'envelope' : 'cog'}"></i>
                    <span>${appName.charAt(0).toUpperCase() + appName.slice(1)}</span>
                </div>
                <div class="window-controls">
                    <button class="window-btn minimize">−</button>
                    <button class="window-btn maximize">□</button>
                    <button class="window-btn close">×</button>
                </div>
            </div>
            <div class="window-content">
                <h3>${appName.charAt(0).toUpperCase() + appName.slice(1)} Application</h3>
                <p>This is the ${appName} application running inside BharatOS.</p>
            </div>
        `;
        
        return window;
    }
    
    function makeDraggable(element) {
        const header = element.querySelector('.window-header');
        let isDragging = false;
        let offsetX, offsetY;
        
        header.addEventListener('mousedown', startDrag);
        
        function startDrag(e) {
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            
            element.style.zIndex = getHighestZIndex() + 1;
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
        }
        
        function drag(e) {
            if (!isDragging) return;
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }
        
        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        }
        
        // Window controls
        const closeBtn = element.querySelector('.window-btn.close');
        const minimizeBtn = element.querySelector('.window-btn.minimize');
        const maximizeBtn = element.querySelector('.window-btn.maximize');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                element.remove();
            });
        }
        
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                element.style.display = 'none';
                // In a full implementation, you'd add to taskbar
            });
        }
        
        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', () => {
                element.classList.toggle('maximized');
                if (element.classList.contains('maximized')) {
                    element.style.width = '100%';
                    element.style.height = '100%';
                    element.style.left = '0';
                    element.style.top = '0';
                } else {
                    element.style.width = '';
                    element.style.height = '';
                }
            });
        }
    }
    
    function getHighestZIndex() {
        const windows = document.querySelectorAll('.os-window');
        let highest = 0;
        
        windows.forEach(window => {
            const zIndex = parseInt(window.style.zIndex) || 0;
            if (zIndex > highest) highest = zIndex;
        });
        
        return highest;
    }
    
    function shutdownOS() {
        const desktop = document.getElementById('os-desktop');
        const bootScreen = document.getElementById('boot-screen');
        
        desktop.style.opacity = '0';
        
        setTimeout(() => {
            desktop.style.display = 'none';
            bootScreen.style.display = 'flex';
            bootScreen.style.opacity = '1';
            
            // Reset boot screen
            const progressBar = document.getElementById('boot-progress-bar');
            const bootStatus = document.getElementById('boot-status');
            
            progressBar.style.width = '0%';
            bootStatus.textContent = 'Shutting down...';
            
            setTimeout(() => {
                miniOS.classList.remove('active');
                
                // Reset for next boot
                setTimeout(() => {
                    bootScreen.style.opacity = '1';
                    const windows = document.querySelectorAll('.os-window');
                    windows.forEach(window => window.remove());
                }, 500);
            }, 1000);
        }, 500);
    }
}

// ============================================
// EASTER EGGS
// ============================================

function initEasterEggs() {
    let eggCount = 0;
    const eggs = [
        { code: 'secret', message: 'You found the secret developer mode!' },
        { code: 'matrix', message: 'You entered the matrix!' },
        { code: 'warp', message: 'Engaging warp speed!' },
        { code: 'developer', message: 'Developer tools activated!' }
    ];
    
    // Konami Code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                       'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
                       'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        // Check for Konami Code
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                activateKonamiCode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
        
        // Check for other easter eggs
        eggs.forEach(egg => {
            if (e.key.toLowerCase() === egg.code[0]) {
                checkEasterEgg(egg.code);
            }
        });
    });
    
    // Secret click areas
    const secretAreas = [
        { element: '#nav-logo', clicks: 5, message: 'Secret logo activated!' },
        { element: '.footer-secret', clicks: 3, message: 'You found the footer secret!' }
    ];
    
    secretAreas.forEach(area => {
        const element = document.querySelector(area.element);
        if (element) {
            let clickCount = 0;
            let timeout;
            
            element.addEventListener('click', () => {
                clickCount++;
                clearTimeout(timeout);
                
                timeout = setTimeout(() => {
                    if (clickCount >= area.clicks) {
                        triggerEasterEgg(area.message);
                        clickCount = 0;
                    }
                }, 1000);
            });
        }
    });
    
    function checkEasterEgg(code) {
        // Check if the user is typing an easter egg code
        // This is a simplified version
    }
    
    function activateKonamiCode() {
        eggCount++;
        updateEggCounter();
        
        // Show notification
        showEggNotification('Konami Code activated! All animations enhanced!');
        
        // Activate effects
        document.body.classList.add('konami-active');
        
        // Enhance animations
        gsap.to('body', {
            '--cosmic-primary': '#ff00ff',
            '--cosmic-accent': '#00ffff',
            duration: 1,
            ease: 'power2.inOut'
        });
        
        // Add particle explosion
        createParticleExplosion();
        
        // Show konami indicator
        const indicator = document.getElementById('konami-indicator');
        if (indicator) {
            indicator.style.display = 'flex';
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 3000);
        }
    }
    
    function triggerEasterEgg(message) {
        eggCount++;
        updateEggCounter();
        showEggNotification(message);
    }
    
    function showEggNotification(message) {
        const notification = document.getElementById('egg-notification');
        if (!notification) return;
        
        notification.querySelector('#egg-message').textContent = message;
        notification.style.display = 'flex';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
        
        // Close button
        const closeBtn = notification.querySelector('.egg-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                notification.style.display = 'none';
            });
        }
    }
    
    function updateEggCounter() {
        const counter = document.getElementById('egg-counter');
        const countElement = document.getElementById('egg-count');
        
        if (counter && countElement) {
            countElement.textContent = eggCount;
            counter.style.display = 'flex';
        }
    }
    
    function createParticleExplosion() {
        const container = document.getElementById('cosmic-particles');
        if (!container) return;
        
        const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#00ff00'];
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'easter-egg-particle';
            
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                left: 50%;
                top: 50%;
                pointer-events: none;
                z-index: 9999;
                box-shadow: 0 0 ${size * 2}px ${color};
            `;
            
            container.appendChild(particle);
            
            // Animate
            gsap.to(particle, {
                x: (Math.random() - 0.5) * 500,
                y: (Math.random() - 0.5) * 500,
                opacity: 0,
                scale: 0,
                duration: 2,
                ease: 'power2.out',
                onComplete: () => {
                    particle.remove();
                }
            });
        }
    }
    
    // Hidden developer console
    let devConsoleOpen = false;
    const devConsole = document.createElement('div');
    devConsole.id = 'dev-console';
    devConsole.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 300px;
        background: rgba(0, 0, 0, 0.9);
        border-top: 2px solid #00ff00;
        color: #00ff00;
        font-family: monospace;
        padding: 10px;
        overflow-y: auto;
        display: none;
        z-index: 10000;
    `;
    
    document.body.appendChild(devConsole);
    
    // Open dev console with Ctrl+Shift+I
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            devConsoleOpen = !devConsoleOpen;
            devConsole.style.display = devConsoleOpen ? 'block' : 'none';
            
            if (devConsoleOpen) {
                devConsole.innerHTML = `
                    <div>BharatOS Developer Console</div>
                    <div>Type "help" for commands</div>
                    <div>> _</div>
                `;
            }
        }
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    // Animate elements on scroll
    const animateElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.getAttribute('data-animate');
                
                // Add animation class
                element.classList.add('animate-' + animation);
                
                // Unobserve after animation
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Parallax effects
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax-speed') || 0.5;
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    });
    
    // Section reveal animations
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Animate stats in skills section
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
            }
        });
    }, {
        threshold: 0.2
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-grid-fill');
    
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

function initScrollTriggers() {
    // GSAP ScrollTrigger animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animations
    gsap.from('.hero-3d-title', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.terminal-preview', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
    });
    
    gsap.from('.stat-3d-card', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.8,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-actions', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 1.2,
        ease: 'power3.out'
    });
    
    // About section animations
    gsap.from('.about-container > *', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: 'power3.out'
    });
    
    // Skills section animations
    gsap.from('.skills-view-toggle', {
        scrollTrigger: {
            trigger: '.skills-section',
            start: 'top 80%'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    // Projects section animations
    gsap.from('.project-view-controls', {
        scrollTrigger: {
            trigger: '.projects-section',
            start: 'top 80%'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
}

// ============================================
// RESPONSIVE FUNCTIONS
// ============================================

function initResponsive() {
    // Handle window resize
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
    
    // Initial check
    handleResize();
    
    function handleResize() {
        const width = window.innerWidth;
        
        // Adjust 3D canvas sizes
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            const container = canvas.parentElement;
            if (container) {
                canvas.width = container.clientWidth;
                canvas.height = container.clientHeight;
            }
        });
        
        // Handle mobile navigation
        if (width <= 768) {
            // Mobile specific adjustments
            document.querySelectorAll('.floating-element').forEach(el => {
                el.style.display = 'none';
            });
        } else {
            // Desktop adjustments
            document.querySelectorAll('.floating-element').forEach(el => {
                el.style.display = 'flex';
            });
        }
        
        // Adjust font sizes for mobile
        if (width <= 480) {
            document.documentElement.style.setProperty('--font-scale', '0.8');
        } else if (width <= 768) {
            document.documentElement.style.setProperty('--font-scale', '0.9');
        } else {
            document.documentElement.style.setProperty('--font-scale', '1');
        }
    }
}

// ============================================
// ACCESSIBILITY
// ============================================

function initAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Skip to main content
        if (e.key === 'Tab' && e.shiftKey) {
            // Handle shift+tab navigation
        }
        
        // Escape key closes modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Focus trap for modals
    const modals = document.querySelectorAll('.modal, .certificate-preview-modal, .contact-response-modal');
    
    modals.forEach(modal => {
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    });
    
    // High contrast mode toggle
    const highContrastToggle = document.createElement('button');
    highContrastToggle.id = 'high-contrast-toggle';
    highContrastToggle.setAttribute('aria-label', 'Toggle high contrast mode');
    highContrastToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 40px;
        height: 40px;
        background: var(--cosmic-primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    highContrastToggle.innerHTML = '<i class="fas fa-eye"></i>';
    document.body.appendChild(highContrastToggle);
    
    highContrastToggle.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
        const icon = highContrastToggle.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
    
    // Reduce motion preference
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (reduceMotion.matches) {
        document.body.classList.add('reduce-motion');
        
        // Disable animations
        gsap.globalTimeline.timeScale(0.1);
        
        // Stop auto-rotating animations
        document.querySelectorAll('[data-autorotate]').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    }
    
    // Screen reader announcements
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.classList.add('sr-only');
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }
    
    // Make interactive elements more accessible
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
    
    interactiveElements.forEach(el => {
        if (!el.hasAttribute('aria-label')) {
            const text = el.textContent.trim() || el.querySelector('[alt]')?.alt || '';
            if (text) {
                el.setAttribute('aria-label', text);
            }
        }
        
        // Add focus styles
        el.addEventListener('focus', () => {
            el.classList.add('focused');
        });
        
        el.addEventListener('blur', () => {
            el.classList.remove('focused');
        });
    });
    
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--cosmic-primary);
        color: white;
        padding: 8px;
        z-index: 10000;
        text-decoration: none;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content id
    const mainContent = document.querySelector('main') || document.querySelector('.hero-section');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal.active, .certificate-preview-modal.active, .contact-response-modal.active').forEach(modal => {
        modal.classList.remove('active');
    });
    
    // Close start menu if open
    const startMenu = document.getElementById('start-menu');
    if (startMenu) {
        startMenu.classList.remove('active');
    }
}

// ============================================
// 3D EFFECTS TOGGLE
// ============================================

function enable3DEffects() {
    // Enable all 3D effects
    document.body.classList.add('3d-enabled');
    
    // Enhance existing 3D scenes
    const scenes = document.querySelectorAll('canvas');
    scenes.forEach(canvas => {
        // Add more particles or effects
    });
    
    // Add parallax to more elements
    gsap.to('.hero-content', {
        rotationY: 5,
        rotationX: 5,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 1
    });
}

function disable3DEffects() {
    document.body.classList.remove('3d-enabled');
    
    // Reset transformations
    gsap.to('.hero-content', {
        rotationY: 0,
        rotationX: 0,
        ease: 'power2.out',
        duration: 1
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Export functions for global access
window.scrollToSection = scrollToSection;
window.openApp = function(appName) {
    const miniOS = document.getElementById('mini-os');
    if (miniOS && miniOS.classList.contains('active')) {
        // Implementation would go here
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    // Main initialization already handled by DOMContentLoaded
    console.log('Portfolio initialized successfully!');
}