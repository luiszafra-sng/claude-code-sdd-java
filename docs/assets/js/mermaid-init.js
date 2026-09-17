(function () {
  function boot() {
    if (typeof mermaid === "undefined") return;

    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--md-accent-fg-color").trim() || "#006acb";
    const fg = styles.getPropertyValue("--md-default-fg-color").trim() || "#0A0D1F";
    const bg = styles.getPropertyValue("--md-default-bg-color").trim() || "#FFFFFF";

    mermaid.initialize({
      startOnLoad: true,
      theme: "base",
      securityLevel: "strict",
      flowchart: { htmlLabels: false, curve: "basis", padding: 12 },
      themeVariables: {
        primaryColor: accent,
        primaryTextColor: fg,
        primaryBorderColor: accent,
        lineColor: fg,
        secondaryColor: bg,
        tertiaryColor: bg,
        background: "transparent",
        mainBkg: accent,
        edgeLabelBackground: bg,
        textColor: fg,
        fontFamily: 'Commissioner, "Avenir Next", "Segoe UI", sans-serif',
        fontSize: "16px",
      },
    });
  }
  document.addEventListener("DOMContentLoaded", boot);
})();
