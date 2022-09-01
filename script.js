const fileInput = document.querySelector(".file-input"),
  chooseImage = document.querySelector(".choose-image"),
  //   imageWrap = document.querySelector(".image-wrap"),
  previewImage = document.querySelector(".image-wrap img"),
  filterButtons = document.querySelectorAll(".filter-buttons button"),
  selectedFilter = document.querySelector(".filter-name .selected-filter"),
  filterValue = document.querySelector(".filter-name .filter-value"),
  filterSlider = document.querySelector(".adjust-selected-filter input"),
  rotateButtons = document.querySelectorAll(".rotate-buttons button"),
  resetFiltersButton = document.querySelector(".reset-filters"),
  saveImageBtn = document.querySelector(".save-image");

let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0,
  rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;
const applyFilters = () => {
  previewImage.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal} , ${flipVertical})`;
  previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filter-buttons .focus").classList.remove("focus");
    button.classList.add("focus");
    selectedFilter.innerText = button.innerText;

    if (button.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (button.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (button.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else if (button.id === "grayscale") {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

const handleLoadImage = () => {
  let file = fileInput.files[0]; // Getting user selected file
  //   console.log(file);
  if (!file) return; //return if file not selected
  previewImage.src = URL.createObjectURL(file); //passing file url as preview img src
  previewImage.addEventListener("load", () => {
    resetFiltersButton.click();
    document.querySelector(".container").classList.remove("disable");
  });
};

const updateFilter = () => {
  filterValue.innerText = filterSlider.value + "%";
  const selectedFilterButton = document.querySelector(".filter-buttons .focus");

  if (selectedFilterButton.id === "brightness") brightness = filterSlider.value;
  else if (selectedFilterButton.id === "saturation")
    saturation = filterSlider.value;
  else if (selectedFilterButton.id === "inversion")
    inversion = filterSlider.value;
  else if (selectedFilterButton.id === "grayscale")
    grayscale = filterSlider.value;

  applyFilters();
};

rotateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.id === "rotate-anti-clock-wise") {
      rotate -= 90;
    } else if (button.id === "rotate-clock-wise") {
      rotate += 90;
    } else if (button.id === "flip-horizontally") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else if (button.id === "flip-vertically") {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilters();
  });
});

const handleResetFilters = () => {
  (brightness = 100),
    (saturation = 100),
    (inversion = 0),
    (grayscale = 0),
    (rotate = 0),
    (flipHorizontal = 1),
    (flipVertical = 1);
  filterButtons[0].click();
  applyFilters();
};

const handleSaveImage = () => {
  const canvas = document.createElement("canvas"); // create canvas element
  ctx = canvas.getContext("2d"); // canvas.getContext return a drawing context on the canvas
  canvas.width = previewImage.naturalWidth; // setting canvas width to actual image height
  canvas.height = previewImage.naturalHeight; // setting canvas height to actual image height

  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2); //Translating canvas from center
  if (rotate !== 0) {
    // if rotate value isn't 0, rotate the canvas
    ctx.rotate((rotate * Maths.PI) / 180);
  }
  ctx.scale(flipHorizontal, flipVertical); //Flip canvas, horizontally or vertically
  ctx.drawImage(
    previewImage,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  const link = document.createElement("a"); //creating <a> element
  link.download = "image.jpg"; //passing <a> tag download value to "image.jpg"
  link.href = canvas.toDataURL(); //passing <a> tag href value to canvas data url
  link.click(); //Clicking <a> tag so the image download
};
fileInput.addEventListener("change", handleLoadImage);
chooseImage.addEventListener("click", () => fileInput.click());
filterSlider.addEventListener("input", updateFilter);
resetFiltersButton.addEventListener("click", handleResetFilters);
saveImageBtn.addEventListener("click", handleSaveImage);
