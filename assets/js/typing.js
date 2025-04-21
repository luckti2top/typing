// typing status
var isTyping = false;
// Get the root element where the typed text will be appended
let type_root = document.getElementById("type");
let scroll_type_interval = null;

function getLongestLineText(txt_list) {
    let max_line_text = "";
    txt_list.forEach(txt => {
        if (txt.length > max_line_text.length) {
            max_line_text = txt;
        }
    });
    return max_line_text;
}

function getTypeContentWidth() {
    // var font_size = parseFloat(window.getComputedStyle(type_root, null).getPropertyValue('font-size'));
    padding_left = parseFloat(window.getComputedStyle(type_root, null).getPropertyValue('padding-left'));
    padding_right = parseFloat(window.getComputedStyle(type_root, null).getPropertyValue('padding-right'));
    type_width = type_root.offsetWidth - padding_left - padding_right;
    return type_width;
}

function isMultiline(txt) {
    // Determine the HTML element type based on the Markdown heading syntax
    if (txt.startsWith("# ")) {
        typing_p = document.createElement("h2");
        type_root.appendChild(typing_p);
        txt = txt.substring(2);
    } else if (txt.startsWith("## ")) {
        typing_p = document.createElement("h3");
        type_root.appendChild(typing_p);
        txt = txt.substring(3);
    } else if (txt.startsWith("### ")) {
        typing_p = document.createElement("h4");
        type_root.appendChild(typing_p);
        txt = txt.substring(4);
    } else {
        // Create a p element for normal text
        typing_p = document.createElement("p");
        type_root.appendChild(typing_p);
    }
    typing_p.textContent = txt;
    // let width = typing_p.offsetWidth;
    let height = typing_p.offsetHeight;
    line_height = parseFloat(window.getComputedStyle(type_root, null).getPropertyValue('line-height'));
    let is_multiline = (height > line_height * 1.5)
    type_root.removeChild(typing_p);
    return is_multiline;
}

function switchCenterTheme(txt_list) {
    let longest_line_text = getLongestLineText(txt_list);
    if (isMultiline(longest_line_text)) {
        type_root.style.textAlign = "left";
        type_root.style.justifyContent = "start";
        type_root.style.alignItems = "start";
        type_root.style.display = "block";
        type_root.style.flexDirection = "column";
        scroll_type_interval = setInterval(function () { type_root.scrollTop = type_root.scrollHeight; }, 500)
    }
    else {
        type_root.style.textAlign = "center";
        type_root.style.justifyContent = "center";
        type_root.style.alignItems = "center";
        type_root.style.display = "flex";
        type_root.style.flexDirection = "column";
    }
}

/**
 * Simulates a typewriter effect by displaying a specified text character by character on the page.
 * @param {string} line_text - The text string to be displayed character by character.
 * @param {number} char_index - The index position of the character to be displayed in line_text.
 * @param {number} type_speed - The time interval between each character display, in milliseconds.
 */
function type(line_text, char_index, type_speed) {
    // Check if the current character index is less than the length of the text string. 
    // Use the optional chaining operator to prevent errors when line_text is null or undefined.
    if (char_index < line_text?.length) {
        // Get the element with the id "typing" on the page and append the current character to its HTML content.
        document.getElementById("typing").innerHTML += line_text.charAt(char_index);
        char_index++;
        // Check if all characters have been displayed.
        if (char_index === line_text.length) {
            // All characters have been displayed, mark the typing state as false.
            isTyping = false;
            return;
        } else {
            // There are still characters to be displayed, mark the typing state as true.
            isTyping = true;
        }
        // Recursively call the type function after a specified delay to display the next character.
        setTimeout(type, type_speed, line_text, char_index, type_speed);
    }
}

/**
 * Recursively displays a list of Markdown-formatted texts character by character with a typewriter effect.
 * Skips empty or undefined texts and waits for the current typing to finish before processing the next text.
 * 
 * @param {Array<string>} txt_list - An array of Markdown-formatted text strings to be displayed.
 * @param {number} txt_index - The index of the current text in the txt_list to be processed.
 */
function typingMarkdownTexts(txt_list, txt_index) {
    // Check if the current index is out of the list bounds, if so, exit the function
    if (txt_index >= txt_list.length) {
        // Check if the typing effect is currently in progress, if so, retry after 10ms
        if (scroll_type_interval != null) {
            // waiting until typing finished...
            if (isTyping) {
                setTimeout(typingMarkdownTexts, 10, txt_list, txt_index);
                return;
            }
            clearInterval(scroll_type_interval)
        }
        return;
    }
    // Get the current text and trim whitespace, use optional chaining to prevent errors
    let txt = txt_list[txt_index]?.trim();
    // Check if the current text is empty or undefined, if so, skip to the next text
    if (txt == undefined || txt == null || txt == "") {
        typingMarkdownTexts(txt_list, txt_index + 1);
        return;
    }
    // Check if the typing effect is currently in progress, if so, retry after 10ms
    if (isTyping) {
        setTimeout(typingMarkdownTexts, 10, txt_list, txt_index);
        return;
    }
    // Get the current typing element
    let typing_p = document.getElementById("typing");
    // If the typing element exists, rename its id to mark it as typed
    if (typing_p) typing_p.setAttribute("id", `typed-${txt_index - 1}`);
    // Determine the HTML element type based on the Markdown heading syntax
    if (txt.startsWith("# ")) {
        typing_p = document.createElement("h3");
        type_root.appendChild(typing_p);
        type_root.appendChild(document.createElement("hr"));
        txt = txt.substring(2);
    } else if (txt.startsWith("## ")) {
        typing_p = document.createElement("h4");
        type_root.appendChild(typing_p);
        txt = txt.substring(3);
    } else if (txt.startsWith("### ")) {
        typing_p = document.createElement("h5");
        type_root.appendChild(typing_p);
        txt = txt.substring(4);
    } else {
        // Create a p element for normal text
        typing_p = document.createElement("p");
        type_root.appendChild(typing_p);
    }
    // Set the id of the newly created element to "typing" for the typewriter effect
    typing_p.setAttribute("id", "typing");
    type(txt, 0, speed);
    // Schedule the next text to be processed after the current typing is complete
    setTimeout(typingMarkdownTexts, speed * txt.length, txt_list, txt_index + 1);
    return;
}

