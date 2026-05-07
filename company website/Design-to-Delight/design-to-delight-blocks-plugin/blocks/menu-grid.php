<?php
/**
 * Menu Grid Block
 * 
 * This block displays your restaurant menu items in a beautiful grid layout.
 * It automatically pulls items from the "Menu Items" custom post type.
 * 
 * Features:
 * - Responsive grid layout (adjusts to screen size)
 * - Shows item image, name, description, and price
 * - Adjustable number of items to display
 * - Links to individual menu item pages
 * 
 * Perfect for: Menu page, homepage menu highlights
 * 
 * @package Design_To_Delight_Blocks
 */

// Security: Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Menu Grid Block
 * 
 * This tells WordPress about the Menu Grid block and its settings.
 */
function design_to_delight_register_menu_grid_block() {
    register_block_type('design-to-delight-blocks/menu-grid', array(
        // Function that generates the HTML
        'render_callback' => 'design_to_delight_render_menu_grid_block',
        
        // Block settings (editable in the editor)
        'attributes' => array(
            // Section title
            'title' => array(
                'type' => 'string',
                'default' => 'Menu Highlights'
            ),
            // Section description/subtitle
            'description' => array(
                'type' => 'string',
                'default' => 'Discover our most popular dishes'
            ),
            // How many menu items to show
            'itemsPerPage' => array(
                'type' => 'number',      // Numeric value
                'default' => 8           // Show 8 items by default
            ),
        ),
    ));
}
// Hook: Register this block when WordPress starts
add_action('init', 'design_to_delight_register_menu_grid_block');

/**
 * Render Menu Grid Block
 * 
 * This function queries the database for menu items and displays them in a grid.
 * 
 * @param array $attributes Block settings from the editor
 * @return string HTML output for the menu grid
 */
function design_to_delight_render_menu_grid_block($attributes) {
    
    // STEP 1: Get the block settings
    // ================================
    $title = isset($attributes['title']) ? $attributes['title'] : 'Menu Highlights';
    $description = isset($attributes['description']) ? $attributes['description'] : 'Discover our most popular dishes';
    $itemsPerPage = isset($attributes['itemsPerPage']) ? intval($attributes['itemsPerPage']) : 8;
    
    // STEP 2: Query the database for menu items
    // ===========================================
    
    // Set up the query parameters
    $args = array(
        'post_type' => 'menu_item',          // Get posts from "Menu Items" post type
        'posts_per_page' => $itemsPerPage,   // Limit number of items
        'orderby' => 'menu_order',           // Sort by custom order (drag & drop in admin)
        'order' => 'ASC'                     // Ascending order (A-Z, 1-2-3)
    );
    
    // Allow theme/plugin developers to modify the query
    // Example usage in theme: add_filter('design_to_delight_blocks_menu_query_args', function($args) { ... });
    $args = apply_filters('design_to_delight_blocks_menu_query_args', $args);
    
    // Execute the query (get the menu items from database)
    $menu_query = new WP_Query($args);
    
    // STEP 3: Generate the HTML output
    // ==================================
    
    // Start capturing HTML output
    ob_start();
    ?>
    
    <!-- Main section container -->
    <section class="design-to-delight-section">
        <div class="container">
            
            <!-- Section header (title and description) -->
            <div class="section-header">
                <h2 class="section-title"><?php echo esc_html($title); ?></h2>
                <?php if ($description): ?>
                    <p class="section-description"><?php echo esc_html($description); ?></p>
                <?php endif; ?>
            </div>
            
            <!-- Grid container for menu items -->
            <div class="menu-grid">
                <?php
                // Check if we found any menu items
                if ($menu_query->have_posts()) :
                    
                    // Loop through each menu item
                    while ($menu_query->have_posts()) : $menu_query->the_post();
                        
                        // Get the price from custom field (meta data)
                        $price = get_post_meta(get_the_ID(), 'menu_item_price', true);
                ?>
                    
                    <!-- Individual menu item card -->
                    <div class="menu-item">
                        
                        <?php if (has_post_thumbnail()) : ?>
                            <!-- Menu item image (if one exists) -->
                            <a href="<?php the_permalink(); ?>">
                                <?php 
                                // Display the featured image
                                // 'medium' = size, 'menu-item-image' = CSS class
                                the_post_thumbnail('medium', array('class' => 'menu-item-image')); 
                                ?>
                            </a>
                        <?php else : ?>
                            <!-- Placeholder if no image uploaded -->
                            <div class="menu-item-image" style="background: #e8e8e8; height: 250px; display: flex; align-items: center; justify-content: center; color: #aaa;">
                                🍽️ <!-- Food emoji as placeholder -->
                            </div>
                        <?php endif; ?>
                        
                        <!-- Menu item details -->
                        <div class="menu-item-content">
                            
                            <!-- Item name/title -->
                            <h3 class="menu-item-title">
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_title(); ?>
                                </a>
                            </h3>
                            
                            <!-- Item description (trimmed to 15 words) -->
                            <p class="menu-item-description">
                                <?php echo wp_trim_words(get_the_excerpt(), 15); ?>
                            </p>
                            
                            <!-- Price (only shows if price was entered) -->
                            <?php if ($price) : ?>
                                <div class="menu-item-price">$<?php echo esc_html($price); ?></div>
                            <?php endif; ?>
                            
                        </div>
                    </div>
                    
                <?php
                    endwhile;
                    
                    // Reset query to avoid conflicts
                    wp_reset_postdata();
                    
                else :
                    // No menu items found - show helpful message
                    ?>
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: #f8f9fa; border-radius: 12px;">
                        <p style="font-size: 1.2rem; color: #7f8c8d; margin-bottom: 1rem;">
                            <?php _e('No menu items found.', 'design-to-delight-blocks'); ?>
                        </p>
                        <p style="color: #7f8c8d;">
                            <?php _e('Go to Menu Items → Add New to create your first menu item.', 'design-to-delight-blocks'); ?>
                        </p>
                    </div>
                    <?php
                endif;
                ?>
            </div>
            
        </div>
    </section>
    
    <?php
    // Return all the captured HTML
    return ob_get_clean();
}

/**
 * CUSTOMIZATION EXAMPLES:
 * =======================
 * 
 * 1. Show only items from a specific category:
 *    Add this to your theme's functions.php:
 * 
 *    add_filter('design_to_delight_blocks_menu_query_args', function($args) {
 *        $args['tax_query'] = array(
 *            array(
 *                'taxonomy' => 'menu_category',
 *                'field' => 'slug',
 *                'terms' => 'appetizers'
 *            )
 *        );
 *        return $args;
 *    });
 * 
 * 2. Show only featured items:
 *    add_filter('design_to_delight_blocks_menu_query_args', function($args) {
 *        $args['meta_query'] = array(
 *            array(
 *                'key' => 'featured',
 *                'value' => '1'
 *            )
 *        );
 *        return $args;
 *    });
 * 
 * 3. Change sort order (alphabetical):
 *    add_filter('design_to_delight_blocks_menu_query_args', function($args) {
 *        $args['orderby'] = 'title';
 *        $args['order'] = 'ASC';
 *        return $args;
 *    });
 */
