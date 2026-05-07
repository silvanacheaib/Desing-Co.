<?php
/**
 * The template for displaying pages
 *
 * @package Design_To_Delight_Theme
 */

get_header(); ?>

<div class="section" style="padding-top: 100px; min-height: 60vh;">
    <div class="container">
        <?php
        while (have_posts()) : the_post();
        ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <header class="entry-header text-center mb-3">
                    <h1 class="entry-title"><?php the_title(); ?></h1>
                </header>

                <?php if (has_post_thumbnail()) : ?>
                    <div class="entry-thumbnail mb-3">
                        <?php the_post_thumbnail('large', array('style' => 'border-radius: 12px; width: 100%; height: auto; max-width: 100%;')); ?>
                    </div>
                <?php endif; ?>

                <div class="entry-content" style="max-width: 900px; margin: 0 auto; line-height: 1.8;">
                    <?php
                    the_content();

                    wp_link_pages(array(
                        'before' => '<div class="page-links">' . __('Pages:', 'design-to-delight'),
                        'after' => '</div>',
                    ));
                    ?>
                </div>
            </article>
        <?php
        endwhile;
        ?>
    </div>
</div>

<?php get_footer(); ?>
