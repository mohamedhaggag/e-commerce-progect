// Chart.js Example
const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
        label: 'Monthly Sales',
        data: [1200, 1500, 1300, 1700, 2100, 1900, 2500],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
        }]
    },
    options: {
        plugins: { legend: { display: false } },
        scales: {
        y: { beginAtZero: true, grid: { color: '#e5e7eb' } },
        x: { grid: { color: '#f3f4f6' } }
        }
    }
});
// sidebar.js
// Sidebar Toggle for Mobile
const toggleBtn = document.getElementById("toggleSidebarBtn");
const sidebar = document.getElementById("sidebar");
const main = document.querySelector(".main-content");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    main.classList.toggle("expanded");
});
