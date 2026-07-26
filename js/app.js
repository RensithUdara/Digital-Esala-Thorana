



(function() {



  const canvas = document.getElementById('thoranaCanvas');
  const ctx = canvas.getContext('2d');
  const cx = 475;
  const cy = 450;
  

  let dots = [];
  let isIgnited = false;
  let activePattern = 'aura';
  let globalBrightness = 1.0;
  let globalSpeed = 1.0;
  let selectedChapter = 0;
  let currentLanguage = 'si';
  

  let activeBrushColor = '#00ffff';
  let customPaintDots = [];
  let isPainting = false;

  const assets = window.VESAK_ASSETS;
  const C = assets.palette;
  const peacockLeft = assets.createImage(assets.images.peacock);
  const peacockRight = assets.createImage(assets.images.peacock);
  const buddhaImg = assets.createImage(assets.images.buddha);

  const chapterImages = [];
  for (let i = 1; i <= 8; i++) {
    chapterImages.push(assets.createImage(assets.images.chapter(i)));
  }

  const BUDDHA = assets.buddha;
  const PEACOCK = assets.peacock;


 const chapters = window.VESAK_CHAPTERS || [];


  function initStructure() {
    dots = [];


    for (let r = 38; r <= 175; r += 10) {
      let count = Math.floor(r * 0.65); 
      let col;
      if (r < 60) col = C.goldBright;
      else if (r < 100) col = C.gold;
      else if (r < 140) col = C.deepGold;
      else col = C.innerRing;
      
      for (let i = 0; i < count; i++) {
        let angle = (i / count) * Math.PI * 2;
        dots.push({
          x: cx + r * Math.cos(angle),
          y: cy + r * Math.sin(angle),
          color: col,
          baseColor: col,
          size: 2.1,
          group: 'mandala',
          ringIndex: Math.floor((r - 38) / 10),
          angle: angle
        });
      }
    }


    for (let i = 0; i < 8; i++) {
      let angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
      for (let d = 55; d <= 165; d += 5) {
        let x = cx + d * Math.cos(angle);
        let y = cy + d * Math.sin(angle);
        dots.push({ x: x, y: y, color: C.accent, baseColor: C.accent, size: 2.0, group: 'star', starIdx: i, dist: d });
        
        let sideOffset = 4 * Math.sin((d / 165) * Math.PI);
        dots.push({ 
          x: cx + d * Math.cos(angle + 0.04), 
          y: cy + d * Math.sin(angle + 0.04), 
          color: C.gold, 
          baseColor: C.gold, 
          size: 1.5,
          group: 'star-side',
          starIdx: i,
          dist: d
        });
        dots.push({ 
          x: cx + d * Math.cos(angle - 0.04), 
          y: cy + d * Math.sin(angle - 0.04), 
          color: C.gold, 
          baseColor: C.gold, 
          size: 1.5,
          group: 'star-side',
          starIdx: i,
          dist: d
        });
      }
    }


    for (let r = 185; r <= 200; r += 5) {
      let count = Math.floor(r * 0.75);
      for (let i = 0; i < count; i++) {
        let angle = (i / count) * Math.PI * 2;
        dots.push({
          x: cx + r * Math.cos(angle),
          y: cy + r * Math.sin(angle),
          color: C.gold,
          baseColor: C.gold,
          size: 2.0,
          group: 'outer-ring',
          ringIdx: Math.floor((r-185)/5),
          index: i
        });
      }
    }


    let panelRadius = 285;
    let panelCenters = [];
    for (let i = 0; i < 8; i++) {
      let angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
      let px = cx + panelRadius * Math.cos(angle);
      let py = cy + panelRadius * Math.sin(angle);
      panelCenters.push({ x: px, y: py, angle: angle, index: i });
    }


    panelCenters.forEach(pc => {

      for (let pr = 78; pr <= 88; pr += 5) {
        let dotCount = Math.floor(pr * 0.9);
        let col = (pr === 78) ? C.borderRed : C.gold;
        for (let i = 0; i < dotCount; i++) {
          let a = (i / dotCount) * Math.PI * 2;
          dots.push({
            x: pc.x + pr * Math.cos(a),
            y: pc.y + pr * Math.sin(a),
            color: col,
            baseColor: col,
            size: 2.1,
            group: 'panel-frame-outer',
            panelIdx: pc.index
          });
        }
      }
      

      for (let pr = 62; pr <= 70; pr += 4) {
        let dotCount = Math.floor(pr * 1.0);
        for (let i = 0; i < dotCount; i++) {
          let a = (i / dotCount) * Math.PI * 2;
          dots.push({
            x: pc.x + pr * Math.cos(a),
            y: pc.y + pr * Math.sin(a),
            color: C.goldBright,
            baseColor: C.goldBright,
            size: 1.9,
            group: 'panel-frame-inner',
            panelIdx: pc.index
          });
        }
      }
      

      for (let i = 0; i < 24; i++) {
        let a = (i / 24) * Math.PI * 2;
        let pr = 74;
        dots.push({
          x: pc.x + pr * Math.cos(a),
          y: pc.y + pr * Math.sin(a),
          color: C.accent,
          baseColor: C.accent,
          size: 2.5,
          group: 'panel-beads',
          panelIdx: pc.index,
          beadIdx: i
        });
      }
    });


    for (let i = 0; i < 8; i++) {
      let spokeAngle = ((i + 0.5) / 8) * Math.PI * 2 - Math.PI / 2;
      
      for (let rDist = 175; rDist <= 395; rDist += 6) {
        let sx = cx + rDist * Math.cos(spokeAngle);
        let sy = cy + rDist * Math.sin(spokeAngle);
        dots.push({ x: sx, y: sy, color: C.spokes, baseColor: C.spokes, size: 2.4, group: 'spoke', spokeIdx: i, dist: rDist });
      }
      
      let perpAngle = spokeAngle + Math.PI / 2;
      for (let rDist = 200; rDist <= 380; rDist += 10) {
        let baseX = cx + rDist * Math.cos(spokeAngle);
        let baseY = cy + rDist * Math.sin(spokeAngle);
        
        let offset = 6;
        dots.push({ 
          x: baseX + offset * Math.cos(perpAngle), 
          y: baseY + offset * Math.sin(perpAngle), 
          color: C.spokesDeep, 
          baseColor: C.spokesDeep, 
          size: 1.8, 
          group: 'spoke-side',
          spokeIdx: i,
          dist: rDist
        });
        dots.push({ 
          x: baseX - offset * Math.cos(perpAngle), 
          y: baseY - offset * Math.sin(perpAngle), 
          color: C.spokesDeep, 
          baseColor: C.spokesDeep, 
          size: 1.8, 
          group: 'spoke-side',
          spokeIdx: i,
          dist: rDist
        });
      }
      
      for (let rDist = 220; rDist <= 360; rDist += 45) {
        let baseX = cx + rDist * Math.cos(spokeAngle);
        let baseY = cy + rDist * Math.sin(spokeAngle);
        for (let j = 0; j < 8; j++) {
          let a = (j / 8) * Math.PI * 2;
          dots.push({ 
            x: baseX + 6 * Math.cos(a), 
            y: baseY + 6 * Math.sin(a), 
            color: C.goldBright, 
            baseColor: C.goldBright, 
            size: 1.7, 
            group: 'spoke-flower',
            spokeIdx: i,
            dist: rDist
          });
        }
      }


      for (let rDist = 320; rDist <= 375; rDist += 5) {
        let factor = (rDist - 320) / 55;
        let leafWidth = 0.12 * Math.sin(factor * Math.PI);
        
        let lx1 = cx + rDist * Math.cos(spokeAngle - leafWidth);
        let ly1 = cy + rDist * Math.sin(spokeAngle - leafWidth);
        let lx2 = cx + rDist * Math.cos(spokeAngle + leafWidth);
        let ly2 = cy + rDist * Math.sin(spokeAngle + leafWidth);
        
        dots.push({ x: lx1, y: ly1, color: C.leafGreen, baseColor: C.leafGreen, size: 2.0, group: 'leaf', spokeIdx: i, dist: rDist });
        dots.push({ x: lx2, y: ly2, color: C.leafGreen, baseColor: C.leafGreen, size: 2.0, group: 'leaf', spokeIdx: i, dist: rDist });
      }
    }


    let outerPoints = 320;
    for (let i = 0; i <= outerPoints; i++) {
      let angle = (i / outerPoints) * Math.PI * 2;
      let r = 405 + 24 * Math.abs(Math.sin(angle * 8));
      
      dots.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), color: C.borderRed, baseColor: C.borderRed, size: 2.5, group: 'outer-petal', index: i });
      dots.push({ x: cx + (r - 6) * Math.cos(angle), y: cy + (r - 6) * Math.sin(angle), color: C.goldBright, baseColor: C.goldBright, size: 2.2, group: 'outer-petal', index: i });
      dots.push({ x: cx + (r - 12) * Math.cos(angle), y: cy + (r - 12) * Math.sin(angle), color: C.borderDeep, baseColor: C.borderDeep, size: 1.9, group: 'outer-petal', index: i });
      
      if (Math.abs(Math.sin(angle * 8)) < 0.2) {
        dots.push({ x: cx + (r - 18) * Math.cos(angle), y: cy + (r - 18) * Math.sin(angle), color: C.gold, baseColor: C.gold, size: 1.5, group: 'outer-petal', index: i });
      }
    }
    

    for (let i = 0; i < 16; i++) {
      let angle = (i / 16) * Math.PI * 2 + Math.PI / 16;
      let r = 434;
      dots.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), color: C.borderDeep, baseColor: C.borderDeep, size: 3.2, group: 'outer-spike', index: i });
      dots.push({ x: cx + (r + 6) * Math.cos(angle), y: cy + (r + 6) * Math.sin(angle), color: C.borderRed, baseColor: C.borderRed, size: 2.6, group: 'outer-spike', index: i });
      dots.push({ x: cx + (r + 12) * Math.cos(angle), y: cy + (r + 12) * Math.sin(angle), color: C.goldBright, baseColor: C.goldBright, size: 1.8, group: 'outer-spike', index: i });
    }


    for (let x = 80; x <= 870; x += 6) {
      dots.push({ x: x, y: 870, color: C.gold, baseColor: C.gold, size: 2.4, group: 'base-line', index: x });
      dots.push({ x: x, y: 875, color: C.goldBright, baseColor: C.goldBright, size: 1.8, group: 'base-line', index: x });
      dots.push({ x: x, y: 955, color: C.gold, baseColor: C.gold, size: 2.4, group: 'base-line', index: x });
      dots.push({ x: x, y: 950, color: C.goldBright, baseColor: C.goldBright, size: 1.8, group: 'base-line', index: x });
    }
    for (let y = 870; y <= 955; y += 6) {
      dots.push({ x: 80, y: y, color: C.gold, baseColor: C.gold, size: 2.4, group: 'base-side', index: y });
      dots.push({ x: 85, y: y, color: C.goldBright, baseColor: C.goldBright, size: 1.8, group: 'base-side', index: y });
      dots.push({ x: 870, y: y, color: C.gold, baseColor: C.gold, size: 2.4, group: 'base-side', index: y });
      dots.push({ x: 865, y: y, color: C.goldBright, baseColor: C.goldBright, size: 1.8, group: 'base-side', index: y });
    }
    

    [[95, 885], [855, 885], [95, 940], [855, 940]].forEach(([x, y]) => {
      for (let r = 4; r <= 14; r += 3) {
        let cnt = Math.floor(r * 1.8);
        for (let i = 0; i < cnt; i++) {
          let a = (i / cnt) * Math.PI * 2;
          dots.push({
            x: x + r * Math.cos(a),
            y: y + r * Math.sin(a),
            color: C.borderRed,
            baseColor: C.borderRed,
            size: 1.8,
            group: 'base-corner',
            index: i
          });
        }
      }
    });
    

    for (let x = 120; x <= 830; x += 24) {
      dots.push({ x: x, y: 912, color: C.borderRed, baseColor: C.borderRed, size: 2.5, group: 'base-dash' });
      dots.push({ x: x + 12, y: 912, color: C.accent, baseColor: C.accent, size: 2.0, group: 'base-dash' });
    }


    for (let i = 0; i < 8; i++) {
      let a1 = (i / 8) * Math.PI * 2 - Math.PI / 2;
      let a2 = ((i + 1) / 8) * Math.PI * 2 - Math.PI / 2;
      let midAngle = (a1 + a2) / 2;
      
      let arcRadius = 362;
      let arcSpread = 0.38;
      let steps = 25;
      for (let s = 0; s <= steps; s++) {
        let t = s / steps;
        let arcA = midAngle - arcSpread/2 + arcSpread * t;
        let curveR = arcRadius + 10 * Math.sin(t * Math.PI);
        dots.push({ 
          x: cx + curveR * Math.cos(arcA), 
          y: cy + curveR * Math.sin(arcA), 
          color: C.gold, 
          baseColor: C.gold, 
          size: 2.0, 
          group: 'arc',
          arcIdx: i,
          step: s
        });
        dots.push({ 
          x: cx + (curveR - 5) * Math.cos(arcA), 
          y: cy + (curveR - 5) * Math.sin(arcA), 
          color: C.spokesDeep, 
          baseColor: C.spokesDeep, 
          size: 1.5, 
          group: 'arc',
          arcIdx: i,
          step: s
        });
      }
    }


    const ledLbl = document.getElementById('lblLedCount');
    if (ledLbl) ledLbl.textContent = dots.length;
  }


  let tick = 0;
  let lastFrameTime = 0;
  let lastRenderTime = 0;
  let deltaTime = 0;
  const TARGET_FRAME_MS = 1000 / 45;


  function drawCentralBuddhaPainting() {
  ctx.save();


  let radGlow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 60);
  if (isIgnited) {
    radGlow.addColorStop(0, 'rgba(248, 208, 96, 0.45)');
    radGlow.addColorStop(0.5, 'rgba(230, 92, 0, 0.2)');
    radGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  } else {
    radGlow.addColorStop(0, 'rgba(30, 30, 50, 0.2)');
    radGlow.addColorStop(1, 'rgba(0,0,0,0)');
  }
  ctx.fillStyle = radGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, 60, 0, Math.PI * 2);
  ctx.fill();


  if (buddhaImg.complete && buddhaImg.naturalWidth) {
    const bx = cx - BUDDHA.width / 2;
    const by = cy - BUDDHA.height / 2 + BUDDHA.offsetY;

    if (isIgnited) {

      let glowPulse = Math.sin(tick * 1.2) * 0.5 + 0.5;
      ctx.shadowBlur = 20 + glowPulse * 15;
      ctx.shadowColor = '#f8d060';
      ctx.drawImage(buddhaImg, bx, by, BUDDHA.width, BUDDHA.height);


      ctx.shadowBlur = 12 + glowPulse * 8;
      ctx.shadowColor = '#ff7700';
      ctx.drawImage(buddhaImg, bx, by, BUDDHA.width, BUDDHA.height);
    } else {
      ctx.drawImage(buddhaImg, bx, by, BUDDHA.width, BUDDHA.height);
    }
  }

  ctx.restore();
}


  function drawCustomPaintPaths() {
    if (customPaintDots.length === 0) return;
    
    ctx.save();
    customPaintDots.forEach(pd => {
      ctx.beginPath();
      ctx.arc(pd.x, pd.y, 6.0, 0, Math.PI * 2);
      ctx.fillStyle = pd.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = pd.color;
      ctx.fill();
    });
    ctx.restore();
  }


  function updateAndDrawLeds() {
    requestAnimationFrame(updateAndDrawLeds);

    const frameStart = performance.now();
    if (frameStart - lastRenderTime < TARGET_FRAME_MS) return;
    lastRenderTime = frameStart;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    

    let panelRadius = 285;
    for (let i = 0; i < 8; i++) {
      let angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
      let px = cx + panelRadius * Math.cos(angle);
      let py = cy + panelRadius * Math.sin(angle);


      const img = chapterImages[i];
      if (img && img.complete && img.naturalWidth) {
        ctx.save();

        ctx.beginPath();
        ctx.arc(px, py, 55, 0, Math.PI * 2);
        ctx.clip();
        

        const imgRatio = img.naturalWidth / img.naturalHeight;
        let drawW = 110, drawH = 110;
        if (imgRatio > 1) {
          drawW = 110 * imgRatio;
        } else {
          drawH = 110 / imgRatio;
        }
        ctx.drawImage(img, px - drawW / 2, py - drawH / 2, drawW, drawH);
        ctx.restore();
        

        if (selectedChapter === (i + 1)) {
          ctx.save();
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#f8d060';
          ctx.strokeStyle = '#f8d060';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(px, py, 56, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      } else if (selectedChapter === (i + 1)) {

        ctx.save();
        let glowGrad = ctx.createRadialGradient(px, py, 5, px, py, 58);
        glowGrad.addColorStop(0, 'rgba(248, 208, 96, 0.20)');
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(px, py, 58, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    

    const now = performance.now();
    if (lastFrameTime === 0) lastFrameTime = now;
    deltaTime = (now - lastFrameTime) / 1000;
    lastFrameTime = now;
    

    if (deltaTime > 0.1) deltaTime = 0.1;
    

    tick += 1.0 * deltaTime * globalSpeed;
    
    dots.forEach(d => {
      let state = false; 
      let intensity = 0.2; 
      let col = d.baseColor; 
      

      if (isIgnited) {
        let patternToRun = activePattern;
        if (activePattern === 'story') {
          patternToRun = (selectedChapter === 3 || selectedChapter === 5 || selectedChapter === 8) ? 'rainbow' : 
                         (selectedChapter === 4) ? 'peacock' : 'aura';
        }
        
     switch (patternToRun) {
          case 'aura':

            if (d.group === 'mandala') {
              let pulse = Math.sin(tick * 1.2 - d.ringIndex * 0.5) * 0.5 + 0.5;
              state = pulse > 0.25;
              intensity = 0.4 + pulse * 0.6;
            } else if (d.group === 'star') {
              let pulse = Math.sin(tick * 1.5 - d.dist * 0.04) * 0.5 + 0.5;
              state = pulse > 0.2;
              intensity = 0.5 + pulse * 0.5;
              col = C.goldBright;
            } else if (d.group === 'outer-petal') {
              let pulse = Math.sin(tick * 2.0 + d.index * 0.1) * 0.5 + 0.5;
              state = pulse > 0.3;
              intensity = 0.5 + pulse * 0.5;
            } else if (d.group === 'panel-beads') {

              let twinkle = Math.sin(tick * 3.0 + d.beadIdx * 1.7) * 0.5 + 0.5;
              state = twinkle > 0.3;
              intensity = 0.6 + twinkle * 0.4;
            } else if (d.group === 'panel-frame-outer' || d.group === 'panel-frame-inner') {

              let breath = Math.sin(tick * 0.8) * 0.5 + 0.5;
              state = true;
              intensity = 0.6 + breath * 0.4;
            } else {

              let glow = Math.sin(tick * 1.0 + d.x * 0.005 + d.y * 0.005) * 0.5 + 0.5;
              state = true;
              intensity = 0.5 + glow * 0.5;
            }
            break;
            
         case 'chaser':

            if (d.group === 'outer-ring') {

              let chIdx = (d.index + Math.floor(tick * 6.0)) % 8;
              state = chIdx < 4;
              intensity = state ? 1.0 : 0;
              col = chIdx < 2 ? C.goldBright : C.accent;
            } else if (d.group === 'mandala') {

              let phase = Math.floor(tick * 2.0) % 8;
              state = (d.ringIndex % 4) === (phase % 4);
              intensity = state ? 1.0 : 0;
              col = C.goldBright;
            } else if (d.group === 'spoke' || d.group === 'spoke-side') {

              let dist = d.dist || 200;
              let pulse = (Math.floor(tick * 3.0 - dist * 0.04)) % 3;
              state = pulse === 0;
              intensity = state ? 1.0 : 0;
              col = C.spokes;
            } else if (d.group === 'arc') {
              let chIdx = (d.step + Math.floor(tick * 5.0)) % 8;
              state = chIdx < 3;
              intensity = state ? 1.2 : 0;
              col = C.accent;
            } else if (d.group === 'panel-beads') {

              let chIdx = (d.beadIdx + Math.floor(tick * 4.0)) % 12;
              state = chIdx < 4;
              intensity = state ? 1.0 : 0;
              col = C.goldBright;
            } else if (d.group.startsWith('panel-frame')) {

              let phase = Math.floor(tick * 1.5) % 8;
              state = d.panelIdx === phase;
              intensity = state ? 1.2 : 0;
            } else if (d.group === 'outer-petal' || d.group === 'outer-spike') {

              let phase = (Math.floor(d.index / 8) + Math.floor(tick * 4.0)) % 5;
              state = phase < 2;
              intensity = state ? 1.0 : 0;
            } else if (d.group === 'star') {
              let chIdx = (d.starIdx + Math.floor(tick * 3.0)) % 8;
              state = chIdx < 3;
              intensity = state ? 1.0 : 0;
              col = C.accent;
            } else if (d.group === 'leaf') {
              let phase = Math.floor(tick * 2.0) % 4;
              state = (d.spokeIdx % 4) === phase;
              intensity = state ? 1.0 : 0;
            } else {

              state = Math.sin(tick * 1.5 + d.x * 0.02) > 0;
              intensity = state ? 0.9 : 0;
            }
            break;
            
          case 'peacock':

            let peacockColors = ['#00ffff', '#0055ff', '#00cc66', '#9c27b0', '#ff40a0'];
            if (d.group === 'mandala') {

              let phase = Math.floor(tick * 2.0) % 6;
              state = (d.ringIndex % 4) === (phase % 4);
              intensity = state ? 1.1 : 0;
              col = peacockColors[d.ringIndex % peacockColors.length];
            } else if (d.group === 'star') {
              let chIdx = (d.starIdx + Math.floor(tick * 2.5)) % 8;
              state = chIdx < 3;
              intensity = state ? 1.2 : 0;
              col = peacockColors[d.starIdx % peacockColors.length];
            } else if (d.group === 'spoke' || d.group === 'spoke-side') {
              let dist = d.dist || 200;
              let pulse = (Math.floor(tick * 3.0 - dist * 0.03)) % 3;
              state = pulse === 0;
              intensity = state ? 1.0 : 0;
              col = peacockColors[(d.spokeIdx || 0) % peacockColors.length];
            } else if (d.group === 'arc') {
              let chIdx = (d.step + Math.floor(tick * 6.0)) % 10;
              state = chIdx < 4;
              intensity = state ? 1.1 : 0;
              col = peacockColors[d.arcIdx % peacockColors.length];
            } else if (d.group === 'panel-beads') {
              let chIdx = (d.beadIdx + Math.floor(tick * 4.0)) % 12;
              state = chIdx < 4;
              intensity = state ? 1.0 : 0;
              col = peacockColors[d.beadIdx % peacockColors.length];
            } else if (d.group.startsWith('panel-frame')) {

              let phase = Math.floor(tick * 1.5) % 8;
              state = d.panelIdx === phase || d.panelIdx === ((phase + 4) % 8);
              intensity = state ? 1.2 : 0;
              col = peacockColors[d.panelIdx % peacockColors.length];
            } else if (d.group === 'leaf') {
              let phase = Math.floor(tick * 2.5) % 4;
              state = (d.spokeIdx % 4) === phase;
              intensity = state ? 1.1 : 0;
              col = '#00cc66';
            } else if (d.group === 'outer-petal' || d.group === 'outer-spike') {
              let phase = (Math.floor(d.index / 8) + Math.floor(tick * 3.0)) % 5;
              state = phase < 2;
              intensity = state ? 1.0 : 0;
              col = peacockColors[Math.floor(d.index / 20) % peacockColors.length];
            } else {
              state = Math.sin(tick * 2.0 + d.x * 0.02) > 0;
              intensity = state ? 0.9 : 0;
              col = peacockColors[Math.floor((d.x + d.y) / 80) % peacockColors.length];
            }
            break;
            
          case 'rainbow':

            let rainbowPalette = ['#ff0040', '#ff7700', '#ffd700', '#00cc66', '#00ffff', '#0055ff', '#9c27b0', '#ff40a0'];
            let dotSeed = (d.x * 0.137 + d.y * 0.241);
            let twinklePhase = (tick * 1.8 + dotSeed) % 3;
            state = twinklePhase < 1.2;
            intensity = state ? 1.1 : 0;
            let colorIdx = Math.floor((tick * 0.3 + dotSeed * 0.7)) % rainbowPalette.length;
            col = rainbowPalette[colorIdx];
            break;
        }
      }
      

      if (d.panelIdx === (selectedChapter - 1) && d.group.startsWith('panel-frame')) {
        state = true;
        intensity = 1.3 + Math.sin(tick * 3.0) * 0.3;
        col = chapters[selectedChapter - 1].themeColor || C.goldBright;
      }
      

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size * (state ? 1.15 : 1.0), 0, Math.PI * 2);
      
      if (state) {
        ctx.shadowBlur = 6 * globalBrightness * intensity;
        ctx.shadowColor = col;
        ctx.fillStyle = col;
        ctx.fill();
      } else {

        ctx.shadowBlur = 0;
        ctx.fillStyle = d.baseColor;
        ctx.globalAlpha = 0.22;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    });
    
    ctx.shadowBlur = 0;


    drawCentralBuddhaPainting();


    ctx.save();
    let glowPulse = isIgnited ? Math.sin(tick * 1.5) * 0.5 + 0.5 : 0;


    if (peacockLeft.complete && peacockLeft.naturalWidth) {
      const plx = cx - PEACOCK.offsetX;
      const ply = cy + PEACOCK.offsetY;
      ctx.save();
      ctx.globalAlpha = PEACOCK.opacity;
      ctx.translate(plx, ply);

      if (isIgnited && PEACOCK.glow) {
        ctx.shadowBlur = PEACOCK.glowSize + glowPulse * 10;
        ctx.shadowColor = PEACOCK.glowColor;
      }
      ctx.drawImage(peacockLeft, -PEACOCK.width / 2, -PEACOCK.height / 2, PEACOCK.width, PEACOCK.height);
      ctx.restore();
    }


    if (peacockRight.complete && peacockRight.naturalWidth) {
      const prx = cx + PEACOCK.offsetX;
      const pry = cy + PEACOCK.offsetY;
      ctx.save();
      ctx.globalAlpha = PEACOCK.opacity;
      ctx.translate(prx, pry);
      ctx.scale(-1, 1);
      if (isIgnited && PEACOCK.glow) {
        ctx.shadowBlur = PEACOCK.glowSize + glowPulse * 10;
        ctx.shadowColor = PEACOCK.glowColor;
      }
      ctx.drawImage(peacockRight, -PEACOCK.width / 2, -PEACOCK.height / 2, PEACOCK.width, PEACOCK.height);
      ctx.restore();
    }

    ctx.restore();


    drawCustomPaintPaths();
    

    ctx.fillStyle = isIgnited ? C.goldBright : '#444c5c';
    ctx.font = 'bold 24px "Noto Sans Sinhala", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('වෙස්සන්තර ජාතකය', cx, 922);
    
  }


function loadChapter(chId) {
    selectedChapter = chId;
    const ch = chapters[chId - 1];
    
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setText('lblChapterNo', ch.id);
    setText('storyTitleSi', ch.titleSi);
    setText('storyTitleEn', ch.titleEn);
    setText('txtStorySi', ch.storySi);
    setText('txtStoryEn', ch.storyEn);
    

    const placeholder = document.getElementById('storySvgPlaceholder');
    if (placeholder) {
      placeholder.innerHTML = `<img src="${ch.img}" alt="${ch.titleEn}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">`;
    }

    const galleryContainer = document.getElementById('chapterGallery');
    if (galleryContainer) galleryContainer.innerHTML = '';

    updateFocusContent(chId);
  }
  

  function openLightbox(src) {
    let lb = document.getElementById('imgLightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'imgLightbox';
      lb.className = 'img-lightbox';
      lb.innerHTML = '<img src="" alt=""><button class="lb-close">×</button>';
      document.body.appendChild(lb);
      
      lb.addEventListener('click', (e) => {
        if (e.target === lb || e.target.classList.contains('lb-close')) {
          lb.classList.remove('open');
        }
      });
    }
    lb.querySelector('img').src = src;
    lb.classList.add('open');
  }

  function setFocusHidden(el, hidden) {
    if (!el) return;
    el.classList.toggle('hidden', hidden);
    el.setAttribute('aria-hidden', hidden ? 'true' : 'false');
  }

  function updateFocusContent(chId) {
    const ch = chapters[chId - 1];
    if (!ch) return;

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText('focusChapterNo', ch.id);
    setText('focusStoryNo', ch.id);
    setText('focusTitleSi', ch.titleSi);
    setText('focusStorySi', ch.storySi);

    const focusImage = document.getElementById('focusImage');
    if (focusImage) {
      focusImage.src = ch.img;
      focusImage.alt = ch.titleEn;
    }

    const audioBtn = document.getElementById('btnFocusAudio');
    if (audioBtn) {
      audioBtn.classList.add('active');
      audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }
  }

  let focusTourTimer = null;
  let isAutoFocusTour = false;
  let hasAskedInitialFocus = false;
  const AUTO_FOCUS_PANEL_MS = 45000;

  function clearFocusTourTimer() {
    if (focusTourTimer) {
      clearTimeout(focusTourTimer);
      focusTourTimer = null;
    }
  }

  function showFocusPrompt(chId) {
    loadChapter(chId);
    setFocusHidden(document.getElementById('focusPrompt'), false);
  }

  function hideFocusPrompt() {
    setFocusHidden(document.getElementById('focusPrompt'), true);
  }

  function scheduleNextFocusPanel() {
    clearFocusTourTimer();
    if (!isAutoFocusTour) return;

    focusTourTimer = setTimeout(() => {
      if (!isAutoFocusTour) return;

      if (selectedChapter >= chapters.length) {
        isAutoFocusTour = false;
        closeFocusMode();
        return;
      }

      const nextId = selectedChapter + 1;
      loadChapter(nextId);
      playPanelAudio(nextId);
      scheduleNextFocusPanel();
    }, AUTO_FOCUS_PANEL_MS);
  }

  function openFocusMode(chId, options = {}) {
    hideFocusPrompt();
    clearFocusTourTimer();
    isAutoFocusTour = options.autoTour === true;
    loadChapter(chId);
    document.body.classList.add('focus-active');
    setFocusHidden(document.getElementById('focusMode'), false);
    playPanelAudio(chId);
    scheduleNextFocusPanel();
  }

  function closeFocusMode() {
    hideFocusPrompt();
    clearFocusTourTimer();
    isAutoFocusTour = false;
    document.body.classList.remove('focus-active');
    setFocusHidden(document.getElementById('focusMode'), true);
    selectedChapter = 0;
    stopPanelAudioAndResumeBg();
  }

  function goFocusChapter(direction, options = {}) {
    if (!options.keepAutoTour) {
      clearFocusTourTimer();
      isAutoFocusTour = false;
    }
    const current = selectedChapter || 1;
    let nextId = current + direction;
    if (nextId < 1) nextId = chapters.length;
    if (nextId > chapters.length) nextId = 1;
    loadChapter(nextId);
    playPanelAudio(nextId);
    scheduleNextFocusPanel();
  }

  function toggleFocusAudio() {
    const btn = document.getElementById('btnFocusAudio');
    const panelAudio = document.getElementById(`panelAudio${selectedChapter}`);
    if (!panelAudio) return;

    if (panelAudio.paused) {
      panelAudio.play().catch(() => {});
      if (btn) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      }
    } else {
      panelAudio.pause();
      if (btn) {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      }
    }
  }

  function toggleFocusFullscreen() {
    const focusMode = document.getElementById('focusMode');
    if (!focusMode) return;

    if (!document.fullscreenElement) {
      focusMode.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  function speakNarrative() {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech not supported in this browser.");
      return;
    }
    
    window.speechSynthesis.cancel();
    
    const ch = chapters[selectedChapter - 1];
    let txt, lang;
    
    if (currentLanguage === 'si') {
      txt = ch.storySi;
      lang = 'si-LK'; 
    } else {
      txt = ch.storyEn;
      lang = 'en-US';
    }
    
    const utterance = new SpeechSynthesisUtterance(txt);
    utterance.lang = lang;
    utterance.rate = 0.92; 
    
    const btn = document.getElementById('btnPlayNarrative');
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Reading...`;
    
    utterance.onend = () => {
      btn.innerHTML = `<i class="fa-solid fa-volume-high"></i> Speak`;
    };
    utterance.onerror = () => {
      btn.innerHTML = `<i class="fa-solid fa-volume-high"></i> Speak`;
    };
    
    window.speechSynthesis.speak(utterance);
  }


  const { $, on } = window.VesakDom;


  let currentPanelAudio = null;
  let isSoundMuted = false;

  function updateHeaderSoundButton() {
    const btn = $('btnHeaderSound');
    if (!btn) return;
    btn.classList.toggle('muted', isSoundMuted);
    btn.title = isSoundMuted ? 'ශබ්දය සක්‍රිය කරන්න' : 'ශබ්දය අක්‍රිය කරන්න';
    btn.innerHTML = isSoundMuted
      ? '<i class="fa-solid fa-volume-xmark"></i>'
      : '<i class="fa-solid fa-volume-high"></i>';
  }

  function setAllAudioMuted(muted) {
    isSoundMuted = muted;
    document.querySelectorAll('audio').forEach(audio => {
      audio.muted = muted;
    });

    const st = $('lblAudioStatus');
    if (st) st.textContent = muted ? 'නිශ්ශබ්දයි' : 'වාදනය වෙයි';
    updateHeaderSoundButton();
  }

  function togglePageSound() {
    setAllAudioMuted(!isSoundMuted);
    if (!isSoundMuted) {
      const audioToPlay = currentPanelAudio || $('bgAudio');
      if (audioToPlay && audioToPlay.paused && isIgnited) {
        audioToPlay.play().catch(() => {});
      }
    }
  }

  function playPanelAudio(panelId) {

    const bg = $('bgAudio');
    if (bg) {
      try {
        bg.pause();
        bg.muted = true;
      } catch (e) {
        console.log('BG pause error:', e);
      }
    }


    if (currentPanelAudio) {
      try {
        currentPanelAudio.pause();
        currentPanelAudio.currentTime = 0;
      } catch (e) {}
      currentPanelAudio = null;
    }


    const panelAudio = $('panelAudio' + panelId);
    if (panelAudio) {
      panelAudio.volume = 0.85;
      panelAudio.muted = isSoundMuted;
      panelAudio.currentTime = 0;
      panelAudio.play().then(() => {
        console.log('▶ Panel ' + panelId + ' audio playing');
      }).catch(err => {
        console.log('Panel audio play error:', err);
      });
      currentPanelAudio = panelAudio;
    } else {
      console.log('⚠ panelAudio' + panelId + ' element not found');
    }
  }

function stopPanelAudioAndResumeBg() {

    if (currentPanelAudio) {
      try {
        currentPanelAudio.pause();
        currentPanelAudio.currentTime = 0;
      } catch (e) {}
      currentPanelAudio = null;
    }

    const bg = $('bgAudio');
    if (bg && isIgnited) {
      bg.muted = isSoundMuted;
      bg.play().catch(err => console.log('BG resume blocked:', err));
    }
  }


  function setupEvents() {

    const patternCycle = ['aura', 'chaser', 'peacock', 'rainbow'];
    const patternLabels = {
      'aura':    'බුදුරැස් මාලා',
      'chaser':  'රන් දිව වැල්',
      'peacock': 'මයුර නර්ථනය',
      'rainbow': 'පංචවර්ණ'
    };
    let cycleIdx = 0;

    function nextPattern() {
      cycleIdx = (cycleIdx + 1) % patternCycle.length;
      activePattern = patternCycle[cycleIdx];
      const lbl = $('lblActivePattern');
      if (lbl) lbl.textContent = patternLabels[activePattern];
    }


    on($('btnIgnite'), 'click', () => {
      isIgnited = true;
      const overlay = $('initOverlay');
      if (overlay) overlay.classList.add('hidden');


      const bg = $('bgAudio');
      if (bg) {
        bg.volume = 0.7;
        bg.play().then(() => {
          const st = $('lblAudioStatus');
          if (st) st.textContent = 'වාදනය වෙයි';
        }).catch(err => {
          console.log('Audio autoplay blocked:', err);
          const st = $('lblAudioStatus');
          if (st) st.textContent = 'තිරය මත ක්ලික් කරන්න';
        });
      }


      activePattern = patternCycle[0];
      const lbl = $('lblActivePattern');
      if (lbl) lbl.textContent = patternLabels[activePattern];
      setInterval(nextPattern, 8000);
    });


    document.addEventListener('click', () => {
      const bg = $('bgAudio');
      if (bg && bg.paused && isIgnited) {
        bg.play().then(() => {
          const st = $('lblAudioStatus');
          if (st) st.textContent = 'වාදනය වෙයි';
        }).catch(() => {});
      }
    }, { once: false });


    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

      let panelRadius = 285;
      let closestPanel = -1;
      let closestDistance = Infinity;
      

      for (let i = 0; i < 8; i++) {
        let angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
        let px = cx + panelRadius * Math.cos(angle);
        let py = cy + panelRadius * Math.sin(angle);
        let dist = Math.hypot(clickX - px, clickY - py);
        
        if (dist < closestDistance) {
          closestDistance = dist;
          closestPanel = i;
        }
      }
      

      if (closestPanel >= 0 && closestDistance <= 90) {
        openFocusMode(closestPanel + 1, { autoTour: false });
      }
    });


function closeSidePanel() {
      const sidePanel = $('storyModal');
      const stage = $('thoranaStage');
      if (sidePanel) sidePanel.classList.remove('open');
      if (stage) stage.classList.remove('split-view');
      selectedChapter = 0;
      stopPanelAudioAndResumeBg();
    }

    on($('btnCloseModal'), 'click', closeSidePanel);
    on($('btnAcceptFocus'), 'click', () => openFocusMode(1, { autoTour: true }));
    on($('btnRejectFocus'), 'click', () => {
      hideFocusPrompt();
      selectedChapter = 0;
    });
    on($('btnCloseFocus'), 'click', closeFocusMode);
    on($('btnFocusPrev'), 'click', () => goFocusChapter(-1));
    on($('btnFocusNext'), 'click', () => goFocusChapter(1));
    on($('btnFocusAudio'), 'click', toggleFocusAudio);
    on($('btnHeaderSound'), 'click', togglePageSound);
    on($('btnFocusFullscreen'), 'click', toggleFocusFullscreen);
    on($('btnFocusComments'), 'click', () => {
      const suggestionsBtn = $('btnOpenSuggestions');
      if (suggestionsBtn) suggestionsBtn.click();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const prompt = $('focusPrompt');
        const focusMode = $('focusMode');
        if (prompt && !prompt.classList.contains('hidden')) {
          hideFocusPrompt();
          selectedChapter = 0;
          return;
        }
        if (focusMode && !focusMode.classList.contains('hidden')) {
          closeFocusMode();
          return;
        }
        const sidePanel = $('storyModal');
        if (sidePanel && sidePanel.classList.contains('open')) {
          closeSidePanel();
        }
      } else if (e.key === 'ArrowLeft') {
        const focusMode = $('focusMode');
        if (focusMode && !focusMode.classList.contains('hidden')) goFocusChapter(-1);
      } else if (e.key === 'ArrowRight') {
        const focusMode = $('focusMode');
        if (focusMode && !focusMode.classList.contains('hidden')) goFocusChapter(1);
      }
    });


    on($('btnPrevChapter'), 'click', () => {
      let prevId = selectedChapter - 1;
      if (prevId < 1) prevId = 8;
      loadChapter(prevId);
      playPanelAudio(prevId);
    });

    on($('btnNextChapter'), 'click', () => {
      let nextId = selectedChapter + 1;
      if (nextId > 8) nextId = 1;
      loadChapter(nextId);
      playPanelAudio(nextId);
    });

    on($('btnPlayNarrative'), 'click', speakNarrative);
  }


initStructure();
  setupEvents();
  updateAndDrawLeds();


  let firebaseApp = null;
  let firebaseDb = null;
  let firebaseFirestore = null;
  let myVisitorId = null;
  let myVisitorName = '';
  let visitorMoveInterval = null;
  let visitorHeartbeatInterval = null;
  const onlineVisitors = {};

  const visitorIcons = ['🚶', '🚶‍♀️', '🚶‍♂️', '🧘', '🧘‍♀️', '🧎', '🧎‍♀️'];
  const visitorIconMap = {};

  function initFirebase() {
    if (firebaseApp) return;
    try {
      const firebaseServices = window.VesakFirebase.init();
      firebaseApp = firebaseServices.app;
      firebaseDb = firebaseServices.realtimeDb;
      firebaseFirestore = firebaseServices.firestoreDb;
      console.log('Firebase initialized');
      startVisitorListener();
    } catch (err) {
      console.error('Firebase init error:', err);
    }
  }

  async function saveCommunityEntry(path, data) {
    if (window.VesakFirebase) {
      return window.VesakFirebase.saveBoth(path, path, data);
    }

    if (!firebaseDb) return null;
    const ref = firebaseDb.ref(path);
    return ref.push({
      ...data,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    });
  }


  function generateVisitorId() {
    return 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
  }


  function randomVisitorPosition() {
    return {
      x: 5 + Math.random() * 90,
      y: 92 + Math.random() * 6
    };
  }


  function registerVisitor(name) {
    if (!firebaseDb) return;
    myVisitorId = generateVisitorId();
    myVisitorName = name;
    
    const pos = randomVisitorPosition();
    const visitorRef = firebaseDb.ref('visitors/' + myVisitorId);
    
    visitorRef.set({
      name: name,
      x: pos.x,
      y: pos.y,
      lastSeen: firebase.database.ServerValue.TIMESTAMP
    });


    visitorRef.onDisconnect().remove();


    visitorHeartbeatInterval = setInterval(() => {
      visitorRef.update({
        lastSeen: firebase.database.ServerValue.TIMESTAMP
      });
    }, 20000);


    function walkToNewSpot() {
      const newPos = randomVisitorPosition();
      visitorRef.update({
        x: newPos.x,
        y: newPos.y,
        lastSeen: firebase.database.ServerValue.TIMESTAMP
      });

      const nextWalk = 5000 + Math.random() * 4000;
      visitorMoveInterval = setTimeout(walkToNewSpot, nextWalk);
    }
    visitorMoveInterval = setTimeout(walkToNewSpot, 3000);
  }


  function startVisitorListener() {
    if (!firebaseDb) return;
    const visitorsRef = firebaseDb.ref('visitors');
    
    visitorsRef.on('value', (snapshot) => {
      const data = snapshot.val() || {};
      const now = Date.now();
      

      const activeVisitors = Object.keys(data).filter(id => {
        const v = data[id];
        return v && v.lastSeen && (now - v.lastSeen < 60000);
      });
      

      const onlineLbl = document.getElementById('lblOnlineCount');
      if (onlineLbl) onlineLbl.textContent = activeVisitors.length;
      

      const liveLbl = document.getElementById('lblLiveOnline');
      if (liveLbl) liveLbl.textContent = activeVisitors.length;
      
      renderVisitors(data);
    });
    

    trackVisitsToday();
  }


  function trackVisitsToday() {
    if (!firebaseDb) return;
    
    const today = new Date();
    const dateKey = today.getFullYear() + '-' + 
                    String(today.getMonth() + 1).padStart(2, '0') + '-' +
                    String(today.getDate()).padStart(2, '0');
    
    const statsRef = firebaseDb.ref('stats/' + dateKey);
    

    const countedKey = 'vesak_counted_' + dateKey;
    const alreadyCounted = localStorage.getItem(countedKey);
    
    if (!alreadyCounted) {

      statsRef.transaction((current) => (current || 0) + 1);

      try {
        localStorage.setItem(countedKey, '1');
      } catch (e) {

      }
      

      cleanOldVisitFlags();
    }
    

    statsRef.on('value', (snapshot) => {
      const count = snapshot.val() || 0;
      const todayLbl = document.getElementById('lblTotalToday');
      if (todayLbl) todayLbl.textContent = count.toLocaleString();
    });
  }
  

  function cleanOldVisitFlags() {
    try {
      const today = new Date();
      const keysToCheck = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('vesak_counted_')) {
          keysToCheck.push(key);
        }
      }
      keysToCheck.forEach(key => {
        const dateStr = key.replace('vesak_counted_', '');
        const flagDate = new Date(dateStr);
        const daysDiff = (today - flagDate) / (1000 * 60 * 60 * 24);
        if (daysDiff > 7) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {

    }
  }


  function renderVisitors(visitorsData) {
    const layer = document.getElementById('visitorsLayer');
    if (!layer) return;
    
    const now = Date.now();
    const activeIds = Object.keys(visitorsData).filter(id => {
      const v = visitorsData[id];
      return v && v.lastSeen && (now - v.lastSeen < 60000);
    });
    

    Array.from(layer.children).forEach(el => {
      if (!activeIds.includes(el.dataset.visitorId)) {
        el.remove();
      }
    });
    
    activeIds.forEach(id => {
      const v = visitorsData[id];
      

      if (!visitorIconMap[id]) {
        visitorIconMap[id] = visitorIcons[Math.floor(Math.random() * visitorIcons.length)];
      }
      

      let person = layer.querySelector(`[data-visitor-id="${id}"]`);
      
      if (!person) {

        person = document.createElement('div');
        person.className = 'visitor-person' + (id === myVisitorId ? ' self' : '');
        person.dataset.visitorId = id;
        person.innerHTML = `
          <span class="person-icon">${visitorIconMap[id]}</span>
          <span class="person-name"></span>
        `;
        layer.appendChild(person);
      }
      

      person.style.left = v.x + '%';
      person.style.top = v.y + '%';
      person.querySelector('.person-name').textContent = v.name;
      

      const prevX = parseFloat(person.dataset.prevX || v.x);
      if (v.x < prevX) {
        person.classList.add('facing-left');
      } else if (v.x > prevX) {
        person.classList.remove('facing-left');
      }
      person.dataset.prevX = v.x;
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }


  

  document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
  });


  const originalIgniteBtn = document.getElementById('btnIgnite');
  if (originalIgniteBtn) {
    const newIgniteBtn = originalIgniteBtn.cloneNode(true);
    originalIgniteBtn.parentNode.replaceChild(newIgniteBtn, originalIgniteBtn);
    
    newIgniteBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('inputVisitorName');
      const name = nameInput ? nameInput.value.trim() : '';
      
      if (!name) {
        if (nameInput) {
          nameInput.style.borderColor = '#cc0022';
          nameInput.focus();
          nameInput.placeholder = 'කරුණාකර නම ඇතුළත් කරන්න!';
        }
        return;
      }
      

      registerVisitor(name);
      

      isIgnited = true;
      const overlay = document.getElementById('initOverlay');
      if (overlay) overlay.classList.add('hidden');

      const bg = document.getElementById('bgAudio');
      if (bg) {
        bg.volume = 0.7;
        bg.play().catch(() => {});
      }
      

      const patternCycle = ['aura', 'chaser', 'peacock', 'rainbow'];
      let cycleIdx = 0;
      activePattern = patternCycle[0];
      setInterval(() => {
        cycleIdx = (cycleIdx + 1) % patternCycle.length;
        activePattern = patternCycle[cycleIdx];
        const lbl = document.getElementById('lblActivePattern');
        if (lbl) {
          const labels = {'aura': 'බුදුරැස් මාලා', 'chaser': 'රන් දිව වැල්', 'peacock': 'මයුර නර්ථනය', 'rainbow': 'පංචවර්ණ'};
          lbl.textContent = labels[activePattern];
        }
      }, 8000);

      if (!hasAskedInitialFocus) {
        hasAskedInitialFocus = true;
        setTimeout(() => {
          const focusMode = document.getElementById('focusMode');
          if (!focusMode || focusMode.classList.contains('hidden')) {
            showFocusPrompt(1);
          }
        }, 500);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('btnOpenSuggestions');
    const closeBtn = document.getElementById('btnCloseSuggestions');
    const modal = document.getElementById('suggestionsModal');
    const submitBtn = document.getElementById('btnSubmitSuggestion');
    const successMsg = document.getElementById('sugSuccessMsg');
    const form = document.querySelector('.sug-form');
    
    const sugName = document.getElementById('sugName');
    const sugMessage = document.getElementById('sugMessage');
    const charCount = document.getElementById('sugCharCount');
    
    let selectedType = 'suggestion';
    

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        if (modal) modal.classList.remove('hidden');

        if (sugName && myVisitorName && !sugName.value) {
          sugName.value = myVisitorName;
        }
      });
    }
    

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (modal) modal.classList.add('hidden');
      });
    }
    

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    }
    

    document.querySelectorAll('.sug-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sug-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedType = btn.dataset.type;
      });
    });
    

    if (sugMessage && charCount) {
      sugMessage.addEventListener('input', () => {
        charCount.textContent = sugMessage.value.length;
      });
    }
    

    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        const name = sugName.value.trim();
        const message = sugMessage.value.trim();
        

        if (!name) {
          sugName.style.borderColor = '#cc0022';
          sugName.focus();
          return;
        }
        if (!message || message.length < 5) {
          sugMessage.style.borderColor = '#cc0022';
          sugMessage.focus();
          return;
        }
        

        sugName.style.borderColor = '';
        sugMessage.style.borderColor = '';
        

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> යවමින්...';
        

        if (firebaseDb) {
          try {
            await saveCommunityEntry('suggestions', {
              name: name,
              message: message,
              type: selectedType,
              userAgent: navigator.userAgent.substring(0, 100)
            });
            

            if (form) form.style.display = 'none';
            if (successMsg) successMsg.classList.remove('hidden');
            

            setTimeout(() => {
              if (modal) modal.classList.add('hidden');

              setTimeout(() => {
                if (form) form.style.display = '';
                if (successMsg) successMsg.classList.add('hidden');
                sugMessage.value = '';
                charCount.textContent = '0';
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> යවන්න';
              }, 500);
            }, 3000);
          } catch (err) {
            console.error('Suggestion save error:', err);
            alert('දෝෂයකි. කරුණාකර ආයෙත් උත්සහ කරන්න.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> යවන්න';
          }
        }
      });
    }
  });
 

  const LAMP_COLORS = window.VESAK_LAMP_COLORS;
  
  let selectedLampColor = 'gold';
  
  document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('btnLightLamp');
    const closeBtn = document.getElementById('btnCloseLamp');
    const modal = document.getElementById('lightLampModal');
    const submitBtn = document.getElementById('btnSubmitLamp');
    const successMsg = document.getElementById('lampSuccessMsg');
    const form = document.querySelector('.lamp-form');
    const lampName = document.getElementById('lampName');
    const lampWish = document.getElementById('lampWish');
    const preview = document.getElementById('lampPreview');
    

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        if (modal) modal.classList.remove('hidden');
        if (lampName && myVisitorName && !lampName.value) {
          lampName.value = myVisitorName;
        }
      });
    }
    

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (modal) modal.classList.add('hidden');
      });
    }
    
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
      });
    }
    

    document.querySelectorAll('.lamp-color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.lamp-color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedLampColor = btn.dataset.color;

        if (preview) {
          const flame = preview.querySelector('.lamp-flame');
          if (flame) {
            const color = LAMP_COLORS[selectedLampColor];
            flame.style.background = `radial-gradient(ellipse at bottom, ${color} 0%, transparent 70%)`;
            flame.style.filter = `drop-shadow(0 0 12px ${color})`;
          }
        }
      });
    });
    

    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        const name = lampName.value.trim();
        const wish = lampWish.value.trim();
        
        if (!name) {
          lampName.style.borderColor = '#cc0022';
          lampName.focus();
          return;
        }
        lampName.style.borderColor = '';
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> දල්වමින්...';
        
        if (firebaseDb) {
          try {
            await saveCommunityEntry('lamps', {
              name: name,
              wish: wish || null,
              color: selectedLampColor
            });
            
            if (form) form.style.display = 'none';
            if (successMsg) successMsg.classList.remove('hidden');
            
            setTimeout(() => {
              if (modal) modal.classList.add('hidden');
              setTimeout(() => {
                if (form) form.style.display = '';
                if (successMsg) successMsg.classList.add('hidden');
                lampWish.value = '';
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-fire"></i> පහන දල්වන්න';
              }, 500);
            }, 3000);
          } catch (err) {
            console.error('Lamp save error:', err);
            alert('දෝෂයකි. ආයෙත් උත්සහ කරන්න.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-fire"></i> පහන දල්වන්න';
          }
        }
      });
    }
    

    startLampsListener();
  });
  

  function startLampsListener() {
    const checkDb = setInterval(() => {
      if (firebaseDb) {
        clearInterval(checkDb);
        const lampsRef = firebaseDb.ref('lamps');
        
        lampsRef.on('value', (snapshot) => {
          const data = snapshot.val() || {};
          renderLitLamps(data);
        });
      }
    }, 500);
  }
  
  function renderLitLamps(lampsData) {
    const area = document.getElementById('litLampsArea');
    const countLbl = document.getElementById('lblLampCount');
    if (!area) return;
    
    const lampIds = Object.keys(lampsData);
    if (countLbl) countLbl.textContent = lampIds.length;
    

    lampIds.sort((a, b) => (lampsData[b].timestamp || 0) - (lampsData[a].timestamp || 0));
    

    const visibleLamps = lampIds.slice(0, 200);
    

    let html = '';
    visibleLamps.forEach((id, idx) => {
      const lamp = lampsData[id];
      if (!lamp) return;
      const color = LAMP_COLORS[lamp.color] || LAMP_COLORS.gold;
      const safeName = (lamp.name || '').replace(/[<>"']/g, '');      const liteClass = idx >= 30 ? ' lite' : '';
      html += `
        <div class="lit-lamp${liteClass}" style="--flame-color: ${color}" data-name="${safeName}" data-wish="${(lamp.wish || '').replace(/[<>"']/g, '')}">
          <span class="lit-lamp-name">${safeName}</span>
          <div class="lit-lamp-flame"></div>
          <span class="lit-lamp-base">🪔</span>
        </div>
      `;
    });
    area.innerHTML = html;
  }  document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('btnOpenWishes');
    const closeBtn = document.getElementById('btnCloseWishes');
    const modal = document.getElementById('wishesModal');
    const submitBtn = document.getElementById('btnSubmitWish');
    const successMsg = document.getElementById('wishSuccessMsg');
    const form = document.querySelector('.wish-form');
    const wishName = document.getElementById('wishName');
    const wishMessage = document.getElementById('wishMessage');
    const wishCharCount = document.getElementById('wishCharCount');    if (openBtn) {
      openBtn.addEventListener('click', () => {
        if (modal) modal.classList.remove('hidden');
        if (wishName && myVisitorName && !wishName.value) {
          wishName.value = myVisitorName;
        }
      });
    }    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (modal) modal.classList.add('hidden');
      });
    }
    
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
      });
    }    if (wishMessage && wishCharCount) {
      wishMessage.addEventListener('input', () => {
        wishCharCount.textContent = wishMessage.value.length;
      });
    }    document.querySelectorAll('.w-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.w-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.w-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const content = document.getElementById('wtab-' + tab.dataset.tab);
        if (content) content.classList.add('active');
      });
    });    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        const name = wishName.value.trim();
        const message = wishMessage.value.trim();
        
        if (!name) {
          wishName.style.borderColor = '#cc0022';
          wishName.focus();
          return;
        }
      if (!message || message.length < 3) {
          wishMessage.style.borderColor = '#cc0022';
          wishMessage.focus();
          return;
        }
        wishName.style.borderColor = '';
        wishMessage.style.borderColor = '';
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> යවමින්...';
        
        if (firebaseDb) {
          try {
            console.log('🪷 Submitting wish:', { name, message });
            const result = await saveCommunityEntry('wishes', {
              name: name,
              message: message
            });
            console.log('Wish saved with ID:', result && result.realtime ? result.realtime.key : null);
            
            if (form) form.style.display = 'none';
            if (successMsg) successMsg.classList.remove('hidden');
            
            setTimeout(() => {
              if (modal) modal.classList.add('hidden');
              setTimeout(() => {
                if (form) form.style.display = '';
                if (successMsg) successMsg.classList.add('hidden');
                wishMessage.value = '';
                wishCharCount.textContent = '0';
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-spa"></i> පැතුම තැබීමට';
              }, 500);
            }, 3000);
          } catch (err) {
            console.error('Wish save error:', err);
            alert('දෝෂයක්. ආයෙත් උත්සාහ කරන්න.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-spa"></i> පැතුම තැබීමට';
          }
        }
      });
    }    const detailModal = document.getElementById('wishDetail');
    const detailClose = document.querySelector('.wish-detail-close');
    if (detailClose) {
      detailClose.addEventListener('click', () => {
        if (detailModal) detailModal.classList.add('hidden');
      });
    }
    if (detailModal) {
      detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) detailModal.classList.add('hidden');
      });
    }    startWishesListener();
  });  function startWishesListener() {
    const checkDb = setInterval(() => {
      if (firebaseDb) {
        clearInterval(checkDb);
        const wishesRef = firebaseDb.ref('wishes');
        wishesRef.on('value', (snapshot) => {
          const data = snapshot.val() || {};
          renderWishes(data);
        });
      }
    }, 500);
  }  const wishPositionCache = {};
  
  function renderWishes(wishesData) {
    const layer = document.getElementById('wishesLayer');
    const countBtn = document.getElementById('lblWishCount');
    const countList = document.getElementById('wishListCount');
    const list = document.getElementById('wishesList');
    if (!layer) return;
    
    const wishIds = Object.keys(wishesData);
    if (countBtn) countBtn.textContent = wishIds.length;
    if (countList) countList.textContent = wishIds.length;    wishIds.sort((a, b) => (wishesData[b].timestamp || 0) - (wishesData[a].timestamp || 0));    const visibleWishes = wishIds.slice(0, 15);
    let lotusHTML = '';
    visibleWishes.forEach((id, idx) => {
      const wish = wishesData[id];
      if (!wish) return;      if (!wishPositionCache[id]) {
        const isMobile = window.innerWidth < 768;        const angle = (idx / visibleWishes.length) * Math.PI * 2 + Math.random() * 0.5;        const distance = isMobile ? 38 + Math.random() * 15 : 35 + Math.random() * 25;
        wishPositionCache[id] = {
          x: 50 + Math.cos(angle) * distance,
          y: 50 + Math.sin(angle) * distance * (isMobile ? 0.5 : 0.6),
          duration: 6 + Math.random() * 6
        };
      }
      const pos = wishPositionCache[id];
      
      const safeName = (wish.name || '').replace(/[<>"']/g, '');
      const safeMsg = (wish.message || '').replace(/[<>"']/g, '').replace(/\n/g, ' ');
      
      lotusHTML += `
        <div class="floating-lotus" 
             style="left: ${pos.x}%; top: ${pos.y}%; --float-duration: ${pos.duration}s; animation-delay: ${idx * 0.2}s"
             data-author="${safeName}"
             data-message="${safeMsg}"
             data-time="${wish.timestamp}"
             onclick="showWishDetail(this)">
          🪷
        </div>
      `;
    });
    layer.innerHTML = lotusHTML;    if (list) {
      if (wishIds.length === 0) {
        list.innerHTML = '<div class="wishes-loading">තවම පැතුම් නෑ. පළමු පැතුම ඔබගේ වේවා! 🪷</div>';
      } else {
        let listHTML = '';
        wishIds.forEach(id => {
          const wish = wishesData[id];
          if (!wish) return;
          const safeName = (wish.name || '').replace(/[<>"']/g, '');
          const safeMsg = (wish.message || '').replace(/[<>"']/g, '');
          const timeAgo = getTimeAgo(wish.timestamp);
          listHTML += `
            <div class="wish-item">
              <div class="wish-item-author">${safeName}</div>
              <div class="wish-item-message">${safeMsg}</div>
              <div class="wish-item-time"><i class="fa-solid fa-clock"></i> ${timeAgo}</div>
            </div>
          `;
        });
        list.innerHTML = listHTML;
      }
    }
  }  function getTimeAgo(timestamp) {
    if (!timestamp) return 'දැන්';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'දැන්ම';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `මිනිත්තු ${minutes} කට පෙර`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `පැය ${hours} කට පෙර`;
    const days = Math.floor(hours / 24);
    return `දින ${days} කට පෙර`;
  }  window.showWishDetail = function(el) {
    const author = el.dataset.author;
    const message = el.dataset.message;
    const time = el.dataset.time;
    
    document.getElementById('wishDetailAuthor').textContent = author;
    document.getElementById('wishDetailMessage').textContent = message;
    document.getElementById('wishDetailTime').textContent = getTimeAgo(parseInt(time));
    
    document.getElementById('wishDetail').classList.remove('hidden');
  };  let hintShown = false;
  let hintRemoved = false;
  
  function showClickHint() {
    if (hintShown || hintRemoved) return;
    hintShown = true;
    
    const hint = document.getElementById('clickHint');
    if (hint) {
      hint.classList.remove('hidden');      setTimeout(() => {
        if (hint && !hintRemoved) {
          hint.classList.add('hidden');
          hintRemoved = true;
        }
      }, 9500);
    }
  }
  
  function hideClickHint() {
    const hint = document.getElementById('clickHint');
    if (hint && !hintRemoved) {
      hint.classList.add('hidden');
      hintRemoved = true;
    }
  }  function watchForIgnite() {
    const checkLoop = setInterval(() => {
      if (isIgnited) {
        clearInterval(checkLoop);
        setTimeout(showClickHint, 2000);
      }
    }, 500);
  }
  
  watchForIgnite();

})();
