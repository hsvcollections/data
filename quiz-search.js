document.addEventListener("DOMContentLoaded", function () {
    let quizItems = document.querySelectorAll(".quiz-item");
    let data = [];
    let noResultsMessage = document.querySelector(".no-results");
    let questionCountElement = document.getElementById("question-count");
    const searchInput = document.getElementById("search");

    // Function to update question and option numbering
    function updateQuestionNumbers() {
        let visibleItems = Array.from(quizItems).filter(item => item.style.display !== "none");

        visibleItems.forEach((item, index) => {
            let question = item.querySelector(".question");
            if (question) {
                question.innerText = `${index + 1}. ${question.innerText.replace(/^\d+\.\s*/, '')}`;
            }

            let options = item.querySelectorAll(".options li");
            options.forEach((opt, i) => {
                let optionPrefix = String.fromCharCode(97 + i);
                opt.innerText = `${optionPrefix}. ${opt.innerText.replace(/^[a-e]\.\s*/, '')}`;
            });
        });

        questionCountElement.textContent = `${visibleItems.length}/${quizItems.length}`;
    }

    // Store questions and options for search
    quizItems.forEach((item, index) => {
        let questionText = item.querySelector(".question").innerText;
        let options = item.querySelectorAll(".options li");

        data.push({ id: index, text: questionText, element: item });

        options.forEach((opt) => {
            data.push({ id: index, text: opt.innerText, element: item });
        });
    });

    // Initialize Fuse.js for fuzzy searching
    const fuse = new Fuse(data, {
        keys: ["text"],
        threshold: 0.3,
    });

    // Apply numbering initially
    updateQuestionNumbers();

    // Search functionality
    searchInput.addEventListener("input", function () {
        let input = this.value.trim();
        if (input === "") {
            quizItems.forEach(item => item.style.display = "block");
            noResultsMessage.style.display = "none";
        } else {
            let results = fuse.search(input);

            quizItems.forEach(item => item.style.display = "none");

            results.forEach(res => {
                res.item.element.style.display = "block";
            });

            noResultsMessage.style.display = results.length === 0 ? "block" : "none";
        }

        updateQuestionNumbers();
    });
});
