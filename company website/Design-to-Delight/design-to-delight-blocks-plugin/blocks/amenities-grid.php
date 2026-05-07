<?php
/**
 * Amenities Grid Block
 * 
 * Displays restaurant amenities and services in a grid layout
 * 
 * @package Design_To_Delight_Blocks
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Amenities Grid Block
 */
function design_to_delight_register_amenities_grid_block() {
    register_block_type('design-to-delight-blocks/amenities-grid', array(
        'render_callback' => 'design_to_delight_render_amenities_grid_block',
        'attributes' => array(
            'title' => array(
                'type' => 'string',
                'default' => 'Amenities & Services'
            ),
            'amenities' => array(
                'type' => 'array',
                'default' => array(
                    array('icon' => '🪑', 'text' => 'Outdoor Seating'),
                    array('icon' => '🚗', 'text' => 'Delivery Available'),
                    array('icon' => '📦', 'text' => 'Takeaway Service'),
                    array('icon' => '🍽️', 'text' => 'Dine-in Service'),
                    array('icon' => '☕', 'text' => 'Coffee & Tea'),
                    array('icon' => '🥗', 'text' => 'Vegetarian Options'),
                )
            ),
        ),
    ));
}
add_action('init', 'design_to_delight_register_amenities_grid_block');

/**
 * Render Amenities Grid Block
 */
function design_to_delight_render_amenities_grid_block($attributes) {
    $title = isset($attributes['title']) ? $attributes['title'] : 'Amenities & Services';
    $amenities = isset($attributes['amenities']) ? $attributes['amenities'] : array();
    
    // Default amenities if none provided
    if (empty($amenities)) {
        $amenities = array(
            array('icon' => '🪑', 'text' => 'Outdoor Seating'),
            array('icon' => '🚗', 'text' => 'Delivery Available'),
            array('icon' => '📦', 'text' => 'Takeaway Service'),
            array('icon' => '🍽️', 'text' => 'Dine-in Service'),
            array('icon' => '☕', 'text' => 'Coffee & Tea'),
            array('icon' => '🥗', 'text' => 'Vegetarian Options'),
        );
    }
    
    // Allow filtering of amenities
    $amenities = apply_filters('design_to_delight_blocks_amenities', $amenities);
    
    ob_start();
    ?>
    <section class="design-to-delight-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title"><?php echo esc_html($title); ?></h2>
            </div>
            <?php if (!empty($amenities) && is_array($amenities)): ?>
                <div class="amenities-grid">
                    <?php foreach ($amenities as $amenity): ?>
                        <?php if (isset($amenity['icon']) && isset($amenity['text'])): ?>
                            <div class="amenity-item">
                                <div class="amenity-icon"><?php echo esc_html($amenity['icon']); ?></div>
                                <div class="amenity-text"><?php echo esc_html($amenity['text']); ?></div>
                            </div>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>
            <?php else: ?>
                <div style="text-align: center; padding: 60px 20px; background: #f8f9fa; border-radius: 12px;">
                    <p style="font-size: 1.2rem; color: #7f8c8d;">
                        <?php _e('No amenities configured.', 'design-to-delight-blocks'); ?>
                    </p>
                </div>
            <?php endif; ?>
        </div>
    </section>
    <?php
    return ob_get_clean();
}

/**
 * Example: How to customize amenities via filter
 * 
 * Add this code to your theme's functions.php:
 * 
 * add_filter('design_to_delight_blocks_amenities', function($amenities) {
 *     return array(
 *         array('icon' => '🍕', 'text' => 'Pizza Oven'),
 *         array('icon' => '🍷', 'text' => 'Wine Selection'),
 *         array('icon' => '👨‍👩‍👧', 'text' => 'Family Friendly'),
 *         // Add your custom amenities
 *     );
 * });
 */
