document.addEventListener("DOMContentLoaded", function () {
    fetch('BikeSales.json')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched Data:', data);

            let originalData = data;

            // Initialize charts for Canada
            let barChartCanada = createBarChart(processBarChartData(data, "Canada"), 'bardCanadaChart');
            let pieChartCanada = createPieChart(processPieChartData(data, "Canada"), 'pieCanadaChart');
            let lineChartCanada = createLineChart(processLineChartData(data, "Canada"), 'lineCanadaChart');

            // Initialize charts for United States
            let barChartUS = createBarChart(processBarChartData(data, "United States"), 'bardUSChart');
            let pieChartUS = createPieChart(processPieChartData(data, "United States"), 'pieUSChart');
            let lineChartUS = createLineChart(processLineChartData(data, "United States"), 'lineUSChart');

            // Event listeners for filters
            document.getElementById('filter-category').addEventListener('change', function () {
                applyFilters(originalData, barChartCanada, barChartUS, pieChartCanada, pieChartUS, lineChartCanada, lineChartUS);
            });

            document.getElementById('filter-season').addEventListener('change', function () {
                applyFilters(originalData, barChartCanada, barChartUS, pieChartCanada, pieChartUS, lineChartCanada, lineChartUS);
            });

            function applyFilters(data, barChartCanada, barChartUS, pieChartCanada, pieChartUS, lineChartCanada, lineChartUS) {
                const categoryFilter = document.getElementById('filter-category').value;
                const seasonFilter = document.getElementById('filter-season').value;

                let filteredData = data;

                if (seasonFilter !== 'season') {
                    filteredData = data.filter(item => item.Year === parseInt(seasonFilter));
                }

                if (categoryFilter === 'asc') {
                    filteredData.sort((a, b) => a.Order_Quantity - b.Order_Quantity);
                } else if (categoryFilter === 'desc') {
                    filteredData.sort((a, b) => b.Order_Quantity - a.Order_Quantity);
                }

                // Update Canada charts
                updateChart(barChartCanada, processBarChartData(filteredData, "Canada"));
                updateChart(pieChartCanada, processPieChartData(filteredData, "Canada"));
                updateChart(lineChartCanada, processLineChartData(filteredData, "Canada"));

                // Update United States charts
                updateChart(barChartUS, processBarChartData(filteredData, "United States"));
                updateChart(pieChartUS, processPieChartData(filteredData, "United States"));
                updateChart(lineChartUS, processLineChartData(filteredData, "United States"));
            }

            function updateChart(chart, data) {
                chart.data = data;
                chart.update();
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});

function processBarChartData(data, country) {
    const categories = {};
    data.forEach(item => {
        if (item.Country === country) {
            const year = item.Year;
            const category = item.Product_Category;
            const orderQuantity = item.Order_Quantity;

            if (!categories[category]) {
                categories[category] = {};
            }

            if (!categories[category][year]) {
                categories[category][year] = 0;
            }

            categories[category][year] += orderQuantity;
        }
    });

    const years = [...new Set(data.filter(item => item.Country === country).map(item => item.Year))].sort((a, b) => a - b);
    const datasets = Object.keys(categories).map((category, index) => {
        return {
            label: category,
            data: years.map(year => categories[category][year] || 0),
            backgroundColor: getBlueColor(index)
        };
    });

    return { labels: years, datasets };
}

function processPieChartData(data, country) {
    const genders = {};
    data.forEach(item => {
        if (item.Country === country) {
            const gender = item.Customer_Gender;
            const orderQuantity = item.Order_Quantity;

            if (!genders[gender]) {
                genders[gender] = 0;
            }

            genders[gender] += orderQuantity;
        }
    });

    const labels = Object.keys(genders);
    const quantities = Object.values(genders);

    return {
        labels,
        datasets: [{
            data: quantities,
            backgroundColor: ['#4169E1', '#FFC0CB', '#1E90FF', '#FF69B4', '#00BFFF', '#FF1493', '#6495ED']
        }]
    };
}

function processLineChartData(data, country) {
    const ageGroups = {};
    data.forEach(item => {
        if (item.Country === country) {
            const year = item.Year;
            const ageGroup = item.Age_Group;
            const orderQuantity = item.Order_Quantity;

            if (!ageGroups[ageGroup]) {
                ageGroups[ageGroup] = {};
            }

            if (!ageGroups[ageGroup][year]) {
                ageGroups[ageGroup][year] = 0;
            }

            ageGroups[ageGroup][year] += orderQuantity;
        }
    });

    const years = [...new Set(data.filter(item => item.Country === country).map(item => item.Year))].sort((a, b) => a - b);
    const datasets = Object.keys(ageGroups).map((ageGroup, index) => {
        return {
            label: ageGroup,
            data: years.map(year => ageGroups[ageGroup][year] || 0),
            borderColor: getBlueColor(index),
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
        };
    });

    return { labels: years, datasets };
}

function createBarChart(data, elementId) {
    const ctx = document.getElementById(elementId).getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createPieChart(data, elementId) {
    const ctx = document.getElementById(elementId).getContext('2d');
    return new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return data.labels[tooltipItem.dataIndex] + ': ' + data.datasets[0].data[tooltipItem.dataIndex];
                        }
                    }
                }
            },
            datasets: [{
                backgroundColor: ['#4169E1', '#FFC0CB', '#1E90FF', '#FF69B4', '#00BFFF', '#FF1493', '#6495ED']
            }]
        }
    });
}

function createLineChart(data, elementId) {
    const ctx = document.getElementById(elementId).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getBlueColor(index) {
    const blueColors = ['#0000FF', '#0080FF', '#CCCCFF', '#1E90FF'];
    return blueColors[index % blueColors.length];
}

function getBlueColors(count) {
    const blueColors = ['#0000FF', '#0000CC', '#000099', '#1E90FF'];
    return Array.from({ length: count }, (_, i) => blueColors[i % blueColors.length]);
}
