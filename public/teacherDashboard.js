document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('achievement-table-body');
    const pagination = document.getElementById('pagination');
    const modalDetails = document.getElementById('achievement-details');

    function loadAchievements(filters = {}, page = 1) {
      const params = new URLSearchParams({ ...filters, page }).toString();
      fetch(`/staff/fetchAchievements?${params}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            tableBody.innerHTML = data.data.map((achievement, index) => `
              <tr data-id="${achievement._id}">
                <td>${index + 1}</td>
                <td>${achievement.rollNumber}</td>
                <td>${achievement.achievementName}</td>
                <td>${new Date(achievement.date).toLocaleDateString()}</td>
                <td>${achievement.category}</td>
              </tr>
            `).join('');
            
            pagination.innerHTML = Array.from({ length: data.pagination.totalPages }, (_, i) => `
              <li class="page-item ${i + 1 === data.pagination.currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i + 1}">${i + 1}</a>
              </li>
            `).join('');
          }
        });
    }

    tableBody.addEventListener('click', e => {
      const row = e.target.closest('tr');
      if (row) {
        const id = row.dataset.id;
        fetch(`/staff/achievement/${id}`)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              modalDetails.innerHTML = `
                <p><strong>Name:</strong> ${data.data.achievementName}</p>
                <p><strong>Roll Number:</strong> ${data.data.rollNumber}</p>
                <p><strong>Date:</strong> ${new Date(data.data.date).toLocaleDateString()}</p>
                <p><strong>Category:</strong> ${data.data.category}</p>
                <p><strong>Level:</strong> ${data.data.level}</p>
                <p><strong>Position:</strong> ${data.data.position}</p>
                <p><strong>Description:</strong> ${data.data.description || 'N/A'}</p>
                <img src="/${data.data.certificate}" alt="Certificate" class="certificate-img">
              `;
              new bootstrap.Modal(document.getElementById('achievementModal')).show();
            }
          });
      }
    });

    document.getElementById('filter-form').addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const filters = Object.fromEntries(formData.entries());
      loadAchievements(filters);
    });

    pagination.addEventListener('click', e => {
      const pageLink = e.target.closest('.page-link');
      if (pageLink) {
        e.preventDefault();
        const page = parseInt(pageLink.dataset.page, 10);
        loadAchievements({}, page);
      }
    });

    loadAchievements();
  });