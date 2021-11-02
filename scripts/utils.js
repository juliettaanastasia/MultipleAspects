const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const getRandomRGB = () => {
  return rgbToHex(
    getRandomInt(0, 255),
    getRandomInt(0, 255),
    getRandomInt(0, 255)
  );
};

export { getRandomInt, getRandomRGB };
