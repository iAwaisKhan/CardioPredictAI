// Optimized Heart Disease Predictor with Animations and Error Handling

// DOM Elements
const predictionForm = document.getElementById('predictionForm');
const predictBtn = document.getElementById('predictBtn');
const resetBtn = document.getElementById('resetBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultsSection = document.getElementById('resultsSection');
const errorMessage = document.getElementById('errorMessage');

// Result elements
const resultBox = document.getElementById('resultBox');
const resultIcon = document.getElementById('resultIcon');
const resultTitle = document.getElementById('resultTitle');
const resultConfidence = document.getElementById('resultConfidence');
const interpretation = document.getElementById('interpretation');

// Probability elements
const noDiseasePercent = document.getElementById('noDiseasePercent');
const diseasePercent = document.getElementById('diseasePercent');
const noDiseaseFill = document.getElementById('noDiseaseFill');
const diseaseFill = document.getElementById('diseaseFill');

// Form validation with real-time feedback
const formInputs = document.querySelectorAll('.form-control');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        validateInput(this);
    });
    
    input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            validateInput(this);
        }
    });
});

function validateInput(input) {
    const value = parseFloat(input.value);
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    
    if (input.value === '') {
        input.classList.remove('success', 'error');
        return false;
    }
    
    if (value < min || value > max) {
        input.classList.add('error');
        input.classList.remove('success');
        return false;
    }
    
    input.classList.add('success');
    input.classList.remove('error');
    return true;
}

// Form submission with animation
predictionForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate all inputs
    let isValid = true;
    formInputs.forEach(input => {
        if (!validateInput(input) && input.required) {
            isValid = false;
        }
    });
    
    // Check radio buttons
    const radioGroups = ['sex', 'fbs', 'exang'];
    radioGroups.forEach(name => {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        if (!checked) {
            isValid = false;
            showError(`Please select a value for ${name}`);
        }
    });
    
    if (!isValid) {
        showError('Please fill in all required fields with valid values.');
        return;
    }
    
    hideError();
    
    // Collect form data
    const formData = new FormData(predictionForm);
    const data = {
        age: parseInt(formData.get('age')),
        sex: parseInt(formData.get('sex')),
        cp: parseInt(formData.get('cp')),
        trestbps: parseInt(formData.get('trestbps')),
        chol: parseInt(formData.get('chol')),
        fbs: parseInt(formData.get('fbs')),
        restecg: parseInt(formData.get('restecg')),
        thalach: parseInt(formData.get('thalach')),
        exang: parseInt(formData.get('exang')),
        oldpeak: parseFloat(formData.get('oldpeak')),
        slope: parseInt(formData.get('slope')),
        ca: parseInt(formData.get('ca')),
        thal: parseInt(formData.get('thal'))
    };
    
    // Show loading with smooth transition
    showLoading();
    
    // Simulate API call with animation delay
    setTimeout(() => {
        const prediction = predictHeartDisease(data);
        displayResults(prediction);
    }, 1500);
});

// Prediction algorithm (simplified logistic regression simulation)
function predictHeartDisease(data) {
    // Feature weights based on logistic regression analysis
    const weights = {
        age: 0.02,
        sex: 0.8,
        cp: 0.5,
        trestbps: 0.01,
        chol: 0.005,
        fbs: 0.1,
        restecg: 0.3,
        thalach: -0.015,
        exang: 0.7,
        oldpeak: 0.4,
        slope: 0.6,
        ca: 0.9,
        thal: 0.7
    };
    
    // Calculate weighted score
    let score = 0;
    score += (data.age - 50) * weights.age;
    score += data.sex * weights.sex;
    score += data.cp * weights.cp;
    score += (data.trestbps - 130) * weights.trestbps;
    score += (data.chol - 250) * weights.chol;
    score += data.fbs * weights.fbs;
    score += data.restecg * weights.restecg;
    score += (180 - data.thalach) * weights.thalach;
    score += data.exang * weights.exang;
    score += data.oldpeak * weights.oldpeak;
    score += data.slope * weights.slope;
    score += data.ca * weights.ca;
    score += data.thal * weights.thal;
    
    // Convert to probability using sigmoid function
    const probability = 1 / (1 + Math.exp(-score));
    
    // Add some randomness for demonstration (±5%)
    const adjustedProb = Math.max(0.05, Math.min(0.95, probability + (Math.random() - 0.5) * 0.1));
    
    return {
        diseaseProb: adjustedProb,
        noDiseaseProb: 1 - adjustedProb,
        hasDisease: adjustedProb > 0.5
    };
}

