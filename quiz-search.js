    document.addEventListener("DOMContentLoaded", function () {
    let quizItems = document.querySelectorAll(".quiz-item");
    let data = [];
    let noResultsMessage = document.querySelector(".no-results");

    // Function to update question and option numbering
    function updateQuestionNumbers() {
        quizItems.forEach((item, index) => {
            // Add question number
            let question = item.querySelector(".question");
            if (question) {
                question.innerText = `${index + 1}. ${question.innerText.replace(/^\d+\.\s*/, '')}`; // Ensure clean numbering
            }

            // Add option labels
            let options = item.querySelectorAll(".options li");
            options.forEach((opt, i) => {
                let optionPrefix = String.fromCharCode(97 + i); // 'a' = 97, 'b' = 98, etc.
                opt.innerText = `${optionPrefix}. ${opt.innerText.replace(/^[a-e]\.\s*/, '')}`;
            });
        });
    }

    // Store questions and options in an array
    quizItems.forEach((item, index) => {
        let questionText = item.querySelector(".question").innerText;
        let options = item.querySelectorAll(".options li");

        // Add the question itself as a searchable item
        data.push({ id: index, text: questionText, element: item });

        // Add each option as a separate searchable item
        options.forEach((opt, i) => {
            let optionText = opt.innerText;
            data.push({ id: index, text: optionText, element: item });
        });
    });

    // Apply numbering initially
    updateQuestionNumbers();

    // Initialize Fuse.js for fuzzy searching
    const fuse = new Fuse(data, {
        keys: ["text"],
        threshold: 0.3,
    });

    document.getElementById("search").addEventListener("input", function () {
        let input = this.value.trim();
        if (input === "") {
            quizItems.forEach(item => item.style.display = "block");
            noResultsMessage.style.display = "none"; // Hide "No data found" message
            updateQuestionNumbers(); // Reapply numbering
            return;
        }

        let results = fuse.search(input);

        // Hide all items first
        quizItems.forEach(item => item.style.display = "none");

        // Show matched items
        results.forEach(res => {
            res.item.element.style.display = "block";
        });

        // Show "No data found" message if no results
        noResultsMessage.style.display = results.length === 0 ? "block" : "none";

        // Reapply numbering only to visible items
        updateQuestionNumbers();
    });
});

document.addEventListener("DOMContentLoaded", function () {
      const searchInput = document.getElementById("search");
      const quizItems = document.querySelectorAll(".quiz-item");
      const questionCountElement = document.getElementById("question-count");

      // Set initial question count
      questionCountElement.textContent = `Total Questions: ${quizItems.length}`;

      searchInput.addEventListener("input", function () {
        const searchQuery = searchInput.value.toLowerCase();
        let matchedCount = 0;

        quizItems.forEach((item) => {
          if (item.textContent.toLowerCase().includes(searchQuery)) {
            item.style.display = "block";
            matchedCount++;
          } else {
            item.style.display = "none";
          }
        });

        questionCountElement.textContent = `${matchedCount}/${quizItems.length}`;
      });
    });
