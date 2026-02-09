let balance = 100;
let portfolio = {}; // Hangi hisseden kaç adet var?
let stocks = [
    { id: 'S1', name: "HISSE_A", price: 10, last: 10 },
    { id: 'S2', name: "HISSE_B", price: 25, last: 25 },
    { id: 'S3', name: "HISSE_C", price: 50, last: 50 },
    { id: 'S4', name: "HISSE_D", price: 5, last: 5 },
    { id: 'S5', name: "HISSE_E", price: 100, last: 100 }
];

function updateMarket() {
    const tbody = document.getElementById('market-data');
    tbody.innerHTML = "";
    let totalPortVal = 0;

    stocks.forEach(s => {
        // Fiyat Dalgalanması
        s.last = s.price;
        s.price += (Math.random() * 2 - 1);
        if(s.price < 0.5) s.price = 0.5;

        // Portföy değerini hesapla
        if(portfolio[s.id]) totalPortVal += portfolio[s.id] * s.price;

        const change = ((s.price - s.last) / s.last * 100).toFixed(2);
        const color = s.price >= s.last ? "green" : "red";

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${s.name} (Sahip: ${portfolio[s.id] || 0})</td>
            <td>${s.price.toFixed(2)}</td>
            <td style="color:${color}">${change}%</td>
            <td><button onclick="buy('${s.id}', ${s.price})">AL</button></td>
        `;
        tbody.appendChild(tr);
    });

    // Stats güncelleme
    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('port-val').innerText = totalPortVal.toFixed(2);
    let total = balance + totalPortVal;
    document.getElementById('profit-loss').innerText = (((total - 100)/100)*100).toFixed(2);
}

function buy(id, price) {
    if(balance >= price) {
        balance -= price;
        portfolio[id] = (portfolio[id] || 0) + 1;
        updateMarket();
    }
}

function requestWithdraw() {
    let amt = parseFloat(document.getElementById('withdraw-amt').value);
    if(amt > 0 && amt <= balance) {
        balance -= amt; // Çekilen para cüzdandan düşer
        document.getElementById('sector-overlay').classList.remove('hidden');
    } else {
        alert("Yetersiz nakit!");
    }
}

function finalizeSector(name) {
    alert(name + " sektörüne giriş yaptınız. Artık bu alanda problemler çözeceksiniz.");
    document.getElementById('sector-overlay').classList.add('hidden');
    // Borsa arkada akmaya devam ediyor...
}

function closeSectors() { document.getElementById('sector-overlay').classList.add('hidden'); }

setInterval(updateMarket, 2000);
updateMarket();
