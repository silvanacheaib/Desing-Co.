<?php
/**
 * Plugin Name: Design to Delight Blocks
 * Plugin URI: https://example.com/design-to-delight-blocks
 * Description: Custom Gutenberg blocks for restaurant websites - Hero, Menu Grid, Reviews, Gallery, Location, and more
 * Version: 1.0.0
 * Author: Custom Blocks
 * Author URI: https://example.com
 * License: GPL v2 or later
 * Text Domain: design-to-delight-blocks
 * 
 * ============================================================================
 * WELCOME TO DESIGN TO DELIGHT BLOCKS!
 * ============================================================================
 * 
 * This plugin provides 7 custom blocks for building restaurant websites:
 * 
 * 1. Hero Section      - Large banner with background image and CTA buttons
 * 2. Menu Grid         - Display menu items from database
 * 3. Reviews Grid      - Show customer testimonials with star ratings
 * 4. Photo Gallery     - Image gallery with hover effects
 * 5. Location Info     - Address, phone, and hours cards
 * 6. Amenities Grid    - Restaurant features and services
 * 7. Overview Section  - Rich text content for about pages
 * 
 * FILE STRUCTURE:
 * ===============
 * 
 * /design-to-delight-blocks-plugin/
 * ├── design-to-delight-blocks.php        ← YOU ARE HERE (main plugin file)
 * ├── blocks/                  ← Individual block files
 * │   ├── hero-section.php
 * │   ├── menu-grid.php
 * │   ├── reviews-grid.php
 * │   ├── photo-gallery.php
 * │   ├── location-info.php
 * │   ├── amenities-grid.php
 * │   └── overview-section.php
 * └── build/                   ← Compiled CSS and JS
 *     ├── blocks.js           (Gutenberg block editor interface)
 *     ├── style.css           (Frontend styles)
 *     └── editor.css          (Editor-only styles)
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * 
 * 1. Loads all block files from /blocks directory
 * 2. Registers custom post types (Menu Items, Reviews)
 * 3. Creates meta boxes for custom fields (price, rating)
 * 4. Enqueues CSS and JavaScript files
 * 5. Registers block category in Gutenberg
 * 6. Handles plugin activation/deactivation
 * 
 * GETTING STARTED:
 * ================
 * 
 * After activating this plugin:
 * 1. Go to "Menu Items" → Add New (create 6-12 menu items)
 * 2. Go to "Reviews" → Add New (create 3-6 reviews)
 * 3. Create a new page and add Cedars blocks
 * 4. Build your page by dragging blocks
 * 
 * NEED HELP?
 * ==========
 * 
 * - See README.md for full documentation
 * - See PLUGIN-STRUCTURE.md for technical details
 * - Check individual block files for examples
 * 
 * ============================================================================
 */

// ============================================================================
// SECURITY: Prevent direct access to this file
// ============================================================================
// If someone tries to access this file directly (not through WordPress),
// we stop execution immediately. This protects against security vulnerabilities.
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// ============================================================================
// DEFINE PLUGIN CONSTANTS
// ============================================================================
// These constants are used throughout the plugin for file paths and URLs

// Plugin version number (update this when you release new versions)
define('DESIGN_TO_DELIGHT_BLOCKS_VERSION', '1.0.0');

// Absolute file path to plugin directory (e.g., /var/www/wp-content/plugins/design-to-delight-blocks/)
define('DESIGN_TO_DELIGHT_BLOCKS_PATH', plugin_dir_path(__FILE__));

// URL to plugin directory (e.g., https://yoursite.com/wp-content/plugins/design-to-delight-blocks/)
define('DESIGN_TO_DELIGHT_BLOCKS_URL', plugin_dir_url(__FILE__));

// ============================================================================
// LOAD ALL BLOCK FILES
// ============================================================================

/**
 * Load All Block Files
 * 
 * This function automatically loads all block files from the /blocks directory.
 * Each block is in its own file for better organization.
 * 
 * HOW IT WORKS:
 * 1. We have a list of all block file names
 * 2. Loop through each block name
 * 3. Check if the file exists
 * 4. Load (require) the file
 * 
 * TO ADD A NEW BLOCK:
 * 1. Create new file in /blocks directory (e.g., blocks/my-block.php)
 * 2. Add 'my-block' to the $blocks array below
 * 3. That's it! The plugin will automatically load it
 * 
 * @since 1.0.0
 */
