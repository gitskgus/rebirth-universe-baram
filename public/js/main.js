// 현재 페이지 nav 활성화
(function () {
  const path = window.location.pathname;
  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href !== "/" && path.startsWith(href)) {
      link.classList.add("active");
      link.style.color = "var(--maple-orange, #ff6b2c)";
      link.style.background = "rgba(255,107,44,0.15)";
    }
  });
})();

// 숫자 카운트업 애니메이션 (스탯 섹션)
function animateCount(el, target) {
  const duration = 1500;
  const start = performance.now();
  const isFloat = target.toString().includes(".");
  const suffix = target.toString().replace(/[\d.]/g, "");
  const num = parseFloat(target);

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = num * eased;
    el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// 몬스터 정보 테이블 너비 토글 (넓게 ↔ 좁게)
(function () {
  const toggle = document.getElementById("tableWidthToggle");
  const wrap = document.getElementById("monsterTableWrap");
  if (!toggle || !wrap) return;
  toggle.addEventListener("click", () => {
    const wide = wrap.classList.toggle("is-wide");
    toggle.setAttribute("aria-pressed", wide ? "true" : "false");
    const icon = toggle.querySelector("i");
    const label = toggle.querySelector("span");
    if (icon) icon.className = (wide ? "bi bi-arrows-angle-contract" : "bi bi-arrows-angle-expand") + " me-1";
    if (label) label.textContent = wide ? "좁게 보기" : "넓게 보기";
  });
})();

// 아이템 조합 검색 — 버튼 없이 입력하는 즉시 실시간 필터링
(function () {
  const input = document.getElementById("comboSearchInput");
  const grid = document.getElementById("comboGrid");
  const emptyMsg = document.getElementById("comboEmptyMsg");
  if (!input || !grid) return;

  const items = Array.from(grid.querySelectorAll(".combo-item")).map((el) => {
    const title = el.querySelector(".baram-combo-title");
    const mats = Array.from(el.querySelectorAll(".baram-mat-chip")).map((m) => m.textContent);
    const text = [title ? title.textContent : "", ...mats].join(" ").toLowerCase();
    return { el, text };
  });

  input.addEventListener("input", () => {
    const kw = input.value.trim().toLowerCase();
    let visible = 0;
    items.forEach(({ el, text }) => {
      const match = !kw || text.includes(kw);
      el.style.display = match ? "" : "none";
      if (match) visible++;
    });
    if (emptyMsg) emptyMsg.style.display = visible === 0 ? "" : "none";
  });
})();

// 아이템 정보 검색 — 버튼 없이 입력하는 즉시 실시간 필터링
(function () {
  const input = document.getElementById("itemSearchInput");
  const grid = document.getElementById("itemGrid");
  const emptyMsg = document.getElementById("itemEmptyMsg");
  if (!input || !grid) return;

  const items = Array.from(grid.querySelectorAll(".item-card")).map((el) => {
    const title = el.querySelector(".baram-combo-title");
    return { el, text: (title ? title.textContent : "").toLowerCase() };
  });

  input.addEventListener("input", () => {
    const kw = input.value.trim().toLowerCase();
    let visible = 0;
    items.forEach(({ el, text }) => {
      const match = !kw || text.includes(kw);
      el.style.display = match ? "" : "none";
      if (match) visible++;
    });
    if (emptyMsg) emptyMsg.style.display = visible === 0 ? "" : "none";
  });
})();

const statNumbers = document.querySelectorAll(".stat-number");
if (statNumbers.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.trim();
        const numMatch = raw.match(/[\d,.]+/);
        if (numMatch) {
          const num = parseFloat(numMatch[0].replace(/,/g, ""));
          animateCount(el, raw.includes("★") ? raw.replace(/[\d.]+/, num).replace("★", "") + "★" : num + raw.replace(/[\d,]+/, ""));
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach((el) => observer.observe(el));
}
