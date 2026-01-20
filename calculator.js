// Calculator functionality
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculatorForm');
    const resultsDiv = document.getElementById('results');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateSavings();
        });
    }

    function calculateSavings() {
        // Get form values
        const consumo = parseFloat(document.getElementById('consumo').value) || 0;
        const superficie = parseFloat(document.getElementById('superficie').value) || 0;
        const orientamento = document.getElementById('orientamento').value;
        const inclinazione = document.getElementById('inclinazione').value;
        const batteria = document.getElementById('batteria').checked;
        const wallbox = document.getElementById('wallbox').checked;
        const pompa = document.getElementById('pompa').checked;

        // Calculate recommended power (kW)
        // General rule: 1 kW produces ~1200-1400 kWh/year in Italy
        const produzionePerKw = 1300; // kWh per kW annuo
        const potenzaConsigliata = Math.ceil(consumo / produzionePerKw);
        
        // Adjust based on orientation and inclination
        let efficienza = 1.0;
        if (orientamento === 'sud') efficienza = 1.0;
        else if (orientamento === 'sud-est' || orientamento === 'sud-ovest') efficienza = 0.95;
        else if (orientamento === 'est' || orientamento === 'ovest') efficienza = 0.85;
        
        if (inclinazione === 'piano') efficienza *= 0.9;
        else if (inclinazione === '20' || inclinazione === '40') efficienza *= 0.95;

        const potenzaFinale = potenzaConsigliata * efficienza;
        const produzioneAnnua = potenzaFinale * produzionePerKw;

        // Calculate costs
        const costoPerKw = 2000; // € per kW
        const costoImpianto = potenzaFinale * costoPerKw;
        const costoBatteria = batteria ? 6000 : 0;
        const costoWallbox = wallbox ? 2000 : 0;
        const costoPompa = pompa ? 12000 : 0;
        const costoTotale = costoImpianto + costoBatteria + costoWallbox + costoPompa;

        // Calculate savings
        const autoconsumo = batteria ? 0.85 : 0.35; // % with/without battery
        const energiaAutoconsumata = produzioneAnnua * autoconsumo;
        const energiaVenduta = produzioneAnnua * (1 - autoconsumo);
        
        const costoEnergia = 0.25; // €/kWh
        const prezzoVendita = 0.10; // €/kWh
        
        const risparmioAutoconsumo = energiaAutoconsumata * costoEnergia;
        const ricavoVendita = energiaVenduta * prezzoVendita;
        const risparmioTotaleAnnuo = risparmioAutoconsumo + ricavoVendita;

        // Incentives
        const ecobonus = 0.50; // 50%
        const ivaAgevolata = 0.10; // 10% instead of 22%
        const risparmioIva = costoTotale * 0.12; // 12% saved
        const detrazioneEcobonus = costoTotale * ecobonus;
        const costoNetto = costoTotale - detrazioneEcobonus - risparmioIva;

        // ROI
        const anniROI = Math.ceil(costoNetto / risparmioTotaleAnnuo);
        const risparmio20Anni = risparmioTotaleAnnuo * 20 - costoNetto;

        // CO2 saved
        const co2PerKwh = 0.4; // kg CO2 per kWh
        const co2Risparmiata = produzioneAnnua * co2PerKwh / 1000; // tonnellate

        // Display results
        displayResults({
            potenza: potenzaFinale.toFixed(1),
            produzione: produzioneAnnua.toFixed(0),
            costo: costoTotale.toFixed(0),
            costoNetto: costoNetto.toFixed(0),
            risparmioAnnuo: risparmioTotaleAnnuo.toFixed(0),
            anniROI: anniROI,
            risparmio20Anni: risparmio20Anni.toFixed(0),
            co2: co2Risparmiata.toFixed(1),
            batteria: batteria,
            wallbox: wallbox,
            pompa: pompa
        });
    }

    function displayResults(data) {
        resultsDiv.innerHTML = `
            <div class="results-content">
                <div class="result-card">
                    <h3>Impianto Consigliato</h3>
                    <div class="result-value">${data.potenza} kW</div>
                    <p>Produzione annua: ${data.produzione} kWh</p>
                </div>
                
                <div class="result-card">
                    <h3>Investimento</h3>
                    <div class="result-value">€ ${data.costo}</div>
                    <p>Dopo incentivi: <strong>€ ${data.costoNetto}</strong></p>
                    <small>Ecobonus 50% + IVA agevolata</small>
                </div>
                
                <div class="result-card highlight">
                    <h3>Risparmio Annuo</h3>
                    <div class="result-value large">€ ${data.risparmioAnnuo}</div>
                    <p>ROI in ${data.anniROI} anni</p>
                </div>
                
                <div class="result-card">
                    <h3>Risparmio 20 Anni</h3>
                    <div class="result-value">€ ${data.risparmio20Anni}</div>
                    <p>Guadagno netto totale</p>
                </div>
                
                <div class="result-card">
                    <h3>Impatto Ambientale</h3>
                    <div class="result-value green">${data.co2} ton</div>
                    <p>CO₂ risparmiata all'anno</p>
                </div>
                
                ${data.batteria || data.wallbox || data.pompa ? `
                <div class="result-card">
                    <h3>Componenti Aggiuntivi</h3>
                    <ul class="components-list">
                        ${data.batteria ? '<li>✓ Batteria di accumulo</li>' : ''}
                        ${data.wallbox ? '<li>✓ Wallbox ricarica</li>' : ''}
                        ${data.pompa ? '<li>✓ Pompa di calore</li>' : ''}
                    </ul>
                </div>
                ` : ''}
                
                <div class="result-cta">
                    <a href="informazioni.html#contatti" class="btn-hero">Richiedi Consulenza</a>
                    <p class="result-note">* Calcolo indicativo. I valori reali possono variare in base alle caratteristiche specifiche del tuo immobile.</p>
                </div>
            </div>
        `;
        
        // Scroll to results
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

