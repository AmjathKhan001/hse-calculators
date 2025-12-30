// environmental-impact.js - Environmental Impact Calculator Logic

document.addEventListener('DOMContentLoaded', function() {
    // Initialize environmental impact calculator
    const calculateBtn = document.getElementById('calculate-environmental');
    const resetBtn = document.getElementById('reset-environmental');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateEnvironmentalImpact);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetEnvironmentalImpact);
    }
    
    // Initialize carbon calculator
    initCarbonCalculator();
    
    console.log('Environmental Impact Calculator initialized');
});

function calculateEnvironmentalImpact() {
    // Get energy consumption
    const electricityUsage = parseFloat(document.getElementById('electricity-usage').value) || 0;
    const fuelUsage = parseFloat(document.getElementById('fuel-usage').value) || 0;
    const energySource = document.getElementById('energy-source').value;
    
    // Get water consumption
    const waterUsage = parseFloat(document.getElementById('water-usage').value) || 0;
    const waterSource = document.getElementById('water-source').value;
    
    // Get waste generation
    const hazardousWaste = parseFloat(document.getElementById('hazardous-waste').value) || 0;
    const nonHazardousWaste = parseFloat(document.getElementById('non-hazardous-waste').value) || 0;
    const recyclingRate = parseFloat(document.getElementById('recycling-rate').value) || 0;
    
    // Get emissions
    const airEmissions = parseFloat(document.getElementById('air-emissions').value) || 0;
    const waterEmissions = parseFloat(document.getElementById('water-emissions').value) || 0;
    const soilEmissions = parseFloat(document.getElementById('soil-emissions').value) || 0;
    
    // Get operational parameters
    const operationScale = document.getElementById('operation-scale').value;
    const industryType = document.getElementById('industry-type').value;
    const location = document.getElementById('location').value;
    
    // Validate inputs
    if (electricityUsage < 0 || fuelUsage < 0 || waterUsage < 0) {
        showNotification('Please enter non-negative values for all inputs.', 'error');
        return;
    }
    
    // Calculate carbon footprint
    const carbonFootprint = calculateCarbonFootprint(electricityUsage, fuelUsage, energySource);
    
    // Calculate water footprint
    const waterFootprint = calculateWaterFootprint(waterUsage, waterSource);
    
    // Calculate waste impact
    const wasteImpact = calculateWasteImpact(hazardousWaste, nonHazardousWaste, recyclingRate);
    
    // Calculate total emissions impact
    const emissionsImpact = calculateEmissionsImpact(airEmissions, waterEmissions, soilEmissions);
    
    // Calculate overall environmental score
    const environmentalScore = calculateEnvironmentalScore(
        carbonFootprint, 
        waterFootprint, 
        wasteImpact, 
        emissionsImpact,
        operationScale
    );
    
    // Determine environmental rating
    const environmentalRating = assessEnvironmentalRating(environmentalScore);
    
    // Check regulatory compliance
    const compliance = checkEnvironmentalCompliance(
        carbonFootprint.totalCO2, 
        hazardousWaste, 
        airEmissions,
        location,
        industryType
    );
    
    // Calculate sustainability metrics
    const sustainability = calculateSustainabilityMetrics(
        electricityUsage, 
        waterUsage, 
        recyclingRate,
        operationScale
    );
    
    // Generate improvement recommendations
    const recommendations = generateEnvironmentalRecommendations(
        environmentalRating, 
        carbonFootprint, 
        waterFootprint, 
        wasteImpact,
        compliance
    );
    
    // Calculate potential savings
    const potentialSavings = calculatePotentialSavings(
        electricityUsage, 
        waterUsage, 
        wasteImpact,
        environmentalRating
    );
    
    // Display results
    displayEnvironmentalResults({
        electricityUsage: electricityUsage,
        fuelUsage: fuelUsage,
        energySource: energySource,
        waterUsage: waterUsage,
        waterSource: waterSource,
        hazardousWaste: hazardousWaste,
        nonHazardousWaste: nonHazardousWaste,
        recyclingRate: recyclingRate,
        airEmissions: airEmissions,
        waterEmissions: waterEmissions,
        soilEmissions: soilEmissions,
        operationScale: operationScale,
        industryType: industryType,
        location: location,
        carbonFootprint: carbonFootprint,
        waterFootprint: waterFootprint,
        wasteImpact: wasteImpact,
        emissionsImpact: emissionsImpact,
        environmentalScore: environmentalScore,
        environmentalRating: environmentalRating,
        compliance: compliance,
        sustainability: sustainability,
        recommendations: recommendations,
        potentialSavings: potentialSavings
    });
    
    // Update environmental chart
    updateEnvironmentalChart(carbonFootprint, waterFootprint, wasteImpact, emissionsImpact);
    
    showNotification('Environmental impact assessment completed!', 'success');
}

