$(document).ready(function() {
    $.getJSON('BikeSales.json', function(data) {
        var table = $('#salesTable').DataTable({
            data: data,
            paging: true,
            pagingType: "simple",
            lengthChange: true,
            searching: true,
            columns: [
                { data: 'Day' },
                { data: 'Month' },
                { data: 'Year' },
                { data: 'Customer_Age' },
                { data: 'Age_Group' },
                { data: 'Customer_Gender' },
                { data: 'Country' },
                { data: 'State' },
                { data: 'Product_Category' },
                { data: 'Sub_Category' },
                { data: 'Product' },
                { data: 'Order_Quantity' },
                { data: 'Unit_Cost' },
                { data: 'Unit_Price' },
                { data: 'Total_Cost' },
                { data: 'Revenue' },
                { data: 'Profit' }
            ],
            dom: '<"top"lf>rt<"custom-pagination">',
            initComplete: function(settings, json) {
                $('#prevBtn').on('click', function() {
                    table.page('previous').draw('page');
                });
                $('#nextBtn').on('click', function() {
                    table.page('next').draw('page');
                });
            }
        });
    });
});

const getData = async () => {
    try {
        const response = await fetch('BikeSales.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching data", error);
        throw error;
    }
}

function updateChart(data) {
    const genders = [...new Set(data.map(item => item.Customer_Gender))];
    const genderQuantities = genders.map(gender => {
        return data.filter(item => item.Customer_Gender === gender)
                   .reduce((acc, curr) => acc + curr.Order_Quantity, 0);
    });

    const backgroundColors = genders.map(gender => {
        if (gender === 'M') return 'blue';
        if (gender === 'F') return 'deeppink';
        return '#ffb703';
    });

    const ctx = document.getElementById('barchart-gender').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: genders,
            datasets: [{
                label: 'Order Quantity by gender',
                data: genderQuantities,
                backgroundColor: backgroundColors,
                borderWidth: 1
            }]
        }
    });
}

function filterCustomerGender(customerGender) {
    getData().then(data => {
        const filteredData = data.filter(item => item.Customer_Gender === customerGender);

        const existingChart = Chart.getChart("barchart-gender");
        if (existingChart) {
            existingChart.destroy();
        }

        updateChart(filteredData);
    }).catch(error => {
        console.error("Error fetching data", error);
    });
}

function handleGenderChange() {
    const selectedGender = document.getElementById("gender").value;
    if (selectedGender === "M" || selectedGender === "F") {
        filterCustomerGender(selectedGender);
    } else {
        barchartGender();
    }
}

async function initialChartRendering() {
    const jsonData = await getData();
    updateChart(jsonData);
}

function updateCountryChart(data) {
    const countries = [...new Set(data.map(item => item.Country))];
    const countryProfits = countries.map(country => {
        return data.filter(item => item.Country === country)
                   .reduce((acc, curr) => acc + curr.Profit, 0);
    });

    const ctx = document.getElementById('barchartCountry').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: countries,
            datasets: [{
                label: 'Total Profit by Country',
                data: countryProfits,
                backgroundColor: countries.map(country => {
                    if (country === 'Canada') return '#0000FF';
                    if (country === 'United States') return '#FFC0CB';
                    return '#ffb703';
                }),
                borderWidth: 1
            }]
        }
    });
}

function filterCountry(country) {
    getData().then(data => {
        const filteredData = country === "all" ? data : data.filter(item => item.Country === country);

        const existingChart = Chart.getChart("barchartCountry");
        if (existingChart) {
            existingChart.destroy();
        }

        updateCountryChart(filteredData);
    });
}

function handleCountryChange() {
    const selectedCountry = document.getElementById("country").value;
    if (selectedCountry === "Canada" || selectedCountry === "United States") {
        filterCountry(selectedCountry);
    } else {
        barchartCountry();
    }
}

function barchartGender() {
    const existingChart = Chart.getChart("barchart-gender");
    if (existingChart) {
        existingChart.destroy();
    }

    getData().then(data => {
        const genders = [...new Set(data.map(item => item.Customer_Gender))];
        const genderQuantities = genders.map(gender => {
            return data.filter(item => item.Customer_Gender === gender)
                       .reduce((acc, curr) => acc + curr.Order_Quantity, 0);
        });

        const ctx = document.getElementById('barchart-gender').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: genders,
                datasets: [{
                    label: 'Order Quantity by gender',
                    data: genderQuantities,
                    backgroundColor: genders.map(gender => {
                        if (gender === 'M') return 'blue';
                        if (gender === 'F') return 'deeppink';
                        return '#ffb703';
                    }),
                    borderWidth: 1
                }]
            }
        });
    });
}

function barchartCountry() {
    const existingChart = Chart.getChart("barchartCountry");
    if (existingChart) {
        existingChart.destroy();
    }

    getData().then(data => {
        const countries = [...new Set(data.map(item => item.Country))];
        const countryProfits = countries.map(country => {
            return data.filter(item => item.Country === country)
                       .reduce((acc, curr) => acc + curr.Profit, 0);
        });

        const ctx = document.getElementById('barchartCountry').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: countries,
                datasets: [{
                    label: 'Total Profit by Country',
                    data: countryProfits,
                    backgroundColor: countries.map(country => {
                        if (country === 'Canada') return '#0000FF';
                        if (country === 'United States') return '#FFC0CB';
                        return '#ffb703';
                    }),
                    borderWidth: 1
                }]
            }
        });
    });
}

window.onload = function() {
    barchartCountry();
    barchartGender();
}
