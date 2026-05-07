# Design to Delight Blocks Plugin

A powerful WordPress plugin that adds custom Gutenberg blocks for building restaurant websites. Create beautiful, professional pages by dragging and dropping reusable blocks.

## Features

### 🎯 Hero Section Block
- Customizable title and subtitle
- Background image support
- Star rating display
- Dual call-to-action buttons
- Fully responsive design

### 🍽️ Menu Grid Block
- Automatically displays menu items from custom post type
- Adjustable number of items
- Shows images, descriptions, and prices
- Grid layout with hover effects

### ⭐ Reviews Grid Block
- Displays customer reviews from custom post type
- Star rating system (1-5 stars)
- Date display
- Adjustable number of reviews

### 📷 Photo Gallery Block
- Multi-image uploader
- Grid layout with hover effects
- Lightbox functionality (via theme)
- Customizable title and description

### 📍 Location Info Block
- Display address, phone, and hours
- Icon-based cards
- Three-column responsive layout

### ✨ Amenities Grid Block
- Showcase restaurant features
- Icon + text format
- Flexible grid layout

### 📝 Overview Section Block
- Rich text editor for detailed content
- Perfect for "About Us" sections
- Clean, readable typography

## Installation

### Method 1: Upload via WordPress Admin

1. Download the `design-to-delight-blocks-plugin.zip` file
2. Go to **Plugins → Add New** in WordPress admin
3. Click **Upload Plugin**
4. Choose the ZIP file and click **Install Now**
5. Click **Activate Plugin**

### Method 2: Manual Installation via FTP

1. Extract the ZIP file
2. Upload the `design-to-delight-blocks-plugin` folder to `/wp-content/plugins/`
3. Go to **Plugins** in WordPress admin
4. Find "Design to Delight Blocks" and click **Activate**

## Quick Start

### Step 1: Add Menu Items

1. Go to **Menu Items → Add New**
2. Enter the dish name as title
3. Add description in content area
4. Upload a food photo as Featured Image
5. Enter price in the sidebar meta box (e.g., 12.99)
6. Click **Publish**

Repeat for all menu items you want to display.

### Step 2: Add Reviews

1. Go to **Reviews → Add New**
2. Enter customer name as title
3. Write review text in content area
4. Select rating (1-5 stars) in sidebar
5. Click **Publish**

### Step 3: Build Your Homepage

1. Go to **Pages → Add New** or edit existing page
2. Click the **(+)** button to add blocks
3. Look for **Cedars Restaurant** category in block inserter
4. Add blocks in this order for best results:
   - Hero Section
   - Overview Section
   - Menu Grid
   - Photo Gallery
   - Reviews Grid
   - Location Info
   - Amenities Grid

### Step 4: Customize Each Block

Click on any block to see customization options in the right sidebar:

**Hero Section:**
- Title, subtitle
- Background image
- Rating and review count
- Button text and links

**Menu Grid:**
- Section title and description
- Number of items to display

**Reviews Grid:**
- Section title
- Number of reviews to display

**Photo Gallery:**
- Upload multiple images
- Set title and description

**Location Info:**
- Address, phone, hours

**Amenities:**
- Edit in PHP or use default amenities

**Overview:**
- Write your restaurant story

### Step 5: Set as Homepage

1. Go to **Settings → Reading**
2. Select "A static page"
3. Choose your newly created page as Homepage
4. Click **Save Changes**

## Block Reference

### Available Blocks

| Block Name | Block ID | Purpose |
|-----------|----------|---------|
| Hero Section | `cedars-blocks/hero-section` | Large banner with CTA buttons |
| Menu Grid | `cedars-blocks/menu-grid` | Display menu items in grid |
| Reviews Grid | `cedars-blocks/reviews-grid` | Show customer testimonials |
| Photo Gallery | `cedars-blocks/photo-gallery` | Image gallery with lightbox |
| Location Info | `cedars-blocks/location-info` | Address, phone, hours cards |
| Amenities Grid | `cedars-blocks/amenities-grid` | Restaurant features/services |
| Overview Section | `cedars-blocks/overview-section` | Long-form text content |

### Block Attributes

#### Hero Section
```
- title (string): Main heading
- subtitle (string): Subheading text
- backgroundImage (string): Image URL
- rating (string): Star rating (e.g., "4.1")
- reviewCount (string): Number of reviews
- primaryButtonText (string): First button text
- primaryButtonLink (string): First button URL
- secondaryButtonText (string): Second button text
- secondaryButtonLink (string): Second button URL
```

#### Menu Grid
```
- title (string): Section heading
- description (string): Section description
- itemsPerPage (number): Number of menu items to show
```

#### Reviews Grid
```
- title (string): Section heading
- itemsPerPage (number): Number of reviews to show
```

#### Photo Gallery
```
- title (string): Section heading
- description (string): Section description
- images (array): Array of image objects with url and alt
```

