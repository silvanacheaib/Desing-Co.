<?php
/**
 * Location Info Block
 * 
 * Displays restaurant location information in card format
 * 
 * @package Design_To_Delight_Blocks
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Location Info Block
 */
function design_to_delight_register_location_info_block() {
    register_block_type('design-to-delight-blocks/location-info', array(
        'render_callback' => 'design_to_delight_render_location_info_block',
        'attributes' => array(
            'title' => array(
                'type' => 'string',
                'default' => 'Visit Us'
            ),
            'address' => array(
                'type' => 'string',
                'default' => ''
            ),
            'phone' => array(
                'type' => 'string',
                'default' => ''
            ),
            'hours' => array(
                'type' => 'string',
                'default' => ''
            ),
        ),
    ));
}
add_action('init', 'design_to_delight_register_location_info_block');

/**
 * Render Location Info Block
 */
function design_to_delight_render_location_info_block($attributes) {
    $title = isset($attributes['title']) ? $attributes['title'] : 'Visit Us';
    $address = isset($attributes['address']) ? $attributes['address'] : '';
    $phone = isset($attributes['phone']) ? $attributes['phone'] : '';
    $hours = isset($attributes['hours']) ? $attributes['hours'] : '';
    
    // If no info provided, try to get from theme customizer
    if (empty($address)) {
        $address = get_theme_mod('restaurant_address', '');
    }
    if (empty($phone)) {
        $phone = get_theme_mod('restaurant_phone', '');
    }
    if (empty($hours)) {
        $hours = get_theme_mod('restaurant_hours', '');
    }
    
    ob_start();
    ?>
    <section class="design-to-delight-section" style="background: var(--bg-light);">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title"><?php echo esc_html($title); ?></h2>
            </div>
            <div class="info-cards">
                <?php if ($address): ?>
                <div class="info-card">
                    <div class="info-icon">📍</div>
                    <h3 class="info-title"><?php _e('Location', 'design-to-delight-blocks'); ?></h3>
                    <div class="info-details"><?php echo nl2br(esc_html($address)); ?></div>
                </div>
                <?php endif; ?>
                
                <?php if ($phone): ?>
                <div class="info-card">
                    <div class="info-icon">📞</div>
                    <h3 class="info-title"><?php _e('Contact', 'design-to-delight-blocks'); ?></h3>
                    <div class="info-details">
                        <a href="tel:<?php echo esc_attr(preg_replace('/[^0-9+]/', '', $phone)); ?>">
                            <?php echo esc_html($phone); ?>
                        </a>
                    </div>
                </div>
                <?php endif; ?>
                
                <?php if ($hours): ?>
                <div class="info-card">
                    <div class="info-icon">🕐</div>
                    <h3 class="info-title"><?php _e('Opening Hours', 'design-to-delight-blocks'); ?></h3>
                    <div class="info-details"><?php echo nl2br(esc_html($hours)); ?></div>
                </div>
                <?php endif; ?>
            </div>
            
            <?php if (empty($address) && empty($phone) && empty($hours)): ?>
                <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 12px;">
                    <p style="font-size: 1.2rem; color: #7f8c8d; margin-bottom: 1rem;">
                        <?php _e('No location information set.', 'design-to-delight-blocks'); ?>
                    </p>
                    <p style="color: #7f8c8d;">
                        <?php _e('Edit this block to add your address, phone, and hours.', 'design-to-delight-blocks'); ?>
                    </p>
                </div>
            <?php endif; ?>
        </div>
    </section>
    <?php
    return ob_get_clean();
}
