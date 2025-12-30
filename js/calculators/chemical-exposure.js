// chemical-exposure.js - Chemical Exposure Calculator Logic

document.addEventListener('DOMContentLoaded', function() {
    // Initialize chemical exposure calculator
    const calculateBtn = document.getElementById('calculate-chemical');
    const resetBtn = document.getElementById('reset-chemical');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateChemicalExposure);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetChemicalExposure);
    }
    
    // Load common chemical database
    loadChemicalDatabase();
    
    console.log('Chemical Exposure Calculator initialized');
});

function calculateChemicalExposure() {
    // Get form values
    const chemicalName = document.getElementById('chemical-name').value.trim();
    const casNumber = document.getElementById('cas-number').value.trim();
    const concentration = parseFloat(document.getElementById('concentration').value);
    const concentrationUnit = document.getElementById('concentration-unit').value;
    const exposureTime = parseFloat(document.getElementById('exposure-time').value);
    const oel = parseFloat(document.getElementById('oel').value) || 0;
    const oelUnit = document.getElementById('oel-unit').value;
    const controlMeasures = Array.from(document.querySelectorAll('input[name="controls"]:checked'))
                                .map(cb => cb.value);
    
    // Validate inputs
    if (!chemicalName) {
        showNotification('Please enter a chemical name.', 'error');
        return;
    }
    
    if (isNaN(concentration) || concentration <= 0) {
        showNotification('Please enter a valid concentration value.', 'error');
        return;
    }
    
    if (isNaN(exposureTime) || exposureTime <= 0 || exposureTime > 24) {
        showNotification('Please enter a valid exposure time (0.1-24 hours).', 'error');
        return;
    }
    
    if (isNaN(oel) || oel <= 0) {
        showNotification('Please enter a valid Occupational Exposure Limit (OEL).', 'error');
        return;
    }
    
    // Convert units if necessary
    const convertedConcentration = convertConcentration(concentration, concentrationUnit, 'ppm');
    const convertedOEL = convertConcentration(oel, oelUnit, 'ppm');
    
    if (convertedConcentration === null || convertedOEL === null) {
        showNotification('Invalid unit conversion. Please check your units.', 'error');
        return;
    }
    
    // Calculate exposure ratio
    const exposureRatio = convertedConcentration / convertedOEL;
    
    // Apply control measures factor
    const controlFactor = calculateControlFactor(controlMeasures);
    const adjustedExposureRatio = exposureRatio * controlFactor;
    
    // Determine health effects based on chemical and exposure
    const healthEffects = assessHealthEffects(chemicalName, convertedConcentration, exposureTime);
    
    // Determine risk level
    let riskLevel, riskColor, actionLevel, recommendations;
    
    if (adjustedExposureRatio < 0.1) {
        riskLevel = 'Low Risk';
        riskColor = '#28a745';
        actionLevel = 'Well Below OEL';
        recommendations = [
            'Continue routine monitoring',
            'Maintain existing controls',
            'Annual exposure assessment'
        ];
    } else if (adjustedExposureRatio < 0.5) {
        riskLevel = 'Moderate Risk';
        riskColor = '#ffc107';
        actionLevel = 'Below OEL';
        recommendations = [
            'Increase monitoring frequency',
            'Review control effectiveness',
            'Consider additional ventilation',
            'Provide specific training'
        ];
    } else if (adjustedExposureRatio < 1.0) {
        riskLevel = 'High Risk';
        riskColor = '#fd7e14';
        actionLevel = 'Approaching OEL';
        recommendations = [
            'Implement additional controls immediately',
            'Reduce exposure time',
            'Mandatory PPE use',
            'Monthly exposure monitoring',
            'Medical surveillance'
        ];
    } else {
        riskLevel = 'Extreme Risk';
        riskColor = '#dc3545';
        actionLevel = 'Exceeds OEL';
        recommendations = [
            'STOP EXPOSURE IMMEDIATELY',
            'Implement engineering controls',
            'Use highest level PPE',
            'Daily exposure monitoring',
            'Immediate medical evaluation'
        ];
    }
    
    // Calculate time-weighted average if needed
    const twa = calculateTWA(convertedConcentration, exposureTime);
    
    // Calculate short-term exposure if applicable
    const stel = calculateSTEL(convertedConcentration, exposureTime);
    
    // Display results
    displayChemicalResults({
        chemicalName: chemicalName,
        casNumber: casNumber,
        concentration: concentration,
        concentrationUnit: concentrationUnit,
        convertedConcentration: convertedConcentration.toFixed(2),
        exposureTime: exposureTime,
        oel: oel,
        oelUnit: oelUnit,
        convertedOEL: convertedOEL.toFixed(2),
        exposureRatio: exposureRatio.toFixed(3),
        adjustedExposureRatio: adjustedExposureRatio.toFixed(3),
        riskLevel: riskLevel,
        riskColor: riskColor,
        actionLevel: actionLevel,
        recommendations: recommendations,
        healthEffects: healthEffects,
        controlMeasures: controlMeasures,
        controlFactor: controlFactor.toFixed(2),
        twa: twa.toFixed(2),
        stel: stel.toFixed(2)
    });
    
    // Update exposure chart
    updateExposureChart(convertedConcentration, convertedOEL, adjustedExposureRatio);
    
    showNotification('Chemical exposure assessment completed!', 'success');
}

