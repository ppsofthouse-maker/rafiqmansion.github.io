// LocalStorage Initialization
let openingBalance = parseFloat(localStorage.getItem('rafiq_opening_balance')) || 0;
let registeredFlats = JSON.parse(localStorage.getItem('rafiq_registered_flats')) || [
    { flatNo: '101', ownerName: 'Muhammad Ahmed' },
    { flatNo: '102', ownerName: 'Tariq Mahmood' },
    { flatNo: '103', ownerName: 'Zubair Khan' }
];
let registeredExpenses = JSON.parse(localStorage.getItem('rafiq_registered_expenses')) || [
    'Sweeper Salary', 'Electrician Repairs', 'K-Electric Meter', 'Water Tanker', 'Plumber'
];
let incomeList = JSON.parse(localStorage.getItem('rafiq_income_list')) || [];
let expenseList = JSON.parse(localStorage.getItem('rafiq_expense_list')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateFlatDropdown();
    updateExpenseDropdown();
    renderTags();
    updateUI();
});

// Save Opening Balance
function saveOpeningBalance() {
    const val = parseFloat(document.getElementById('openingBalanceInput').value);
    if (isNaN(val)) {
        alert('Meherbani karke Opening Balance amount likhein!');
        return;
    }
    openingBalance = val;
    localStorage.setItem('rafiq_opening_balance', openingBalance);
    document.getElementById('openingBalanceInput').value = '';
    updateUI();
}

// Flat Registration
function saveRegisteredFlat() {
    const flatNo = document.getElementById('setupFlatNo').value.trim();
    const ownerName = document.getElementById('setupOwnerName').value.trim();

    if (!flatNo || !ownerName) {
        alert('Flat No aur Owner Name dono bharein!');
        return;
    }

    if (registeredFlats.some(f => f.flatNo === flatNo)) {
        alert('Ye Flat Pehle se Registered Hai!');
        return;
    }

    registeredFlats.push({ flatNo, ownerName });
    localStorage.setItem('rafiq_registered_flats', JSON.stringify(registeredFlats));

    document.getElementById('setupFlatNo').value = '';
    document.getElementById('setupOwnerName').value = '';

    updateFlatDropdown();
    renderTags();
}

function deleteRegisteredFlat(flatNo) {
    if (confirm(`Kya aap Flat ${flatNo} ko registered list se hatana chahte hain?`)) {
        registeredFlats = registeredFlats.filter(f => f.flatNo !== flatNo);
        localStorage.setItem('rafiq_registered_flats', JSON.stringify(registeredFlats));
        updateFlatDropdown();
        renderTags();
        autoFillOwnerName();
    }
}

// Expense Category Registration
function saveExpenseCategory() {
    const catName = document.getElementById('setupExpenseCat').value.trim();

    if (!catName) {
        alert('Expense Category Name Likhein!');
        return;
    }

    if (registeredExpenses.includes(catName)) {
        alert('Ye Category Pehle se Registered Hai!');
        return;
    }

    registeredExpenses.push(catName);
    localStorage.setItem('rafiq_registered_expenses', JSON.stringify(registeredExpenses));

    document.getElementById('setupExpenseCat').value = '';

    updateExpenseDropdown();
    renderTags();
}

function deleteExpenseCategory(catName) {
    if (confirm(`Kya aap Category "${catName}" ko delete karna chahte hain?`)) {
        registeredExpenses = registeredExpenses.filter(c => c !== catName);
        localStorage.setItem('rafiq_registered_expenses', JSON.stringify(registeredExpenses));
        updateExpenseDropdown();
        renderTags();
        document.getElementById('expenseDesc').value = '';
    }
}

// Dropdowns Updates
function updateFlatDropdown() {
    const select = document.getElementById('flatSelect');
    select.innerHTML = '<option value="">-- Select Flat --</option>';
    registeredFlats.forEach(f => {
        select.innerHTML += `<option value="${f.flatNo}">${f.flatNo} - ${f.ownerName}</option>`;
    });
}

function updateExpenseDropdown() {
    const select = document.getElementById('expenseSelect');
    select.innerHTML = '<option value="">-- Select Category --</option>';
    registeredExpenses.forEach(exp => {
        select.innerHTML += `<option value="${exp}">${exp}</option>`;
    });
}

function autoFillOwnerName() {
    const selectedFlatNo = document.getElementById('flatSelect').value;
    const flatData = registeredFlats.find(f => f.flatNo === selectedFlatNo);

    if (flatData) {
        document.getElementById('flatNo').value = flatData.flatNo;
        document.getElementById('ownerName').value = flatData.ownerName;
    } else {
        document.getElementById('flatNo').value = '';
        document.getElementById('ownerName').value = '';
    }
}

