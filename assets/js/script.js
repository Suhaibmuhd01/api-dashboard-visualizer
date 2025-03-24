document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
    const searchInput = document.getElementById("search");
    const tableBody = document.querySelector("#dataTable tbody");

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        function updateTable(filteredData) {
            tableBody.innerHTML = filteredData.slice(0, 10).map(coin => `
                <tr>
                    <td>${coin.name}</td>
                    <td>$${coin.current_price.toFixed(2)}</td>
                    <td style="color: ${coin.price_change_percentage_24h >= 0 ? 'green' : 'red'};">
                        ${coin.price_change_percentage_24h.toFixed(2)}%
                    </td>
                </tr>
            `).join("");
        }

        updateTable(data);

        searchInput.addEventListener("input", (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredData = data.filter(coin => coin.name.toLowerCase().includes(searchTerm));
            updateTable(filteredData);
        });

        // Chart.js
        const ctx = document.getElementById("priceChart").getContext("2d");
        new Chart(ctx, {
            type: "line",
            data: {
                labels: data.slice(0, 10).map(coin => coin.name),
                datasets: [{
                    label: "Current Price (USD)",
                    data: data.slice(0, 10).map(coin => coin.current_price),
                    borderColor: "rgba(54, 162, 235, 1)",
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    fill: true,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true
            }
        });

    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

// Theme Toggle
document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// Load Theme Preference
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}
