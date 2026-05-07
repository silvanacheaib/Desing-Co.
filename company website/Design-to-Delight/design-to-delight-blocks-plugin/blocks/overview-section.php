<?php
/**
 * Overview Section Block
 * 
 * Rich text content section for about information
 * 
 * @package Design_To_Delight_Blocks
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Overview Section Block
 */
function design_to_delight_register_overview_section_block() {
    register_block_type('design-to-delight-blocks/overview-section', array(
        'render_callback' => 'design_to_delight_render_overview_section_block',
        'attributes' => array(
            'title' => array(
                'type' => 'string',
                'default' => 'About Our Restaurant'
            ),
            'content' => array(
                'type' => 'string',
                'default' => ''
            ),
        ),
    ));
}
add_action('init', 'design_to_delight_register_overview_section_block');

/**
 * Render Overview Section Block
 */
function design_to_delight_render_overview_section_block($attributes) {
    $title = isset($attributes['title']) ? $attributes['title'] : 'About Our Restaurant';
    $content = isset($attributes['content']) ? $attributes['content'] : '';
    
    ob_start();
    ?>
    <section class="design-to-delight-section overview-section" style="background: var(--bg-light);">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title"><?php echo esc_html($title); ?></h2>
            </div>
            <div class="overview-content">
                <?php if ($content): ?>
                    <?php echo wp_kses_post($content); ?>
                <?php else: ?>
                    <div style="text-align: center; padding: 40px 20px; background: white; border-radius: 12px;">
                        <p style="font-size: 1.2rem; color: #7f8c8d; margin-bottom: 1rem;">
                            <?php _e('No content yet.', 'design-to-delight-blocks'); ?>
                        </p>
                        <p style="color: #7f8c8d;">
                            <?php _e('Edit this block to add your restaurant story and information.', 'design-to-delight-blocks'); ?>
                        </p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </section>
    <?php
    return ob_get_clean();
}
