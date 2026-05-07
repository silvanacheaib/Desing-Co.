<?php
/**
 * Reviews Grid Block
 * 
 * This block displays customer reviews in a responsive grid layout.
 * Reviews are pulled from the "Reviews" custom post type.
 * 
 * Features:
 * - Star rating display (1-5 stars)
 * - Customer name and date
 * - Review text
 * - Adjustable number of reviews to show
 * - Sorted by most recent first
 * 
 * Perfect for: Homepage testimonials, reviews page
 * 
 * @package Design_To_Delight_Blocks
 */

// Security: Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Reviews Grid Block
 * 
 * Tells WordPress about this block and its configuration.
 */
function design_to_delight_register_reviews_grid_block() {
    register_block_type('design-to-delight-blocks/reviews-grid', array(
        // Function to generate HTML
        'render_callback' => 'design_to_delight_render_reviews_grid_block',
        
        // Block settings
        'attributes' => array(
            // Section title
            'title' => array(
                'type' => 'string',
                'default' => 'What Customers Say'
            ),
            // How many reviews to display
            'itemsPerPage' => array(
                'type' => 'number',
                'default' => 6              // Show 6 reviews by default
            ),
        ),
    ));
}
// Register when WordPress initializes
add_action('init', 'design_to_delight_register_reviews_grid_block');

/**
 * Render Reviews Grid Block
 * 
 * Queries the database for reviews and displays them in cards.
 * 
 * @param array $attributes Block settings
 * @return string HTML output
 */
function design_to_delight_render_reviews_grid_block($attributes) {
    
    // STEP 1: Get block settings
    // ============================
    $title = isset($attributes['title']) ? $attributes['title'] : 'What Customers Say';
    $itemsPerPage = isset($attributes['itemsPerPage']) ? intval($attributes['itemsPerPage']) : 6;
    
    // STEP 2: Query database for reviews
    // ====================================
    
    // Set up query parameters
    $args = array(
        'post_type' => 'review',            // Get Review posts
        'posts_per_page' => $itemsPerPage,  // Limit number
        'orderby' => 'date',                // Sort by date
        'order' => 'DESC'                   // Newest first (DESC = descending)
    );
    
    // Allow developers to customize the query
    // Example: Show only 5-star reviews
    $args = apply_filters('design_to_delight_blocks_reviews_query_args', $args);
    
    // Execute the database query
    $review_query = new WP_Query($args);
    
    // STEP 3: Generate HTML output
    // =============================
    
    ob_start(); // Start capturing HTML
    ?>
    
    <!-- Main section container -->
    <section class="design-to-delight-section">
        <div class="container">
            
            <!-- Section title -->
            <div class="section-header">
                <h2 class="section-title"><?php echo esc_html($title); ?></h2>
            </div>
            
            <!-- Grid of review cards -->
            <div class="reviews-grid">
                <?php
                // Check if we have any reviews
                if ($review_query->have_posts()) :
                    
                    // Loop through each review
                    while ($review_query->have_posts()) : $review_query->the_post();
                        
                        // Get the star rating from custom field (1-5)
                        $rating = get_post_meta(get_the_ID(), 'review_rating', true);
                        
                        // Convert to integer, default to 5 if not set
                        $stars = $rating ? intval($rating) : 5;
                ?>
                    
                    <!-- Individual review card -->
                    <div class="review-card">
                        
                        <!-- Header: Name and Date -->
                        <div class="review-header">
                            <!-- Customer name (from post title) -->
                            <div class="reviewer-name"><?php the_title(); ?></div>
                            
                            <!-- Review date -->
                            <div class="review-date"><?php echo get_the_date(); ?></div>
                        </div>
                        
                        <!-- Star rating display -->
                        <div class="review-rating">
                            <?php
                            // Generate star display
                            // str_repeat('★', $stars) = filled stars (e.g., "★★★★★")
                            // str_repeat('☆', 5 - $stars) = empty stars (e.g., "☆")
                            // Result: "★★★★☆" for 4 stars
                            echo str_repeat('★', $stars) . str_repeat('☆', 5 - $stars);
                            ?>
                        </div>
                        
                        <!-- Review text/content -->
                        <div class="review-text">
                            <?php the_content(); ?>
                        </div>
                        
                    </div>
                    
                <?php
                    endwhile;
                    
                    // Reset query to prevent conflicts with other queries
                    wp_reset_postdata();
                    
                else :
                    // No reviews found - show helpful message
                    ?>
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: #f8f9fa; border-radius: 12px;">
                        <p style="font-size: 1.2rem; color: #7f8c8d; margin-bottom: 1rem;">
                            <?php _e('No reviews found.', 'design-to-delight-blocks'); ?>
                        </p>
                        <p style="color: #7f8c8d;">
                            <?php _e('Go to Reviews → Add New to create your first review.', 'design-to-delight-blocks'); ?>
                        </p>
                    </div>
                    <?php
                endif;
                ?>
            </div>
            
        </div>
    </section>
    
    <?php
    // Return the captured HTML
    return ob_get_clean();
}

/**
 * CUSTOMIZATION EXAMPLES:
 * =======================
 * 
 * 1. Show only 5-star reviews:
 *    Add to theme's functions.php:
 * 
 *    add_filter('design_to_delight_blocks_reviews_query_args', function($args) {
 *        $args['meta_query'] = array(
 *            array(
 *                'key' => 'review_rating',
 *                'value' => '5',
 *                'compare' => '='
 *            )
 *        );
 *        return $args;
 *    });
 * 
 * 2. Show only reviews with 4+ stars:
 *    add_filter('design_to_delight_blocks_reviews_query_args', function($args) {
 *        $args['meta_query'] = array(
 *            array(
 *                'key' => 'review_rating',
 *                'value' => '4',
 *                'compare' => '>='
 *            )
 *        );
 *        return $args;
 *    });
 * 
 * 3. Randomize review order:
 *    add_filter('design_to_delight_blocks_reviews_query_args', function($args) {
 *        $args['orderby'] = 'rand';
 *        return $args;
 *    });
 * 
 * TIPS:
 * - Review names come from the post title
 * - Review text comes from the post content
 * - Star rating is stored in custom field 'review_rating'
 * - Date format can be changed in WordPress Settings → General
 */
