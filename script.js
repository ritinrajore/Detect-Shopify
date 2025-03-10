 async function checkStore() {
            const urlInput = document.getElementById('store-url');
            const result = document.getElementById('result');
            const loading = document.getElementById('loading');
            let url = urlInput.value.trim().toLowerCase();

            // Reset states
            result.style.display = 'none';
            result.classList.remove('valid', 'invalid', 'warning');
            loading.style.display = 'none';

            // Check if URL is empty
            if (!url) {
                showResult('Please enter a store URL', 'warning');
                return;
            }

            // Basic URL format validation
            const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
            if (!urlPattern.test(url)) {
                showResult('❌ Invalid URL format. Please enter a valid website address (e.g., mystore.com)', 'warning');
                return;
            }

            // Add https:// if not present
            if (!url.startsWith('http')) {
                url = 'https://' + url;
            }

            loading.style.display = 'block';

            try {
                const parsedUrl = new URL(url);

                
                if (parsedUrl.hostname.includes('myshopify.com')) {
                    showResult('✓ This is a Shopify store and is compatible with Cloneify!', 'valid');
                    loading.style.display = 'none';
                    return;
                }

                try {
                    // Make a request to a CORS proxy to fetch the page content
                    const proxyUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url);
                    const response = await fetch(proxyUrl);
                    
                    if (!response.ok) {
                        showResult('❌ Unable to access this website. Please check if the URL is correct.', 'warning');
                        loading.style.display = 'none';
                        return;
                    }

                    const text = await response.text();
                    
                  
       // Check for definitive Shopify indicators
                    const shopifyIndicators = [
                        'Shopify.theme',
                        'shopify-section',
                        'shopify-payment-button',
                        '/cdn.shopify.com/',
                        'Shopify.shop',
                        '"shopify":', 
                        'shopify-buy-button',
                        'shopify.loadFeatures'
                    ];

                    const isShopify = shopifyIndicators.some(indicator => text.includes(indicator));

                    if (isShopify) {
                        showResult('✓ This is a Shopify store and is compatible with Cloneify!', 'valid');
                    } else {
                        showResult('✕ This is not a Shopify store. Cloneify only works with Shopify stores.', 'invalid');
                    }
                } catch (e) {
                    showResult('✕ This is not a Shopify store. Cloneify only works with Shopify stores.', 'invalid');
                }
            } catch (e) {
                showResult('❌ Invalid URL format. Please enter a valid website address (e.g., mystore.com)', 'warning');
            }
            
            loading.style.display = 'none';
        }

        function showResult(message, type) {
            const result = document.getElementById('result');
            result.textContent = message;
            result.classList.add(type);
            result.style.display = 'block';
        }
