// lifting-safety.js - Lifting Safety Calculator Logic

document.addEventListener('DOMContentLoaded', function() {
    // Initialize lifting safety calculator
    const calculateBtn = document.getElementById('calculate-lifting');
    const resetBtn = document.getElementById('reset-lifting');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateLiftingSafety);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetLiftingSafety);
    }
    
    // Initialize team lift calculator
    initTeamLiftCalculator();
    
    console.log('Lifting Safety Calculator initialized');
});

function calculateLiftingSafety() {
    // Get load parameters
    const loadWeight = parseFloat(document.getElementById('load-weight').value);
    const loadShape = document.getElementById('load-shape').value;
    const loadSize = document.getElementById('load-size').value;
    const loadHandles = document.getElementById('load-handles').checked;
    
    // Get lifting parameters
    const horizontalDistance = parseFloat(document.getElementById('horizontal-distance').value);
    const verticalDistance = parseFloat(document.getElementById('vertical-distance').value);
    const asymmetryAngle = parseFloat(document.getElementById('asymmetry-angle').value) || 0;
    const frequency = parseInt(document.getElementById('lifting-frequency').value) || 1;
    const duration = parseFloat(document.getElementById('lifting-duration').value) || 1;
    
    // Get worker parameters
    const workerGender = document.getElementById('worker-gender').value;
    const workerExperience = document.getElementById('worker-experience').value;
    const workerPosture = document.getElementById('worker-posture').value;
    
    // Validate inputs
    if (isNaN(loadWeight) || loadWeight <= 0) {
        showNotification('Please enter a valid load weight.', 'error');
        return;
    }
    
    if (isNaN(horizontalDistance) || horizontalDistance <= 0) {
        showNotification('Please enter a valid horizontal distance.', 'error');
        return;
    }
    
    if (isNaN(verticalDistance) || verticalDistance <= 0) {
        showNotification('Please enter a valid vertical distance.', 'error');
        return;
    }
    
    // Calculate Recommended Weight Limit (RWL) using NIOSH equation
    const rwl = calculateRWL(loadWeight, horizontalDistance, verticalDistance, asymmetryAngle, loadHandles);
    
    // Calculate Lifting Index (LI)
    const liftingIndex = calculateLiftingIndex(loadWeight, rwl);
    
    // Calculate Composite Lifting Index for multiple lifts
    const compositeLI = calculateCompositeLI(liftingIndex, frequency, duration);
    
    // Assess risk level
    const riskAssessment = assessLiftingRisk(liftingIndex, compositeLI, loadWeight, frequency);
    
    // Calculate biomechanical stresses
    const biomechanics = calculateBiomechanicalStresses(loadWeight, horizontalDistance, verticalDistance, workerPosture);
    
    // Determine recommended controls
    const controls = determineLiftingControls(riskAssessment, biomechanics, loadShape, loadSize);
    
    // Check compliance with standards
    const compliance = checkLiftingCompliance(rwl, liftingIndex, riskAssessment.level);
    
    // Generate recommendations
    const recommendations = generateLiftingRecommendations(
        riskAssessment, 
        controls, 
        compliance,
        biomechanics
    );
    
    // Display results
    displayLiftingResults({
        loadWeight: loadWeight,
        loadShape: loadShape,
        loadSize: loadSize,
        loadHandles: loadHandles,
        horizontalDistance: horizontalDistance,
        verticalDistance: verticalDistance,
        asymmetryAngle: asymmetryAngle,
        frequency: frequency,
        duration: duration,
        workerGender: workerGender,
        workerExperience: workerExperience,
        workerPosture: workerPosture,
        rwl: rwl,
        liftingIndex: liftingIndex,
        compositeLI: compositeLI,
        riskAssessment: riskAssessment,
        biomechanics: biomechanics,
        controls: controls,
        compliance: compliance,
        recommendations: recommendations
    });
    
    // Update lifting diagram
    updateLiftingDiagram(horizontalDistance, verticalDistance, asymmetryAngle, riskAssessment);
    
    showNotification('Lifting safety assessment completed!', 'success');
}

