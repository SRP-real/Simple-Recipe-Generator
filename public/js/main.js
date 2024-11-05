
let waitIndicator;

function markdown(text) {
    return text
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/(.*)/gim, '<p>$1</p>') 
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('#input-recipe input');
    const submitButton = document.querySelector('#input-recipe button');
    const output = document.querySelector('#output');
    const recipeOutput = document.querySelector('#recipe-output');
    const closeButton = document.querySelector('#close-button');

    function updateDots() {
        let count = 1;
        return setInterval(() => {
            submitButton.textContent = 'Please wait' + '.'.repeat(count);
            if (count > 3) {
                count = 1;
            } else {
                count = count + 1;
            }
        }, 500);
    }

    closeButton.addEventListener('click', () => {
        recipeOutput.style.display = 'none';
        output.innerHTML = '';
        input.value = '';
    });

    submitButton.addEventListener('click', async () => {
        submitButton.disabled = true;
        waitIndicator = updateDots();
        
        try {
            const ingredients = input.value;
            const response = await fetch('/api/v1/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: ingredients })
            });
            const data = await response.json();
            output.innerHTML = markdown(data.response);
            recipeOutput.style.display = 'block';
        } finally {
            clearInterval(waitIndicator);
            submitButton.textContent = 'Get a Recipe';
            submitButton.disabled = false;
        }
    });
});