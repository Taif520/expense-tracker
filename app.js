
const savedData = localStorage.getItem("transactions");


let transactions;

if (savedData) {

  transactions = JSON.parse(savedData);
} else {

  transactions = [...initialTransactions];
}


let searchText = "";


const list = document.getElementById("transactions-list");
const emptyState = document.getElementById("empty-state");
const countBadge = document.getElementById("tx-count-badge");

const totalIncomeBox = document.getElementById("total-income");
const totalExpenseBox = document.getElementById("total-expense");
const totalBalanceBox = document.getElementById("total-balance");

const form = document.getElementById("transaction-form");
const typeInput = document.getElementById("tx-type");
const titleInput = document.getElementById("tx-title");
const amountInput = document.getElementById("tx-amount");
const categoryInput = document.getElementById("tx-category");
const dateInput = document.getElementById("tx-date");

const expenseButton = document.getElementById("type-btn-expense");
const incomeButton = document.getElementById("type-btn-income");

const searchInput = document.getElementById("search-input");



function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function formatMoney(number) {
  return "ر.ع " + number.toFixed(3);
}




function updateTotals() {
  let income = 0;
  let expense = 0;

  for (const tx of transactions) {
    if (tx.type === "income") {
      income = income + tx.amount;
    } else {
      expense = expense + tx.amount;
    }
  }

  const balance = income - expense;

  totalIncomeBox.textContent = formatMoney(income);
  totalExpenseBox.textContent = formatMoney(expense);
  totalBalanceBox.textContent = formatMoney(balance);
}



function render() {
 
  const visibleTransactions = transactions.filter(function (tx) {
    return tx.title.toLowerCase().includes(searchText.toLowerCase());
  });


  list.innerHTML = "";

  for (const tx of visibleTransactions) {

    let sign = "-";
    let icon = "fa-arrow-down";
    if (tx.type === "income") {
      sign = "+";
      icon = "fa-arrow-up";
    }

    list.innerHTML += `
      <li class="transaction-item">
        <div class="tx-main">
          <div class="tx-icon ${tx.type}">
            <i class="fa-solid ${icon}"></i>
          </div>
          <div class="tx-details">
            <span class="tx-title">${tx.title}</span>
            <div class="tx-meta">
              <span>${tx.category}</span>
              <span>${tx.date}</span>
            </div>
          </div>
        </div>
        <div class="tx-end">
          <span class="tx-amount ${tx.type}">${sign}${formatMoney(tx.amount)}</span>
          <div class="tx-actions">
            <button type="button" class="action-icon-btn delete" onclick="deleteTransaction(${tx.id})">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </li>
    `;
  }


  countBadge.textContent = visibleTransactions.length + " معاملة";


  if (visibleTransactions.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

 
  updateTotals();
}


function setType(type) {
  typeInput.value = type;


  expenseButton.className = "type-toggle-btn";
  incomeButton.className = "type-toggle-btn";


  if (type === "expense") {
    expenseButton.className = "type-toggle-btn active expense";
  } else {
    incomeButton.className = "type-toggle-btn active income";
  }
}

expenseButton.addEventListener("click", function () {
  setType("expense");
});

incomeButton.addEventListener("click", function () {
  setType("income");
});




form.addEventListener("submit", function (event) {
  event.preventDefault(); 

  const title = titleInput.value.trim(); 
  const amount = Number(amountInput.value); 

  if (title === "" || amount <= 0) {
    alert("من فضلك اكتب عنواناً ومبلغاً صحيحاً");
    return;
  }


  const newTransaction = {
    id: Date.now(),
    title: title,
    amount: amount,
    type: typeInput.value,
    category: categoryInput.value,
    date: dateInput.value,
  };

  transactions.unshift(newTransaction); 
  saveData(); 
  render(); 

  form.reset();
  setType("expense");
  dateInput.value = getRelativeDate(0);
});




function deleteTransaction(id) {
  const sure = confirm("هل أنت متأكد من حذف هذه المعاملة؟");
  if (sure === false) {
    return; // 
  }

  
  transactions = transactions.filter(function (tx) {
    return tx.id !== id;
  });

  saveData();
  render();
}




searchInput.addEventListener("input", function () {
  searchText = searchInput.value; 
  render();
});



dateInput.value = getRelativeDate(0);
render();
