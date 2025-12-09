// Get page data from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const pageId = urlParams.get('id');

// DOM Elements
const profileImage = document.getElementById('profileImage');
const influencerName = document.getElementById('influencerName');
const videoSection = document.getElementById('videoSection');
const videoThumbnail = document.getElementById('videoThumbnail');
const pageTitle = document.getElementById('pageTitle');
const productsList = document.getElementById('productsList');
const shopAllBtn = document.getElementById('shopAllBtn');

// Load page data
document.addEventListener('DOMContentLoaded', () => {
  if (!pageId) {
    // Demo data if no ID provided
    loadDemoData();
    return;
  }

  const productPages = JSON.parse(localStorage.getItem('productPages')) || [];
  const page = productPages.find((p) => p.id === pageId);

  if (page) {
    loadPageData(page);
  } else {
    loadDemoData();
  }
});

function loadPageData(page) {
  // Set influencer info
  profileImage.src = page.profilePic || 'https://via.placeholder.com/60';
  influencerName.textContent = `@${page.username}`;

  // Set video thumbnail if available
  if (page.thumbnail) {
    videoThumbnail.src = page.thumbnail;
    videoSection.style.display = 'block';
  } else {
    videoSection.style.display = 'none';
  }

  // Set title
  pageTitle.textContent = page.videoTitle;

  // Render products
  renderProducts(page.products);

  // Set shop all button (opens first product or all products)
  if (page.products.length > 0) {
    // For demo, we'll create a link that opens all products
    // In a real implementation, this might be a collection link
    shopAllBtn.href = page.products[0].link;
  }
}

function loadDemoData() {
  // Demo data for preview
  const demoData = {
    username: 'username',
    profilePic: 'https://via.placeholder.com/60',
    thumbnail: '',
    videoTitle: 'My Makeup Haul',
    products: [
      {
        name: 'Foundation - Shade 120',
        image: 'https://via.placeholder.com/300x300?text=Foundation',
        link: 'https://example.com/product1',
      },
      {
        name: 'Lipstick - Rosewood',
        image: 'https://via.placeholder.com/300x300?text=Lipstick',
        link: 'https://example.com/product2',
      },
      {
        name: 'Mascara - Black',
        image: 'https://via.placeholder.com/300x300?text=Mascara',
        link: 'https://example.com/product3',
      },
    ],
  };

  loadPageData(demoData);
}

function renderProducts(products) {
  if (products.length === 0) {
    productsList.innerHTML =
      '<p style="text-align: center; color: var(--color-text-light);">No products available.</p>';
    return;
  }

  productsList.innerHTML = products
    .map(
      (product) => `
        <div class="product-card">
            <div class="product-image-wrapper">
                <img src="${escapeHtml(product.image)}" alt="${escapeHtml(
        product.name
      )}" class="product-image">
            </div>
            <div class="product-info">
                <h3 class="product-name">${escapeHtml(product.name)}</h3>
                <a href="${escapeHtml(
                  product.link
                )}" class="btn-shop" target="_blank" rel="noopener noreferrer">Shop now</a>
            </div>
        </div>
    `
    )
    .join('');

  // Update shop all button to open all products in new tabs
  // For demo purposes, we'll just link to the first product
  // In production, this might be a collection page or open all products
  if (products.length > 0) {
    shopAllBtn.href = products[0].link;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
