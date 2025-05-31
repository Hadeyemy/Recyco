document.addEventListener('DOMContentLoaded', () => {
    const trackingForm = document.getElementById('trackingForm');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;

            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Activate selected tab
            button.classList.add('active');
            document.getElementById(`${tabName}Tab`).classList.add('active');
        });
    });

    // Tracking form submission
    if (trackingForm) {
        trackingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const trackingId = document.getElementById('trackingId').value.trim();
            
            if (!trackingId) {
                showMessage('Please enter a tracking ID', 'error');
                return;
            }

            // Here you would typically fetch tracking data from your backend
            // For demo purposes, we'll show a mock response
            showTrackingResult(trackingId);
        });
    }

    // Initialize mock real-time updates
    initializeRealTimeUpdates();
});

function showTrackingResult(trackingId) {
    // Mock tracking data
    const mockData = {
        id: trackingId,
        status: 'In Progress',
        location: 'Central Processing Facility',
        timestamp: new Date().toLocaleString(),
        eta: '45 minutes',
        updates: [
            {
                status: 'Pickup Scheduled',
                location: 'Customer Address',
                timestamp: '2 hours ago'
            },
            {
                status: 'Driver Assigned',
                location: 'Recycling Center',
                timestamp: '1 hour ago'
            },
            {
                status: 'In Transit',
                location: 'En Route to Customer',
                timestamp: '30 minutes ago'
            }
        ]
    };

    // Create and show tracking result modal
    const modal = document.createElement('div');
    modal.className = 'tracking-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Tracking Details</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="tracking-header">
                    <div class="tracking-id">
                        <strong>Tracking ID:</strong> ${mockData.id}
                    </div>
                    <div class="tracking-status">
                        <span class="status status-active">${mockData.status}</span>
                    </div>
                </div>
                <div class="current-info">
                    <p><strong>Current Location:</strong> ${mockData.location}</p>
                    <p><strong>ETA:</strong> ${mockData.eta}</p>
                </div>
                <div class="tracking-timeline">
                    ${mockData.updates.map(update => `
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <h3>${update.status}</h3>
                                <p>${update.location}</p>
                                <span class="timestamp">${update.timestamp}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Add styles
    Object.assign(modal.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    });

    // Add modal content styles
    const modalContent = modal.querySelector('.modal-content');
    Object.assign(modalContent.style, {
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
    });

    // Add close button handler
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    // Add click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Add to document
    document.body.appendChild(modal);

    // Add CSS for timeline
    const style = document.createElement('style');
    style.textContent = `
        .modal-header {
            padding: 1rem;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .modal-body {
            padding: 1.5rem;
        }
        .close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #64748b;
        }
        .tracking-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        .tracking-timeline {
            margin-top: 2rem;
        }
        .timeline-item {
            display: flex;
            gap: 1rem;
            position: relative;
            padding-bottom: 1.5rem;
        }
        .timeline-marker {
            width: 1rem;
            height: 1rem;
            background-color: #22c55e;
            border-radius: 50%;
            position: relative;
        }
        .timeline-marker::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 1rem;
            bottom: -1.5rem;
            width: 2px;
            background-color: #e2e8f0;
            transform: translateX(-50%);
        }
        .timeline-item:last-child .timeline-marker::before {
            display: none;
        }
        .timeline-content {
            flex: 1;
        }
        .timeline-content h3 {
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        .timestamp {
            font-size: 0.875rem;
            color: #64748b;
        }
    `;
    document.head.appendChild(style);
}

function initializeRealTimeUpdates() {
    // Mock real-time updates for trucks and stations
    setInterval(() => {
        // Update truck ETAs
        document.querySelectorAll('.truck-card').forEach(card => {
            const etaSpan = card.querySelector('.truck-details span:first-child');
            if (etaSpan) {
                const currentEta = parseInt(etaSpan.textContent.match(/\d+/)[0]);
                const newEta = Math.max(1, currentEta - 1);
                etaSpan.innerHTML = `<i class="fas fa-clock"></i> ETA: ${newEta} mins`;
            }
        });

        // Randomly update truck status
        if (Math.random() < 0.1) { // 10% chance each interval
            const trucks = document.querySelectorAll('.truck-card');
            const randomTruck = trucks[Math.floor(Math.random() * trucks.length)];
            const statusSpan = randomTruck?.querySelector('.status');
            if (statusSpan) {
                const isActive = statusSpan.classList.contains('status-active');
                statusSpan.classList.toggle('status-active');
                statusSpan.textContent = isActive ? 'Available' : 'En Route';
            }
        }
    }, 5000); // Update every 5 seconds
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
        backgroundColor: type === 'success' ? '#dcfce7' : '#fee2e2',
        color: type === 'success' ? '#166534' : '#991b1b',
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