// side bar 
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

// lol
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
    
// data graph
const ctx = document.getElementById("dashboardChart").getContext("2d");

const chartDataSets = {
    users: {
        thisYear: [12000, 8000, 10000, 18000, 25000, 20000, 22000],
        lastYear: [6000, 14000, 16000, 11000, 15000, 13000, 18000],
    },
    projects: {
        thisYear: [5, 8, 12, 15, 14, 18, 20],
        lastYear: [4, 6, 10, 11, 13, 12, 16],
    },
    operations: {
        thisYear: [70, 80, 60, 75, 90, 85, 95],
        lastYear: [65, 70, 55, 60, 75, 80, 82],
    }
};
// create graph
const chartConfig = {
    type: "line",
    data: {
        labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul"],
        datasets: []
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
        legend: { display: false },
        tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "#111827",
            titleColor: "#fff",
            bodyColor: "#fff",
            padding: 16,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
            callback: (val) => val >= 1000 ? (val/1000) + "K" : val,
            color: "#9ca3af",
            font: { size: 12 }
            },
            grid: { color: "#f3f4f6" },
        },
        x: {
            ticks: { color: "#9ca3af", font: { size: 12 } },
            grid: { display: false },
        }
        },
    }
};
const dashboardChart = new Chart(ctx, chartConfig);
// update graph when click
function updateChart(type) {
    const data = chartDataSets[type];
    dashboardChart.data.datasets = [
        {
        label: "This year",
        data: data.thisYear,
        borderColor: "#111827",
        borderWidth: 2,
        tension: 0.4,
        fill: {
            target: "origin",
            above: "rgba(0,0,0,0.03)",
        },
        pointRadius: 0,
        },
        {
        label: "Last year",
        data: data.lastYear,
        borderColor: "#60a5fa",
        borderWidth: 1.5,
        borderDash: [5,5],
        tension: 0.4,
        pointRadius: 0,
        fill: false,
        }
    ];
    dashboardChart.update();
}
// (Users)
updateChart("users");

const tabs = document.querySelectorAll(".tab-btn");
tabs.forEach(btn => {
    btn.addEventListener("click", () => {

        tabs.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");
        
        updateChart(btn.dataset.type);
    });
});