function calculateCarbonFootprint(electricity, fuel, energySource) {
    // Emission factors (kg CO2 per unit)
    const emissionFactors = {
        electricity: {
            coal: 0.98,      // kg CO2 per kWh
            natural_gas: 0.5,
            oil: 0.8,
            nuclear: 0.02,
            hydro: 0.01,
            wind: 0.01,
            solar: 0.02,
            biomass: 0.1,
            grid_average: 0.6
        },
        fuel: {
            diesel: 2.68,    // kg CO2 per liter
            gasoline: 2.31,
            natural_gas: 2.75, // per m³
            propane: 1.55,
            coal: 2.42       // per kg
        }
    };
    
    // Calculate electricity emissions
    const electricityFactor = emissionFactors.electricity[energySource] || emissionFactors.electricity.grid_average;
    const electricityCO2 = electricity * electricityFactor;
    
    // Calculate fuel emissions (assuming diesel if not specified)
    const fuelFactor = emissionFactors.fuel.diesel;
    const fuelCO2 = fuel * fuelFactor;
    
    const totalCO2 = electricityCO2 + fuelCO2;
    
    // Calculate equivalent metrics
    const carsEquivalent = totalCO2 / 4200; // Average car annual emissions
    const treesNeeded = totalCO2 / 21.77;   // kg CO2 absorbed by tree per year
    const flightEquivalent = totalCO2 / 200; // kg CO2 per hour of flight
    
    return {
        electricityCO2: electricityCO2,
        fuelCO2: fuelCO2,
        totalCO2: totalCO2,
        carsEquivalent: carsEquivalent.toFixed(1),
        treesNeeded: Math.ceil(treesNeeded),
        flightEquivalent: flightEquivalent.toFixed(1),
        perUnit: {
            electricity: electricityFactor,
            fuel: fuelFactor
        }
    };
}

function calculateWaterFootprint(waterUsage, waterSource) {
    // Water footprint factors (liters per unit of water used)
    const footprintFactors = {
        surface_water: 1.0,
        groundwater: 1.2,
        municipal: 1.5, // Includes treatment energy
        recycled: 0.3,
        rainwater: 0.1
    };
    
    const factor = footprintFactors[waterSource] || 1.0;
    const totalFootprint = waterUsage * factor;
    
    // Calculate equivalent metrics
    const swimmingPools = totalFootprint / 75000; // Average swimming pool volume
    const showers = totalFootprint / 65;         // Average shower water usage
    const drinkingWater = totalFootprint / 2;    // Daily drinking water per person
    
    return {
        totalFootprint: totalFootprint,
        factor: factor,
        swimmingPools: swimmingPools.toFixed(2),
        showers: Math.round(showers),
        drinkingWater: Math.round(drinkingWater),
        efficiency: waterSource === 'recycled' || waterSource === 'rainwater' ? 'High' : 'Low'
    };
}

