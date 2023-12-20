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
