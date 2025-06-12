function limparCPF(cpf) {
  return cpf.replace(/\D/g, '');
}

const API_URL = 'http://56.124.38.84:8088';
console.log("Script.js carregado com sucesso.");

// Torna a função global para ser usada no HTML
window.carregarImagem = function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const output = document.getElementById('preview-avatar');
    if (output) output.src = reader.result;
  };
  reader.readAsDataURL(file);

  const formData = new FormData();
  formData.append('foto_perfil', file);
  formData.append('id', localStorage.getItem('userID'));

  fetch(`${API_URL}/upload_foto`, {
    method: 'POST',
    body: formData
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('Upload bem-sucedido:', data);
      if (data.foto) {
        document.getElementById('preview-avatar').src = data.foto;
        localStorage.setItem('userFoto', data.foto);
      } else {
        alert('Upload realizado, mas nenhum link de imagem foi retornado.');
      }
    })
    .catch((error) => {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao enviar imagem');
    });
};

document.addEventListener('DOMContentLoaded', function () {
  const userId = localStorage.getItem('userID');
  const fotoSalva = localStorage.getItem('userFoto');
  const previewAvatar = document.getElementById('preview-avatar');

  if (userId && previewAvatar && window.location.pathname.includes('perfil.html')) {
    fetch(`${API_URL}/usuario?id=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const user = data[0];
          const nomeSpan = document.getElementById('profileHeaderName');
          const cpfSpan = document.getElementById('profileDetailCPF');
          if (nomeSpan) nomeSpan.textContent = user.nome_completo;
          if (cpfSpan) cpfSpan.textContent = user.cpf;
          if (previewAvatar) previewAvatar.src = user.foto_perfil || 'Perfil.png';
        } else {
          alert("Erro ao carregar dados do usuário.");
        }
      })
      .catch(err => console.error("Erro ao buscar perfil:", err));
  } else if (fotoSalva && previewAvatar) {
    previewAvatar.src = fotoSalva;
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const searchButton = document.querySelector('.search-button');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (mobileNav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        menuToggle.setAttribute('aria-label', 'Fechar menu');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener('click', function () {
      window.location.href = 'procurar_carona.html';
    });
  }

  document.addEventListener('click', function (event) {
    if (mobileNav && mobileNav.classList.contains('active')) {
      const isClickInsideNav = mobileNav.contains(event.target);
      const isClickOnToggle = menuToggle && menuToggle.contains(event.target);

      if (!isClickInsideNav && !isClickOnToggle) {
        mobileNav.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
          menuToggle.setAttribute('aria-label', 'Abrir menu');
        }
      }
    }
  });

  const form = document.getElementById('findRideForm');
  const searchResults = document.querySelector('.search-results');
  const mapaDiv = document.getElementById('mapa');

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.parentElement.style.display = 'none';
      if (searchResults) searchResults.style.display = 'none';
      const backLink = document.querySelector('.back-link');
      if (backLink) backLink.style.display = 'none';

      if (mapaDiv) {
        mapaDiv.classList.remove('hidden');
        mapaDiv.innerHTML = `
          <iframe
            width="100%"
            height="400"
            frameborder="0"
            style="border:0"
            src="https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=-23.55052,-46.633308&zoom=12"
            allowfullscreen>
          </iframe>
        `;
      }
    });
  }

  const btnPassageiro = document.getElementById("btnPassageiro");
  const btnCondutor = document.getElementById("btnCondutor");
  const formPassageiro = document.getElementById("form-passageiro");
  const formCondutor = document.getElementById("form-condutor");

  if (btnPassageiro && formPassageiro && formCondutor) {
    btnPassageiro.addEventListener("click", () => {
      formCondutor.classList.add("hidden");
      formPassageiro.classList.remove("hidden");
    });
  }

  if (btnCondutor && formPassageiro && formCondutor) {
    btnCondutor.addEventListener("click", () => {
      formPassageiro.classList.add("hidden");
      formCondutor.classList.remove("hidden");
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const cpf = limparCPF(document.getElementById('cpfLogin').value);
      const senha = document.getElementById('passwordLogin').value;

      try {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cpf, senha })
        });

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          alert('Login bem-sucedido!');
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userCPF', cpf);
          localStorage.setItem('userNome', data[0].nome_completo || '');
          localStorage.setItem('userID', data[0].id);
          const fotoPerfil = data[0].foto_perfil;
          if (fotoPerfil) {
            localStorage.setItem('userFoto', fotoPerfil);
          } else {
            localStorage.removeItem('userFoto');
          }
          window.location.href = 'perfil.html';
        } else {
          alert('CPF ou senha incorretos.');
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro de conexão com o servidor.');
      }
    });
  }


 const cadastroFormPassageiro = document.getElementById('cadastroFormPassageiro');
if (cadastroFormPassageiro) {
  cadastroFormPassageiro.addEventListener('submit', async function (event) {
    event.preventDefault();

    const cpf = limparCPF(document.getElementById('cpfPassageiro').value);
    const senha = document.getElementById('passwordPassageiro').value;
    const confirmarSenha = document.getElementById('confirmPasswordPassageiro').value;

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    const universidade = document.getElementById('universityPassageiro').value;
    const nome = document.getElementById('fullNamePassageiro').value;
    const email = document.getElementById('emailPassageiro').value;
    const curso = document.getElementById('coursePassageiro').value;

    const payload = {
      cpf,
      senha,
      tipo: 'passageiro',
      cidade: universidade,
      nome_completo: nome,
      email,
      curso
    };

    try {
      const response = await fetch(`${API_URL}/incluirusuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get('Content-Type');

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        alert(data.message || 'Cadastro realizado com sucesso!');
        window.location.href = 'login.html';
      } else {
        const text = await response.text();
        throw new Error('Resposta inesperada do servidor: ' + text);
      }

    } catch (error) {
      console.error('Erro ao cadastrar passageiro:', error);
      alert('Erro ao tentar cadastrar passageiro.');
    }
  });
}



