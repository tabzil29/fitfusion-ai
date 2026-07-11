// ===========================
// FitFusion AI
// Phase 2 Part 2
// ===========================
// Welcome Screen

const welcomeScreen = document.getElementById("welcomeScreen");
const dashboardPage = document.getElementById("dashboardPage");
const continueBtn = document.getElementById("continueBtn");

// ---- If profile already saved, skip welcome screen ----
(function () {
    const saved = localStorage.getItem("profile");
    if (saved) {
        welcomeScreen.style.display = "none";
        dashboardPage.style.display = "block";
        const profile = JSON.parse(saved);
        // Restore greeting
        const savedName = profile.name || "";
        document.getElementById("greeting").innerHTML =
            (new Date().getHours() < 12 ? "🌅 Good Morning" :
             new Date().getHours() < 17 ? "☀️ Good Afternoon" : "🌙 Good Evening") +
            " " + savedName + " 👋";
    }
})();

continueBtn.onclick = () => {

    // Read values from welcome page
    const name = document.getElementById("welcomeName").value;
    const age = document.getElementById("welcomeAge").value;
    const height = parseFloat(document.getElementById("welcomeHeight").value);
    const weight = parseFloat(document.getElementById("welcomeWeight").value);
    const gender = document.getElementById("welcomeGender").value;
    const goal = document.getElementById("welcomeGoal").value;
    const diet = document.getElementById("welcomeDiet").value;

    if (!name || !age || !height || !weight || !gender) {
        alert("Please complete your health profile.");
        return;
    }

    // Save profile
    const profile = {
        name,
        age,
        gender,
        height,
        weight,
        goal,
        diet
    };
    localStorage.setItem("profile", JSON.stringify(profile));
    localStorage.setItem("name", name);
    
    // Save metrics
    calculateHealthMetrics(profile);

    // Update dashboard and health score instantly
    updateDashboard();
    updateHealthScore();

    // Show dashboard
    welcomeScreen.style.display = "none";
    dashboardPage.style.display = "block";

    greeting.innerHTML = greet + " " + name + " 👋";

};

// ---------- ELEMENTS ----------

const menuBtn=document.getElementById("menuBtn");
const sidebar=document.querySelector(".sidebar");
const overlay=document.querySelector(".overlay");

const greeting=document.getElementById("greeting");
const todayDate=document.getElementById("todayDate");

const bmiCard=document.getElementById("openBMI");

const dashboardBMI=document.getElementById("dashboardBMI");

const bmiButton=document.getElementById("calculateBMI");

// WATER

const waterCard=document.getElementById("openWater");

const dashboardWater=document.getElementById("dashboardWater");

const waterGoalBtn=document.getElementById("waterGoal");

const addWaterBtn=document.getElementById("addWater");

const waterDisplay=document.getElementById("waterDisplay");

// CALORIES

const calorieCard=document.getElementById("openCalories");

const dashboardCalories=document.getElementById("dashboardCalories");

const calorieBtn=document.getElementById("calculateCalories");

// ---------- SIDEBAR ----------

menuBtn.onclick=()=>{

sidebar.classList.add("active");

overlay.style.display="block";

}

overlay.onclick=()=>{

sidebar.classList.remove("active");

overlay.style.display="none";

}

// ---------- GREETING ----------

const hour=new Date().getHours();

let greet="";

if(hour<12){

greet="🌅 Good Morning";

}
else if(hour<17){

greet="☀️ Good Afternoon";

}
else{

greet="🌙 Good Evening";

}

greeting.innerHTML=greet+" 👋";

todayDate.innerHTML=new Date().toLocaleDateString(
'en-US',
{
weekday:'long',
day:'numeric',
month:'long',
year:'numeric'
}
);


// ---------- SECTION NAVIGATION (SPA) ----------

