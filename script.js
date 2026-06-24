document.addEventListener('DOMContentLoaded', () => {
    // --- Dark & Light Color Space Toggle Engine ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const themeText = themeToggleBtn.querySelector('span');

    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            themeIcon.className = 'fa-solid fa-moon';
            themeText.textContent = 'Dark Mode';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fa-solid fa-sun';
            themeText.textContent = 'Light Mode';
        }
    });

    // --- Core Modal UI Layout Engine ---
    const modalOverlay = document.getElementById('crud-modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalX = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const modalForm = document.getElementById('modal-form');
    const tableBody = document.getElementById('table-body');

    const toggleModalVisibility = () => modalOverlay.classList.toggle('active');

    openModalBtn.addEventListener('click', toggleModalVisibility);
    closeModalX.addEventListener('click', toggleModalVisibility);
    cancelModalBtn.addEventListener('click', toggleModalVisibility);

    // Escape click boundaries configuration
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) toggleModalVisibility();
    });

    // --- Dynamic Data Insertion Handler (CRUD Simulation) ---
    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Capture data values safely
        const name = document.getElementById('proj-name').value;
        const lead = document.getElementById('proj-lead').value;
        const status = document.getElementById('proj-status').value;
        const budget = document.getElementById('proj-budget').value;

        // Determine programmatic status badge assignment
        let badgeClass = 'progress';
        if (status === 'Completed') badgeClass = 'completed';
        if (status === 'Under Review') badgeClass = 'review';

        // Parse HTML structures natively
        const dynamicRowTemplate = `
            <tr>
                <td><strong>${name}</strong></td>
                <td>${lead}</td>
                <td><span class="status-badge ${badgeClass}">${status}</span></td>
                <td>${budget}</td>
                <td><button class="btn-icon delete-row-btn"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
        `;

        tableBody.insertAdjacentHTML('beforeend', dynamicRowTemplate);

        // Clear tracking buffer assets
        modalForm.reset();
        toggleModalVisibility();
    });

    // Event Delegation Framework to delete items cleanly
    tableBody.addEventListener('click', (e) => {
        if (e.target.closest('.delete-row-btn')) {
            const rowTarget = e.target.closest('tr');
            rowTarget.style.opacity = '0';
            rowTarget.style.transform = 'scale(0.97)';
            setTimeout(() => {
                rowTarget.remove();
            }, 250);
        }
    });
});

