# Simples API do TMDB

Descrição
- Pequena interface front-end que consome a API do The Movie Database (TMDB) para pesquisar e mostrar detalhes de filmes.

![Index Mobile](assets/imgs%20readme/index-mobile.png)
![Pesquisa Desktop](assets/imgs%20readme/pesquisa-desktop.png)

Estrutura do projeto
- `index.html` — Página principal.
- `pages/pesquisa.html` — Página de pesquisa.
- `pages/descricao.html` — Página de descrição/detalhes do filme.
- `js/index.js`, `js/pesquisa.js`, `js/descricao.js` — Lógica JavaScript do projeto.
- `css/style.css` — Estilo do projeto.
- `assets/` — Imagens e outros recursos estáticos.

Requisitos
- Navegador moderno (Chrome, Edge, Firefox).
- Chave de API do TMDB (opcional: usada para realizar requisições reais à API).

Instalação e execução
- Abrir localmente:
  - Basta abrir `index.html` no navegador (arrastar para a janela do navegador).
  - Ou, abra `http://localhost:8000` no navegador.
  - Ou use uma extensão/servidor estático como `Live Server` do VS Code.

Uso
- Acesse a página de pesquisa (`pages/pesquisa.html` ou via links no `index.html`).
- Pesquise por títulos e clique em um resultado para ver a página de descrição.