function switchSection(sectionId) {
    const sections = document.querySelectorAll(".content-section");
    sections.forEach(sec => sec.style.display = "none");

    const targetSection = document.getElementById(sectionId + "Section") || document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = "block";
    }

    const sidebarItems = document.querySelectorAll(".sidebar-item");
    sidebarItems.forEach(item => {
        if (item.getAttribute("data-section") === sectionId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // Close mobile sidebar if open
    sidebar.classList.remove("active");
    overlay.style.display = "none";
}

calorieCard.onclick = () => {
    switchSection("tools");
};

waterCard.onclick = () => {
    switchSection("tools");
};

bmiCard.onclick = () => {
    switchSection("tools");
};


// ---------- LOAD SAVED BMI ----------

const savedBMI=localStorage.getItem("BMI");

if(savedBMI){

dashboardBMI.innerHTML=savedBMI;

}


// ---------- BMI CALCULATOR ----------

bmiButton.onclick=()=>{

const h=parseFloat(

document.getElementById("height").value

);

const w=parseFloat(

document.getElementById("weight").value

);

const result=document.getElementById("bmiResult");

if(!h||!w){

result.innerHTML="<span style='color:red'>Please enter all values.</span>";

return;

}

const bmi=w/((h/100)*(h/100));

let status="";

if(bmi<18.5){

status="🟡 Underweight";

}

else if(bmi<25){

status="🟢 Healthy";

}

else if(bmi<30){

status="🟠 Overweight";

}

else{

status="🔴 Obese";

}

dashboardBMI.innerHTML=bmi.toFixed(1);

localStorage.setItem(

"BMI",

bmi.toFixed(1)

);

result.innerHTML=`

<h2>${bmi.toFixed(1)}</h2>

<h5>${status}</h5>

`;

updateDashboard();
updateHealthScore();

}

// --------------------
// WATER TRACKER
// --------------------

let currentWater=parseFloat(localStorage.getItem("water")) || 0;

dashboardWater.innerHTML=currentWater.toFixed(2)+" L";

waterDisplay.innerHTML=currentWater.toFixed(2)+" L";

waterGoalBtn.onclick=()=>{

const weight=parseFloat(document.getElementById("waterWeight").value);

if(!weight){

alert("Enter your weight.");

return;

}

const goal=(weight*35)/1000;

alert("💧 Daily Goal: "+goal.toFixed(1)+" L");

};

addWaterBtn.onclick=()=>{

currentWater+=0.25;

dashboardWater.innerHTML=currentWater.toFixed(2)+" L";

waterDisplay.innerHTML=currentWater.toFixed(2)+" L";

localStorage.setItem("water",currentWater);

updateDashboard();
updateHealthScore();

};

// --------------------
// CALORIE CALCULATOR
// --------------------

const savedCalories = localStorage.getItem("calories");

if(savedCalories){

dashboardCalories.innerHTML = savedCalories + " kcal";

}

calorieBtn.onclick = ()=>{

const age = parseFloat(document.getElementById("calAge").value);

const gender = document.getElementById("calGender").value;

const height = parseFloat(document.getElementById("calHeight").value);

const weight = parseFloat(document.getElementById("calWeight").value);

const activity = parseFloat(document.getElementById("activity").value);

if(!age || !height || !weight){

alert("Please fill all fields.");

return;

}

let bmr;

if(gender==="Male"){

bmr = 10*weight + 6.25*height - 5*age + 5;

}

else{

bmr = 10*weight + 6.25*height - 5*age - 161;

}

const maintenance = Math.round(bmr*activity);

const loss = maintenance - 500;

const gain = maintenance + 300;

dashboardCalories.innerHTML = maintenance + " kcal";

localStorage.setItem("calories",maintenance);

document.getElementById("calorieResult").innerHTML = `

<h4>Maintenance</h4>

<h2>${maintenance} kcal</h2>

<p>🔥 Weight Loss: ${loss} kcal</p>

<p>💪 Weight Gain: ${gain} kcal</p>

`;

updateDashboard();
updateHealthScore();

};


// ==========================
// AI Assistant
// ==========================

const prompts=document.querySelectorAll(".prompt");



const input=document.getElementById("chatInput");

const chatResponse = document.getElementById("chatResponse");

const historyList=document.getElementById("historyList");

const clearChat=document.getElementById("clearChat");

let history=[];

prompts.forEach(btn=>{

btn.onclick=()=>{

const text=btn.innerText;

switch(text){

case "🥗 Generate Diet Plan":

input.value="Create a personalized diet plan based on my health profile.";

break;

case "🏋 Workout Plan":

input.value="Create a personalized workout plan based on my health profile.";

break;

case "🍎 Healthy Recipes":

input.value="Suggest healthy recipes based on my health profile.";

break;

case "💧 Water Advice":

input.value="How much water should I drink today based on my health profile?";

break;

default:

input.value=text;

}

input.focus();

};
});
document.getElementById("sendMessage").onclick=()=>{

if(input.value===""){

alert("Please enter a message.");

return;

}

const question = input.value;

history.unshift(question);

if(history.length>5){

history.pop();

}

historyList.innerHTML="";

history.forEach(item=>{

historyList.innerHTML+=`<li>${item}</li>`;

});

// Append User Message First
chatResponse.innerHTML += `

<hr>

<div class="user-message">

<b>👤 You</b><br>

${question}

</div>

`;

scrollChat();

// Append Thinking Message Second
const thinkingId = "thinking-" + Date.now();

chatResponse.innerHTML += `

<div id="${thinkingId}" class="ai-message">

<b>🤖 FitFusion AI</b><br>

<i>Thinking...</i>

</div>

`;

scrollChat();

const apiEndpoint = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/chat'
    : '/api/chat';

fetch(apiEndpoint, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
    message: question,
    profile: JSON.parse(localStorage.getItem("profile"))
})
})
.then(res => res.json())
.then(data => {
    document.getElementById(thinkingId)?.remove();
    
    let replyText = "";
    if (data.error) {
        replyText = `<span style="color:red;">Error: ${data.error}</span>`;
    } else {
        replyText = (data.reply || data.choices?.[0]?.message?.content || "No response").replace(/\n/g,"<br>");
    }

    chatResponse.innerHTML += `
<hr>
<div class="ai-message">

<b>🤖 FitFusion AI</b><br>

${replyText}

</div>

`;

    scrollChat();

})
.catch(error => {
 document.getElementById(thinkingId)?.remove();
    chatResponse.innerHTML += `

<hr>

<div class="ai-message">

<b>🤖 FitFusion AI</b><br>

<span style="color:red;">

${error}

</span>

</div>

`;

    scrollChat();

});
input.value="";
};
// ==========================
// SMART DIET PLANNER
// ==========================

