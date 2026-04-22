// Sample data storage (in real app, use database)
let bookings = JSON.parse(localStorage.getItem('waterBookings')) || [];
let bookingCounter = parseInt(localStorage.getItem('bookingCounter')) || 1000;

// Initialize dashboard stats
function updateDashboard() {
    const today = new Date().toDateString();
    const todayBookings = bookings.filter(b => new Date(b.deliveryDate).toDateString() === today);
    
    document.getElementById('totalBookings').textContent = todayBookings.length;
    document.getElementById('pendingBookings').textContent = todayBookings.filter(b => b.status === 'pending').length;
    document.getElementById('completedBookings').textContent = todayBookings.filter(b => b.status === 'delivered').length;
    document.getElementById('activeTankers').textContent = todayBookings.filter(b => b.status === 'enroute').length;
    
    updateRecentBookings();
}

// Update recent bookings list
function updateRecentBookings() {
    const recent = bookings.slice(-5).reverse();
    const list = document.getElementById('recentBookingsList');
    
    list.innerHTML = recent.map(booking => `
        <div class="booking-item">
            <div>
                <strong>${booking.customerName}</strong><br>
                <small>${booking.area} - ${booking.tankerSize}KL</small>
            </div>
            <div class="status-badge status-${booking.status}">
                ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </div>
        </div>
    `).join('');
}

// Smooth scroll to sections
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Booking form submission
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const booking = {
        id: `MB${++bookingCounter}`,
        customerName: document.getElementById('customerName').value,
        phone: document.getElementById('phone').value,
        area: document.getElementById('area').value,
        address: document.getElementById('address').value,
        flatNo: document.getElementById('flatNo').value,
        tankerSize: document.getElementById('tankerSize').value,
        deliveryDate: document.getElementById('deliveryDate').value,
        status: 'pending' // Default booking status
    };

    bookings.push(booking);
    
    // Save back to local storage
    localStorage.setItem('waterBookings', JSON.stringify(bookings));
    localStorage.setItem('bookingCounter', bookingCounter);
    
    // Show success message with Booking ID
    alert(`Booking Successful!\nYour Booking ID is: ${booking.id}\nPlease keep this ID to track your tanker.`);
    
    // Clear form and update dashboard stats
    e.target.reset();
    updateDashboard();
});

// Track booking details
function trackBooking() {
    const bookingId = document.getElementById('bookingIdInput').value.trim();
    const detailsContainer = document.getElementById('bookingDetails');
    
    if (!bookingId) {
        detailsContainer.innerHTML = '<p style="color: red;">Please enter a valid Booking ID.</p>';
        return;
    }
    
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
        detailsContainer.innerHTML = `
            <h3>Booking Found (${booking.id})</h3>
            <p><strong>Customer:</strong> ${booking.customerName}</p>
            <p><strong>Delivery Location:</strong> ${booking.area} - ${booking.address}, Flat No: ${booking.flatNo}</p>
            <p><strong>Tanker Size:</strong> ${booking.tankerSize} KL</p>
            <p><strong>Delivery Date:</strong> ${booking.deliveryDate}</p>
            <p><strong>Current Status:</strong> <span class="status-badge status-${booking.status}">${booking.status.toUpperCase()}</span></p>
        `;
    } else {
        detailsContainer.innerHTML = '<p style="color: red;">Booking not found. Please verify your ID.</p>';
    }
}

// Run dashboard update initially to populate the stats
document.addEventListener('DOMContentLoaded', updateDashboard);