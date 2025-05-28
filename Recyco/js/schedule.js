// Current step tracking
let currentStep = 1;
const totalSteps = 4;

// DOM Elements
const form = document.getElementById('scheduleForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressSteps = document.querySelectorAll('.progress-step');
const progressLines = document.querySelectorAll('.progress-line');

// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
    updateNavigationButtons();
    initializeCalendar();
    setupWeightInput();
    setupLocationTypeToggle();
    updatePriceSummary();
});

// Navigation functions
function nextStep() {
    if (currentStep < totalSteps && validateCurrentStep()) {
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        currentStep++;
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
        updateProgress();
        updateNavigationButtons();
        updateSummary();
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        currentStep--;
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
        updateProgress();
        updateNavigationButtons();
    }
}

function updateProgress() {
    progressSteps.forEach((step, idx) => {
        if (idx + 1 < currentStep) {
            step.classList.add('completed');
            step.classList.add('active');
        } else if (idx + 1 === currentStep) {
            step.classList.remove('completed');
            step.classList.add('active');
        } else {
            step.classList.remove('completed');
            step.classList.remove('active');
        }
    });

    progressLines.forEach((line, idx) => {
        if (idx + 1 < currentStep) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });
}

function updateNavigationButtons() {
    prevBtn.style.display = currentStep === 1 ? 'none' : 'flex';
    
    if (currentStep === totalSteps) {
        nextBtn.textContent = 'Schedule Pickup';
        nextBtn.onclick = submitForm;
    } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
        nextBtn.onclick = nextStep;
    }
}

// Validation functions
function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            return validateWasteDetails();
        case 2:
            return validateLocation();
        case 3:
            return validateSchedule();
        default:
            return true;
    }
}

function validateWasteDetails() {
    const wasteTypes = document.querySelectorAll('input[name="wasteType"]:checked');
    const weight = document.getElementById('weight').value;
    
    if (wasteTypes.length === 0) {
        showError('Please select at least one type of waste');
        return false;
    }
    
    if (!weight || weight < 1) {
        showError('Please enter a valid weight');
        return false;
    }
    
    return true;
}

function validateLocation() {
    const locationType = document.querySelector('input[name="locationType"]:checked');
    
    if (!locationType) {
        showError('Please select a location type');
        return false;
    }
    
    if (locationType.value === 'manual') {
        const street = document.getElementById('street').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        
        if (!street || !city || !state) {
            showError('Please fill in all address fields');
            return false;
        }
    }
    
    return true;
}

function validateSchedule() {
    const selectedDate = document.querySelector('.calendar-day.selected');
    const selectedTime = document.querySelector('input[name="timeSlot"]:checked');
    
    if (!selectedDate) {
        showError('Please select a pickup date');
        return false;
    }
    
    if (!selectedTime) {
        showError('Please select a time slot');
        return false;
    }
    
    return true;
}

// Calendar functions
function initializeCalendar() {
    const calendar = document.getElementById('calendarGrid');
    const currentDate = new Date();
    const currentMonth = document.getElementById('currentMonth');
    
    // Set current month display
    currentMonth.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    // Generate calendar days
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    
    // Clear existing calendar
    calendar.innerHTML = '';
    
    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day disabled';
        calendar.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Disable past dates
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        if (date < new Date().setHours(0,0,0,0)) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.onclick = () => selectDate(dayElement);
        }
        
        calendar.appendChild(dayElement);
    }
}

function selectDate(element) {
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
    });
    element.classList.add('selected');
}

// Weight input functions
function setupWeightInput() {
    const weightInput = document.getElementById('weight');
    
    function adjustWeight(amount) {
        let currentWeight = parseInt(weightInput.value) || 0;
        currentWeight = Math.max(1, Math.min(100, currentWeight + amount));
        weightInput.value = currentWeight;
        updatePriceSummary();
    }
    
    // Add event listeners to weight adjustment buttons
    document.querySelectorAll('.weight-btn').forEach(btn => {
        btn.onclick = () => adjustWeight(btn.textContent === '+' ? 1 : -1);
    });
    
    weightInput.addEventListener('change', updatePriceSummary);
}

// Location type toggle
function setupLocationTypeToggle() {
    const locationOptions = document.querySelectorAll('input[name="locationType"]');
    const manualAddress = document.getElementById('manualAddress');
    
    locationOptions.forEach(option => {
        option.addEventListener('change', () => {
            manualAddress.style.display = option.value === 'manual' ? 'block' : 'none';
        });
    });
}