document.getElementById("generateDiet").onclick=()=>{

const goal=document.getElementById("dietGoal").value;
const diet=document.getElementById("dietType").value;

let plan="";

if(goal==="Lose Weight"){

plan=`
<h5>🥣 Breakfast</h5>
<p>Oats + Milk + Banana</p>

<h5>🍛 Lunch</h5>
<p>Brown Rice + Dal + Vegetables</p>

<h5>🥜 Snack</h5>
<p>Mixed Nuts</p>

<h5>🍲 Dinner</h5>
<p>Grilled Paneer + Salad</p>

<h5>💧 Water</h5>
<p>3 Litres</p>
`;

}

else if(goal==="Maintain Weight"){

plan=`
<h5>🥣 Breakfast</h5>
<p>Eggs + Toast + Fruit</p>

<h5>🍛 Lunch</h5>
<p>Rice + Chicken + Vegetables</p>

<h5>🥜 Snack</h5>
<p>Yogurt + Nuts</p>

<h5>🍲 Dinner</h5>
<p>Chapati + Dal + Vegetables</p>

<h5>💧 Water</h5>
<p>2.5 Litres</p>
`;

}

else{

plan=`
<h5>🥣 Breakfast</h5>
<p>Peanut Butter Toast + Milk</p>

<h5>🍛 Lunch</h5>
<p>Rice + Chicken + Eggs</p>

<h5>🥜 Snack</h5>
<p>Protein Shake</p>

<h5>🍲 Dinner</h5>
<p>Paneer + Rice + Vegetables</p>

<h5>💧 Water</h5>
<p>3.5 Litres</p>
`;

}

document.getElementById("dietResult").innerHTML=plan;

};

