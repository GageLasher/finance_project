const BACKEND_URL = 'http://localhost:8080/funds'
const funds = [];
let selectedFund;

// Wait for the DOM to load before making the AJAX request
document.addEventListener('DOMContentLoaded', () => {
   let xhr = new XMLHttpRequest();
   xhr.onreadystatechange = function() {
       if (xhr.readyState === 4) {
            let fundsData = JSON.parse(xhr.responseText);
            console.log(fundsData);
            fundsData.forEach(fund => addFundToTable(fund));
       }
    };
    xhr.open('GET', BACKEND_URL);
    xhr.send();
});

// Add event listener to ticker symbol input for duplicate checking
document.getElementById("ticker-symbol").addEventListener("input", (e) => {
    const ticker = e.target.value.toUpperCase();
    const errorDiv = document.getElementById("ticker-error");
    
    // Check if this ticker already exists
    const isDuplicate = funds.some(fund => fund.ticker === ticker);
    
    if (isDuplicate && ticker.length > 0) {
        e.target.style.borderColor = "red";
        e.target.style.backgroundColor = "#ffe6e6";
        errorDiv.textContent = "Duplicate ticker symbol";
        errorDiv.style.display = "block";
    } else {
        e.target.style.borderColor = "";
        e.target.style.backgroundColor = "";
        errorDiv.textContent = "";
        errorDiv.style.display = "none";
    }
});

// Add event listener to ticker symbol input for duplicate checking
document.getElementById("edit-ticker-symbol").addEventListener("input", (e) => {
    const ticker = e.target.value.toUpperCase();
    const errorDiv = document.getElementById("edit-ticker-error");
    
    // Check if this ticker already exists in another fund but not the one we're currently editing
    const isDuplicate = funds.some(fund => fund.ticker === ticker && fund.id !== selectedFund.id);
    
    if (isDuplicate && ticker.length > 0) {
        e.target.style.borderColor = "red";
        e.target.style.backgroundColor = "#ffe6e6";
        errorDiv.textContent = "Duplicate ticker symbol";
        errorDiv.style.display = "block";
    } else {
        e.target.style.borderColor = "";
        e.target.style.backgroundColor = "";
        errorDiv.textContent = "";
        errorDiv.style.display = "none";
    }
});

// Add event listener to search input for filtering funds
document.getElementById("search-input").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();

    funds.forEach((fund) => {
        const row = document.getElementById(`TR-${fund.id}`);
        const matches = fund.name.toLowerCase().includes(query) || fund.category.toLowerCase().includes(query);
        row.style.display = matches ? "" : "none";
    });
});


// Add event listener to new fund form submission
document.getElementById("new-fund-form").addEventListener("submit", (eventInfo) => {

    eventInfo.preventDefault();

    let inputData = new FormData(document.getElementById("new-fund-form"));

    const newFundToAdd = {
        name: inputData.get("fund-name"),
        ticker: inputData.get("ticker-symbol"),
        category: inputData.get("category"),
        nav: inputData.get("nav"),
        expenseRatio: inputData.get("expense-ratio"),
        manager: inputData.get("fund-manager"),
        inceptionDate: inputData.get("inception-date")
      
    }
    
    fetch(BACKEND_URL, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(newFundToAdd) 
    })
    .then((httpResponse) => {

        if(httpResponse.status === 201) {
            document.getElementById("error-alert").style.display = "none";
            return httpResponse.json();
        }
        
        showError("Failed to add fund.");
        return null;
    })
    .then((fund) => {
        console.log(fund);
        addFundToTable(fund);
        document.getElementById("new-fund-form").reset();
    })
    .catch((error) => {
    showError("An error occurred while adding the fund.");
    console.log(error);})


});


// Add event listener to update fund form submission
document.getElementById("update-fund-form").addEventListener("submit", (eventInfo) => {

    eventInfo.preventDefault();

    let inputData = new FormData(document.getElementById("update-fund-form"));
    console.log("Selected fund to post:" + selectedFund);
   const newFundToAdd = {
        id: selectedFund.id,
        name: inputData.get("edit-fund-name"),
        ticker: inputData.get("edit-ticker-symbol"),
        category: inputData.get("edit-category"),
        nav: inputData.get("edit-nav"),
        expenseRatio: inputData.get("edit-expense-ratio"),
        manager: inputData.get("edit-fund-manager"),
        inceptionDate: inputData.get("edit-inception-date")
      
    }
    
    fetch(BACKEND_URL + `/${selectedFund.id}`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(newFundToAdd)
    })
    .then((httpResponse) => {

        if(httpResponse.status === 200) {
            return httpResponse.json();
        }
        showError("Failed to edit fund.");
        return null;
    })
    .then((fund) => {

        // Update the fund in the funds array so that the search and duplicate checking work with the updated data
        const fundIndex = funds.findIndex(f => f.id === fund.id);
            if (fundIndex !== -1) {
                funds[fundIndex] = fund;
            }
        editFundInTable(fund);
        resetForms();
    })
    .catch((error) => {
        showError("Failed to edit fund.");
        console.error("ERROR OCCURED: " + error);
    })


});


// Add event listener to delete fund form submission
document.getElementById("delete-fund-form").addEventListener("submit", (eventInfo) => {

    eventInfo.preventDefault();
    if (!confirm(`Delete ${selectedFund.name} (${selectedFund.ticker})`)) {
        return;
    }
    fetch(BACKEND_URL + `/${selectedFund.id}`, { method: "DELETE" })
    .then((httpResponse) => {

        if(httpResponse.status === 204) {
            removeFundFromTable(selectedFund.id);
        }
    })
    .catch((error) => {
        showError("Failed to delete fund.");
        console.error("ERROR OCCURED: " + error);
    })
    .finally(() => {
        resetForms();
    })
});






