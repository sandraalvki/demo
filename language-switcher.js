// Language Switcher
let currentLanguage = localStorage.getItem('language') || 'sv';
let translations = {};

// Make currentLanguage globally available
window.currentLanguage = currentLanguage;

// Load translations
async function loadTranslations() {
  try {
    const response = await fetch('translations.json');
    translations = await response.json();
    applyTranslations(currentLanguage);
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

// Apply translations to the page
function applyTranslations(lang) {
  if (!translations[lang]) return;

  currentLanguage = lang;
  window.currentLanguage = lang;
  localStorage.setItem('language', lang);
  document.documentElement.lang = lang;

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    const value = getTranslation(key, lang);
    if (value !== null) {
      if (
        element.tagName === 'INPUT' &&
        element.type !== 'submit' &&
        element.type !== 'button'
      ) {
        if (element.hasAttribute('placeholder')) {
          element.placeholder = value;
        } else {
          element.value = value;
        }
      } else if (element.tagName === 'TITLE') {
        element.textContent = value;
      } else {
        element.textContent = value;
      }
    }
  });

  // Update elements with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const key = element.getAttribute('data-i18n-placeholder');
    const value = getTranslation(key, lang);
    if (value !== null) {
      element.placeholder = value;
    }
  });

  // Update elements with data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach((element) => {
    const key = element.getAttribute('data-i18n-title');
    const value = getTranslation(key, lang);
    if (value !== null) {
      element.title = value;
    }
  });

  // Update language dropdown button
  updateLanguageButton();
}

// Get translation by key path (e.g., "index.profileName")
function getTranslation(key, lang) {
  if (!translations[lang]) return null;

  const keys = key.split('.');
  let value = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return null;
    }
  }

  return typeof value === 'string' ? value : null;
}

// Switch language
function switchLanguage(lang) {
  applyTranslations(lang);

  // Update dropdown
  const dropdown = document.getElementById('language-dropdown');
  if (dropdown) {
    dropdown.classList.remove('show');
  }

  // Trigger custom event for dynamic content updates
  window.dispatchEvent(
    new CustomEvent('languageChanged', { detail: { language: lang } })
  );
}

// Initialize language switcher
function initLanguageSwitcher() {
  // Create top bar if it doesn't exist
  if (!document.getElementById('top-language-bar')) {
    const topBar = document.createElement('div');
    topBar.id = 'top-language-bar';
    topBar.className = 'top-language-bar';

    const switcher = document.createElement('div');
    switcher.id = 'language-switcher';
    switcher.className = 'language-switcher';

    const svFlag = '🇸🇪';
    const gbFlag = '🇬🇧';
    const currentFlag = currentLanguage === 'sv' ? svFlag : gbFlag;
    const currentLangName = currentLanguage === 'sv' ? 'Swedish' : 'English';

    switcher.innerHTML = `
      <button id="language-button" class="language-button" onclick="toggleLanguageDropdown()">
        <span class="flag-icon">${currentFlag}</span>
        <span class="lang-name">${currentLangName}</span>
        <svg class="dropdown-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#064e3b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div id="language-dropdown" class="language-dropdown">
        <button onclick="switchLanguage('sv')" class="${
          currentLanguage === 'sv' ? 'active' : ''
        }">
          <span class="flag-icon">${svFlag}</span>
          <span>Swedish</span>
        </button>
        <button onclick="switchLanguage('en')" class="${
          currentLanguage === 'en' ? 'active' : ''
        }">
          <span class="flag-icon">${gbFlag}</span>
          <span>English</span>
        </button>
      </div>
    `;

    topBar.appendChild(switcher);

    // Insert at the very top of body
    document.body.insertBefore(topBar, document.body.firstChild);
  } else {
    // Update existing switcher
    updateLanguageButton();
  }

  // Load translations and apply
  loadTranslations();
}

// Update language button with current flag
function updateLanguageButton() {
  const langButton = document.getElementById('language-button');
  if (langButton) {
    const svFlag = '🇸🇪';
    const gbFlag = '🇬🇧';
    const currentFlag = currentLanguage === 'sv' ? svFlag : gbFlag;
    const currentLangName = currentLanguage === 'sv' ? 'Swedish' : 'English';
    const flagIcon = langButton.querySelector('.flag-icon');
    const langName = langButton.querySelector('.lang-name');
    if (flagIcon) flagIcon.textContent = currentFlag;
    if (langName) langName.textContent = currentLangName;
  }

  // Update dropdown active states
  const dropdown = document.getElementById('language-dropdown');
  if (dropdown) {
    const buttons = dropdown.querySelectorAll('button');
    buttons.forEach((btn) => {
      // Check if button's onclick contains the current language
      const onclickAttr = btn.getAttribute('onclick');
      if (onclickAttr && onclickAttr.includes(`'${currentLanguage}'`)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

// Toggle dropdown
function toggleLanguageDropdown() {
  const dropdown = document.getElementById('language-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const switcher = document.getElementById('language-switcher');
  const dropdown = document.getElementById('language-dropdown');
  if (switcher && dropdown && !switcher.contains(e.target)) {
    dropdown.classList.remove('show');
  }
});

// Make functions globally available
window.switchLanguage = switchLanguage;
window.toggleLanguageDropdown = toggleLanguageDropdown;
window.getTranslation = getTranslation;
window.updateLanguageButton = updateLanguageButton;

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
} else {
  initLanguageSwitcher();
}