// ==========================
// WORKOUT PLANNER
// ==========================

document.getElementById("generateWorkout").onclick=()=>{

const goal=document.getElementById("workoutGoal").value;

const level=document.getElementById("workoutLevel").value;

let plan="";

if(goal==="Lose Weight"){

plan=`

<h5>🏃 Cardio Focus</h5>

Monday - Running 30 min

Tuesday - Full Body

Wednesday - Cycling

Thursday - HIIT

Friday - Upper Body

Saturday - Walking

Sunday - Rest

`;

}

else if(goal==="Maintain Fitness"){

plan=`

<h5>💪 Balanced Routine</h5>

Monday - Chest

Tuesday - Legs

Wednesday - Cardio

Thursday - Back

Friday - Shoulders

Saturday - Yoga

Sunday - Rest

`;

}

else{

plan=`

<h5>🏋 Muscle Gain</h5>

Monday - Chest + Triceps

Tuesday - Back + Biceps

Wednesday - Legs

Thursday - Shoulders

Friday - Arms

Saturday - Core

Sunday - Rest

`;

}

document.getElementById("workoutResult").innerHTML=`

<h4>${level} Plan</h4>

${plan}

`;

localStorage.setItem("workoutPlan",plan);

};

// ==========================
// HEALTH SCORE
// ==========================

function updateHealthScore(){

let score = 0;

// BMI

const bmi = parseFloat(localStorage.getItem("BMI"));

if(bmi>=18.5 && bmi<=24.9){

score += 35;

}

// Water

const water = parseFloat(localStorage.getItem("water")) || 0;

if(water>=2){

score += 30;

}

// Calories

const calories = parseInt(localStorage.getItem("calories"));

if(calories){

score += 20;

}

// Profile

const profile = localStorage.getItem("profile");

if(profile){

score += 15;

}

document.getElementById("healthScore").innerHTML = score+"%";

let status="Needs Improvement";

if(score>=90){

status="🏆 Excellent";

}
else if(score>=70){

status="👍 Good";

}
else if(score>=50){

status="🙂 Fair";

}

document.getElementById("healthStatus").innerHTML=status;

// Circle Progress

const degree=(score/100)*360;

document.querySelector(".score-circle").style.background=

`conic-gradient(#34C759 ${degree}deg,#EAEAEA ${degree}deg)`;

}

updateHealthScore();

// ==========================
// SMART DASHBOARD
// ==========================

function updateDashboard(){

const bmi=parseFloat(localStorage.getItem("BMI"));

const water=parseFloat(localStorage.getItem("water"))||0;

const calories=parseInt(localStorage.getItem("calories"));

const profile=localStorage.getItem("profile");

let insights=[];

// BMI

if(bmi>=18.5 && bmi<=24.9){

insights.push("✅ Your BMI is in the healthy range.");

}else if(bmi){

insights.push("⚠ Your BMI needs attention.");

}

// Water

if(water>=2){

insights.push("💧 Great hydration today.");

}else{

insights.push("💧 Drink more water today.");

}

// Calories

if(calories){

insights.push("🔥 Calories calculated successfully.");

}

// Profile

if(profile){

insights.push("👤 Health profile completed.");

}

document.getElementById("aiInsights").innerHTML=

insights.map(i=>`<li>${i}</li>`).join("");

// Weekly Progress

let completed=0;

if(bmi) completed++;

if(water>=2) completed++;

if(calories) completed++;

if(profile) completed++;

const percent=(completed/4)*100;

document.getElementById("weeklyProgress").style.width=percent+"%";

document.getElementById("weeklyText").innerHTML=

completed+" / 4 Goals Completed";

// Daily Goals

document.getElementById("dailyGoals").innerHTML=`

<p>${bmi?"✅":"⬜"} Calculate BMI</p>

<p>${calories?"✅":"⬜"} Calculate Calories</p>

<p>${water>=2?"✅":"⬜"} Drink 2L Water</p>

<p>${profile?"✅":"⬜"} Save Profile</p>

`;

}

