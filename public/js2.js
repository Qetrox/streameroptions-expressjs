async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('click', (event) => {
    const MCmodal = document.getElementById('mcModal');
    const MinecraftCustomCommandEditor = document.getElementById('MinecraftCustomCommandEditor');
    if(MinecraftCustomCommandEditor.style.display != 'flex') return;
    if (event.target !== MCmodal && !MCmodal.contains(event.target)) {
        hideMinecraftCustomCommandEditor();
    }
});

async function showMinecraftCustomCommandEditor() {
    await sleep(10);
    const MCmodal = document.getElementById('MinecraftCustomCommandEditor');
    MCmodal.style.display = 'flex';
    MCmodal.style.opacity = 1;
}

function hideMinecraftCustomCommandEditor() {
    const MCmodal = document.getElementById('MinecraftCustomCommandEditor');
    MCmodal.style.opacity = 0;
    setTimeout(() => {
        MCmodal.style.display = 'none';
    }, 150);
}

function tokenButton() {
    const tokenfield = document.getElementById('tokenfield');
    const tokenbutton = document.getElementById('token-button');
    if (tokenfield.type == 'password') {
        tokenfield.type = 'text';
        tokenbutton.textContent = 'Hide Token';
    } else {
        tokenfield.type = 'password';
        tokenbutton.textContent = 'Show Token';
    }
}
const toggleSliders2 = document.querySelectorAll('.toggle2');
const toggleSliders = document.querySelectorAll('.toggle');
const priceInputs = document.querySelectorAll('.price-input');

toggleSliders.forEach( async (slider, index) => {
    await sleep(10);
    slider.addEventListener('change', () => {
        const module = slider.closest('.module');
        module.classList.toggle('module-active');
        const saveButton = module.querySelector('.save-button');
        saveButton.hidden = false;
    });
});
toggleSliders2.forEach( async (slider, index) => {
    await sleep(10);
    slider.addEventListener('change', () => {
        const module = slider.closest('.module');
        module.classList.toggle('module-active');
        const saveButton = module.querySelector('.save-button');
        saveButton.hidden = false;
    });
});

priceInputs.forEach(input => {
    input.addEventListener('change', () => {
        const module = input.parentNode;
        const price = module.querySelector('.price');
        price.textContent = input.value + ' Points';
        const saveButton = module.querySelector('.save-button');
        saveButton.hidden = false;
    });
});

IIlIIIlIIIlll();

function IIlIIIlIIIlll() {
    const b1 = document.getElementById('description');
    const b2 = document.getElementById('slogan');
    const b3 = document.getElementById('checkbox3');
    const a1 = b1.value;
    const a2 = b2.value;

    console.log(a1.length)

    if (a2.length != 0 && a1.length != 0) {
        b3.disabled = false;
    } else if (b3.disabled == false) {
        b3.disabled = true;
    }
} 

function saveCustomMinecraftModules() {
    const saveButton = document.getElementById('minecraftCustomCommandsButton');
    const priceElement = document.getElementById('minecraftCustomCommandsPrice');

    const form = document.getElementById('mcModalForm');
    const formData = new FormData(form);
    const request = new XMLHttpRequest();
    request.open('GET', './save-custom-minecraft-modules?' + new URLSearchParams(formData).toString());
    request.send();

    let modules_enabled = 0;
    for (const [key, value] of formData.entries()) {
        if(key == ('toggled1') || key == ('toggled2') || key == ('toggled3') || key == ('toggled4') || key == ('toggled5')) {
            modules_enabled++;
        }
    }

    request.onload = function () {
        const response = JSON.parse(request.responseText);
        if(response.success) {
            hideMinecraftCustomCommandEditor();

            priceElement.innerHTML = modules_enabled + '/5 Enabled'

            saveButton.value = 'Saved!';
            saveButton.style.color = 'green';
            setTimeout(() => {
                saveButton.value = 'Edit';
                saveButton.style.color = 'black';
            }, 1500);
        } else {
            hideMinecraftCustomCommandEditor();
            saveButton.value = 'Error!';
            saveButton.style.color = 'red';
        }
    }
}

function saveModule(CSRF) {
    const saveButton = event.target;
    const module = saveButton.closest('.module');

    const moduleId = module.querySelector('.module_input');
    const modulePrice = module.querySelector('.price-input');
    const moduleEnabled = module.querySelector('.toggle-slider-checkbox');
    
    // send request
    const request = new XMLHttpRequest();
    request.open('GET', './save-modules?module_id=' + moduleId.value + '&price=' + modulePrice.value + '&toggled=' + moduleEnabled.checked + '&CSRFToken=' + CSRF);
    request.send();
    request.onload = () => {
        const response = JSON.parse(request.responseText);
        if(response.success) {
            saveButton.value = 'Saved!';
            saveButton.style.color = 'green';
            setTimeout(() => {
                saveButton.value = 'Save';
                saveButton.style.color = 'black';
                saveButton.hidden = true;
            }, 1500);
        } else {
            saveButton.value = 'Error!';
            saveButton.style.color = 'red';
        }
    }
    request.onerror = () => {
        console.log(request.responseText);
        saveButton.value = 'Error!';
        saveButton.style.color = 'red';
    }
}