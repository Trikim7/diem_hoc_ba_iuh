// script.js

document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded.");

  // --- 1) Data JSON ---
  let admissionsData = null;
  async function ensureAdmissionsData() {
    if (admissionsData === null) {
      try {
        const res = await fetch("admissions_2025.json");
        admissionsData = await res.json();
        console.log("Admissions data loaded.");
      } catch (e) {
        console.error("Cannot load admissions_2025.json:", e);
        admissionsData = { majors: [], elective_groups: {} };
      }
    }
  }

  // --- 2) Tổ hợp 3 môn ---
  const subjectCombinations = [
    { name: "Toán, Vật lý, Hóa học", subjects: ["toan","vatLy","hoaHoc"] },
    { name: "Toán, Vật lý, Tiếng Anh", subjects: ["toan","vatLy","tiengAnh"] },
    { name: "Toán, Hóa học, Sinh học", subjects: ["toan","hoaHoc","sinhHoc"] },
    { name: "Toán, Ngữ văn, Tiếng Anh", subjects: ["toan","nguVan","tiengAnh"] },
    { name: "Toán, Ngữ văn, Vật lý", subjects: ["toan","nguVan","vatLy"] },
    { name: "Toán, Ngữ văn, Hóa học", subjects: ["toan","nguVan","hoaHoc"] },
    { name: "Ngữ văn, Lịch sử, Địa lý", subjects: ["nguVan","lichSu","diaLy"] },
    { name: "Ngữ văn, Lịch sử, Tiếng Anh", subjects: ["nguVan","lichSu","tiengAnh"] },
    { name: "Ngữ văn, Địa lý, Tiếng Anh", subjects: ["nguVan","diaLy","tiengAnh"] },
    { name: "Toán, Ngữ văn, Lịch sử", subjects: ["toan","nguVan","lichSu"] },
    { name: "Toán, Ngữ văn, Địa lý", subjects: ["toan","nguVan","diaLy"] },
    { name: "Toán, Lịch sử, Địa lý", subjects: ["toan","lichSu","diaLy"] },
    { name: "Ngữ văn, GDKT-Pháp luật, Tiếng Anh", subjects: ["nguVan","gdkt","tiengAnh"] },
    { name: "Toán, GDKT-Pháp luật, Tiếng Anh", subjects: ["toan","gdkt","tiengAnh"] },
    { name: "Toán, Vật lý, Tin học", subjects: ["toan","vatLy","tinHoc"] },
    { name: "Toán, Ngữ văn, Tin học", subjects: ["toan","nguVan","tinHoc"] },
    { name: "Toán, Tiếng Anh, Tin học", subjects: ["toan","tiengAnh","tinHoc"] },
    { name: "Toán, Ngữ văn, GDKT-Pháp luật", subjects: ["toan","nguVan","gdkt"] },
    { name: "Toán, Vật lý, GDKT-Pháp luật", subjects: ["toan","vatLy","gdkt"] },
    { name: "Toán, Hóa học, GDKT-Pháp luật", subjects: ["toan","hoaHoc","gdkt"] },
    { name: "Toán, Sinh học, GDKT-Pháp luật", subjects: ["toan","sinhHoc","gdkt"] },
    { name: "Toán, Vật lý, Công nghệ nông nghiệp", subjects: ["toan","vatLy","congNgheNN"] },
    { name: "Toán, Vật lý, Công nghệ công nghiệp", subjects: ["toan","vatLy","congNgheCN"] },
    { name: "Toán, Hóa học, Công nghệ nông nghiệp", subjects: ["toan","hoaHoc","congNgheNN"] },
    { name: "Toán, Sinh học, Công nghệ nông nghiệp", subjects: ["toan","sinhHoc","congNgheNN"] },
    { name: "Toán, Vật lý, Địa lý", subjects: ["toan","vatLy","diaLy"] },
    { name: "Toán, Lịch sử, Địa lý", subjects: ["toan","lichSu","diaLy"] },
    { name: "Toán, Sinh học, Địa lý", subjects: ["toan","sinhHoc","diaLy"] },
    { name: "Toán, Sinh học, Ngữ văn", subjects: ["toan","sinhHoc","nguVan"] },
    { name: "Toán, Sinh học, Tiếng Anh", subjects: ["toan","sinhHoc","tiengAnh"] },
    { name: "Toán, Địa lý, Tiếng Anh", subjects: ["toan","diaLy","tiengAnh"] },
    { name: "Toán, Hóa học, Tiếng Anh", subjects: ["toan","hoaHoc","tiengAnh"] },
    { name: "Toán, Lịch sử, Tiếng Anh", subjects: ["toan","lichSu","tiengAnh"] },
    { name: "Ngữ văn, Lịch sử, GDKT-Pháp luật", subjects: ["nguVan","lichSu","gdkt"] },
    { name: "Toán, Hóa học, Công nghệ công nghiệp", subjects: ["toan","hoaHoc","congNgheCN"] },
    { name: "Toán, Sinh học, Công nghệ công nghiệp", subjects: ["toan","sinhHoc","congNgheCN"] }
  ];

  // --- 3) Tab switching ---
  document.querySelectorAll(".tab-button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  // --- 4) Chỉ nhập số 0–10 ---
  document.querySelectorAll(".input").forEach(input => {
    input.addEventListener("input", () => {
      let v = input.value.replace(/[^0-9.]/g, "");
      if ((v.match(/\./g)||[]).length > 1) v = v.slice(0, v.lastIndexOf("."));
      input.value = v;
      if (v !== "") {
        const n = parseFloat(v);
        if (n < 0) input.value = "0";
        if (n > 10) input.value = "10";
      }
    });
  });

  // --- 5) Reset form ---
  document.getElementById("resetBtn").addEventListener("click", () => {
    document.querySelectorAll(".input").forEach(i => i.value = "");
    document.getElementById("kv3").checked = true;
    document.getElementById("ut0").checked = true;
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById("resultsCard").style.display = "none";
    document.getElementById("guideCard").style.display   = "block";
  });

  // --- 6) Tính điểm khi nhấn ---
  document.getElementById("calculateBtn").addEventListener("click", async () => {
    await ensureAdmissionsData();

    // 6.1) Lấy điểm hợp lệ
    const validSubjects = {};
    document.querySelectorAll(".input").forEach(i => {
      if (i.value.trim() !== "") {
        const n = parseFloat(i.value);
        if (!isNaN(n)) validSubjects[i.id] = n;
      }
    });

    // 6.2) Kiểm tra ít nhất 1 tổ hợp
    if (!subjectCombinations.some(cb => cb.subjects.every(s => s in validSubjects))) {
      return showError("Không đủ dữ liệu để tính điểm. Vui lòng nhập đủ điểm cho ít nhất một tổ hợp 3 môn.");
    }

    // 6.3) Ưu tiên & thưởng
    const kv   = parseFloat(document.querySelector('input[name="priorityArea"]:checked').value);
    const utg  = parseFloat(document.querySelector('input[name="priorityGroup"]:checked').value);
    let rawB   = 0;
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => rawB += parseFloat(cb.value));

    // 6.4) Tính cho mỗi tổ hợp
    const results = subjectCombinations.reduce((arr, cb) => {
      if (!cb.subjects.every(s => s in validSubjects)) return arr;
      const T = cb.subjects.reduce((sum, s) => sum + validSubjects[s], 0);
      const { UT0, UT, BT, total } = calcAdmissionScore(T, utg, kv, rawB);
      arr.push({ combination: cb.name, T, UT0, UT, BT, total });
      return arr;
    }, []);

    if (results.length === 0) {
      return showError("Không còn tổ hợp nào thỏa mãn.");
    }

    // 6.5) Sắp xếp & show
    results.sort((a,b) => b.total - a.total);
    showResults(results, rawB);
  });

  // ===== Các helper: =====

  function calcAdmissionScore(T, utGroup, kv, rawBonus) {
    const UT0 = utGroup + kv;
    let UT;
    if (T < 22.5)      UT = UT0;
    else if (T >= 30)  UT = 0;
    else               UT = ((30 - T)/7.5)*UT0;
    UT = parseFloat(UT.toFixed(2));

    let BT = Math.min(rawBonus, 3 - UT);
    if (T + UT + BT > 30) BT = parseFloat((30 - T - UT).toFixed(2));
    BT = Math.max(0, BT);
    BT = parseFloat(BT.toFixed(2));

    return {
      UT0,
      UT,
      BT,
      total: parseFloat((T + UT + BT).toFixed(2))
    };
  }

  function generateMajorSuggestionsFromData(combos) {
    if (!admissionsData) return [];
    const out = [];
    combos.forEach(c => {
      const subs = c.combination.split(", ").map(s => s.trim());
      admissionsData.majors.forEach(mj => {
        const [c0,c1] = mj.compulsory;
        const group   = admissionsData.elective_groups[mj.elective_group] || [];
        if (subs.includes(c0) && subs.includes(c1) && subs.some(s => group.includes(s))) {
          out.push(mj.major);
        }
      });
    });
    return Array.from(new Set(out));
  }

  function showError(msg) {
    document.getElementById("resultsContent").innerHTML = `<div class="error-message">${msg}</div>`;
    document.getElementById("resultsCard").style.display = "block";
    document.getElementById("guideCard").style.display   = "none";
  }

  function showResults(results, rawB) {
    const rc = document.getElementById("resultsContent");
    document.getElementById("resultsCard").style.display = "block";
    document.getElementById("guideCard").style.display   = "none";

    const bestTotal = results[0].total;
    const best      = results.filter(r => Math.abs(r.total - bestTotal) < 1e-2);

    let html = `
      <div class="result-section">
        <h3>Tổ hợp có điểm cao nhất</h3>
        <div class="highlight-box">
          ${best.map(b => `
            <div class="result-item">
              ${b.combination}: <span>${b.total.toFixed(2)} điểm</span>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    const majors = generateMajorSuggestionsFromData(best);
    if (majors.length) {
      html += `
        <div class="result-section">
          <h3>Gợi ý ngành phù hợp</h3>
          <div class="highlight-box blue">
            ${majors.map(m => `<div class="result-item blue"><span>${m}</span></div>`).join("")}
          </div>
        </div>
      `;
    }

    html += `
      <div class="result-section">
        <h3>Chi tiết điểm các tổ hợp</h3>
        <div class="table-container">
          <table>
            <thead><tr><th>Tổ hợp</th><th>Điểm</th></tr></thead>
            <tbody>
              ${results.map(r => `
                <tr>
                  <td>${r.combination}</td>
                  <td><strong>${r.total.toFixed(2)}</strong></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const top = results[0];
    html += `
      <div class="result-section">
        <h3>Chi tiết điểm cộng</h3>
        <div>
          <div class="detail-row"><span>Điểm gốc (T):</span><span>${top.T.toFixed(2)}</span></div>
          <div class="detail-row"><span>UT0:</span><span>${top.UT0.toFixed(2)}</span></div>
          <div class="detail-row"><span>UT:</span><span>${top.UT.toFixed(2)}</span></div>
          <div class="detail-row"><span>BT gốc:</span><span>${rawB.toFixed(2)}</span></div>
          <div class="detail-row"><span>BT sau cap:</span><span>${top.BT.toFixed(2)}</span></div>
          <div class="detail-row bold"><span>Tổng:</span><span>${top.total.toFixed(2)}</span></div>
        </div>
      </div>
    `;

    rc.innerHTML = html;
  }

});  