const cadastroFormCondutor = document.getElementById('cadastroFormCondutor');
if (cadastroFormCondutor) {
  cadastroFormCondutor.addEventListener('submit', async function (event) {
    event.preventDefault();

    const cpf = limparCPF(document.getElementById('cpfCondutor').value);
    const senha = document.getElementById('passwordCondutor').value;
    const confirmarSenha = document.getElementById('confirmPasswordCondutor').value;

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    const universidade = document.getElementById('universityCondutor').value;
    const nome = document.getElementById('fullNameCondutor').value;
    const email = document.getElementById('emailCondutor').value;
    const curso = document.getElementById('courseCondutor').value;
    const cnh = document.getElementById('cnh').value;
    const cnhValidade = document.getElementById('cnhValidade').value;
    const placa = document.getElementById('placa').value;
    const modelo = document.getElementById('modelo').value;
    const cor = document.getElementById('cor').value;
    const vagas = document.getElementById('vagas').value;

    const payload = {
      cpf,
      senha,
      tipo: 'Condutor',
      cidade: universidade,
      nome_completo: nome,
      email,
      curso,
      cnh,
      cnh_validade: cnhValidade,
      placa,
      modelo,
      cor,
      vagas: parseInt(vagas)
    };

    try {
      const response = await fetch(`${API_URL}/incluirusuario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get('Content-Type');

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        alert(data.message || 'Cadastro realizado com sucesso!');
        window.location.href = 'login.html';
      } else {
        const text = await response.text();
        throw new Error('Resposta inesperada do servidor: ' + text);
      }

    } catch (error) {
      console.error('Erro ao cadastrar condutor:', error);
      alert('Erro ao tentar cadastrar condutor.');
    }
  });
}






  const uploadForm = document.getElementById('uploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const formData = new FormData(uploadForm);

      try {
        const response = await fetch(`${API_URL}/upload_foto`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro no upload: ${errorText}`);
        }

        const data = await response.json();
        console.log('Upload bem-sucedido:', data);

        if (data.foto) {
          document.getElementById('preview-avatar').src = data.foto;
          localStorage.setItem('userFoto', data.foto);
        } else {
          alert('Upload realizado, mas nenhum link de imagem foi retornado.');
        }
      } catch (error) {
        console.error('Erro ao enviar imagem:', error);
        alert('Erro ao fazer upload da imagem.');
      }
    });
  }
});