function calculateRWL(weight, horizontal, vertical, asymmetry, handles) {
    // NIOSH Lifting Equation: RWL = LC × HM × VM × DM × AM × FM × CM
    
    const LC = 23; // Load constant (kg)
    
    // Horizontal Multiplier
    const HM = Math.max(0.25, Math.min(1.0, 25 / horizontal));
    
    // Vertical Multiplier
    const VM = 1 - (0.003 * Math.abs(vertical - 75));
    
    // Distance Multiplier
    const DM = 0.82 + (4.5 / Math.max(vertical, 25));
    
    // Asymmetry Multiplier
    const AM = 1 - (0.0032 * asymmetry);
    
    // Frequency Multiplier (simplified for single lift)
    const FM = 1.0; // Will be adjusted in composite calculation
    
    // Coupling Multiplier
    let CM;
    if (handles) {
        CM = 1.0; // Good handles
    } else if (loadSize === 'compact') {
        CM = 0.95; // Fair coupling
    } else {
        CM = 0.90; // Poor coupling
    }
    
    // Calculate RWL
    const rwl = LC * HM * VM * DM * AM * FM * CM;
    
    return Math.max(0, rwl);
}

function calculateLiftingIndex(weight, rwl) {
    return weight / rwl;
}

function calculateCompositeLI(liftingIndex, frequency, duration) {
    // Simplified composite LI calculation
    let frequencyFactor;
    
    if (frequency <= 1) {
        frequencyFactor = 1.0;
    } else if (frequency <= 5) {
        frequencyFactor = 0.85;
    } else if (frequency <= 10) {
        frequencyFactor = 0.75;
    } else if (frequency <= 15) {
        frequencyFactor = 0.65;
    } else {
        frequencyFactor = 0.50;
    }
    
    let durationFactor;
    if (duration <= 1) {
        durationFactor = 1.0;
    } else if (duration <= 2) {
        durationFactor = 0.95;
    } else if (duration <= 8) {
        durationFactor = 0.85;
    } else {
        durationFactor = 0.75;
    }
    
    return liftingIndex * frequencyFactor * durationFactor;
}

function assessLiftingRisk(liftingIndex, compositeLI, weight, frequency) {
    let riskLevel, color, description, action;
    
    const maxIndex = Math.max(liftingIndex, compositeLI);
    
    if (maxIndex <= 1.0) {
        riskLevel = 'Low Risk';
        color = '#28a745';
        description = 'Acceptable lifting conditions';
        action = 'Maintain current practices';
    } else if (maxIndex <= 1.5) {
        riskLevel = 'Moderate Risk';
        color = '#ffc107';
        description = 'Some risk of musculoskeletal injury';
        action = 'Consider ergonomic improvements';
    } else if (maxIndex <= 2.0) {
        riskLevel = 'High Risk';
        color = '#fd7e14';
        description = 'High risk of injury - changes needed';
        action = 'Implement ergonomic controls';
    } else if (maxIndex <= 3.0) {
        riskLevel = 'Very High Risk';
        color = '#dc3545';
        description = 'Very high injury risk - immediate action required';
        action = 'Implement controls immediately';
    } else {
        riskLevel = 'Extreme Risk';
        color = '#721c24';
        description = 'Unacceptable risk - redesign task';
        action = 'STOP task and redesign';
    }
    
    // Adjust for weight
    if (weight > 25 && riskLevel === 'Low Risk') {
        riskLevel = 'Moderate Risk';
        description += ' - Heavy load requires caution';
    }
    
    // Adjust for frequency
    if (frequency > 10 && riskLevel !== 'Extreme Risk') {
        if (riskLevel === 'Low Risk') riskLevel = 'Moderate Risk';
        else if (riskLevel === 'Moderate Risk') riskLevel = 'High Risk';
    }
    
    return {
        level: riskLevel,
        color: color,
        description: description,
        action: action,
        liftingIndex: liftingIndex.toFixed(2),
        compositeLI: compositeLI.toFixed(2)
    };
}

function calculateBiomechanicalStresses(weight, horizontal, vertical, posture) {
    // Simplified biomechanical calculations
    const backCompression = 340 + (weight * 2.5) + (horizontal * 15);
    const shoulderForce = (weight * 9.81) * (horizontal / 0.5);
    
    // Adjust for posture
    let postureFactor = 1.0;
    switch(posture) {
        case 'good': postureFactor = 0.8; break;
        case 'fair': postureFactor = 1.0; break;
        case 'poor': postureFactor = 1.5; break;
        case 'twisted': postureFactor = 2.0; break;
    }
    
    const compressionForce = backCompression * postureFactor;
    
    // Determine risk levels
    let compressionRisk, shoulderRisk;
    
    if (compressionForce < 3400) {
        compressionRisk = { level: 'Low', color: '#28a745', value: compressionForce.toFixed(0) };
    } else if (compressionForce < 5000) {
        compressionRisk = { level: 'Moderate', color: '#ffc107', value: compressionForce.toFixed(0) };
    } else if (compressionForce < 6400) {
        compressionRisk = { level: 'High', color: '#fd7e14', value: compressionForce.toFixed(0) };
    } else {
        compressionRisk = { level: 'Very High', color: '#dc3545', value: compressionForce.toFixed(0) };
    }
    
    if (shoulderForce < 1000) {
        shoulderRisk = { level: 'Low', color: '#28a745', value: shoulderForce.toFixed(0) };
    } else if (shoulderForce < 2000) {
        shoulderRisk = { level: 'Moderate', color: '#ffc107', value: shoulderForce.toFixed(0) };
    } else {
        shoulderRisk = { level: 'High', color: '#dc3545', value: shoulderForce.toFixed(0) };
    }
    
    return {
        compression: compressionRisk,
        shoulder: shoulderRisk,
        backCompression: compressionForce,
        shoulderForce: shoulderForce
    };
}

