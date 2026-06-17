const BACKEND_URL = 'http://localhost:8080/funds'
const funds = [];
let selectedFund;


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

            return httpResponse.json();
        }
        return null;
    })
    .then((fund) => {
        console.log(fund);
        addFundToTable(fund);
    })
    .catch((error) => {
       
     console.log(error);})


});

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
        return null;
    })
    .then((fund) => {
        editFundInTable(fund);
        resetForms();
    })
    .catch((error) => {
        console.error("ERROR OCCURED: " + error);
    })


});


document.getElementById("delete-fund-form").addEventListener("submit", (eventInfo) => {

    eventInfo.preventDefault();
    
    fetch(BACKEND_URL + `/${selectedFund.id}`, { method: "DELETE" })
    .then((httpResponse) => {

        if(httpResponse.status === 204) {
            removeFundFromTable(selectedFund.id);
        }
    })
    .catch((error) => {
        
        console.error("ERROR OCCURED: " + error);
    })
    .finally(() => {
        resetForms();
    })
});







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

    document.getElementById(`TR-${fund.id}`).innerHTML = `
    <td>${fund.name}</td>
    <td>${fund.ticker}</td>
    <td>${fund.category}</td>
    <td>${fund.expenseRatio}</td>
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

const activateEditForm = (fundId) => {
    console.log("Edit fund with id: " + fundId);
    for(let fund of funds) {
        if(fund.id === fundId) {
            selectedFund = fund;
            break;
        }
    }

    console.log(selectedFund);

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

const activateDeleteForm = (fundId) => {
    
    console.log(fundId);
    for(let fund of funds) {
        if(fund.id === fundId) {
            selectedFund = fund;
            break;
        }
    }

    console.log(selectedFund);

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

const resetForms = () => {

    document.getElementById("new-fund-card").style.display = "block";
    document.getElementById("update-fund-card").style.display = "none";
    document.getElementById("delete-fund-card").style.display = "none";
}