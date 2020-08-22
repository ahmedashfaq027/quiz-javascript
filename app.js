const jsonData = 'https://raw.githubusercontent.com/ahmedashfaq027/quiz-javascript/master/sample.json';
const proxy = 'https://cors-anywhere.herokuapp.com/';

window.addEventListener('load', () => {
    // Define elements
    const titleEle = document.querySelector('header');
    const questionEle = document.querySelector('.question h3');
    const options = document.querySelectorAll('.options label span');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const radioInp = document.querySelectorAll('input[name="option"]');
    const submitBtn = document.querySelector('.submit-btn');
    const section = document.querySelector('section');
    const errorText = document.querySelector('.error-text h5');
    const testDiv = document.querySelector('.exam');
    const thankyouDiv = document.querySelector('.thankyou');
    const preload = document.querySelector('.main-preload');

    let counter = 0;
    let questions = {};
    let userAnswers = null, answers = [];

    // Disable buttons
    testDiv.classList.add('hidden');
    nextBtn.classList.add('disabled');
    prevBtn.classList.add('disabled');
    submitBtn.classList.add('disabled');
    errorText.classList.add('hidden');

    // Make Request
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', jsonData);
    xmlHttp.responseType = 'json';
    xmlHttp.send();

    xmlHttp.onload = async function () {
        const response = await xmlHttp.response;
        questions = response.questions;

        questions.forEach(item => {
            answers.push(item.answer);
        });
        userAnswers = new Array(answers.length);
        console.log('fetched');

        // Show the section --  Preload Finished
        preload.classList.add('hidden');
        testDiv.classList.remove('hidden');

        // Set Title
        titleEle.querySelector('h1').textContent = response.title;
        titleEle.querySelector('p').textContent = response.description;


        // Set Question
        setQuestion(questions[counter]);
        onCounterUpdate();
        clearRadioInput();
    }

    function setQuestion(question) {
        const qNo = counter + 1 + '. ';
        questionEle.textContent = qNo + question.description;
        options.forEach((item, index) => {
            item.textContent = question.options[index];
        })
    }

    nextBtn.addEventListener('click', () => {
        if (radioUnchecked()) {
            section.style.animation = "shake 0.5s ease";
            section.addEventListener('animationend', () => {
                section.style.animation = '';
            });
            errorText.textContent = 'Please select an option!';
            errorText.classList.remove('hidden');
        } else if (counter < questions.length) {
            errorText.classList.add('hidden');
            setQuestion(questions[++counter]);
            onCounterUpdate();
            clearRadioInput();
            updateRadioButtons();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (counter > 0) {
            errorText.classList.add('hidden');
            setQuestion(questions[--counter]);
            onCounterUpdate();
            clearRadioInput();
            updateRadioButtons();
        }
    });

    function onCounterUpdate() {
        if (counter == 0) {
            prevBtn.classList.add('disabled');
            nextBtn.classList.remove('disabled');
        }
        else if (counter == questions.length - 1) {
            prevBtn.classList.remove('disabled');
            nextBtn.classList.add('disabled');
            submitBtn.classList.remove('disabled');
        }
        else {
            prevBtn.classList.remove('disabled');
            nextBtn.classList.remove('disabled');
        }
    }

    function radioUnchecked() {
        let value = true;
        radioInp.forEach(item => {
            if (item.checked)
                value = false;
        });
        return value;
    }

    function updateRadioButtons() {
        if (userAnswers[counter] != null) {
            radioInp[userAnswers[counter] - 1].checked = true;
        }
    }

    function clearRadioInput() {
        radioInp.forEach(item => {
            item.checked = false;
        });
    }

    radioInp.forEach(item => {
        item.addEventListener('change', () => {
            userAnswers.splice(counter, 1, item.getAttribute('value'))
        });
    });

    submitBtn.addEventListener('click', () => {
        let result = getResult(userAnswers, answers);
        thankyouDiv.querySelector('div h3#answered').textContent += userAnswers.length;
        thankyouDiv.querySelector('div h3#score').textContent += result;
        titleEle.querySelector('p').classList.add('hidden');

        testDiv.classList.add('hidden');
        thankyouDiv.classList.remove('hidden');
    });
});

function getResult(userAnswers, answers) {
    let count = 0;
    for (let i = 0; i < userAnswers.length; i++)
        if (parseInt(userAnswers[i]) === parseInt(answers[i]))
            count++;
    return count;
}