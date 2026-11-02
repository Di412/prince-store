// Halaman Syarat & Refund. Isi diambil dari data/store.json (diatur lewat Dashboard).
// Jika file itu tidak ada, teks bawaan di syarat-refund.html tetap tampil.
(async () => {
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Teks sederhana -> HTML: "### Judul", "- butir", "1. langkah", baris lain = paragraf
  function md(t) {
    const out = []; let list = null;
    const close = () => { if (list) { out.push(`</${list}>`); list = null; } };
    String(t || "").split(/\r?\n/).forEach(raw => {
      const l = raw.trim();
      if (!l) return close();
      let m;
      if ((m = l.match(/^#{1,4}\s+(.*)$/))) { close(); out.push(`<h3>${esc(m[1])}</h3>`); }
      else if ((m = l.match(/^[-*]\s+(.*)$/))) { if (list !== "ul") { close(); out.push("<ul>"); list = "ul"; } out.push(`<li>${esc(m[1])}</li>`); }
      else if ((m = l.match(/^\d+[.)]\s+(.*)$/))) { if (list !== "ol") { close(); out.push("<ol>"); list = "ol"; } out.push(`<li>${esc(m[1])}</li>`); }
      else { close(); out.push(`<p>${esc(l)}</p>`); }
    });
    close(); return out.join("");
  }
  let d = null;
  try { const r = await fetch("data/store.json?t=" + Date.now(), { cache: "no-store" }); if (r.ok) d = await r.json(); } catch {}
  const st = (d && d.store) || {};
  const wa = String(st.adminWA || "6281234567890").replace(/\D/g, "");
  const name = st.name || "PRINCE STORE";
  document.querySelectorAll("[data-wa]").forEach(a => {
    a.href = "https://wa.me/" + wa + "?text=" + encodeURIComponent("Halo admin " + name + ", saya mau bertanya.");
  });
  if (!d) return;
  if (d.theme && /^#[0-9a-f]{6}$/i.test(d.theme.gold || "")) {
    const n = parseInt(d.theme.gold.slice(1), 16), s = document.documentElement.style;
    s.setProperty("--gold", d.theme.gold); s.setProperty("--gold-rgb", `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`);
  }
  if (st.brandMain) $("#brandText").innerHTML = esc(st.brandMain) + "<b>" + esc(st.brandAccent || "") + "</b>";
  if (st.logo) $("#brandLogo").src = st.logo;
  if (st.footerText) $("#footerText").textContent = st.footerText;
  document.title = "Syarat & Ketentuan dan Refund - " + name;
  const lg = d.legal || {};
  if (lg.updated) $("#legalUpdated").textContent = "Terakhir diperbarui: " + lg.updated + ".";
  if (lg.syarat) $("#syaratBody").innerHTML = md(lg.syarat);
  if (lg.refund) $("#refundBody").innerHTML = md(lg.refund) + `<p><a class="btn" data-wa target="_blank" rel="noopener" href="https://wa.me/${wa}">Hubungi CS Admin</a></p>`;
})();