function calculateWasteImpact(hazardous, nonHazardous, recyclingRate) {
    // Impact factors (environmental impact units per kg)
    const impactFactors = {
        hazardous: 10,
        non_hazardous: 1,
        recycled: -2  // Negative impact for recycling (beneficial)
    };
    
    const hazardousImpact = hazardous * impactFactors.hazardous;
    const nonHazardousImpact = nonHazardous * impactFactors.non_hazardous;
    
    // Calculate recycled amount
    const totalWaste = hazardous + nonHazardous;
    const recycledAmount = totalWaste * (recyclingRate / 100);
    const recyclingBenefit = recycledAmount * Math.abs(impactFactors.recycled);
    
    const totalImpact = hazardousImpact + nonHazardousImpact - recyclingBenefit;
    
    // Calculate landfill equivalents
    const landfillVolume = totalWaste * 0.001; // m³ per kg (approximate)
    const landfillArea = landfillVolume / 3;   // m² for 3m depth
    
    // Determine waste management efficiency
    let efficiency;
    if (recyclingRate >= 75) efficiency = 'Excellent';
    else if (recyclingRate >= 50) efficiency = 'Good';
    else if (recyclingRate >= 25) efficiency = 'Fair';
    else efficiency = 'Poor';
    
    return {
        hazardousImpact: hazardousImpact,
        nonHazardousImpact: nonHazardousImpact,
        recyclingBenefit: recyclingBenefit,
        totalImpact: totalImpact,
        landfillVolume: landfillVolume.toFixed(2),
        landfillArea: landfillArea.toFixed(2),
        recyclingRate: recyclingRate,
        efficiency: efficiency,
        totalWaste: totalWaste
    };
}

function calculateEmissionsImpact(air, water, soil) {
    // Impact weighting based on environmental damage
    const weights = {
        air: 1.5,   // Higher weight due to health impacts
        water: 1.2,
        soil: 1.0
    };
    
    const weightedAir = air * weights.air;
    const weightedWater = water * weights.water;
    const weightedSoil = soil * weights.soil;
    
    const totalImpact = weightedAir + weightedWater + weightedSoil;
    
    // Determine major impact area
    let majorImpact = 'None';
    if (air > water && air > soil) majorImpact = 'Air';
    else if (water > air && water > soil) majorImpact = 'Water';
    else if (soil > air && soil > water) majorImpact = 'Soil';
    
    return {
        airImpact: weightedAir,
        waterImpact: weightedWater,
        soilImpact: weightedSoil,
        totalImpact: totalImpact,
        majorImpact: majorImpact,
        weights: weights
    };
}

function calculateEnvironmentalScore(carbon, water, waste, emissions, scale) {
    // Normalize each component to 0-100 scale
    const maxValues = {
        carbon: getMaxCarbon(scale),
        water: getMaxWater(scale),
        waste: getMaxWaste(scale),
        emissions: getMaxEmissions(scale)
    };
    
    // Calculate scores (higher is better)
    const carbonScore = Math.max(0, 100 - (carbon.totalCO2 / maxValues.carbon * 100));
    const waterScore = Math.max(0, 100 - (water.totalFootprint / maxValues.water * 100));
    const wasteScore = Math.max(0, 100 - (waste.totalImpact / maxValues.waste * 100));
    const emissionsScore = Math.max(0, 100 - (emissions.totalImpact / maxValues.emissions * 100));
    
    // Weighted average
    const weights = {
        carbon: 0.35,
        water: 0.25,
        waste: 0.25,
        emissions: 0.15
    };
    
    const totalScore = 
        (carbonScore * weights.carbon) +
        (waterScore * weights.water) +
        (wasteScore * weights.waste) +
        (emissionsScore * weights.emissions);
    
    return {
        total: totalScore,
        components: {
            carbon: carbonScore,
            water: waterScore,
            waste: wasteScore,
            emissions: emissionsScore
        },
        weights: weights
    };
}

function getMaxCarbon(scale) {
    switch(scale) {
        case 'small': return 10000;  // kg CO2
        case 'medium': return 50000;
        case 'large': return 200000;
        case 'very_large': return 1000000;
        default: return 50000;
    }
}

function getMaxWater(scale) {
    switch(scale) {
        case 'small': return 1000;   // m³
        case 'medium': return 5000;
        case 'large': return 20000;
        case 'very_large': return 100000;
        default: return 5000;
    }
}