// Display results with smooth animations
function displayResults(prediction) {
    hideLoading();
    
    const diseaseProb = Math.round(prediction.diseaseProb * 100);
    const noDiseaseProb = Math.round(prediction.noDiseaseProb * 100);
    
    // Update result box
    resultBox.className = 'result-box';
    if (prediction.hasDisease) {
        resultBox.classList.add('high-risk');
        resultIcon.textContent = '⚠️';
        resultTitle.textContent = 'HIGH RISK';
        resultConfidence.textContent = `Confidence: ${diseaseProb}%`;
    } else {
        resultBox.classList.add('low-risk');
        resultIcon.textContent = '✅';
        resultTitle.textContent = 'LOW RISK';
        resultConfidence.textContent = `Confidence: ${noDiseaseProb}%`;
    }
    
    // Animate probability bars
    setTimeout(() => {
        noDiseasePercent.textContent = `${noDiseaseProb}%`;
        diseasePercent.textContent = `${diseaseProb}%`;
        noDiseaseFill.style.width = `${noDiseaseProb}%`;
        diseaseFill.style.width = `${diseaseProb}%`;
    }, 300);
    
    // Update interpretation
    let interpretationText = '';
    if (diseaseProb >= 75) {
        interpretationText = 'Based on the provided health parameters, the model indicates a high risk of heart disease. Immediate consultation with a healthcare professional is strongly recommended.';
    } else if (diseaseProb >= 50) {
        interpretationText = 'Based on the provided health parameters, the model indicates a moderate to high risk of heart disease. Consider scheduling a medical evaluation with your healthcare provider.';
    } else if (diseaseProb >= 25) {
        interpretationText = 'Based on the provided health parameters, the model indicates a low to moderate risk of heart disease. Regular health checkups are recommended.';
    } else {
        interpretationText = 'Based on the provided health parameters, the model indicates a low risk of heart disease. Continue maintaining a healthy lifestyle and regular checkups.';
    }
    interpretation.textContent = interpretationText;
    
    // Generate personalized tips
    generatePersonalizedTips(diseaseProb, prediction.hasDisease);
    
    // Show results with animation
    resultsSection.classList.add('active');
    smoothScrollTo(resultsSection);
}

