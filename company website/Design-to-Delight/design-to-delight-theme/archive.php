<?php
/**
 * The template for displaying archive pages
 *
 * @package Design_To_Delight_Theme
 */

get_header(); ?>

<section class="section" style="padding-top: 100px; background: var(--bg-light);">
    <div class="container">
        <header class="page-header text-center mb-3">
            <?php
            the_archive_title('<h1 class="page-title">', '</h1>');
            the_archive_description('<div class="archive-description">', '</div>');
            ?>
        </header>

        <?php if (have_posts()) : ?>
            <div class="menu-grid">
                <?php
                while (have_posts()) : the_post();
                    $price = get_post_meta(get_the_ID(), 'menu_item_price', true);
                    $rating = get_post_meta(get_the_ID(), 'review_rating', true);
                ?>
                    <div class="menu-item">
                        <?php if (has_post_thumbnail()) : ?>
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('menu-item-thumb', array('class' => 'menu-item-image')); ?>
                            </a>
                        <?php endif; ?>
                        <div class="menu-item-content">
                            <h3 class="menu-item-title">
                                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                            </h3>
                            <p class="menu-item-description"><?php echo wp_trim_words(get_the_excerpt(), 15); ?></p>
                            
                            <?php if ($price) : ?>
                                <div class="menu-item-price">$<?php echo esc_html($price); ?></div>
                            <?php endif; ?>
                            
                            <?php if ($rating) : ?>
                                <div class="review-rating" style="margin-top: 0.5rem;">
                                    <?php echo str_repeat('★', intval($rating)) . str_repeat('☆', 5 - intval($rating)); ?>
                                </div>
                            <?php endif; ?>
                            
                            <a href="<?php the_permalink(); ?>" class="btn btn-primary" style="margin-top: 1rem; padding: 8px 20px; font-size: 0.9rem;">
                                <?php _e('View Details', 'design-to-delight'); ?>
                            </a>
                        </div>
                    </div>
                <?php endwhile; ?>
            </div>

            <div class="pagination text-center mt-3">
                <?php
                the_posts_pagination(array(
                    'mid_size' => 2,
                    'prev_text' => __('← Previous', 'design-to-delight'),
                    'next_text' => __('Next →', 'design-to-delight'),
                ));
                ?>
            </div>

        <?php else : ?>
            <div class="text-center">
                <p><?php _e('No items found.', 'design-to-delight'); ?></p>
            </div>
        <?php endif; ?>
    </div>
</section>

<?php get_footer(); ?>
