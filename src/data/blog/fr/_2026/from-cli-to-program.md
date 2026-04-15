---
pubDatetime: 2026-04-16T00:05:00.000Z
title: Apprendre Solana : de la CLI au program
slug: fr-from-cli-to-program
featured: false
tags:
  - Anchor
  - Rust
  - Solana
  - blockchain
  - learning
description: "Du premier transfert CLI à un vault Anchor déployé sur Devnet. Retour sur mon apprentissage des bases de Solana."
lang: "fr"
translationKey: "from-cli-to-program"
---

## Contexte

Dans [mon article précédent](/fr/posts/fr-from-swift-to-rust), je racontais mes premières semaines avec Rust et pourquoi j'avais choisi Solana. J'en étais resté à une liste d'étapes à suivre. Cet article couvre la suite : la découverte de Solana par la pratique, du CLI jusqu'à l'écriture de mon premier program Anchor.

Je ne prétends pas comprendre Solana. Trois semaines ne suffisent pas pour ça. Mais ce mini-projet m'a permis de saisir les concepts de surface — et c'est déjà un bon point de départ.

## Premiers pas avec le CLI

Avant d'écrire du code, j'ai passé du temps à manipuler Solana via le terminal. Créer deux wallets, m'envoyer des SOL sur Devnet via le [Faucet Solana](https://faucet.solana.com/), puis transférer des SOL d'un wallet à l'autre.

```bash
solana transfer <WALLET_B> 1
```

Le réflexe qui m'a le plus appris : ouvrir chaque transaction sur [Solana Explorer](https://explorer.solana.com/?cluster=devnet). On y retrouve les comptes impliqués, les frais, les instructions exécutées. C'est là que le modèle de Solana commence à prendre forme.

Le concept central, c'est le **modèle Account**. Sur Solana, tout est un compte : un wallet, un token, un program déployé. Un compte, c'est une zone mémoire avec un propriétaire et des données. Une fois qu'on intègre ça, beaucoup de choses s'éclairent. Derrière chaque transaction, il y a une interaction entre des zones mémoire (les comptes) qui s'autorisent mutuellement à muter.

## Créer son propre token

L'étape suivante, c'est de créer un token SPL. Toujours via le CLI, sans écrire de code.

```bash
spl-token create-token          # Crée le Mint
spl-token create-account <MINT> # Crée un Token Account
spl-token mint <MINT> 1000      # Émet 1000 tokens
spl-token transfer <MINT> 100 <DEST> --fund-recipient
```

Trois concepts à retenir :

- **Mint** : c'est le moule du token. On crée "l'euro", le concept en lui-même. Un Mint définit les propriétés du token (nombre de décimales, supply totale).
- **Token Account** : c'est le compte qui stocke les tokens d'un type donné pour un wallet. Un wallet peut avoir plusieurs Token Accounts — un par type de token détenu.
- **Mint Authority** : c'est le wallet qui a le droit de créer de nouveaux tokens. Comme seule la BCE peut imprimer des euros.

À ce stade, on manipule des tokens, on comprend les briques de base, mais on n'a écrit aucune ligne de code. Tout passe par des programs standards fournis par Solana (le SPL Token Program). L'étape suivante, c'est d'écrire le sien.

## Passer au code : un vault avec Anchor

Un **vault**, c'est un coffre-fort on-chain. Le concept est simple : on peut y déposer des tokens et les retirer. Mais l'implémenter touche à presque tout ce que Solana a de spécifique : les PDA, les CPI, la gestion des signatures.

[Anchor](https://www.anchor-lang.com/) est le framework standard pour écrire des programs Solana en Rust. Sans lui, il faut gérer manuellement la sérialisation et la validation des comptes. Avec Anchor, on déclare des contraintes et le framework fait le reste.

### Les données du vault

```rust
#[account]
pub struct VaultState {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub bump: u8,
}
```

Trois champs : qui possède le vault (`owner`), quel token il accepte (`mint`), et son `bump` — un détail technique lié aux PDA que j'explique juste après.

### PDA : des comptes sans clé privée

Un **PDA** (Program Derived Address), c'est une adresse générée de manière déterministe à partir de "seeds" et de l'identifiant du program. Contrairement à un wallet classique, un PDA n'a pas de clé privée — seul le program qui l'a créé peut signer pour lui. C'est la base de la sécurité sur Solana : pas de clé privée qui peut fuiter, juste une adresse que le program peut recalculer à partir des seeds pour prouver qu'il en est le propriétaire.

C'est un concept qui m'a posé problème. J'ai mis des `seeds` et un `bump` sur le Mint dans mon instruction de dépôt, pensant que c'était un PDA de mon program. En réalité, le Mint est un compte externe créé par le SPL Token Program — il n'a rien à voir avec mon program.

### Déposer des tokens

```rust
#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account()]
    pub vault: Account<'info, VaultState>,

    #[account(constraint = vault.mint == mint.key())]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    pub payer_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut, 
        seeds = [TOKEN.as_bytes(), vault.key().as_ref()],
        bump
    )]
    pub vault_token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>,
}
```

La struct `Deposit` déclare les comptes nécessaires à l'instruction. Le `payer` est celui qui dépose — c'est un `Signer`, il doit signer la transaction. Le `vault` contient l'état du coffre, et la contrainte `vault.mint == mint.key()` garantit qu'on dépose le bon type de token. Le `vault_token_account` est le Token Account du vault, dérivé par PDA à partir de seeds — c'est lui qui reçoit les tokens.

Erreur que j'ai faite : dans le handler du dépôt, j'ai mis `authority: payer_token_account` au lieu de `payer`. C'est le **wallet** qui autorise le débit, pas le token account.

### Retirer des tokens

La structure du retrait est similaire, mais avec une différence fondamentale : c'est le **PDA du vault** qui signe, pas un utilisateur.

```rust
let signer_seeds: &[&[&[u8]]] = &[&[
    VAULT.as_bytes(), 
    ctx.accounts.payer.key.as_ref(),
    &[ctx.accounts.vault.bump]
]];
```

J'ai fait une autre erreur ici : ajouter des `signer_seeds` dans le handler de *dépôt*. Pour comprendre pourquoi c'est inutile, il faut revenir à une règle simple : celui dont les tokens sont débités doit autoriser l'opération.

Dans un dépôt, les tokens sortent du Token Account du **payer** — un wallet classique avec une clé privée. Il signe la transaction, et ça suffit. Dans un retrait, les tokens sortent du Token Account du **vault** — un PDA, sans clé privée. Le program doit alors prouver qu'il contrôle ce PDA en fournissant les seeds qui le génèrent. C'est exactement le rôle des `signer_seeds`.

## Ce que j'en retiens

La vraie difficulté de Solana, ce n'est pas le code Rust. C'est comprendre **qui possède quoi** et **qui signe quoi**. Chaque erreur que j'ai faite revenait à une confusion entre ces deux questions.

Le vault est un bon premier program parce qu'il touche à tout : PDA, CPI, SPL Token, signer seeds. C'est un périmètre suffisamment petit pour être terminé en une semaine, mais suffisamment riche pour se confronter aux vrais concepts.

Le code complet du program est [disponible sur GitHub](https://github.com/ikaros-nb/solana-token-vault).

Prochaine étape : une app iOS qui interagit avec ce program. On entre dans un territoire que je connais mieux — mais l'interface entre Swift et Solana promet d'être son propre lot de surprises.