// Generate personalized health tips based on risk level
function generatePersonalizedTips(riskPercentage, hasDisease) {
    const tipsGrid = document.getElementById('tipsGrid');
    tipsGrid.innerHTML = '';
    
    let priorityTips = [];
    
    if (riskPercentage >= 75) {
        priorityTips = [
            {
                icon: '🚨',
                title: 'Urgent Medical Consultation',
                text: 'Schedule an immediate appointment with a cardiologist to discuss your results and begin a treatment plan.',
                priority: 'urgent'
            },
            {
                icon: '💊',
                title: 'Medication Review',
                text: 'Discuss preventive medications like statins, beta-blockers, or ACE inhibitors with your doctor.',
                priority: 'urgent'
            },
            {
                icon: '🩺',
                title: 'Comprehensive Testing',
                text: 'Request advanced cardiac tests: ECG, stress test, echocardiogram, or cardiac catheterization.',
                priority: 'urgent'
            },
            {
                icon: '🚭',
                title: 'Immediate Lifestyle Changes',
                text: 'Stop smoking immediately, eliminate alcohol, and reduce sodium intake to below 1,500mg daily.',
                priority: 'high'
            }
        ];
    } else if (riskPercentage >= 50) {
        priorityTips = [
            {
                icon: '👨‍⚕️',
                title: 'Medical Consultation',
                text: 'Schedule an appointment with your healthcare provider within the next 2 weeks to review these results.',
                priority: 'high'
            },
            {
                icon: '📊',
                title: 'Regular Monitoring',
                text: 'Begin monitoring blood pressure daily and cholesterol levels monthly.',
                priority: 'high'
            },
            {
                icon: '🥗',
                title: 'Diet Overhaul',
                text: 'Adopt a heart-healthy Mediterranean or DASH diet focusing on whole foods and limiting processed items.',
                priority: 'high'
            },
            {
                icon: '🏃‍♂️',
                title: 'Exercise Program',
                text: 'Start a supervised exercise program with at least 30 minutes of moderate activity 5 days per week.',
                priority: 'high'
            }
        ];
    } else if (riskPercentage >= 25) {
        priorityTips = [
            {
                icon: '✅',
                title: 'Preventive Care',
                text: 'Maintain regular checkups with your healthcare provider every 6 months.',
                priority: 'normal'
            },
            {
                icon: '🥗',
                title: 'Healthy Diet',
                text: 'Continue eating a balanced diet rich in fruits, vegetables, whole grains, and lean proteins.',
                priority: 'normal'
            },
            {
                icon: '💪',
                title: 'Stay Active',
                text: 'Maintain regular physical activity with at least 150 minutes of moderate exercise weekly.',
                priority: 'normal'
            },
            {
                icon: '📉',
                title: 'Monitor Health',
                text: 'Keep track of your blood pressure, cholesterol, and weight regularly.',
                priority: 'normal'
            }
        ];
    } else {
        priorityTips = [
            {
                icon: '🎉',
                title: 'Great Health Status',
                text: 'Your results show low risk. Continue your healthy lifestyle habits!',
                priority: 'normal'
            },
            {
                icon: '🏃',
                title: 'Stay Active',
                text: 'Maintain your current exercise routine and consider adding variety with new activities.',
                priority: 'normal'
            },
            {
                icon: '🥦',
                title: 'Healthy Eating',
                text: 'Keep following a balanced, nutritious diet with plenty of whole foods.',
                priority: 'normal'
            },
            {
                icon: '😴',
                title: 'Quality Sleep',
                text: 'Ensure you\'re getting 7-9 hours of quality sleep each night for optimal heart health.',
                priority: 'normal'
            }
        ];
    }
    
    // Create and append tip cards with staggered animation
    priorityTips.forEach((tip, index) => {
        const tipCard = document.createElement('div');
        tipCard.className = `tip-card priority-${tip.priority}`;
        tipCard.style.animationDelay = `${index * 0.1}s`;
        
        tipCard.innerHTML = `
            <h4>
                <span style="font-size: 1.5em;">${tip.icon}</span>
                ${tip.title}
                ${tip.priority === 'urgent' ? '<span class="priority-badge urgent">URGENT</span>' : ''}
                ${tip.priority === 'high' ? '<span class="priority-badge high">HIGH PRIORITY</span>' : ''}
            </h4>
            <p>${tip.text}</p>
        `;
        
        tipsGrid.appendChild(tipCard);
    });
}

// Reset form with animation
resetBtn.addEventListener('click', function() {
    // Fade out results
    resultsSection.style.opacity = '0';
    setTimeout(() => {
        resultsSection.classList.remove('active');
        resultsSection.style.opacity = '1';
        predictionForm.reset();
        
        // Remove validation classes
        formInputs.forEach(input => {
            input.classList.remove('success', 'error');
        });
        
        // Clear tips grid
        document.getElementById('tipsGrid').innerHTML = '';
        
        hideError();
        smoothScrollTo(predictionForm);
    }, 300);
});

// Utility functions
function showLoading() {
    resultsSection.classList.remove('active');
    loadingSpinner.classList.add('active');
    predictBtn.disabled = true;
    predictBtn.style.opacity = '0.6';
    smoothScrollTo(loadingSpinner);
}

function hideLoading() {
    loadingSpinner.classList.remove('active');
    predictBtn.disabled = false;
    predictBtn.style.opacity = '1';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('active');
    smoothScrollTo(errorMessage);
}

function hideError() {
    errorMessage.classList.remove('active');
}

function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
}

// Add hover effects to cards
const cards = document.querySelectorAll('.card, .info-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.01)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add ripple effect to buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
        `;
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize: Hide results on page load
resultsSection.classList.remove('active');

// Add intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe info cards
document.querySelectorAll('.info-card, .disclaimer').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

console.log('Heart Disease Predictor initialized successfully! ❤️');