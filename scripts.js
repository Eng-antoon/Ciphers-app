document.getElementById('encrypt-btn').addEventListener('click', () => {
    processText('encrypt');
});

document.getElementById('decrypt-btn').addEventListener('click', () => {
    processText('decrypt');
});

document.getElementById('clear-btn').addEventListener('click', clearText);

document.getElementById('paste-btn').addEventListener('click', pasteText);

document.getElementById('copy-btn').addEventListener('click', copyToClipboard);

function updatePlaceholder() {
    const cipherType = document.getElementById('cipher-type').value;
    const inputText = document.getElementById('input-text');
    let placeholderText = '';

    switch (cipherType) {
        case 'numeric':
            placeholderText = 'مثال: "أبجد" -> "1-2-3-4" أو "كشافة" -> "22-1-19-21-7"';
            break;
        case 'reverse':
            placeholderText = 'مثال: "كشافة" -> "ةفاشك"';
            break;
        case 'jesus':
            placeholderText = 'مثال: "كشافة" -> الرموز المربعة لشبكة الحروف';
            break;
        case 'caesar':
            placeholderText = 'مثال: "كشافة" مع إزاحة معينة -> "لمصغحة"';
            break;
        case 'polybius':
            placeholderText = 'مثال: "كشافة" -> أرقام تمثل الصفوف والأعمدة';
            break;
        case 'morse':
            placeholderText = 'مثال: "كشافة" -> "-.-. .- ... .... ..-. ..-"';
            break;
        case 'x-cipher':
            placeholderText = 'مثال: "كشافة" -> طريقة شفرة الإكس';
            break;
        case 'semaphore':
            placeholderText = 'مثال: "كشافة" -> إشارات السيمافور';
            break;
    }

    inputText.placeholder = placeholderText;
    toggleCaesarInput(cipherType === 'caesar');
}

function toggleCaesarInput(show) {
    document.getElementById('caesar-index-container').style.display = show ? 'block' : 'none';
}

function toggleButtons() {
    const cipherType = document.getElementById('cipher-type').value;
    const buttonsContainer = document.getElementById('buttons-container');

    if (cipherType === 'morse') {
        buttonsContainer.style.display = 'block';
    } else {
        buttonsContainer.style.display = 'none';
    }
}

function appendInput(value) {
    const inputText = document.getElementById('input-text');
    inputText.value += value;
}

function processText(mode) {
    const cipherType = document.getElementById('cipher-type').value;
    const inputText = document.getElementById('input-text').value.trim();
    let outputText = '';

    switch (cipherType) {
        case 'numeric':
            outputText = mode === 'encrypt' ? numericEncrypt(inputText) : numericDecrypt(inputText);
            break;
        case 'reverse':
            outputText = reverseCipher(inputText);
            break;
        case 'jesus':
            outputText = mode === 'encrypt' ? jesusEncrypt(inputText) : jesusDecrypt(inputText);
            break;
        case 'caesar':
            const shift = parseInt(document.getElementById('caesar-index').value, 10);
            outputText = mode === 'encrypt' ? caesarEncrypt(inputText, shift) : caesarDecrypt(inputText, shift);
            break;
        case 'polybius':
            outputText = mode === 'encrypt' ? polybiusEncrypt(inputText) : polybiusDecrypt(inputText);
            break;
        case 'morse':
            outputText = mode === 'encrypt' ? morseEncrypt(inputText) : morseDecrypt(inputText);
            break;
        case 'x-cipher':
            outputText = mode === 'encrypt' ? xCipherEncrypt(inputText) : xCipherDecrypt(inputText);
            break;
        case 'semaphore':
            outputText = mode === 'encrypt' ? semaphoreEncrypt(inputText) : semaphoreDecrypt(inputText);
            break;
    }

    if (mode === 'encrypt' && (inputText === outputText || !inputText)) {
        showWarning();
    } else {
        document.getElementById('output-text').value = outputText;
    }
}

function copyToClipboard() {
    const outputText = document.getElementById('output-text');
    outputText.select();
    document.execCommand('copy');
}

function showWarning() {
    const warning = document.getElementById('warning');
    warning.style.display = 'block';
    setTimeout(() => {
        warning.style.display = 'none';
    }, 4000);
}

function toggleMenu() {
    const menu = document.querySelector('.menu-content');
    menu.classList.toggle('open');
}

function clearText() {
    document.getElementById('input-text').value = '';
    document.getElementById('output-text').value = '';
}

function pasteText() {
    navigator.clipboard.readText().then(text => {
        document.getElementById('input-text').value = text;
    });
}

function toggleInstantConvert() {
    const instantConvert = document.getElementById('instant-convert').checked;
    document.getElementById('encrypt-btn').style.display = instantConvert ? 'none' : 'inline-block';
    document.getElementById('decrypt-btn').style.display = instantConvert ? 'none' : 'inline-block';
    document.getElementById('instant-mode').style.display = instantConvert ? 'inline-block' : 'none';
}

function handleInstantConvert() {
    if (document.getElementById('instant-convert').checked) {
        const mode = document.getElementById('instant-mode').value;
        processText(mode);
    }
}

