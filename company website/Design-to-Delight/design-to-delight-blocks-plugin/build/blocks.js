/**
 * Design to Delight Blocks - Gutenberg Block Definitions
 */

(function(blocks, element, editor, components, i18n) {
    const { registerBlockType } = blocks;
    const { createElement: el, Fragment } = element;
    const { InspectorControls, MediaUpload, RichText, URLInput } = editor;
    const { PanelBody, TextControl, TextareaControl, Button, RangeControl } = components;
    const { __ } = i18n;

    // Helper function to create icon
    const createIcon = (emoji) => el('span', { style: { fontSize: '24px' } }, emoji);

    /**
     * Hero Section Block
     */
    registerBlockType('design-to-delight-blocks/hero-section', {
        title: __('Hero Section', 'design-to-delight-blocks'),
        icon: createIcon('🎯'),
        category: 'design-to-delight-restaurant',
        attributes: {
            title: { type: 'string', default: '' },
            subtitle: { type: 'string', default: '' },
            backgroundImage: { type: 'string', default: '' },
            rating: { type: 'string', default: '4.1' },
            reviewCount: { type: 'string', default: '1103' },
            primaryButtonText: { type: 'string', default: 'View Menu' },
            primaryButtonLink: { type: 'string', default: '#menu' },
            secondaryButtonText: { type: 'string', default: 'Get Directions' },
            secondaryButtonLink: { type: 'string', default: '#location' },
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            
            return el(Fragment, {},
                el(InspectorControls, {},
                    el(PanelBody, { title: __('Hero Settings', 'design-to-delight-blocks'), initialOpen: true },
                        el(TextControl, {
                            label: __('Title', 'design-to-delight-blocks'),
                            value: attributes.title,
                            onChange: (value) => setAttributes({ title: value })
                        }),
                        el(TextareaControl, {
                            label: __('Subtitle', 'design-to-delight-blocks'),
                            value: attributes.subtitle,
                            onChange: (value) => setAttributes({ subtitle: value })
                        }),
                        el(TextControl, {
                            label: __('Rating', 'design-to-delight-blocks'),
                            value: attributes.rating,
                            onChange: (value) => setAttributes({ rating: value })
                        }),
                        el(TextControl, {
                            label: __('Review Count', 'design-to-delight-blocks'),
                            value: attributes.reviewCount,
                            onChange: (value) => setAttributes({ reviewCount: value })
                        }),
                        el('div', { style: { marginBottom: '16px' } },
                            el('label', { style: { display: 'block', marginBottom: '8px' } }, __('Background Image', 'design-to-delight-blocks')),
                            el(MediaUpload, {
                                onSelect: (media) => setAttributes({ backgroundImage: media.url }),
                                allowedTypes: ['image'],
                                value: attributes.backgroundImage,
                                render: ({ open }) => (
                                    attributes.backgroundImage ?
                                        el('div', {},
                                            el('img', { src: attributes.backgroundImage, style: { maxWidth: '100%', marginBottom: '8px' } }),
                                            el(Button, { onClick: open, isSecondary: true }, __('Change Image', 'design-to-delight-blocks'))
                                        ) :
                                        el(Button, { onClick: open, isPrimary: true }, __('Select Image', 'design-to-delight-blocks'))
                                )
                            })
                        )
                    ),
                    el(PanelBody, { title: __('Button Settings', 'design-to-delight-blocks'), initialOpen: false },
                        el(TextControl, {
                            label: __('Primary Button Text', 'design-to-delight-blocks'),
                            value: attributes.primaryButtonText,
                            onChange: (value) => setAttributes({ primaryButtonText: value })
                        }),
                        el(TextControl, {
                            label: __('Primary Button Link', 'design-to-delight-blocks'),
                            value: attributes.primaryButtonLink,
                            onChange: (value) => setAttributes({ primaryButtonLink: value })
                        }),
                        el(TextControl, {
                            label: __('Secondary Button Text', 'design-to-delight-blocks'),
                            value: attributes.secondaryButtonText,
                            onChange: (value) => setAttributes({ secondaryButtonText: value })
                        }),
                        el(TextControl, {
                            label: __('Secondary Button Link', 'design-to-delight-blocks'),
                            value: attributes.secondaryButtonLink,
                            onChange: (value) => setAttributes({ secondaryButtonLink: value })
                        })
                    )
                ),
                el('div', { className: 'design-to-delight-hero-section-editor', style: { padding: '60px 20px', background: '#2c3e50', color: 'white', textAlign: 'center', position: 'relative', minHeight: '400px' } },
                    attributes.backgroundImage && el('div', { 
                        style: { 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            right: 0, 
                            bottom: 0, 
                            backgroundImage: `url(${attributes.backgroundImage})`, 
                            backgroundSize: 'cover', 
                            backgroundPosition: 'center',
                            opacity: 0.3 
                        } 
                    }),
                    el('div', { style: { position: 'relative', zIndex: 2 } },
                        el(RichText, {
                            tagName: 'h1',
                            value: attributes.title,
                            onChange: (value) => setAttributes({ title: value }),
                            placeholder: __('Enter hero title...', 'design-to-delight-blocks'),
                            style: { color: 'white', fontSize: '3rem', marginBottom: '1rem' }
                        }),
                        el(RichText, {
                            tagName: 'p',
                            value: attributes.subtitle,
                            onChange: (value) => setAttributes({ subtitle: value }),
                            placeholder: __('Enter subtitle...', 'design-to-delight-blocks'),
                            style: { color: 'white', fontSize: '1.25rem', marginBottom: '2rem' }
                        }),
                        el('div', { style: { marginBottom: '2rem' } },
                            el('span', { style: { background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '20px' } },
                                '★★★★☆ (' + attributes.rating + ') ' + attributes.reviewCount + ' reviews'
                            )
                        ),
                        el('div', {},
                            el('span', { style: { background: '#e74c3c', padding: '12px 32px', borderRadius: '50px', marginRight: '10px', display: 'inline-block' } },
                                attributes.primaryButtonText
                            ),
                            el('span', { style: { border: '2px solid white', padding: '10px 30px', borderRadius: '50px', display: 'inline-block' } },
                                attributes.secondaryButtonText
                            )
                        )
                    )
                )
            );
        },
        save: function() {
            return null; // Dynamic block, rendered server-side
        }
    });

    /**
     * Menu Grid Block
     */
    registerBlockType('design-to-delight-blocks/menu-grid', {
        title: __('Menu Grid', 'design-to-delight-blocks'),
        icon: createIcon('🍽️'),
        category: 'design-to-delight-restaurant',
        attributes: {
            title: { type: 'string', default: 'Menu Highlights' },
            description: { type: 'string', default: 'Discover our most popular dishes' },
            itemsPerPage: { type: 'number', default: 8 }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            
            return el(Fragment, {},
                el(InspectorControls, {},
                    el(PanelBody, { title: __('Menu Grid Settings', 'design-to-delight-blocks') },
                        el(TextControl, {
                            label: __('Title', 'design-to-delight-blocks'),
                            value: attributes.title,
                            onChange: (value) => setAttributes({ title: value })
                        }),
                        el(TextControl, {
                            label: __('Description', 'design-to-delight-blocks'),
                            value: attributes.description,
                            onChange: (value) => setAttributes({ description: value })
                        }),
                        el(RangeControl, {
                            label: __('Items to Display', 'design-to-delight-blocks'),
                            value: attributes.itemsPerPage,
                            onChange: (value) => setAttributes({ itemsPerPage: value }),
                            min: 1,
                            max: 20
                        })
                    )
                ),
                el('div', { className: 'design-to-delight-menu-grid-editor', style: { padding: '40px 20px', background: '#f8f9fa', textAlign: 'center' } },
                    el('h2', { style: { fontSize: '2rem', marginBottom: '1rem' } }, attributes.title),
                    el('p', { style: { color: '#7f8c8d', marginBottom: '2rem' } }, attributes.description),
                    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' } },
                        el('div', { style: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } },
                            el('div', { style: { width: '100%', height: '150px', background: '#ddd', borderRadius: '4px', marginBottom: '10px' } }),
                            el('h3', {}, 'Menu Item'),
                            el('p', { style: { fontSize: '0.9rem', color: '#7f8c8d' } }, 'Description'),
                            el('div', { style: { color: '#e74c3c', fontWeight: 'bold' } }, '$12.99')
                        ),
                        el('div', { style: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } },
                            el('div', { style: { width: '100%', height: '150px', background: '#ddd', borderRadius: '4px', marginBottom: '10px' } }),
                            el('h3', {}, 'Menu Item'),
                            el('p', { style: { fontSize: '0.9rem', color: '#7f8c8d' } }, 'Description'),
                            el('div', { style: { color: '#e74c3c', fontWeight: 'bold' } }, '$12.99')
                        )
                    ),
                    el('p', { style: { marginTop: '20px', color: '#7f8c8d', fontStyle: 'italic' } }, 
                        __('Displaying ' + attributes.itemsPerPage + ' menu items from your Menu Items posts', 'design-to-delight-blocks')
                    )
                )
            );
        },
        save: function() {
            return null;
        }
    });

    /**
     * Reviews Grid Block
     */
    registerBlockType('design-to-delight-blocks/reviews-grid', {
        title: __('Reviews Grid', 'design-to-delight-blocks'),
        icon: createIcon('⭐'),
        category: 'design-to-delight-restaurant',
        attributes: {
            title: { type: 'string', default: 'What Customers Say' },
            itemsPerPage: { type: 'number', default: 6 }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            
            return el(Fragment, {},
                el(InspectorControls, {},
                    el(PanelBody, { title: __('Reviews Settings', 'design-to-delight-blocks') },
                        el(TextControl, {
                            label: __('Title', 'design-to-delight-blocks'),
                            value: attributes.title,
                            onChange: (value) => setAttributes({ title: value })
                        }),
                        el(RangeControl, {
                            label: __('Reviews to Display', 'design-to-delight-blocks'),
                            value: attributes.itemsPerPage,
                            onChange: (value) => setAttributes({ itemsPerPage: value }),
                            min: 1,
                            max: 20
                        })
                    )
                ),
                el('div', { className: 'design-to-delight-reviews-grid-editor', style: { padding: '40px 20px', textAlign: 'center' } },
                    el('h2', { style: { fontSize: '2rem', marginBottom: '2rem' } }, attributes.title),
                    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' } },
                        el('div', { style: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'left' } },
                            el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' } },
                                el('strong', {}, 'Customer Name'),
                                el('span', { style: { color: '#7f8c8d', fontSize: '0.9rem' } }, 'Date')
                            ),
                            el('div', { style: { color: '#f39c12', marginBottom: '10px' } }, '★★★★★'),
                            el('p', { style: { color: '#2c3e50' } }, 'Review text will appear here...')
                        ),
                        el('div', { style: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'left' } },
                            el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' } },
                                el('strong', {}, 'Customer Name'),
                                el('span', { style: { color: '#7f8c8d', fontSize: '0.9rem' } }, 'Date')
                            ),
                            el('div', { style: { color: '#f39c12', marginBottom: '10px' } }, '★★★★☆'),
                            el('p', { style: { color: '#2c3e50' } }, 'Review text will appear here...')
                        )
                    ),
                    el('p', { style: { marginTop: '20px', color: '#7f8c8d', fontStyle: 'italic' } }, 
                        __('Displaying ' + attributes.itemsPerPage + ' reviews from your Review posts', 'design-to-delight-blocks')
                    )
                )
            );
        },
        save: function() {
            return null;
        }
    });

    /**
     * Photo Gallery Block
     */
    registerBlockType('design-to-delight-blocks/photo-gallery', {
        title: __('Photo Gallery', 'design-to-delight-blocks'),
        icon: createIcon('📷'),
        category: 'design-to-delight-restaurant',
        attributes: {
            title: { type: 'string', default: 'Gallery' },
            description: { type: 'string', default: 'Take a visual tour' },
            images: { type: 'array', default: [] }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            
            return el(Fragment, {},
                el(InspectorControls, {},
                    el(PanelBody, { title: __('Gallery Settings', 'design-to-delight-blocks') },
                        el(TextControl, {
                            label: __('Title', 'design-to-delight-blocks'),
                            value: attributes.title,
                            onChange: (value) => setAttributes({ title: value })
                        }),
                        el(TextControl, {
                            label: __('Description', 'design-to-delight-blocks'),
                            value: attributes.description,
                            onChange: (value) => setAttributes({ description: value })
                        }),
                        el('div', { style: { marginTop: '16px' } },
                            el(MediaUpload, {
                                onSelect: (images) => setAttributes({ images: images.map(img => ({ url: img.url, alt: img.alt || '' })) }),
                                allowedTypes: ['image'],
                                multiple: true,
                                gallery: true,
                                value: attributes.images.map(img => img.id),
                                render: ({ open }) => el(Button, { onClick: open, isPrimary: true }, 
                                    attributes.images.length > 0 ? __('Edit Gallery (' + attributes.images.length + ' images)', 'design-to-delight-blocks') : __('Add Images', 'design-to-delight-blocks')
                                )
                            })
                        )
                    )
                ),
                el('div', { className: 'design-to-delight-gallery-editor', style: { padding: '40px 20px', background: '#f8f9fa', textAlign: 'center' } },
                    el('h2', { style: { fontSize: '2rem', marginBottom: '0.5rem' } }, attributes.title),
                    el('p', { style: { color: '#7f8c8d', marginBottom: '2rem' } }, attributes.description),
                    attributes.images.length > 0 ?
                        el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' } },
                            attributes.images.map((image, index) =>
                                el('img', { key: index, src: image.url, alt: image.alt, style: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' } })
                            )
                        ) :
                        el('div', { style: { padding: '60px', background: '#e8e8e8', borderRadius: '8px' } },
                            el('p', {}, __('Click "Add Images" in the sidebar to add gallery images', 'design-to-delight-blocks'))
                        )
                )
            );
        },
        save: function() {
            return null;
        }
    });

    /**
     * Location Info Block
     */
    registerBlockType('design-to-delight-blocks/location-info', {
        title: __('Location Info', 'design-to-delight-blocks'),
        icon: createIcon('📍'),
        category: 'design-to-delight-restaurant',
        attributes: {
            title: { type: 'string', default: 'Visit Us' },
            address: { type: 'string', default: '' },
            phone: { type: 'string', default: '' },
            hours: { type: 'string', default: '' }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            
            return el(Fragment, {},
                el(InspectorControls, {},
                    el(PanelBody, { title: __('Location Settings', 'design-to-delight-blocks') },
                        el(TextControl, {
                            label: __('Title', 'design-to-delight-blocks'),
                            value: attributes.title,
                            onChange: (value) => setAttributes({ title: value })
                        }),
                        el(TextareaControl, {
                            label: __('Address', 'design-to-delight-blocks'),
                            value: attributes.address,
                            onChange: (value) => setAttributes({ address: value }),
                            help: __('Enter your full address', 'design-to-delight-blocks')
                        }),
                        el(TextControl, {
                            label: __('Phone', 'design-to-delight-blocks'),
                            value: attributes.phone,
                            onChange: (value) => setAttributes({ phone: value })
                        }),
                        el(TextareaControl, {
                            label: __('Opening Hours', 'design-to-delight-blocks'),
                            value: attributes.hours,
                            onChange: (value) => setAttributes({ hours: value }),
                            help: __('Enter your opening hours (one per line)', 'design-to-delight-blocks')
                        })
                    )
                ),
                el('div', { className: 'design-to-delight-location-editor', style: { padding: '40px 20px', background: '#f8f9fa', textAlign: 'center' } },
                    el('h2', { style: { fontSize: '2rem', marginBottom: '2rem' } }, attributes.title),
                    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' } },
                        attributes.address && el('div', { style: { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } },
                            el('div', { style: { fontSize: '2.5rem', marginBottom: '10px' } }, '📍'),
                            el('h3', { style: { marginBottom: '10px' } }, 'Location'),
                            el('p', { style: { color: '#7f8c8d', whiteSpace: 'pre-line' } }, attributes.address)
                        ),
                        attributes.phone && el('div', { style: { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } },
                            el('div', { style: { fontSize: '2.5rem', marginBottom: '10px' } }, '📞'),
                            el('h3', { style: { marginBottom: '10px' } }, 'Contact'),
                            el('p', { style: { color: '#7f8c8d' } }, attributes.phone)
                        ),
                        attributes.hours && el('div', { style: { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } },
                            el('div', { style: { fontSize: '2.5rem', marginBottom: '10px' } }, '🕐'),
                            el('h3', { style: { marginBottom: '10px' } }, 'Opening Hours'),
                            el('p', { style: { color: '#7f8c8d', whiteSpace: 'pre-line' } }, attributes.hours)
                        )
                    )
                )
            );
        },
        save: function() {
            return null;
        }
    });

    /**
     * Amenities Grid Block
     */
    registerBlockType('design-to-delight-blocks/amenities-grid', {
        title: __('Amenities Grid', 'design-to-delight-blocks'),
        icon: createIcon('✨'),
        category: 'design-to-delight-restaurant',
        attributes: {
            title: { type: 'string', default: 'Amenities & Services' },
            amenities: { 
                type: 'array', 
                default: [
                    { icon: '🪑', text: 'Outdoor Seating' },
                    { icon: '🚗', text: 'Delivery Available' },
                    { icon: '📦', text: 'Takeaway Service' },
                    { icon: '🍽️', text: 'Dine-in Service' }
                ]
            }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            
            return el(Fragment, {},
                el(InspectorControls, {},
                    el(PanelBody, { title: __('Amenities Settings', 'design-to-delight-blocks') },
                        el(TextControl, {
                            label: __('Title', 'design-to-delight-blocks'),
                            value: attributes.title,
                            onChange: (value) => setAttributes({ title: value })
                        }),
                        el('p', { style: { marginTop: '16px', marginBottom: '8px' } }, __('Edit amenities in the block editor', 'design-to-delight-blocks'))
                    )
                ),
                el('div', { className: 'design-to-delight-amenities-editor', style: { padding: '40px 20px', textAlign: 'center' } },
                    el('h2', { style: { fontSize: '2rem', marginBottom: '2rem' } }, attributes.title),
                    el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' } },
                        attributes.amenities.map((amenity, index) =>
                            el('div', { key: index, style: { background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px' } },
                                el('span', { style: { fontSize: '1.5rem' } }, amenity.icon),
                                el('span', { style: { fontWeight: '500' } }, amenity.text)
                            )
                        )
                    ),
                    el('p', { style: { marginTop: '20px', color: '#7f8c8d', fontSize: '0.9rem' } }, 
                        __('Edit amenities in the PHP code or add a custom interface', 'design-to-delight-blocks')
                    )
                )
            );
        },
        save: function() {
            return null;
        }
    });

    /**
     * Overview Section Block
     */
    registerBlockType('design-to-delight-blocks/overview-section', {
        title: __('Overview Section', 'design-to-delight-blocks'),
        icon: createIcon('📝'),
        category: 'design-to-delight-restaurant',
        attributes: {
            title: { type: 'string', default: 'About Our Restaurant' },
            content: { type: 'string', default: '' }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            
            return el(Fragment, {},
                el(InspectorControls, {},
                    el(PanelBody, { title: __('Overview Settings', 'design-to-delight-blocks') },
                        el(TextControl, {
                            label: __('Title', 'design-to-delight-blocks'),
                            value: attributes.title,
                            onChange: (value) => setAttributes({ title: value })
                        })
                    )
                ),
                el('div', { className: 'design-to-delight-overview-editor', style: { padding: '40px 20px', background: '#f8f9fa' } },
                    el('div', { style: { maxWidth: '800px', margin: '0 auto' } },
                        el('h2', { style: { fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' } }, attributes.title),
                        el(RichText, {
                            tagName: 'div',
                            value: attributes.content,
                            onChange: (value) => setAttributes({ content: value }),
                            placeholder: __('Enter your restaurant overview text here...', 'design-to-delight-blocks'),
                            style: { lineHeight: '1.8', color: '#2c3e50' }
                        })
                    )
                )
            );
        },
        save: function() {
            return null;
        }
    });

})(
    window.wp.blocks,
    window.wp.element,
    window.wp.blockEditor || window.wp.editor,
    window.wp.components,
    window.wp.i18n
);

// Register custom block category
wp.blocks.registerBlockCategory && wp.blocks.registerBlockCategory('design-to-delight-restaurant', {
    title: 'Design to Delight',
    icon: '🍽️'
});

// If registerBlockCategory doesn't exist, use the filter method
if (!wp.blocks.registerBlockCategory) {
    wp.hooks.addFilter('blocks.registerBlockType', 'design-to-delight-blocks/custom-category', function(settings, name) {
        if (name.indexOf('design-to-delight-blocks/') === 0) {
            return Object.assign({}, settings, {
                category: 'design-to-delight-restaurant'
            });
        }
        return settings;
    });
}
