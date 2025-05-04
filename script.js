// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize language
    let currentLanguage = 'es';
    loadLanguage(currentLanguage);
    
    // Initialize theme
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches) {
        document.body.setAttribute('data-theme', 'dark');
        document.getElementById('theme-toggle').checked = true;
    }
    
    // Event Listeners
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    // Language toggle
    const languageToggle = document.getElementById('language-toggle');
    languageToggle.addEventListener('change', function() {
        const newLanguage = this.checked ? 'en' : 'es';
        loadLanguage(newLanguage);
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('change', function() {
        document.body.setAttribute('data-theme', this.checked ? 'dark' : 'light');
    });
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80; // Adjust based on your header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Load language data and update UI
async function loadLanguage(lang) {
    try {
        const response = await fetch(`${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load language file: ${response.status}`);
        }
        
        const data = await response.json();
        updateContent(data);
        currentLanguage = lang;
    } catch (error) {
        console.error('Error loading language file:', error);
    }
}

// Update all content with the selected language
function updateContent(data) {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = getNestedProperty(data, key);
        
        if (value !== undefined) {
            element.textContent = value;
        }
    });
    
    // Update skills lists
    updateSkillsList(data.skills.technical.items, 'technical-skills');
    updateSkillsList(data.skills.soft.items, 'soft-skills');
    
    // Update experience items
    updateExperienceItems(data.experience.items);
    
    // Update education items
    updateEducationItems(data.education.items);
    
    // Update certifications
    updateCertificationsList(data.certifications.items);
}

// Helper function to get nested properties from an object using dot notation
function getNestedProperty(obj, path) {
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : undefined;
    }, obj);
}

// Update skills list
function updateSkillsList(skills, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    skills.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        container.appendChild(li);
    });
}

// Update experience items
function updateExperienceItems(experiences) {
    const container = document.getElementById('experience-content');
    container.innerHTML = '';
    
    experiences.forEach(exp => {
        const item = document.createElement('div');
        item.className = 'experience-item';
        
        const header = document.createElement('div');
        header.className = 'experience-header';
        
        const title = document.createElement('h3');
        title.className = 'experience-title';
        title.textContent = exp.title;
        
        const company = document.createElement('div');
        company.className = 'experience-company';
        company.textContent = exp.company;
        
        const period = document.createElement('div');
        period.className = 'experience-period';
        period.textContent = exp.period;
        
        const location = document.createElement('div');
        location.className = 'experience-location';
        location.textContent = exp.location;
        
        header.appendChild(title);
        header.appendChild(company);
        header.appendChild(period);
        header.appendChild(location);
        
        const responsibilities = document.createElement('ul');
        responsibilities.className = 'responsibilities-list';
        
        exp.responsibilities.forEach(resp => {
            const li = document.createElement('li');
            li.textContent = resp;
            responsibilities.appendChild(li);
        });
        
        item.appendChild(header);
        item.appendChild(responsibilities);
        container.appendChild(item);
    });
}

// Update education items
function updateEducationItems(educationItems) {
    const container = document.getElementById('education-content');
    container.innerHTML = '';
    
    educationItems.forEach(edu => {
        const item = document.createElement('div');
        item.className = 'education-item';
        
        const link = document.createElement('a');
        link.href = edu.url || '#';
        if (edu.url) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
        
        const title = document.createElement('div');
        title.className = 'education-title';
        title.textContent = edu.title;
        
        const institution = document.createElement('div');
        institution.className = 'education-institution';
        institution.textContent = edu.institution;
        
        const type = document.createElement('div');
        type.className = 'education-type';
        type.textContent = edu.type;
        
        link.appendChild(title);
        link.appendChild(institution);
        link.appendChild(type);
        
        item.appendChild(link);
        container.appendChild(item);
    });
}

// Update certifications list
function updateCertificationsList(certifications) {
    const container = document.getElementById('certifications-list');
    container.innerHTML = '';
    
    certifications.forEach(cert => {
        const li = document.createElement('li');
        li.textContent = cert;
        container.appendChild(li);
    });
}