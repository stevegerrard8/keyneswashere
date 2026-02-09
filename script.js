let balance = 100;
let initial = 100;
let myStocks = {}; 
let market = [
    {id: 'H1', name: 'HISSE_1', price: 20},
    {id: 'H2', name: 'HISSE_2', price: 45},
    {id: 'H3', name: 'HISSE_3', price: 10},
    {id: 'H4', name: 'HISSE_4', price: 80},
    {id: 'H5', name: 'HISSE_5', price: 5}
];

function update() {
    const list = document.getElementById('market-list');
    list.innerHTML = "";
    let pVal = 0;

    market.forEach(s => {
        let old = s.price;
        s.price += (Math.random() * 2 - 1);
        if (s.price < 1) s.price = 1;
        
        if(myStocks[s.id]) pVal += myStocks[s.id] * s.price;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${s.name} (${myStocks[s.id] || 0})</td>
            <td>${s.price.toFixed(2)}</td>
            <td style="color:${s.price >= old ? 'blue' : 'red'}">${(((s.price-old)/old)*100).toFixed(1)}%</td>
            <td><a onclick="buy('${s.id}', ${s.price})">AL</a></td>
        `;
        list.appendChild(row);
    });

    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('port-val').innerText = pVal.toFixed(2);
    let total = balance + pVal;
    document.getElementById('profit-loss').innerText = (((total - initial)/initial)*100).toFixed(2);
}

function buy(id, price) {
    if(balance >= price) {
        balance -= price;
        myStocks[id] = (myStocks[id] || 0) + 1;
        update();
    }
}

function processWithdraw() {
    let val = parseFloat(document.getElementById('cash-input').value);
    if(val > 0 && val <= balance) {
        // Çekilen para cüzdandan çıkar, borsa akmaya devam eder
        balance -= val;
        document.getElementById('overlay').classList.remove('hidden');
    }
}

function pick(sector) {
    alert(sector + " sektörü seçildi.");
    document.getElementById('overlay').classList.add('hidden');
}

setInterval(update, 2000);
update();
