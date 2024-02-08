function redirect(idTabeli) {
  var tabela = document.getElementById(idTabeli);
  if (tabela) {
    tabela.scrollIntoView({ behavior: 'smooth' });
  }
}
