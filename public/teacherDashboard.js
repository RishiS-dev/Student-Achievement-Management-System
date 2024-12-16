document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("filter-form");
    const tableBody = document.getElementById("achievement-table-body");
    const pagination = document.getElementById("pagination");
    const modalDetails = document.getElementById("achievement-details");

    let currentPage = 1;

    // Fetch Data Function
    const fetchData = async (page = 1) => {
        const formData = new FormData(form);
        formData.append("page", page);

        const response = await fetch("/fetchAchievements", {
            method: "GET",
            body: formData,
        });

        const data = await response.json();
        if (data.success) {
            populateTable(data.data);
            setupPagination(data.pagination);
        }
    };

    // Populate Table
    const populateTable = (achievements) => {
        tableBody.innerHTML = achievements
            .map(
                (achievement, index) => `
                <tr data-id="${achievement._id}" data-bs-toggle="modal" data-bs-target="#achievementModal">
                    <td>${index + 1}</td>
                    <td>${achievement.username}</td>
                    <td>${achievement.achievementName}</td>
                    <td>${new Date(achievement.date).toLocaleDateString()}</td>
                    <td>${achievement.category}</td>
                </tr>`
            )
            .join("");

        // Add click listener for rows
        document.querySelectorAll("tr[data-id]").forEach((row) => {
            row.addEventListener("click", async (e) => {
                const id = row.getAttribute("data-id");
                const response = await fetch(`/getAchieve?id=${id}`);
                const data = await response.json();
                modalDetails.innerHTML = `
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</p>
                    <p><strong>Category:</strong> ${data.category}</p>
                    <p><strong>Certificate:</strong><br><img src="${data.certificate}" class="img-fluid"></p>`;
            });
        });
    };

    // Setup Pagination
    const setupPagination = (paginationData) => {
        pagination.innerHTML = "";

        for (let i = 1; i <= paginationData.totalPages; i++) {
            pagination.innerHTML += `<li class="page-item ${i === paginationData.currentPage ? "active" : ""}">
                <button class="page-link" data-page="${i}">${i}</button>
            </li>`;
        }

        document.querySelectorAll(".page-link").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                currentPage = parseInt(e.target.getAttribute("data-page"));
                fetchData(currentPage);
            });
        });
    };

    // Handle Filter Submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        currentPage = 1;
        fetchData();
    });

    // Initial Fetch
    fetchData();
});