// Cipher Functions

// Numeric Cipher
function numericEncrypt(text) {
    const alphabet = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
    return text.split('').map(char => {
        if (char === ' ') return '|'; // Use "|" as the separator
        const index = alphabet.indexOf(char);
        return index !== -1 ? (index + 1) : char;
    }).join('-');
}

function numericDecrypt(code) {
    const alphabet = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
    return code.split('-').map(num => {
        if (num === '|') return ' '; // Replace "|" back to space
        const index = parseInt(num) - 1;
        return alphabet[index] || num;
    }).join('');
}

// Reverse Cipher
function reverseCipher(text) {
    return text.split('').reverse().join('');
}

// Jesus Cipher
function jesusEncrypt(text) {
    const matrix = [
        ['ا', 'ب', 'ت', 'ث', 'ج'],
        ['ح', 'خ', 'د', 'ذ', 'ر'],
        ['ز', 'س', 'ش', 'ص', 'ض'],
        ['ط', 'ظ', 'ع', 'غ', 'ف'],
        ['ق', 'ك', 'ل', 'م', 'ن'],
        ['ه', 'و', 'ي', 'ى', 'ة']
    ];
    return text.split('').map(char => {
        if (char === ' ') return '|'; // Use "|" as the separator
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === char) {
                    return `${i + 1}${j + 1}`;
                }
            }
        }
        return char;
    }).join('-');
}

function jesusDecrypt(code) {
    const matrix = [
        ['ا', 'ب', 'ت', 'ث', 'ج'],
        ['ح', 'خ', 'د', 'ذ', 'ر'],
        ['ز', 'س', 'ش', 'ص', 'ض'],
        ['ط', 'ظ', 'ع', 'غ', 'ف'],
        ['ق', 'ك', 'ل', 'م', 'ن'],
        ['ه', 'و', 'ي', 'ى', 'ة']
    ];
    return code.split('-').map(pair => {
        if (pair === '|') return ' '; // Replace "|" back to space
        const row = parseInt(pair[0]) - 1;
        const col = parseInt(pair[1]) - 1;
        return matrix[row][col];
    }).join('');
}

// Caesar Cipher
function caesarEncrypt(text, shift) {
    const alphabet = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
    return text.split('').map(char => {
        if (char === ' ') return '|'; // Use "|" as the separator
        const index = alphabet.indexOf(char);
        return index !== -1 ? alphabet[(index + shift) % alphabet.length] : char;
    }).join('');
}

function caesarDecrypt(text, shift) {
    const alphabet = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
    return text.split('').map(char => {
        if (char === '|') return ' '; // Replace "|" back to space
        const index = alphabet.indexOf(char);
        return index !== -1 ? alphabet[(index - shift + alphabet.length) % alphabet.length] : char;
    }).join('');
}

// Polybius Square Cipher
function polybiusEncrypt(text) {
    const matrix = [
        ['ا', 'ب', 'ت', 'ث', 'ج'],
        ['ح', 'خ', 'د', 'ذ', 'ر'],
        ['ز', 'س', 'ش', 'ص', 'ض'],
        ['ط', 'ظ', 'ع', 'غ', 'ف'],
        ['ق', 'ك', 'ل', 'م', 'ن'],
        ['ه', 'و', 'ي', 'ى', 'ة']
    ];
    return text.split('').map(char => {
        if (char === ' ') return '|'; // Use "|" as the separator
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === char) {
                    return `${i + 1}${j + 1}`;
                }
            }
        }
        return char;
    }).join('-');
}

function polybiusDecrypt(code) {
    const matrix = [
        ['ا', 'ب', 'ت', 'ث', 'ج'],
        ['ح', 'خ', 'د', 'ذ', 'ر'],
        ['ز', 'س', 'ش', 'ص', 'ض'],
        ['ط', 'ظ', 'ع', 'غ', 'ف'],
        ['ق', 'ك', 'ل', 'م', 'ن'],
        ['ه', 'و', 'ي', 'ى', 'ة']
    ];
    return code.split('-').map(pair => {
        if (pair === '|') return ' '; // Replace "|" back to space
        const row = parseInt(pair[0]) - 1;
        const col = parseInt(pair[1]) - 1;
        return matrix[row][col];
    }).join('');
}

// Morse Code Cipher
function morseEncrypt(text) {
    const morseCode = {
        'ا': '.-', 'ب': '-...', 'ت': '-.-.', 'ث': '-..', 'ج': '.---',
        'ح': '....', 'خ': '-.-.', 'د': '-..', 'ذ': '-.-', 'ر': '.-.', 
        'ز': '--..', 'س': '...', 'ش': '---', 'ص': '-.-.', 'ض': '-..-', 
        'ط': '-', 'ظ': '--.', 'ع': '.--', 'غ': '--.-', 'ف': '..-.', 
        'ق': '--.', 'ك': '-.-', 'ل': '.-..', 'م': '--', 'ن': '-.', 
        'ه': '....', 'و': '.--', 'ي': '..', 'ى': '-.--', 'ة': '...-', '|': '|'
    };
    return text.split('').map(char => morseCode[char] || char).join(' ');
}

