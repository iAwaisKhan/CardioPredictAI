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

// Chatbot Elements
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.getElementById('chatbotContainer');
const closeChat = document.getElementById('closeChat');
const minimizeChat = document.getElementById('minimizeChat');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const quickReplies = document.querySelectorAll('.quick-reply-btn');
const suggestionTags = document.querySelectorAll('.suggestion-tag');
const chatNotification = document.getElementById('chatNotification');

// Chatbot state
let chatHistory = [];
let userProgress = {
    goalsSet: false,
    exerciseDays: 0,
    healthyMeals: 0,
    medicationTaken: 0,
    checkupScheduled: false
};

// Toggle chatbot
chatbotToggle.addEventListener('click', () => {
    chatbotContainer.classList.toggle('active');
    if (chatbotContainer.classList.contains('active')) {
        chatNotification.classList.add('hidden');
        chatInput.focus();
    }
});

closeChat.addEventListener('click', () => {
    chatbotContainer.classList.remove('active');
});

minimizeChat.addEventListener('click', () => {
    chatbotContainer.classList.toggle('minimized');
});

// Send message
sendMessageBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message and get response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateResponse(message);
        addMessage(response, 'bot');
    }, 1000 + Math.random() * 1000);
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${sender === 'user' ? '👤' : '🤖'}</div>
        <div class="message-content">
            ${text}
            <div class="message-timestamp">${timestamp}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    chatHistory.push({ text, sender, timestamp });
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-message';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingMessage = chatMessages.querySelector('.typing-message');
    if (typingMessage) {
        typingMessage.remove();
    }
}

