# Design to Delight WordPress Theme

A beautiful, modern WordPress theme inspired by the Design to Delight website design, perfect for restaurants, cafes, and food businesses.

## Features

- **Responsive Design**: Looks great on all devices (mobile, tablet, desktop)
- **Custom Post Types**: Menu items and reviews with custom fields
- **Hero Section**: Eye-catching hero with background image support
- **Menu Display**: Beautiful grid layout for showcasing menu items
- **Photo Gallery**: Elegant gallery section with hover effects
- **Reviews Section**: Display customer reviews with star ratings
- **Location Info**: Display address, phone, hours, and amenities
- **Customizer Support**: Easy customization through WordPress Customizer
- **Social Media Integration**: Add links to Facebook, Instagram, Twitter
- **SEO Friendly**: Clean, semantic HTML5 markup
- **Smooth Animations**: Fade-in effects and smooth transitions

## Installation

### Method 1: Via WordPress Admin (Recommended)

1. Download the theme as a ZIP file
2. Log in to your WordPress admin panel
3. Go to **Appearance > Themes > Add New**
4. Click **Upload Theme**
5. Choose the ZIP file and click **Install Now**
6. Click **Activate** once installed

### Method 2: Via FTP

1. Extract the ZIP file
2. Upload the `cedars-restaurant-theme` folder to `/wp-content/themes/` directory via FTP
3. Log in to WordPress admin
4. Go to **Appearance > Themes**
5. Find "Design to Delight Theme" and click **Activate**

## Initial Setup

### 1. Configure Basic Settings

Go to **Appearance > Customize** and configure:

- **Site Identity**: Set your restaurant name and tagline
- **Restaurant Information**: Add address, phone, email, and hours
- **Social Media**: Add your social media URLs
- **Custom Logo**: Upload your restaurant logo

### 2. Create Navigation Menu

1. Go to **Appearance > Menus**
2. Create a new menu
3. Add pages/links: Home, About, Menu, Photos, Reviews, Location
4. Assign to "Primary Menu" location
5. Save the menu

### 3. Set Up Homepage

1. Create a new page called "Home"
2. Go to **Settings > Reading**
3. Select "A static page" under "Your homepage displays"
4. Choose "Home" as your homepage
5. Save changes

### 4. Add Menu Items

1. Go to **Menu Items > Add New** in the admin panel
2. Add your dishes with:
   - Title (e.g., "Chicken Shawarma")
   - Description
   - Featured Image (food photo)
   - Price (in the sidebar meta box)
3. Publish and repeat for all menu items

### 5. Add Reviews

1. Go to **Reviews > Add New**
2. Add customer reviews with:
   - Title (customer name)
   - Review text (in the content area)
   - Rating (1-5 stars in sidebar)
3. Publish and repeat for all reviews

### 6. Add Images

Place these images in the theme for best results:

- **Hero Background**: Add via Customizer or replace `/assets/images/hero-bg.jpg`
- **Menu Item Images**: Upload when creating menu items
- **Gallery Images**: Replace `/assets/images/gallery-1.jpg` through `gallery-6.jpg`

## Customization

### Colors

Edit the CSS variables in `style.css` (lines 12-20):

```css
:root {
    --primary-color: #2c3e50;     /* Main brand color */
    --secondary-color: #e74c3c;   /* Accent color (buttons, links) */
    --accent-gold: #f39c12;       /* Gold accent */
    --text-dark: #2c3e50;         /* Main text color */
    --text-light: #7f8c8d;        /* Secondary text */
}
```

### Fonts

The theme uses:
- **Headings**: Playfair Display (elegant serif)
- **Body Text**: Lato (clean sans-serif)

To change fonts, edit the Google Fonts URL in `functions.php` (line 56).

### Layout

- **Container Width**: Adjust `.container` max-width in `style.css` (line 88)
- **Section Padding**: Modify `.section` padding in `style.css` (line 391)

## Theme Structure

```
cedars-restaurant-theme/
├── style.css           # Main stylesheet
├── functions.php       # Theme functions and features
├── index.php          # Main template (homepage)
├── header.php         # Header template
├── footer.php         # Footer template
├── single.php         # Single post/menu item template
├── page.php           # Page template
├── archive.php        # Archive template (menu listings)
├── screenshot.png     # Theme screenshot
├── README.md          # This file
└── assets/
    ├── images/        # Theme images
    └── js/            # JavaScript files
```

## Required Plugins

This theme works standalone, but these plugins enhance functionality:

- **Contact Form 7** or **WPForms**: For contact forms
- **Yoast SEO**: For better search engine optimization
- **Smush**: For image optimization
- **WP Super Cache**: For faster page loads

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Support

For theme support and customization:

1. Check the WordPress Codex for general WordPress help
2. Review the comments in the theme files
3. Contact the theme developer for custom work

## Credits

- **Design Inspiration**: Design to Delight website
- **Fonts**: Google Fonts (Playfair Display, Lato)
- **Icons**: Unicode emoji characters
- **Framework**: WordPress

## Changelog

### Version 1.0.0
- Initial release
- Custom post types for menu items and reviews
- Responsive design
- Customizer integration
- Hero section with background image
- Menu grid layout
- Photo gallery
- Reviews section
- Location and amenities display

## License

This theme is licensed under the GNU General Public License v2 or later.

---

**Enjoy your new restaurant website!** 🍽️
