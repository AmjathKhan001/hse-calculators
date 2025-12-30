// calculator-utils.js - Utility functions for all calculators
// This should be loaded AFTER main.js

const CalculatorUtils = {
    // Common validation functions
    validateNumber(value, min, max) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max ? num : null;
    },
    
    validateRequired(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },
    
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    // Format numbers with units
    formatNumber(value, decimals = 2) {
        return parseFloat(value).toFixed(decimals);
    },
    
    formatWithCommas(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    // Unit conversions
    convertUnits(value, fromUnit, toUnit) {
        const conversions = {
            // Length
            'ft': { 'm': 0.3048, 'cm': 30.48 },
            'm': { 'ft': 3.28084, 'cm': 100 },
            'cm': { 'm': 0.01, 'ft': 0.0328084 },
            
            // Weight
            'lb': { 'kg': 0.453592 },
            'kg': { 'lb': 2.20462 },
            
            // Pressure
            'psi': { 'kpa': 6.89476 },
            'kpa': { 'psi': 0.145038 },
            
            // Temperature (special handling needed)
            'celsius': { 'fahrenheit': (c) => (c * 9/5) + 32 },
            'fahrenheit': { 'celsius': (f) => (f - 32) * 5/9 },
            
            // Noise
            'db': { 'dba': 1 }, // Simplified
            'dba': { 'db': 1 },
            
            // Time
            'hours': { 'minutes': 60, 'seconds': 3600 },
            'minutes': { 'hours': 1/60, 'seconds': 60 },
            'seconds': { 'hours': 1/3600, 'minutes': 1/60 }
        };
        
        if (fromUnit === toUnit) return value;
        
        const conversion = conversions[fromUnit]?.[toUnit];
        if (!conversion) return value;
        
        if (typeof conversion === 'function') {
            return conversion(value);
        }
        
        return value * conversion;
    },
    
    // Risk matrix calculations
    calculateRiskMatrix(probability, severity) {
        const riskScore = probability * severity;
        let level, color, recommendation;
        
        if (riskScore <= 5) {
            level = 'Low';
            color = '#d4edda';
            recommendation = 'Routine monitoring required. Maintain current controls.';
        } else if (riskScore <= 10) {
            level = 'Moderate';
            color = '#fff3cd';
            recommendation = 'Additional controls may be needed. Review procedures.';
        } else if (riskScore <= 15) {
            level = 'High';
            color = '#f8d7da';
            recommendation = 'Immediate action required. Implement additional controls.';
        } else {
            level = 'Extreme';
            color = '#721c24';
            recommendation = 'Stop activity immediately. Implement comprehensive controls.';
        }
        
        return {
            score: riskScore,
            level: level,
            color: color,
            recommendation: recommendation
        };
    },
    
    // OSHA calculations
    calculateTRIR(recordableInjuries, hoursWorked) {
        return (recordableInjuries * 200000) / hoursWorked;
    },
    
    calculateDART(cases, hoursWorked) {
        return (cases * 200000) / hoursWorked;
    },
    
    calculateLTIFR(lostTimeInjuries, hoursWorked) {
        return (lostTimeInjuries * 1_000_000) / hoursWorked;
    },
    
    // Noise exposure calculations
    calculateNoiseDose(levels, times) {
        if (levels.length !== times.length) return null;
        
        let totalDose = 0;
        for (let i = 0; i < levels.length; i++) {
            const permissibleTime = Math.pow(2, (85 - levels[i]) / 3) * 8;
            const dose = times[i] / permissibleTime;
            totalDose += dose;
        }
        
        return totalDose * 100; // As percentage
    },
    
    calculateTWA(levels, times) {
        const dose = this.calculateNoiseDose(levels, times);
        if (dose === null) return null;
        
        // Convert dose percentage to TWA
        return 85 + (3 * Math.log2(dose / 100));
    },
    
    // Chemical exposure calculations
    calculateExposureRatio(concentration, oel) {
        return concentration / oel;
    },
    
    // Heat stress calculations
    calculateWBGT(indoorTemp, humidity, radiantHeat = 0) {
        // Simplified WBGT calculation
        return (0.7 * this.calculateWetBulb(indoorTemp, humidity)) + 
               (0.2 * radiantHeat) + 
               (0.1 * indoorTemp);
    },
    
    calculateWetBulb(temp, humidity) {
        // Simplified wet bulb calculation
        return temp * Math.atan(0.151977 * Math.sqrt(humidity + 8.313659)) +
               Math.atan(temp + humidity) -
               Math.atan(humidity - 1.676331) +
               0.00391838 * Math.pow(humidity, 1.5) * Math.atan(0.023101 * humidity) -
               4.686035;
    },
    
    // Fall protection calculations
    calculateFreeFallDistance(anchorHeight, workerHeight, lanyardLength, decelerationDistance = 1) {
        return Math.max(0, anchorHeight - workerHeight + lanyardLength + decelerationDistance);
    },
    
    calculateArrestForce(workerWeight, freeFallDistance, lanyardElongation = 0.1) {
        // Simplified calculation
        const g = 9.81; // m/s²
        const impactForce = (workerWeight * g * freeFallDistance) / (lanyardElongation * 0.5);
        return impactForce;
    },
    
    // Lifting safety calculations
    calculateRecommendedWeight(horizontalDistance, verticalDistance, asymmetryAngle = 0, coupling = 'good') {
        // Based on NIOSH lifting equation
        const lc = 23; // Load constant
        const hm = Math.max(10 / horizontalDistance, 1);
        const vm = 1 - (0.003 * Math.abs(verticalDistance - 75));
        const dm = 0.82 + (4.5 / Math.max(verticalDistance, 25));
        const am = 1 - (0.0032 * asymmetryAngle);
        
        let cm;
        switch(coupling) {
            case 'excellent': cm = 1.0; break;
            case 'good': cm = 0.95; break;
            case 'fair': cm = 0.90; break;
            case 'poor': cm = 0.85; break;
            default: cm = 0.90;
        }
        
        const rwl = lc * hm * vm * dm * am * cm;
        return Math.max(0, rwl);
    },
    
    calculateLiftingIndex(weight, recommendedWeight) {
        return weight / recommendedWeight;
    },
    
    // Ventilation calculations
    calculateAirChangesPerHour(airflow, roomVolume) {
        return (airflow * 60) / roomVolume; // CFM to ACH
    },
    
    calculateRequiredVentilation(occupants, areaPerPerson = 100) {
        // ASHRAE 62.1 simplified
        return occupants * 5; // CFM per person
    },
    
    // Safety training functions
    calculateTrainingEffectiveness(preTest, postTest) {
        const improvement = ((postTest - preTest) / preTest) * 100;
        return {
            improvement: improvement,
            effectiveness: improvement >= 20 ? 'High' : 
                          improvement >= 10 ? 'Moderate' : 'Low',
            recommendation: improvement >= 20 ? 'Excellent retention' :
                          improvement >= 10 ? 'Good retention, consider refresher' :
                          'Needs additional training'
        };
    },
    
    // Data export functions
    exportToCSV(data, filename) {
        const csv = this.convertToCSV(data);
        this.downloadFile(csv, filename + '.csv', 'text/csv');
    },
    
    exportToJSON(data, filename) {
        const json = JSON.stringify(data, null, 2);
        this.downloadFile(json, filename + '.json', 'application/json');
    },
    
    convertToCSV(data) {
        if (!Array.isArray(data) || data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [];
        
        // Add headers
        csvRows.push(headers.join(','));
        
        // Add rows
        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header];
                const escaped = ('' + value).replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }
        
        return csvRows.join('\n');
    },
    
    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type: type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },
    
    // Chart creation utility
    createChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        
        const ctx = canvas.getContext('2d');
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            }
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        
        return new Chart(ctx, {
            type: data.type || 'bar',
            data: data,
            options: mergedOptions
        });
    },
    
    // Local storage utilities
    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(`hse_${key}`, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(`hse_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    },
    
    clearLocalStorage(key) {
        try {
            if (key) {
                localStorage.removeItem(`hse_${key}`);
            } else {
                // Clear all HSE-related items
                Object.keys(localStorage).forEach(k => {
                    if (k.startsWith('hse_')) {
                        localStorage.removeItem(k);
                    }
                });
            }
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Make utilities available globally
window.CalculatorUtils = CalculatorUtils;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Calculator Utilities loaded');
});
