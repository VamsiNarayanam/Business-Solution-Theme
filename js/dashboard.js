(function () {
  "use strict";

  var fontFamily = "'DM Sans', system-ui, sans-serif";
  var tickColor = "#64748b";
  var gridColor = "rgba(148, 163, 184, 0.25)";

  function initSidebar() {
    var toggle = document.querySelector("[data-dash-sidebar-toggle]");
    var sidebar = document.querySelector("[data-dash-sidebar]");
    var backdrop = document.querySelector("[data-dash-backdrop]");
    if (!toggle || !sidebar) return;

    function setOpen(open) {
      sidebar.classList.toggle("is-open", open);
      if (backdrop) backdrop.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    }

    toggle.addEventListener("click", function () {
      setOpen(!sidebar.classList.contains("is-open"));
    });

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        setOpen(false);
      });
    }

    sidebar.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 1024px)").matches) setOpen(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  function baseLegend() {
    return {
      position: "bottom",
      labels: {
        boxWidth: 10,
        padding: 16,
        font: { family: fontFamily, size: 11 },
        color: tickColor,
      },
    };
  }

  function initAdminCharts() {
    if (typeof Chart === "undefined") return;

    var teal = "#0f766e";
    var mint = "#5eead4";
    var deep = "#0c4a6e";

    var elSessions = document.getElementById("admin-chart-sessions");
    if (elSessions) {
      new Chart(elSessions, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Active sessions",
              data: [118, 162, 198, 176, 214, 142, 128],
              borderColor: teal,
              backgroundColor: "rgba(15, 118, 110, 0.12)",
              fill: true,
              tension: 0.35,
              borderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { intersect: false, mode: "index" },
          plugins: {
            legend: { display: false },
            tooltip: {
              titleFont: { family: fontFamily },
              bodyFont: { family: fontFamily },
            },
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { font: { family: fontFamily, size: 11 }, color: tickColor },
            },
            y: {
              beginAtZero: true,
              grid: { color: gridColor },
              ticks: { font: { family: fontFamily, size: 11 }, color: tickColor },
            },
          },
        },
      });
    }

    var elStages = document.getElementById("admin-chart-stages");
    if (elStages) {
      new Chart(elStages, {
        type: "bar",
        data: {
          labels: ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"],
          datasets: [
            {
              label: "Inquiries",
              data: [28, 42, 24, 18, 14, 6],
              backgroundColor: [mint, teal, "#0d9488", deep, "#059669", "#94a3b8"],
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              titleFont: { family: fontFamily },
              bodyFont: { family: fontFamily },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { family: fontFamily, size: 11 }, color: tickColor },
            },
            y: {
              beginAtZero: true,
              grid: { color: gridColor },
              ticks: { font: { family: fontFamily, size: 11 }, color: tickColor },
            },
          },
        },
      });
    }

    var elChannels = document.getElementById("admin-chart-channels");
    if (elChannels) {
      new Chart(elChannels, {
        type: "doughnut",
        data: {
          labels: ["Organic search", "Referral", "Partner", "Events", "Direct"],
          datasets: [
            {
              data: [38, 24, 18, 12, 8],
              backgroundColor: ["#0f766e", "#14b8a6", "#2dd4bf", "#5eead4", "#94a3b8"],
              borderWidth: 0,
              hoverOffset: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "58%",
          plugins: {
            legend: baseLegend(),
            tooltip: {
              titleFont: { family: fontFamily },
              bodyFont: { family: fontFamily },
            },
          },
        },
      });
    }

    var elLoad = document.getElementById("admin-chart-load");
    if (elLoad) {
      new Chart(elLoad, {
        type: "line",
        data: {
          labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
          datasets: [
            {
              label: "Team utilization %",
              data: [72, 78, 81, 76, 84, 79],
              borderColor: deep,
              backgroundColor: "rgba(12, 74, 110, 0.08)",
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              titleFont: { family: fontFamily },
              bodyFont: { family: fontFamily },
            },
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { font: { family: fontFamily, size: 11 }, color: tickColor },
            },
            y: {
              min: 50,
              max: 100,
              grid: { color: gridColor },
              ticks: {
                font: { family: fontFamily, size: 11 },
                color: tickColor,
                callback: function (v) {
                  return v + "%";
                },
              },
            },
          },
        },
      });
    }
  }

  function initCustomerCharts() {
    if (typeof Chart === "undefined") return;

    var indigo = "#4f46e5";
    var violet = "#7c3aed";
    var soft = "#a78bfa";

    var elMix = document.getElementById("customer-chart-status");
    if (elMix) {
      new Chart(elMix, {
        type: "polarArea",
        data: {
          labels: ["In progress", "Scheduled", "Complete", "On hold"],
          datasets: [
            {
              data: [2, 1, 3, 0],
              backgroundColor: [
                "rgba(79, 70, 229, 0.75)",
                "rgba(124, 58, 237, 0.65)",
                "rgba(16, 185, 129, 0.7)",
                "rgba(148, 163, 184, 0.55)",
              ],
              borderWidth: 2,
              borderColor: "#fff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: baseLegend(),
            tooltip: {
              titleFont: { family: fontFamily },
              bodyFont: { family: fontFamily },
            },
          },
          scales: {
            r: {
              ticks: {
                display: false,
                backdropColor: "transparent",
              },
              grid: { color: gridColor },
            },
          },
        },
      });
    }

    var elPhases = document.getElementById("customer-chart-phases");
    if (elPhases) {
      new Chart(elPhases, {
        type: "bar",
        data: {
          labels: ["Discovery", "Design sprint", "Readout", "Training"],
          datasets: [
            {
              label: "Completion",
              data: [100, 62, 0, 0],
              backgroundColor: [indigo, violet, soft, "#c4b5fd"],
              borderRadius: 8,
              borderSkipped: false,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              titleFont: { family: fontFamily },
              bodyFont: { family: fontFamily },
              callbacks: {
                label: function (ctx) {
                  return " " + ctx.raw + "% complete";
                },
              },
            },
          },
          scales: {
            x: {
              max: 100,
              grid: { color: gridColor },
              ticks: {
                font: { family: fontFamily, size: 11 },
                color: tickColor,
                callback: function (v) {
                  return v + "%";
                },
              },
            },
            y: {
              grid: { display: false },
              ticks: { font: { family: fontFamily, size: 11 }, color: tickColor },
            },
          },
        },
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSidebar();
    if (document.body.classList.contains("dashboard-page--admin")) initAdminCharts();
    if (document.body.classList.contains("dashboard-page--customer")) initCustomerCharts();
  });
})();
