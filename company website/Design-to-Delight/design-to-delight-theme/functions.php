<?php
/**
 * Design to Delight Theme functions and definitions
 *
 * @package Design_To_Delight_Theme
 */

// Theme setup
function cedars_theme_setup() {
    // Add default posts and comments RSS feed links to head
    add_theme_support('automatic-feed-links');
    
    // Let WordPress manage the document title
    add_theme_support('title-tag');
    
    // Enable support for Post Thumbnails
    add_theme_support('post-thumbnails');
    
    // Set post thumbnail size
    set_post_thumbnail_size(800, 600, true);
    
    // Add additional image sizes
    add_image_size('menu-item-thumb', 400, 300, true);
    add_image_size('gallery-thumb', 500, 500, true);
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'design-to-delight'),
        'footer' => __('Footer Menu', 'design-to-delight'),
    ));
    
    // Switch default core markup to output valid HTML5
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    
    // Add theme support for custom logo
    add_theme_support('custom-logo', array(
        'height' => 100,
        'width' => 250,
        'flex-height' => true,
        'flex-width' => true,
    ));
    
    // Add support for custom backgrounds
    add_theme_support('custom-background');
    
    // Add support for editor styles
    add_theme_support('editor-styles');
    add_editor_style('editor-style.css');
}
add_action('after_setup_theme', 'cedars_theme_setup');

// Enqueue scripts and styles
function cedars_scripts() {
    // Main stylesheet
    wp_enqueue_style('cedars-style', get_stylesheet_uri(), array(), '1.0.0');
    
    // Google Fonts
    wp_enqueue_style('cedars-fonts', 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lato:wght@300;400;700&display=swap', array(), null);
    
    // Main JavaScript
    wp_enqueue_script('cedars-scripts', get_template_directory_uri() . '/assets/js/main.js', array(), '1.0.0', true);
    
    // Add inline JavaScript for smooth scrolling
    wp_add_inline_script('cedars-scripts', '
        // Intersection Observer for fade-in animations
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("fade-in");
                    }
                });
            });
            
            document.addEventListener("DOMContentLoaded", function() {
                document.querySelectorAll(".menu-item, .review-card, .info-card").forEach(el => {
                    observer.observe(el);
                });
            });
        }
    ');
}
add_action('wp_enqueue_scripts', 'cedars_scripts');

