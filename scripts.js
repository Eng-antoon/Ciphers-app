document.getElementById('encrypt-btn').addEventListener('click', () => {
    processText('encrypt');
});

document.getElementById('decrypt-btn').addEventListener('click', () => {
    processText('decrypt');
});

document.getElementById('clear-btn').addEventListener('click', clearText);

document.getElementById('paste-btn').addEventListener('click', pasteText);

document.getElementById('copy-btn').addEventListener('click', copyToClipboard);

document.getElementById('download-image').addEventListener('click', downloadOutputAsImage);

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
        case 'clock':
            placeholderText = 'مثال: "كشافة" -> شفرة الساعة';
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
        case 'clock':
            outputText = mode === 'encrypt' ? clockCipherEncrypt(inputText) : clockCipherDecrypt(inputText);
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

function downloadOutputAsImage() {
    const outputText = document.getElementById('output-text').value;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const lineHeight = 50;
    const fontSize = 36;

    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 600;

    // Set font
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';

    const lines = outputText.split('|'); // Splitting by "|"
    const x = canvas.width / 2;
    let y = (canvas.height / 2) - ((lines.length / 2) * lineHeight) + fontSize / 2;

    lines.forEach(line => {
        ctx.fillText(line.trim(), x, y);
        y += lineHeight;
    });

    // Create an image and download
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'encrypted_output.png';
    link.click();
}

// Cipher Functions

// Numeric Cipher
function numericEncrypt(text) {
    const alphabet = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
    const encryptedArray = text.split('').map(char => {
        if (char === ' ') return '|'; // Use "|" as the separator
        const index = alphabet.indexOf(char);
        return index !== -1 ? (index + 1) : char;
    });
    return encryptedArray.reverse().join('-'); // Reverse the array before joining
}

function numericDecrypt(code) {
    const alphabet = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
    const decryptedArray = code.split('-').map(num => {
        if (num === '|') return ' '; // Replace "|" back to space
        const index = parseInt(num) - 1;
        return alphabet[index] || num;
    });
    return decryptedArray.reverse().join(''); // Reverse the array before joining
}



// Reverse Cipher
function reverseCipher(text) {
    const alphabet = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي";
    const reverseAlphabet = alphabet.split('').reverse().join('');
    return text.split('').map(char => {
        const index = alphabet.indexOf(char);
        return index !== -1 ? reverseAlphabet[index] : char;
    }).join('');
}


// Jesus Cipher
function jesusEncrypt(text) {
    const matrix = {
        'ا': 'ي1', 'ب': 'ي2', 'ت': 'ي3', 'ث': 'ي4', 'ج': 'ي5', 'ح': 'ي6', 'خ': 'ي7',
        'د': 'س1', 'ذ': 'س2', 'ر': 'س3', 'ز': 'س4', 'س': 'س5', 'ش': 'س6', 'ص': 'س7',
        'ض': 'و1', 'ط': 'و2', 'ظ': 'و3', 'ع': 'و4', 'غ': 'و5', 'ف': 'و6', 'ق': 'و7',
        'ك': 'ع1', 'ل': 'ع2', 'م': 'ع3', 'ن': 'ع4', 'ه': 'ع5', 'و': 'ع6', 'ي': 'ع7'
    };
    return text.split('').map(char => {
        if (char === ' ') return '|'; // Use "|" as the separator
        return matrix[char] || char;
    }).join('-');
}

function jesusDecrypt(code) {
    const matrix = {
        'ي1': 'ا', 'ي2': 'ب', 'ي3': 'ت', 'ي4': 'ث', 'ي5': 'ج', 'ي6': 'ح', 'ي7': 'خ',
        'س1': 'د', 'س2': 'ذ', 'س3': 'ر', 'س4': 'ز', 'س5': 'س', 'س6': 'ش', 'س7': 'ص',
        'و1': 'ض', 'و2': 'ط', 'و3': 'ظ', 'و4': 'ع', 'و5': 'غ', 'و6': 'ف', 'و7': 'ق',
        'ع1': 'ك', 'ع2': 'ل', 'ع3': 'م', 'ع4': 'ن', 'ع5': 'ه', 'ع6': 'و', 'ع7': 'ي'
    };
    return code.split('-').map(pair => {
        if (pair === '|') return ' '; // Replace "|" back to space
        return matrix[pair] || pair;
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
        'ه': '....', 'و': '.--', 'ي': '..', 'ى': '-.--', 'ة': '...-',
        ' ': '|'
    };

    return text.split(' ').map(word => {
        return word.split('').map(char => morseCode[char] || char).join(' ');
    }).join(' | ');
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

// Clock Cipher
function clockCipherEncrypt(text) {
    const clockTable = {
        'ا': '3:00', 'ب': '3:05', 'ت': '3:10', 'ث': '3:15', 'ج': '3:20',
        'ح': '3:25', 'خ': '3:30', 'د': '3:35', 'ذ': '3:40', 'ر': '3:45',
        'ز': '3:50', 'س': '3:55', 'ش': '4:00', 'ص': '4:05', 'ض': '4:10',
        'ط': '4:15', 'ظ': '4:20', 'ع': '4:25', 'غ': '4:30', 'ف': '4:35',
        'ق': '4:40', 'ك': '4:45', 'ل': '4:50', 'م': '4:55', 'ن': '5:00',
        'ه': '5:05', 'و': '5:10', 'ي': '5:15', 'ى': '5:20', 'ة': '5:25',
        '|': '|'
    };
    return text.split('').map(char => char === ' ' ? '|' : clockTable[char] || char).join(' ');
}

function clockCipherDecrypt(code) {
    const clockTable = {
        '3:00': 'ا', '3:05': 'ب', '3:10': 'ت', '3:15': 'ث', '3:20': 'ج',
        '3:25': 'ح', '3:30': 'خ', '3:35': 'د', '3:40': 'ذ', '3:45': 'ر',
        '3:50': 'ز', '3:55': 'س', '4:00': 'ش', '4:05': 'ص', '4:10': 'ض',
        '4:15': 'ط', '4:20': 'ظ', '4:25': 'ع', '4:30': 'غ', '4:35': 'ف',
        '4:40': 'ق', '4:45': 'ك', '4:50': 'ل', '4:55': 'م', '5:00': 'ن',
        '5:05': 'ه', '5:10': 'و', '5:15': 'ي', '5:20': 'ى', '5:25': 'ة',
        '|': '|'
    };
    return code.split(' ').map(symbol => symbol === '|' ? ' ' : clockTable[symbol] || symbol).join('');
}
