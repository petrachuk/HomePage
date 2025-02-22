const rightBlock = document.getElementById('rightBlock');

if (rightBlock) {
  window.addEventListener('wheel', (event) => {
    rightBlock.scrollTop += event.deltaY;
    event.preventDefault();
  });
}