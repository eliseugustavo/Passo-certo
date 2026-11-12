// PROTÓTIPO LOCAL: altere estas credenciais diretamente neste arquivo.
const USUARIO_ADMIN = "admin";
const SENHA_ADMIN = "123456";
const CHAVE_TUTORIAIS = "pc_tutoriais";
const CHAVE_SESSAO = "pc_admin_logado";

function carregarTutoriais() {
  try {
    const salvos = localStorage.getItem(CHAVE_TUTORIAIS);
    if (salvos) return JSON.parse(salvos);
  } catch (erro) { console.error(erro); }
  return JSON.parse(JSON.stringify(window.TUTORIAIS_INICIAIS || []));
}
function salvarTutoriais(lista) {
  localStorage.setItem(CHAVE_TUTORIAIS, JSON.stringify(lista));
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;
    if (usuario === USUARIO_ADMIN && senha === SENHA_ADMIN) {
      sessionStorage.setItem(CHAVE_SESSAO, "1");
      window.location.href = "painel.html";
    } else {
      document.getElementById("erro").textContent = "Usuário ou senha incorretos.";
    }
  });
}

const painel = document.getElementById("formTutorial");
if (painel) {
  if (sessionStorage.getItem(CHAVE_SESSAO) !== "1") window.location.replace("admin.html");
  let tutoriais = carregarTutoriais();
  let selecionado = tutoriais.length ? tutoriais[0].id : null;
  const $ = (id) => document.getElementById(id);
  const linhas = (valor) => (valor || []).join("\n");
  function mostrarLista() {
    $("listaTutoriais").innerHTML = "";
    tutoriais.forEach((t) => {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "tutorial-item" + (t.id === selecionado ? " active" : "");
      const nome = document.createElement("strong"); nome.textContent = t.t;
      const trilha = document.createElement("small"); trilha.textContent = ["Primeiros passos", "No dia a dia", "Com mais cuidado"][t.l] || "Tutorial";
      botao.append(nome, trilha);
      botao.addEventListener("click", () => { selecionado = t.id; preencherFormulario(); mostrarLista(); });
      $("listaTutoriais").appendChild(botao);
    });
  }
  function preencherFormulario() {
    const t = tutoriais.find(x => x.id === selecionado);
    $("formTutorial").reset();
    if (!t) {
      $("tituloFormulario").textContent = "Novo tutorial";
      $("id").value = ""; $("duracao").value = 2; $("excluir").hidden = true;
      return;
    }
    $("tituloFormulario").textContent = "Editar tutorial";
    $("id").value = t.id; $("titulo").value = t.t || ""; $("descricao").value = t.d || "";
    $("categoria").value = String(t.l ?? 0); $("duracao").value = t.m || 2; $("youtube").value = t.youtube || "";
    $("passos").value = linhas(t.s); $("cuidados").value = linhas(t.safe); $("excluir").hidden = false;
    $("mensagem").textContent = "";
  }
  $("novo").addEventListener("click", () => { selecionado = null; mostrarLista(); preencherFormulario(); });
  $("formTutorial").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const titulo = $("titulo").value.trim();
    const passos = $("passos").value.split("\n").map(x => x.trim()).filter(Boolean);
    if (!titulo || !passos.length) { $("mensagem").textContent = "Informe o título e pelo menos um passo."; return; }
    const idExistente = $("id").value;
    const id = idExistente || ("tutorial-" + Date.now());
    const tutorial = { id, l: Number($("categoria").value), t: titulo, d: $("descricao").value.trim(), youtube: $("youtube").value.trim(), m: Number($("duracao").value), s: passos };
    const cuidados = $("cuidados").value.split("\n").map(x => x.trim()).filter(Boolean);
    if (cuidados.length) tutorial.safe = cuidados;
    if (idExistente) tutoriais = tutoriais.map(t => t.id === id ? tutorial : t);
    else { tutoriais.push(tutorial); selecionado = id; }
    salvarTutoriais(tutoriais); mostrarLista(); preencherFormulario();
    $("mensagem").textContent = "Tutorial salvo neste navegador!";
  });
  $("excluir").addEventListener("click", () => {
    if (!selecionado || !confirm("Deseja realmente excluir este tutorial?")) return;
    tutoriais = tutoriais.filter(t => t.id !== selecionado); selecionado = tutoriais[0]?.id || null;
    salvarTutoriais(tutoriais); mostrarLista(); preencherFormulario();
    $("mensagem").textContent = "Tutorial excluído.";
  });
  $("sair").addEventListener("click", () => { sessionStorage.removeItem(CHAVE_SESSAO); window.location.href = "admin.html"; });
  mostrarLista(); preencherFormulario();
}
