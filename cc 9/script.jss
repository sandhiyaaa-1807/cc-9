let history = JSON.parse(
    localStorage.getItem("internshipHistory")
) || [];

function checkInternship() {
    const company = document.getElementById("company").value.trim();
    const website = document.getElementById("website").value.trim();
    const email = document.getElementById("email").value.trim();
    const fee = document.getElementById("fee").value;
    const message = document.getElementById("message").value.toLowerCase();

    if (!company || !message.trim()) {
        alert("Please enter company name and internship message!");
        return;
    }

    let score = 0;
    let reasons = [];

    // Check registration fee
    if (fee === "yes") {
        score += 35;
        reasons.push("⚠️ Registration fee requested.");
    }

    // Check company website
    if (!website) {
        score += 15;
        reasons.push("⚠️ Company website not provided.");
    } else {
        try {
            const url = new URL(website);

            if (!["http:", "https:"].includes(url.protocol)) {
                throw new Error("Invalid protocol");
            }

            if (url.protocol !== "https:") {
                score += 10;
                reasons.push("⚠️ Website does not use HTTPS.");
            }
        } catch {
            alert("Please enter a valid website URL.");
            return;
        }
    }

    // Check recruiter email
    if (!email) {
        score += 10;
        reasons.push("⚠️ Recruiter email not provided.");
    } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        const freeEmailDomains = [
            "gmail.com",
            "yahoo.com",
            "outlook.com",
            "hotmail.com"
        ];

        const emailDomain = email.split("@")[1].toLowerCase();

        if (freeEmailDomains.includes(emailDomain)) {
            score += 15;
            reasons.push("⚠️ Recruiter uses a free email service.");
        }
    }

    // Suspicious keywords
    const suspiciousWords = [
        "pay now",
        "limited seats",
        "urgent payment",
        "guaranteed job",
        "registration fee",
        "send money",
        "today last date"
    ];

    let detectedWords = suspiciousWords.filter(
        word => message.includes(word)
    );

    if (detectedWords.length > 0) {
        score += Math.min(detectedWords.length * 10, 30);

        reasons.push(
            "⚠️ Suspicious phrases: " +
            detectedWords.join(", ")
        );
    }

    score = Math.min(score, 100);

    let riskLevel;

    if (score >= 60) {
        riskLevel = "🔴 High Risk";
    } else if (score >= 30) {
        riskLevel = "🟠 Medium Risk";
    } else {
        riskLevel = "🟢 Low Risk";
    }

    document.getElementById("resultCard").style.display = "block";

    document.getElementById("riskLevel").textContent = riskLevel;

    document.getElementById("riskScore").textContent =
        "Risk Score: " + score + "/100";

    const reasonsDiv = document.getElementById("reasons");
    reasonsDiv.innerHTML = "";

    if (reasons.length === 0) {
        reasons.push(
            "No suspicious patterns detected. " +
            "Independently verify the company and offer."
        );
    }

    reasons.forEach(reason => {
        const p = document.createElement("p");
        p.textContent = reason;
        reasonsDiv.appendChild(p);
    });

    reasonsDiv.appendChild(
        document.createTextNode(
            "This score is only a heuristic estimate, not proof of authenticity."
        )
    );

    history.unshift({
        company: company,
        risk: riskLevel,
        score: score,
        date: new Date().toLocaleString()
    });

    localStorage.setItem(
        "internshipHistory",
        JSON.stringify(history)
    );

    displayHistory();
}

function displayHistory() {
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "";

    if (history.length === 0) {
        historyDiv.textContent = "No verification history yet.";
        return;
    }

    history.forEach(item => {
        const div = document.createElement("div");
        div.className = "history-item";

        div.textContent =
            item.company + " | " +
            item.risk + " | " +
            item.score + "/100 | " +
            item.date;

        historyDiv.appendChild(div);
    });
}

displayHistory();