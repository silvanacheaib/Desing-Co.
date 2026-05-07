<?php
/**
 * The main template file
 * This template now uses custom blocks for content
 *
 * @package Design_To_Delight_Theme
 */

get_header();

// Display page content (which will include blocks)
if (have_posts()) :
    while (have_posts()) : the_post();
        the_content();
    endwhile;
else :
    // Fallback content if no page is set
    ?>
    <div class="section" style="padding: 80px 20px; text-align: center;">
        <div class="container">
            <h1>Welcome to <?php bloginfo('name'); ?></h1>
            <p style="font-size: 1.2rem; color: var(--text-light); margin: 2rem 0;">
                Please set up your homepage content using the Gutenberg block editor.
            </p>
            <p style="color: var(--text-light);">
                Go to <strong>Pages → Add New</strong> or edit an existing page, then use the Design to Delight blocks to build your layout.
            </p>
            <div style="margin-top: 2rem;">
                <a href="<?php echo admin_url('post-new.php?post_type=page'); ?>" class="btn btn-primary">Create Your Homepage</a>
            </div>
        </div>
    </div>
    <?php
endif;

get_footer();
