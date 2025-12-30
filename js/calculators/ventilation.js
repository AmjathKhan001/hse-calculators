// ventilation.js - Ventilation Calculator Logic

document.addEventListener('DOMContentLoaded', function() {
    // Initialize ventilation calculator
    const calculateBtn = document.getElementById('calculate-ventilation');
    const resetBtn = document.getElementById('reset-ventilation');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateVentilation);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetVentilation);
    }
    
    // Initialize contaminant calculator
    initContaminantCalculator();
    
    console.log('Ventilation Calculator initialized');
});

function calculateVentilation() {
    // Get room parameters
    const roomLength = parseFloat(document.getElementById('room-length').value);
    const roomWidth = parseFloat(document.getElementById('room-width').value);
    const roomHeight = parseFloat(document.getElementById('room-height').value);
    const roomType = document.getElementById('room-type').value;
    
    // Get occupancy
    const numOccupants = parseInt(document.getElementById('num-occupants').value) || 0;
    const activityLevel = document.getElementById('activity-level').value;
    
    // Get contaminant info
    const contaminantType = document.getElementById('contaminant-type').value;
    const emissionRate = parseFloat(document.getElementById('emission-rate').value) || 0;
    const contaminantUnit = document.getElementById('contaminant-unit').value;
    
    // Get ventilation system
    const ventilationType = document.getElementById('ventilation-type').value;
    const airChanges = parseFloat(document.getElementById('air-changes').value);
    const efficiency = parseFloat(document.getElementById('filter-efficiency').value) || 0;
    
    // Validate inputs
    if (isNaN(roomLength) || roomLength <= 0 || 
        isNaN(roomWidth) || roomWidth <= 0 || 
        isNaN(roomHeight) || roomHeight <= 0) {
        showNotification('Please enter valid room dimensions.', 'error');
        return;
    }
    
    if (isNaN(airChanges) || airChanges <= 0) {
        showNotification('Please enter a valid air changes per hour value.', 'error');
        return;
    }
    
    // Calculate room volume
    const roomVolume = roomLength * roomWidth * roomHeight;
    const floorArea = roomLength * roomWidth;
    
    // Calculate required ventilation rates
    const occupancyRate = calculateOccupancyVentilation(numOccupants, activityLevel);
    const areaRate = calculateAreaVentilation(floorArea, roomType);
    const contaminantRate = calculateContaminantVentilation(emissionRate, contaminantType);
    
    // Calculate total required airflow
    const requiredAirflow = Math.max(occupancyRate, areaRate, contaminantRate);
    
    // Calculate actual airflow from ACH
    const actualAirflow = (roomVolume * airChanges) / 60; // CFM
    
    // Calculate ventilation effectiveness
    const effectiveness = calculateEffectiveness(actualAirflow, requiredAirflow, ventilationType);
    
    // Calculate contaminant concentration
    const concentration = calculateConcentration(emissionRate, actualAirflow, efficiency);
    
    // Calculate air distribution
    const distribution = assessAirDistribution(ventilationType, roomVolume, actualAirflow);
    
    // Check standards compliance
    const compliance = checkVentilationStandards(requiredAirflow, actualAirflow, roomType);
    
    // Determine air quality
    const airQuality = assessAirQuality(concentration, contaminantType, effectiveness);
    
    // Generate recommendations
    const recommendations = generateVentilationRecommendations(
        effectiveness, 
        airQuality, 
        compliance,
        distribution
    );
    
    // Display results
    displayVentilationResults({
        roomVolume: roomVolume,
        floorArea: floorArea,
        roomType: roomType,
        numOccupants: numOccupants,
        activityLevel: activityLevel,
        contaminantType: contaminantType,
        emissionRate: emissionRate,
        contaminantUnit: contaminantUnit,
        ventilationType: ventilationType,
        airChanges: airChanges,
        filterEfficiency: efficiency,
        occupancyRate: occupancyRate,
        areaRate: areaRate,
        contaminantRate: contaminantRate,
        requiredAirflow: requiredAirflow,
        actualAirflow: actualAirflow,
        effectiveness: effectiveness,
        concentration: concentration,
        distribution: distribution,
        compliance: compliance,
        airQuality: airQuality,
        recommendations: recommendations
    });
    
    // Update ventilation diagram
    updateVentilationDiagram(ventilationType, effectiveness, distribution);
    
    showNotification('Ventilation analysis completed!', 'success');
}

