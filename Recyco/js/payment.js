document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('paymentForm');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const cardForm = document.getElementById('cardPaymentForm');
    const paypalForm = document.getElementById('paypalForm');

    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            // Add active class to selected method
            method.classList.add('active');

            // Show/hide appropriate form
            const selectedMethod = method.dataset.method;
            if (selectedMethod === 'card') {
                cardForm.classList.remove('hidden');
                paypalForm.classList.add('hidden');
            } else {
                cardForm.classList.add('hidden');
                paypalForm.classList.remove('hidden');
            }
        });
    });

    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = value;
        });
    }

    // Expiry date formatting
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // Form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const activeMethod = document.querySelector('.payment-method.active');
            const paymentType = activeMethod?.dataset.method;

            if (paymentType === 'paypal') {
                // Redirect to PayPal
                showMessage('Redirecting to PayPal...', 'info');
                // Simulated redirect
                setTimeout(() => {
                    showMessage('This is a demo. In production, you would be redirected to PayPal.', 'info');
                }, 2000);
                return;
            }

            // Get form data for card payment
            const formData = new FormData(paymentForm);
            const data = Object.fromEntries(formData.entries());

            // Validate form data
            if (validateForm(data)) {
                // Here you would typically send the data to your payment processor
                console.log('Payment submitted:', data);

                // Show success message
                showMessage('Payment processed successfully!', 'success');

                // Reset form
                paymentForm.reset();
            }
        });
    }
});

function validateForm(data) {
    // Card number validation
    if (!data.cardNumber?.replace(/\s/g, '').match(/^\d{16}$/)) {
        showMessage('Please enter a valid card number', 'error');
        return false;
    }

    // Expiry date validation
    if (!data.expiryDate?.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
        showMessage('Please enter a valid expiry date (MM/YY)', 'error');
        return false;
    }

    // CVV validation
    if (!data.cvv?.match(/^\d{3,4}$/)) {
        showMessage('Please enter a valid CVV', 'error');
        return false;
    }

    // Name validation
    if (!data.cardName?.trim()) {
        showMessage('Please enter the name on card', 'error');
        return false;
    }

    // Email validation
    if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showMessage('Please enter a valid email address', 'error');
        return false;
    }

    return true;
}

function showMessage(message, type = 'success') {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    // Add styles
    Object.assign(messageDiv.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem',
        borderRadius: '0.5rem',
        backgroundColor: type === 'success' ? '#dcfce7' : 
                       type === 'error' ? '#fee2e2' : '#e0f2fe',
        color: type === 'success' ? '#166534' : 
               type === 'error' ? '#991b1b' : '#075985',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        zIndex: '1000',
        maxWidth: '90%',
        animation: 'slideIn 0.3s ease-out'
    });
    
    // Add to document
    document.body.appendChild(messageDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Get all payment method radio buttons
const paymentMethods = document.querySelectorAll('input[name="payment"]');
const bankTransferDetails = document.getElementById('bankTransferDetails');
const ussdDetails = document.getElementById('ussdDetails');
const cardPaymentForm = document.getElementById('cardPaymentForm');
const paymentButton = document.getElementById('paymentButton');

// Hide all payment details sections initially
function hideAllPaymentDetails() {
    bankTransferDetails.style.display = 'none';
    ussdDetails.style.display = 'none';
    cardPaymentForm.style.display = 'none';
}

// Show selected payment method details
function showPaymentMethod(method) {
    hideAllPaymentDetails();
    switch(method) {
        case 'bank-transfer':
            bankTransferDetails.style.display = 'block';
            paymentButton.style.display = 'none';
            break;
        case 'ussd':
            ussdDetails.style.display = 'block';
            paymentButton.style.display = 'none';
            break;
        case 'card':
            cardPaymentForm.style.display = 'block';
            paymentButton.style.display = 'block';
            break;
        case 'paystack':
            paymentButton.style.display = 'block';
            break;
    }
}

// Handle payment method selection
paymentMethods.forEach(method => {
    method.addEventListener('change', (e) => {
        showPaymentMethod(e.target.value);
    });
});

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const button = document.querySelector('.btn-copy');
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Format card number input
const cardNumberInput = document.getElementById('cardNumber');
cardNumberInput?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = value.substring(0, 19);
});

// Format expiry date input
const expiryDateInput = document.getElementById('expiryDate');
expiryDateInput?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    e.target.value = value.substring(0, 5);
});

// Format CVV input
const cvvInput = document.getElementById('cvv');
cvvInput?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value.substring(0, 3);
});

// Handle payment button click
paymentButton.addEventListener('click', () => {
    const selectedMethod = document.querySelector('input[name="payment"]:checked');
    if (!selectedMethod) {
        alert('Please select a payment method');
        return;
    }

    switch(selectedMethod.value) {
        case 'card':
            // Validate card details
            if (!validateCardDetails()) {
                return;
            }
            // Process card payment
            processCardPayment();
            break;
        case 'paystack':
            // Initialize Paystack payment
            initializePaystack();
            break;
    }
});

// Validate card details
function validateCardDetails() {
    const cardNumber = cardNumberInput.value.replace(/\s/g, '');
    const expiry = expiryDateInput.value;
    const cvv = cvvInput.value;

    if (cardNumber.length !== 16) {
        alert('Please enter a valid card number');
        return false;
    }

    if (!expiry.match(/^\d{2}\/\d{2}$/)) {
        alert('Please enter a valid expiry date (MM/YY)');
        return false;
    }

    if (cvv.length !== 3) {
        alert('Please enter a valid CVV');
        return false;
    }

    return true;
}

// Process card payment
function processCardPayment() {
    // Here you would integrate with your payment processor
    alert('Processing payment... This is a demo version.');
}

// Initialize Paystack payment
function initializePaystack() {
    // Here you would initialize Paystack payment
    alert('Initializing Paystack payment... This is a demo version.');
}

// Hide all payment details initially
hideAllPaymentDetails(); 