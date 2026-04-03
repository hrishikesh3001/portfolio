import "./styles/globals.css";

function App() {
  return (
    <div className="app">
      {/* ── Loader (Step 3) ─────────────────── */}
      <div className="placeholder">LOADER — Step 3</div>

      {/* ── Persistent Character (Step 4) ───── */}
      <div id="character-root" />

      {/* ── Main Portfolio ───────────────────── */}
      <main id="portfolio">
        <section id="hero" className="section" data-section="0">
          <p className="section-label">01 / Hero</p>
        </section>

        <section id="education" className="section" data-section="1">
          <p className="section-label">02 / Education</p>
        </section>

        <section id="experience" className="section" data-section="2">
          <p className="section-label">03 / Experience</p>
        </section>

        <section id="skills" className="section" data-section="3">
          <p className="section-label">04 / Skills</p>
        </section>

        <section id="projects" className="section" data-section="4">
          <p className="section-label">05 / Projects</p>
        </section>

        <section id="thesis" className="section" data-section="5">
          <p className="section-label">06 / Thesis</p>
        </section>

        <section id="contact" className="section" data-section="6">
          <p className="section-label">07 / Contact</p>
        </section>
      </main>
    </div>
  );
}

export default App;
