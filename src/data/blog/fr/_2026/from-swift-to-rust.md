---
pubDatetime: 2026-03-23T08:54:19.693Z
title: De Swift à Rust
slug: from-swift-to-rust
featured: false
tags:
  - Swift
  - Rust
description: "Retour d'expérience sur mon apprentissage des bases de Rust."
lang: "fr"
---

## 1. Introduction

Ces derniers mois, j'ai ressenti le besoin d'apprendre quelque chose de nouveau. Utilisant beaucoup Claude Code au travail, je me suis dit qu'il m'était primordial de refaire travailler ma matière grise. N'ayant que des compétences en applications mobiles iOS, je me suis plusieurs fois par le passé dit que je devrais me mettre au développement backend, sans réelle ambition.

Récemment, j'ai eu envie d'explorer la blockchain. Après avoir maigrement sollicité l'IA (je n'ai aucune connaissance dans le domaine), deux choix se posaient :

- Aller du côté d'Ethereum avec le langage Solidity.
- Aller du côté de Solana avec le langage Rust.

Solidity permettant de ne faire que de la blockchain et pas autre chose, j'aurais l'impression de me tirer une balle dans le pied. À l'inverse, Rust semble polyvalent et pourrait m'ouvrir des portes en termes de carrière et projets personnels. Bref, j'ai vite compris que ce dernier pourrait être un complément à mon écosystème iOS.

## Phase d'apprentissage de Rust

J'ai passé mes soirées durant 2 à 3 semaines, à lire "[The Rust Book](https://doc.rust-lang.org/book/)" et je dois dire que l'apprentissage de Rust peut être déroutant, surtout pour quelqu'un qui, il faut le dire, utilise un langage simple (Swift) au quotidien.

### Ce qui m'est familier

- L'inférence de type.
- Les enums avec associated values.
- Les variables optionnelles.
- Le pattern matching.
- Le concept des macros (je dis "concept" n'ayant jamais créé de macros en Swift).

```swift
// Swift
enum Transaction {
    case transfer(from: String, to: String, amount: Double)
    case stake(amount: Double)
    case failed(reason: String)
}

let tx = Transaction.transfer(from: "Lancelot", to: "Siegfried", amount: 1.5)

switch tx {
case .transfer(_, _, let amount) where amount > 1.0:
    print("Grosse transaction : \(amount) SOL")
case .failed(let reason):
    print("Échec : \(reason)")
default:
    break
}
```

```rust
// Rust
enum Transaction {
    Transfer { from: String, to: String, amount: f64 },
    Stake { amount: f64 },
    Failed { reason: String },
}

let tx = Transaction::Transfer {
    from: "Lancelot".to_string(),
    to: "Siegfried".to_string(),
    amount: 1.5,
};

match &tx {
    Transaction::Transfer { amount, .. } if *amount > 1.0 => {
        println!("Grosse transaction : {} SOL", amount);
    }
    Transaction::Failed { reason } => {
        println!("Échec : {}", reason);
    }
    _ => {}
}
```

### Ce qui m'est nouveau

- Les concepts de ownership, borrowing et références.
- Vérification des data races à la compilation et non pas au runtime.
- Les Smart pointers (Box, Rc, Arc), savoir quand utiliser lequel.

Je me suis promis de n'utiliser l'IA que pour m'expliquer et me réexpliquer les concepts encore trop flous aujourd'hui. Comprendre quel type écrit sur la heap plus que sur la stack, ou bien devient "owner" d'une variable ce qui empêche son utilisation plus loin dans le même scope, n'est pas toujours aisé.

Pour m'entraîner à côté, j'ai développé 3 scripts rudimentaires :

- Un convertisseur SOL <=> Lamport.
- Un parser de fichiers JSON via le crate Serde.
- Un simulateur d'instructions Solana via des structs et le crate Borsh.

Rien de bien complexe, mais mettre les mains à la pâte m'a fait du bien.

### Les prochaines étapes

Après avoir compris (je pense) les bases de Rust, je vais pouvoir m'atteler à la découverte de Solana et Anchor. À savoir : 

1 - Comprendre les [concepts fondamentaux](https://solana.com/docs/core) :

- Account model
- Program
- Transaction
- Lamports
- Rent

2 - Toucher à la CLI pour faire des transactions et les explorer via le [Solana Explorer](https://explorer.solana.com/?cluster=devnet)

3 - Apprendre le [framework Anchor](https://www.anchor-lang.com/docs) qui permet d'écrire des programs Solana en Rust.

4 - Créer un [token SPL](https://www.solana-program.com/docs/token) basique et comprendre les concepts de Mint, Token Account, Mint Authority, Freeze Authority.

5 - Avec Anchor, créer un program qui permet d'interagir avec le token précédemment créé.

6 - Créer une application iOS qui sert de Wallet et permet d'explorer les transactions effectuées.

## Conclusion

Apprendre un nouveau langage de programmation n'est pas toujours chose aisée, mais j'encourage quiconque à s'y mettre lorsqu'un peu d'ennui se fait ressentir dans son quotidien de développeur.

En étant toujours dans le même écosystème, j'avais l'impression de manquer d'idées, et parfois même un peu pris de lassitude. Je délègue mes tâches à l'IA trop souvent, ce qui me permet d'aller plus vite certes, mais à l'inverse, me retire ma capacité de réflexion. Perdre mes capacités de raisonnement, c'est une crainte que j'ai. Parce qu'à la base, coder c'est fun et c'est pour cela que je m'y suis mis. En ayant commencé l'apprentissage de Rust, je retrouve cette part de fun qui me manquait.
