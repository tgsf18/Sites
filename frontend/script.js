async function converter() {
    const valor = document.getElementById("valor").value;
    const de = document.getElementById("de").value;
    const para = document.getElementById("para").value;

    const resposta = await fetch(`http://localhost:8080/converter?valor=${valor}&de=${de}&para=${para}`);
    const resultado = await resposta.text();

    document.getElementById("resultado").innerHTML = resultado;
}