function convertConcentration(value, fromUnit, toUnit) {
    // Conversion factors (simplified - real conversions depend on chemical properties)
    const conversions = {
        'ppm': { 'ppm': 1, 'mg/m3': 0.0409, '%': 10000 },
        'mg/m3': { 'ppm': 24.45, 'mg/m3': 1, '%': 10000 },
        '%': { 'ppm': 0.0001, 'mg/m3': 0.0001, '%': 1 }
    };
    
    // For temperature and pressure: assume 25°C and 1 atm
    const molecularWeight = 50; // Default average MW
    
    if (fromUnit === toUnit) return value;
    
    if (conversions[fromUnit] && conversions[fromUnit][toUnit]) {
        return value * conversions[fromUnit][toUnit];
    }
    
    return null;
}

function calculateControlFactor(controlMeasures) {
    let factor = 1.0;
    
    controlMeasures.forEach(control => {
        switch(control) {
            case 'engineering':
                factor *= 0.3; // Engineering controls reduce exposure by 70%
                break;
            case 'ventilation':
                factor *= 0.5; // Ventilation reduces by 50%
                break;
            case 'ppe':
                factor *= 0.2; // Proper PPE reduces by 80%
                break;
            case 'enclosure':
                factor *= 0.1; // Complete enclosure reduces by 90%
                break;
            case 'automation':
                factor *= 0.2; // Automation reduces by 80%
                break;
            case 'substitution':
                factor *= 0.1; // Substitution reduces by 90%
                break;
        }
    });
    
    return Math.max(0.01, factor); // Minimum 99% reduction
}

function assessHealthEffects(chemicalName, concentration, exposureTime) {
    // Simplified health effects assessment
    const effects = [];
    
    if (concentration > 1000) {
        effects.push('Acute toxicity risk - Immediate health effects');
        effects.push('Potential respiratory irritation');
        effects.push('Central nervous system effects');
    } else if (concentration > 100) {
        effects.push('Chronic exposure risk - Long-term health effects');
        effects.push('Potential organ damage');
        effects.push('Carcinogenic risk with prolonged exposure');
    } else if (concentration > 10) {
        effects.push('Moderate health risk with repeated exposure');
        effects.push('Potential skin/respiratory sensitization');
    } else {
        effects.push('Low health risk with proper controls');
    }
    
    // Add chemical-specific warnings
    if (chemicalName.toLowerCase().includes('benzene')) {
        effects.push('BENZENE: Known human carcinogen - Strict controls required');
        effects.push('Leukemia risk with chronic exposure');
    } else if (chemicalName.toLowerCase().includes('asbestos')) {
        effects.push('ASBESTOS: Carcinogenic - No safe exposure level');
        effects.push('Mesothelioma and lung cancer risk');
    } else if (chemicalName.toLowerCase().includes('lead')) {
        effects.push('LEAD: Neurotoxic - Particularly hazardous to pregnant workers');
        effects.push('Blood lead monitoring required');
    }
    
    return effects;
}

function calculateTWA(concentration, exposureTime) {
    // Simplified TWA calculation for 8-hour workday
    return concentration * (exposureTime / 8);
}

