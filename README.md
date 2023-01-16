<p align="middle">
  <img src="https://www.rifos.org/assets/img/logo.svg" alt="logo" height="100" >
</p>
<h3 align="middle"><code>@rsksmart/rif-wallet</code></h3>
<p align="middle">
  RIF Wallet
</p>
<p align="middle">
  <a href="https://github.com/rsksmart/rif-wallet/actions/workflows/ci.yml" alt="ci">
    <img src="https://github.com/rsksmart/rif-wallet/actions/workflows/ci.yml/badge.svg" alt="ci" />
  </a>
  <a href="https://lgtm.com/projects/g/rsksmart/rif-wallet/context:javascript">
    <img src="https://img.shields.io/lgtm/grade/javascript/github/rsksmart/rif-wallet" />
  </a>
  <a href='https://coveralls.io/github/rsksmart/rif-wallet?branch=main'>
    <img src='https://coveralls.io/repos/github/rsksmart/rif-wallet/badge.svg?branch=main' alt='Coverage Status' />
  </a>
  <a href="https://badge.fury.io/js/%40rsksmart%2Frif-wallet">
    <img src="https://badge.fury.io/js/%40rsksmart%2Frif-wallet.svg" alt="npm" />
  </a>
</p>

## Packages

- `@rsksmart/abi-enhancer` - ABI Enhancer - under development
- `@rsksmart/rif-wallet-kms` - Key Management System - under development
- `@rsksmart/rif-wallet` - RIF Wallet Library
- `@rsksmart/rif-wallet-services` - Sockets connecter between app and the server - under development
- `@rsksmart/rif-wallet-e2e` - some e2e tests - under development
- `@rsksmart/token` (not published) - under development
- `@rsksmart/rif-wallet-types` (not published) - commmon interfaces and types
- `@rsksmart/wallet-adapters` (not published)

## Run for development

Install dev dependencies:

```
npm i
```

Install peer dependencies:

```
npm run setup
```

### Run tests

Run a local Ganache blockahin in a different terminal with:

```
npm run ganache
```

Then, run tests with

```
npm test
```

Watch mode:

```
npm run test:watch
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