function calculateOccupancyVentilation(numOccupants, activityLevel) {
    // ASHRAE 62.1 ventilation rates per person
    let ratePerPerson;
    
    switch(activityLevel) {
        case 'sedentary':
            ratePerPerson = 5; // CFM/person
            break;
        case 'light':
            ratePerPerson = 10;
            break;
        case 'moderate':
            ratePerPerson = 17;
            break;
        case 'heavy':
            ratePerPerson = 25;
            break;
        default:
            ratePerPerson = 5;
    }
    
    return numOccupants * ratePerPerson;
}

function calculateAreaVentilation(floorArea, roomType) {
    // ASHRAE 62.1 ventilation rates per area
    let ratePerArea;
    
    switch(roomType) {
        case 'office':
            ratePerArea = 0.06; // CFM/sqft
            break;
        case 'workshop':
            ratePerArea = 0.18;
            break;
        case 'laboratory':
            ratePerArea = 0.18;
            break;
        case 'warehouse':
            ratePerArea = 0.06;
            break;
        case 'classroom':
            ratePerArea = 0.12;
            break;
        case 'kitchen':
            ratePerArea = 0.18;
            break;
        case 'bathroom':
            ratePerArea = 0.50;
            break;
        default:
            ratePerArea = 0.12;
    }
    
    // Convert square meters to square feet if needed
    const areaSqFt = floorArea * 10.764;
    return areaSqFt * ratePerArea;
}

function calculateContaminantVentilation(emissionRate, contaminantType) {
    if (emissionRate <= 0) return 0;
    
    // Required dilution ventilation
    let requiredDilution;
    
    switch(contaminantType) {
        case 'dust':
            requiredDilution = 1000; // CFM per unit emission
            break;
        case 'fumes':
            requiredDilution = 2000;
            break;
        case 'vapor':
            requiredDilution = 1500;
            break;
        case 'gas':
            requiredDilution = 3000;
            break;
        case 'biological':
            requiredDilution = 2500;
            break;
        default:
            requiredDilution = 1000;
    }
    
    return emissionRate * requiredDilution;
}

function calculateEffectiveness(actualAirflow, requiredAirflow, ventilationType) {
    const ratio = actualAirflow / requiredAirflow;
    
    let effectiveness, color, description;
    
    if (ratio >= 1.5) {
        effectiveness = 'Excellent';
        color = '#28a745';
        description = 'More than adequate ventilation';
    } else if (ratio >= 1.2) {
        effectiveness = 'Good';
        color = '#7bd34f';
        description = 'Adequate ventilation';
    } else if (ratio >= 1.0) {
        effectiveness = 'Adequate';
        color = '#ffc107';
        description = 'Minimum requirements met';
    } else if (ratio >= 0.8) {
        effectiveness = 'Marginal';
        color = '#fd7e14';
        description = 'Below recommended levels';
    } else {
        effectiveness = 'Inadequate';
        color = '#dc3545';
        description = 'Insufficient ventilation';
    }
    
    // Adjust for ventilation type
    if (ventilationType === 'local-exhaust') {
        // Local exhaust is more effective
        if (effectiveness === 'Adequate') effectiveness = 'Good';
        if (effectiveness === 'Marginal') effectiveness = 'Adequate';
    } else if (ventilationType === 'natural') {
        // Natural ventilation is less reliable
        if (effectiveness === 'Good') effectiveness = 'Adequate';
        if (effectiveness === 'Excellent') effectiveness = 'Good';
    }
    
    return {
        level: effectiveness,
        color: color,
        description: description,
        ratio: ratio.toFixed(2),
        percentage: (ratio * 100).toFixed(0)
    };
}

function calculateConcentration(emissionRate, airflow, filterEfficiency) {
    if (emissionRate <= 0 || airflow <= 0) return 0;
    
    // Concentration = Emission rate / Airflow
    let concentration = emissionRate / airflow;
    
    // Apply filter efficiency
    if (filterEfficiency > 0) {
        concentration *= (1 - (filterEfficiency / 100));
    }
    
    return concentration;
}

