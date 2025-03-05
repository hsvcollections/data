document.addEventListener("DOMContentLoaded", function () {
    let quizItems = Array.from(document.querySelectorAll(".quiz-item"));
    let noResultsMessage = document.querySelector(".no-results");
    let questionCountElement = document.getElementById("question-count");
    let searchInput = document.getElementById("search");

    let data = [];

    // Function to update question and option numbering dynamically
    function updateQuestionNumbers() {
        let visibleItems = quizItems.filter(item => item.style.display !== "none");
        visibleItems.forEach((item, index) => {
            let question = item.querySelector(".question");
            if (question) {
                question.innerText = `${index + 1}. ${question.innerText.replace(/^\d+\.\s*/, '')}`;
            }

            let options = item.querySelectorAll(".options li");
            options.forEach((opt, i) => {
                let optionPrefix = String.fromCharCode(97 + i); // 'a', 'b', 'c', etc.
                opt.innerText = `${optionPrefix}. ${opt.innerText.replace(/^[a-e]\.\s*/, '')}`;
            });
        });
    }

    // Store questions and options for searching
    quizItems.forEach((item, index) => {
        let questionText = item.querySelector(".question").innerText;
        let options = item.querySelectorAll(".options li");

        data.push({ id: index, text: questionText, element: item });

        options.forEach(opt => {
            data.push({ id: index, text: opt.innerText, element: item });
        });
    });

    // Apply initial numbering
    updateQuestionNumbers();
    
    // Set initial question count
    questionCountElement.textContent = `${quizItems.length}`;

    // Initialize Fuse.js for fuzzy searching
    const fuse = new Fuse(data, {
        keys: ["text"],
        threshold: 0.3,
    });

    searchInput.addEventListener("input", function () {
        let input = this.value.trim().toLowerCase();
        let matchedCount = 0;

        if (input === "") {
            // Show all items and reset numbering
            quizItems.forEach(item => item.style.display = "block");
            noResultsMessage.style.display = "none";
            updateQuestionNumbers();
            questionCountElement.textContent = `${quizItems.length}`;
            return;
        }

        let results = fuse.search(input);

        // Hide all first
        quizItems.forEach(item => item.style.display = "none");

        // Show matched items
        results.forEach(res => {
            res.item.element.style.display = "block";
        });

        matchedCount = results.length;
        noResultsMessage.style.display = matchedCount === 0 ? "block" : "none";

        // Update the question count display
        questionCountElement.textContent = `${matchedCount}/${quizItems.length}`;

        // Reapply numbering only for visible items
        updateQuestionNumbers();
    });
});
        function filterQuestions() {
            var selectedType = document.getElementById("question-type").value;
            var allQuestions = document.querySelectorAll(".quiz-item001");

            allQuestions.forEach(function(question) {
                if (selectedType === "all") {
                    question.style.display = "block";
                } else if (question.classList.contains(selectedType)) {
                    question.style.display = "block";
                } else {
                    question.style.display = "none";
                }
            });
        }

        // Show all questions initially
        filterQuestions();

       
