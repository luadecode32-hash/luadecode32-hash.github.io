// ==========================================
// HexCore - Main Application Logic
// ==========================================

const App = {
    sidebar: document.getElementById('sidebar'),
    menuToggle: document.getElementById('menuToggle'),
    overlay: document.getElementById('overlay'),
    sections: document.querySelectorAll('.section'),
    navLinks: document.querySelectorAll('.nav-links a'),
    
    init() {
        this.bindEvents();
        this.initParticles();
        this.initTerminal();
        this.initScripts();
        this.initMemoryScanner();
        this.startCpuSimulation();
        this.updateLineNumbers();
    },

    bindEvents() {
        // Menu toggle
        this.menuToggle.addEventListener('click', () => this.toggleSidebar());
        this.overlay.addEventListener('click', () => this.closeSidebar());
        
        // Navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.navigateTo(target);
                if (window.innerWidth < 768) this.closeSidebar();
            });
        });

        // Lua editor line numbers
        const editor = document.getElementById('luaEditor');
        editor.addEventListener('input', () => this.updateLineNumbers());
        editor.addEventListener('scroll', () => this.syncScroll());
        editor.addEventListener('keydown', (e) => this.handleTab(e));
    },

    toggleSidebar() {
        this.sidebar.classList.toggle('open');
        this.menuToggle.classList.toggle('active');
        this.overlay.classList.toggle('active');
    },

    closeSidebar() {
        this.sidebar.classList.remove('open');
        this.menuToggle.classList.remove('active');
        this.overlay.classList.remove('active');
    },

    navigateTo(sectionId) {
        // Update sections
        this.sections.forEach(sec => sec.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        
        // Update nav
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        // Log
        this.log(`Navigated to ${sectionId}`, 'info');
    },

    log(message, type = 'info') {
        const terminal = document.getElementById('terminalBody');
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        const colors = { info: 'log-info', success: 'log-success', warn: 'log-warn', error: 'log-error' };
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `<span class="timestamp">[${time}]</span> <span class="${colors[type] || 'log-info'}">${type.toUpperCase()}</span> ${message}`;
        terminal.appendChild(entry);
        terminal.scrollTop = terminal.scrollHeight;
    },

    // Particle Background
    initParticles() {
        const canvas = document.getElementById('particleCanvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 170, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < 60; i++) particles.push(new Particle());

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connections
            particles.forEach((p, i) => {
                p.update();
                p.draw();
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = p.x - particles[j].x;
                    const dy = p.y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 212, 170, ${0.1 * (1 - dist / 150)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            });
            animationId = requestAnimationFrame(animate);
        };
        animate();

        // Expose toggle
        window.toggleParticles = () => {
            const toggle = document.getElementById('particlesToggle');
            if (!toggle.checked) {
                cancelAnimationFrame(animationId);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            } else {
                animate();
            }
        };
    },

    initTerminal() {
        setInterval(() => {
            const msgs = [
                ['Background sync complete', 'success'],
                ['Checking module integrity...', 'info'],
                ['No updates available', 'info'],
                ['Memory usage optimal', 'success'],
                ['Network latency: 24ms', 'info']
            ];
            if (Math.random() > 0.7) {
                const [msg, type] = msgs[Math.floor(Math.random() * msgs.length)];
                this.log(msg, type);
            }
        }, 8000);
    },

    startCpuSimulation() {
        setInterval(() => {
            const cpu = Math.floor(Math.random() * 30) + 5;
            document.getElementById('cpuValue').textContent = cpu + '%';
            document.querySelector('.stat-card .progress-fill').style.width = cpu + '%';
        }, 3000);
    },

    // Lua Editor
    updateLineNumbers() {
        const editor = document.getElementById('luaEditor');
        const lines = editor.value.split('\n').length;
        const numbers = Array.from({length: lines}, (_, i) => i + 1).join('\n');
        document.getElementById('lineNumbers').textContent = numbers;
    },

    syncScroll() {
        const editor = document.getElementById('luaEditor');
        document.getElementById('lineNumbers').scrollTop = editor.scrollTop;
    },

    handleTab(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            e.target.value = e.target.value.substring(0, start) + '    ' + e.target.value.substring(end);
            e.target.selectionStart = e.target.selectionEnd = start + 4;
            this.updateLineNumbers();
        }
    }
};

