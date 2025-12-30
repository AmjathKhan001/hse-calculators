// risk-assessment.js - Risk Assessment Calculator Logic

document.addEventListener('DOMContentLoaded', function() {
    // Initialize risk assessment calculator
    const calculateBtn = document.getElementById('calculate-risk');
    const resetBtn = document.getElementById('reset-risk');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateRiskAssessment);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetRiskAssessment);
    }
    
    // Initialize tooltips for risk matrix
    initRiskMatrixTooltips();
    
    console.log('Risk Assessment Calculator initialized');
});

function calculateRiskAssessment() {
    // Get form values
    const probability = parseFloat(document.getElementById('probability').value);
    const severity = parseFloat(document.getElementById('severity').value);
    const existingControls = parseFloat(document.getElementById('existing-controls').value) || 1;
    const exposureFrequency = document.getElementById('exposure-frequency').value || 'occasional';
    
    // Validate inputs
    if (isNaN(probability) || probability < 1 || probability > 5) {
        showNotification('Please enter a valid probability value (1-5).', 'error');
        return;
    }
    
    if (isNaN(severity) || severity < 1 || severity > 5) {
        showNotification('Please enter a valid severity value (1-5).', 'error');
        return;
    }
    
    // Calculate raw risk score
    const rawRiskScore = probability * severity;
    
    // Apply existing controls factor (1 = no control, 0.5 = good control, etc.)
    const controlFactor = existingControls;
    const adjustedRiskScore = rawRiskScore * controlFactor;
    
    // Determine risk level and color
    let riskLevel, riskColor, riskDescription, recommendations;
    
    if (adjustedRiskScore <= 5) {
        riskLevel = 'Low';
        riskColor = '#28a745';
        riskDescription = 'Acceptable risk with routine monitoring';
        recommendations = [
            'Maintain existing controls',
            'Routine monitoring and review',
            'Document risk assessment'
        ];
    } else if (adjustedRiskScore <= 10) {
        riskLevel = 'Medium';
        riskColor = '#ffc107';
        riskDescription = 'Moderate risk requiring attention';
        recommendations = [
            'Review existing controls',
            'Consider additional safety measures',
            'Increase monitoring frequency',
            'Provide specific training'
        ];
    } else if (adjustedRiskScore <= 15) {
        riskLevel = 'High';
        riskColor = '#fd7e14';
        riskDescription = 'High risk requiring immediate action';
        recommendations = [
            'Implement additional controls immediately',
            'Restrict access to area',
            'Provide specialized training',
            'Conduct regular safety audits'
        ];
    } else {
        riskLevel = 'Extreme';
        riskColor = '#dc3545';
        riskDescription = 'Unacceptable risk - stop activity';
        recommendations = [
            'STOP activity immediately',
            'Implement engineering controls',
            'Review and redesign process',
            'Conduct detailed hazard analysis'
        ];
    }
    
    // Calculate risk reduction needed
    const targetRisk = 5; // Target low risk
    const riskReductionNeeded = Math.max(0, adjustedRiskScore - targetRisk);
    
    // Calculate risk reduction percentage
    const reductionPercentage = ((adjustedRiskScore - targetRisk) / adjustedRiskScore * 100).toFixed(1);
    
    // Display results
    displayRiskResults({
        rawScore: rawRiskScore,
        adjustedScore: adjustedRiskScore.toFixed(1),
        probability: probability,
        severity: severity,
        controlFactor: controlFactor,
        riskLevel: riskLevel,
        riskColor: riskColor,
        description: riskDescription,
        recommendations: recommendations,
        exposureFrequency: exposureFrequency,
        riskReductionNeeded: riskReductionNeeded.toFixed(1),
        reductionPercentage: reductionPercentage
    });
    
    // Update risk matrix visualization
    updateRiskMatrix(probability, severity, adjustedRiskScore);
    
    // Show success notification
    showNotification('Risk assessment completed successfully!', 'success');
}

