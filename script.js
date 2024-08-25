let chart;  // Declare a variable to hold the chart instance

function generateHistogram() {
    // Check if a chart already exists and destroy it if it does
    if (chart) {
        chart.destroy();
    }

    // Get user input
    const dataInput = document.getElementById('dataInput').value;
    const title = document.getElementById('title').value;
    const xLabels = document.getElementById('xLabels').value;
    const yLabels = document.getElementById('yLabels').value;
    const intervals = parseInt(document.getElementById('intervals').value);
    const defaultColor = "#038225";  // Set the default color
    const colorPicker = document.getElementById('colorPicker');

    // Convert the comma-separated string into an array of numbers
    const data = dataInput.split(',').map(num => parseInt(num.trim()));

    // Calculate the min and max of the data
    const dataMin = Math.min(...data);
    const dataMax = Math.max(...data);

    // Calculate interval size
    const intervalSpan = dataMax - dataMin;
    const intervalSize = Math.ceil(intervalSpan / intervals);

    // Initialize bins list with the minimum value
    const bins = [dataMin];

    // Generate the intermediate bin edges
    for (let i = 1; i < intervals; i++) {
        bins.push(dataMin + i * intervalSize);
    }

    // Add the maximum value to the bins list
    bins.push(dataMax + 1); // Use dataMax + 1 to include the max value in the last bin

    // Create bin labels with continuous intervals
    const binLabels = [];
    for (let i = 0; i < intervals; i++) {
        const upperBound = bins[i + 1] - 1;
        binLabels.push(`${bins[i]} - ${upperBound}`);
    }

    // Calculate histogram data
    const histogramData = new Array(intervals).fill(0);
    data.forEach(value => {
        for (let i = 0; i < intervals; i++) {
            if (value >= bins[i] && value < bins[i + 1]) {  // Adjusted condition to include lower bound and exclude upper bound
                histogramData[i]++;
                break;
            }
        }
    });

    // Store the colors for each bar
    let barColors = new Array(intervals).fill(defaultColor);

    // Generate the histogram using Chart.js
    const ctx = document.getElementById('histogramCanvas').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: binLabels,
            datasets: [{
                data: histogramData,
                backgroundColor: barColors,
                borderColor: 'black',
                borderWidth: 1,
                barPercentage: 1.0,
                categoryPercentage: 1.0,
            }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: false,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 24
                    }
                },
                legend: {
                    display: false // This hides the legend entirely
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: xLabels,
                        font: {
                            size: 18
                        }
                    },
                    grid: { display: false }
                },
                y: {
                    title: {
                        display: true,
                        text: yLabels,
                        font: {
                            size: 18
                        }
                    },
                    beginAtZero: true
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    colorPicker.value = barColors[index];
                    colorPicker.click();
                    colorPicker.oninput = () => {
                        barColors[index] = colorPicker.value;
                        chart.update();
                    };
                }
            }
        }
    });
}