// AI Response Generator
function generateResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Risk factors
    if (lowerMessage.includes('risk factor') || lowerMessage.includes('causes')) {
        return `
            <p><strong>Main Heart Disease Risk Factors:</strong></p>
            <ul>
                <li><strong>High Blood Pressure:</strong> Forces your heart to work harder</li>
                <li><strong>High Cholesterol:</strong> Can clog arteries</li>
                <li><strong>Smoking:</strong> Damages blood vessel lining</li>
                <li><strong>Diabetes:</strong> Increases arterial damage risk</li>
                <li><strong>Obesity:</strong> Strains the cardiovascular system</li>
                <li><strong>Physical Inactivity:</strong> Weakens heart muscle</li>
                <li><strong>Age & Family History:</strong> Non-modifiable factors</li>
            </ul>
            <p>The good news? Many of these are controllable through lifestyle changes! 💪</p>
        `;
    }
    
    // Cholesterol
    if (lowerMessage.includes('cholesterol') || lowerMessage.includes('ldl')) {
        return `
            <p><strong>How to Lower Cholesterol:</strong></p>
            <ul>
                <li>Eat foods high in soluble fiber (oats, beans, apples)</li>
                <li>Add omega-3 fatty acids (salmon, walnuts, flaxseeds)</li>
                <li>Avoid trans fats completely</li>
                <li>Exercise 30 minutes daily</li>
                <li>Maintain healthy weight</li>
                <li>Quit smoking if applicable</li>
                <li>Consider plant sterols and stanols</li>
            </ul>
            <p>Your doctor may also prescribe statins if lifestyle changes aren't enough. Always consult with them first! 🩺</p>
        `;
    }
    
    // Exercise
    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('physical')) {
        return `
            <p><strong>Best Exercises for Heart Health:</strong></p>
            <ul>
                <li><strong>Aerobic Exercise:</strong> Walking, jogging, swimming, cycling (30 min, 5x/week)</li>
                <li><strong>Strength Training:</strong> Light weights or resistance bands (2x/week)</li>
                <li><strong>Flexibility:</strong> Stretching or yoga (daily)</li>
            </ul>
            <p><strong>Getting Started:</strong></p>
            <ul>
                <li>Start slow - even 10 minutes helps!</li>
                <li>Gradually increase intensity</li>
                <li>Choose activities you enjoy</li>
                <li>Always warm up and cool down</li>
            </ul>
            <p>⚠️ Consult your doctor before starting any new exercise program, especially if you have heart concerns.</p>
        `;
    }
    
    // Diet
    if (lowerMessage.includes('diet') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
        return `
            <p><strong>Heart-Healthy Diet Guidelines:</strong></p>
            <p><strong>✅ Foods to Eat More:</strong></p>
            <ul>
                <li>Fruits and vegetables (5+ servings daily)</li>
                <li>Whole grains (brown rice, quinoa, oats)</li>
                <li>Fatty fish (salmon, mackerel, sardines)</li>
                <li>Nuts and seeds (almonds, walnuts, chia)</li>
                <li>Legumes (beans, lentils, chickpeas)</li>
                <li>Olive oil and avocados</li>
            </ul>
            <p><strong>❌ Foods to Limit:</strong></p>
            <ul>
                <li>Sodium (under 2,300mg daily)</li>
                <li>Saturated fats (red meat, butter)</li>
                <li>Trans fats (processed foods)</li>
                <li>Added sugars and refined carbs</li>
            </ul>
            <p>Consider the Mediterranean or DASH diet - both are excellent for heart health! 🥗</p>
        `;
    }
    
    // My risk / results
    if (lowerMessage.includes('my risk') || lowerMessage.includes('my result') || lowerMessage.includes('my score')) {
        if (currentPredictionData) {
            const riskLevel = currentPredictionData.diseaseProb >= 50 ? 'elevated' : 'moderate to low';
            return `
                <p>Based on your latest assessment:</p>
                <p><strong>Risk Level:</strong> ${riskLevel.toUpperCase()}</p>
                <p><strong>Disease Probability:</strong> ${currentPredictionData.diseaseProb}%</p>
                <p><strong>Key Recommendations:</strong></p>
                ${currentPredictionData.diseaseProb >= 50 ? `
                    <ul>
                        <li>Schedule a cardiology appointment soon</li>
                        <li>Start aggressive risk factor modification</li>
                        <li>Monitor blood pressure daily</li>
                        <li>Begin heart-healthy diet immediately</li>
                    </ul>
                ` : `
                    <ul>
                        <li>Continue healthy lifestyle habits</li>
                        <li>Get annual checkups</li>
                        <li>Stay active and eat well</li>
                        <li>Monitor your health regularly</li>
                    </ul>
                `}
                <p>Would you like specific tips on any of these areas?</p>
            `;
        } else {
            return `
                <p>I don't have your risk assessment yet. Please complete the health parameters form on the main page to get your personalized risk prediction!</p>
                <p>Once you do, I can provide tailored recommendations based on your results. 📊</p>
            `;
        }
    }
    
    // Reminders
    if (lowerMessage.includes('reminder') || lowerMessage.includes('remind')) {
        return `
            <div class="reminder-card">
                <h4>⏰ Health Reminders Set!</h4>
                <p>I'll help you stay on track:</p>
            </div>
            <ul>
                <li>💊 Daily medication at 8:00 AM & 8:00 PM</li>
                <li>🏃 Exercise reminder at 6:00 PM</li>
                <li>📊 Weekly blood pressure check (Mondays)</li>
                <li>🩺 Monthly doctor visit check-in</li>
            </ul>
            <p>You can customize these reminders. What would you like to adjust?</p>
            <div class="chat-action-buttons">
                <button class="chat-action-btn" onclick="alert('Reminder settings opened!')">⚙️ Settings</button>
            </div>
        `;
    }
    
    // Progress
    if (lowerMessage.includes('progress') || lowerMessage.includes('track') || lowerMessage.includes('goal')) {
        userProgress.exerciseDays = Math.min(userProgress.exerciseDays + 1, 7);
        userProgress.healthyMeals = Math.min(userProgress.healthyMeals + 2, 21);
        
        return `
            <div class="progress-card">
                <h4>📈 Your Weekly Progress</h4>
                <p><strong>Exercise Days:</strong> ${userProgress.exerciseDays}/7 days</p>
                <div class="progress-bar-chat">
                    <div class="progress-bar-fill-chat" style="width: ${(userProgress.exerciseDays/7)*100}%"></div>
                </div>
                <p style="margin-top: 10px;"><strong>Healthy Meals:</strong> ${userProgress.healthyMeals}/21 meals</p>
                <div class="progress-bar-chat">
                    <div class="progress-bar-fill-chat" style="width: ${(userProgress.healthyMeals/21)*100}%"></div>
                </div>
            </div>
            <p>🎉 ${userProgress.exerciseDays >= 5 ? 'Fantastic work on your exercise routine!' : 'Keep pushing! You\'re making great progress!'}</p>
            <p>💡 Tip: Consistency is key. Small daily improvements lead to big results!</p>
        `;
    }
    
    // Motivation
    if (lowerMessage.includes('motivate') || lowerMessage.includes('encourage') || lowerMessage.includes('hard')) {
        const motivationalQuotes = [
            "Your heart is your most important muscle - treat it with love! ❤️",
            "Every healthy choice you make is an investment in your future! 💪",
            "Small steps every day lead to big changes! You've got this! 🌟",
            "Your health journey is unique - celebrate every victory, no matter how small! 🎉",
            "Remember: It's not about being perfect, it's about being better than yesterday! 🚀",
            "You're stronger than you think, and your heart will thank you! 💚"
        ];
        return `<p>${motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}</p>`;
    }
    
    // Symptoms
    if (lowerMessage.includes('symptom') || lowerMessage.includes('chest pain') || lowerMessage.includes('emergency')) {
        return `
            <p><strong>⚠️ Warning Signs - Seek Immediate Medical Attention if you experience:</strong></p>
            <ul>
                <li>🚨 Chest pain or pressure lasting more than a few minutes</li>
                <li>🚨 Pain spreading to arm, jaw, neck, or back</li>
                <li>🚨 Shortness of breath with chest discomfort</li>
                <li>🚨 Sudden dizziness, nausea, or cold sweats</li>
                <li>🚨 Irregular or rapid heartbeat</li>
            </ul>
            <p><strong>📞 CALL 911 IMMEDIATELY if you have these symptoms!</strong></p>
            <p>Don't wait or try to drive yourself. Heart attacks are medical emergencies.</p>
        `;
    }
    
    // Medication
    if (lowerMessage.includes('medication') || lowerMessage.includes('medicine') || lowerMessage.includes('pill')) {
        return `
            <p><strong>Common Heart Medications:</strong></p>
            <ul>
                <li><strong>Statins:</strong> Lower cholesterol</li>
                <li><strong>ACE Inhibitors:</strong> Lower blood pressure</li>
                <li><strong>Beta-Blockers:</strong> Reduce heart workload</li>
                <li><strong>Aspirin:</strong> Prevents blood clots</li>
                <li><strong>Diuretics:</strong> Remove excess fluid</li>
            </ul>
            <p><strong>Important Tips:</strong></p>
            <ul>
                <li>✅ Take medications exactly as prescribed</li>
                <li>✅ Set daily reminders</li>
                <li>✅ Never skip doses</li>
                <li>✅ Refill prescriptions on time</li>
                <li>✅ Report side effects to your doctor</li>
            </ul>
            <p>⚠️ Never stop taking medication without consulting your doctor first!</p>
        `;
    }
    
    // Stress
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('relax')) {
        return `
            <p><strong>Stress Management for Heart Health:</strong></p>
            <ul>
                <li>🧘 Practice deep breathing (4-7-8 technique)</li>
                <li>🧘 Try meditation or mindfulness (10 min daily)</li>
                <li>🚶 Take regular walks in nature</li>
                <li>😴 Prioritize 7-9 hours of quality sleep</li>
                <li>👥 Connect with friends and family</li>
                <li>🎨 Engage in hobbies you enjoy</li>
                <li>📱 Limit social media and news consumption</li>
            </ul>
            <p>Chronic stress can significantly impact heart health. Taking time to relax isn't selfish - it's essential! 🌸</p>
        `;
    }
    
    // Blood pressure
    if (lowerMessage.includes('blood pressure') || lowerMessage.includes('hypertension')) {
        return `
            <p><strong>Managing Blood Pressure:</strong></p>
            <p><strong>Target:</strong> Below 130/80 mm Hg</p>
            <p><strong>Lifestyle Changes:</strong></p>
            <ul>
                <li>Reduce sodium to under 2,300mg daily</li>
                <li>Increase potassium (bananas, spinach)</li>
                <li>Exercise regularly (30 min, 5x/week)</li>
                <li>Maintain healthy weight</li>
                <li>Limit alcohol consumption</li>
                <li>Manage stress effectively</li>
                <li>Get adequate sleep</li>
            </ul>
            <p>📊 Monitor at home regularly and keep a log to share with your doctor!</p>
        `;
    }
    
    // Default response
    const defaultResponses = [
        `<p>That's an interesting question! While I can provide general health information, I'd recommend discussing specific concerns with your healthcare provider.</p><p>Is there something specific about heart health I can help you with? Try asking about:</p><ul><li>Risk factors</li><li>Exercise tips</li><li>Heart-healthy diet</li><li>Medication information</li></ul>`,
        `<p>I'm here to help with heart health questions! I can provide information about:</p><ul><li>Prevention strategies</li><li>Lifestyle modifications</li><li>Understanding your risk</li><li>Setting health goals</li></ul><p>What would you like to know more about?</p>`,
        `<p>I want to make sure I give you the most helpful information. Could you rephrase your question or ask about one of these topics?</p><ul><li>🍎 Diet and nutrition</li><li>🏃 Exercise guidelines</li><li>💊 Medication management</li><li>📊 Tracking progress</li></ul>`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Quick reply buttons
quickReplies.forEach(btn => {
    btn.addEventListener('click', () => {
        const question = btn.dataset.question;
        chatInput.value = question;
        sendMessage();
    });
});

// Suggestion tags
suggestionTags.forEach(tag => {
    tag.addEventListener('click', () => {
        const text = tag.dataset.text;
        chatInput.value = text;
        sendMessage();
    });
});

// Proactive chatbot messages
function sendProactiveTip() {
    if (!chatbotContainer.classList.contains('active')) {
        chatNotification.classList.remove('hidden');
    }
    
    const tips = [
        "💡 Remember to stay hydrated! Aim for 8 glasses of water today.",
        "🏃 Quick reminder: Have you done your 30-minute walk today?",
        "🥗 Tip: Adding more vegetables to your meals can significantly improve heart health!",
        "😴 Getting good sleep tonight? Quality rest is crucial for heart health!",
        "💊 Don't forget to take your medications as prescribed!",
        "📊 It's been a week! How about checking your blood pressure?"
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    addMessage(randomTip, 'bot');
}

// Send proactive tips every 30 minutes (for demo - adjust in production)
setInterval(sendProactiveTip, 1800000);

// Initialize chatbot with welcome message after 5 seconds
setTimeout(() => {
    if (!chatbotContainer.classList.contains('active')) {
        chatNotification.classList.remove('hidden');
    }
}, 5000);

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

// Space Animation Enhancement
function initSpaceAnimation() {
    // Create additional dynamic stars
    createDynamicStars(50);
    
    // Add parallax effect on mouse move
    addParallaxEffect();
    
    // Add constellation lines (optional)
    // createConstellations();
}

// Create random twinkling stars
function createDynamicStars(count) {
    const starsContainer = document.querySelector('.stars-container');
    
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'dynamic-star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: white;
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.7 + 0.3};
            animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
            box-shadow: 0 0 ${Math.random() * 10 + 5}px rgba(255, 255, 255, 0.5);
        `;
        starsContainer.appendChild(star);
    }
    
    // Add twinkle animation
    if (!document.getElementById('twinkle-animation')) {
        const style = document.createElement('style');
        style.id = 'twinkle-animation';
        style.textContent = `
            @keyframes twinkle {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Add parallax effect based on mouse movement
function addParallaxEffect() {
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    
    function animate() {
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        
        const stars = document.querySelectorAll('.stars');
        stars.forEach((star, index) => {
            const speed = (index + 1) * 10;
            star.style.transform = `translate(${targetX * speed}px, ${targetY * speed}px)`;
        });
        
        const planets = document.querySelectorAll('.planet');
        planets.forEach((planet, index) => {
            const speed = (index + 1) * 5;
            const currentTransform = planet.style.transform || '';
            planet.style.transform = `${currentTransform} translate(${targetX * speed}px, ${targetY * speed}px)`;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Initialize space animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initSpaceAnimation();
    console.log('Space animation initialized! 🌌');
});

console.log('Heart Disease Predictor initialized successfully! ❤️');