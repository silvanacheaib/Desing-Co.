# Design to Delight Website - Complete Installation Guide

This guide covers installing both the theme and blocks plugin to create a fully functional restaurant website with reusable page builder blocks.

## What's Included

### 1. Design to Delight Theme
- Clean, minimal WordPress theme
- Responsive design
- Typography and base styles
- Header and footer templates
- Ready for Gutenberg blocks

### 2. Design to Delight Blocks Plugin
- 7 custom Gutenberg blocks
- Drag-and-drop page building
- Menu Items custom post type
- Reviews custom post type
- No coding required for content management

## Prerequisites

- WordPress 5.0 or higher installed
- Admin access to WordPress
- Basic familiarity with WordPress dashboard

---

## Part 1: Install the Theme

### Step 1: Upload Theme

1. Download **design-to-delight-theme.zip**
2. Go to WordPress admin → **Appearance → Themes**
3. Click **Add New** → **Upload Theme**
4. Choose the ZIP file
5. Click **Install Now**
6. Click **Activate**

### Step 2: Configure Basic Theme Settings

1. Go to **Appearance → Customize**
2. **Site Identity:**
   - Set site title (e.g., "Design to Delight")
   - Set tagline (e.g., "Authentic Lebanese Cuisine")
   - Upload logo (optional)
3. **Restaurant Information:**
   - Address: Your full address
   - Phone: Your contact number
   - Email: Contact email
   - Hours: Opening hours
4. **Social Media:**
   - Facebook URL
   - Instagram URL
   - Twitter URL
5. Click **Publish**

### Step 3: Create Navigation Menu

1. Go to **Appearance → Menus**
2. Create new menu: "Main Menu"
3. Add pages/links:
   - Home (link to homepage)
   - Menu (custom link: `#menu`)
   - About (custom link: `#overview`)
   - Gallery (custom link: `#photos`)
   - Reviews (custom link: `#reviews`)
   - Contact (custom link: `#location`)
4. Assign to **Primary Menu** location
5. Click **Save Menu**

---

## Part 2: Install the Blocks Plugin

### Step 1: Upload Plugin

1. Download **design-to-delight-blocks-plugin.zip**
2. Go to **Plugins → Add New**
3. Click **Upload Plugin**
4. Choose the ZIP file
5. Click **Install Now**
6. Click **Activate Plugin**

### Step 2: Verify Plugin Activation

After activation, you should see:
- **Menu Items** in the admin sidebar
- **Reviews** in the admin sidebar
- New **Design to Delight** block category in Gutenberg editor

---

## Part 3: Add Content

### Step 1: Create Menu Items (10 minutes)

1. Go to **Menu Items → Add New**
2. Create your first menu item:
   - **Title:** "Chicken Shawarma Wrap"
   - **Content:** "Fresh chicken, vegetables, and tahini sauce wrapped in warm pita bread"
   - **Featured Image:** Upload food photo (recommended size: 800x600px)
   - **Price:** Enter "12.99" in sidebar meta box
3. Click **Publish**
4. Repeat for 8-12 menu items

**Sample Menu Items:**
- Chicken Shawarma Wrap - $12.99
- Beef Shawarma Plate - $18.99
- Falafel Wrap - $10.99
- Fattoush Salad - $9.99
- Chicken Kebab - $16.99
- Mixed Grill Platter - $24.99
- Hummus with Pita - $8.99
- Baklava - $5.99

### Step 2: Create Reviews (5 minutes)

1. Go to **Reviews → Add New**
2. Create first review:
   - **Title:** "John Smith"
   - **Content:** "Amazing food and excellent service! The atmosphere is perfect for a night out with friends."
   - **Rating:** Select "5 Stars" in sidebar
3. Click **Publish**
4. Repeat for 4-6 reviews

**Sample Reviews:**
- Name: Sarah Johnson | Rating: 5 | "Best Lebanese food in town!"
- Name: Michael Brown | Rating: 4 | "Great experience, will come back!"
- Name: Emily Davis | Rating: 5 | "Authentic flavors and friendly staff"

### Step 3: Prepare Gallery Images (Optional)

If you want a photo gallery:
1. Prepare 6-9 square images (800x800px recommended)
2. Go to **Media → Add New**
3. Upload all gallery images
4. Remember them for later use in the Gallery block

---

## Part 4: Build Your Homepage

### Step 1: Create Homepage

1. Go to **Pages → Add New**
2. Title: "Home"
3. Don't publish yet - we'll add blocks first

### Step 2: Add Blocks

Click the **(+)** button to add blocks. Look for **Design to Delight** category.

#### Block 1: Hero Section

1. Add **Hero Section** block
2. In the right sidebar, configure:
   - **Title:** Your restaurant name (or leave blank to use site name)
   - **Subtitle:** Your tagline/description
   - **Rating:** 4.5
   - **Review Count:** 1200
   - **Primary Button Text:** "View Menu"
   - **Primary Button Link:** #menu
   - **Secondary Button Text:** "Get Directions"
   - **Secondary Button Link:** #location
   - **Background Image:** Upload a hero image (1920x1080px recommended)

#### Block 2: Overview Section

1. Add **Overview Section** block
2. Configure:
   - **Title:** "About Our Restaurant"
   - **Content:** Write 2-3 paragraphs about your restaurant

