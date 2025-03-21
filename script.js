window.onload = () => {
    loadSavedCode();
    setupLineNumbers();
    switchTab("htmlCode");
    setPlaceholder();

    document.getElementById("runButton").addEventListener("click", run);

    ["htmlCode", "cssCode", "jsCode"].forEach((id) => {
        document.getElementById(id).addEventListener("input", removePlaceholder);
    });
};

// Set placeholder output
function setPlaceholder() {
    const outputFrame = document.getElementById("outputFrame");
    const outputDoc = outputFrame.contentDocument || outputFrame.contentWindow.document;

    outputDoc.open();
    outputDoc.write(`
        <html>
            <body style="display: flex; justify-content: center; align-items: center; height: 90vh; background:rgb(226, 226, 226);">
                <h2 style="color: black; font-size: 1.35em; 
                    text-shadow: 2px 2px 5px rgba(223, 219, 219, 0.2),
                                 -2px -2px 5px rgba(0, 0, 0, 0.2),
                                 2px -2px 5px rgba(209, 206, 206, 0.2),
                                 -2px 2px 5px rgba(0, 0, 0, 0.2);">
                    ✍️ Please write your code before running!
                </h2>
            </body>
        </html>
    `);
    outputDoc.close();
}


function removePlaceholder() {
    const outputFrame = document.getElementById("outputFrame");
    const outputDoc = outputFrame.contentDocument || outputFrame.contentWindow.document;

    if (outputDoc.body.innerText.includes("Please write your code before running!")) {
        outputDoc.open();
        outputDoc.write("");
        outputDoc.close();
    }
}


function switchTab(id) {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    document.querySelectorAll(".code-area").forEach((area) => area.classList.remove("active"));
    document.querySelectorAll(".line-numbers").forEach((ln) => ln.style.display = "none");

    document.getElementById(id).classList.add("active");
    document.querySelector(`.tab[onclick="switchTab('${id}')"]`).classList.add("active");
    document.getElementById(`${id}-lines`).style.display = "block";
}


function run() {
    try {
        const htmlCode = document.getElementById("htmlCode").value.trim();
        const cssCode = document.getElementById("cssCode").value;
        const jsCode = document.getElementById("jsCode").value;

        const outputFrame = document.getElementById("outputFrame");
        const outputDoc = outputFrame.contentDocument || outputFrame.contentWindow.document;

        outputDoc.open();

        if (htmlCode === "") {
            setPlaceholder();  // Reset placeholder if no HTML code
        } else {
            const fullOutput = `
                <html>
                    <head><style>${cssCode}</style></head>
                    <body>
                        ${htmlCode}
                        <script>${jsCode}<\/script>
                    </body>
                </html>
            `;

            outputDoc.write(fullOutput);

            saveCode();
            localStorage.setItem("output", fullOutput);
        }

        outputDoc.close();
    } catch (err) {
        alert("Error in your code: " + err.message);
    }
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


function saveCode() {
    ["html", "css", "js"].forEach((type) => {
        localStorage.setItem(type, document.getElementById(`${type}Code`).value);
    });
}


function loadSavedCode() {
    ["html", "css", "js"].forEach((type) => {
        document.getElementById(`${type}Code`).value = localStorage.getItem(type) || "";
    });

    const savedOutput = localStorage.getItem("output");
    if (savedOutput) {
        const outputFrame = document.getElementById("outputFrame").contentWindow.document;
        outputFrame.open();
        outputFrame.write(savedOutput);
        outputFrame.close();
    }
}


function toggleMenu() {
    const menu = document.getElementById("menuContent");
    menu.classList.toggle("show");
    window.addEventListener("click", (e) => {
        if (!e.target.closest(".menu-container")) menu.classList.remove("show");
    });
}


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

function clearCode() {
    ["htmlCode", "cssCode", "jsCode"].forEach((id) => {
        document.getElementById(id).value = "";
    });

    clearOutput();
    localStorage.removeItem("html");
    localStorage.removeItem("css");
    localStorage.removeItem("js");
    localStorage.removeItem("output");

    alert("All code and output have been cleared!");
}

function clearOutput() {
    document.querySelector("iframe").srcdoc = "";
    localStorage.removeItem("output");

    alert("Output has been cleared!");
}

function editorSetting() {}
