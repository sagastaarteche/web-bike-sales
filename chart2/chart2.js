document.addEventListener("DOMContentLoaded", function () {
    fetch('BikeSales.json')
        .then(response => response.json())
        .then(data => {
            let originalData = data;

            // Memproses data default
            let usChartData = processBarChartData(data, "United States");
            let canadaChartData = processBarChartData(data, "Canada");
            let stateChartDataUS = processBarChartDataByState(data, "United States");
            let stateChartDataCanada = processBarChartDataByState(data, "Canada");

            // Membuat chart default
            createBarChart(usChartData, 'barChartUS');
            createBarChart(canadaChartData, 'barChartCanada');
            createBarChart(stateChartDataUS, 'barChartStateUS');
            createBarChart(stateChartDataCanada, 'barChartStateCanada');
        })
        .catch(error => console.error('Error fetching data:', error));
});

// Fungsi untuk memproses data berdasarkan kategori produk
function processBarChartData(data, country) {
    const productCategories = [...new Set(data.filter(item => item.Country === country).map(item => item.Product_Category))];
    const ageGroups = [...new Set(data.filter(item => item.Country === country).map(item => item.Age_Group))];

    const datasets = productCategories.map((category, index) => {
        const dataByCategory = ageGroups.map(ageGroup => {
            const totalQuantity = data.filter(item => item.Country === country && item.Product_Category === category && item.Age_Group === ageGroup)
                                      .reduce((acc, curr) => acc + parseInt(curr.Order_Quantity), 0); // Pastikan Order_Quantity di-parse ke angka
            return totalQuantity;
        });

        return {
            label: category,
            data: dataByCategory,
            backgroundColor: getBlueColor(index)
        };
    });

    return { ageGroups, datasets };
}

// Fungsi untuk memproses data berdasarkan state (top 5)
function processBarChartDataByState(data, country) {
    const stateData = data.filter(item => item.Country === country).reduce((acc, item) => {
        if (!acc[item.State]) {
            acc[item.State] = 0;
        }
        acc[item.State] += parseInt(item.Order_Quantity); // Pastikan Order_Quantity di-parse ke angka
        return acc;
    }, {});

    const sortedStates = Object.keys(stateData).sort((a, b) => stateData[b] - stateData[a]).slice(0, 5);
    const sortedQuantities = sortedStates.map(state => stateData[state]);

    return { states: sortedStates, datasets: [{ label: 'Top 5 States', data: sortedQuantities, backgroundColor: '#007bff' }] };
}

// Fungsi untuk membuat chart baru
function createBarChart(data, elementId) {
    const ctx = document.getElementById(elementId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.ageGroups || data.states,
            datasets: data.datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false, // Sembunyikan legenda
                },
                title: {
                    display: true,
                    text: ''
                }
            },
            scales: {
                x: {
                    stacked: false,
                },
                y: {
                    stacked: false,
                    beginAtZero: true
                }
            }
        }
    });
}

// Fungsi untuk mendapatkan warna biru berdasarkan index
function getBlueColor(index) {
    const blueColors = ['#0000FF', '#0080FF', '#CCCCFF', '#1E90FF'];
    return blueColors[index % blueColors.length];
}