updateDashboard();

// ==========================
// CLEAR CHAT
// ==========================

clearChat.onclick=()=>{

history=[];

historyList.innerHTML="<li>No conversations yet.</li>";

chatResponse.innerHTML="AI responses will appear here.";

};

// =========================
// PROFILE MODAL
// =========================

window.addEventListener("load", function () {

    // Restore dashboard and populate all forms from saved profile on every page load
    const savedProfile = JSON.parse(localStorage.getItem("profile"));
    if (savedProfile) {
        calculateHealthMetrics(savedProfile);
        updateDashboard();
        updateHealthScore();

        // Pre-fill Health Profile forms
        document.getElementById("modalName").value = savedProfile.name || "";
        document.getElementById("modalAge").value = savedProfile.age || "";
        document.getElementById("modalHeight").value = savedProfile.height || "";
        document.getElementById("modalWeight").value = savedProfile.weight || "";
        
        const genderEl = document.getElementById("modalGender");
        const goalEl   = document.getElementById("modalGoal");
        const dietEl   = document.getElementById("modalDiet");

        if (genderEl) for (let opt of genderEl.options) opt.selected = opt.value === savedProfile.gender || opt.text === savedProfile.gender;
        if (goalEl)   for (let opt of goalEl.options)   opt.selected = opt.value === savedProfile.goal   || opt.text === savedProfile.goal;
        if (dietEl)   for (let opt of dietEl.options)   opt.selected = opt.value === savedProfile.diet   || opt.text === savedProfile.diet;

        // Pre-fill BMI calculator
        document.getElementById("height").value = savedProfile.height || "";
        document.getElementById("weight").value = savedProfile.weight || "";

        // Pre-fill Calorie calculator
        document.getElementById("calAge").value = savedProfile.age || "";
        document.getElementById("calHeight").value = savedProfile.height || "";
        document.getElementById("calWeight").value = savedProfile.weight || "";
        const calGenderEl = document.getElementById("calGender");
        if (calGenderEl) for (let opt of calGenderEl.options) opt.selected = opt.value === savedProfile.gender || opt.text === savedProfile.gender;

        // Pre-fill Water Tracker
        document.getElementById("waterWeight").value = savedProfile.weight || "";

        // Pre-fill Diet Planner
        const dietGoalEl = document.getElementById("dietGoal");
        const dietTypeEl = document.getElementById("dietType");
        if (dietGoalEl) for (let opt of dietGoalEl.options) opt.selected = opt.value === savedProfile.goal || opt.text === savedProfile.goal;
        if (dietTypeEl) for (let opt of dietTypeEl.options) opt.selected = opt.value === savedProfile.diet || opt.text === savedProfile.diet;

        // Pre-fill Workout Planner
        const workoutGoalEl = document.getElementById("workoutGoal");
        if (workoutGoalEl) for (let opt of workoutGoalEl.options) opt.selected = opt.value === savedProfile.goal || opt.text === savedProfile.goal;
    }

    // Auto-focus chat input
    document.getElementById("chatInput").focus();

    // Profile button — navigate to profile section
    const profileBtn = document.getElementById("profileBtn");
    profileBtn.addEventListener("click", function () {
        switchSection("profile");
    });

});
// =========================
// UPDATE PROFILE
// =========================

