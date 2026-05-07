<?php
/**
 * The template for displaying single posts
 *
 * @package Design_To_Delight_Theme
 */

get_header(); ?>

<div class="section" style="padding-top: 100px;">
    <div class="container">
        <?php
        while (have_posts()) : the_post();
        ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <header class="entry-header text-center mb-3">
                    <h1 class="entry-title"><?php the_title(); ?></h1>
                    <div class="entry-meta" style="color: var(--text-light); margin-top: 1rem;">
                        <span><?php echo get_the_date(); ?></span>
                        <?php if (get_post_type() === 'menu_item') : 
                            $price = get_post_meta(get_the_ID(), 'menu_item_price', true);
                            if ($price) : ?>
                                <span style="margin-left: 1rem; font-weight: 700; color: var(--secondary-color);">$<?php echo esc_html($price); ?></span>
                            <?php endif;
                        endif; ?>
                        <?php if (get_post_type() === 'review') : 
                            $rating = get_post_meta(get_the_ID(), 'review_rating', true);
                            if ($rating) : ?>
                                <span style="margin-left: 1rem; color: var(--accent-gold);">
                                    <?php echo str_repeat('★', intval($rating)) . str_repeat('☆', 5 - intval($rating)); ?>
                                </span>
                            <?php endif;
                        endif; ?>
                    </div>
                </header>

                <?php if (has_post_thumbnail()) : ?>
                    <div class="entry-thumbnail mb-3">
                        <?php the_post_thumbnail('large', array('style' => 'border-radius: 12px; width: 100%; height: auto;')); ?>
                    </div>
                <?php endif; ?>

                <div class="entry-content" style="max-width: 800px; margin: 0 auto; line-height: 1.8;">
                    <?php
                    the_content();

                    wp_link_pages(array(
                        'before' => '<div class="page-links">' . __('Pages:', 'design-to-delight'),
                        'after' => '</div>',
                    ));
                    ?>
                </div>

                <footer class="entry-footer mt-3 text-center">
                    <a href="<?php echo esc_url(home_url('/')); ?>" class="btn btn-primary">← Back to Home</a>
                </footer>
            </article>
        <?php
        endwhile;
        ?>
    </div>
</div>

<?php get_footer(); ?>
