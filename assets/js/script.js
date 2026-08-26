/**
 * THERMACASE — OFFICIAL INTERACTIVE SCRIPT
 * Handles navigation, mobile menu, app simulation, blog reader modal & pre-order interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. MOBILE NAVIGATION TOGGLE
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
      const isOpen = navMenu.classList.contains('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close menu when clicking nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
        if (mobileToggle) mobileToggle.innerHTML = '☰';
      });
    });
  }

  // 2. ACTIVE SECTION NAV HIGHLIGHTING
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll);

  // 3. APP DASHBOARD INTERACTIVE SIMULATOR
  const tempSlider = document.getElementById('tempSlider');
  const tempReadout = document.getElementById('tempReadout');
  const fanRpmReadout = document.getElementById('fanRpmReadout');
  const modeBtns = document.querySelectorAll('.mode-btn');
  const aiSuggestionText = document.getElementById('aiSuggestionText');

  const modesData = {
    gaming: {
      temp: -18,
      rpm: 7400,
      suggestion: "Gaming Mode Active: High cooling power is on to help keep your games running fast."
    },
    productivity: {
      temp: 24,
      rpm: 2100,
      suggestion: "Daily Mode Active: Quiet cooling is running to keep your phone comfortable and save battery."
    },
    performance: {
      temp: 12,
      rpm: 5200,
      suggestion: "Smart Auto Mode Active: Sensors automatically adjust cooling when the phone warms up."
    }
  };

  if (tempSlider && tempReadout) {
    tempSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      tempReadout.textContent = `${val}°C`;
      
      // Calculate dynamic fan RPM based on temperature setpoint
      const minTemp = -20;
      const maxTemp = 35;
      const tempRange = maxTemp - minTemp;
      const percentage = (maxTemp - val) / tempRange;
      const rpm = Math.round(1500 + percentage * 6000);
      
      if (fanRpmReadout) {
        fanRpmReadout.textContent = `${rpm} RPM`;
      }
      
      // Remove active mode preset styling when manually adjusted
      modeBtns.forEach(btn => btn.classList.remove('active'));
    });
  }

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const modeKey = btn.getAttribute('data-mode');
      if (modesData[modeKey]) {
        const data = modesData[modeKey];
        if (tempSlider) tempSlider.value = data.temp;
        if (tempReadout) tempReadout.textContent = `${data.temp}°C`;
        if (fanRpmReadout) fanRpmReadout.textContent = `${data.rpm} RPM`;
        if (aiSuggestionText) aiSuggestionText.textContent = data.suggestion;
      }
    });
  });

  // 4. ECOSYSTEM CARD SWITCHER
  const ecoCards = document.querySelectorAll('.eco-card');
  ecoCards.forEach(card => {
    card.addEventListener('click', () => {
      ecoCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // 5. BLOG READER MODAL
  const modalOverlay = document.getElementById('blogModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalReadTime = document.getElementById('modalReadTime');
  const modalHeroImg = document.getElementById('modalHeroImg');
  const modalHeroWrap = document.getElementById('modalHeroWrap');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const modalFinishBtn = document.getElementById('modalFinishBtn');

  const blogArticles = {
    1: {
      category: "HARDWARE ANALYSIS",
      readTime: "5 Min Read",
      heroImage: "assets/images/hero_product.jpg",
      title: "Why Smartphones Slow Down During Gaming",
      content: `
        <div class="article-lead">
          <p>Have you ever noticed that your smartphone runs an intense 3D game flawlessly for the first ten minutes, but suddenly starts stuttering, dropping frames, and becoming sluggish as you continue playing? This frustrating experience is not a software bug or bad luck—it is a direct result of how modern mobile hardware handles heat.</p>
        </div>

        <h3>1. What Happens Inside Your Phone During Gaming</h3>
        <p>Inside every modern smartphone is a compact powerhouse known as a System-on-Chip (SoC). This single chip packs the Central Processing Unit (CPU) for game logic and the Graphics Processing Unit (GPU) for rendering stunning visuals, realistic lighting, and high frame rates.</p>
        <p>When you launch a graphically demanding title, these microprocessors execute billions of calculations every second. Just like an automobile engine running at high speeds, this intense electrical activity generates significant heat as a natural byproduct of electrical resistance.</p>

        <div class="article-callout">
          <strong>Key Insight:</strong> High-performance computing creates heat. In mobile gaming, your processor can reach temperatures exceeding 75°C (167°F) in a matter of minutes.
        </div>

        <h3>2. The Physical Dilemma: Slim Bodies and Trapped Heat</h3>
        <p>Gaming laptops and desktop PCs keep cool by using spacious copper heat pipes, large heatsinks, and high-velocity exhaust fans that push hot air out into the room. Your smartphone, on the other hand, is an airtight sandwich of glass, aluminum, and dense circuit boards with zero internal fans and no ventilation ports.</p>
        <p>Because there is nowhere for thermal energy to easily circulate, heat builds up rapidly inside the phone chassis. The only escape route is passive conduction through the phone's glass back and metal frame—which quickly makes the entire device uncomfortably hot to hold.</p>

        <h3>3. Understanding Thermal Throttling in Plain English</h3>
        <p>When the phone’s internal sensors detect that temperatures have reached dangerous levels (usually between 45°C and 50°C on the battery and chassis), the operating system steps in with a protective emergency measure called <strong>thermal throttling</strong>.</p>
        <p>Instead of letting the processor overheat and suffer permanent physical damage or battery breakdown, the phone intentionally cuts back the processor's operating speed. In simple terms: <em>the phone deliberately slows itself down to protect its internal components.</em></p>

        <h3>4. How Thermal Slowdowns Ruin Your Gameplay</h3>
        <p>When thermal throttling kicks in during a game, the real-world impact is immediate and frustrating:</p>
        <ul>
          <li><strong>Choppy Frame Rates:</strong> A smooth 60 or 120 FPS experience abruptly drops to 30 FPS or lower, creating noticeable stutter and jitter.</li>
          <li><strong>Input Lag & Delayed Touch:</strong> The touch sensor processor slows down, meaning your buttons, aiming, and swipes register a fraction of a second too late.</li>
          <li><strong>Automatic Screen Dimming:</strong> To reduce thermal output, many smartphones forcibly lower their display brightness, making it hard to see dark scenes.</li>
          <li><strong>Accelerated Battery Degradation:</strong> Prolonged high temperatures degrade the chemical structure of lithium-ion batteries, permanently reducing battery lifespan.</li>
        </ul>

        <h3>5. Why Simple Clip-on Fans Fall Short</h3>
        <p>Many players attempt to fix this issue with basic plastic clip-on fans. Unfortunately, a standard fan merely blows ambient room-temperature air against the outside of an insulated glass case. When the internal silicon is baking at 70°C, room air is simply not cold enough to penetrate the glass and absorb the trapped thermal energy.</p>

        <div class="thermacase-spotlight">
          <span class="thermacase-spotlight-tag">The ThermaCase Solution</span>
          <h4>Active Solid-State Thermal Extraction</h4>
          <p>ThermaCase solves the mobile thermal bottleneck by replacing passive airflow with active thermoelectric Peltier cooling. By creating an icy contact plate that rests directly against your phone, ThermaCase pulls heat away from the logic board in real-time. This keeps your phone in its optimal thermal zone, preventing thermal throttling so you can enjoy sustained maximum frame rates during your longest gaming sessions.</p>
        </div>

        <h3>Conclusion: Play at Peak Potential</h3>
        <p>Smartphones are engineered to deliver console-quality graphics, but heat remains their single greatest obstacle. By understanding thermal throttling and managing device temperature with dedicated active cooling, gamers no longer have to compromise between battery health, visual fidelity, and competitive performance.</p>
      `
    },
    2: {
      category: "THERMODYNAMICS",
      readTime: "6 Min Read",
      heroImage: "assets/images/feature_peltier_plate.jpg",
      title: "The Science Behind Thermoelectric Cooling",
      content: `
        <div class="article-lead">
          <p>When most people think of cooling down electronics, they picture fans spinning quickly to blow cool air. However, in high-density devices like smartphones, air cooling alone cannot overcome the laws of thermal resistance. That is where <strong>thermoelectric cooling</strong>—often called the Peltier effect—transforms mobile performance.</p>
        </div>

        <h3>1. What is Thermoelectric Cooling?</h3>
        <p>Thermoelectric cooling is a solid-state method of heat transfer that uses electricity to pump heat away from one surface and move it to another. Unlike traditional air conditioners or refrigerators, a thermoelectric cooler contains no chemical refrigerants, no noisy compressors, and zero moving mechanical parts in its cooling core.</p>
        <p>At the center of this technology is a compact component called a <strong>Peltier plate</strong>—a wafer-thin sandwich made of two ceramic plates surrounding dozens of microscopic semiconductor pairs.</p>

        <div class="article-callout">
          <strong>Simple Analogy:</strong> Think of a Peltier module not as an ice maker, but as an invisible electronic heat sponge that absorbs warmth from one side and squeezes it out the other.
        </div>

        <h3>2. The Physics in Plain English: Electricity as a Heat Pump</h3>
        <p>The principle behind thermoelectric cooling was discovered in 1834 by French physicist Jean Charles Athanase Peltier. Here is how it works without complex physics jargon:</p>
        <ul>
          <li><strong>Electrical Flow:</strong> Direct electrical current is sent through alternating semiconductor elements (called P-type and N-type silicon).</li>
          <li><strong>Energy Absorption:</strong> As electrons pass across the semiconductor junctions on one side of the plate, they absorb thermal energy from the surface, causing that side to become extremely cold.</li>
          <li><strong>Heat Transfer:</strong> The moving electrons carry that thermal energy across the plate to the opposite surface, releasing the heat there.</li>
          <li><strong>Instant Temperature Differential:</strong> Within seconds of applying power, one side drops down toward freezing temperatures while the opposite side becomes hot.</li>
        </ul>

        <h3>3. Hot Side vs. Cold Side: Why Heat Dissipation is Crucial</h3>
        <p>A fundamental law of thermodynamics states that energy cannot be destroyed—only transferred. When a Peltier plate cools your phone, the hot side must absorb two types of heat:</p>
        <ol>
          <li>The heat drawn directly out of your phone's processor.</li>
          <li>The electrical energy consumed by the Peltier plate itself during operation.</li>
        </ol>
        <p>Because the hot side generates substantial thermal energy, it must be continuously cooled with high-efficiency heatsink fins and a silent exhaust fan. If the hot side gets too warm, thermal leakage can travel back toward the cold plate. This is why precision engineering and optimized airflow are vital to thermoelectric efficiency.</p>

        <h3>4. Why Controlled Solid-State Cooling Matters for Phones</h3>
        <p>Applying thermoelectric cooling to smartphones requires delicate balance. If you cool a device too aggressively below room temperature in humid conditions, condensation (water droplets) can form on the chassis. On the other hand, if you do not cool it enough, the processor will throttle.</p>
        <p>Modern mobile thermal systems solve this challenge through <em>intelligent closed-loop control</em>. By monitoring ambient humidity and device temperatures, the system modulates electric current so the cooling plate remains frosty without risking moisture buildup.</p>

        <div class="thermacase-spotlight">
          <span class="thermacase-spotlight-tag">How ThermaCase Implements This Science</span>
          <h4>Aerospace Heat Pipes & Cryo-Peltier Architecture</h4>
          <p>ThermaCase harnesses solid-state thermoelectric science with a custom-calibrated Peltier module paired with 6mm sintered copper heat pipes and graphite micro-fins. The icy ceramic cold plate creates an instant direct bridge to your smartphone back, dropping surface temperatures by up to 20°C in under 60 seconds while a whisper-quiet 24dB fan safely sweeps away the expelled heat.</p>
        </div>

        <h3>Conclusion: The Future of High-Density Thermal Control</h3>
        <p>Thermoelectric cooling bridges the gap between pocket-sized portability and intense computing workloads. By utilizing solid-state physics to actively transport heat, it gives mobile devices the thermal headroom needed to perform like full-fledged desktop gaming rigs.</p>
      `
    },
    3: {
      category: "AI ALGORITHMS",
      readTime: "5 Min Read",
      heroImage: "assets/images/feature_ai_control.jpg",
      title: "How AI Makes Cooling Smarter",
      content: `
        <div class="article-lead">
          <p>In traditional hardware design, cooling systems operate on crude on/off switches: either the fan runs at 100% full blast with loud noise and high battery drain, or it remains completely off while the device steadily overheats. Modern thermal engineering replaces this blunt approach with intelligent, sensor-driven optimization.</p>
        </div>

        <h3>1. Why Running Cooling at Maximum Isn't Ideal</h3>
        <p>It might seem logical to run a cooling system at full power whenever it is plugged in. However, maximum cooling power has clear trade-offs:</p>
        <ul>
          <li><strong>Excessive Power Consumption:</strong> Running a Peltier cooler and high-speed fan at peak output drains device and battery reserves unnecessarily fast.</li>
          <li><strong>Acoustic Fan Noise:</strong> High RPM fans generate background whirr that can interfere with in-game voice chat and audio cues.</li>
          <li><strong>Condensation Risk:</strong> Chilling a device far below ambient temperatures when the phone is not under heavy load can invite ambient moisture.</li>
        </ul>
        <p>The goal of smart thermal management is not simply to make things as cold as possible—it is to deliver the exact amount of cooling needed at the exact moment it is required.</p>

        <div class="article-callout">
          <strong>Core Principle:</strong> Intelligent cooling balances three vital pillars: maximum thermal extraction, minimal power draw, and whisper-quiet acoustics.
        </div>

        <h3>2. Real-Time Telemetry: Reading the Thermal Curve</h3>
        <p>Smart thermal management relies on ultra-responsive temperature sensor arrays positioned directly on the device contact zone. These micro-sensors sample temperature changes up to 100 times every second.</p>
        <p>Rather than waiting for the entire phone chassis to heat up to dangerous levels, the software monitors the <em>rate of temperature change</em>. If a demanding 3D game begins loading high-resolution textures, the algorithm detects the sharp temperature spike instantly and spools up cooling power proactively before thermal throttling can occur.</p>

        <h3>3. Dynamic Scenarios: Tailored Thermal Profiles</h3>
        <p>Different smartphone activities create radically different thermal footprints. An intelligent control system identifies and responds to these distinct usage scenarios:</p>
        <ul>
          <li><strong>Competitive Gaming Mode:</strong> Prioritizes sustained high frame rates by ramping up thermoelectric power and maintaining low temperatures during intense matches.</li>
          <li><strong>Fast-Charging Shield:</strong> Fast-charging generates heat directly in the lithium battery cell. Smart cooling absorbs charging heat to preserve long-term battery health and enable faster recharge times.</li>
          <li><strong>Quiet Media & Reading Mode:</strong> Keeps the fan spinning at under 20dB while delivering a subtle cooling effect that makes the phone comfortable to hold during video streaming.</li>
        </ul>

        <h3>4. Intelligent Optimization as an Engineering Concept</h3>
        <p>When we discuss AI in thermal control, we are not talking about science fiction—we are describing advanced predictive algorithms. By analyzing historical heat curves and thermal resistance patterns across different smartphone models, the system continuously refines its power curve.</p>
        <p>This closed-loop feedback mechanism ensures that every milliwatt of power is utilized efficiently, providing seamless performance without user intervention.</p>

        <div class="thermacase-spotlight">
          <span class="thermacase-spotlight-tag">ThermaCase Smart Ecosystem</span>
          <h4>Adaptive AI Thermal Management</h4>
          <p>ThermaCase integrates onboard smart temperature tracking with our companion mobile app to deliver automatic adaptive cooling. Whether you select automated AI mode, manual turbo freezing, or quiet eco mode, ThermaCase continuously calculates the optimal cooling ratio—keeping your device frosty, silent, and protected.</p>
        </div>

        <h3>Conclusion: Silence, Power, and Intelligence Combined</h3>
        <p>The future of device cooling is adaptive and autonomous. By combining precise thermoelectric hardware with responsive sensor intelligence, smart cooling ensures that your smartphone operates at its absolute peak without waste, noise, or compromise.</p>
      `
    }
  };

  function openBlogModal(articleId) {
    const article = blogArticles[articleId];
    if (!article || !modalOverlay) return;

    if (modalCategory) modalCategory.textContent = article.category;
    if (modalReadTime) modalReadTime.textContent = article.readTime;
    if (modalTitle) modalTitle.textContent = article.title;
    if (modalHeroImg) {
      modalHeroImg.src = article.heroImage;
      modalHeroImg.alt = article.title;
    }
    if (modalBody) modalBody.innerHTML = article.content;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeBlogModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scroll
  }

  document.querySelectorAll('.read-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const articleId = btn.getAttribute('data-article');
      openBlogModal(articleId);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeBlogModal);
  }

  if (modalFinishBtn) {
    modalFinishBtn.addEventListener('click', closeBlogModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeBlogModal();
      }
    });
  }

  // Close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeBlogModal();
    }
  });

  // 6. PRE-ORDER FORM SUBMISSION
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = orderForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Processing Reservation...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        alert('⚡ Thank you for reserving your ThermaCase! Confirmation details have been sent to your email.');
        orderForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1200);
    });
  }
});
