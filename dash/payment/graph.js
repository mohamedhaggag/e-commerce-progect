// sidebar.js
const sidebar = document.getElementById('sidebar');
        const toggleButton = document.getElementById('toggleSidebarBtn');
        const toggleIcon = document.getElementById('toggleIcon');
        const mainContent = document.getElementById('mainContent');

        toggleButton.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
            sidebar.classList.toggle('show');
        } else {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        }

        // Change icon depending on sidebar state
        const isSidebarOpen = !sidebar.classList.contains('collapsed') && !sidebar.classList.contains('show') ? false : true;
        if (sidebar.classList.contains('show') || !sidebar.classList.contains('collapsed')) {
            toggleIcon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            toggleIcon.classList.replace('fa-xmark', 'fa-bars');
        }
        });

        // When resizing window, reset icon properly
        window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('show');
            toggleIcon.classList.replace('fa-xmark', 'fa-bars');
        }
        });

        // make link active
document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("#sidebar ul li a");

    // Loop through all sidebar links
    links.forEach((link) => {
        link.addEventListener("click", function () {
        // Remove active class from all links
        links.forEach((l) => l.classList.remove("active"));
        
        // Add active class to the clicked one
        this.classList.add("active");

        // Optional: Save state in localStorage so it stays active after reload
        localStorage.setItem("activeLink", this.getAttribute("href"));
        });
    });

    // Keep active link after reload
    const activeHref = localStorage.getItem("activeLink");
    if (activeHref) {
        links.forEach((link) => {
        if (link.getAttribute("href") === activeHref) {
            link.classList.add("active");
        }
        });
    }
    });
// garph payment
        const ctx = document.getElementById('paymentChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Credit Card', 'Paypal', 'Bank Transfer', 'Cash', 'Other'],
                datasets: [{
                label: 'Amount',
                data: [15000, 30000, 25000, 12000, 22000],
                backgroundColor: [
                    '#a4c8ff',
                    '#6af0dd', 
                    '#000000', 
                    '#b595f0',
                    '#68e48c' 
                ],
                borderRadius: 20,
                borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#333',
                    titleColor: '#fff',
                    bodyColor: '#fff'
                }
                },
                scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#9a9a9a', font: { size: 14 } }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                    color: '#9a9a9a',
                    stepSize: 10000,
                    callback: value => value === 0 ? '0' : value / 1000 + 'K'
                    },
                    grid: { color: '#eaeaea' }
                }
                }
            }
        });