// ==========================================
// Hacking Lab Functions
// ==========================================

function analyzeHash() {
    const input = document.getElementById('hashInput').value.trim();
    const result = document.getElementById('hashResult');
    
    if (!input) {
        result.innerHTML = '<span style="color: var(--accent-warn)">Please enter a hash</span>';
        return;
    }

    let analysis = '';
    const len = input.length;
    
    if (/^[a-f0-9]{32}$/i.test(input)) analysis = 'MD5 (128-bit) | Length: 32 chars';
    else if (/^[a-f0-9]{40}$/i.test(input)) analysis = 'SHA-1 (160-bit) | Length: 40 chars';
    else if (/^[a-f0-9]{64}$/i.test(input)) analysis = 'SHA-256 (256-bit) | Length: 64 chars';
    else if (len === 128) analysis = 'SHA-512 (512-bit) | Length: 128 chars';
    else analysis = 'Unknown / Custom hash format';
    
    result.innerHTML = `<strong>Detected:</strong> ${analysis}<br><strong>Entropy:</strong> ${len * 4} bits<br><strong>Sample:</strong> ${input.substring(0, 16)}...`;
    App.log('Hash analysis performed', 'success');
}

function checkPassword(password) {
    const meter = document.querySelector('.strength-bar');
    const text = document.getElementById('strengthText');
    
    if (!password) {
        meter.style.width = '0%';
        meter.style.background = 'transparent';
        text.textContent = 'Enter a password';
        return;
    }

    let score = 0;
    if (password.length > 8) score += 25;
    if (password.length > 12) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;
    if (password.length > 16) score += 15;

    meter.style.width = score + '%';
    
    if (score < 30) {
        meter.style.background = 'var(--accent-danger)';
        text.textContent = 'Weak - Easily crackable';
    } else if (score < 60) {
        meter.style.background = 'var(--accent-warn)';
        text.textContent = 'Moderate - Could be stronger';
    } else if (score < 80) {
        meter.style.background = 'var(--accent-secondary)';
        text.textContent = 'Strong - Good protection';
    } else {
        meter.style.background = 'var(--accent-primary)';
        text.textContent = 'Very Strong - Excellent';
    }
}

function scanPorts() {
    const target = document.getElementById('portTarget').value || '127.0.0.1';
    const results = document.getElementById('portResults');
    results.innerHTML = '<div style="color: var(--text-muted); grid-column: 1/-1;">Scanning ' + target + '...</div>';
    
    const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 3306, 3389, 8080];
    
    setTimeout(() => {
        results.innerHTML = '';
        commonPorts.forEach((port, i) => {
            setTimeout(() => {
                const isOpen = Math.random() > 0.6;
                const div = document.createElement('div');
                div.className = `port-item ${isOpen ? 'open' : ''}`;
                div.innerHTML = `<div style="font-weight: 700;">${port}</div><div style="font-size: 0.7rem; opacity: 0.7;">${isOpen ? 'OPEN' : 'CLOSED'}</div>`;
                results.appendChild(div);
            }, i * 100);
        });
        App.log(`Port scan completed on ${target}`, 'success');
    }, 800);
}

function toBase64() {
    try {
        const input = document.getElementById('codecInput').value;
        document.getElementById('codecOutput').value = btoa(input);
    } catch(e) {
        document.getElementById('codecOutput').value = 'Error: ' + e.message;
    }
}

function fromBase64() {
    try {
        const input = document.getElementById('codecInput').value;
        document.getElementById('codecOutput').value = atob(input);
    } catch(e) {
        document.getElementById('codecOutput').value = 'Error: Invalid Base64';
    }
}

function toHex() {
    const input = document.getElementById('codecInput').value;
    let hex = '';
    for (let i = 0; i < input.length; i++) {
        hex += input.charCodeAt(i).toString(16).padStart(2, '0');
    }
    document.getElementById('codecOutput').value = hex;
}

