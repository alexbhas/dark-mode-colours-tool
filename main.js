let getChannel = (channel) => {
  let normalized = channel/255;
  if (normalized <= 0.03928) {
    return normalized/12.92  
  } else {
    return ((normalized + 0.055) / 1.055) ** 2.4;
  }
}

let getLuminance = (r, g, b) => {
  let R = getChannel(r);
  let G = getChannel(g);
  let B = getChannel(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

let convertToRGB = (htmlCode) => {
  let Rhex = htmlCode.substring(1,3);
  let Ghex = htmlCode.substring(3,5);
  let Bhex = htmlCode.substring(5);

  let R = parseInt("0x" + Rhex, 16);
  let G = parseInt("0x" + Ghex, 16);
  let B = parseInt("0x" + Bhex, 16);

  let rgb = [R, G, B];

  return rgb;

}

let contrast = (l1, l2) => {

  if(l1 > l2){
    return (l1 + 0.05) / (l2 + 0.05);
  } else{
    return (l2 + 0.05) / (l1 + 0.05);
  }

}

function generate(){


  let colors = document.querySelector('#colors');
  colors.innerHTML = "";
  
  let first = document.getElementById("firstcolour");
  let second = document.getElementById("secondcolour");

  let firstColour = first.value;
  let secondColour = second.value;

  let invalidF = /^#[0-9A-F]{6}$/i.test(firstColour);
  let invalidS = /^#[0-9A-F]{6}$/i.test(secondColour);

  first.value = "";
  second.value = "";

  if(invalidF == true && invalidS == true){

    let firstRGB = convertToRGB(firstColour);
    let secondRGB = convertToRGB(secondColour);

    let firstLum = getLuminance(firstRGB[0], firstRGB[1], firstRGB[2]);
    let secondLum = getLuminance(secondRGB[0], secondRGB[1], secondRGB[2]);

    let addColor = (r, g, b) => {
      let li = document.createElement('li');
      li.innerHTML = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}<br/>
    rgb(${r}, ${g}, ${b})`;
      li.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      colors.appendChild(li);
    };

    let count = 0;
    
    for (let b = 0; b < 256; b += 17) {
      for (let g = 0; g < 256; g += 17) {
        for (let r = 0; r < 256; r += 17) {
          let luminance = getLuminance(r, g, b);
        
          if(contrast(firstLum, luminance) >= 4.51 && contrast(secondLum, luminance) >= 4.51){
            count++;
            addColor(r, g, b);
          }
        }
      }
    }
    
    //document.querySelector('#count').textContent = count;
  } else{
    alert("Invalid HTML colour code");
  }

}

