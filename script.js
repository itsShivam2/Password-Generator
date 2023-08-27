const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthDisplay]")

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-strengthIndicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~!@#$%^&*()_+`-=[];.:<>,{},?';

let password = "";
let passwordLength = 8;
let checkCount = 0;
handleSlider();

//displays password length on UI
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function getRndInteger(min,max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber()
{
    return getRndInteger(0, 9);
}

function generateLowerCase()
{
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase()
{
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol()
{
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

async function copyContent()
{
    try
    {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e)
    {
        copyMsg.innerText = "failed";  
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str = str + el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    //special condition when all boxes are checked the slider must show atleast 4
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})



generateBtn.addEventListener('click', () => {
    if (checkCount == 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //before generating new password, remove the old one
    password = "";

    let funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }

    for (let i = 0; i < funcArr.length; i++) {
        password = password + funcArr[i]();
    }

    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password = password + funcArr[randIndex]();
    }

    //shuffle password
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calculateStrength();
});