function assessAirDistribution(ventilationType, roomVolume, airflow) {
    const airVelocity = (airflow * 0.0283) / roomVolume; // m/s
    
    let distribution, color, issues = [];
    
    if (ventilationType === 'mixing') {
        if (airVelocity > 0.5) {
            distribution = 'Good';
            color = '#28a745';
        } else if (airVelocity > 0.3) {
            distribution = 'Adequate';
            color = '#ffc107';
            issues.push('Low air movement in some areas');
        } else {
            distribution = 'Poor';
            color = '#dc3545';
            issues.push('Insufficient air movement');
            issues.push('Potential for stagnant zones');
        }
    } else if (ventilationType === 'displacement') {
        if (airVelocity > 0.2) {
            distribution = 'Good';
            color = '#28a745';
        } else {
            distribution = 'Poor';
            color = '#dc3545';
            issues.push('Insufficient displacement flow');
        }
    } else if (ventilationType === 'local-exhaust') {
        distribution = 'Focused';
        color = '#17a2b8';
        issues.push('Effective at source, check room-wide distribution');
    } else {
        distribution = 'Variable';
        color = '#6c757d';
        issues.push('Natural ventilation distribution varies with conditions');
    }
    
    return {
        level: distribution,
        color: color,
        velocity: airVelocity.toFixed(2),
        issues: issues
    };
}

function checkVentilationStandards(requiredAirflow, actualAirflow, roomType) {
    const standards = [];
    const violations = [];
    
    // ASHRAE 62.1 compliance
    if (actualAirflow >= requiredAirflow) {
        standards.push('ASHRAE 62.1: Compliant');
    } else {
        violations.push('ASHRAE 62.1: Insufficient ventilation');
        standards.push(`ASHRAE 62.1: ${((actualAirflow/requiredAirflow)*100).toFixed(0)}% of requirement`);
    }
    
    // OSHA compliance
    if (actualAirflow >= 15) { // OSHA minimum for occupied spaces
        standards.push('OSHA: Compliant (minimum 15 CFM/person)');
    } else {
        violations.push('OSHA: Below minimum requirement');
    }
    
    // Industry-specific standards
    if (roomType === 'laboratory') {
        if (actualAirflow >= 8 * 60) { // 8 air changes per hour minimum
            standards.push('Lab Standard: Compliant');
        } else {
            violations.push('Lab Standard: Below 8 ACH minimum');
        }
    }
    
    if (roomType === 'kitchen') {
        if (actualAirflow >= 15 * 60) { // 15 ACH for kitchens
            standards.push('Kitchen Ventilation: Compliant');
        } else {
            violations.push('Kitchen Ventilation: Below 15 ACH requirement');
        }
    }
    
    return {
        standards: standards,
        violations: violations,
        isCompliant: violations.length === 0
    };
}

function assessAirQuality(concentration, contaminantType, effectiveness) {
    let quality, color, description;
    
    // Determine based on concentration and contaminant type
    if (concentration <= 0) {
        quality = 'Excellent';
        color = '#28a745';
        description = 'No contaminant emissions detected';
    } else if (concentration <= 1) {
        quality = 'Good';
        color = '#7bd34f';
        description = 'Low contaminant levels';
    } else if (concentration <= 5) {
        quality = 'Moderate';
        color = '#ffc107';
        description = 'Acceptable contaminant levels';
    } else if (concentration <= 10) {
        quality = 'Poor';
        color = '#fd7e14';
        description = 'Elevated contaminant levels';
    } else {
        quality = 'Unhealthy';
        color = '#dc3545';
        description = 'High contaminant concentration';
    }
    
    // Adjust for ventilation effectiveness
    if (effectiveness.level === 'Inadequate' && quality !== 'Unhealthy') {
        quality = 'Poor';
        description += ' - Inadequate ventilation';
    }
    
    // Adjust for contaminant type
    if (contaminantType === 'gas' && concentration > 2) {
        quality = 'Unhealthy';
        description = 'Potentially hazardous gas concentration';
    }
    
    return {
        level: quality,
        color: color,
        description: description,
        concentration: concentration.toFixed(3)
    };
}

