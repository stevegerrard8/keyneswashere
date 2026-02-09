let balance = 100.00;
let portfolio = {}; // Hangi sektörden kaç adet var?
let market = [
    {id: 'T1', name: 'TEKNOLOJI', price: 15.00},
    {id: 'E1', name: 'EMLAK', price: 40.00},
    {id: 'G1', name: 'GIDA', price: 8.00},
    {id: 'S1', name: 'SAGLIK', price: 25.00},
    {id: 'U1', name: 'ULASIM', price: 12.00}
];

function updateMarket() {
    const tbody = document.getElementById('market-body');
    tbody.innerHTML = "";
    let pVal = 0;

    market.forEach(s => {
        // Fiyat Dalgalanması
        s.price += (Math.random() * 2 - 1);
        if(s.price < 0.1) s.price = 0.1;
        
        if(portfolio[s.id]) pVal += portfolio[s.id] * s.price;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><b>${s.name}</b> (${portfolio[s.id] || 0})</td>
            <td>${s.price.toFixed(2)} $</td>
            <td><a onclick="buy('${s.id}', ${s.price})">[satın al]</a></td>
        `;
        tbody.appendChild(tr);
    });

    // UI Güncelleme
    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('port-val').innerText = pVal.toFixed(2);
    document.getElementById('total-val').innerText = (balance + pVal).toFixed(2);
}

function buy(id, price) {
    if(balance >= price) {
        balance -= price;
        portfolio[id] = (portfolio[id] || 0) + 1;
        updateMarket();
    }
}

function initWithdraw() {
    let amt = parseFloat(document.getElementById('cash-out-input').value);
    if(amt > 0 && amt <= balance) {
        balance -= amt;
        document.getElementById('overlay').classList.remove('hidden');
    }
}

function chooseSector(s) {
    alert(s + " uzmanlığı seçildi. Borsa verileri akmaya devam edecek.");
    document.getElementById('overlay').classList.add('hidden');
}

setInterval(updateMarket, 2500); // 2.5 saniyede bir borsa akar
updateMarket();