function fromHex() {
    const input = document.getElementById('codecInput').value.replace(/\s/g, '');
    let str = '';
    for (let i = 0; i < input.length; i += 2) {
        str += String.fromCharCode(parseInt(input.substr(i, 2), 16));
    }
    document.getElementById('codecOutput').value = str;
}

function genUUID() {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    document.getElementById('genResult').textContent = uuid;
}

function genToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let token = '';
    for (let i = 0; i < 32; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('genResult').textContent = token;
}

function genHex() {
    let hex = '0x';
    for (let i = 0; i < 16; i++) {
        hex += Math.floor(Math.random() * 16).toString(16);
    }
    document.getElementById('genResult').textContent = hex;
}

// ==========================================
// Lua Engine
// ==========================================

function runLua() {
    const code = document.getElementById('luaEditor').value;
    const console = document.getElementById('luaConsole');
    
    console.innerHTML += `<div class="console-line system">> Executing script...</div>`;
    
    // Simulated Lua execution
    setTimeout(() => {
        const outputs = simulateLua(code);
        outputs.forEach(out => {
            const line = document.createElement('div');
            line.className = `console-line ${out.type}`;
            line.textContent = out.text;
            console.appendChild(line);
        });
        console.scrollTop = console.scrollHeight;
        App.log('Lua script executed', 'success');
    }, 500);
}

