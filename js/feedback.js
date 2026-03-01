/**
 * BY RONKS Feedback Widget
 * Collects user feedback and sends to configured endpoint
 */

(function() {
    'use strict';

    // Configuration - Update this URL to your Formspree endpoint or backend
    // To use Formspree: Sign up at formspree.io, create a form, and paste the endpoint below
    const FEEDBACK_ENDPOINT = 'https://formspree.io/f/mjgedjzv';

    // DOM Elements
    const feedbackBtn = document.getElementById('feedbackBtn');
    const feedbackPanel = document.getElementById('feedbackPanel');
    const feedbackClose = document.getElementById('feedbackClose');
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackBody = document.getElementById('feedbackBody');
    const feedbackSuccess = document.getElementById('feedbackSuccess');
    const feedbackTitle = document.getElementById('feedbackTitle');
    const feedbackDesc = document.getElementById('feedbackDesc');
    const feedbackError = document.getElementById('feedbackError');
    const feedbackSubmit = document.getElementById('feedbackSubmit');
    const feedbackTypes = document.querySelectorAll('.feedback-type');

    let selectedType = 'IMPROVEMENT';
    let isSubmitting = false;

    // Open panel
    function openPanel() {
        feedbackBtn.classList.add('hidden');
        feedbackPanel.classList.add('active');
        feedbackTitle.focus();
    }

    // Close panel
    function closePanel() {
        feedbackPanel.classList.remove('active');
        feedbackBtn.classList.remove('hidden');
        resetForm();
    }

    // Reset form
    function resetForm() {
        feedbackForm.reset();
        feedbackBody.style.display = 'block';
        feedbackSuccess.style.display = 'none';
        feedbackError.style.display = 'none';
        feedbackError.textContent = '';
        selectedType = 'IMPROVEMENT';
        feedbackTypes.forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.type === 'IMPROVEMENT');
        });
    }

    // Show error
    function showError(message) {
        feedbackError.textContent = message;
        feedbackError.style.display = 'block';
    }

    // Show success
    function showSuccess() {
        feedbackBody.style.display = 'none';
        feedbackSuccess.style.display = 'block';

        // Re-render icons for success state
        if (window.lucide) {
            lucide.createIcons();
        }

        // Close after delay
        setTimeout(() => {
            closePanel();
        }, 2000);
    }

    // Submit feedback
    async function submitFeedback(data) {
        // Check if endpoint is configured
        if (FEEDBACK_ENDPOINT.includes('YOUR_FORM_ID')) {
            // Fallback: Store locally and show success
            console.log('Feedback received (no endpoint configured):', data);

            // Store in localStorage as backup
            const storedFeedback = JSON.parse(localStorage.getItem('byronks_feedback') || '[]');
            storedFeedback.push({
                ...data,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('byronks_feedback', JSON.stringify(storedFeedback));

            return { success: true };
        }

        // Send to configured endpoint
        const response = await fetch(FEEDBACK_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                type: data.type,
                title: data.title,
                description: data.description,
                pageUrl: data.pageUrl,
                _subject: `[BY RONKS] ${data.type}: ${data.title}`
            })
        });

        if (!response.ok) {
            throw new Error('Failed to submit feedback');
        }

        return { success: true };
    }

    // Event: Open panel
    feedbackBtn.addEventListener('click', openPanel);

    // Event: Close panel
    feedbackClose.addEventListener('click', closePanel);

    // Event: Click outside to close
    document.addEventListener('click', (e) => {
        if (feedbackPanel.classList.contains('active') &&
            !feedbackPanel.contains(e.target) &&
            e.target !== feedbackBtn) {
            closePanel();
        }
    });

    // Event: Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && feedbackPanel.classList.contains('active')) {
            closePanel();
        }
    });

    // Event: Type selection
    feedbackTypes.forEach(btn => {
        btn.addEventListener('click', () => {
            feedbackTypes.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedType = btn.dataset.type;
        });
    });

    // Event: Form submit
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        const title = feedbackTitle.value.trim();
        const description = feedbackDesc.value.trim();

        if (!title) {
            showError('Please enter a title');
            feedbackTitle.focus();
            return;
        }

        isSubmitting = true;
        feedbackError.style.display = 'none';
        feedbackSubmit.disabled = true;
        feedbackSubmit.innerHTML = 'Sending...';

        try {
            await submitFeedback({
                type: selectedType,
                title: title,
                description: description || undefined,
                pageUrl: window.location.href
            });

            showSuccess();
        } catch (error) {
            console.error('Feedback submission error:', error);
            showError('Failed to submit. Please try again.');
        } finally {
            isSubmitting = false;
            feedbackSubmit.disabled = false;
            feedbackSubmit.innerHTML = '<i data-lucide="send"></i> Send Feedback';
            if (window.lucide) {
                lucide.createIcons();
            }
        }
    });

    // Re-render icons after DOM is ready
    if (window.lucide) {
        lucide.createIcons();
    }
})();