function generateVentilationRecommendations(effectiveness, airQuality, compliance, distribution) {
    const recommendations = [];
    
    // Always include basic recommendations
    recommendations.push('Regularly maintain ventilation equipment');
    recommendations.push('Monitor indoor air quality parameters');
    recommendations.push('Train staff on ventilation system operation');
    
    // Effectiveness-based recommendations
    if (effectiveness.level === 'Inadequate' || effectiveness.level === 'Marginal') {
        recommendations.push('Increase ventilation rate to meet requirements');
        recommendations.push('Consider upgrading ventilation system');
        recommendations.push('Implement temporary ventilation during high-occupancy periods');
    }
    
    // Air quality recommendations
    if (airQuality.level === 'Poor' || airQuality.level === 'Unhealthy') {
        recommendations.push('Increase local exhaust at contamination sources');
        recommendations.push('Consider adding air purification systems');
        recommendations.push('Implement source control measures');
        recommendations.push('Schedule contaminant-producing activities during low occupancy');
    }
    
    // Compliance recommendations
    if (!compliance.isCompliant) {
        recommendations.push('Address regulatory compliance issues immediately');
        recommendations.push('Document ventilation improvements for regulatory review');
    }
    
    // Distribution recommendations
    if (distribution.issues.length > 0) {
        distribution.issues.forEach(issue => {
            recommendations.push(`Address distribution issue: ${issue}`);
        });
        recommendations.push('Consider adding additional air diffusers or returns');
        recommendations.push('Balance air distribution system');
    }
    
    // Energy efficiency recommendations
    if (effectiveness.ratio > 1.5) {
        recommendations.push('Consider demand-controlled ventilation to save energy');
        recommendations.push('Optimize ventilation schedule based on occupancy');
    }
    
    return recommendations;
}

