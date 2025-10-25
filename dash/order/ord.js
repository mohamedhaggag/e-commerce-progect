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
            // search
            const searchInput = document.getElementById('searchInput');
            const table = document.getElementById('ordertable');
            const rows = table.getElementsByTagName('tr');

            document.getElementById('searchForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const filter = searchInput.value.toLowerCase();
            for (let i = 1; i < rows.length; i++) {
                const name = rows[i].cells[1].textContent.toLowerCase();
                const email = rows[i].cells[2].textContent.toLowerCase();
                if (name.includes(filter) || email.includes(filter)) {
                rows[i].style.display = '';
                } else {
                rows[i].style.display = 'none';
                }
            }
            });

            // delete
            document.querySelectorAll('.btn-sm').forEach(button => {
                button.addEventListener('click', function () {
                    const row = this.closest('tr');
                    row.remove();
                });
                });