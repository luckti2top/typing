// typing status
var isTyping = false;
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

