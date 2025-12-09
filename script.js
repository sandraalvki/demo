// Store for product pages
let productPages = JSON.parse(localStorage.getItem('productPages')) || [];

// DOM Elements
const createPageBtn = document.getElementById('createPageBtn');
const formSection = document.getElementById('formSection');
const previewSection = document.getElementById('previewSection');
const pagesSection = document.getElementById('pagesSection');
const detailsSection = document.getElementById('detailsSection');
const productForm = document.getElementById('productForm');
const productsContainer = document.getElementById('productsContainer');
const addProductBtn = document.getElementById('addProductBtn');
const cancelBtn = document.getElementById('cancelBtn');
const backBtn = document.getElementById('backBtn');
const pagesListDefault = document.getElementById('pagesListDefault');
const pagesList = document.getElementById('pagesList');
const emptyState = document.getElementById('emptyState');
const productsDetailsList = document.getElementById('productsDetailsList');
const detailsTitle = document.getElementById('detailsTitle');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderPagesList();

  createPageBtn.addEventListener('click', () => {
    showForm();
  });

  cancelBtn.addEventListener('click', () => {
    hideForm();
    productForm.reset();
    productsContainer.innerHTML = createProductInputGroup();
  });

  addProductBtn.addEventListener('click', () => {
    addProductInput();
  });

  productForm.addEventListener('submit', handleFormSubmit);

  backBtn.addEventListener('click', () => {
    showPagesList();
  });
});