function getMaxWaste(scale) {
    switch(scale) {
        case 'small': return 100;    // impact units
        case 'medium': return 500;
        case 'large': return 2000;
        case 'very_large': return 10000;
        default: return 500;
    }
}

function getMaxEmissions(scale) {
    switch(scale) {
        case 'small': return 50;     // impact units
        case 'medium': return 250;
        case 'large': return 1000;
        case 'very_large': return 5000;
        default: return 250;
    }
}

function assessEnvironmentalRating(score) {
    const total = score.total;
    
    let rating, color, description;
    
    if (total >= 90) {
        rating = 'Excellent';
        color = '#28a745';
        description = 'Industry-leading environmental performance';
    } else if (total >= 80) {
        rating = 'Very Good';
        color = '#7bd34f';
        description = 'Strong environmental performance';
    } else if (total >= 70) {
        rating = 'Good';
        color = '#ffc107';
        description = 'Acceptable environmental performance';
    } else if (total >= 60) {
        rating = 'Fair';
        color = '#fd7e14';
        description = 'Environmental performance needs improvement';
    } else if (total >= 50) {
        rating = 'Poor';
        color = '#dc3545';
        description = 'Significant environmental improvements needed';
    } else {
        rating = 'Very Poor';
        color = '#721c24';
        description = 'Critical environmental concerns - immediate action required';
    }
    
    return {
        rating: rating,
        color: color,
        description: description,
        score: total.toFixed(1)
    };
}

function checkEnvironmentalCompliance(co2, hazardousWaste, airEmissions, location, industry) {
    const violations = [];
    const warnings = [];
    
    // Carbon compliance
    const carbonLimits = {
        'eu': 25000,    // kg CO2 per year threshold
        'usa': 50000,
        'china': 100000,
        'india': 75000,
        'global': 50000
    };
    
    const limit = carbonLimits[location] || carbonLimits.global;
    if (co2 > limit) {
        violations.push(`Carbon emissions exceed ${limit/1000} ton threshold`);
    }
    
    // Hazardous waste compliance
    if (hazardousWaste > 100) {
        warnings.push('Hazardous waste generation requires special permits');
    }
    if (hazardousWaste > 1000) {
        violations.push('Hazardous waste exceeds major generator threshold');
    }
    
    // Air emissions compliance
    const airLimits = {
        'manufacturing': 50,
        'chemical': 20,
        'energy': 100,
        'general': 30
    };
    
    const airLimit = airLimits[industry] || airLimits.general;
    if (airEmissions > airLimit) {
        violations.push(`Air emissions exceed ${airLimit} kg limit for ${industry} industry`);
    }
    
    // Regulatory framework
    const frameworks = [];
    if (location === 'eu') frameworks.push('EU ETS, Industrial Emissions Directive');
    if (location === 'usa') frameworks.push('Clean Air Act, RCRA, CERCLA');
    if (location === 'china') frameworks.push('Environmental Protection Law');
    if (location === 'india') frameworks.push('Environment Protection Act');
    
    return {
        violations: violations,
        warnings: warnings,
        isCompliant: violations.length === 0,
        frameworks: frameworks,
        carbonLimit: limit,
        airLimit: airLimit
    };
}

function calculateSustainabilityMetrics(electricity, water, recyclingRate, scale) {
    // Calculate efficiency metrics
    const electricityIntensity = electricity / getScaleFactor(scale);
    const waterIntensity = water / getScaleFactor(scale);
    
    // Determine efficiency ratings
    const electricityEfficiency = rateEfficiency(electricityIntensity, 'electricity', scale);
    const waterEfficiency = rateEfficiency(waterIntensity, 'water', scale);
    const wasteEfficiency = rateWasteEfficiency(recyclingRate);
    
    // Calculate circular economy score
    const circularEconomyScore = recyclingRate * 0.5 + 
                                (electricityEfficiency.score + waterEfficiency.score) / 2;
    
    return {
        electricity: electricityEfficiency,
        water: waterEfficiency,
        waste: wasteEfficiency,
        circularEconomy: circularEconomyScore.toFixed(1),
        overallEfficiency: ((electricityEfficiency.score + waterEfficiency.score + wasteEfficiency.score) / 3).toFixed(1)
    };
}