function calculateSTEL(concentration, exposureTime) {
    // Short-term exposure limit (15-minute average)
    if (exposureTime <= 0.25) { // 15 minutes
        return concentration;
    }
    return concentration * 0.25; // Average over 15 minutes
}

function displayChemicalResults(results) {
    const resultBox = document.getElementById('chemical-result');
    if (!resultBox) return;
    
    // Update main values
    updateElementText('.ratio-value', results.adjustedExposureRatio, resultBox);
    updateElementText('.twa-value', `${results.twa} ${results.oelUnit}`, resultBox);
    updateElementText('.stel-value', `${results.stel} ${results.oelUnit}`, resultBox);
    
    // Update risk level
    const riskLevelElement = resultBox.querySelector('.risk-level');
    if (riskLevelElement) {
        riskLevelElement.textContent = results.riskLevel;
        riskLevelElement.style.backgroundColor = results.riskColor;
        riskLevelElement.style.color = results.riskLevel === 'Extreme Risk' ? '#fff' : '#000';
    }
    
    // Update action level
    updateElementText('.action-level', results.actionLevel, resultBox);
    
    // Update chemical info
    updateElementText('.chemical-name', results.chemicalName, resultBox);
    if (results.casNumber) {
        updateElementText('.cas-number', `CAS: ${results.casNumber}`, resultBox);
    }
    
    // Update exposure details
    updateElementText('.exposure-details', 
        `${results.concentration} ${results.concentrationUnit} for ${results.exposureTime} hours`, 
        resultBox);
    
    // Update OEL comparison
    updateElementText('.oel-comparison', 
        `Concentration: ${results.convertedConcentration} ppm | OEL: ${results.convertedOEL} ppm`, 
        resultBox);
    
    // Update control effectiveness
    const controlElement = resultBox.querySelector('.control-effectiveness');
    if (controlElement) {
        if (results.controlMeasures.length > 0) {
            const effectiveness = (1 - results.controlFactor) * 100;
            controlElement.innerHTML = `
                <div class="control-summary">
                    <i class="fas fa-shield-alt"></i>
                    Controls reduce exposure by ${effectiveness.toFixed(0)}%
                    <br>
                    <small>${results.controlMeasures.length} control measure(s) applied</small>
                </div>
            `;
        } else {
            controlElement.innerHTML = `
                <div class="control-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    No control measures specified
                </div>
            `;
        }
    }
    
    // Update health effects
    const healthElement = resultBox.querySelector('.health-effects');
    if (healthElement) {
        healthElement.innerHTML = '';
        results.healthEffects.forEach(effect => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${effect}`;
            healthElement.appendChild(li);
        });
    }
    
    // Update recommendations
    const recommendationsElement = resultBox.querySelector('.recommendations-list');
    if (recommendationsElement) {
        recommendationsElement.innerHTML = '';
        results.recommendations.forEach(rec => {
            const li = document.createElement('li');
            const icon = rec.includes('STOP') ? 'fa-ban' : 'fa-check';
            li.innerHTML = `<i class="fas ${icon}"></i> ${rec}`;
            recommendationsElement.appendChild(li);
        });
    }
    
    // Show result box
    resultBox.classList.add('active');
    
    // Scroll to results
    setTimeout(() => {
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function updateExposureChart(concentration, oel, ratio) {
    const chart = document.getElementById('exposure-chart');
    if (!chart) return;
    
    const ctx = chart.getContext('2d');
    ctx.clearRect(0, 0, chart.width, chart.height);
    
    const barWidth = 40;
    const maxValue = Math.max(concentration, oel) * 1.2;
    const scaleFactor = 150 / maxValue;
    
    // Draw OEL reference line
    const oelY = 150 - (oel * scaleFactor);
    ctx.beginPath();
    ctx.moveTo(30, oelY);
    ctx.lineTo(270, oelY);
    ctx.strokeStyle = '#ffc107';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw OEL label
    ctx.fillStyle = '#ffc107';
    ctx.font = '12px Arial';
    ctx.fillText(`OEL: ${oel.toFixed(1)} ppm`, 280, oelY - 5);
    
    // Draw concentration bar
    const concentrationHeight = concentration * scaleFactor;
    const concentrationY = 150 - concentrationHeight;
    
    // Choose color based on ratio
    let barColor;
    if (ratio < 0.5) barColor = '#28a745';
    else if (ratio < 1.0) barColor = '#fd7e14';
    else barColor = '#dc3545';
    
    ctx.fillStyle = barColor;
    ctx.fillRect(100, concentrationY, barWidth, concentrationHeight);
    
    // Add concentration value
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${concentration.toFixed(1)} ppm`, 100 + barWidth/2, concentrationY + concentrationHeight/2);
    
    // Add bar label
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('Actual Concentration', 100 + barWidth/2, 170);
    
    // Draw ratio indicator
    if (ratio > 1) {
        const excess = ratio - 1;
        ctx.fillStyle = '#721c24';
        const excessHeight = excess * oel * scaleFactor;
        ctx.fillRect(100, concentrationY - excessHeight, barWidth, excessHeight);
        
        // Add excess label
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.fillText(`+${(excess * 100).toFixed(0)}%`, 100 + barWidth/2, concentrationY - excessHeight/2);
    }
    
    // Add ratio text
    ctx.fillStyle = barColor;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Exposure Ratio: ${ratio.toFixed(2)}`, 150, 20);
}

function loadChemicalDatabase() {
    // Common chemicals database (simplified)
    const chemicals = [
        { name: 'Benzene', cas: '71-43-2', oel: 1, unit: 'ppm', category: 'Carcinogen' },
        { name: 'Toluene', cas: '108-88-3', oel: 50, unit: 'ppm', category: 'Solvent' },
        { name: 'Xylene', cas: '1330-20-7', oel: 100, unit: 'ppm', category: 'Solvent' },
        { name: 'Formaldehyde', cas: '50-00-0', oel: 0.75, unit: 'ppm', category: 'Sensitizer' },
        { name: 'Lead', cas: '7439-92-1', oel: 0.05, unit: 'mg/m3', category: 'Heavy Metal' },
        { name: 'Asbestos', cas: '1332-21-4', oel: 0.1, unit: 'fibers/cc', category: 'Carcinogen' },
        { name: 'Carbon Monoxide', cas: '630-08-0', oel: 25, unit: 'ppm', category: 'Asphyxiant' },
        { name: 'Hydrogen Sulfide', cas: '7783-06-4', oel: 10, unit: 'ppm', category: 'Toxic Gas' },
        { name: 'Chlorine', cas: '7782-50-5', oel: 0.5, unit: 'ppm', category: 'Irritant Gas' },
        { name: 'Ammonia', cas: '7664-41-7', oel: 25, unit: 'ppm', category: 'Irritant Gas' }
    ];
    
    const database = document.getElementById('chemical-database');
    if (database) {
        database.innerHTML = chemicals.map(chem => `
            <tr class="chemical-item" data-name="${chem.name}" data-oel="${chem.oel}" data-unit="${chem.unit}">
                <td>${chem.name}</td>
                <td>${chem.cas}</td>
                <td>${chem.oel} ${chem.unit}</td>
                <td>${chem.category}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary use-chemical">
                        <i class="fas fa-plus"></i> Use
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Add click handlers
        document.querySelectorAll('.use-chemical').forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const name = row.dataset.name;
                const oel = row.dataset.oel;
                const unit = row.dataset.unit;
                
                document.getElementById('chemical-name').value = name;
                document.getElementById('oel').value = oel;
                document.getElementById('oel-unit').value = unit;
                
                showNotification(`Loaded ${name} (OEL: ${oel} ${unit})`, 'info');
            });
        });
    }
}

function updateElementText(selector, text, parent = document) {
    const element = parent.querySelector(selector);
    if (element) {
        element.textContent = text;
    }
}

function resetChemicalExposure() {
    const form = document.querySelector('#chemical-form');
    const resultBox = document.getElementById('chemical-result');
    
    if (form) form.reset();
    if (resultBox) resultBox.classList.remove('active');
    
    showNotification('Chemical exposure calculator has been reset.', 'info');
}

// Export for use in main.js
window.ChemicalCalculator = {
    calculate: calculateChemicalExposure,
    reset: resetChemicalExposure
};