function displayVentilationResults(results) {
    const resultBox = document.getElementById('ventilation-result');
    if (!resultBox) return;
    
    // Update ventilation rates
    updateElementText('.required-airflow', `${results.requiredAirflow.toFixed(0)} CFM`, resultBox);
    updateElementText('.actual-airflow', `${results.actualAirflow.toFixed(0)} CFM`, resultBox);
    updateElementText('.air-changes-value', `${results.airChanges} ACH`, resultBox);
    
    // Update effectiveness
    const effectivenessElement = resultBox.querySelector('.effectiveness-rating');
    if (effectivenessElement) {
        effectivenessElement.textContent = results.effectiveness.level;
        effectivenessElement.style.backgroundColor = results.effectiveness.color;
        effectivenessElement.style.color = '#000';
    }
    
    updateElementText('.effectiveness-details', 
        `${results.effectiveness.description} (${results.effectiveness.percentage}% of requirement)`, 
        resultBox);
    
    // Update air quality
    const airQualityElement = resultBox.querySelector('.air-quality-rating');
    if (airQualityElement) {
        airQualityElement.textContent = results.airQuality.level;
        airQualityElement.style.backgroundColor = results.airQuality.color;
        airQualityElement.style.color = results.airQuality.level === 'Unhealthy' ? '#fff' : '#000';
    }
    
    updateElementText('.air-quality-details', results.airQuality.description, resultBox);
    
    if (results.concentration > 0) {
        updateElementText('.concentration-value', 
            `${results.airQuality.concentration} ${results.contaminantUnit || 'units'}/m³`, 
            resultBox);
    }
    
    // Update distribution
    const distributionElement = resultBox.querySelector('.distribution-rating');
    if (distributionElement) {
        distributionElement.textContent = results.distribution.level;
        distributionElement.style.backgroundColor = results.distribution.color;
        distributionElement.style.color = '#000';
    }
    
    updateElementText('.velocity-value', `${results.distribution.velocity} m/s`, resultBox);
    
    // Update compliance
    const complianceElement = resultBox.querySelector('.compliance-status');
    if (complianceElement) {
        if (results.compliance.isCompliant) {
            complianceElement.innerHTML = `
                <div class="compliance-good">
                    <i class="fas fa-check-circle"></i>
                    Compliant with Standards
                    <br>
                    <small>${results.compliance.standards.join(', ')}</small>
                </div>
            `;
        } else {
            complianceElement.innerHTML = `
                <div class="compliance-danger">
                    <i class="fas fa-exclamation-circle"></i>
                    Compliance Issues
                    <br>
                    <small>${results.compliance.violations.join(', ')}</small>
                </div>
            `;
        }
    }
    
    // Update room details
    updateElementText('.room-details', 
        `${results.roomVolume.toFixed(0)} m³ (${results.floorArea.toFixed(0)} m²) - ${results.roomType}`, 
        resultBox);
    
    updateElementText('.occupancy-details', 
        `${results.numOccupants} occupants - ${results.activityLevel} activity`, 
        resultBox);
    
    // Update recommendations
    const recommendationsElement = resultBox.querySelector('.recommendations-list');
    if (recommendationsElement) {
        recommendationsElement.innerHTML = '';
        results.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check"></i> ${rec}`;
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

function updateVentilationDiagram(ventilationType, effectiveness, distribution) {
    const canvas = document.getElementById('ventilation-diagram');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw room outline
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, 200, 150);
    
    // Draw ventilation based on type
    switch(ventilationType) {
        case 'mixing':
            drawMixingVentilation(ctx, effectiveness.ratio);
            break;
        case 'displacement':
            drawDisplacementVentilation(ctx, effectiveness.ratio);
            break;
        case 'local-exhaust':
            drawLocalExhaust(ctx, effectiveness.ratio);
            break;
        case 'natural':
            drawNaturalVentilation(ctx, effectiveness.ratio);
            break;
    }
    
    // Add effectiveness indicator
    ctx.fillStyle = effectiveness.color;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Effectiveness: ${effectiveness.level}`, 150, 30);
    
    // Add distribution indicator
    ctx.fillStyle = distribution.color;
    ctx.font = '12px Arial';
    ctx.fillText(`Distribution: ${distribution.level}`, 150, 220);
}

function drawMixingVentilation(ctx, effectiveness) {
    // Supply air from ceiling
    ctx.fillStyle = '#17a2b8';
    for (let i = 60; i < 240; i += 40) {
        drawAirArrow(ctx, i, 55, 90, effectiveness * 0.8);
    }
    
    // Return air to ceiling
    ctx.fillStyle = '#6c757d';
    for (let i = 70; i < 230; i += 40) {
        drawAirArrow(ctx, i, 195, -90, effectiveness * 0.6);
    }
    
    // Show mixing patterns
    ctx.strokeStyle = 'rgba(23, 162, 184, 0.3)';
    ctx.setLineDash([2, 2]);
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(150, 125, 30 + i * 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.setLineDash([]);
}

function drawDisplacementVentilation(ctx, effectiveness) {
    // Supply air from floor
    ctx.fillStyle = '#28a745';
    for (let i = 60; i < 240; i += 40) {
        drawAirArrow(ctx, i, 195, -90, effectiveness * 0.5);
    }
    
    // Return air from ceiling
    ctx.fillStyle = '#6c757d';
    for (let i = 70; i < 230; i += 40) {
        drawAirArrow(ctx, i, 55, 90, effectiveness * 0.5);
    }
    
    // Show displacement flow
    ctx.strokeStyle = 'rgba(40, 167, 69, 0.3)';
    ctx.lineWidth = 1;
    for (let x = 60; x <= 240; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 195);
        ctx.quadraticCurveTo(150, 125, x, 55);
        ctx.stroke();
    }
}

function drawLocalExhaust(ctx, effectiveness) {
    // Show exhaust hood
    ctx.fillStyle = '#dc3545';
    ctx.fillRect(100, 50, 100, 20);
    
    // Exhaust flow
    drawAirArrow(ctx, 150, 70, -90, effectiveness * 1.5);
    
    // Contaminant sources
    ctx.fillStyle = '#fd7e14';
    ctx.beginPath();
    ctx.arc(100, 150, 15, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(200, 150, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Show capture zones
    ctx.strokeStyle = 'rgba(220, 53, 69, 0.3)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(70, 70);
    ctx.lineTo(70, 180);
    ctx.lineTo(230, 180);
    ctx.lineTo(230, 70);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawNaturalVentilation(ctx, effectiveness) {
    // Windows
    ctx.fillStyle = '#4a90e2';
    ctx.fillRect(55, 75, 20, 50); // Left window
    ctx.fillRect(225, 125, 20, 50); // Right window
    
    // Air flow arrows
    ctx.fillStyle = '#17a2b8';
    drawAirArrow(ctx, 65, 100, 0, effectiveness * 0.3);
    drawAirArrow(ctx, 235, 150, 180, effectiveness * 0.3);
    
    // Natural convection currents
    ctx.strokeStyle = 'rgba(23, 162, 184, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(75, 100 + i * 20);
        ctx.bezierCurveTo(100, 80 + i * 20, 150, 70 + i * 20, 225, 125 + i * 20);
        ctx.stroke();
    }
}

function drawAirArrow(ctx, x, y, angle, strength) {
    const length = 20 * Math.min(strength, 2);
    const radians = angle * Math.PI / 180;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(radians);
    
    // Arrow shaft
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(length, 0);
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Arrow head
    ctx.beginPath();
    ctx.moveTo(length, 0);
    ctx.lineTo(length - 8, -4);
    ctx.lineTo(length - 8, 4);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

function initContaminantCalculator() {
    const calculateContaminantBtn = document.getElementById('calculate-contaminant');
    if (calculateContaminantBtn) {
        calculateContaminantBtn.addEventListener('click', calculateContaminantEmission);
    }
}

function calculateContaminantEmission() {
    const sourceType = document.getElementById('source-type').value;
    const sourceStrength = parseFloat(document.getElementById('source-strength').value);
    const duration = parseFloat(document.getElementById('emission-duration').value);
    
    if (isNaN(sourceStrength) || sourceStrength <= 0) {
        showNotification('Please enter a valid source strength.', 'error');
        return;
    }
    
    if (isNaN(duration) || duration <= 0) {
        showNotification('Please enter a valid emission duration.', 'error');
        return;
    }
    
    let emissionRate;
    
    switch(sourceType) {
        case 'welding':
            emissionRate = sourceStrength * 0.5; // mg/min per amp
            break;
        case 'grinding':
            emissionRate = sourceStrength * 2.0; // mg/min
            break;
        case 'painting':
            emissionRate = sourceStrength * 1.5; // mg/min per nozzle size
            break;
        case 'chemical-process':
            emissionRate = sourceStrength * 3.0; // mg/min
            break;
        case 'dust-generating':
            emissionRate = sourceStrength * 0.8; // mg/min
            break;
        default:
            emissionRate = sourceStrength;
    }
    
    const totalEmission = emissionRate * duration;
    
    displayContaminantResults(emissionRate.toFixed(2), totalEmission.toFixed(2));
}

function displayContaminantResults(rate, total) {
    const resultsDiv = document.getElementById('contaminant-results');
    if (!resultsDiv) return;
    
    resultsDiv.innerHTML = `
        <div class="contaminant-result">
            <h4><i class="fas fa-smog"></i> Contaminant Emission Analysis</h4>
            <p><strong>Emission Rate:</strong> ${rate} mg/min</p>
            <p><strong>Total Emission (per task):</strong> ${total} mg</p>
            <p><strong>Ventilation Required:</strong> ${(rate * 1000).toFixed(0)} CFM for dilution</p>
            
            <h5>Control Recommendations</h5>
            <ul class="control-list">
                <li><i class="fas fa-check"></i> Use local exhaust ventilation at source</li>
                <li><i class="fas fa-check"></i> Consider process enclosure</li>
                <li><i class="fas fa-check"></i> Implement administrative controls</li>
                <li><i class="fas fa-check"></i> Provide appropriate PPE</li>
            </ul>
            
            <p class="text-muted"><small>Note: Based on standard industrial emission factors</small></p>
        </div>
    `;
    
    resultsDiv.classList.add('active');
}

function updateElementText(selector, text, parent = document) {
    const element = parent.querySelector(selector);
    if (element) {
        element.textContent = text;
    }
}

function resetVentilation() {
    const form = document.querySelector('#ventilation-form');
    const resultBox = document.getElementById('ventilation-result');
    const contaminantResults = document.getElementById('contaminant-results');
    
    if (form) form.reset();
    if (resultBox) resultBox.classList.remove('active');
    if (contaminantResults) {
        contaminantResults.classList.remove('active');
        contaminantResults.innerHTML = '';
    }
    
    showNotification('Ventilation calculator has been reset.', 'info');
}

// Export for use in main.js
window.VentilationCalculator = {
    calculate: calculateVentilation,
    reset: resetVentilation
};