function determineLiftingControls(riskAssessment, biomechanics, loadShape, loadSize) {
    const controls = [];
    
    // Always recommend basic controls
    controls.push('Train workers in proper lifting techniques');
    controls.push('Encourage team lifting for heavy/unwieldy loads');
    controls.push('Implement rest breaks during repetitive lifting');
    
    // Risk-based controls
    if (riskAssessment.level === 'Moderate Risk' || riskAssessment.level === 'High Risk') {
        controls.push('Use mechanical aids (dollies, hand trucks)');
        controls.push('Redesign workplace to reduce horizontal distance');
        controls.push('Use adjustable height work surfaces');
    }
    
    if (riskAssessment.level === 'High Risk' || riskAssessment.level === 'Very High Risk') {
        controls.push('Implement job rotation to reduce frequency');
        controls.push('Use powered lifting equipment (hoists, cranes)');
        controls.push('Redesign load to improve handles/grips');
    }
    
    if (riskAssessment.level === 'Extreme Risk') {
        controls.push('REDESIGN TASK - Eliminate manual lifting');
        controls.push('Implement conveyor systems or automation');
        controls.push('Use vacuum lifters or robotic systems');
    }
    
    // Biomechanics-based controls
    if (biomechanics.compression.level === 'High' || biomechanics.compression.level === 'Very High') {
        controls.push('Reduce load weight to decrease spinal compression');
        controls.push('Improve posture through workplace design');
        controls.push('Consider back support belts for high-risk tasks');
    }
    
    if (biomechanics.shoulder.level === 'High') {
        controls.push('Reduce horizontal reach distance');
        controls.push('Use overhead hoists for shoulder-level lifts');
        controls.push('Implement anti-fatigue matting');
    }
    
    // Load-based controls
    if (loadShape === 'awkward' || loadSize === 'large') {
        controls.push('Use team lifting with proper coordination');
        controls.push('Break load into smaller, manageable units');
        controls.push('Use specialized handling equipment');
    }
    
    return controls;
}

function checkLiftingCompliance(rwl, liftingIndex, riskLevel) {
    const violations = [];
    const warnings = [];
    
    // NIOSH compliance
    if (liftingIndex > 1.0) {
        violations.push('NIOSH: Lifting Index exceeds 1.0');
    } else {
        warnings.push('NIOSH: Acceptable lifting conditions');
    }
    
    // OSHA General Duty Clause
    if (riskLevel === 'Very High Risk' || riskLevel === 'Extreme Risk') {
        violations.push('OSHA: Recognized hazard requiring abatement');
    }
    
    // EU Manual Handling Directive
    if (rwl < 5) {
        warnings.push('EU: Consider if lifting can be avoided (Directive 90/269/EEC)');
    }
    
    // Industry standards
    if (liftingIndex > 3.0) {
        violations.push('Industry: Task redesign required');
    }
    
    return {
        violations: violations,
        warnings: warnings,
        isCompliant: violations.length === 0,
        rwl: rwl.toFixed(1)
    };
}

function generateLiftingRecommendations(riskAssessment, controls, compliance, biomechanics) {
    const recommendations = [];
    
    // Add all controls as recommendations
    controls.forEach(control => {
        recommendations.push(control);
    });
    
    // Add compliance recommendations
    if (!compliance.isCompliant) {
        recommendations.push('Address compliance violations: ' + compliance.violations.join(', '));
    }
    
    // Add biomechanics recommendations
    if (biomechanics.compression.level === 'High' || biomechanics.compression.level === 'Very High') {
        recommendations.push(`Reduce spinal compression (currently ${biomechanics.compression.value}N)`);
    }
    
    if (biomechanics.shoulder.level === 'High') {
        recommendations.push(`Reduce shoulder force (currently ${biomechanics.shoulder.value}N)`);
    }
    
    // Add training recommendations
    recommendations.push('Provide ergonomics training for all affected workers');
    recommendations.push('Include lifting safety in daily toolbox talks');
    
    // Add monitoring recommendations
    recommendations.push('Implement injury surveillance program');
    recommendations.push('Conduct regular ergonomic assessments');
    
    return recommendations;
}