function design_to_delight_blocks_load_blocks() {
    // List of all block files (without the .php extension)
    $blocks = array(
        'hero-section',      // blocks/hero-section.php
        'menu-grid',         // blocks/menu-grid.php
        'reviews-grid',      // blocks/reviews-grid.php
        'photo-gallery',     // blocks/photo-gallery.php
        'location-info',     // blocks/location-info.php
        'amenities-grid',    // blocks/amenities-grid.php
        'overview-section',  // blocks/overview-section.php
    );
    
    // Loop through each block
    foreach ($blocks as $block) {
        // Build the full file path
        // Example: /path/to/plugin/blocks/hero-section.php
        $file = DESIGN_TO_DELIGHT_BLOCKS_PATH . 'blocks/' . $block . '.php';
        
        // Check if file actually exists (prevents errors)
        if (file_exists($file)) {
            // Load the block file
            require_once $file;
        }
    }
}

// Hook: Run this function after all plugins are loaded
// This ensures WordPress is fully initialized before we load blocks
add_action('plugins_loaded', 'design_to_delight_blocks_load_blocks');

/**
 * Register custom post types
 */
function design_to_delight_blocks_register_post_types() {
    // Menu Items
    register_post_type('menu_item', array(
        'labels' => array(
            'name' => __('Menu Items', 'design-to-delight-blocks'),
            'singular_name' => __('Menu Item', 'design-to-delight-blocks'),
            'add_new' => __('Add New Menu Item', 'design-to-delight-blocks'),
            'add_new_item' => __('Add New Menu Item', 'design-to-delight-blocks'),
            'edit_item' => __('Edit Menu Item', 'design-to-delight-blocks'),
            'new_item' => __('New Menu Item', 'design-to-delight-blocks'),
            'view_item' => __('View Menu Item', 'design-to-delight-blocks'),
            'search_items' => __('Search Menu Items', 'design-to-delight-blocks'),
        ),
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-food',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'page-attributes'),
        'rewrite' => array('slug' => 'menu'),
        'show_in_rest' => true,
    ));
    
    // Reviews
    register_post_type('review', array(
        'labels' => array(
            'name' => __('Reviews', 'design-to-delight-blocks'),
            'singular_name' => __('Review', 'design-to-delight-blocks'),
            'add_new' => __('Add New Review', 'design-to-delight-blocks'),
            'add_new_item' => __('Add New Review', 'design-to-delight-blocks'),
            'edit_item' => __('Edit Review', 'design-to-delight-blocks'),
            'new_item' => __('New Review', 'design-to-delight-blocks'),
            'view_item' => __('View Review', 'design-to-delight-blocks'),
            'search_items' => __('Search Reviews', 'design-to-delight-blocks'),
        ),
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-star-filled',
        'supports' => array('title', 'editor'),
        'rewrite' => array('slug' => 'reviews'),
        'show_in_rest' => true,
    ));
}
add_action('init', 'design_to_delight_blocks_register_post_types');

/**
 * Add meta boxes for custom fields
 */