function morseDecrypt(code) {
    const morseCode = {
        'ا': '.-', 'ب': '-...', 'ت': '-.-.', 'ث': '-..', 'ج': '.---',
        'ح': '....', 'خ': '-.-.', 'د': '-..', 'ذ': '-.-', 'ر': '.-.', 
        'ز': '--..', 'س': '...', 'ش': '---', 'ص': '-.-.', 'ض': '-..-', 
        'ط': '-', 'ظ': '--.', 'ع': '.--', 'غ': '--.-', 'ف': '..-.', 
        'ق': '--.', 'ك': '-.-', 'ل': '.-..', 'م': '--', 'ن': '-.', 
        'ه': '....', 'و': '.--', 'ي': '..', 'ى': '-.--', 'ة': '...-', '|': '|'
    };
    const inverseMorseCode = Object.fromEntries(Object.entries(morseCode).map(([v, k]) => [k, v]));
    return code.split(' ').map(symbol => symbol === '|' ? ' ' : inverseMorseCode[symbol] || symbol).join('');
}

// X-Cipher
function xCipherEncrypt(text) {
    const xCipherTable = {
        'ا': '1-1', 'ب': '1-2', 'ت': '1-3', 'ث': '1-4', 'ج': '1-5',
        'ح': '2-1', 'خ': '2-2', 'د': '2-3', 'ذ': '2-4', 'ر': '2-5',
        'ز': '3-1', 'س': '3-2', 'ش': '3-3', 'ص': '3-4', 'ض': '3-5',
        'ط': '4-1', 'ظ': '4-2', 'ع': '4-3', 'غ': '4-4', 'ف': '4-5',
        'ق': '5-1', 'ك': '5-2', 'ل': '5-3', 'م': '5-4', 'ن': '5-5',
        'ه': '6-1', 'و': '6-2', 'ي': '6-3', 'ى': '6-4', 'ة': '6-5',
        '|': '|'
    };
    return text.split('').map(char => char === ' ' ? '|' : xCipherTable[char] || char).join(' ');
}

function xCipherDecrypt(code) {
    const xCipherTable = {
        '1-1': 'ا', '1-2': 'ب', '1-3': 'ت', '1-4': 'ث', '1-5': 'ج',
        '2-1': 'ح', '2-2': 'خ', '2-3': 'د', '2-4': 'ذ', '2-5': 'ر',
        '3-1': 'ز', '3-2': 'س', '3-3': 'ش', '3-4': 'ص', '3-5': 'ض',
        '4-1': 'ط', '4-2': 'ظ', '4-3': 'ع', '4-4': 'غ', '4-5': 'ف',
        '5-1': 'ق', '5-2': 'ك', '5-3': 'ل', '5-4': 'م', '5-5': 'ن',
        '6-1': 'ه', '6-2': 'و', '6-3': 'ي', '6-4': 'ى', '6-5': 'ة',
        '|': '|'
    };
    return code.split(' ').map(pair => pair === '|' ? ' ' : xCipherTable[pair] || pair).join('');
}

// Semaphore Cipher
function semaphoreEncrypt(text) {
    const semaphoreTable = {
        'ا': '⧫', 'ب': '◪', 'ت': '◩', 'ث': '◨', 'ج': '◧',
        'ح': '◥', 'خ': '◤', 'د': '◣', 'ذ': '◢', 'ر': '◡',
        'ز': '◠', 'س': '◸', 'ش': '◷', 'ص': '◶', 'ض': '◵',
        'ط': '◴', 'ظ': '◳', 'ع': '◰', 'غ': '◯', 'ف': '◮',
        'ق': '◭', 'ك': '◬', 'ل': '◫', 'م': '◪', 'ن': '◩',
        'ه': '◨', 'و': '◧', 'ي': '◦', 'ى': '◩', 'ة': '◫',
        '|': '|'
    };
    return text.split('').map(char => char === ' ' ? '|' : semaphoreTable[char] || char).join(' ');
}

function semaphoreDecrypt(code) {
    const semaphoreTable = {
        '⧫': 'ا', '◪': 'ب', '◩': 'ت', '◨': 'ث', '◧': 'ج',
        '◥': 'ح', '◤': 'خ', '◣': 'د', '◢': 'ذ', '◡': 'ر',
        '◠': 'ز', '◸': 'س', '◷': 'ش', '◶': 'ص', '◵': 'ض',
        '◴': 'ط', '◳': 'ظ', '◰': 'ع', '◯': 'غ', '◮': 'ف',
        '◭': 'ق', '◬': 'ك', '◫': 'ل', '◪': 'م', '◩': 'ن',
        '◨': 'ه', '◧': 'و', '◦': 'ي', '◩': 'ى', '◫': 'ة',
        '|': '|'
    };
    return code.split(' ').map(symbol => symbol === '|' ? ' ' : semaphoreTable[symbol] || symbol).join('');
}