function getScaleFactor(scale) {
    switch(scale) {
        case 'small': return 1;
        case 'medium': return 5;
        case 'large': return 20;
        case 'very_large': return 100;
        default: return 5;
    }
}

function rateEfficiency(intensity, type, scale) {
    let benchmarks;
    
    if (type === 'electricity') {
        benchmarks = {
            small: { excellent: 1000, good: 2000, fair: 4000, poor: 6000 },
            medium: { excellent: 5000, good: 10000, fair: 20000, poor: 30000 },
            large: { excellent: 20000, good: 40000, fair: 80000, poor: 120000 },
            very_large: { excellent: 100000, good: 200000, fair: 400000, poor: 600000 }
        };
    } else { // water
        benchmarks = {
            small: { excellent: 100, good: 200, fair: 400, poor: 600 },
            medium: { excellent: 500, good: 1000, fair: 2000, poor: 3000 },
            large: { excellent: 2000, good: 4000, fair: 8000, poor: 12000 },
            very_large: { excellent: 10000, good: 20000, fair: 40000, poor: 60000 }
        };
    }
    
    const bench = benchmarks[scale] || benchmarks.medium;
    
    let rating, color, score;
    if (intensity <= bench.excellent) {
        rating = 'Excellent';
        color = '#28a745';
        score = 90;
    } else if (intensity <= bench.good) {
        rating = 'Good';
        color = '#7bd34f';
        score = 75;
    } else if (intensity <= bench.fair) {
        rating = 'Fair';
        color = '#ffc107';
        score = 60;
    } else if (intensity <= bench.poor) {
        rating = 'Poor';
        color = '#fd7e14';
        score = 40;
    } else {
        rating = 'Very Poor';
        color = '#dc3545';
        score = 20;
    }
    
    return {
        rating: rating,
        color: color,
        score: score,
        intensity: intensity.toFixed(0)
    };
}

function rateWasteEfficiency(recyclingRate) {
    let rating, color, score;
    
    if (recyclingRate >= 90) {
        rating = 'Excellent';
        color = '#28a745';
        score = 95;
    } else if (recyclingRate >= 75) {
        rating = 'Good';
        color = '#7bd34f';
        score = 80;
    } else if (recyclingRate >= 50) {
        rating = 'Fair';
        color = '#ffc107';
        score = 65;
    } else if (recyclingRate >= 25) {
        rating = 'Poor';
        color = '#fd7e14';
        score = 45;
    } else {
        rating = 'Very Poor';
        color = '#dc3545';
        score = 25;
    }
    
    return {
        rating: rating,
        color: color,
        score: score,
        rate: recyclingRate
    };
}

function generateEnvironmentalRecommendations(rating, carbon, water, waste, compliance) {
    const recommendations = [];
    
    // Always include basic recommendations
    recommendations.push('Implement environmental management system (ISO 14001)');
    recommendations.push('Conduct regular environmental audits');
    recommendations.push('Train staff on environmental responsibilities');
    
    // Rating-based recommendations
    if (rating.rating === 'Poor' || rating.rating === 'Very Poor') {
        recommendations.push('Develop comprehensive environmental improvement plan');
        recommendations.push('Consider hiring environmental consultant');
        recommendations.push('Set aggressive reduction targets');
    }
    
    if (rating.rating === 'Fair' || rating.rating === 'Good') {
        recommendations.push('Set continuous improvement targets');
        recommendations.push('Benchmark against industry leaders');
        recommendations.push('Consider environmental certification');
    }
    
    // Carbon reduction recommendations
    if (carbon.totalCO2 > 10000) {
        recommendations.push(`Reduce carbon footprint (currently ${(carbon.totalCO2/1000).toFixed(1)} tons CO2)`);
        recommendations.push('Implement energy efficiency measures');
        recommendations.push('Consider renewable energy sources');
        recommendations.push('Optimize transportation and logistics');
    }
    
    // Water conservation recommendations
    if (water.efficiency === 'Low') {
        recommendations.push('Implement water conservation measures');
        recommendations.push('Consider water recycling systems');
        recommendations.push('Install water-efficient equipment');
        recommendations.push('Monitor water usage with smart meters');
    }
    
    // Waste management recommendations
    if (waste.efficiency === 'Poor' || waste.efficiency === 'Fair') {
        recommendations.push(`Increase recycling rate (currently ${waste.recyclingRate}%)`);
        recommendations.push('Implement waste minimization program');
        recommendations.push('Conduct waste audit to identify reduction opportunities');
        recommendations.push('Consider composting organic waste');
    }
    
    // Compliance recommendations
    if (!compliance.isCompliant) {
        recommendations.push('Address compliance violations immediately');
        recommendations.push('Consult with regulatory agencies');
        recommendations.push('Document all compliance actions');
    }
    
    return recommendations;
}