function simulateLua(code) {
    const outputs = [];
    const print = (msg) => outputs.push({ type: 'output', text: String(msg) });
    
    try {
        // Very basic simulation for demo purposes
        if (code.includes('calculate')) {
            print('HexCore Lua v1.0');
            print('Result: 15');
        } else if (code.includes('print')) {
            const matches = code.match(/print\s*\((.+)\)/g);
            if (matches) {
                matches.forEach(m => {
                    const content = m.replace(/print\s*\((.+)\)/, '$1').replace(/["']/g, '');
                    if (content.includes('..')) {
                        // Simple concatenation sim
                        print('Hello from HexCore');
                    } else {
                        print(content);
                    }
                });
            }
        } else {
            print('Script executed successfully (0.4ms)');
        }
        
        if (code.includes('function') && !code.includes('calculate')) {
            print('Function defined in global scope');
        }
    } catch(e) {
        outputs.push({ type: 'error', text: 'Error: ' + e.message });
    }
    
    return outputs;
}

function clearConsole() {
    document.getElementById('luaConsole').innerHTML = '<div class="console-line system">Console cleared.</div>';
}

function clearEditor() {
    document.getElementById('luaEditor').value = '';
    App.updateLineNumbers();
}

function loadExample() {
    const example = `-- Example: Table iteration
local players = {"Alice", "Bob", "Charlie"}

for i, name in ipairs(players) do
    print("Player " .. i .. ": " .. name)
end

-- Math operations
local damage = math.random(10, 50)
print("Damage dealt: " .. damage)`;
    
    document.getElementById('luaEditor').value = example;
    App.updateLineNumbers();
}

function insertSnippet(type) {
    const snippets = {
        loop: `for i = 1, 10 do\n    print(i)\nend`,
        function: `function myFunction(arg1, arg2)\n    return arg1 + arg2\nend`,
        table: `local myTable = {\n    key = "value",\n    num = 42\n}`,
        ifelse: `if condition then\n    -- true branch\nelse\n    -- false branch\nend`,
        string: `local text = "Hello World"\nlocal len = string.len(text)\nlocal sub = string.sub(text, 1, 5)`,
        math: `local pi = math.pi\nlocal rand = math.random(1, 100)\nlocal sqrt = math.sqrt(16)`
    };
    
    const editor = document.getElementById('luaEditor');
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const snippet = snippets[type] || '';
    
    editor.value = editor.value.substring(0, start) + snippet + editor.value.substring(end);
    App.updateLineNumbers();
}

// ==========================================
// College Predictor
// ==========================================

function predictCollege() {
    const score = parseInt(document.getElementById('examScore').value);
    const category = document.getElementById('category').value;
    const branch = document.getElementById('branch').value;
    
    const display = document.getElementById('predictionDisplay');
    const stats = document.getElementById('predictionStats');
    const list = document.getElementById('collegeList');
    
    if (!score) {
        display.innerHTML = '<div style="color: var(--accent-warn)">Please enter your rank/score</div>';
        return;
    }

    // Simulation logic
    let multiplier = { general: 1, obc: 1.5, sc: 2.5, st: 3, ews: 1.2 }[category] || 1;
    let adjustedRank = Math.floor(score / multiplier);
    
    const colleges = [
        { name: 'IIT Bombay', cutoff: 1000, tier: 1 },
        { name: 'IIT Delhi', cutoff: 1500, tier: 1 },
        { name: 'NIT Trichy', cutoff: 8000, tier: 2 },
        { name: 'BITS Pilani', cutoff: 12000, tier: 2 },
        { name: 'VIT Vellore', cutoff: 25000, tier: 3 },
        { name: 'SRM University', cutoff: 40000, tier: 3 },
        { name: 'Manipal Institute', cutoff: 35000, tier: 3 },
        { name: 'KIIT Bhubaneswar', cutoff: 50000, tier: 3 }
    ];

    let matches = colleges.map(c => {
        let prob = Math.max(0, Math.min(100, 100 - (adjustedRank / c.cutoff) * 100));
        if (branch === 'any') prob = Math.min(100, prob * 1.2);
        return { ...c, probability: Math.floor(prob) };
    }).filter(c => c.probability > 5).sort((a, b) => b.probability - a.probability);

    display.innerHTML = `<div style="text-align: center; padding: 20px;">
        <div style="font-size: 2.5rem; font-weight: 700; color: var(--accent-primary);">${matches.length}</div>
        <div style="color: var(--text-secondary);">Matching Colleges Found</div>
        <div style="margin-top: 10px; font-size: 0.85rem; color: var(--text-muted);">Adjusted Rank: ~${adjustedRank} (${category.toUpperCase()})</div>
    </div>`;
    
    stats.style.display = 'block';
    const avgProb = matches.length ? Math.floor(matches.reduce((a, b) => a + b.probability, 0) / matches.length) : 0;
    document.getElementById('probFill').style.width = avgProb + '%';
    document.getElementById('probText').textContent = avgProb + '%';

    list.innerHTML = matches.slice(0, 6).map(c => `
        <div class="college-item">
            <div>
                <div class="college-name">${c.name}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Tier ${c.tier} Institute</div>
            </div>
            <div class="college-prob">${c.probability}% match</div>
        </div>
    `).join('') || '<div style="text-align: center; color: var(--text-muted); padding: 20px;">No matches found. Try expanding branch preference.</div>';
    
    App.log(`College prediction run for rank ${score}`, 'success');
}

// ==========================================
// Memory Scanner Simulation
// ==========================================

let memData = [];
let scanResults = [];

function initMemoryScanner() {
    // Generate fake memory data
    for (let i = 0; i < 50; i++) {
        memData.push({
            address: '0x' + (0x7FFE0000 + i * 4).toString(16).toUpperCase(),
            type: ['4byte', 'float', 'double'][Math.floor(Math.random() * 3)],
            value: Math.floor(Math.random() * 1000),
            prev: Math.floor(Math.random() * 1000)
        });
    }
    renderMemoryTable(memData);
}

function renderMemoryTable(data) {
    const tbody = document.getElementById('memTableBody');
    tbody.innerHTML = data.map((row, i) => `
        <tr>
            <td style="color: var(--accent-secondary);">${row.address}</td>
            <td><span style="padding: 2px 8px; background: rgba(14,165,233,0.1); color: var(--accent-secondary); border-radius: 4px; font-size: 0.8rem;">${row.type}</span></td>
            <td style="color: var(--accent-primary); font-weight: 600;">${row.value}</td>
            <td style="color: var(--text-muted);">${row.prev}</td>
            <td><button class="btn btn-small btn-secondary" onclick="editMemory(${i})"><i class="fas fa-edit"></i></button></td>
        </tr>
    `).join('');
}

function searchMemory() {
    const search = document.getElementById('memSearch').value;
    const type = document.getElementById('memType').value;
    
    if (!search) {
        scanResults = [...memData];
    } else {
        scanResults = memData.filter(m => {
            const val = String(m.value);
            return val.includes(search) && (type === '4byte' ? true : m.type === type);
        });
    }
    
    renderMemoryTable(scanResults);
    App.log(`Memory scan: ${scanResults.length} results`, 'success');
}

function nextScan() {
    if (scanResults.length === 0) {
        App.log('Run First Scan before Next Scan', 'warn');
        return;
    }
    // Simulate filtering
    scanResults = scanResults.filter(() => Math.random() > 0.5);
    renderMemoryTable(scanResults);
    App.log(`Next scan filtered: ${scanResults.length} results`, 'info');
}

function resetScan() {
    scanResults = [];
    document.getElementById('memSearch').value = '';
    renderMemoryTable(memData);
    App.log('Memory scan reset', 'info');
}

function editMemory(index) {
    const newVal = prompt('Enter new value:', memData[index].value);
    if (newVal !== null) {
        memData[index].prev = memData[index].value;
        memData[index].value = newVal;
        renderMemoryTable(scanResults.length ? scanResults : memData);
        App.log(`Memory edited at ${memData[index].address}`, 'success');
    }
}

// ==========================================
// Script Hub
// ==========================================

function initScripts() {
    const scripts = [
        { title: 'Auto Farm', lang: 'Lua', desc: 'Automated resource collection script with configurable intervals and safety checks.', author: 'HexUser', downloads: '12.4k' },
        { title: 'ESP Wallhack', lang: 'Lua', desc: 'Entity highlighting through walls. Includes team color coding and distance display.', author: 'DevX', downloads: '8.2k' },
        { title: 'Speed Modifier', lang: 'Lua', desc: 'Adjust player movement speed with smooth interpolation and server sync bypass.', author: 'SpeedDemon', downloads: '24.1k' },
        { title: 'Aim Assist', lang: 'Lua', desc: 'Soft aim assistance with configurable FOV and smoothing factors.', author: 'ProScripter', downloads: '45.6k' },
        { title: 'No Recoil', lang: 'Lua', desc: 'Weapon recoil compensation with per-weapon profile support.', author: 'RecoilMaster', downloads: '18.9k' },
        { title: 'Teleport', lang: 'Lua', desc: 'Coordinate-based teleportation with collision detection and fall damage prevention.', author: 'Nexus', downloads: '6.3k' }
    ];

    const grid = document.getElementById('scriptGrid');
    grid.innerHTML = scripts.map(s => `
        <div class="script-card">
            <div class="script-header">
                <div class="script-title">${s.title}</div>
                <span class="script-lang">${s.lang}</span>
            </div>
            <div class="script-desc">${s.desc}</div>
            <div class="script-meta">
                <span><i class="fas fa-user"></i> ${s.author}</span>
                <span><i class="fas fa-download"></i> ${s.downloads}</span>
            </div>
            <div style="margin-top: 12px;">
                <button class="btn btn-primary btn-small" style="width: 100%;" onclick="App.log('Script downloaded: ${s.title}', 'success')">
                    <i class="fas fa-download"></i> Load Script
                </button>
            </div>
        </div>
    `).join('');
}

// ==========================================
// Tools Placeholder
// ==========================================

function openTool(tool) {
    const names = {
        calc: 'Calculator', converter: 'Unit Converter', json: 'JSON Formatter',
        color: 'Color Picker', regex: 'Regex Tester', diff: 'Text Diff'
    };
    App.log(`Tool opened: ${names[tool] || tool}`, 'info');
    alert(`${names[tool] || tool} would open in a modal or new view.\n\nThis is a demo placeholder - implement the full tool logic as needed.`);
}

// ==========================================
// Initialize
// ==========================================

document.addEventListener('DOMContentLoaded', () => App.init());