function displayLiftingResults(results) {
    const resultBox = document.getElementById('lifting-result');
    if (!resultBox) return;
    
    // Update key metrics
    updateElementText('.rwl-value', `${results.rwl.toFixed(1)} kg`, resultBox);
    updateElementText('.li-value', results.liftingIndex.toFixed(2), resultBox);
    updateElementText('.composite-li-value', results.compositeLI.toFixed(2), resultBox);
    
    // Update risk assessment
    const riskElement = resultBox.querySelector('.risk-assessment');
    if (riskElement) {
        riskElement.textContent = results.riskAssessment.level;
        riskElement.style.backgroundColor = results.riskAssessment.color;
        riskElement.style.color = results.riskAssessment.level === 'Extreme Risk' ? '#fff' : '#000';
    }
    
    updateElementText('.risk-description', results.riskAssessment.description, resultBox);
    updateElementText('.risk-action', results.riskAssessment.action, resultBox);
    
    // Update biomechanics
    const compressionElement = resultBox.querySelector('.compression-risk');
    const shoulderElement = resultBox.querySelector('.shoulder-risk');
    
    if (compressionElement) {
        compressionElement.innerHTML = `
            <div class="biomech-risk" style="background-color: ${results.biomechanics.compression.color}">
                ${results.biomechanics.compression.level} (${results.biomechanics.compression.value}N)
            </div>
            <small>Spinal Compression Force</small>
        `;
    }
    
    if (shoulderElement) {
        shoulderElement.innerHTML = `
            <div class="biomech-risk" style="background-color: ${results.biomechanics.shoulder.color}">
                ${results.biomechanics.shoulder.level} (${results.biomechanics.shoulder.value}N)
            </div>
            <small>Shoulder Force</small>
        `;
    }
    
    // Update load details
    updateElementText('.load-details', 
        `${results.loadWeight} kg ${results.loadShape} load, ${results.loadSize} size`, 
        resultBox);
    
    updateElementText('.lifting-details', 
        `H: ${results.horizontalDistance} cm, V: ${results.verticalDistance} cm, Angle: ${results.asymmetryAngle}°`, 
        resultBox);
    
    updateElementText('.task-details', 
        `${results.frequency} lifts/hour for ${results.duration} hours`, 
        resultBox);
    
    // Update compliance
    const complianceElement = resultBox.querySelector('.compliance-status');
    if (complianceElement) {
        if (results.compliance.isCompliant) {
            complianceElement.innerHTML = `
                <div class="compliance-good">
                    <i class="fas fa-check-circle"></i>
                    Compliant with Standards
                    <br>
                    <small>RWL: ${results.compliance.rwl} kg</small>
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
    
    // Update recommendations
    const recommendationsElement = resultBox.querySelector('.recommendations-list');
    if (recommendationsElement) {
        recommendationsElement.innerHTML = '';
        results.recommendations.forEach(rec => {
            const li = document.createElement('li');
            const icon = rec.includes('STOP') || rec.includes('REDESIGN') ? 'fa-ban' : 'fa-check';
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

function updateLiftingDiagram(horizontal, vertical, asymmetry, riskAssessment) {
    const canvas = document.getElementById('lifting-diagram');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw floor
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(50, 180, 200, 20);
    
    // Draw worker at origin
    drawWorker(ctx, 100, 100);
    
    // Draw load position
    const loadX = 100 + (horizontal / 5); // Scale horizontal distance
    const loadY = 180 - (vertical / 2);   // Scale vertical distance
    
    // Draw load
    ctx.fillStyle = riskAssessment.color;
    ctx.fillRect(loadX - 15, loadY - 15, 30, 30);
    
    // Draw horizontal distance line
    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(115, 165); // Worker's hand position
    ctx.lineTo(loadX, loadY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw vertical distance line
    ctx.strokeStyle = '#28a745';
    ctx.beginPath();
    ctx.moveTo(loadX, loadY);
    ctx.lineTo(loadX, 180);
    ctx.stroke();
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // Horizontal distance label
    const midX = (115 + loadX) / 2;
    ctx.fillText(`${horizontal} cm`, midX, 150);
    
    // Vertical distance label
    ctx.fillText(`${vertical} cm`, loadX + 30, (loadY + 180) / 2);
    
    // Asymmetry angle arc
    if (asymmetry > 0) {
        ctx.strokeStyle = '#fd7e14';
        ctx.beginPath();
        ctx.arc(115, 165, 30, -Math.PI/2, (-Math.PI/2) + (asymmetry * Math.PI/180));
        ctx.stroke();
        
        ctx.fillText(`${asymmetry}°`, 140, 140);
    }
    
    // Add risk indicator
    ctx.fillStyle = riskAssessment.color;
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Risk: ${riskAssessment.level}`, 150, 30);
}

function drawWorker(ctx, x, y) {
    // Draw simplified worker
    ctx.fillStyle = '#6c757d';
    
    // Head
    ctx.beginPath();
    ctx.arc(x + 15, y, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Body
    ctx.fillRect(x + 10, y + 10, 10, 30);
    
    // Arms
    ctx.fillRect(x, y + 15, 30, 5);
    
    // Legs
    ctx.fillRect(x + 10, y + 40, 5, 20);
    ctx.fillRect(x + 15, y + 40, 5, 20);
}

function initTeamLiftCalculator() {
    const calculateTeamBtn = document.getElementById('calculate-team-lift');
    if (calculateTeamBtn) {
        calculateTeamBtn.addEventListener('click', calculateTeamLift);
    }
}

function calculateTeamLift() {
    const loadWeight = parseFloat(document.getElementById('team-load-weight').value);
    const teamSize = parseInt(document.getElementById('team-size').value);
    const coordination = document.getElementById('team-coordination').value;
    const communication = document.getElementById('team-communication').value;
    
    if (isNaN(loadWeight) || loadWeight <= 0) {
        showNotification('Please enter a valid load weight.', 'error');
        return;
    }
    
    if (isNaN(teamSize) || teamSize < 2 || teamSize > 8) {
        showNotification('Please enter a valid team size (2-8).', 'error');
        return;
    }
    
    // Calculate effective weight per person
    let efficiency;
    switch(coordination) {
        case 'excellent': efficiency = 0.9; break;
        case 'good': efficiency = 0.8; break;
        case 'fair': efficiency = 0.7; break;
        case 'poor': efficiency = 0.6; break;
        default: efficiency = 0.7;
    }
    
    // Communication adjustment
    if (communication === 'good') efficiency *= 1.1;
    else if (communication === 'poor') efficiency *= 0.9;
    
    const effectiveWeight = loadWeight / teamSize;
    const perceivedWeight = effectiveWeight / efficiency;
    
    // Determine if team lift is appropriate
    let recommendation;
    if (perceivedWeight <= 15) {
        recommendation = 'Team lift is appropriate and safe';
    } else if (perceivedWeight <= 25) {
        recommendation = 'Team lift acceptable with good coordination';
    } else {
        recommendation = 'Consider mechanical assistance - load too heavy for team lift';
    }
    
    displayTeamLiftResults(loadWeight, teamSize, effectiveWeight.toFixed(1), perceivedWeight.toFixed(1), recommendation);
}

function displayTeamLiftResults(loadWeight, teamSize, effectiveWeight, perceivedWeight, recommendation) {
    const resultsDiv = document.getElementById('team-lift-results');
    if (!resultsDiv) return;
    
    resultsDiv.innerHTML = `
        <div class="team-lift-result">
            <h4><i class="fas fa-users"></i> Team Lifting Analysis</h4>
            <p><strong>Load Weight:</strong> ${loadWeight} kg</p>
            <p><strong>Team Size:</strong> ${teamSize} persons</p>
            <p><strong>Effective Weight per Person:</strong> ${effectiveWeight} kg</p>
            <p><strong>Perceived Weight (with coordination):</strong> ${perceivedWeight} kg</p>
            
            <div class="recommendation">
                <i class="fas fa-bullhorn"></i>
                ${recommendation}
            </div>
            
            <h5>Team Lifting Guidelines</h5>
            <ul class="guidelines">
                <li>Designate a team leader for coordination</li>
                <li>Communicate clearly throughout the lift</li>
                <li>Lift and lower in unison</li>
                <li>Plan the route before starting</li>
                <li>Use proper lifting technique</li>
            </ul>
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

function resetLiftingSafety() {
    const form = document.querySelector('#lifting-form');
    const resultBox = document.getElementById('lifting-result');
    const teamResults = document.getElementById('team-lift-results');
    
    if (form) form.reset();
    if (resultBox) resultBox.classList.remove('active');
    if (teamResults) {
        teamResults.classList.remove('active');
        teamResults.innerHTML = '';
    }
    
    showNotification('Lifting safety calculator has been reset.', 'info');
}

// Export for use in main.js
window.LiftingCalculator = {
    calculate: calculateLiftingSafety,
    reset: resetLiftingSafety
};
