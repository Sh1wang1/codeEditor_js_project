
window.onload = () => {
    loadSavedCode();
    setupLineNumbers();
    switchTab("htmlCode");


    document.getElementById("runButton").addEventListener("click", run);
};


function switchTab(id) {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    document.querySelectorAll(".code-area").forEach((area) => area.classList.remove("active"));
    document.querySelectorAll(".line-numbers").forEach((ln) => ln.style.display = "none");

    document.getElementById(id).classList.add("active");
    document.querySelector(`.tab[onclick="switchTab('${id}')"]`).classList.add("active");
    document.getElementById(`${id}-lines`).style.display = "block";
}

function setupLineNumbers() {
    const editors = ["htmlCode", "cssCode", "jsCode"];

    editors.forEach((id) => {
        const textarea = document.getElementById(id);

     
        let lineNumbers = document.getElementById(`${id}-lines`);
        if (!lineNumbers) {
            lineNumbers = document.createElement("div");
            lineNumbers.className = "line-numbers";
            lineNumbers.id = `${id}-lines`;
            textarea.parentNode.insertBefore(lineNumbers, textarea);
        }

        const updateLineNumbers = () => {
            const lines = textarea.value.split("\n").length;
            lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join("<br>");
        };

     
        textarea.addEventListener("input", updateLineNumbers);
        textarea.addEventListener("scroll", () => {
            lineNumbers.scrollTop = textarea.scrollTop;
        });

     
        updateLineNumbers();
        if (id !== "htmlCode") lineNumbers.style.display = "none";
    });
}


// Save code into localStorage
function saveCode() {
    ["html", "css", "js"].forEach((type) => {
        localStorage.setItem(type, document.getElementById(`${type}Code`).value);
    });
}

// Load saved code from localStorage
function loadSavedCode() {
    ["html", "css", "js"].forEach((type) => {
        document.getElementById(`${type}Code`).value = localStorage.getItem(type) || "";
    });

    // Restore output from localStorage
    const savedOutput = localStorage.getItem("output");
    if (savedOutput) {
        const outputFrame = document.getElementById("outputFrame").contentWindow.document;
        outputFrame.open();
        outputFrame.write(savedOutput);
        outputFrame.close();
    }
}

// Execute and render the code in the output iframe
function run() {
    try {
        const htmlCode = document.getElementById("htmlCode").value;
        const cssCode = document.getElementById("cssCode").value;
        const jsCode = document.getElementById("jsCode").value;

        const fullOutput = `
            <html>
                <head><style>${cssCode}</style></head>
                <body>
                    ${htmlCode}
                    <script>${jsCode}<\/script>
                </body>
            </html>
        `;

        const outputFrame = document.getElementById("outputFrame").contentWindow.document;
        outputFrame.open();
        outputFrame.write(fullOutput);
        outputFrame.close();

        // Save code and output to localStorage
        saveCode();
        localStorage.setItem("output", fullOutput);

    } catch (err) {
        alert("Error in your code: " + err.message);
    }
}

// Toggle the three-dot menu visibility
function toggleMenu() {
    const menu = document.getElementById("menuContent");
    menu.classList.toggle("show");
    window.addEventListener("click", (e) => {
        if (!e.target.closest(".menu-container")) menu.classList.remove("show");
    });
}

// Download the complete code as an HTML file
function downloadCode() {
    const htmlCode = document.getElementById("htmlCode").value;
    const cssCode = document.getElementById("cssCode").value;
    const jsCode = document.getElementById("jsCode").value;

    const content = `<!DOCTYPE html><html><head><style>${cssCode}</style></head><body>${htmlCode}<script>${jsCode}<\/script></body></html>`;
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "code.html";
    a.click();
    URL.revokeObjectURL(url);
}

// Clear all code areas and output
// Clear all code areas AND localStorage
function clearCode() {
    ["htmlCode", "cssCode", "jsCode"].forEach((id) => {
        document.getElementById(id).value = "";
    });

    // Clear output and localStorage
    clearOutput();
    localStorage.removeItem("html");
    localStorage.removeItem("css");
    localStorage.removeItem("js");
    localStorage.removeItem("output");

    alert("All code and output have been cleared!");
}

// Clear ONLY the output frame and its saved version
function clearOutput() {
    document.querySelector("iframe").srcdoc = "";
    localStorage.removeItem("output");

    alert("Output has been cleared!");
}


function editorSetting(){}
