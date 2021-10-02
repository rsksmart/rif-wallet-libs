<p align="middle">
  <img src="https://www.rifos.org/assets/img/logo.svg" alt="logo" height="100" >
</p>
<h3 align="middle"><code>@rsksmart/rif-web-sdk-template</code></h3>
<p align="middle">
  RIF Web SDK Template
</p>
<p align="middle">
  <a href="https://github.com/rsksmart/rif-web-sdk-template/actions/workflows/ci.yml" alt="ci">
    <img src="https://github.com/rsksmart/rif-web-sdk-template/actions/workflows/ci.yml/badge.svg" alt="ci" />
  </a>
  <a href="https://developers.rsk.co/rif/templates/">
    <img src="https://img.shields.io/badge/-docs-brightgreen" alt="docs" />
  </a>
  <a href="https://lgtm.com/projects/g/rsksmart/rif-web-sdk-template/context:javascript">
    <img src="https://img.shields.io/lgtm/grade/javascript/github/rsksmart/rif-web-sdk-template" />
  </a>
  <a href='https://coveralls.io/github/rsksmart/rif-web-sdk-template?branch=main'>
    <img src='https://coveralls.io/repos/github/rsksmart/rif-web-sdk-template/badge.svg?branch=main' alt='Coverage Status' />
  </a>
  <a href="https://hits.seeyoufarm.com">
    <img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Frsksmart%2Frif-web-sdk-template&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false"/>
  </a>
  <!--
    <a href="https://badge.fury.io/js/%40rsksmart%2Frif-web-sdk-template">
      <img src="https://badge.fury.io/js/%40rsksmart%2Frif-web-sdk-template.svg" alt="npm" />
    </a>
  -->
</p>

## Features

- [Typescript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [ESLint](https://eslint.org/)
- [Webpack](https://webpack.js.org/)
- [CI in Github Actions](https://github.com/features/actions)
- [Coveralls](https://coveralls.io/)

## Usage

This repo is to be used as a tempalte. It has setup for the tools mentioned above, cinluding CircleCI flow

1. Create a new repo using this one as a template

  ![Update Shield URLs](../main/docs/use-template-button.jpeg)

2. Update the shields on the header to point your urls

  ![Update Shield URLs](../main/docs/update-badge-urls.jpeg)

3. Start coding!

## Run for development

Install dependencies:

```
npm i
```

### Run unit tests

```
npm test
```

Coverage report with:

```
npm run test:coverage
```

### Run linter

```
npm run lint
```

Auto-fix:

```
npm run lint:fix
```

### Build for production

```
npm run build
```