// Helper functions for manipulating the DOM
function addFundToTable(fund) {
    
    const tableBody = document.getElementById('funds-table-body');
    const row = document.createElement('tr');
    
    // creates <td></td> for table cells
    let fundNameTD = document.createElement("td");
    let tickerTD = document.createElement("td");
    let categoryTD = document.createElement("td");
    let expenseRatioTD = document.createElement("td");
    let navTD = document.createElement("td");
    let managerTD = document.createElement("td");
    let inceptionDateTD = document.createElement("td");
    let editBtnTD = document.createElement("td");
    let delBtnTD = document.createElement("td");


    fundNameTD.innerText = fund.name;
    tickerTD.innerText = fund.ticker;
    categoryTD.innerText = fund.category;
    expenseRatioTD.innerText = fund.expenseRatio;
    navTD.innerText = fund.nav;
    managerTD.innerText = fund.manager;
    inceptionDateTD.innerText = fund.inceptionDate;


    // Color it red if expense ratio is greater than 0.5 (0.5%)
    if (fund.expenseRatio > 0.5) {
    expenseRatioTD.style.color = "red";
    expenseRatioTD.style.fontWeight = "bold";
    }


    editBtnTD.innerHTML = `<button class="btn btn-primary" onclick="activateEditForm(${fund.id})" id="EDIT-${fund.id}">Edit</button>`;
    delBtnTD.innerHTML = `<button class="btn btn-danger" onclick="activateDeleteForm(${fund.id})" id="DEL-${fund.id}">Delete</button>`;

    // put all the TDs into the TR
    row.appendChild(fundNameTD);
    row.appendChild(tickerTD);
    row.appendChild(categoryTD);
    row.appendChild(expenseRatioTD);
    row.appendChild(navTD);
    row.appendChild(managerTD);
    row.appendChild(inceptionDateTD);
    row.appendChild(editBtnTD);
    row.appendChild(delBtnTD);

    row.setAttribute("id", `TR-${fund.id}`);

    tableBody.appendChild(row);
    funds.push(fund);
}

const editFundInTable = (fund) => {

    // Color it red if expense ratio is greater than 0.5 (0.5%)
    const expenseRatioColor = fund.expenseRatio > 0.5 ? "color: red; font-weight: bold;" : "";


    document.getElementById(`TR-${fund.id}`).innerHTML = `
    <td>${fund.name}</td>
    <td>${fund.ticker}</td>
    <td>${fund.category}</td>
    <td style="${expenseRatioColor}">${fund.expenseRatio}</td>
    <td>${fund.nav}</td>
    <td>${fund.manager}</td>
    <td>${fund.inceptionDate}</td>
    <td><button class="btn btn-primary" onclick="activateEditForm(${fund.id})" id="EDIT-${fund.id}">Edit</button></td>
    <td><button class="btn btn-danger" onclick="activateDeleteForm(${fund.id})" id="DEL-${fund.id}">Delete</button></td>
    `;
}

const removeFundFromTable = (fundId) => {
    document.getElementById(`TR-${fundId}`).remove();
}


// Activate the edit form and populate it with the fund's current data
const activateEditForm = (fundId) => {
    console.log("Edit fund with id: " + fundId);
    for(let fund of funds) {
        if(fund.id === fundId) {
            selectedFund = fund;
            break;
        }
    }

    console.log(selectedFund);

    document.getElementById("update-fund-form").scrollIntoView({ behavior: "smooth", block: "center" });

    document.getElementById("edit-fund-name").value = selectedFund.name;
    document.getElementById("edit-ticker-symbol").value = selectedFund.ticker;
    document.getElementById("edit-category").value = selectedFund.category;
    document.getElementById("edit-nav").value = selectedFund.nav;
    document.getElementById("edit-expense-ratio").value = selectedFund.expenseRatio;
    document.getElementById("edit-fund-manager").value = selectedFund.manager;
    document.getElementById("edit-inception-date").value = selectedFund.inceptionDate;
    

    document.getElementById("update-fund-card").style.display = "block";
    document.getElementById("new-fund-card").style.display = "none";
    document.getElementById("delete-fund-card").style.display = "none";
}

// Activate the delete form and populate it with the fund's current data
const activateDeleteForm = (fundId) => {
    
    console.log(fundId);
    for(let fund of funds) {
        if(fund.id === fundId) {
            selectedFund = fund;
            break;
        }
    }

    console.log(selectedFund);

    document.getElementById("delete-fund-form").scrollIntoView({ behavior: "smooth", block: "center" });

    document.getElementById("delete-fund-name").value = selectedFund.name;
    document.getElementById("delete-ticker-symbol").value = selectedFund.ticker;
    document.getElementById("delete-category").value = selectedFund.category;
    document.getElementById("delete-nav").value = selectedFund.nav;
    document.getElementById("delete-expense-ratio").value = selectedFund.expenseRatio;
    document.getElementById("delete-fund-manager").value = selectedFund.manager;
    document.getElementById("delete-inception-date").value = selectedFund.inceptionDate;

    document.getElementById("update-fund-card").style.display = "none";
    document.getElementById("new-fund-card").style.display = "none";
    document.getElementById("delete-fund-card").style.display = "block";
}


// Reset forms and show the new fund form
const resetForms = () => {

    document.getElementById("new-fund-card").style.display = "block";
    document.getElementById("update-fund-card").style.display = "none";
    document.getElementById("delete-fund-card").style.display = "none";
}


// Show error message in alert box
const showError = (message) => {
    const alertBox = document.getElementById("error-alert");
    alertBox.textContent = message;
    alertBox.style.display = "block";
}