function design_to_delight_blocks_add_meta_boxes() {
    // Menu item price
    add_meta_box(
        'menu_item_price',
        __('Menu Item Details', 'design-to-delight-blocks'),
        'design_to_delight_blocks_menu_item_meta_box',
        'menu_item',
        'side',
        'default'
    );
    
    // Review rating
    add_meta_box(
        'review_rating',
        __('Review Rating', 'design-to-delight-blocks'),
        'design_to_delight_blocks_review_meta_box',
        'review',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'design_to_delight_blocks_add_meta_boxes');

/**
 * Menu item meta box callback
 */
function design_to_delight_blocks_menu_item_meta_box($post) {
    wp_nonce_field('design_to_delight_blocks_menu_item', 'design_to_delight_blocks_menu_item_nonce');
    $price = get_post_meta($post->ID, 'menu_item_price', true);
    ?>
    <p>
        <label for="menu_item_price"><?php _e('Price:', 'design-to-delight-blocks'); ?></label><br>
        <input type="text" id="menu_item_price" name="menu_item_price" value="<?php echo esc_attr($price); ?>" placeholder="12.99" style="width: 100%;">
        <small style="display: block; margin-top: 5px; color: #666;">
            <?php _e('Enter price without currency symbol (e.g., 12.99)', 'design-to-delight-blocks'); ?>
        </small>
    </p>
    <?php
}

/**
 * Review meta box callback
 */
function design_to_delight_blocks_review_meta_box($post) {
    wp_nonce_field('design_to_delight_blocks_review', 'design_to_delight_blocks_review_nonce');
    $rating = get_post_meta($post->ID, 'review_rating', true);
    ?>
    <p>
        <label for="review_rating"><?php _e('Rating (1-5):', 'design-to-delight-blocks'); ?></label><br>
        <select id="review_rating" name="review_rating" style="width: 100%;">
            <option value="5" <?php selected($rating, '5'); ?>>★★★★★ (5 Stars)</option>
            <option value="4" <?php selected($rating, '4'); ?>>★★★★☆ (4 Stars)</option>
            <option value="3" <?php selected($rating, '3'); ?>>★★★☆☆ (3 Stars)</option>
            <option value="2" <?php selected($rating, '2'); ?>>★★☆☆☆ (2 Stars)</option>
            <option value="1" <?php selected($rating, '1'); ?>>★☆☆☆☆ (1 Star)</option>
        </select>
    </p>
    <?php
}

/**
 * Save meta box data
 */
function design_to_delight_blocks_save_meta_boxes($post_id) {
    // Check autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    // Menu item price
    if (isset($_POST['design_to_delight_blocks_menu_item_nonce']) && 
        wp_verify_nonce($_POST['design_to_delight_blocks_menu_item_nonce'], 'design_to_delight_blocks_menu_item')) {
        if (isset($_POST['menu_item_price'])) {
            update_post_meta($post_id, 'menu_item_price', sanitize_text_field($_POST['menu_item_price']));
        }
    }
    
    // Review rating
    if (isset($_POST['design_to_delight_blocks_review_nonce']) && 
        wp_verify_nonce($_POST['design_to_delight_blocks_review_nonce'], 'design_to_delight_blocks_review')) {
        if (isset($_POST['review_rating'])) {
            update_post_meta($post_id, 'review_rating', sanitize_text_field($_POST['review_rating']));
        }
    }
}
add_action('save_post', 'design_to_delight_blocks_save_meta_boxes');

/**
 * Enqueue block editor assets
 */
function design_to_delight_blocks_enqueue_editor_assets() {
    wp_enqueue_style(
        'design-to-delight-blocks-editor',
        DESIGN_TO_DELIGHT_BLOCKS_URL . 'build/editor.css',
        array('wp-edit-blocks'),
        DESIGN_TO_DELIGHT_BLOCKS_VERSION
    );
    
    wp_enqueue_script(
        'design-to-delight-blocks-script',
        DESIGN_TO_DELIGHT_BLOCKS_URL . 'build/blocks.js',
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'),
        DESIGN_TO_DELIGHT_BLOCKS_VERSION,
        true
    );
}
add_action('enqueue_block_editor_assets', 'design_to_delight_blocks_enqueue_editor_assets');

/**
 * Enqueue frontend assets
 */
function design_to_delight_blocks_enqueue_assets() {
    wp_enqueue_style(
        'design-to-delight-blocks-style',
        DESIGN_TO_DELIGHT_BLOCKS_URL . 'build/style.css',
        array(),
        DESIGN_TO_DELIGHT_BLOCKS_VERSION
    );
    
    wp_enqueue_style(
        'design-to-delight-blocks-fonts',
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lato:wght@300;400;700&display=swap',
        array(),
        null
    );
}
add_action('wp_enqueue_scripts', 'design_to_delight_blocks_enqueue_assets');

/**
 * Register block category
 */
function design_to_delight_blocks_register_category($categories) {
    return array_merge(
        array(
            array(
                'slug' => 'design-to-delight',
                'title' => __('Design to Delight', 'design-to-delight-blocks'),
                'icon' => 'food',
            ),
        ),
        $categories
    );
}
add_filter('block_categories_all', 'design_to_delight_blocks_register_category', 10, 1);

/**
 * Add custom admin notices
 */
function design_to_delight_blocks_admin_notices() {
    global $pagenow;
    
    // Show notice on plugins page after activation
    if ($pagenow == 'plugins.php' && get_transient('design_to_delight_blocks_activated')) {
        delete_transient('design_to_delight_blocks_activated');
        ?>
        <div class="notice notice-success is-dismissible">
            <p>
                <strong><?php _e('Design to Delight Blocks activated!', 'design-to-delight-blocks'); ?></strong>
                <?php _e('Start building your restaurant website by adding Menu Items and Reviews, then use the blocks in the page editor.', 'design-to-delight-blocks'); ?>
            </p>
            <p>
                <a href="<?php echo admin_url('post-new.php?post_type=menu_item'); ?>" class="button button-primary">
                    <?php _e('Add Menu Item', 'design-to-delight-blocks'); ?>
                </a>
                <a href="<?php echo admin_url('post-new.php?post_type=review'); ?>" class="button">
                    <?php _e('Add Review', 'design-to-delight-blocks'); ?>
                </a>
            </p>
        </div>
        <?php
    }
}
add_action('admin_notices', 'design_to_delight_blocks_admin_notices');

/**
 * Plugin activation hook
 */
function design_to_delight_blocks_activate() {
    // Flush rewrite rules
    flush_rewrite_rules();
    
    // Set transient for activation notice
    set_transient('design_to_delight_blocks_activated', true, 5);
}
register_activation_hook(__FILE__, 'design_to_delight_blocks_activate');

/**
 * Plugin deactivation hook
 */
function design_to_delight_blocks_deactivate() {
    // Flush rewrite rules
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'design_to_delight_blocks_deactivate');
