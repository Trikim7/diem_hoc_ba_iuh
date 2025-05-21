document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded successfully.");
  // Tab switching
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabPanes = document.querySelectorAll(".tab-pane")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and panes
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabPanes.forEach((pane) => pane.classList.remove("active"))

      // Add active class to clicked button and corresponding pane
      button.classList.add("active")
      const tabId = button.getAttribute("data-tab")
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Input validation for scores
  const scoreInputs = document.querySelectorAll(".input")
  scoreInputs.forEach((input) => {
    input.addEventListener("input", function () {
      // Only allow numbers and decimal point
      let value = this.value.replace(/[^0-9.]/g, "")

      // Ensure only one decimal point
      const decimalCount = (value.match(/\./g) || []).length
      if (decimalCount > 1) {
        value = value.substring(0, value.lastIndexOf("."))
      }

      this.value = value

      // Ensure value is between 0 and 10
      if (this.value !== "") {
        const numValue = Number.parseFloat(this.value)
        if (numValue < 0) this.value = "0"
        if (numValue > 10) this.value = "10"
      }
    })
  })

  // Reset form
  const resetBtn = document.getElementById("resetBtn")
  resetBtn.addEventListener("click", () => {
    // Reset all inputs
    document.querySelectorAll(".input").forEach((input) => {
      input.value = ""
    })

    // Reset radio buttons to default
    document.getElementById("kv3").checked = true
    document.getElementById("ut0").checked = true

    // Reset checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false
    })

    // Hide results
    document.getElementById("resultsCard").style.display = "none"
    document.getElementById("guideCard").style.display = "block"
  })

  // Calculate button
  const calculateBtn = document.getElementById("calculateBtn")
  calculateBtn.addEventListener("click", calculateAdmissionScore)

  // Define subject combinations from the CSV data
  const subjectCombinations = [
    { name: "Toán, Vật lý, Hóa học", subjects: ["toan", "vatLy", "hoaHoc"] },
    { name: "Toán, Vật lý, Tiếng Anh", subjects: ["toan", "vatLy", "tiengAnh"] },
    { name: "Toán, Hóa học, Sinh học", subjects: ["toan", "hoaHoc", "sinhHoc"] },
    { name: "Toán, Ngữ văn, Tiếng Anh", subjects: ["toan", "nguVan", "tiengAnh"] },
    { name: "Toán, Ngữ văn, Vật lý", subjects: ["toan", "nguVan", "vatLy"] },
    { name: "Toán, Ngữ văn, Hóa học", subjects: ["toan", "nguVan", "hoaHoc"] },
    { name: "Ngữ văn, Lịch sử, Địa lý", subjects: ["nguVan", "lichSu", "diaLy"] },
    { name: "Ngữ văn, Lịch sử, Tiếng Anh", subjects: ["nguVan", "lichSu", "tiengAnh"] },
    { name: "Ngữ văn, Địa lý, Tiếng Anh", subjects: ["nguVan", "diaLy", "tiengAnh"] },
    { name: "Toán, Ngữ văn, Lịch sử", subjects: ["toan", "nguVan", "lichSu"] },
    { name: "Toán, Ngữ văn, Địa lý", subjects: ["toan", "nguVan", "diaLy"] },
    { name: "Toán, Lịch sử, Địa lý", subjects: ["toan", "lichSu", "diaLy"] },
    { name: "Ngữ văn, GDKT-Pháp luật, Tiếng Anh", subjects: ["nguVan", "gdkt", "tiengAnh"] },
    { name: "Toán, GDKT-Pháp luật, Tiếng Anh", subjects: ["toan", "gdkt", "tiengAnh"] },
    { name: "Toán, Vật lý, Tin học", subjects: ["toan", "vatLy", "tinHoc"] },
    { name: "Toán, Ngữ văn, Tin học", subjects: ["toan", "nguVan", "tinHoc"] },
    { name: "Toán, Tiếng Anh, Tin học", subjects: ["toan", "tiengAnh", "tinHoc"] },
    { name: "Toán, Ngữ văn, GDKT-Pháp luật", subjects: ["toan", "nguVan", "gdkt"] },
    { name: "Toán, Vật lý, GDKT-Pháp luật", subjects: ["toan", "vatLy", "gdkt"] },
    { name: "Toán, Hóa học, GDKT-Pháp luật", subjects: ["toan", "hoaHoc", "gdkt"] },
    { name: "Toán, Sinh học, GDKT-Pháp luật", subjects: ["toan", "sinhHoc", "gdkt"] },
    { name: "Toán, Vật lý, Công nghệ nông nghiệp", subjects: ["toan", "vatLy", "congNgheNN"] },
    { name: "Toán, Vật lý, Công nghệ công nghiệp", subjects: ["toan", "vatLy", "congNgheCN"] },
    { name: "Toán, Hóa học, Công nghệ nông nghiệp", subjects: ["toan", "hoaHoc", "congNgheNN"] },
    { name: "Toán, Sinh học, Công nghệ nông nghiệp", subjects: ["toan", "sinhHoc", "congNgheNN"] },
    { name: "Toán, Vật lý, Địa lý", subjects: ["toan", "vatLy", "diaLy"] },
    { name: "Toán, Lịch sử, Địa lý", subjects: ["toan", "lichSu", "diaLy"] },
    { name: "Toán, Sinh học, Địa lý", subjects: ["toan", "sinhHoc", "diaLy"] },
    { name: "Toán, Sinh học, Ngữ văn", subjects: ["toan", "sinhHoc", "nguVan"] },
    { name: "Toán, Sinh học, Tiếng Anh", subjects: ["toan", "sinhHoc", "tiengAnh"] },
    { name: "Toán, Địa lý, Tiếng Anh", subjects: ["toan", "diaLy", "tiengAnh"] },
    { name: "Toán, Hóa học, Tiếng Anh", subjects: ["toan", "hoaHoc", "tiengAnh"] },
    { name: "Toán, Lịch sử, Tiếng Anh", subjects: ["toan", "lichSu", "tiengAnh"] },
    { name: "Ngữ văn, Lịch sử, GDKT-Pháp luật", subjects: ["nguVan", "lichSu", "gdkt"] },
    { name: "Toán, Hóa học, Công nghệ công nghiệp", subjects: ["toan", "hoaHoc", "congNgheCN"] },
    { name: "Toán, Sinh học, Công nghệ công nghiệp", subjects: ["toan", "sinhHoc", "congNgheCN"] },
  ]

  function calculateAdmissionScore() {
    console.log("calculateAdmissionScore function called.");
    // Get valid subjects with scores
    const validSubjects = {}
    let hasValidCombination = false

    document.querySelectorAll(".input").forEach((input) => {
      if (input.value !== "") {
        const score = Number.parseFloat(input.value)
        if (!isNaN(score) && score >= 0 && score <= 10) {
          validSubjects[input.id] = score
        }
      }
    })

    // Check if there's at least one valid combination
    subjectCombinations.forEach((combo) => {
      if (combo.subjects.every((subject) => subject in validSubjects)) {
        hasValidCombination = true
      }
    })

    if (!hasValidCombination) {
      showError("Không đủ dữ liệu để tính điểm. Vui lòng nhập đủ điểm cho ít nhất một tổ hợp 3 môn.")
      return
    }

    // Get priority points
    const priorityArea = Number.parseFloat(document.querySelector('input[name="priorityArea"]:checked').value)
    const priorityGroup = Number.parseFloat(document.querySelector('input[name="priorityGroup"]:checked').value)

    // Get bonus points
    let totalBonusPoints = 0
    document.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
      totalBonusPoints += Number.parseFloat(checkbox.value)
    })

    // Calculate scores for each valid combination
    const results = []

    subjectCombinations.forEach((combo) => {
      // Check if all subjects in the combination have valid scores
      const hasAllSubjects = combo.subjects.every((subject) => subject in validSubjects)

      if (hasAllSubjects) {
        // Calculate total score for the combination
        const totalScore = combo.subjects.reduce((sum, subject) => sum + validSubjects[subject], 0)

        // Calculate admission score
        const admissionScore = calcAdmissionScore(totalScore, priorityGroup, priorityArea, totalBonusPoints)

        results.push({
          combination: combo.name,
          score: totalScore,
          ...admissionScore,
        })
      }
    })

    // Sort results by total score (descending)
    results.sort((a, b) => b.total - a.total)

    // Display results
    showResults(results, totalBonusPoints)
  }

  function calcPriority(T, utGroup, kv) {
    const UT0 = utGroup + kv
    if (T < 22.5) return UT0
    if (T >= 30) return 0
    return ((30 - T) / 7.5) * UT0 // tính điểm ưu tiên thực tế theo công thức
  }

  function capBonus(rawBonus, UT) {
    return Math.min(rawBonus, 3 - UT)
  }

  function calcAdmissionScore(T, utGroup, kv, rawBonus) {
    const UT = calcPriority(T, utGroup, kv)
    const BT = capBonus(rawBonus, UT)
    return {
      T,
      UT0: utGroup + kv,
      UT: Number.parseFloat(UT.toFixed(2)),
      BT: Number.parseFloat(BT.toFixed(2)),
      total: Number.parseFloat((T + UT + BT).toFixed(2)),
    }
  }

  function showResults(results, totalBonusPoints) {
    const resultsContent = document.getElementById("resultsContent")

    if (results.length === 0) {
      showError("Không đủ dữ liệu để tính điểm. Vui lòng nhập đủ điểm cho ít nhất một tổ hợp 3 môn.")
      return
    }

    // Ensure the results card is visible
    resultsCard.style.display = "block";

    // Get best combinations (highest scores)
    const bestScore = results[0].total
    const bestCombos = results.filter((result) => Math.abs(result.total - bestScore) < 0.01)

    // Generate HTML for results
    let html = ""

    // Best combinations
    html += `
            <div class="result-section">
                <h3>Tổ hợp có điểm cao nhất</h3>
                <div class="highlight-box">
                    ${bestCombos
                      .map(
                        (combo) => `
                        <div class="result-item">
                            ${combo.combination}: <span>${combo.total.toFixed(2)} điểm</span>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        `

    // Major suggestions based on combinations
    const majorSuggestions = generateMajorSuggestions(bestCombos)
    if (majorSuggestions.length > 0) {
      html += `
                <div class="result-section">
                    <h3>Gợi ý ngành phù hợp</h3>
                    <div class="highlight-box blue">
                        ${majorSuggestions
                          .map(
                            (suggestion) => `
                            <div class="result-item blue">
                                <span>${suggestion.major}</span>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
            `
    }

    // All combinations table
    html += `
            <div class="result-section">
                <h3>Chi tiết điểm các tổ hợp</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Tổ hợp</th>
                                <th>Điểm</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${results
                              .map(
                                (result) => `
                                <tr>
                                    <td>${result.combination}</td>
                                    <td><strong>${result.total.toFixed(2)}</strong></td>
                                </tr>
                            `,
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        `

    // Score details
    html += `
            <div class="result-section">
                <h3>Chi tiết điểm cộng</h3>
                <div>
                    <div class="detail-row">
                        <span>Điểm gốc (T):</span>
                        <span>${results[0].T.toFixed(2)}</span>
                    </div>
                    <div class="detail-row">
                        <span>Điểm ưu tiên gốc (UT0):</span>
                        <span>${results[0].UT0.toFixed(2)}</span>
                    </div>
                    <div class="detail-row">
                        <span>Điểm ưu tiên sau điều chỉnh (UT):</span>
                        <span>${results[0].UT.toFixed(2)}</span>
                    </div>
                    <div class="detail-row">
                        <span>Điểm thưởng gốc:</span>
                        <span>${totalBonusPoints.toFixed(2)}</span>
                    </div>
                    <div class="detail-row">
                        <span>Điểm thưởng sau cắt trần (BT):</span>
                        <span>${results[0].BT.toFixed(2)}</span>
                    </div>
                    <div class="detail-row bold">
                        <span>Tổng điểm xét tuyển:</span>
                        <span>${results[0].total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `

    resultsContent.innerHTML = html
    document.getElementById("resultsCard").style.display = "block"
    document.getElementById("guideCard").style.display = "none"
  }

  function showError(message) {
    const resultsContent = document.getElementById("resultsContent")
    resultsContent.innerHTML = `<div class="error-message">${message}</div>`
    document.getElementById("resultsCard").style.display = "block"
    document.getElementById("guideCard").style.display = "none"
  }

  function generateMajorSuggestions(combinations) {
    const suggestions = []

    combinations.forEach((combo) => {
      const comboName = combo.combination.toLowerCase()

      if (comboName.includes("toán") && comboName.includes("vật lý") && comboName.includes("hóa học")) {
        suggestions.push({ major: "Công nghệ kỹ thuật điện, điện tử", combinations: ["Toán, Vật lý, Hóa học"] })
        suggestions.push({ major: "Công nghệ kỹ thuật cơ khí", combinations: ["Toán, Vật lý, Hóa học"] })
        suggestions.push({ major: "Công nghệ kỹ thuật cơ điện tử", combinations: ["Toán, Vật lý, Hóa học"] })
        suggestions.push({ major: "Công nghệ kỹ thuật ô tô", combinations: ["Toán, Vật lý, Hóa học"] })
      }

      if (comboName.includes("toán") && comboName.includes("vật lý") && comboName.includes("tiếng anh")) {
        suggestions.push({ major: "Kinh doanh quốc tế", combinations: ["Toán, Vật lý, Tiếng Anh"] })
        suggestions.push({ major: "Thương mại điện tử", combinations: ["Toán, Vật lý, Tiếng Anh"] })
      }

      if (comboName.includes("toán") && comboName.includes("hóa học") && comboName.includes("sinh học")) {
        suggestions.push({ major: "Công nghệ thực phẩm", combinations: ["Toán, Hóa học, Sinh học"] })
        suggestions.push({ major: "Công nghệ sinh học", combinations: ["Toán, Hóa học, Sinh học"] })
        suggestions.push({ major: "Công nghệ kỹ thuật môi trường", combinations: ["Toán, Hóa học, Sinh học"] })
      }

      if (comboName.includes("toán") && comboName.includes("ngữ văn") && comboName.includes("tiếng anh")) {
        suggestions.push({ major: "Ngôn ngữ Anh", combinations: ["Toán, Ngữ văn, Tiếng Anh"] })
        suggestions.push({ major: "Quản trị kinh doanh", combinations: ["Toán, Ngữ văn, Tiếng Anh"] })
        suggestions.push({ major: "Marketing", combinations: ["Toán, Ngữ văn, Tiếng Anh"] })
      }

      if (comboName.includes("ngữ văn") && comboName.includes("lịch sử") && comboName.includes("địa lý")) {
        suggestions.push({ major: "Luật kinh tế", combinations: ["Ngữ văn, Lịch sử, Địa lý"] })
      }

      if (comboName.includes("toán") && comboName.includes("vật lý") && comboName.includes("tin học")) {
        suggestions.push({ major: "Công nghệ thông tin", combinations: ["Toán, Vật lý, Tin học"] })
        suggestions.push({ major: "Kỹ thuật máy tính", combinations: ["Toán, Vật lý, Tin học"] })
      }

      if (comboName.includes("toán") && comboName.includes("ngữ văn") && comboName.includes("gdkt")) {
        suggestions.push({ major: "Kế toán", combinations: ["Toán, Ngữ văn, GDKT-Pháp luật"] })
        suggestions.push({ major: "Kiểm toán", combinations: ["Toán, Ngữ văn, GDKT-Pháp luật"] })
      }
    })

    // Remove duplicates
    return suggestions.filter(
      (suggestion, index, self) => index === self.findIndex((s) => s.major === suggestion.major),
    )
  }
})