document.getElementById("updateProfile").addEventListener("click", function () {

    const profile = {

        name: document.getElementById("modalName").value,

        age: document.getElementById("modalAge").value,

        gender: document.getElementById("modalGender").value,

        height: parseFloat(document.getElementById("modalHeight").value),

        weight: parseFloat(document.getElementById("modalWeight").value),

        goal: document.getElementById("modalGoal").value,

        diet: document.getElementById("modalDiet").value

    };

   saveUserProfile(profile);

calculateHealthMetrics(profile);

localStorage.setItem("name", profile.name);

greeting.innerHTML = `${greet} ${profile.name} 👋`;

updateDashboard();

updateHealthScore();

alert("✅ Profile Updated Successfully!");
});
// =========================
// PROFILE FUNCTIONS
// =========================

function loadProfile() {

    return JSON.parse(localStorage.getItem("profile")) || {};

}
function saveUserProfile(profile) {

    localStorage.setItem("profile", JSON.stringify(profile));

}
function calculateHealthMetrics(profile) {

    const height = Number(profile.height);
    const weight = Number(profile.weight);
    const age = Number(profile.age);
    const gender = profile.gender;
    const goal = profile.goal;

    // ---------- BMI ----------

    const bmi = weight / ((height / 100) * (height / 100));

    document.getElementById("dashboardBMI").innerHTML = bmi.toFixed(1);
    localStorage.setItem("BMI", bmi.toFixed(1));

    // ---------- Water ----------

    const waterGoal = (weight * 35) / 1000;
    localStorage.setItem("waterGoal", waterGoal.toFixed(1));

    const currentWater = parseFloat(localStorage.getItem("water")) || 0;
    document.getElementById("dashboardWater").innerHTML = currentWater.toFixed(2) + " L";

    // ---------- Calories ----------

    let bmr;

    if (gender === "Male") {

        bmr = (10 * weight) +
              (6.25 * height) -
              (5 * age) +
              5;

    } else {

        bmr = (10 * weight) +
              (6.25 * height) -
              (5 * age) -
              161;

    }

    let calories = Math.round(bmr);

    if (goal === "Lose Weight") {

        calories -= 500;

    }
    else if (goal === "Gain Muscle") {

        calories += 300;

    }

    document.getElementById("dashboardCalories").innerHTML =
        calories + " kcal";
    localStorage.setItem("calories", calories);

}

// =========================
// ENTER TO SEND
// =========================

document.getElementById("chatInput").addEventListener("keydown", function (e) {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        document.getElementById("sendMessage").click();

    }

});
// Auto Focus Chat

// =========================
// AUTO SCROLL CHAT
// =========================
function scrollChat(){

    chatResponse.scrollTop = chatResponse.scrollHeight;

}

// =========================
// SIDEBAR MENU HANDLERS & NAVIGATION
// =========================

document.querySelectorAll(".sidebar-item").forEach(item => {
    item.addEventListener("click", function () {
        const sectionId = this.getAttribute("data-section");
        if (sectionId) {
            switchSection(sectionId);
        }
    });
});

// =========================
// SETTINGS: THEME TOGGLE & RESET
// =========================

const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.innerHTML = '<i class="bi bi-sun"></i> Toggle Light Mode';
    }

    themeToggle.onclick = () => {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            themeToggle.innerHTML = '<i class="bi bi-sun"></i> Toggle Light Mode';
        } else {
            localStorage.setItem("theme", "light");
            themeToggle.innerHTML = '<i class="bi bi-moon"></i> Toggle Dark Mode';
        }
    };
}

const resetBtn = document.getElementById("resetDataBtn");
if (resetBtn) {
    resetBtn.onclick = () => {
        if (confirm("Are you sure you want to clear all your health data and profile?")) {
            localStorage.clear();
            location.reload();
        }
    };
}