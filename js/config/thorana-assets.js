window.VESAK_ASSETS = {
  palette: {
    gold: '#d4af37',
    goldBright: '#f8d060',
    spokes: '#e65c00',
    spokesDeep: '#b84500',
    innerRing: '#ff7700',
    borderRed: '#cc0022',
    borderDeep: '#8b0015',
    accent: '#ffa500',
    deepGold: '#8b6914',
    leafGreen: '#00cc66'
  },
  images: {
    peacock: 'assets/images/4.png',
    buddha: 'assets/images/b.png',
    chapter: (id) => `assets/images/vessantara_panel_${id}.png`
  },
  buddha: {
    width: 350,
    height: 350,
    offsetY: 75
  },
  peacock: {
    width: 180,
    height: 220,
    offsetY: 350,
    offsetX: 340,
    opacity: 1.0,
    glow: true,
    glowColor: '#00e5ff',
    glowSize: 25
  },
  createImage(src) {
    const img = new Image();
    img.src = src;
    return img;
  }
};
