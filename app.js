const usernameEle = document.querySelector(".field-username input");
const nameEle = document.querySelector(".field-name input");
const classEle = document.querySelector("select#classname");
const submitBtn = document.querySelector(".submit");
const errorIcon = document.querySelectorAll(".fa-exclamation-circle");

submitBtn.addEventListener("click", () => {
    const username = usernameEle.value;
    const name = nameEle.value;
    const classVal = classEle.value;

    const uValidate = validateUsername(username);
    const nValidate = validateName(name);
    if (uValidate && nValidate && classVal != "") {
        window.location.href = "./quiz.html";
    }
});

function validateName(name) {
    const regex = /^[a-z0-9_ ]{3,15}$/;
    if (name.length >= 6) {
        errorIcon[1].classList.add("hidden");
        return true;
    }
    errorIcon[1].classList.remove("hidden");
    return false;
}

function validateUsername(username) {
    const regex = /^[a-z0-9_]{3,15}$/;
    if (username.length >= 6) {
        errorIcon[0].classList.add("hidden");
        return true;
    }
    errorIcon[0].classList.remove("hidden");
    return false;
}
