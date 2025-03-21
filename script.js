window.onload = () => {
  loadSavedCode();
  setupLineNumbers();
  switchTab("htmlCode");

  document.getElementById("runButton").addEventListener("click", run);

  ["htmlCode", "cssCode", "jsCode"].forEach((id) => {
    document.getElementById(id).addEventListener("input", removePlaceholder);
  });
};

function setPlaceholder() {
  const outputFrame = document.getElementById("outputFrame");
  const outputDoc =
    outputFrame.contentDocument || outputFrame.contentWindow.document;

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
  const outputDoc =
    outputFrame.contentDocument || outputFrame.contentWindow.document;

  outputDoc.open();
  outputDoc.write("");
  outputDoc.close();
}

function switchTab(id) {
  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".code-area")
    .forEach((area) => area.classList.remove("active"));
  document
    .querySelectorAll(".line-numbers")
    .forEach((ln) => (ln.style.display = "none"));

  document.getElementById(id).classList.add("active");
  document
    .querySelector(`.tab[onclick="switchTab('${id}')"]`)
    .classList.add("active");
  document.getElementById(`${id}-lines`).style.display = "block";
}

function run() {
  const htmlCode = document.getElementById("htmlCode").value.trim();
  const cssCode = document.getElementById("cssCode").value;
  const jsCode = document.getElementById("jsCode").value;

  const outputFrame = document.getElementById("outputFrame");
  const outputDoc =
    outputFrame.contentDocument || outputFrame.contentWindow.document;

  outputDoc.open();

  if (htmlCode === "" && cssCode === "" && jsCode === "") {
    setPlaceholder();
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
      lineNumbers.innerHTML = Array.from(
        { length: lines },
        (_, i) => i + 1
      ).join("<br>");
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
    document.getElementById(`${type}Code`).value =
      localStorage.getItem(type) || "";
  });

  const savedOutput = localStorage.getItem("output");
  if (savedOutput) {
    const outputFrame =
      document.getElementById("outputFrame").contentWindow.document;
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

function beautifyCode() {
    const htmlCode = document.getElementById("htmlCode");
    const cssCode = document.getElementById("cssCode");
    const jsCode = document.getElementById("jsCode");

    htmlCode.value = html_beautify(htmlCode.value, { indent_size: 4, wrap_line_length: 80 });
    cssCode.value = css_beautify(cssCode.value, { indent_size: 4 });
    jsCode.value = js_beautify(jsCode.value, { indent_size: 4 });

  
    localStorage.setItem("html", htmlCode.value);
    localStorage.setItem("css", cssCode.value);
    localStorage.setItem("js", jsCode.value);

}
function showConfirmation(message, onConfirm) {
    const confirmationBox = document.createElement("div");
    confirmationBox.className = "confirmation-dialog";
    confirmationBox.innerHTML = `
        <div class="confirmation-content">
            <p>${message}</p>
            <button id="confirmYes">Yes</button>
            <button id="confirmNo">No</button>
        </div>
    `;
    document.body.appendChild(confirmationBox);

    document.getElementById("confirmYes").addEventListener("click", () => {
        document.body.removeChild(confirmationBox);
        onConfirm();
    });

    document.getElementById("confirmNo").addEventListener("click", () => {
        document.body.removeChild(confirmationBox);
    });
}

function clearCode() {
    showConfirmation("Are you sure you want to delete all code and output?", () => {
        ["htmlCode", "cssCode", "jsCode"].forEach((id) => {
            document.getElementById(id).value = "";
        });

        localStorage.removeItem("html");
        localStorage.removeItem("css");
        localStorage.removeItem("js");
        localStorage.removeItem("output");

        const outputFrame = document.getElementById("outputFrame");
        const outputDoc = outputFrame.contentDocument || outputFrame.contentWindow.document;
        outputDoc.open();
        outputDoc.write("");
        outputDoc.close();

    });
}

function clearOutput() {
    showConfirmation("Are you sure you want to clear the output only?", () => {
        document.querySelector("iframe").srcdoc = "";
        localStorage.removeItem("output");

    });
}


function editorSetting() {}
function copyCode() {
    const activeCodeArea = document.querySelector(".code-area.active");
    const copyButton = document.getElementById("copyButton");

    if (activeCodeArea) {
        const code = activeCodeArea.value;

        if (code.trim() === "") {
            alert("Nothing to copy!");
            return;
        }

        navigator.clipboard
            .writeText(code)
            .then(() => {
              
                copyButton.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
                copyButton.style.background = "grey";
                
                copyButton.style.transition = "0.3s ease-in-out";

                
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Code';
                    copyButton.style.background = "#444";
                }, 2000);
            })
            .catch(() => alert("❌ Failed to copy code!"));
    }
}
