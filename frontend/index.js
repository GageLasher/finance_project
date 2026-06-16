const BACKEND_URL = 'http://localhost:8080/funds'
const funds = [];


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


    editBtnTD.innerHTML = `<button class="btn btn-primary p-3" id="EDIT-${fund.id}">Edit</button>`;
    delBtnTD.innerHTML = `<button class="btn btn-danger p-3" id="DEL-${fund.id}">Delete</button>`;

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