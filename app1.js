const jsonData = 'https://raw.githubusercontent.com/ahmedashfaq027/quiz-javascript/master/sample.json';
const proxy = 'https://cors-anywhere.herokuapp.com/';

var firebaseConfig = {
    apiKey: "AIzaSyAq21t9OxjL7lZz-FntDBhVxVt_DjQzMSs",
    authDomain: "quiz-app-ash.firebaseapp.com",
    databaseURL: "https://quiz-app-ash.firebaseio.com",
    projectId: "quiz-app-ash",
    storageBucket: "quiz-app-ash.appspot.com",
    messagingSenderId: "17618840512",
    appId: "1:17618840512:web:aeeb1294dd7109c2a03625",
    measurementId: "G-2YE0PLSC2D"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

window.addEventListener('load', () => {
    // Define elements
    const timerEle = document.querySelector('.timer');
    const timeupEle = document.querySelector('.timeup');
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
        startTimer(parseInt(response.time));
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
        endTest();
    });

    function endTest() {
        let result = getResult(userAnswers, answers);
        thankyouDiv.querySelector('div h3#answered').textContent += userAnswers.filter(Boolean).length + " out of " + answers.length;
        thankyouDiv.querySelector('div h3#score').textContent += result;
        titleEle.querySelector('p').classList.add('hidden');

        testDiv.classList.add('hidden');
        thankyouDiv.classList.remove('hidden');
        timeupEle.classList.remove('hidden');

        addToDB(result);
    }

    function startTimer(seconds) {
        timeupEle.classList.add('hidden');
        timer = setInterval(function () {
            timerEle.innerHTML = `${Math.floor(seconds / 60)}:${seconds % 60}`;
            if (seconds == 0) {
                stopTimer();
                endTest();
            }
            if (seconds <= 10) {
                timerEle.style.transition = 'color 0.5s ease'
                timerEle.style.color = 'red';
            }
            seconds--;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }
});

function getResult(userAnswers, answers) {
    let count = 0;
    for (let i = 0; i < userAnswers.length; i++)
        if (parseInt(userAnswers[i]) === parseInt(answers[i]))
            count++;
    return count;
}

function addToDB(result) {
    const db = firebase.firestore();


    const data = {
        "id": "1",
        "result": result
    }

    db.collection('quiz').doc('chah').set({ "id": 1, "result": result });

}
addToDB();