function autoFillExpenseDesc() {
    const selectedExpense = document.getElementById('expenseSelect').value;
    document.getElementById('expenseDesc').value = selectedExpense;
}

// Render Setup Tags
function renderTags() {
    const flatContainer = document.getElementById('flatTags');
    flatContainer.innerHTML = '';
    registeredFlats.forEach(f => {
        flatContainer.innerHTML += `
            <span class="tag">
                ${f.flatNo} (${f.ownerName})
                <i class="fa-solid fa-xmark" onclick="deleteRegisteredFlat('${f.flatNo}')"></i>
            </span>
        `;
    });

    const expenseContainer = document.getElementById('expenseTags');
    expenseContainer.innerHTML = '';
    registeredExpenses.forEach(exp => {
        expenseContainer.innerHTML += `
            <span class="tag">
                ${exp}
                <i class="fa-solid fa-xmark" onclick="deleteExpenseCategory('${exp}')"></i>
            </span>
        `;
    });
}

// Add Income & Expense Entries
function addIncome() {
    const flatNo = document.getElementById('flatNo').value;
    const ownerName = document.getElementById('ownerName').value;
    const desc = document.getElementById('incomeDesc').value.trim();
    const amount = parseFloat(document.getElementById('incomeAmount').value);

    if (!flatNo || !ownerName || !desc || isNaN(amount) || amount <= 0) {
        alert('Payment details aur amount sahi se bharein!');
        return;
    }

    incomeList.push({ id: Date.now(), flatNo, ownerName, desc, amount });
    localStorage.setItem('rafiq_income_list', JSON.stringify(incomeList));

    document.getElementById('incomeDesc').value = '';
    document.getElementById('incomeAmount').value = '';
    updateUI();
}

function addExpense() {
    const desc = document.getElementById('expenseDesc').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);

    if (!desc || isNaN(amount) || amount <= 0) {
        alert('Expense details aur amount sahi se bharein!');
        return;
    }

    expenseList.push({ id: Date.now(), desc, amount });
    localStorage.setItem('rafiq_expense_list', JSON.stringify(expenseList));

    document.getElementById('expenseDesc').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseSelect').value = '';
    updateUI();
}

function deleteIncome(id) {
    if (confirm('Kya aap is entry ko delete karna chahte hain?')) {
        incomeList = incomeList.filter(item => item.id !== id);
        localStorage.setItem('rafiq_income_list', JSON.stringify(incomeList));
        updateUI();
    }
}

function deleteExpense(id) {
    if (confirm('Kya aap is expense ko delete karna chahte hain?')) {
        expenseList = expenseList.filter(item => item.id !== id);
        localStorage.setItem('rafiq_expense_list', JSON.stringify(expenseList));
        updateUI();
    }
}

function clearAllIncome() {
    if (incomeList.length === 0) return;
    if (confirm('Saari income entries clear karein?')) {
        incomeList = [];
        localStorage.removeItem('rafiq_income_list');
        updateUI();
    }
}

function clearAllExpense() {
    if (expenseList.length === 0) return;
    if (confirm('Saare expenses clear karein?')) {
        expenseList = [];
        localStorage.removeItem('rafiq_expense_list');
        updateUI();
    }
}

