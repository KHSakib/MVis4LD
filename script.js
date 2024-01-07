let parsedData;

function handleFiles() {
    const fileInput = document.getElementById('csvFileInput');
    console.log(fileInput)
    const file = fileInput.files[0];
    const dataDisplay = document.getElementById('dataDisplay');

    Papa.parse(file, {
        complete: function(results) {
            parsedData = results.data;
            console.log(parsedData)
            displayData(parsedData, dataDisplay); // Call displayData to show the table
        },
        header: true
    });
}

    const csvData = `Model,Accuracy,Precision,Recall,Auc,Score
                     RF,98.64,99.53,98.05,91.14,88.14
                     SVM,89.99,95.49,87.5,89.74,88.74
                     GaussianNB,84.05,83.55,87.26,83.11,82.45
                     LR,89.11,93.1,88.03,91.79,89.34
                     Kneighbors,86.84,90.59,86.21,84.7,85.1`;
                     console.log(csvData)

    //   Papa.parse(csvData, {
    //     complete: function(results) {
    //       const parsedData = results.data;

    //       const dataDisplay = document.getElementById('specificDataDisplay');

    //       displayData(parsedData, dataDisplay); 
    //     },
    //     header: true
    //   });

function displayData(data, dataDisplay) {
    // Create a table element to hold the data
    const table = document.createElement('table');
    table.border = '1';
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const headerRow = document.createElement('tr');

    // Add the table headers based on keys from the first row of the data
    if (data.length > 0) {
        Object.keys(data[0]).forEach(key => {
            const headerCell = document.createElement('th');
            headerCell.textContent = key;
            headerRow.appendChild(headerCell);
        });
    }
    thead.appendChild(headerRow);

    // Add the table rows
    data.forEach(row => {
        const tableRow = document.createElement('tr');
        Object.values(row).forEach(val => {
            const tableCell = document.createElement('td');
            tableCell.textContent = val;
            tableRow.appendChild(tableCell);
        });
        tbody.appendChild(tableRow);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    // Clear any previous content and append the new table
    dataDisplay.innerHTML = '';
    dataDisplay.appendChild(table);
}

document.getElementById('start').addEventListener('click', () => {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = function(event) {
        const voiceCommand = event.results[0][0].transcript.toLowerCase();
        displayCommand(voiceCommand);
        // handleVoiceCommand(voiceCommand);
        plotData(voiceCommand,convertStringToObjectArray(currentRawData));
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error', event.error);
    };
});

// function handleVoiceCommand(command) {
//     if (command.includes('change background to')) {
//         const color = command.split('change background to ')[1];
//         document.body.style.backgroundColor = color;
//     } else {
//         console.log('Command not recognized:', command);
//     }
// }

function displayCommand(command) {
    const instructionsElement = document.getElementById('instructions');
    instructionsElement.textContent = `You said: "${command}"`;
}

document.getElementById('generate_plot').addEventListener('click',()=>{
    const plotInput = document.getElementById('plotInput').value;
    plotData(plotInput,convertStringToObjectArray(currentRawData));    

})

function plotData(inputData, visualData) {
    const plotTypes = ['bar','line','scatter', 'pie'];
    const searchData = ['bar','line','scatter', 'pie', 'accuracy', 'precision', 'recall', 'auc', 'score']
    let inputs = inputData?.split(' ');

    // Filter unique values from arrayB that exist in arrayA
    const searchInput = [...new Set(inputs.filter(value => searchData.includes(value)))];

    searchInput?.forEach((data, index, array) => {
        const trimmedLowerCase = data.trim().toLowerCase();
        const capitalizedString = trimmedLowerCase.charAt(0).toUpperCase() + trimmedLowerCase.slice(1);
        array[index] = capitalizedString;
      });
            
      
    
    console.log("🚀 -------🚀")
    console.log("🚀 ~ ;",searchInput,inputData);
    console.log("🚀 -------🚀")
    


      
    const plotType = searchInput[0]?.trim().toLowerCase();
    const columns = searchInput?.slice(1).map(col => col.trim());

    const ctx = document.getElementById('myChart').getContext('2d');

    // Clear any previous chart
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    // Define a color palette
    const colors = [
        'rgba(255, 99, 132, 0.5)', // Red
        'rgba(54, 162, 235, 0.5)', // Blue
        'rgba(255, 206, 86, 0.5)',  // Yellow
        'rgba(75, 192, 192, 0.5)',  // Green
        'rgba(153, 102, 255, 0.5)', // Purple
        // Add more colors as needed
    ];

    if(plotTypes.includes(plotType)){
        // Create datasets for each column
        const datasets = columns.map((column, index) => {
            const color = colors[index % colors.length];
            return {
                label: column,
                data: visualData?.map(row => row[column]),
                backgroundColor: color,
                borderColor: color.replace('0.5', '1'),
                borderWidth: 1
            };
        });

        // Create a new chart
        window.myChart = new Chart(ctx, {
            type: plotType,
            data: {
                labels: visualData?.map(row => row[columns[0]]),
                datasets: datasets
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

}


document.getElementById('submit').addEventListener('click',()=>{
    submitForm();
})

function submitForm() {
    const selectedPlot = document.getElementById('dataset').value;

    // Get selected feature values
    const selectedFeatures = Array.from(document.querySelectorAll('.feature-section input:checked'))
        .map(checkbox => checkbox.value)
        .join(' ');

    // Concatenate the selected plot and feature values
    const resultString = `${selectedPlot} ${selectedFeatures}`;

    // Log or use the resultString as needed
    console.log('Result String:', resultString);

    plotData(resultString,convertStringToObjectArray(currentRawData));
}

// const Model = document.getElementById('model');
// Model.addEventListener('change', function(){
//     const dataDisplay = document.getElementById('specificDataDisplay');

//     displayData();
// })


let selectedModel = [];
let currentRawData;
document.addEventListener("DOMContentLoaded", function() {
    const checkboxes = document.getElementsByClassName('container')[0]
        .getElementsByClassName('sidebar')[0]
        .getElementsByClassName('dropdown')[0]
        .getElementsByClassName('model')[0]
        .getElementsByTagName('input');

    console.log('Selected checkboxes:', checkboxes);

    for (const checkbox of checkboxes) {
        checkbox.addEventListener('change', function() {
            console.log("Checkbox change event triggered");
            if (this.checked) {
                const value = this.value;
                if (!selectedModel.includes(value)) selectedModel.push(value);
                if(selectedModel?.length > 0){
                    const dataDisplay = document.getElementById('specificDataDisplay');
                    currentRawData = makeData(selectedModel,);
                    console.log(selectedModel, currentRawData);
                    displayData2(currentRawData, dataDisplay); 
                }
                // modelCheckboxSelected(this.id, this.value);
            } else {
                console.log(this.value);
                if(selectedModel.length>0){
                    const dataDisplay = document.getElementById('specificDataDisplay');
                    removeValueFromArray(selectedModel,this.value);
                    currentRawData = makeData(selectedModel);
                    displayData2(currentRawData,dataDisplay);
                }
                // modelCheckboxDeselected(this.id, this.value);
            }
        });
    }
});

function removeValueFromArray(array, valueToRemove) {
    const indexToRemove = array.indexOf(valueToRemove);
    if (indexToRemove !== -1) {
        array.splice(indexToRemove, 1);
    }
}

function makeData(selectedModel){
    const rows = csvData.split('\n');
    const filteredRows = rows.filter((row, index) => {
        if (index === 0) {
          // Include the header in the filtered rows
          return true;
        }
        const columns = row.split(',');
        const model = columns[0].trim();
        return selectedModel.includes(model);
      });
      
      const filteredCsvData = filteredRows.join('\n');
      
      return filteredCsvData;
}


function displayData2(filteredCsvData, dataDisplay) {
    // Create a table element to hold the data
    const table = document.createElement('table');
    table.border = '1';
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const rows = filteredCsvData.split('\n');

    // Add the table headers based on the first row of the filtered data
    const headerRow = document.createElement('tr');
    const headerColumns = rows[0].split(',');
    headerColumns.forEach(column => {
        const headerCell = document.createElement('th');
        headerCell.textContent = column.trim();
        headerRow.appendChild(headerCell);
    });
    thead.appendChild(headerRow);

    // Add the table rows
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(',');
        const tableRow = document.createElement('tr');
        row.forEach(val => {
            const tableCell = document.createElement('td');
            tableCell.textContent = val.trim();
            tableRow.appendChild(tableCell);
        });
        tbody.appendChild(tableRow);
    }

    table.appendChild(thead);
    table.appendChild(tbody);

    // Clear any previous content and append the new table
    dataDisplay.innerHTML = '';
    dataDisplay.appendChild(table);
}

function convertStringToObjectArray(dataString) {
    const lines = dataString.split('\n');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',');
        const obj = {};

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentLine[j].trim();
        }

        result.push(obj);
    }

    return result;
}