function displayRiskResults(results) {
    const resultBox = document.getElementById('risk-result');
    if (!resultBox) return;
    
    // Update main result values
    const riskValueElement = resultBox.querySelector('.result-value');
    if (riskValueElement) {
        riskValueElement.textContent = results.adjustedScore;
        riskValueElement.style.color = results.riskColor;
    }
    
    const riskLevelElement = resultBox.querySelector('.risk-level');
    if (riskLevelElement) {
        riskLevelElement.textContent = results.riskLevel;
        riskLevelElement.className = 'risk-level badge';
        riskLevelElement.style.backgroundColor = results.riskColor;
        riskLevelElement.style.color = results.riskLevel === 'Extreme' ? '#fff' : '#000';
    }
    
    // Update interpretation
    const interpretationElement = resultBox.querySelector('.result-interpretation');
    if (interpretationElement) {
        interpretationElement.textContent = results.description;
        interpretationElement.style.borderLeftColor = results.riskColor;
    }
    
    // Update probability and severity display
    const probabilityElement = resultBox.querySelector('#result-probability');
    const severityElement = resultBox.querySelector('#result-severity');
    
    if (probabilityElement) probabilityElement.textContent = results.probability;
    if (severityElement) severityElement.textContent = results.severity;
    
    // Update control effectiveness
    const controlElement = resultBox.querySelector('#result-controls');
    if (controlElement) {
        const effectiveness = results.controlFactor <= 0.7 ? 'Good' : 
                             results.controlFactor <= 0.9 ? 'Fair' : 'Poor';
        controlElement.textContent = `${effectiveness} (Factor: ${results.controlFactor})`;
    }
    
    // Update exposure frequency
    const exposureElement = resultBox.querySelector('#result-exposure');
    if (exposureElement) {
        const frequencyMap = {
            'continuous': 'Continuous (Daily)',
            'frequent': 'Frequent (Weekly)',
            'occasional': 'Occasional (Monthly)',
            'rare': 'Rare (Yearly)'
        };
        exposureElement.textContent = frequencyMap[results.exposureFrequency] || results.exposureFrequency;
    }
    
    // Update recommendations list
    const recommendationsElement = resultBox.querySelector('#risk-recommendations');
    if (recommendationsElement) {
        recommendationsElement.innerHTML = '';
        results.recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
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

function updateRiskMatrix(probability, severity, riskScore) {
    const matrix = document.getElementById('risk-matrix-visual');
    if (!matrix) return;
    
    // Clear previous highlights
    matrix.querySelectorAll('.matrix-cell').forEach(cell => {
        cell.classList.remove('active');
    });
    
    // Highlight current cell
    const cellId = `cell-${probability}-${severity}`;
    const currentCell = document.getElementById(cellId);
    if (currentCell) {
        currentCell.classList.add('active');
        
        // Add risk score to cell
        const scoreSpan = currentCell.querySelector('.risk-score') || document.createElement('span');
        scoreSpan.className = 'risk-score';
        scoreSpan.textContent = riskScore.toFixed(1);
        scoreSpan.style.color = '#fff';
        scoreSpan.style.fontWeight = 'bold';
        
        if (!currentCell.querySelector('.risk-score')) {
            currentCell.appendChild(scoreSpan);
        }
    }
    
    // Update legend
    updateRiskLegend(riskScore);
}

function updateRiskLegend(riskScore) {
    const legend = document.getElementById('risk-legend');
    if (!legend) return;
    
    let riskCategory;
    if (riskScore <= 5) riskCategory = 'low';
    else if (riskScore <= 10) riskCategory = 'medium';
    else if (riskScore <= 15) riskCategory = 'high';
    else riskCategory = 'extreme';
    
    legend.querySelectorAll('.legend-item').forEach(item => {
        if (item.dataset.category === riskCategory) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function initRiskMatrixTooltips() {
    const matrixCells = document.querySelectorAll('.matrix-cell');
    matrixCells.forEach(cell => {
        const probability = cell.dataset.probability;
        const severity = cell.dataset.severity;
        
        if (probability && severity) {
            const riskScore = parseInt(probability) * parseInt(severity);
            cell.setAttribute('data-tooltip', `Probability: ${probability}, Severity: ${severity}, Risk Score: ${riskScore}`);
        }
    });
}

function resetRiskAssessment() {
    const form = document.querySelector('#risk-form');
    const resultBox = document.getElementById('risk-result');
    
    if (form) {
        form.reset();
    }
    
    if (resultBox) {
        resultBox.classList.remove('active');
    }
    
    // Clear matrix highlights
    document.querySelectorAll('.matrix-cell.active').forEach(cell => {
        cell.classList.remove('active');
    });
    
    // Clear legend highlights
    document.querySelectorAll('.legend-item.active').forEach(item => {
        item.classList.remove('active');
    });
    
    showNotification('Risk assessment form has been reset.', 'info');
}

// Export function for use in main.js
window.RiskCalculator = {
    calculate: calculateRiskAssessment,
    reset: resetRiskAssessment
};