function showForm() {
  formSection.style.display = 'block';
  previewSection.style.display = 'none';
  pagesSection.style.display = 'none';
  detailsSection.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideForm() {
  formSection.style.display = 'none';
  previewSection.style.display = 'none';
  pagesSection.style.display = 'block';
  detailsSection.style.display = 'none';
}

function showPagesList() {
  formSection.style.display = 'none';
  previewSection.style.display = 'none';
  pagesSection.style.display = 'block';
  detailsSection.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showDetails(pageId) {
  const page = productPages.find((p) => p.id === pageId);
  if (!page) return;

  formSection.style.display = 'none';
  previewSection.style.display = 'none';
  pagesSection.style.display = 'none';
  detailsSection.style.display = 'block';

  detailsTitle.textContent = page.videoTitle;
  renderProductDetails(page.products);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function createProductInputGroup() {
  return `
        <div class="product-input-group">
            <div class="form-group">
                <label>Product Name</label>
                <input type="text" class="product-name" placeholder="Product name" required>
            </div>
            <div class="form-group">
                <label>Product Image (URL)</label>
                <input type="url" class="product-image" placeholder="https://example.com/product.jpg">
            </div>
            <div class="form-group">
                <label>Affiliate Link</label>
                <input type="url" class="product-link" placeholder="https://example.com/product" required>
            </div>
        </div>
    `;
}

function addProductInput() {
  const newGroup = document.createElement('div');
  newGroup.className = 'product-input-group';
  newGroup.innerHTML = `
        <div class="form-group">
            <label>Product Name</label>
            <input type="text" class="product-name" placeholder="Product name" required>
        </div>
        <div class="form-group">
            <label>Product Image (URL)</label>
            <input type="url" class="product-image" placeholder="https://example.com/product.jpg">
        </div>
        <div class="form-group">
            <label>Affiliate Link</label>
            <input type="url" class="product-link" placeholder="https://example.com/product" required>
        </div>
        <button type="button" class="btn-icon" onclick="removeProductInput(this)">Remove</button>
    `;
  productsContainer.appendChild(newGroup);
}

function removeProductInput(btn) {
  btn.closest('.product-input-group').remove();
}

function handleFormSubmit(e) {
  e.preventDefault();

  const formData = {
    id: Date.now().toString(),
    videoTitle: document.getElementById('videoTitle').value,
    thumbnail: document.getElementById('thumbnail').value,
    username: document.getElementById('username').value,
    profilePic:
      document.getElementById('profilePic').value ||
      'https://via.placeholder.com/60',
    products: [],
  };

  // Collect products
  const productGroups = productsContainer.querySelectorAll(
    '.product-input-group'
  );
  productGroups.forEach((group) => {
    const name = group.querySelector('.product-name').value;
    const image = group.querySelector('.product-image').value;
    const link = group.querySelector('.product-link').value;

    if (name && link) {
      formData.products.push({
        name,
        image: image || 'https://via.placeholder.com/300x300?text=Product',
        link,
      });
    }
  });

  if (formData.products.length === 0) {
    alert('Please add at least one product');
    return;
  }

  // Save to storage
  productPages.push(formData);
  localStorage.setItem('productPages', JSON.stringify(productPages));

  // Reset form
  productForm.reset();
  productsContainer.innerHTML = createProductInputGroup();

  // Show preview
  renderPagesList();
  hideForm();
}

function renderPagesList() {
  if (productPages.length === 0) {
    emptyState.style.display = 'block';
    pagesListDefault.innerHTML = '';
    return;
  }

  emptyState.style.display = 'none';
  pagesListDefault.innerHTML = productPages
    .map(
      (page) => `
        <div class="page-card" onclick="showDetails('${page.id}')">
            <div class="page-card-header">
                <div>
                    <h3 class="page-card-title">${escapeHtml(
                      page.videoTitle
                    )}</h3>
                    <p class="page-card-username">@${escapeHtml(
                      page.username
                    )}</p>
                </div>
                <div class="page-card-actions" onclick="event.stopPropagation()">
                    <button class="btn-icon" onclick="copyLink('${
                      page.id
                    }')" title="Copy link">📋</button>
                    <button class="btn-icon" onclick="viewPage('${
                      page.id
                    }')" title="View page">👁️</button>
                    <button class="btn-icon" onclick="deletePage('${
                      page.id
                    }')" title="Delete">🗑️</button>
                </div>
            </div>
            <p style="color: var(--color-text-light); font-size: 0.9rem;">
                ${page.products.length} product${
        page.products.length !== 1 ? 's' : ''
      }
            </p>
        </div>
    `
    )
    .join('');
}

function renderProductDetails(products) {
  if (products.length === 0) {
    productsDetailsList.innerHTML =
      '<p style="text-align: center; color: var(--color-text-light);">No products available.</p>';
    return;
  }

  productsDetailsList.innerHTML = products
    .map(
      (product) => `
        <div class="product-detail-card">
            <div class="product-detail-image">
                <img src="${escapeHtml(product.image)}" alt="${escapeHtml(
        product.name
      )}">
            </div>
            <div class="product-detail-info">
                <h3 class="product-detail-name">${escapeHtml(product.name)}</h3>
                <div class="product-detail-url">${escapeHtml(
                  product.link
                )}</div>
            </div>
        </div>
    `
    )
    .join('');
}

function copyLink(pageId) {
  const page = productPages.find((p) => p.id === pageId);
  if (!page) return;

  const url = `${window.location.origin}/product-page.html?id=${pageId}`;

  // Copy to clipboard
  navigator.clipboard
    .writeText(url)
    .then(() => {
      alert('Link copied to clipboard!');
    })
    .catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('Link copied to clipboard!');
    });
}

function viewPage(pageId) {
  window.open(`product-page.html?id=${pageId}`, '_blank');
}

function deletePage(pageId) {
  if (confirm('Are you sure you want to delete this page?')) {
    productPages = productPages.filter((p) => p.id !== pageId);
    localStorage.setItem('productPages', JSON.stringify(productPages));
    renderPagesList();
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Make functions available globally for onclick handlers
window.showDetails = showDetails;
window.copyLink = copyLink;
window.viewPage = viewPage;
window.deletePage = deletePage;
window.removeProductInput = removeProductInput;
async function fetchOgImage(inputElement) {
  const url = inputElement.value;

  // Hitta rätt product-row (föräldern)
  const productRow = inputElement.closest('.product-row');

  // Hitta rätt bild och namn inom just denna product-row
  const imgElement = productRow.querySelector('.product-image');
  const nameElement = productRow.querySelector('.product-name');

  // Visa loading-bild
  imgElement.src = 'https://via.placeholder.com/120?text=Loading...';

  const proxies = [
    `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${url}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  ];

  let html = null;

  for (let proxyUrl of proxies) {
    try {
      const response = await fetch(proxyUrl);
      if (response.ok) {
        html = await response.text();
        break;
      }
    } catch (e) {
      console.log('Proxy funkar inte:', proxyUrl);
    }
  }

  if (!html) {
    imgElement.src = 'https://via.placeholder.com/120?text=Error';
    return;
  }

  // 1️⃣ Försök hitta bild från og:image
  let imageUrl = null;
  const ogImageMatch = html.match(
    /<meta[^>]+property=['"]og:image['"][^>]+content=['"]([^'"]+)['"]/i
  );
  if (ogImageMatch) imageUrl = ogImageMatch[1];

  // 2️⃣ Fallback: första <img>
  if (!imageUrl) {
    const imgMatch = html.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
    if (imgMatch) imageUrl = imgMatch[1];
  }

  // 3️⃣ Hitta produktnamn (og:title)
  const ogTitleMatch = html.match(
    /<meta[^>]+property=['"]og:title['"][^>]+content=['"]([^'"]+)['"]/i
  );
  if (ogTitleMatch) nameElement.value = ogTitleMatch[1];

  // 4️⃣ Uppdatera bilden
  imgElement.src = imageUrl || 'https://via.placeholder.com/120?text=No+Image';
}

// Handle image upload from local device
function handleImageUpload(input, imgElement) {
  const file = input.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      const msg = getTranslation('script.pleaseSelectImage', currentLanguage || 'sv');
      alert(msg || 'Vänligen välj en bildfil');
      input.value = ''; // Reset input
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      const msg = getTranslation('script.imageTooLarge', currentLanguage || 'sv');
      alert(msg || 'Bilden är för stor. Max storlek är 5MB');
      input.value = ''; // Reset input
      return;
    }

    // Create FileReader to preview image
    const reader = new FileReader();
    reader.onload = function (e) {
      imgElement.src = e.target.result;
      // Hide upload overlay when image is uploaded
      const thumb = input.closest('.product-thumb');
      const overlay = thumb.querySelector('.upload-overlay');
      if (overlay) {
        overlay.style.display = 'none';
      }
      // Update border style to indicate image is uploaded
      thumb.style.borderStyle = 'solid';
      thumb.style.borderColor = 'rgba(6, 78, 59, 0.2)';
    };
    reader.onerror = function () {
      const msg = getTranslation('script.errorReadingImage', currentLanguage || 'sv');
      alert(msg || 'Ett fel uppstod vid läsning av bilden');
      input.value = ''; // Reset input
    };
    reader.readAsDataURL(file);
  }
}

// Publish list and create URL
function publishList() {
  // Get form data
  const title = document.getElementById('title')?.value || '';
  const slug = document.getElementById('slug')?.value || '';
  const videoUrl = document.getElementById('video-url')?.value || '';
  const description = document.getElementById('description')?.value || '';
  const urlPrefix = 'minsida.se/anna_bl/';

  if (!title || !slug) {
    const msg = getTranslation('script.pleaseFillTitleSlug', currentLanguage || 'sv');
    alert(msg || 'Vänligen fyll i titel och slug innan du publicerar.');
    return;
  }

  // Collect all products
  const products = [];
  const productRows = document.querySelectorAll('.product-row');

  productRows.forEach((row, index) => {
    const nameInput = row.querySelector('.product-name');
    const urlInput = row.querySelector('.product-url');
    const imageElement = row.querySelector('.product-image');
    const descriptionInput = row.querySelector('.product-description');

    // Only add products that have at least a name and URL
    if (
      nameInput &&
      urlInput &&
      nameInput.value.trim() &&
      urlInput.value.trim()
    ) {
      const product = {
        name: nameInput.value.trim(),
        url: urlInput.value.trim(),
        image: imageElement?.src || imageElement?.getAttribute('src') || '',
        id: index + 1,
      };
      
      // Add description if provided
      if (descriptionInput && descriptionInput.value.trim()) {
        product.description = descriptionInput.value.trim();
      }
      
      products.push(product);
    }
  });

  if (products.length === 0) {
    const msg = getTranslation('script.pleaseAddProduct', currentLanguage || 'sv');
    alert(msg || 'Vänligen lägg till minst en produkt innan du publicerar.');
    return;
  }

  // Create the full URL
  const fullUrl = urlPrefix + slug;

  // Create list data object
  const listData = {
    id: Date.now().toString(),
    title: title,
    slug: slug,
    url: fullUrl,
    videoUrl: videoUrl,
    description: description,
    products: products,
    createdAt: new Date().toISOString(),
  };

  // Store in localStorage using slug as key
  localStorage.setItem(`productList_${slug}`, JSON.stringify(listData));

  // Also store in a master list for easy retrieval
  let masterList = JSON.parse(
    localStorage.getItem('productListsMaster') || '[]'
  );
  if (!masterList.find((l) => l.slug === slug)) {
    masterList.push({ slug: slug, title: title, url: fullUrl });
    localStorage.setItem('productListsMaster', JSON.stringify(masterList));
  }

  // Redirect to the list page
  window.location.href = `list.html?slug=${encodeURIComponent(slug)}`;
}

// Validate word count for description
function validateWordCount(input) {
  const text = input.value.trim();
  const words = text ? text.split(/\s+/).filter((word) => word.length > 0) : [];
  const wordCount = words.length;
  const wordCountElement = document.getElementById('word-count');
  const lang = currentLanguage || 'sv';
  const wordLabel = lang === 'sv' ? 'ord' : 'words';

  if (wordCountElement) {
    wordCountElement.textContent = `${wordCount} / 10 ${wordLabel}`;
    if (wordCount > 10) {
      wordCountElement.style.color = '#ef4444';
      // Truncate to 10 words
      const truncated = words.slice(0, 10).join(' ');
      input.value = truncated;
      wordCountElement.textContent = `10 / 10 ${wordLabel}`;
      wordCountElement.style.color = '#64748b';
    } else {
      wordCountElement.style.color = '#64748b';
    }
  }
}
