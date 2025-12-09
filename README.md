# Minsida - Influencer Product Showcase Platform

A clean, modern, and minimalistic web prototype for influencers to collect and showcase all products mentioned in their videos (TikTok, Instagram, YouTube) on one simple landing page.

## Features

### Landing Dashboard (for influencers)

- Create product pages with video title, thumbnail, and product information
- Add multiple products with names, images, and affiliate links
- Preview and manage all created product pages
- Copy shareable links to product pages
- View and delete product pages

### Public Product Page (for followers)

- Clean, minimalistic design with influencer profile
- Video thumbnail display (optional)
- Product list with images and "Shop now" buttons
- Sticky bottom CTA: "Shop all"
- Fully responsive mobile design

## Design Philosophy

- **Clean & Minimalistic**: Lots of white space, soft neutral colors
- **Modern Typography**: Inter font family for elegant readability
- **Light & Airy**: Easy on the eyes, premium but simple
- **Calm & Trustworthy**: No clutter, high usability
- **Responsive**: Works beautifully on desktop and mobile

## Getting Started

1. Open `index.html` in your browser to access the dashboard
2. Click "Create Product Page" to start creating
3. Fill in the form with video details and products
4. Click "Create Page" to save
5. Use the copy link button to share your product page
6. View the public product page by clicking the view icon

## File Structure

```
├── index.html          # Landing dashboard for influencers
├── product-page.html   # Public product page for followers
├── styles.css          # Main stylesheet
├── script.js           # Dashboard functionality
├── product-page.js     # Product page functionality
└── README.md           # This file
```

## Technologies

- Pure HTML5
- CSS3 with custom properties
- Vanilla JavaScript
- LocalStorage for data persistence
- Google Fonts (Inter)

## Browser Support

Works in all modern browsers that support:

- CSS Grid and Flexbox
- LocalStorage API
- ES6 JavaScript

## Notes

- Data is stored in browser's LocalStorage
- Product images and thumbnails use URL inputs
- Affiliate links open in new tabs
- Mobile-responsive design included
