# Design to Delight Blocks - Code Explanation Guide

## 📚 Complete Code Walkthrough for Beginners

This guide explains every part of the plugin code in simple terms. Perfect for developers who are new to WordPress plugin development!

---

## Table of Contents

1. [Plugin Structure Overview](#plugin-structure-overview)
2. [Understanding PHP Basics](#understanding-php-basics)
3. [How WordPress Blocks Work](#how-wordpress-blocks-work)
4. [Main Plugin File Explained](#main-plugin-file-explained)
5. [Block File Explained (Step by Step)](#block-file-explained)
6. [Common Functions Reference](#common-functions-reference)
7. [Customization Examples](#customization-examples)

---

## Plugin Structure Overview

```
design-to-delight-blocks-plugin/
├── design-to-delight-blocks.php          ← Main file that loads everything
├── blocks/                     ← Individual block files (one per block)
│   ├── hero-section.php       ← Hero banner block
│   ├── menu-grid.php          ← Menu items display
│   └── ... (other blocks)
└── build/                      ← Compiled assets
    ├── blocks.js              ← JavaScript for block editor
    ├── style.css              ← Frontend styles
    └── editor.css             ← Editor-only styles
```

**Flow:**
1. WordPress loads `design-to-delight-blocks.php`
2. Plugin loads all files from `blocks/` folder
3. Each block registers itself with WordPress
4. Blocks become available in Gutenberg editor

---

## Understanding PHP Basics

### What is PHP?

PHP is a server-side programming language. It runs on your web server before the page is sent to the browser.

### Key PHP Syntax

```php
<?php
// Everything between these tags is PHP code
?>

// This is a comment (notes for humans, ignored by computer)

/* This is a
   multi-line comment */

// Variables start with $
$name = "John";
$price = 12.99;

// Functions are reusable blocks of code
function say_hello() {
    echo "Hello!";
}

// Calling a function
say_hello();

// Arrays (lists of items)
$colors = array('red', 'blue', 'green');

// If statements (conditional logic)
if ($price > 10) {
    echo "Expensive!";
} else {
    echo "Cheap!";
}
```

---

## How WordPress Blocks Work

### The Block Lifecycle

```
1. REGISTER BLOCK
   ↓
2. DEFINE ATTRIBUTES (settings)
   ↓
3. CREATE EDITOR INTERFACE (JavaScript - in blocks.js)
   ↓
4. RENDER FRONTEND (PHP - what users see)
```

### Key Concepts

**Attributes:** Settings that can be changed in the editor (like title, color, etc.)

**Render Callback:** PHP function that generates HTML for your website

**Editor Interface:** JavaScript code that creates the editing experience in Gutenberg

---

## Main Plugin File Explained

Let's break down `design-to-delight-blocks.php` section by section:

### 1. Plugin Header

```php
/**
 * Plugin Name: Design to Delight Blocks
 * Description: Custom Gutenberg blocks...
 * Version: 1.0.0
 */
```

**What this does:** Tells WordPress about your plugin. This information appears in the Plugins page.

### 2. Security Check

```php
if (!defined('ABSPATH')) {
    exit;
}
```

**What this does:** 
- `ABSPATH` is a WordPress constant that's only defined when WordPress is running
- If someone tries to access this file directly (not through WordPress), stop them
- This prevents security vulnerabilities

### 3. Constants

```php
define('CEDARS_BLOCKS_VERSION', '1.0.0');
define('CEDARS_BLOCKS_PATH', plugin_dir_path(__FILE__));
define('CEDARS_BLOCKS_URL', plugin_dir_url(__FILE__));
```

**What this does:**
- Creates constants (unchangeable values) used throughout the plugin
- `__FILE__` is a PHP magic constant = current file's path
- `plugin_dir_path()` = absolute server path (e.g., `/var/www/wp-content/plugins/design-to-delight-blocks/`)
- `plugin_dir_url()` = web URL (e.g., `https://yoursite.com/wp-content/plugins/design-to-delight-blocks/`)

### 4. Block Loader

```php
function design_to_delight_blocks_load_blocks() {
    $blocks = array('hero-section', 'menu-grid', ...);
    
    foreach ($blocks as $block) {
        $file = CEDARS_BLOCKS_PATH . 'blocks/' . $block . '.php';
        if (file_exists($file)) {
            require_once $file;
        }
    }
}
add_action('plugins_loaded', 'design_to_delight_blocks_load_blocks');
```

**What this does:**
- Lists all block files
- Loops through each one
- Checks if file exists (prevents errors)
- Loads the file using `require_once`
- `add_action()` = "Run this function when WordPress event 'plugins_loaded' happens"

**Why use `plugins_loaded`?**
- Ensures WordPress is fully initialized before loading blocks
- Prevents conflicts with other plugins

### 5. Register Custom Post Types

```php
function design_to_delight_blocks_register_post_types() {
    register_post_type('menu_item', array(
        'labels' => array(...),
        'public' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        // ... more options
    ));
}
add_action('init', 'design_to_delight_blocks_register_post_types');
```

**What this does:**
- Creates custom post types (like Posts and Pages, but custom)
- `menu_item` = new post type for restaurant menu items
- `review` = new post type for customer reviews
- `'public' => true` = appears in admin menu
- `'supports'` = what features this post type has (title, content, image, etc.)
- `add_action('init', ...)` = run when WordPress initializes

### 6. Meta Boxes

```php
function design_to_delight_blocks_add_meta_boxes() {
    add_meta_box(
        'menu_item_price',              // ID
        'Menu Item Details',            // Title
        'design_to_delight_blocks_menu_item_meta_box',  // Callback function
        'menu_item',                    // Post type
        'side',                         // Location (side = sidebar)
        'default'                       // Priority
    );
}
```

**What this does:**
- Adds custom fields to post edit screen
- For menu items: adds price field
- For reviews: adds star rating dropdown

**Meta Box Callback:**

```php
function design_to_delight_blocks_menu_item_meta_box($post) {
    // Security nonce
    wp_nonce_field('design_to_delight_blocks_menu_item', 'design_to_delight_blocks_menu_item_nonce');
    
    // Get existing value
    $price = get_post_meta($post->ID, 'menu_item_price', true);
    
    // Output HTML for input field
    ?>
    <input type="text" name="menu_item_price" value="<?php echo esc_attr($price); ?>">
    <?php
}
```

**Saving Meta Box Data:**

```php
function design_to_delight_blocks_save_meta_boxes($post_id) {
    // Check nonce (security)
    if (isset($_POST['design_to_delight_blocks_menu_item_nonce']) && 
        wp_verify_nonce($_POST['design_to_delight_blocks_menu_item_nonce'], 'design_to_delight_blocks_menu_item')) {
        
        // Save the data
        if (isset($_POST['menu_item_price'])) {
            update_post_meta($post_id, 'menu_item_price', sanitize_text_field($_POST['menu_item_price']));
        }
    }
}
```

### 7. Enqueue Assets

```php
function design_to_delight_blocks_enqueue_assets() {
    wp_enqueue_style(
        'design-to-delight-blocks-style',           // Handle (unique ID)
        CEDARS_BLOCKS_URL . 'build/style.css',  // File path
        array(),                         // Dependencies (none)
        CEDARS_BLOCKS_VERSION            // Version number
    );
}
add_action('wp_enqueue_scripts', 'design_to_delight_blocks_enqueue_assets');
```

**What this does:**
- Loads CSS and JavaScript files properly
- WordPress will include them in the page HTML
- Version number helps with browser caching

---

## Block File Explained (Step by Step)

Let's walk through `blocks/hero-section.php` as an example:

### Step 1: File Header

```php
/**
 * Hero Section Block
 * 
 * Description of what this block does
 * 
 * @package Cedars_Blocks
 */
```

**What this does:** Documentation for developers. Not executed as code.

### Step 2: Security Check

```php
if (!defined('ABSPATH')) {
    exit;
}
```

**What this does:** Same as main file - prevents direct access.

### Step 3: Register the Block

```php
function design_to_delight_register_hero_section_block() {
    register_block_type('design-to-delight-blocks/hero-section', array(
        'render_callback' => 'design_to_delight_render_hero_section_block',
        'attributes' => array(
            'title' => array(
                'type' => 'string',
                'default' => ''
            ),
            // ... more attributes
        ),
    ));
}
add_action('init', 'design_to_delight_register_hero_section_block');
```

**Breaking it down:**

- **`function design_to_delight_register_hero_section_block()`**: Creates a new function
- **`register_block_type()`**: WordPress function to register a block
- **`'design-to-delight-blocks/hero-section'`**: Unique block identifier (namespace/block-name)
- **`'render_callback'`**: Name of function that generates HTML
- **`'attributes'`**: List of editable settings

**Attribute Structure:**

```php
'title' => array(
    'type' => 'string',     // Data type: string, number, boolean, array
    'default' => ''         // Default value when block is first added
)
```

### Step 4: Render Function

```php
function design_to_delight_render_hero_section_block($attributes) {
    // Extract attributes
    $title = isset($attributes['title']) ? $attributes['title'] : 'Default Title';
    
    // Start output buffering
    ob_start();
    ?>
    
    <section class="hero-section">
        <h1><?php echo esc_html($title); ?></h1>
    </section>
    
    <?php
    // Return captured output
    return ob_get_clean();
}
```

**Breaking it down:**

**Extract Attributes:**
```php
$title = isset($attributes['title']) ? $attributes['title'] : 'Default Title';
```
- `isset()` = check if value exists
- `? :` = ternary operator (shorthand if/else)
- Reads as: "If title exists, use it, otherwise use 'Default Title'"

**Output Buffering:**
```php
ob_start();      // Start capturing output
// ... HTML here ...
ob_get_clean();  // Get captured output and clear buffer
```

**Why use output buffering?**
- Allows us to write HTML naturally (not as strings)
- Captures everything between `ob_start()` and `ob_get_clean()`
- Returns it as a string

**Escaping Functions:**
```php
esc_html($title)       // Escape HTML (prevents XSS attacks)
esc_url($link)         // Escape URL
esc_attr($value)       // Escape HTML attribute
```

**Why escape?**
- Security! Prevents malicious code injection
- Always escape user-provided data before outputting

---

## Common Functions Reference

### WordPress Functions Used

| Function | Purpose | Example |
|----------|---------|---------|
| `get_bloginfo('name')` | Get site name | `<?php echo get_bloginfo('name'); ?>` |
| `get_post_meta($id, $key, true)` | Get custom field value | `$price = get_post_meta($post_id, 'price', true);` |
| `update_post_meta($id, $key, $val)` | Save custom field | `update_post_meta($post_id, 'price', '12.99');` |
| `the_title()` | Display post title | `<?php the_title(); ?>` |
| `the_content()` | Display post content | `<?php the_content(); ?>` |
| `the_permalink()` | Display post URL | `<a href="<?php the_permalink(); ?>">` |
| `has_post_thumbnail()` | Check if post has image | `if (has_post_thumbnail()) { ... }` |
| `the_post_thumbnail()` | Display featured image | `<?php the_post_thumbnail('medium'); ?>` |
| `wp_trim_words($text, 15)` | Trim text to X words | `<?php echo wp_trim_words($desc, 15); ?>` |

### WordPress Queries

```php
// Create query
$args = array(
    'post_type' => 'menu_item',
    'posts_per_page' => 10
);
$query = new WP_Query($args);

// Loop through results
if ($query->have_posts()) {
    while ($query->have_posts()) {
        $query->the_post();
        // Display post data here
    }
    wp_reset_postdata(); // IMPORTANT: Reset query
}
```

### WordPress Hooks

```php
// Actions: Do something at a specific time
add_action('init', 'my_function');

// Filters: Modify data
add_filter('the_content', 'my_content_filter');

// Custom filters in our plugin
apply_filters('design_to_delight_blocks_menu_query_args', $args);
```

---

## Customization Examples

### Example 1: Change Default Number of Menu Items

**In your theme's `functions.php`:**

```php
add_filter('design_to_delight_blocks_menu_query_args', function($args) {
    $args['posts_per_page'] = 12;  // Show 12 instead of 8
    return $args;
});
```

### Example 2: Show Only 5-Star Reviews

```php
add_filter('design_to_delight_blocks_reviews_query_args', function($args) {
    $args['meta_query'] = array(
        array(
            'key' => 'review_rating',
            'value' => '5',
            'compare' => '='
        )
    );
    return $args;
});
```

### Example 3: Add Custom Amenities

```php
add_filter('design_to_delight_blocks_amenities', function($amenities) {
    return array(
        array('icon' => '🍕', 'text' => 'Wood-Fired Pizza'),
        array('icon' => '🍷', 'text' => 'Wine Bar'),
        array('icon' => '🎵', 'text' => 'Live Music'),
    );
});
```

### Example 4: Add New Attribute to Block

**In `blocks/hero-section.php`:**

```php
// Add to attributes array:
'backgroundColor' => array(
    'type' => 'string',
    'default' => '#2c3e50'
),

// Use in render function:
$bgColor = isset($attributes['backgroundColor']) ? $attributes['backgroundColor'] : '#2c3e50';

// Apply in HTML:
<section style="background-color: <?php echo esc_attr($bgColor); ?>">
```

---

## Debugging Tips

### Enable WordPress Debug Mode

**In `wp-config.php`:**
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

### Common Issues

**Issue:** Block doesn't appear in editor
**Solution:** 
- Check `blocks.js` is loaded
- Clear browser cache
- Check JavaScript console for errors

**Issue:** Changes don't show on frontend
**Solution:**
- Clear all caches (WordPress, browser, CDN)
- Check if render function returns HTML
- Verify CSS is loading

**Issue:** Meta box data not saving
**Solution:**
- Check nonce verification
- Verify `save_post` hook is registered
- Check `update_post_meta()` is called

### Useful Debug Functions

```php
// Print variable for debugging
var_dump($variable);
die(); // Stop execution

// Write to debug log
error_log(print_r($variable, true));

// Check if function exists
if (function_exists('my_function')) {
    // ...
}
```

---

## Next Steps

1. **Read the block files** with these explanations in mind
2. **Try modifying a block** - change text, add attributes
3. **Create a custom block** using the template in PLUGIN-STRUCTURE.md
4. **Experiment with filters** to customize block output
5. **Learn more** at [WordPress Developer Handbook](https://developer.wordpress.org/)

---

## Glossary

- **Hook:** A way to run your code at specific points in WordPress
- **Action:** A type of hook that executes functions
- **Filter:** A type of hook that modifies data
- **Callback:** A function that gets called by another function
- **Attribute:** Block setting that can be edited
- **Meta:** Custom data associated with a post
- **Sanitize:** Clean user input to prevent security issues
- **Escape:** Make output safe for display
- **Query:** Database request to get posts
- **Loop:** Iteration through query results

---

**Questions?** Review the code comments in each file - they explain every section in detail!
