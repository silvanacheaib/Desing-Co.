# Design to Delight Blocks - Plugin Structure

## 📁 Modular File Organization

This plugin uses a **modular architecture** where each block is in its own separate file for better organization, maintainability, and scalability.

## File Structure

```
design-to-delight-blocks-plugin/
├── cedars-blocks.php          # Main plugin file (loader & core functionality)
├── blocks/                     # Individual block files
│   ├── hero-section.php       # Hero banner block
│   ├── menu-grid.php          # Menu items grid block
│   ├── reviews-grid.php       # Customer reviews block
│   ├── photo-gallery.php      # Image gallery block
│   ├── location-info.php      # Location & contact info block
│   ├── amenities-grid.php     # Amenities display block
│   └── overview-section.php   # About/overview text block
├── build/                      # Compiled assets
│   ├── blocks.js              # JavaScript for all blocks (Gutenberg)
│   ├── style.css              # Frontend styles
│   └── editor.css             # Editor-only styles
└── README.md                   # This file

```

## 🎯 Main Plugin File (`cedars-blocks.php`)

The main plugin file handles:
- Plugin registration and metadata
- Loading all block files from `/blocks` directory
- Registering custom post types (Menu Items, Reviews)
- Meta box registration and saving
- Asset enqueueing (CSS/JS)
- Block category registration
- Activation/deactivation hooks

### Key Function: Block Loader

```php
function cedars_blocks_load_blocks() {
    $blocks = array(
        'hero-section',
        'menu-grid',
        'reviews-grid',
        'photo-gallery',
        'location-info',
        'amenities-grid',
        'overview-section',
    );
    
    foreach ($blocks as $block) {
        $file = CEDARS_BLOCKS_PATH . 'blocks/' . $block . '.php';
        if (file_exists($file)) {
            require_once $file;
        }
    }
}
```

## 📦 Individual Block Files

Each block file in the `/blocks` directory contains:

1. **Block Registration Function** - Registers the block with WordPress
2. **Render Callback Function** - Generates HTML output for frontend
3. **Attribute Definitions** - Defines editable properties
4. **Documentation** - Comments explaining the block's purpose

### Example: Hero Section Block (`blocks/hero-section.php`)

```php
<?php
/**
 * Hero Section Block
 * 
 * Large banner section with background image, title, subtitle, rating, and CTA buttons
 */

// Register the block
function cedars_register_hero_section_block() {
    register_block_type('cedars-blocks/hero-section', array(
        'render_callback' => 'cedars_render_hero_section_block',
        'attributes' => array(
            'title' => array('type' => 'string', 'default' => ''),
            'subtitle' => array('type' => 'string', 'default' => ''),
            // ... more attributes
        ),
    ));
}
add_action('init', 'cedars_register_hero_section_block');

// Render the block on frontend
function cedars_render_hero_section_block($attributes) {
    // Extract attributes
    $title = isset($attributes['title']) ? $attributes['title'] : '';
    
    // Generate HTML
    ob_start();
    ?>
    <section class="cedars-hero-section">
        <!-- HTML markup -->
    </section>
    <?php
    return ob_get_clean();
}
```

## 🔧 Adding a New Block

To add a new block to the plugin:

### Step 1: Create Block File

Create a new file in `/blocks` directory (e.g., `blocks/testimonial-slider.php`):

```php
<?php
/**
 * Testimonial Slider Block
 * 
 * Displays customer testimonials in a slider format
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

function cedars_register_testimonial_slider_block() {
    register_block_type('cedars-blocks/testimonial-slider', array(
        'render_callback' => 'cedars_render_testimonial_slider_block',
        'attributes' => array(
            'title' => array(
                'type' => 'string',
                'default' => 'Testimonials'
            ),
            'slidesCount' => array(
                'type' => 'number',
                'default' => 3
            ),
        ),
    ));
}
add_action('init', 'cedars_register_testimonial_slider_block');

function cedars_render_testimonial_slider_block($attributes) {
    $title = isset($attributes['title']) ? $attributes['title'] : 'Testimonials';
    
    ob_start();
    ?>
    <section class="cedars-testimonial-slider">
        <h2><?php echo esc_html($title); ?></h2>
        <!-- Your slider HTML here -->
    </section>
    <?php
    return ob_get_clean();
}
```

### Step 2: Register in Main Plugin File

Add your block name to the `$blocks` array in `cedars-blocks.php`:

```php
function cedars_blocks_load_blocks() {
    $blocks = array(
        'hero-section',
        'menu-grid',
        'reviews-grid',
        'photo-gallery',
        'location-info',
        'amenities-grid',
        'overview-section',
        'testimonial-slider',  // ← Add your new block here
    );
    
    foreach ($blocks as $block) {
        $file = CEDARS_BLOCKS_PATH . 'blocks/' . $block . '.php';
        if (file_exists($file)) {
            require_once $file;
        }
    }
}
```

### Step 3: Add Block Editor UI (JavaScript)

Add your block definition to `build/blocks.js`:

