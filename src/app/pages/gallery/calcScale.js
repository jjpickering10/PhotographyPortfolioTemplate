export default function calcScale(w, h, index) {
  const fov = 75 * (Math.PI / 180);
  const camHeight = 2 * Math.tan(fov / 2) * 10;
  const camWidth = camHeight * (window.innerWidth / window.innerHeight);

  const scaleX = (camWidth * (w / window.innerWidth)) / 2;
  const scaleY = (camHeight * (h / window.innerHeight)) / 2;
  const extraX = index === 0 || index === 1 ? scaleX / 2 : -(scaleX / 2);
  const extraY = index === 0 || index === 2 ? -(scaleY / 2) : scaleY / 2;

  return [
    [scaleX, scaleY, 1],
    [scaleX * 2, scaleY * 2, 1],
    [extraX, extraY, 0],
    [0, 0, 0],
    [scaleX * 4, scaleY * 4, 1],
  ];
}
