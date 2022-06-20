const cargarDatos = () => {
  fetch("https://dataserverdaw.herokuapp.com/escritores/xml")
    .then(res => res.text())
    .then(data => {
      const xml = new DOMParser().parseFromString(data, "application/xml");

      const escritores = xml.getElementsByTagName("escritor");
      Array.from(escritores).forEach(esc => {
        const id = esc.querySelector("id").textContent;
        const nombre = esc.querySelector("nombre").textContent;
        const escritor = `<option value="${id}">${nombre}</option>`;

        document.querySelector("select").innerHTML += escritor;
      });

      document.querySelector("select")
        .addEventListener("change", ev => {
          document.querySelector("#frases").innerHTML = "";
          fetch("https://dataserverdaw.herokuapp.com/escritores/frases")
            .then(res => res.json())
            .then(data => {
              Array.from(escritores)
                .filter(esc => ev.target.value == esc.querySelector("id").textContent)
                .forEach(esc => {
                  data.frases
                    .filter(fr => fr.id_autor == ev.target.value)
                    .forEach(fr => {
                      const fraseHTML = `
                        <div class="col-lg-3">
                          <div class="test-inner">
                            <div class="test-author-thumb d-flex">
                              <div class="test-author-info">
                                <h4>${esc.querySelector("nombre").textContent}</h4>
                              </div>
                            </div>
                            <span>${fr.texto}</span>
                            <i class="fa fa-quote-right"></i>
                          </div>
                        </div>`;

                      document.querySelector("#frases").innerHTML += fraseHTML;
                    });
                });
            });
        })
    })
    .catch(err => console.log(err));
}

window.addEventListener('DOMContentLoaded', () => {
  cargarDatos();
  alert("DOM cargado.");
});
