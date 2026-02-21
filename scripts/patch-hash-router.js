const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            results = results.concat(walk(fullPath));
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = walk('frontend/src');
let changedCount = 0;

files.forEach(filepath => {
    let content = fs.readFileSync(filepath, 'utf8');
    let changed = false;

    // Fix window.location.href = '/path'
    if (content.match(/window\.location\.href\s*=\s*'(\/[^']*)'/)) {
        content = content.replace(/window\.location\.href\s*=\s*'(\/[^']*)'/g, "window.location.hash = '$1'");
        changed = true;
    }

    // Fix isLoginPage path evaluation 
    if (content.includes("window.location.pathname === '/login'")) {
        content = content.replace(/window\.location\.pathname === '\/login'/g, "(window.location.pathname === '/login' || window.location.hash === '#/login')");
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`[FIXED] ${filepath}`);
        changedCount++;
    }
});

console.log(`Finished patching ${changedCount} files.`);
