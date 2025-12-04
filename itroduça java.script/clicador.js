let qtdCliques = 10000;

function handleClick() {
  qtdCliques++;
  atualizaContador();
}

function atualizaContador() {
  let container = document.getElementById("quantidade-cliques");
  console.log(container);
  container.innerText = qtdCliques;
}

let segundos = 0;

function cronometro() {
  setTimeout(() => {
    calculaCliquesporminuto();
    cronometro();
  }, 1000);
}
