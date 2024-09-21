// Create Dino Constructor
class Dino {
  constructor(species, weight, height, diet, facts) {
    this.species = species;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.facts = facts;
    this.image = `images/${species.toLowerCase()}.png`;
  }

  randomFact() {
    const factIndex = Math.floor(Math.random() * this.facts.length);
    return this.facts[factIndex];
  }

  updateFact(fact) {
    this.facts.push(fact);
  }

  compareWeight(weight) {
    const weightDifference = this.weight - weight;
    if (weightDifference > 0) {
      return `${this.species} is heavier than you by ${weightDifference} lbs.`;
    } else if (weightDifference < 0) {
      return `You are heavier than ${this.species} by ${Math.abs(weightDifference)} lbs.`;
    } else {
      return `${this.species} and you weigh the same.`;
    }
  }

  compareHeight(height) {
    const heightDifference = this.height - height;
    if (heightDifference > 0) {
      return `${this.species} is taller than you by ${heightDifference} inches.`;
    } else if (heightDifference < 0) {
      return `You are taller than ${this.species} by ${Math.abs(heightDifference)} inches.`;
    } else {
      return `${this.species} and you are the same height.`;
    }
  }

  compareDiet(diet) {
    if (this.diet.toLowerCase() === diet.toLowerCase()) {
      return `${this.species} has the same diet as you: ${diet}.`;
    } else {
      return `${this.species} has a different diet than you. It is a ${this.diet}.`;
    }
  }
}

class Human {
  constructor(name, weight, height, diet) {
    this.species = "Human";
    this.name = name;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.image = "images/human.png";
  }
}

// Fetch Dino Data
let dinos = [];
fetch('dino.json')
  .then(response => response.json())
  .then(data => {
    dinos = data.Dinos.map(dino => new Dino(
      dino.species, 
      dino.weight, 
      dino.height, 
      dino.diet, 
      [
        dino.fact,
        `I lived in ${dino.where}.`,
        `I appeared in the ${dino.when} period.`
      ]
    ));
  });

// Get human data from form
function getHuman() {
  const name = document.getElementById("name").value;
  const heightFeet = parseFloat(document.getElementById("feet").value);
  const heightInches = parseFloat(document.getElementById("inches").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const diet = document.getElementById("diet").value;

  return new Human(name, weight, heightFeet * 12 + heightInches, diet);
}

// Build grid item
function buildGridItem(species, imageUrl, fact) {
  const gridItem = document.createElement("div");
  gridItem.classList.add("grid-item");

  const title = document.createElement("h3");
  title.textContent = species;

  const image = document.createElement("img");
  image.src = imageUrl;

  const factText = document.createElement("p");
  factText.textContent = fact;

  gridItem.appendChild(title);
  gridItem.appendChild(image);
  gridItem.appendChild(factText);

  return gridItem;
}

// On button click, prepare and display infographic
document.querySelector("#btn").addEventListener("click", () => {
  const human = getHuman();
  document.querySelector("#dino-compare").style.display = "none";

  dinos.forEach((dino, index) => {
    dino.updateFact(dino.compareDiet(human.diet));
    dino.updateFact(dino.compareHeight(human.height));
    dino.updateFact(dino.compareWeight(human.weight));

    let fact = dino.randomFact();
    if (dino.weight < 1) {
      fact = "All birds are Dinosaurs";
    }

    const gridItem = buildGridItem(dino.species, dino.image, fact);
    document.getElementById("grid").appendChild(gridItem);

    if (index == 3) {
      const humanItem = buildGridItem(human.species, human.image, 'YOU');
      document.getElementById("grid").appendChild(humanItem);
    }
  });
});