// Register widget areas
function cedars_widgets_init() {
    register_sidebar(array(
        'name' => __('Sidebar', 'design-to-delight'),
        'id' => 'sidebar-1',
        'description' => __('Add widgets here to appear in your sidebar.', 'design-to-delight'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget' => '</section>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ));
    
    register_sidebar(array(
        'name' => __('Footer Widget Area', 'design-to-delight'),
        'id' => 'footer-widgets',
        'description' => __('Appears in the footer section of the site.', 'design-to-delight'),
        'before_widget' => '<div class="footer-widget">',
        'after_widget' => '</div>',
        'before_title' => '<h3 class="widget-title">',
        'after_title' => '</h3>',
    ));
}
add_action('widgets_init', 'cedars_widgets_init');

// Register custom post types
function cedars_register_post_types() {
    // Menu Items
    register_post_type('menu_item', array(
        'labels' => array(
            'name' => __('Menu Items', 'design-to-delight'),
            'singular_name' => __('Menu Item', 'design-to-delight'),
            'add_new' => __('Add New Menu Item', 'design-to-delight'),
            'add_new_item' => __('Add New Menu Item', 'design-to-delight'),
            'edit_item' => __('Edit Menu Item', 'design-to-delight'),
            'new_item' => __('New Menu Item', 'design-to-delight'),
            'view_item' => __('View Menu Item', 'design-to-delight'),
            'search_items' => __('Search Menu Items', 'design-to-delight'),
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
            'name' => __('Reviews', 'design-to-delight'),
            'singular_name' => __('Review', 'design-to-delight'),
            'add_new' => __('Add New Review', 'design-to-delight'),
            'add_new_item' => __('Add New Review', 'design-to-delight'),
            'edit_item' => __('Edit Review', 'design-to-delight'),
            'new_item' => __('New Review', 'design-to-delight'),
            'view_item' => __('View Review', 'design-to-delight'),
            'search_items' => __('Search Reviews', 'design-to-delight'),
        ),
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-star-filled',
        'supports' => array('title', 'editor'),
        'rewrite' => array('slug' => 'reviews'),
        'show_in_rest' => true,
    ));
}
add_action('init', 'cedars_register_post_types');

// Add meta boxes for custom fields
function cedars_add_meta_boxes() {
    // Menu item price
    add_meta_box(
        'menu_item_price',
        __('Menu Item Details', 'design-to-delight'),
        'cedars_menu_item_meta_box',
        'menu_item',
        'side',
        'default'
    );
    
    // Review rating
    add_meta_box(
        'review_rating',
        __('Review Rating', 'design-to-delight'),
        'cedars_review_meta_box',
        'review',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'cedars_add_meta_boxes');

// Menu item meta box callback
function cedars_menu_item_meta_box($post) {
    wp_nonce_field('cedars_menu_item_meta_box', 'cedars_menu_item_meta_box_nonce');
    $price = get_post_meta($post->ID, 'menu_item_price', true);
    ?>
    <p>
        <label for="menu_item_price"><?php _e('Price:', 'design-to-delight'); ?></label><br>
        <input type="text" id="menu_item_price" name="menu_item_price" value="<?php echo esc_attr($price); ?>" placeholder="12.99" style="width: 100%;">
    </p>
    <?php
}

// Review meta box callback
function cedars_review_meta_box($post) {
    wp_nonce_field('cedars_review_meta_box', 'cedars_review_meta_box_nonce');
    $rating = get_post_meta($post->ID, 'review_rating', true);
    ?>
    <p>
        <label for="review_rating"><?php _e('Rating (1-5):', 'design-to-delight'); ?></label><br>
        <select id="review_rating" name="review_rating" style="width: 100%;">
            <option value="5" <?php selected($rating, '5'); ?>>5 Stars</option>
            <option value="4" <?php selected($rating, '4'); ?>>4 Stars</option>
            <option value="3" <?php selected($rating, '3'); ?>>3 Stars</option>
            <option value="2" <?php selected($rating, '2'); ?>>2 Stars</option>
            <option value="1" <?php selected($rating, '1'); ?>>1 Star</option>
        </select>
    </p>
    <?php
}

// Save meta box data
function cedars_save_meta_boxes($post_id) {
    // Menu item price
    if (isset($_POST['cedars_menu_item_meta_box_nonce']) && 
        wp_verify_nonce($_POST['cedars_menu_item_meta_box_nonce'], 'cedars_menu_item_meta_box')) {
        if (isset($_POST['menu_item_price'])) {
            update_post_meta($post_id, 'menu_item_price', sanitize_text_field($_POST['menu_item_price']));
        }
    }
    
    // Review rating
    if (isset($_POST['cedars_review_meta_box_nonce']) && 
        wp_verify_nonce($_POST['cedars_review_meta_box_nonce'], 'cedars_review_meta_box')) {
        if (isset($_POST['review_rating'])) {
            update_post_meta($post_id, 'review_rating', sanitize_text_field($_POST['review_rating']));
        }
    }
}
add_action('save_post', 'cedars_save_meta_boxes');

// Customizer settings
function cedars_customize_register($wp_customize) {
    // Restaurant Info Section
    $wp_customize->add_section('restaurant_info', array(
        'title' => __('Restaurant Information', 'design-to-delight'),
        'priority' => 30,
    ));
    
    // Address
    $wp_customize->add_setting('restaurant_address', array(
        'default' => '123 Main Street, City, State 12345',
        'sanitize_callback' => 'sanitize_textarea_field',
    ));
    $wp_customize->add_control('restaurant_address', array(
        'label' => __('Restaurant Address', 'design-to-delight'),
        'section' => 'restaurant_info',
        'type' => 'textarea',
    ));
    
    // Phone
    $wp_customize->add_setting('restaurant_phone', array(
        'default' => '+1 (555) 123-4567',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('restaurant_phone', array(
        'label' => __('Phone Number', 'design-to-delight'),
        'section' => 'restaurant_info',
        'type' => 'text',
    ));
    
    // Email
    $wp_customize->add_setting('restaurant_email', array(
        'default' => 'info@restaurant.com',
        'sanitize_callback' => 'sanitize_email',
    ));
    $wp_customize->add_control('restaurant_email', array(
        'label' => __('Email Address', 'design-to-delight'),
        'section' => 'restaurant_info',
        'type' => 'email',
    ));
    
    // Hours
    $wp_customize->add_setting('restaurant_hours', array(
        'default' => "Mon-Thu: 11:00 AM - 01:00 AM\nFri-Sat: 11:00 AM - 02:00 AM\nSun: 12:00 PM - 01:00 AM",
        'sanitize_callback' => 'sanitize_textarea_field',
    ));
    $wp_customize->add_control('restaurant_hours', array(
        'label' => __('Opening Hours', 'design-to-delight'),
        'section' => 'restaurant_info',
        'type' => 'textarea',
    ));
    
    // Social Media Section
    $wp_customize->add_section('social_media', array(
        'title' => __('Social Media', 'design-to-delight'),
        'priority' => 35,
    ));
    
    // Facebook
    $wp_customize->add_setting('facebook_url', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('facebook_url', array(
        'label' => __('Facebook URL', 'design-to-delight'),
        'section' => 'social_media',
        'type' => 'url',
    ));
    
    // Instagram
    $wp_customize->add_setting('instagram_url', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('instagram_url', array(
        'label' => __('Instagram URL', 'design-to-delight'),
        'section' => 'social_media',
        'type' => 'url',
    ));
    
    // Twitter
    $wp_customize->add_setting('twitter_url', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('twitter_url', array(
        'label' => __('Twitter URL', 'design-to-delight'),
        'section' => 'social_media',
        'type' => 'url',
    ));
}
add_action('customize_register', 'cedars_customize_register');

// Default menu fallback
function cedars_default_menu() {
    echo '<li><a href="' . home_url('/') . '">Home</a></li>';
    echo '<li><a href="#overview">About</a></li>';
    echo '<li><a href="#menu">Menu</a></li>';
    echo '<li><a href="#photos">Photos</a></li>';
    echo '<li><a href="#reviews">Reviews</a></li>';
    echo '<li><a href="#location">Location</a></li>';
}

// Custom excerpt length
function cedars_excerpt_length($length) {
    return 20;
}
add_filter('excerpt_length', 'cedars_excerpt_length');

// Custom excerpt more
function cedars_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'cedars_excerpt_more');
