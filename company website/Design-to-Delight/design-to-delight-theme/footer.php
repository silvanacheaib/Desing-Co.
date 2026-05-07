</main>

<footer class="site-footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h3><?php bloginfo('name'); ?></h3>
                <p><?php bloginfo('description'); ?></p>
                <div class="social-links">
                    <?php if (get_theme_mod('facebook_url')) : ?>
                        <a href="<?php echo esc_url(get_theme_mod('facebook_url')); ?>" target="_blank" aria-label="Facebook">
                            <span>f</span>
                        </a>
                    <?php endif; ?>
                    <?php if (get_theme_mod('instagram_url')) : ?>
                        <a href="<?php echo esc_url(get_theme_mod('instagram_url')); ?>" target="_blank" aria-label="Instagram">
                            <span>📷</span>
                        </a>
                    <?php endif; ?>
                    <?php if (get_theme_mod('twitter_url')) : ?>
                        <a href="<?php echo esc_url(get_theme_mod('twitter_url')); ?>" target="_blank" aria-label="Twitter">
                            <span>𝕏</span>
                        </a>
                    <?php endif; ?>
                </div>
            </div>
            
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="<?php echo home_url('/'); ?>">Home</a></li>
                    <li><a href="<?php echo home_url('/menu'); ?>">Menu</a></li>
                    <li><a href="<?php echo home_url('/about'); ?>">About Us</a></li>
                    <li><a href="<?php echo home_url('/contact'); ?>">Contact</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>Contact Info</h3>
                <ul>
                    <li>📍 <?php echo esc_html(get_theme_mod('restaurant_address', '123 Main Street, City, State 12345')); ?></li>
                    <li>📞 <?php echo esc_html(get_theme_mod('restaurant_phone', '+1 (555) 123-4567')); ?></li>
                    <li>✉️ <?php echo esc_html(get_theme_mod('restaurant_email', 'info@restaurant.com')); ?></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>Opening Hours</h3>
                <ul>
                    <li>Monday - Thursday<br>11:00 AM - 01:00 AM</li>
                    <li>Friday - Saturday<br>11:00 AM - 02:00 AM</li>
                    <li>Sunday<br>12:00 PM - 01:00 AM</li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All Rights Reserved.</p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>

<script>
// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-navigation');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                }
            }
        });
    });
    
    // Add active class to navigation on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-navigation a[href^="#"]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
});
</script>

</body>
</html>
