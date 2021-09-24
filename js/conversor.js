var resultado;

$.ajax({
  type: "GET",
  dataType: "JSON",
  url: "https://economia.awesomeapi.com.br/json/all",
  success: function (data) {
    resultado = data
  },
  error: function (data) {
    alert('Erro! o site não conseguiu carregar os valores atuais da cotação. Tente novamente mais tarde. :(');
  }
});

// VAMOS LÁ!

function converter() {
  var euro = resultado["EUR"]["bid"]
  var dolar = resultado["USD"]["bid"]
  var iene = resultado["JPY"]["bid"]
  var btcoin = resultado["BTC"]["bid"]

  var num = document.querySelector("#valor").value;
  num = parseFloat(num);

  var calculo;

  var saida = document.querySelector("#saida");
  var moedaSelecionada = document.querySelector("#moedas").value;

  if (num <= 0) {
    alert("Valor inválido!")
  }

  if (moedaSelecionada == "EUR" && isNaN(num) == false) {
    calculo = num * euro
    num = num.toLocaleString('en-us', { style: 'currency', currency: 'EUR' });
    calculo = calculo.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    saida.innerHTML = `Resultado: ${num} equivale a ${calculo}`
    getAtualizacao("EUR")
  }

  if (moedaSelecionada == "USD" && isNaN(num) == false) {
    calculo = num * dolar
    num = num.toLocaleString('en-us', { style: 'currency', currency: 'USD' });
    calculo = calculo.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    saida.innerHTML = `Resultado: ${num} equivale a ${calculo}`
    getAtualizacao("USD")
  }

  if (moedaSelecionada == "JPY" && isNaN(num) == false) {
    calculo = num * iene
    num = num.toLocaleString('en-us', { style: 'currency', currency: 'JPY' });
    calculo = calculo.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    saida.innerHTML = `Resultado: ${num} equivale a ${calculo}`
    getAtualizacao("JPY")
  }

  if (moedaSelecionada == "BTC" && isNaN(num) == false) {
    btcoin = btcoin
    calculo = num * btcoin
    num = num.toLocaleString('en-us', { style: 'currency', currency: 'BTC' });
    calculo = calculo.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    saida.innerHTML = `Resultado: ${num} equivale a ${calculo}`
    getAtualizacao("BTC")
  }

}
