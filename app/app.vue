<template>
  <div>
    <Modal v-if="modal?.show" />
    <NuxtLoadingIndicator color="#00fb9a" />
    <NuxtPage :class="modal?.show ? 'locked' : ''" />
  </div>
</template>

<script setup>
const modal = useState('modal');

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - William278.net` : 'Open source Minecraft server software & game projects - William278.net';
  },
  meta: [
    {
      name: 'description',
      content: 'Easily-accessible documentation and information site for all of William278\'s Minecraft plugins, projects & games'
    }
  ],
})
</script>

<!-- Global styles -->
<style>
:root {
  /* Colors */
  --accent: #00fb9a;
  --red: #ff4242;
  --white: #f5f5f5;
  --light-gray: #818181;
  --gray: #333333;
  --background: #222222;
  --dark-gray: #191919;
  --shadow: 0 0 0.75rem rgba(0, 0, 0, 0.1);

  /* DocSearch styling */
  --docsearch-footer-background: var(--gray) !important;
  --docsearch-footer-shadow: unset !important;
  --docsearch-highlight-color: rgba(255, 255, 255, .4) !important;
  --docsearch-hit-background: var(--gray) !important;
  --docsearch-hit-color: var(--white) !important;
  --docsearch-hit-shadow: unset !important;
  --docsearch-icon-color: rgba(255, 255, 255, .5) !important;
  --docsearch-key-gradient: linear-gradient(-225deg, var(--gray), var(--light-gray)) !important;
  --docsearch-key-shadow: inset 0 -2px 0 0 var(--gray), inset 0 0 1px 1px var(--gray), 0 1px 2px 1px var(--dark-gray) !important;
  --docsearch-logo-color: var(--accent) !important;
  --docsearch-modal-background: var(--dark-gray) !important;
  --docsearch-modal-shadow: inset 1px 1px 0 0 var(--background), 0 3px 8px 0 var(--dark-gray) !important;
  --docsearch-muted-color: rgba(255, 255, 255, .5) !important;
  --docsearch-searchbox-background: var(--dark-gray) !important;
  --docsearch-searchbox-focus-background: var(--gray) !important;
  --docsearch-searchbox-shadow: inset 0 0 0 2px var(--accent) !important;
  --docsearch-text-color: var(--white) !important;
  --docsearch-container-background: rgba(40, 40, 40, 0.85) !important;
  --docsearch-hit-active-color: unset !important;
}

/* Lock scrolling */
:root:has(.lock-scrolling) {
  overflow: hidden;
}

/* DocSearch button styles */
.DocSearch.DocSearch-Button {
  border-radius: 0.5rem;
}

.DocSearch-Search-Icon {
  color: var(--light-gray) !important;
  margin-right: 0.25rem;
}

@media (min-width: 800px) {
  .DocSearch.DocSearch-Button {
    width: 20vw;
    max-width: 200px;
  }

  .DocSearch-Search-Icon {
    margin-right: 0;
  }
}

@media (max-width: 500px) {
  .DocSearch-Button-Placeholder {
    display: block !important;
    font-size: 1.3rem !important;
    margin-left: 0.2rem;
  }

  #docsearch {
    width: 100% !important;
  }

  .DocSearch.DocSearch-Button {
    height: 2.75rem;
    margin-left: 0;
    width: 100%;
  }
}

/* Scrollbar style rules (font, bg color) */
html {
  color-scheme: dark;
}

body {
  font-family: 'Nunito', 'Open Sans', sans-serif;
  background-color: var(--background);
  color: var(--white);

  /* Disable margin and padding */
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* Line spacing */
p {
  line-height: 1.4rem;
}

ul,
ol {
  line-height: 1.4rem;
  margin-left: -1rem;
}

/* Default link styling */
a {
  text-underline-offset: 0.16rem;
  text-decoration: none;
  color: var(--accent);
}

a:hover {
  text-decoration: underline;
  filter: brightness(85%);
}

/* Disable SVG pointer events and fix coloring */
object {
  pointer-events: none;
  color-scheme: light;
}

/* Box shadow */
.shadow {
  box-shadow: var(--shadow);
}

/* Interactive images */
.hover-image:hover {
  filter: brightness(85%);
  cursor: pointer;
  transform: scale(1.025);
}

/* Heading anchor links and rules */
h1 {
  margin-top: 0;
  font-size: 1.8rem;
}

h1 a,
h2 a,
h3 a,
h4 a,
h5 a {
  color: inherit;
  text-decoration: none !important;
}

/* Remove heading list spacings */
h2+ul,
h3+ul,
h4+ul {
  margin-top: 0;
}

/* Horizontal rules */
hr {
  border: 0;
  border-top: 0.15rem solid var(--gray);
  margin: 1.5rem 0;
}

/* Article (markdown) content */
article {
  max-width: 85vw;
  margin: 0 auto;
  padding: 0;
}

article h1,
h2 {
  border-bottom: var(--gray) 0.125rem solid;
  padding-bottom: 0.25rem;
}

article img,
article object {
  max-width: 100%;
}

article pre {
  display: block;
  background-color: var(--dark-gray);
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0.5rem 0;
  overflow: auto !important;
  position: relative !important;
}

article pre code {
  overflow: auto;
  word-break: normal;
  word-wrap: normal;
  background-color: unset !important;
  padding: unset !important;
  border-radius: unset !important;
}

article table {
  display: block;
  overflow: auto !important;
  position: relative !important;
}

/* Tables */
table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  margin: 0.5rem 0;
  border-color: var(--gray);
}

table th,
table td {
  text-align: left;
  padding: 0.5rem;
  border: 0.15rem solid var(--gray);
}

table th {
  text-align: center;
  font-weight: bold;
  background-color: var(--dark-gray);
}

table td[align="center"],
table th[align="center"] {
  text-align: center;
}

table td[align="right"],
table th[align="right"] {
  text-align: right;
}

code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
}

code {
  background-color: var(--dark-gray);
  padding: 0.2rem;
  border-radius: 0.2rem;
}

/* Summary sections */
summary {
  cursor: pointer;
  outline: none;
}

details {
  margin: 0.5rem 0;
  border: var(--gray) 0.125rem solid;
  border-radius: 0.5rem;
  padding: 0.5rem;
}

details[open] summary {
  border-bottom: var(--gray) 0.125rem solid;
  padding-bottom: 0.4rem;
}

/* Blockquote */
blockquote {
  border-left: 0.175rem solid var(--gray);
  padding-left: 0.8rem;
  margin: 0.5rem 0 1rem 0;
}

/* Input controls */
button {
  padding: 0.5rem;
  font-size: 1rem;
  font-family: 'Nunito', sans-serif;
  border: 0.15rem solid var(--gray);
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.04);
  color: var(--accent);
  cursor: pointer;
  width: fit-content;
}

button.primary {
  background: var(--dark-gray);
  background: linear-gradient(transparent, #00fb9b1e);
}

button.red {
  color: var(--red);
}

label {
  font-size: 1rem;
  font-weight: 700;
  margin: 0.1;
}

input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
}

input,
textarea {
  padding: 0.5rem;
  font-size: 1rem;
  font-family: 'JetBrains Mono', monospace;
  border: 0.15rem solid var(--gray);
  border-radius: 0.5rem;
  box-sizing: border-box;
}

input,
textarea {
  padding: 0.5rem;
  font-size: 1rem;
  font-family: 'JetBrains Mono', monospace;
  border: 0.15rem solid var(--gray);
  background-color: var(--dark-gray);
  border-radius: 0.5rem;
  box-sizing: border-box;
}

input[type="color"] {
  -webkit-appearance: none;
  border: none;
  width: 50px !important;
  height: 50px !important;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
}

button[disabled] {
  background-color: var(--dark-gray);
  color: var(--light-gray);
  cursor: not-allowed;
}

button[disabled]:hover,
button[disabled]:hover.primary,
button[disabled].red:hover {
  background-color: var(--dark-gray) !important;
  border-color: var(--gray) !important;
}

button:hover {
  background-color: var(--dark-gray);
  border-color: var(--accent);
}

button.red:hover {
  border-color: var(--red) !important;
}

button.primary:hover {
  background: var(--dark-gray) !important;
}

select {
  /* Cross-browser compat styling */
  background: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHBvbHlnb24gY2xhc3M9ImNscy0yIiBwb2ludHM9IjEuNDEgNC42NyAyLjQ4IDMuMTggMy41NCA0LjY3IDEuNDEgNC42NyIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIzLjU0IDUuMzMgMi40OCA2LjgyIDEuNDEgNS4zMyAzLjU0IDUuMzMiLz48L3N2Zz4=) no-repeat 97% 60%;
  background-size: 1.2rem;
  -moz-appearance: none; 
  -webkit-appearance: none; 
  appearance: none;
  background-color: var(--dark-gray);

  width: 250px;
  max-width: 100%;
  padding: 0.3rem 0.4rem;
  font-size: 1rem;
  font-family: 'Nunito', sans-serif;
  border: 0.15rem solid var(--gray);
  border-radius: 0.5rem;
  box-sizing: border-box;
}

/* Loading placeholder animation */
@keyframes placeholder {
  0% {
      background-position: -468px 0
  }
  100% {
      background-position: 468px 0
  }
}

.pulsing {
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: placeholder;
  animation-timing-function: linear;
  background: var(--dark-gray);
  background: linear-gradient(to right, var(--gray) 15%, var(--dark-gray) 45%, var(--gray) 75%);
  background-size: 1000px 104px;
  position: relative;
  overflow: hidden;
  color: transparent;
  border-radius: 0.5rem;
}

/* Common sidebar rules */
.sidebar h2,
.sidebar h3,
.sidebar h4 {
  margin-bottom: 0;
}

/* Search */
.DocSearch-Button {
  padding: 0;
  font-family: inherit;
}

.DocSearch-Modal {
  font-family: "Nunito", sans-serif;
}

.DocSearch-Logo svg .cls-1,
.DocSearch-Logo svg .cls-2 {
  fill: var(--accent);
}

.DocSearch-Hit[aria-selected=true] mark,
.DocSearch-Hit-title mark,
.DocSearch-Hit mark {
  color: var(--accent) !important;
}

.DocSearch--active {
  overflow-y: hidden !important;
}
</style>