// Update Dashboard and Google Sheet / Excel Parallel View
function updateUI() {
    document.getElementById('openingStatusText').innerText = `RS ${openingBalance.toLocaleString()}`;
    document.getElementById('displayOpeningBalance').innerText = `RS ${openingBalance.toLocaleString()}`;

    // Render Income Side
    const incomeTbody = document.getElementById('incomeTableBody');
    incomeTbody.innerHTML = '';
    let collectionsTotal = 0;

    if (incomeList.length === 0) {
        incomeTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#94a3b8; padding:15px;">Koi Payment Record Nahi Hai</td></tr>`;
    } else {
        incomeList.forEach(item => {
            collectionsTotal += item.amount;
            incomeTbody.innerHTML += `
                <tr>
                    <td><strong>${item.flatNo}</strong></td>
                    <td>${item.ownerName}</td>
                    <td>${item.desc}</td>
                    <td>RS ${item.amount.toLocaleString()}</td>
                    <td style="text-align:center;"><button class="btn-del" onclick="deleteIncome(${item.id})"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
            `;
        });
    }

    // Render Expense Side
    const expenseTbody = document.getElementById('expenseTableBody');
    expenseTbody.innerHTML = '';
    let totalExpense = 0;

    if (expenseList.length === 0) {
        expenseTbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#94a3b8; padding:15px;">Koi Expense Record Nahi Hai</td></tr>`;
    } else {
        expenseList.forEach((item, idx) => {
            totalExpense += item.amount;
            expenseTbody.innerHTML += `
                <tr>
                    <td style="text-align:center;">${idx + 1}</td>
                    <td><strong>${item.desc}</strong></td>
                    <td>RS ${item.amount.toLocaleString()}</td>
                    <td style="text-align:center;"><button class="btn-del" onclick="deleteExpense(${item.id})"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
            `;
        });
    }

    const totalIncomeWithOpening = openingBalance + collectionsTotal;
    const netBalance = totalIncomeWithOpening - totalExpense;

    document.getElementById('displayTotalIncome').innerText = `RS ${totalIncomeWithOpening.toLocaleString()}`;
    document.getElementById('displayTotalExpense').innerText = `RS ${totalExpense.toLocaleString()}`;
    document.getElementById('displayNetBalance').innerText = `RS ${netBalance.toLocaleString()}`;
}

// WhatsApp Share Functionality
function shareWhatsApp() {
    let collectionsTotal = incomeList.reduce((acc, curr) => acc + curr.amount, 0);
    let totalIncome = openingBalance + collectionsTotal;
    let totalExpense = expenseList.reduce((acc, curr) => acc + curr.amount, 0);
    let netBalance = totalIncome - totalExpense;

    let msg = `*RAFIQ MANSION COMMITTEE*\n`;
    msg += `CAMPBELL RD BURNS ROAD KARACHI\n`;
    msg += `*ACCOUNTS & MAINTENANCE SUMMARY*\n\n`;
    msg += `*Opening Balance:* RS ${openingBalance.toLocaleString()}\n`;
    msg += `*Total Flat Collection:* RS ${collectionsTotal.toLocaleString()}\n`;
    msg += `*Total Available Fund:* RS ${totalIncome.toLocaleString()}\n`;
    msg += `*Total Expenses:* RS ${totalExpense.toLocaleString()}\n`;
    msg += `---------------------------\n`;
    msg += `*NET REMAINING BALANCE:* RS ${netBalance.toLocaleString()}\n\n`;
    msg += `_System Generated Statement_`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

// Export to Google Sheets / Excel Format
function exportToExcel() {
    let collectionsTotal = incomeList.reduce((acc, curr) => acc + curr.amount, 0);
    let totalIncome = openingBalance + collectionsTotal;
    let totalExpense = expenseList.reduce((acc, curr) => acc + curr.amount, 0);
    let netBalance = totalIncome - totalExpense;

    let excelData = [
        ["RAFIQ MANSION COMMITTEE - MAINTENANCE REPORT", "", "", "", "", ""],
        ["CAMPBELL RD BURNS ROAD KARACHI", "", "", "", "", ""],
        ["", "", "", "", "", ""],
        ["OPENING BALANCE (SABIQA BAKI):", openingBalance, "", "", "", ""],
        ["", "", "", "", "", ""],
        ["INCOME (FLAT PAYMENTS)", "", "", "", "EXPENSES (BUILDING KHARCHA)", ""],
        ["Flat No", "Owner Name", "Month", "Amount (PKR)", "Expense Details", "Amount (PKR)"]
    ];

    let maxRows = Math.max(incomeList.length, expenseList.length);

    for (let i = 0; i < maxRows; i++) {
        let inc = incomeList[i] || { flatNo: "", ownerName: "", desc: "", amount: "" };
        let exp = expenseList[i] || { desc: "", amount: "" };

        excelData.push([
            inc.flatNo,
            inc.ownerName,
            inc.desc,
            inc.amount ? inc.amount : "",
            exp.desc,
            exp.amount ? exp.amount : ""
        ]);
    }

    excelData.push(["", "", "", "", "", ""]);
    excelData.push(["TOTAL COLLECTION:", collectionsTotal, "", "", "TOTAL EXPENSES:", totalExpense]);
    excelData.push(["TOTAL FUNDS (+OPENING):", totalIncome, "", "", "NET REMAINING BALANCE:", netBalance]);

    let ws = XLSX.utils.aoa_to_sheet(excelData);
    ws['!cols'] = [{ wch: 12 }, { wch: 22 }, { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 15 }];

    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Accounts Ledger");
    XLSX.writeFile(wb, "Rafiq_Mansion_Maintenance_Ledger.xlsx");
}