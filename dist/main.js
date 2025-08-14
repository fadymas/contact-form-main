/**
 * ================================================
 * Form Validation & UI Feedback
 * ================================================
 * Features:
 * - Uses JustValidate for form validation
 * - Optimized for performance by caching DOM queries
 * - Helper functions to avoid repeating logic
 * - Real-time visual feedback for user input
 */

// ===== Cache DOM Elements =====
const form = document.querySelector('#form');
const inputs = document.querySelectorAll('input, textarea');
const alertBox = document.querySelector('.alert');
const queryGroups = document.querySelectorAll('.query-group');
const formTerms = document.querySelector('.form__terms');

// ===== Initialize JustValidate =====
const validator = new JustValidate(form);

/**
 * ================================================
 * Helper Functions: Error Styling
 * ================================================
 */

/**
 * Apply error styling to input or radio
 * @param {HTMLElement} element
 */
function applyErrorStyle(element) {
    if (element.type === 'radio') {
        element.classList.add('radio-error');
    } else {
        element.classList.add('form-error-container');
    }
}

/**
 * Remove error styling from input or radio
 * @param {HTMLElement} element
 */
function removeErrorStyle(element) {
    if (element.type === 'radio') {
        element.classList.remove('radio-error');
    } else {
        element.classList.remove('form-error-container');
    }
}

/**
 * Real-time input validation handler
 * @param {Event} e
 */
function handleInputEvent(e) {
    const el = e.currentTarget;
    if (el.validity.valid || el.checked) {
        removeErrorStyle(el);
    } else {
        applyErrorStyle(el);
    }
}

/**
 * ================================================
 * Attach Validation Rules
 * ================================================
 */
validator
    .addField('#first-name', [{ rule: 'required' }])
    .addField('#last-name', [{ rule: 'required' }])
    .addField('#email', [
        { rule: 'required' },
        { rule: 'email', errorMessage: 'Please enter a valid email address' },
    ])
    .addRequiredGroup('fieldset') // Requires at least one radio selected
    .addField('#message', [
        { rule: 'required' },
        {
            rule: 'minLength',
            value: 10,
            errorMessage: 'Message must be at least 10 characters',
        },
    ])
    .addField('#terms', [
        {
            rule: 'required',
            errorMessage:
                'To submit this form, please consent to being contacted',
        },
    ]);

/**
 * ================================================
 * Validator Event Handlers
 * ================================================
 */

/**
 * Called when validation fails
 */
function handleValidationFail() {
    inputs.forEach(input => {
        if (!input.validity.valid || input.type === 'radio') {
            applyErrorStyle(input);
        }
        // Attach live validation on input
        input.addEventListener('input', handleInputEvent);
    });
}

/**
 * Called when validation passes
 */
function handleValidationSuccess() {
    inputs.forEach(removeErrorStyle);
    showSuccessAlert();
}

// Bind validator events
validator.onFail(handleValidationFail);
validator.onSuccess(handleValidationSuccess);

/**
 * ================================================
 * Success Alert Handler
 * ================================================
 */
function showSuccessAlert() {
    if (validator.isValid === true) {
        // Show success dialog
        alertBox.classList.remove('opacity-0', '-top-25');
        alertBox.classList.add('top-6');
        alertBox.setAttribute('aria-haspopup', 'dialog');
        alertBox.focus();

        // Hide after 3 seconds
        setTimeout(() => {
            alertBox.classList.add('opacity-0', '-top-25');
            alertBox.classList.remove('top-6');
            alertBox.setAttribute('aria-haspopup', 'false');
        }, 3000);
    }
}

/**
 * ================================================
 * Accessibility: Keyboard Interaction
 * ================================================
 */

// Allow selecting radio via Enter or Space
queryGroups.forEach(group => {
    group.addEventListener('keydown', e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const input = e.currentTarget.querySelector('input');
        input.checked = true;
    });
});

// Allow toggling checkbox via Enter or Space
formTerms.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const input = e.currentTarget.querySelector('input');
    input.checked = !input.checked;
});