function calculatePotentialSavings(electricity, water, waste, rating) {
    // Estimate potential savings from improvements
    const electricitySavings = electricity * 0.10 * 0.12; // 10% reduction at $0.12/kWh
    const waterSavings = water * 0.15 * 0.005; // 15% reduction at $0.005/L
    const wasteSavings = waste.totalWaste * 0.20 * 0.05; // 20% reduction at $0.05/kg disposal
    
    const annualSavings = (electricitySavings + waterSavings + wasteSavings) * 365;
    
    // Estimate carbon credit value
    const carbonCredits = waste.recyclingRate > 50 ? 1000 : 0; // Simplified
    
    // Potential grants/rebates
    let grants = 0;
    if (rating.rating === 'Poor' || rating.rating === 'Very Poor') {
        grants = 5000; // Potential for improvement grants
    }
    
    const totalPotential = annualSavings + carbonCredits + grants;
    
    return {
        electricity: electricitySavings.toFixed(2),
        water: waterSavings.toFixed(2),
        waste: wasteSavings.toFixed(2),
        annualSavings: annualSavings.toFixed(2),
        carbonCredits: carbonCredits,
        grants: grants,
        totalPotential: totalPotential.toFixed(2)
    };
}

function displayEnvironmentalResults(results) {
    const resultBox = document.getElementById('environmental-result');
    if (!resultBox) return;
    
    // Update environmental rating
    const ratingElement = resultBox.querySelector('.environmental-rating');
    if (ratingElement) {
        ratingElement.textContent = results.environmentalRating.rating;
        ratingElement.style.backgroundColor = results.environmentalRating.color;
        ratingElement.style.color = results.environmentalRating.rating === 'Very Poor' ? '#fff' : '#000';
    }
    
    updateElementText('.rating-score', `${results.environmentalRating.score}/100`, resultBox);
    updateElementText('.rating-description', results.environmentalRating.description, resultBox);
    
    // Update carbon footprint
    updateElementText('.carbon-total', `${(results.carbonFootprint.totalCO2/1000).toFixed(1)} tons`, resultBox);
    updateElementText('.carbon-equivalents', 
        `Equivalent to ${results.carbonFootprint.carsEquivalent} cars or ${results.carbonFootprint.flightEquivalent} flight hours`, 
        resultBox);
    
    // Update water footprint
    updateElementText('.water-total', `${results.waterFootprint.totalFootprint.toFixed(0)} L`, resultBox);
    updateElementText('.water-equivalents', 
        `Equivalent to ${results.waterFootprint.swimmingPools} swimming pools or ${results.waterFootprint.showers} showers`, 
        resultBox);
    
    // Update waste impact
    updateElementText('.waste-impact', `${results.wasteImpact.totalImpact.toFixed(0)} units`, resultBox);
    updateElementText('.recycling-rate', `${results.wasteImpact.recyclingRate}% (${results.wasteImpact.efficiency})`, resultBox);
    
    // Update emissions
    updateElementText('.emissions-total', `${results.emissionsImpact.totalImpact.toFixed(0)} units`, resultBox);
    updateElementText('.major-impact', results.emissionsImpact.majorImpact, resultBox);
    
    // Update sustainability metrics
    const sustainabilityElement = resultBox.querySelector('.sustainability-metrics');
    if (sustainabilityElement) {
        sustainabilityElement.innerHTML = `
            <div class="metric">
                <span class="metric-label">Energy Efficiency:</span>
                <span class="metric-value" style="color: ${results.sustainability.electricity.color}">
                    ${results.sustainability.electricity.rating}
                </span>
            </div>
            <div class="metric">
                <span class="metric-label">Water Efficiency:</span>
                <span class="metric-value" style="color: ${results.sustainability.water.color}">
                    ${results.sustainability.water.rating}
                </span>
            </div>
            <div class="metric">
                <span class="metric-label">Waste Management:</span>
                <span class="metric-value" style="color: ${results.sustainability.waste.color}">
                    ${results.sustainability.waste.rating}
                </span>
            </div>
            <div class="metric">
                <span class="metric-label">Overall Efficiency:</span>
                <span class="metric-value">${results.sustainability.overallEfficiency}/100</span>
            </div>
        `;
    }
    
    // Update compliance
    const complianceElement = resultBox.querySelector('.compliance-status');
    if (complianceElement) {
        if (results.compliance.isCompliant) {
            complianceElement.innerHTML = `
                <div class="compliance-good">
                    <i class="fas fa-check-circle"></i>
                    Compliant with Environmental Regulations
                    <br>
                    <small>${results.compliance.frameworks.join(', ')}</small>
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
    
    // Update potential savings
    updateElementText('.potential-savings', 
        `$${results.potentialSavings.totalPotential}/year potential savings`, 
        resultBox);
    
    // Update recommendations
    const recommendationsElement = resultBox.querySelector('.recommendations-list');
    if (recommendationsElement) {
        recommendationsElement.innerHTML = '';
        results.recommendations.forEach(rec => {
            const li = document.createElement('li');
            const icon = rec.includes('immediate') || rec.includes('critical') ? 'fa-exclamation-triangle' : 'fa-check';
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

function updateEnvironmentalChart(carbon, water, waste, emissions) {
    const canvas = document.getElementById('environmental-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Data for radar chart
    const data = [
        { label: 'Carbon', value: Math.min(100, carbon.totalCO2 / 1000) }, // Scale to 0-100
        { label: 'Water', value: Math.min(100, water.totalFootprint / 1000) },
        { label: 'Waste', value: Math.min(100, waste.totalImpact / 10) },
        { label: 'Emissions', value: Math.min(100, emissions.totalImpact / 5) },
        { label: 'Recycling', value: waste.recyclingRate }
    ];
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    const angleStep = (Math.PI * 2) / data.length;
    
    // Draw radar grid
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;
    
    // Draw concentric circles
    for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        for (let j = 0; j <= data.length; j++) {
            const angle = j * angleStep;
            const x = centerX + Math.cos(angle) * (radius * i / 4);
            const y = centerY + Math.sin(angle) * (radius * i / 4);
            
            if (j === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#6c757d';
    ctx.lineWidth = 1;
    for (let i = 0; i < data.length; i++) {
        const angle = i * angleStep;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(angle) * radius,
            centerY + Math.sin(angle) * radius
        );
        ctx.stroke();
        
        // Add labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const labelX = centerX + Math.cos(angle) * (radius + 20);
        const labelY = centerY + Math.sin(angle) * (radius + 20);
        ctx.fillText(data[i].label, labelX, labelY);
    }
    
    // Draw data polygon
    ctx.fillStyle = 'rgba(44, 90, 160, 0.3)';
    ctx.strokeStyle = '#2c5aa0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < data.length; i++) {
        const angle = i * angleStep;
        const value = data[i].value;
        const scaledRadius = (value / 100) * radius;
        
        const x = centerX + Math.cos(angle) * scaledRadius;
        const y = centerY + Math.sin(angle) * scaledRadius;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Add data points
    for (let i = 0; i < data.length; i++) {
        const angle = i * angleStep;
        const value = data[i].value;
        const scaledRadius = (value / 100) * radius;
        
        const x = centerX + Math.cos(angle) * scaledRadius;
        const y = centerY + Math.sin(angle) * scaledRadius;
        
        ctx.fillStyle = '#2c5aa0';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Add value labels
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.fillText(value.toFixed(0), x, y - 10);
    }
    
    // Add chart title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Environmental Impact Profile', centerX, 20);
}

function initCarbonCalculator() {
    const calculateCarbonBtn = document.getElementById('calculate-carbon');
    if (calculateCarbonBtn) {
        calculateCarbonBtn.addEventListener('click', calculateCarbonOffset);
    }
}

function calculateCarbonOffset() {
    const annualCO2 = parseFloat(document.getElementById('annual-co2').value);
    const offsetMethod = document.getElementById('offset-method').value;
    
    if (isNaN(annualCO2) || annualCO2 <= 0) {
        showNotification('Please enter a valid annual CO2 emission.', 'error');
        return;
    }
    
    // Carbon offset costs per ton
    const offsetCosts = {
        reforestation: 10,
        renewable_energy: 15,
        methane_capture: 20,
        energy_efficiency: 25,
        direct_air_capture: 100
    };
    
    const costPerTon = offsetCosts[offsetMethod] || 15;
    const totalCost = (annualCO2 / 1000) * costPerTon;
    
    // Calculate equivalent offsets
    const treesNeeded = Math.ceil(annualCO2 / 21.77);
    const solarPanels = Math.ceil(annualCO2 / 1000);
    const windTurbines = (annualCO2 / 2000).toFixed(1);
    
    displayCarbonOffsetResults(annualCO2, totalCost.toFixed(2), treesNeeded, solarPanels, windTurbines, offsetMethod);
}

function displayCarbonOffsetResults(co2, cost, trees, solar, wind, method) {
    const resultsDiv = document.getElementById('carbon-offset-results');
    if (!resultsDiv) return;
    
    const methodNames = {
        reforestation: 'Tree Planting',
        renewable_energy: 'Renewable Energy Projects',
        methane_capture: 'Methane Capture',
        energy_efficiency: 'Energy Efficiency',
        direct_air_capture: 'Direct Air Capture'
    };
    
    resultsDiv.innerHTML = `
        <div class="carbon-offset-result">
            <h4><i class="fas fa-tree"></i> Carbon Offset Analysis</h4>
            <p><strong>Annual Emissions:</strong> ${(co2/1000).toFixed(1)} tons CO2</p>
            <p><strong>Offset Method:</strong> ${methodNames[method] || method}</p>
            <p><strong>Annual Offset Cost:</strong> $${cost}</p>
            
            <h5>Equivalent Offsets</h5>
            <div class="offset-equivalents">
                <div class="equivalent">
                    <i class="fas fa-tree"></i>
                    <span>${trees} trees planted</span>
                </div>
                <div class="equivalent">
                    <i class="fas fa-solar-panel"></i>
                    <span>${solar} solar panels</span>
                </div>
                <div class="equivalent">
                    <i class="fas fa-wind"></i>
                    <span>${wind} wind turbines</span>
                </div>
            </div>
            
            <h5>Offset Recommendations</h5>
            <ul class="offset-recommendations">
                <li>Consider verified carbon offset providers</li>
                <li>Look for Gold Standard or Verified Carbon Standard certification</li>
                <li>Combine offsets with direct emission reductions</li>
                <li>Monitor offset project effectiveness</li>
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

function resetEnvironmentalImpact() {
    const form = document.querySelector('#environmental-form');
    const resultBox = document.getElementById('environmental-result');
    const carbonResults = document.getElementById('carbon-offset-results');
    
    if (form) form.reset();
    if (resultBox) resultBox.classList.remove('active');
    if (carbonResults) {
        carbonResults.classList.remove('active');
        carbonResults.innerHTML = '';
    }
    
    showNotification('Environmental impact calculator has been reset.', 'info');
}

// Export for use in main.js
window.EnvironmentalCalculator = {
    calculate: calculateEnvironmentalImpact,
    reset: resetEnvironmentalImpact
};