// Price calculation and summary
function updatePriceSummary() {
    const basePrice = 2500; // ₦2,500 for first 5kg
    const extraWeightPrice = 300; // ₦300 per kg after 5kg
    const distanceFee = 500; // Fixed distance fee
    
    const weight = parseInt(document.getElementById('weight').value) || 0;
    const extraWeight = Math.max(0, weight - 5);
    const extraWeightFee = extraWeight * extraWeightPrice;
    
    document.getElementById('extraWeightFee').textContent = `₦${extraWeightFee.toLocaleString()}`;
    document.getElementById('totalPrice').textContent = `₦${(basePrice + extraWeightFee + distanceFee).toLocaleString()}`;
}

// Summary updates
function updateSummary() {
    if (currentStep === totalSteps) {
        // Update waste details summary
        const wasteTypes = Array.from(document.querySelectorAll('input[name="wasteType"]:checked'))
            .map(input => input.value);
        const weight = document.getElementById('weight').value;
        const notes = document.getElementById('notes').value;
        
        document.getElementById('wasteDetailsSummary').innerHTML = `
            <p><strong>Types:</strong> ${wasteTypes.join(', ')}</p>
            <p><strong>Weight:</strong> ${weight}kg</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        `;
        
        // Update location summary
        const locationType = document.querySelector('input[name="locationType"]:checked');
        let locationText = '';
        
        if (locationType.value === 'current') {
            locationText = 'Using current location';
        } else {
            const street = document.getElementById('street').value;
            const city = document.getElementById('city').value;
            const state = document.getElementById('state').value;
            const landmark = document.getElementById('landmark').value;
            
            locationText = `${street}, ${city}, ${state}${landmark ? `<br>Near: ${landmark}` : ''}`;
        }
        
        document.getElementById('locationSummary').innerHTML = `<p>${locationText}</p>`;
        
        // Update schedule summary
        const selectedDate = document.querySelector('.calendar-day.selected');
        const selectedTime = document.querySelector('input[name="timeSlot"]:checked');
        
        document.getElementById('scheduleSummary').innerHTML = `
            <p><strong>Date:</strong> ${selectedDate.textContent} ${document.getElementById('currentMonth').textContent}</p>
            <p><strong>Time:</strong> ${selectedTime.parentElement.querySelector('small').textContent}</p>
        `;
    }
}

// Form submission
async function submitForm() {
    if (validateCurrentStep()) {
        try {
            // Collect form data
            const formData = {
                wasteTypes: Array.from(document.querySelectorAll('input[name="wasteType"]:checked'))
                    .map(input => input.value),
                weight: document.getElementById('weight').value,
                notes: document.getElementById('notes').value,
                location: {
                    type: document.querySelector('input[name="locationType"]:checked').value,
                    street: document.getElementById('street')?.value,
                    city: document.getElementById('city')?.value,
                    state: document.getElementById('state')?.value,
                    landmark: document.getElementById('landmark')?.value
                },
                schedule: {
                    date: document.querySelector('.calendar-day.selected')?.textContent,
                    month: document.getElementById('currentMonth')?.textContent,
                    timeSlot: document.querySelector('input[name="timeSlot"]:checked')?.value
                },
                pricing: {
                    basePrice: 2500,
                    extraWeightFee: parseInt(document.getElementById('extraWeightFee').textContent.replace('₦', '').replace(',', '')),
                    distanceFee: 500,
                    total: parseInt(document.getElementById('totalPrice').textContent.replace('₦', '').replace(',', ''))
                }
            };

            // Here the backend API call would be made
            // This is just a placeholder - backend team will provide the actual API endpoint
            const response = await fetch('/api/schedule-pickup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to schedule pickup');
            }

            const data = await response.json();
            
            // Store tracking ID in localStorage for use in payment page
            if (data.trackingId) {
                localStorage.setItem('currentTrackingId', data.trackingId);
            }

            // Show success message with tracking ID
            alert(`Pickup scheduled successfully!\nYour tracking ID is: ${data.trackingId}\nProceeding to payment...`);
            
            // Redirect to payment page
            window.location.href = `payment.html?tracking=${data.trackingId}`;
        } catch (error) {
            console.error('Error scheduling pickup:', error);
            showError('Failed to schedule pickup. Please try again.');
        }
    }
}

// Error handling
function showError(message) {
    // You can implement a more sophisticated error display system
    alert(message);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style); 