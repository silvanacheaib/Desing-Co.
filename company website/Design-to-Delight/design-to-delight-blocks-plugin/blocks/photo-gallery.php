<?php
/**
 * Photo Gallery Block
 * 
 * Creates a beautiful image gallery with hover effects.
 * Upload multiple images through the WordPress media library.
 * 
 * Features:
 * - Responsive grid layout
 * - Hover overlay effect
 * - Lazy loading for better performance
 * - Customizable title and description
 * 
 * Perfect for: Restaurant photos, food gallery, ambiance showcase
 * 
 * @package Design_To_Delight_Blocks
 */

// Security: Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Photo Gallery Block
 */
function design_to_delight_register_photo_gallery_block() {
    register_block_type('design-to-delight-blocks/photo-gallery', array(
        'render_callback' => 'design_to_delight_render_photo_gallery_block',
        'attributes' => array(
            // Gallery title
            'title' => array(
                'type' => 'string',
                'default' => 'Gallery'
            ),
            // Gallery description
            'description' => array(
                'type' => 'string',
                'default' => 'Take a visual tour'
            ),
            // Array of image objects
            // Each image object has: { url: 'image.jpg', alt: 'description' }
            'images' => array(
                'type' => 'array',
                'default' => array()         // Empty array = no images
            ),
        ),
    ));
}
add_action('init', 'design_to_delight_register_photo_gallery_block');

/**
 * Render Photo Gallery Block
 * 
 * Displays all uploaded images in a responsive grid.
 * 
 * @param array $attributes Block settings including images array
 * @return string HTML output
 */
function design_to_delight_render_photo_gallery_block($attributes) {
    
    // STEP 1: Extract block settings
    // ================================
    $title = isset($attributes['title']) ? $attributes['title'] : 'Gallery';
    $description = isset($attributes['description']) ? $attributes['description'] : 'Take a visual tour';
    
    // Get the images array (each image has 'url' and 'alt' properties)
    $images = isset($attributes['images']) ? $attributes['images'] : array();
    
    // STEP 2: Generate HTML
    // ======================
    
    ob_start();
    ?>
    
    <!-- Main section (with light background) -->
    <section class="design-to-delight-section" style="background: var(--bg-light);">
        <div class="container">
            
            <!-- Section header -->
            <div class="section-header">
                <h2 class="section-title"><?php echo esc_html($title); ?></h2>
                <?php if ($description): ?>
                    <p class="section-description"><?php echo esc_html($description); ?></p>
                <?php endif; ?>
            </div>
            
            <?php if (!empty($images) && is_array($images)): ?>
                <!-- Gallery grid (only shows if images exist) -->
                <div class="photo-gallery">
                    <?php 
                    // Loop through each image
                    foreach ($images as $image): 
                        // Make sure image has a URL
                        if (isset($image['url'])): 
                    ?>
                        
                        <!-- Individual gallery item -->
                        <div class="gallery-item">
                            <!-- The actual image -->
                            <img src="<?php echo esc_url($image['url']); ?>" 
                                 alt="<?php echo isset($image['alt']) ? esc_attr($image['alt']) : ''; ?>"
                                 loading="lazy">
                            
                            <!-- Hover overlay (shows camera icon on hover) -->
                            <div class="gallery-overlay">
                                <span>📷</span>
                            </div>
                        </div>
                        
                    <?php 
                        endif; 
                    endforeach; 
                    ?>
                </div>
                
            <?php else: ?>
                <!-- Empty state: No images uploaded yet -->
                <div style="text-align: center; padding: 60px 20px; background: #f8f9fa; border-radius: 12px;">
                    <p style="font-size: 1.2rem; color: #7f8c8d; margin-bottom: 1rem;">
                        <?php _e('No images in gallery.', 'design-to-delight-blocks'); ?>
                    </p>
                    <p style="color: #7f8c8d;">
                        <?php _e('Edit this block and click "Add Images" to select gallery photos.', 'design-to-delight-blocks'); ?>
                    </p>
                </div>
            <?php endif; ?>
            
        </div>
    </section>
    
    <?php
    return ob_get_clean();
}

/**
 * HOW TO USE:
 * ===========
 * 
 * 1. Add the Photo Gallery block to your page
 * 2. In the sidebar, click "Add Images"
 * 3. Select multiple images from your media library
 * 4. Click "Create Gallery"
 * 5. Images will appear in a responsive grid
 * 
 * IMAGE TIPS:
 * ===========
 * - Use square images (800x800px) for best results
 * - Optimize images before uploading (compress them)
 * - Add descriptive alt text for accessibility
 * - Recommended: 6-12 images for visual balance
 * 
 * STYLING NOTES:
 * ==============
 * - Gallery uses CSS Grid for responsive layout
 * - Hover effect shows camera icon overlay
 * - Images have lazy loading for better performance
 * - Grid automatically adjusts columns based on screen size
 * 
 * ADVANCED CUSTOMIZATION:
 * =======================
 * 
 * Change image sizes in CSS:
 * .gallery-item img {
 *     width: 100%;
 *     height: 300px;  // Change this
 *     object-fit: cover;
 * }
 * 
 * Change number of columns:
 * .photo-gallery {
 *     grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
 *                                                      ^^^ Change this
 * }
 * 
 * Add lightbox functionality:
 * - Install a lightbox plugin (e.g., Simple Lightbox)
 * - Or add custom JavaScript for lightbox effect
 */