```javascript
registerBlockType('cedars-blocks/testimonial-slider', {
    title: __('Testimonial Slider', 'cedars-blocks'),
    icon: createIcon('💬'),
    category: 'cedars-restaurant',
    attributes: {
        title: { type: 'string', default: 'Testimonials' },
        slidesCount: { type: 'number', default: 3 }
    },
    edit: function(props) {
        // Editor interface
    },
    save: function() {
        return null; // Server-side rendering
    }
});
```

### Step 4: Add Styles (if needed)

Add block-specific styles to `build/style.css`:

```css
.cedars-testimonial-slider {
    padding: 80px 0;
    background: var(--bg-light);
}
```

## 📝 Block File Template

Use this template when creating new blocks:

```php
<?php
/**
 * [Block Name] Block
 * 
 * [Brief description of what this block does]
 * 
 * @package Cedars_Blocks
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register [Block Name] Block
 */
function cedars_register_[block_slug]_block() {
    register_block_type('cedars-blocks/[block-slug]', array(
        'render_callback' => 'cedars_render_[block_slug]_block',
        'attributes' => array(
            'title' => array(
                'type' => 'string',
                'default' => '[Default Title]'
            ),
            // Add more attributes here
        ),
    ));
}
add_action('init', 'cedars_register_[block_slug]_block');

/**
 * Render [Block Name] Block
 */
function cedars_render_[block_slug]_block($attributes) {
    // Extract attributes
    $title = isset($attributes['title']) ? $attributes['title'] : '[Default Title]';
    
    // Apply filters (optional)
    $title = apply_filters('cedars_blocks_[block_slug]_title', $title);
    
    // Start output buffering
    ob_start();
    ?>
    <section class="cedars-[block-slug]">
        <div class="container">
            <h2><?php echo esc_html($title); ?></h2>
            <!-- Your block HTML here -->
        </div>
    </section>
    <?php
    return ob_get_clean();
}
```

## 🎨 Benefits of Modular Structure

### 1. **Easy Maintenance**
- Each block is self-contained
- Easy to find and edit specific blocks
- Changes don't affect other blocks

### 2. **Better Organization**
- Clear file structure
- Logical separation of concerns
- Easy to navigate for new developers

### 3. **Scalability**
- Add new blocks without cluttering main file
- Can easily enable/disable specific blocks
- Simple to create block variations

### 4. **Team Collaboration**
- Multiple developers can work on different blocks
- Reduces merge conflicts
- Clear ownership of features

### 5. **Code Reusability**
- Blocks can be easily copied to other projects
- Share individual blocks between sites
- Create block libraries

## 🔍 Block Anatomy

### Registration Function
```php
function cedars_register_BLOCKNAME_block() {
    register_block_type('cedars-blocks/block-name', array(
        'render_callback' => 'cedars_render_BLOCKNAME_block',
        'attributes' => array(/* ... */),
    ));
}
add_action('init', 'cedars_register_BLOCKNAME_block');
```

### Render Function
```php
function cedars_render_BLOCKNAME_block($attributes) {
    // 1. Extract attributes
    $title = isset($attributes['title']) ? $attributes['title'] : 'Default';
    
    // 2. Process data (queries, filters, etc.)
    $data = get_some_data();
    
    // 3. Generate HTML
    ob_start();
    ?>
    <section class="cedars-block">
        <?php echo esc_html($title); ?>
    </section>
    <?php
    return ob_get_clean();
}
```

## 🛠️ Customization Hooks

Each block supports WordPress filters for customization:

```php
// In your theme's functions.php

// Modify menu query arguments
add_filter('cedars_blocks_menu_query_args', function($args) {
    $args['posts_per_page'] = 12;
    return $args;
});

// Modify amenities list
add_filter('cedars_blocks_amenities', function($amenities) {
    return array(
        array('icon' => '🍕', 'text' => 'Wood-Fired Pizza'),
        array('icon' => '🍷', 'text' => 'Wine Bar'),
    );
});

// Modify review query
add_filter('cedars_blocks_reviews_query_args', function($args) {
    $args['meta_key'] = 'review_rating';
    $args['meta_value'] = '5'; // Only 5-star reviews
    return $args;
});
```

## 🚀 Performance Tips

1. **Lazy Load Images**: Add `loading="lazy"` to images in blocks
2. **Cache Queries**: Use transients for expensive queries
3. **Minify Assets**: Minify CSS/JS in production
4. **Conditional Loading**: Only load assets when block is used

## 📚 Further Reading

- [WordPress Block API](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [Register Block Type](https://developer.wordpress.org/reference/functions/register_block_type/)
- [Creating Custom Blocks](https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/)

## 💡 Tips

- Always sanitize output with `esc_html()`, `esc_url()`, etc.
- Use `ob_start()` and `ob_get_clean()` for HTML rendering
- Add `apply_filters()` for theme customization hooks
- Include helpful empty state messages when no content exists
- Document your attributes clearly
- Test blocks with and without content

---

**Questions?** Check the main plugin README.md or WordPress documentation.
