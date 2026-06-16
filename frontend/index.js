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