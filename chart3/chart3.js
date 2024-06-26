document.addEventListener("DOMContentLoaded", function() {
    let allData = []; // Variabel untuk menyimpan semua data dari JSON
    let currentYear = 'all'; // Variabel untuk menyimpan tahun saat ini yang dipilih, default 'all'

    const ctxCanada = document.getElementById('horizontalBarChartCanada').getContext('2d');
    const ctxUS = document.getElementById('horizontalBarChartUS').getContext('2d');
    let chartCanada = null; // Variabel untuk menyimpan objek Chart untuk Canada
    let chartUS = null; // Variabel untuk menyimpan objek Chart untuk United States

    // Function untuk membuat grafik berdasarkan data yang diberikan untuk Canada
    function createChartCanada(productNames, orderQuantities) {
        if (chartCanada) {
            chartCanada.destroy(); // Hancurkan grafik sebelumnya jika ada
        }

        chartCanada = new Chart(ctxCanada, {
            type: 'bar',
            data: {
                labels: productNames,
                datasets: [{
                    label: `Top 5 Products (Canada${currentYear !== 'all' ? ' - ' + currentYear : ''})`,
                    data: orderQuantities,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Function untuk membuat grafik berdasarkan data yang diberikan untuk United States
    function createChartUS(productNames, orderQuantities) {
        if (chartUS) {
            chartUS.destroy(); // Hancurkan grafik sebelumnya jika ada
        }

        chartUS = new Chart(ctxUS, {
            type: 'bar',
            data: {
                labels: productNames,
                datasets: [{
                    label: `Top 5 Products (United States${currentYear !== 'all' ? ' - ' + currentYear : ''})`,
                    data: orderQuantities,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Function untuk memproses dan menampilkan data untuk Canada
    function displayDataCanada() {
        // Filter data hanya untuk negara Canada
        const canadaData = allData.filter(item => item.Country === 'Canada');

        // Jika tahun dipilih, filter berdasarkan tahun
        let filteredData = canadaData;
        if (currentYear !== 'all') {
            filteredData = canadaData.filter(item => item.Year.toString() === currentYear);
        }

        // Kelompokkan berdasarkan produk dan hitung total Order_Quantity untuk setiap produk
        const productGroups = filteredData.reduce((acc, curr) => {
            if (!acc[curr.Product]) {
                acc[curr.Product] = 0;
            }
            acc[curr.Product] += curr.Order_Quantity;
            return acc;
        }, {});

        // Ubah hasil kelompokan menjadi array objek
        const productArray = Object.keys(productGroups).map(product => ({
            Product: product,
            Order_Quantity: productGroups[product]
        }));

        // Urutkan berdasarkan Order_Quantity secara descending
        productArray.sort((a, b) => b.Order_Quantity - a.Order_Quantity);

        // Ambil top 5 produk
        const top5Products = productArray.slice(0, 5);

        // Ekstrak nama produk dan jumlah pesanan
        const productNames = top5Products.map(item => item.Product);
        const orderQuantities = top5Products.map(item => item.Order_Quantity);

        // Buat grafik untuk Canada menggunakan Chart.js
        createChartCanada(productNames, orderQuantities);
    }

    // Function untuk memproses dan menampilkan data untuk United States
    function displayDataUS() {
        // Filter data hanya untuk negara United States
        const usData = allData.filter(item => item.Country === 'United States');

        // Jika tahun dipilih, filter berdasarkan tahun
        let filteredData = usData;
        if (currentYear !== 'all') {
            filteredData = usData.filter(item => item.Year.toString() === currentYear);
        }

        // Kelompokkan berdasarkan produk dan hitung total Order_Quantity untuk setiap produk
        const productGroups = filteredData.reduce((acc, curr) => {
            if (!acc[curr.Product]) {
                acc[curr.Product] = 0;
            }
            acc[curr.Product] += curr.Order_Quantity;
            return acc;
        }, {});

        // Ubah hasil kelompokan menjadi array objek
        const productArray = Object.keys(productGroups).map(product => ({
            Product: product,
            Order_Quantity: productGroups[product]
        }));

        // Urutkan berdasarkan Order_Quantity secara descending
        productArray.sort((a, b) => b.Order_Quantity - a.Order_Quantity);

        // Ambil top 5 produk
        const top5Products = productArray.slice(0, 5);

        // Ekstrak nama produk dan jumlah pesanan
        const productNames = top5Products.map(item => item.Product);
        const orderQuantities = top5Products.map(item => item.Order_Quantity);

        // Buat grafik untuk United States menggunakan Chart.js
        createChartUS(productNames, orderQuantities);
    }

    // Function untuk menampilkan data default (semua tahun) saat halaman dimuat
    function displayDefaultData() {
        displayDataCanada();
        displayDataUS();
    }

    // Event listener untuk mengubah grafik saat tahun dipilih dari dropdown
    const yearDropdown = document.getElementById('filter-year');
    yearDropdown.addEventListener('change', function() {
        currentYear = this.value; // Ambil tahun yang dipilih dari dropdown
        displayDefaultData(); // Tampilkan data berdasarkan tahun yang dipilih
    });

    // Fetch data dari JSON saat halaman dimuat
    fetch('BikeSales.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            allData = data; // Simpan semua data dari JSON
            displayDefaultData(); // Tampilkan data default saat halaman dimuat
        })
        .catch(error => console.error('Error fetching data:', error));
});
