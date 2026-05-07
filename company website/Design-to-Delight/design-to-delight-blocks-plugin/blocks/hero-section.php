<?php
/**
 * Hero Section Block
 * 
 * This creates a large banner section at the top of your page with:
 * - Background image
 * - Main title and subtitle
 * - Star rating display
 * - Two call-to-action buttons
 * 
 * Perfect for: Homepage hero banners, landing page headers
 * 
 * @package Design_To_Delight_Blocks
 */

// Security: Exit if accessed directly (prevents direct file access)
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Hero Section Block
 * 
 * This function tells WordPress about our block and what settings it has.
 * It runs when WordPress initializes.
 */
function design_to_delight_register_hero_section_block() {
    // Register the block with WordPress
    register_block_type('design-to-delight-blocks/hero-section', array(
        // This function will generate the HTML for the frontend
        'render_callback' => 'design_to_delight_render_hero_section_block',
        
        // Define all the editable attributes (settings) for this block
        'attributes' => array(
            // Main title text
            'title' => array(
                'type' => 'string',      // Data type: text
                'default' => ''          // Empty by default (will use site name)
            ),
            // Subtitle/description text
            'subtitle' => array(
                'type' => 'string',
                'default' => ''          // Empty by default (will use site tagline)
            ),
            // URL of the background image
            'backgroundImage' => array(
                'type' => 'string',
                'default' => ''          // No background image by default
            ),
            // Star rating number (e.g., "4.5")
            'rating' => array(
                'type' => 'string',
                'default' => '4.1'
            ),
            // Number of reviews (e.g., "1103")
            'reviewCount' => array(
                'type' => 'string',
                'default' => '1103'
            ),
            // Text for the first button
            'primaryButtonText' => array(
                'type' => 'string',
                'default' => 'View Menu'
            ),
            // URL/link for the first button
            'primaryButtonLink' => array(
                'type' => 'string',
                'default' => '#menu'     // Links to menu section on same page
            ),
            // Text for the second button
            'secondaryButtonText' => array(
                'type' => 'string',
                'default' => 'Get Directions'
            ),
            // URL/link for the second button
            'secondaryButtonLink' => array(
                'type' => 'string',
                'default' => '#location' // Links to location section on same page
            ),
        ),
    ));
}
// Hook: Run this function when WordPress initializes
add_action('init', 'design_to_delight_register_hero_section_block');

/**
 * Render Hero Section Block
 * 
 * This function generates the HTML that appears on your website.
 * It takes the settings from the editor and creates the actual hero section.
 * 
 * @param array $attributes The settings saved in the block editor
 * @return string HTML output for the hero section
 */
function design_to_delight_render_hero_section_block($attributes) {
    // STEP 1: Extract and prepare all the data
    // ==========================================
    
    // Get the title - if not set, use the site name from WordPress settings
    $title = isset($attributes['title']) && !empty($attributes['title']) 
        ? $attributes['title']           // Use custom title if provided
        : get_bloginfo('name');          // Otherwise use site name
    
    // Get the subtitle - if not set, use the site tagline
    $subtitle = isset($attributes['subtitle']) && !empty($attributes['subtitle']) 
        ? $attributes['subtitle']        // Use custom subtitle if provided
        : get_bloginfo('description');   // Otherwise use site tagline
    
    // Get background image URL (empty if not set)
    $backgroundImage = isset($attributes['backgroundImage']) ? $attributes['backgroundImage'] : '';
    
    // Get rating value (default: 4.1)
    $rating = isset($attributes['rating']) ? $attributes['rating'] : '4.1';
    
    // Get review count (default: 1103)
    $reviewCount = isset($attributes['reviewCount']) ? $attributes['reviewCount'] : '1103';
    
    // Get primary button settings
    $primaryButtonText = isset($attributes['primaryButtonText']) ? $attributes['primaryButtonText'] : 'View Menu';
    $primaryButtonLink = isset($attributes['primaryButtonLink']) ? $attributes['primaryButtonLink'] : '#menu';
    
    // Get secondary button settings
    $secondaryButtonText = isset($attributes['secondaryButtonText']) ? $attributes['secondaryButtonText'] : 'Get Directions';
    $secondaryButtonLink = isset($attributes['secondaryButtonLink']) ? $attributes['secondaryButtonLink'] : '#location';
    
    // STEP 2: Generate the HTML
    // ==========================
    
    // Start output buffering (captures all HTML output)
    ob_start();
    ?>
    
    <!-- Main hero section container -->
    <section class="design-to-delight-hero-section">
        
        <?php if ($backgroundImage): ?>
            <!-- Background image (only shows if one was uploaded) -->
            <img src="<?php echo esc_url($backgroundImage); ?>" 
                 alt="Hero Background" 
                 class="hero-background">
        <?php endif; ?>
        
        <!-- Content overlay (sits on top of background) -->
        <div class="hero-content">
            
            <!-- Main title -->
            <h1><?php echo esc_html($title); ?></h1>
            
            <!-- Subtitle/description -->
            <p><?php echo esc_html($subtitle); ?></p>
            
            <!-- Rating display -->
            <div class="hero-subtitle">
                <div class="rating">
                    <!-- Star icons (these are hardcoded, but you could make them dynamic) -->
                    <span class="stars">★★★★☆</span>
                    <!-- Rating number and review count -->
                    <span>(<?php echo esc_html($rating); ?>) <?php echo esc_html($reviewCount); ?> reviews</span>
                </div>
            </div>
            
            <!-- Call-to-action buttons -->
            <div class="hero-buttons">
                <!-- Primary button (usually more prominent styling) -->
                <a href="<?php echo esc_url($primaryButtonLink); ?>" 
                   class="btn btn-primary">
                    <?php echo esc_html($primaryButtonText); ?>
                </a>
                
                <!-- Secondary button (usually outlined/less prominent) -->
                <a href="<?php echo esc_url($secondaryButtonLink); ?>" 
                   class="btn btn-secondary">
                    <?php echo esc_html($secondaryButtonText); ?>
                </a>
            </div>
            
        </div>
    </section>
    
    <?php
    // STEP 3: Return the captured HTML
    // =================================
    // Get all the HTML we just output and return it as a string
    return ob_get_clean();
}

/**
 * CUSTOMIZATION TIPS:
 * ===================
 * 
 * 1. Change default rating stars:
 *    Find the line: <span class="stars">★★★★☆</span>
 *    Change to: <span class="stars">★★★★★</span> for 5 stars
 * 
 * 2. Add more buttons:
 *    Copy the button HTML and add your own links
 * 
 * 3. Change button styling:
 *    Edit the CSS classes: btn-primary, btn-secondary
 * 
 * 4. Make rating dynamic:
 *    Calculate star display based on $rating value
 * 
 * 5. Add animation:
 *    Add CSS classes for fade-in effects
 */
