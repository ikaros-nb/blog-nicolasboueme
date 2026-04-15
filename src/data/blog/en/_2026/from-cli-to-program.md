---
pubDatetime: 2026-04-16T00:05:00.000Z
title: "Learning Solana: from CLI to program"
slug: from-cli-to-program
featured: false
tags:
  - Anchor
  - Rust
  - Solana
  - blockchain
  - learning
description: "From my first CLI transfer to an Anchor vault deployed on Devnet. A look back at learning the basics of Solana."
lang: "en"
translationKey: "from-cli-to-program"
---

## Context

In [my previous article](/posts/from-swift-to-rust), I wrote about my first weeks with Rust and why I chose Solana. I had left off with a list of next steps. This article covers what came after: discovering Solana hands-on, from the CLI to writing my first Anchor program.

I don't pretend to understand Solana. Three weeks isn't enough for that. But this mini-project helped me grasp the surface-level concepts — and that's already a decent starting point.

## First steps with the CLI

Before writing any code, I spent time using Solana from the terminal. Creating two wallets, getting SOL on Devnet via the [Solana Faucet](https://faucet.solana.com/), then transferring SOL from one wallet to another.

```bash
solana transfer <WALLET_B> 1
```

The habit that taught me the most: opening every transaction on [Solana Explorer](https://explorer.solana.com/?cluster=devnet). You can see the accounts involved, the fees, the executed instructions. That's where Solana's model starts to take shape.

The core concept is the **Account model**. On Solana, everything is an account: a wallet, a token, a deployed program. An account is a chunk of memory with an owner and data. Once you internalize that, a lot of things click. Behind every transaction, there's an interaction between chunk of memorys (accounts) that authorize each other to mutate.

## Creating your own token

The next step was creating an SPL token. Still through the CLI, no code involved.

```bash
spl-token create-token          # Creates the Mint
spl-token create-account <MINT> # Creates a Token Account
spl-token mint <MINT> 1000      # Mints 1000 tokens
spl-token transfer <MINT> 100 <DEST> --fund-recipient
```

Three concepts to remember:

- **Mint**: the mold for the token. You're creating "the dollar" — the concept itself. A Mint defines the token's properties (decimals, total supply).
- **Token Account**: the account that holds tokens of a given type for a wallet. A wallet can have multiple Token Accounts — one per type of token held.
- **Mint Authority**: the wallet allowed to create new tokens. Like only the Fed can print dollars.

At this point, you can work with tokens and understand the building blocks, but you haven't written a single line of code. Everything goes through standard programs provided by Solana (the SPL Token Program). The next step is writing your own.

## Moving to code: a vault with Anchor

A **vault** is an on-chain safe. The concept is straightforward: you can deposit tokens into it and withdraw them. But implementing it touches on almost everything specific to Solana: PDAs, CPIs, signature management.

[Anchor](https://www.anchor-lang.com/) is the standard framework for writing Solana programs in Rust. Without it, you have to manually handle serialization and account validation. With Anchor, you declare constraints and the framework takes care of the rest.

### The vault's data

```rust
#[account]
pub struct VaultState {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub bump: u8,
}
```

Three fields: who owns the vault (`owner`), which token it accepts (`mint`), and its `bump` — a technical detail related to PDAs that I'll explain in the next section.

### PDA: accounts without a private key

A **PDA** (Program Derived Address) is an address generated deterministically from "seeds" and the program's ID. Unlike a regular wallet, a PDA has no private key — only the program that created it can sign on its behalf. This is fundamental to Solana's security: no private key that can leak, just an address the program can recompute from its seeds to prove ownership.

This concept gave me trouble. I put `seeds` and a `bump` on the Mint in my deposit instruction, thinking it was a PDA from my program. In reality, the Mint is an external account created by the SPL Token Program — it has nothing to do with my program.

### Depositing tokens

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

The `Deposit` struct declares the accounts required by the instruction. The `payer` is the one depositing — it's a `Signer`, they must sign the transaction. The `vault` holds the safe's state, and the constraint `vault.mint == mint.key()` ensures the right type of token is being deposited. The `vault_token_account` is the vault's Token Account, derived as a PDA from seeds — it's the one receiving the tokens.

A mistake I made: in the deposit handler, I set `authority: payer_token_account` instead of `payer`. It's the **wallet** that authorizes the debit, not the token account. This follows the same Account model logic — a token account *belongs to* a wallet, it doesn't act on its own.

### Withdrawing tokens

The withdrawal structure is similar, but with a key difference: it's the **vault's PDA** that signs, not a user.

```rust
let signer_seeds: &[&[&[u8]]] = &[&[
    VAULT.as_bytes(), 
    ctx.accounts.payer.key.as_ref(),
    &[ctx.accounts.vault.bump]
]];
```

I made another mistake here: adding `signer_seeds` in the *deposit* handler. To understand why that's unnecessary, it comes down to a simple rule: whoever's tokens are being debited must authorize the operation.

In a deposit, tokens leave the **payer's** Token Account — a regular wallet with a private key. It signs the transaction, and that's enough. In a withdrawal, tokens leave the **vault's** Token Account — a PDA, with no private key. The program must then prove it controls that PDA by providing the seeds that generate it. That's exactly what `signer_seeds` does.

## Key takeaways

The real difficulty with Solana isn't the Rust code. It's understanding **who owns what** and **who signs what**. Every mistake I made came down to a confusion between these two questions.

The vault is a good first program because it touches on everything: PDAs, CPIs, SPL Token, signer seeds. It's small enough in scope to finish in a week, but rich enough to expose you to the real concepts.

The full program code is [available on GitHub](https://github.com/ikaros-nb/solana-token-vault).

Next step: an iOS app that interacts with this program. That's territory I know better — but the interface between Swift and Solana promises its own set of surprises.