Example content:
```
Welcome to our restaurant, where we bring authentic flavors and warm hospitality together. Our establishment is more than just a place to dine; it's a cultural hub where traditions meet modern hospitality.

The menu shines with classic dishes, each prepared with freshness and bold flavors. Our signature specials and hearty options provide satisfying choices, while sweet treats offer a perfect balance for those with a sweet tooth.

Known for smooth service and genuine care from our staff, we create an atmosphere of warmth and respect that keeps patrons coming back.
```

#### Block 3: Menu Grid

1. Add **Menu Grid** block
2. Configure:
   - **Title:** "Menu Highlights"
   - **Description:** "Discover our most popular dishes"
   - **Items to Display:** 8

The block will automatically display menu items you created earlier.

#### Block 4: Photo Gallery

1. Add **Photo Gallery** block
2. Configure:
   - **Title:** "Gallery"
   - **Description:** "Take a visual tour of our restaurant"
   - Click **Add Images** in sidebar
   - Select 6-9 images from media library
   - Click **Create Gallery**

#### Block 5: Reviews Grid

1. Add **Reviews Grid** block
2. Configure:
   - **Title:** "What Customers Say"
   - **Reviews to Display:** 6

The block will automatically display reviews you created earlier.

#### Block 6: Location Info

1. Add **Location Info** block
2. Configure:
   - **Title:** "Visit Us"
   - **Address:** 
     ```
     123 Main Street
     City, State 12345
     United States
     ```
   - **Phone:** +1 (555) 123-4567
   - **Opening Hours:**
     ```
     Mon-Thu: 11:00 AM - 01:00 AM
     Fri-Sat: 11:00 AM - 02:00 AM
     Sun: 12:00 PM - 01:00 AM
     ```

#### Block 7: Amenities Grid

1. Add **Amenities Grid** block
2. The block comes with default amenities (can be customized in plugin code)
3. Configure:
   - **Title:** "Amenities & Services"

### Step 3: Publish Homepage

1. Review all blocks
2. Click **Publish**
3. View the page to see your work!

### Step 4: Set as Homepage

1. Go to **Settings → Reading**
2. Select "A static page"
3. **Homepage:** Select "Home"
4. Click **Save Changes**

---

## Part 5: Create Additional Pages

### Menu Page (Full Menu Listing)

1. **Pages → Add New**
2. Title: "Our Menu"
3. Add **Menu Grid** block
4. Set **Items to Display:** 20 (or -1 for all)
5. Publish

### About Page

1. **Pages → Add New**
2. Title: "About Us"
3. Add **Overview Section** block
4. Write detailed history/story
5. Optionally add **Photo Gallery** block
6. Publish

### Contact Page

1. **Pages → Add New**
2. Title: "Contact Us"
3. Add **Location Info** block with full details
4. Optionally install Contact Form 7 plugin for contact form
5. Publish

---

## Part 6: Customization

### Change Colors

Edit `/wp-content/plugins/design-to-delight-blocks-plugin/build/style.css`:

```css
:root {
    --primary-color: #2c3e50;     /* Navy blue - change this */
    --secondary-color: #e74c3c;   /* Red accent - change this */
    --accent-gold: #f39c12;       /* Gold - change this */
}
```

### Add Custom CSS

Go to **Appearance → Customize → Additional CSS** and add custom styles.

### Change Fonts

Edit `cedars-blocks.php` and update Google Fonts URL to different fonts.

---

## Troubleshooting

### Blocks Not Showing in Editor
- Clear browser cache
- Deactivate other plugins temporarily
- Check plugin is activated

### Menu Items Not Displaying
- Make sure menu items are published (not draft)
- Verify featured images are set
- Check prices are entered in meta box

### Styling Issues
- Clear all caches (browser, WordPress, CDN)
- Try different browser
- Check for CSS conflicts with other plugins

---

## What's Next?

### Recommended Plugins

1. **Contact Form 7** - For contact forms
2. **Yoast SEO** - For search engine optimization
3. **Smush** - For image optimization
4. **WP Super Cache** - For faster loading
5. **UpdraftPlus** - For backups

### Optional Enhancements

1. Add Google Maps to location section
2. Set up online ordering (WooCommerce)
3. Add newsletter signup form (Mailchimp)
4. Install SSL certificate (HTTPS)
5. Set up Google Analytics

### Content Tips

1. Use high-quality, professional food photos
2. Keep menu descriptions concise (2-3 sentences)
3. Update menu seasonally
4. Respond to customer reviews
5. Post regularly on social media

---

## Support Resources

- WordPress Codex: https://codex.wordpress.org
- WordPress Support Forums: https://wordpress.org/support/
- Theme Documentation: See README.md in theme folder
- Plugin Documentation: See README.md in plugin folder

---

## Checklist

Before going live, make sure you've:

- [ ] Installed and activated theme
- [ ] Installed and activated plugin
- [ ] Created 8-12 menu items with images and prices
- [ ] Created 4-6 customer reviews with ratings
- [ ] Built homepage with all blocks
- [ ] Set homepage as static page
- [ ] Created navigation menu
- [ ] Added restaurant information (address, phone, hours)
- [ ] Added social media links
- [ ] Uploaded logo (optional)
- [ ] Tested on mobile devices
- [ ] Optimized images for web
- [ ] Set up contact form
- [ ] Configured SEO plugin
- [ ] Tested all links work
- [ ] Checked spelling and grammar

---

**Congratulations! Your restaurant website is ready! 🎉**

Your website now has:
✅ Professional design
✅ Mobile-responsive layout
✅ Easy-to-update content
✅ Drag-and-drop page builder
✅ Menu management system
✅ Customer reviews display
✅ Photo gallery
✅ Location information

Start promoting your website and watch your restaurant grow!
