'use strict';
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const addBtn = document.getElementById('add-btn');

// const dummyTransactions = [
//   { id: generateID(), text: 'Flowers', amount: -20 },
//   { id: generateID(), text: 'Salary', amount: 300 },
//   { id: generateID(), text: 'Book', amount: -10 },
//   { id: generateID(), text: 'Camera', amount: 150 },
// ];

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transactions to DOM list

function addTransactionDOM(transaction) {
  // asign plus or minus
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  //add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
  ${transaction.text} <span >${sign} ${Math.abs(
    transaction.amount
  ).toLocaleString('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  })}</span><button class="delete-btn" onclick="deleteTransaction('${
    transaction.id
  }')">
            <i class="fa-solid fa-delete-left fa-flip-horizontal fa-2x"></i>
          </button>
  `;
  list.appendChild(item);
}

// update balance, income and expense

function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = Number(
    amounts.reduce((acc, item) => (acc += item), 0).toFixed(2)
  ).toLocaleString('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  });

  const income = Number(
    amounts
      .filter(amount => amount > 0)
      .reduce((acc, item) => (acc += item), 0)
      .toFixed(2)
  ).toLocaleString('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  });
  const expense = Number(
    (
      amounts
        .filter(amount => amount < 0)
        .reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2)
  ).toLocaleString('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  });
  balance.innerHTML = total;
  money_plus.innerHTML = `+ ${income}`;
  money_minus.innerHTML = ` - ${expense}`;
}
// add new transaction
function newTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === '' || amount.value.trim('') === '') {
    text.value.trim() == ''
      ? (text.parentElement.className = 'form-control error')
      : (text.parentElement.className = 'form-control');
    amount.value.trim() == ''
      ? (amount.parentElement.className = 'form-control error')
      : (amount.parentElement.className = 'form-control');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value.length > 1 ? text.value : 'unspecified',
      amount: Number(amount.value),
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    text.value = '';
    text.parentElement.className = 'form-control';
    amount.value = '';
    amount.parentElement.className = 'form-control';
  }
}

// generate random ID
function generateID() {
  return Math.floor(Math.random() * Date.now() * 10000000).toString(16);
}
console.log(generateID());
// delete transaction

function deleteTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  init();
  updateLocalStorage();
}

// update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize app
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

//eventlisteners

form.addEventListener('submit', newTransaction);
