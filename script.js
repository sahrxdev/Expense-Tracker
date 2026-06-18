const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transactions-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e) {
    e.preventDefault();

    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);

    const transaction = {
        id: Date.now(),
        description,
        amount
    };

    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    const transactionEl = createTransactionElement(transaction);
    transactionListEl.prepend(transactionEl); // new transaction on top
    animateTransaction(transactionEl);

    updateSummary();
    transactionFormEl.reset();
}

function updateTransactionList() {
    transactionListEl.innerHTML = "";
    const sortedTransactions = [...transactions].reverse();
    sortedTransactions.forEach((transaction) => {
        const transactionEl = createTransactionElement(transaction);
        transactionListEl.appendChild(transactionEl);
    });
}

function createTransactionElement(transaction) {
    const li = document.createElement("li");
    li.classList.add("transaction");
    li.classList.add(transaction.amount > 0 ? "income" : "expense");

    li.innerHTML = `
        <span>${transaction.description}</span>
        <span>${formatCurrency(transaction.amount)}
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        </span>
    `;

    return li;
}

function animateTransaction(element) {
    element.style.opacity = 0;
    element.style.transform = "translateY(-20px)";
    element.style.boxShadow = "0 0 0 rgba(0,0,0,0)";

    setTimeout(() => {
        element.style.transition = "all 0.5s ease-out";
        element.style.opacity = 1;
        element.style.transform = "translateY(0)";
        element.style.boxShadow = "0 6px 20px rgba(34,197,94,0.3)";
    }, 50);

    setTimeout(() => {
        element.style.boxShadow = ""; // remove glow after animation
    }, 700);
}

function updateSummary() {
    const balance = transactions.reduce((acc, t) => acc + t.amount, 0);
    const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);

    balanceEl.textContent = formatCurrency(balance);
    incomeAmountEl.textContent = formatCurrency(income);
    expenseAmountEl.textContent = formatCurrency(expenses);
}

function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateTransactionList();
    updateSummary();
}

function formatCurrency(amount) {
    return "SLE " + amount.toLocaleString();
}

updateTransactionList();
updateSummary();