#### Location Info
```
- title (string): Section heading
- address (string): Full address (multiline supported)
- phone (string): Phone number
- hours (string): Opening hours (multiline supported)
```

#### Amenities Grid
```
- title (string): Section heading
- amenities (array): Array of objects with icon and text
```

#### Overview Section
```
- title (string): Section heading
- content (string): Rich text content (HTML)
```

## Custom Post Types

The plugin registers two custom post types:

### Menu Items (`menu_item`)
- **Purpose:** Store restaurant menu items
- **Fields:**
  - Title: Dish name
  - Content: Description
  - Featured Image: Food photo
  - Custom Field: Price
- **URL Slug:** `/menu/dish-name`

### Reviews (`review`)
- **Purpose:** Store customer reviews
- **Fields:**
  - Title: Customer name
  - Content: Review text
  - Custom Field: Rating (1-5)
- **URL Slug:** `/reviews/customer-name`

## Styling & Customization

### Colors

The plugin uses CSS variables for easy color customization. Edit in `build/style.css`:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #e74c3c;
    --accent-gold: #f39c12;
    --text-dark: #2c3e50;
    --text-light: #7f8c8d;
    --bg-light: #f8f9fa;
    --bg-white: #ffffff;
}
```

### Fonts

Default fonts:
- **Headings:** Playfair Display (serif)
- **Body:** Lato (sans-serif)

To change fonts, edit the Google Fonts URL in `cedars-blocks.php` (line with `wp_enqueue_style` for fonts).

### Block Spacing

Adjust section padding:
```css
.cedars-section {
    padding: 80px 0; /* Change top/bottom padding */
}
```

### Adding Custom Amenities

Edit the default amenities in `cedars-blocks.php`:

```php
'default' => [
    { icon: '🪑', text: 'Outdoor Seating' },
    { icon: '🚗', text: 'Delivery Available' },
    // Add more amenities here
]
```

## Troubleshooting

### Blocks Don't Appear in Editor

1. Make sure plugin is activated
2. Clear browser cache
3. Try disabling other plugins temporarily
4. Check WordPress version (5.0+ required for Gutenberg)

### Menu Items Not Showing

1. Create at least one Menu Item post
2. Make sure it's published (not draft)
3. Add a featured image
4. Enter a price in the meta box

### Reviews Not Displaying

1. Create at least one Review post
2. Make sure it's published
3. Select a rating in the meta box

### Images Not Loading

1. Check image URLs are correct
2. Verify images exist in media library
3. Check file permissions on uploads folder

### Styling Issues

1. Make sure theme doesn't override plugin styles
2. Clear all caches (browser, WordPress, CDN)
3. Check for CSS conflicts with theme

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome)

## Requirements

- WordPress 5.0 or higher
- PHP 7.0 or higher
- Gutenberg block editor enabled

## Compatibility

Works with:
- Classic themes
- Block themes
- Page builders (may have conflicts)
- Most caching plugins
- Most SEO plugins

## Best Practices

1. **Use high-quality images** (minimum 800px wide for menu items)
2. **Keep descriptions concise** (2-3 sentences for menu items)
3. **Add 6-12 menu items** for visual balance
4. **Include 3-6 reviews** for social proof
5. **Test on mobile devices** after making changes
6. **Optimize images** before uploading (use compression tools)

## Advanced Usage

### Programmatic Block Rendering

You can use blocks in PHP templates:

```php
<?php
echo do_blocks('<!-- wp:cedars-blocks/hero-section {"title":"Welcome"} /-->');
?>
```

### Filtering Block Output

Add custom filters:

```php
add_filter('cedars_blocks_menu_query_args', function($args) {
    $args['posts_per_page'] = 12; // Show 12 items instead of 8
    return $args;
});
```

### Custom Block Variations

Register block variations in your theme:

```javascript
wp.blocks.registerBlockVariation('cedars-blocks/hero-section', {
    name: 'dark-hero',
    title: 'Dark Hero',
    attributes: {
        // Custom default attributes
    }
});
```

## Performance Tips

1. Use image optimization plugins (Smush, ShortPixel)
2. Enable caching (WP Super Cache, W3 Total Cache)
3. Use a CDN for static assets
4. Lazy load images below the fold
5. Minify CSS/JS in production

## Support

For support and customization:
- Check WordPress Codex for general help
- Review plugin documentation
- Contact theme/plugin developer

## Changelog

### Version 1.0.0
- Initial release
- 7 custom blocks
- 2 custom post types (Menu Items, Reviews)
- Full Gutenberg integration
- Responsive design
- Custom meta boxes

## Credits

- **Inspired by:** Cedars Restaurant website design
- **Fonts:** Google Fonts (Playfair Display, Lato)
- **Icons:** Unicode emoji characters
- **Built with:** WordPress Gutenberg API

## License

GPL v2 or later

---

**Start building your restaurant website today! 🎉**
