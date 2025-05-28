// Initialize EmailJS
(function() {
    // Replace with your EmailJS public key
    emailjs.init("YOUR_PUBLIC_KEY");
})();

// Form handling
const contactForm = document.getElementById('contactForm');
const submitButton = contactForm.querySelector('button[type="submit"]');
const successMessage = document.createElement('div');
successMessage.className = 'success-message';
contactForm.appendChild(successMessage);

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;

    // Prepare the template parameters
    const templateParams = {
        name: this.name.value,
        company: this.company.value,
        email: this.email.value,
        phone: this.phone.value,
        wasteType: this.wasteType.value,
        message: this.message.value
    };

    // Send the email
    // Replace with your EmailJS service ID and template ID
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
            // Show success message
            successMessage.textContent = 'Thank you! Your message has been sent successfully.';
            successMessage.classList.add('show');
            
            // Reset form
            contactForm.reset();
            
            // Reset button state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
        })
        .catch(function(error) {
            // Show error message
            successMessage.textContent = 'Sorry, there was an error sending your message. Please try again.';
            successMessage.style.backgroundColor = '#f44336';
            successMessage.classList.add('show');
            
            // Reset button state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            
            console.error('EmailJS error:', error);
        });
});

// Form validation
const inputs = contactForm.querySelectorAll('input, select, textarea');

inputs.forEach(input => {
    input.addEventListener('invalid', function(e) {
        e.preventDefault();
        this.classList.add('error');
    });

    input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            this.classList.remove('error');
        }
    });
});

// Phone number formatting
const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', function(e) {
    // Remove all non-numeric characters
    let value = this.value.replace(/\D/g, '');
    
    // Format for Nigerian phone numbers
    if (value.length > 0) {
        if (value.length <= 4) {
            value = `+234 ${value}`;
        } else if (value.length <= 7) {
            value = `+234 ${value.slice(0, 3)} ${value.slice(3)}`;
        } else {
            value = `+234 ${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 10)}`;
        }
    }
    
    this.value = value;
}); 