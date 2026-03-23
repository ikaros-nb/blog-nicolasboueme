---
pubDatetime: 2026-03-23T08:54:19.693Z
title: From Swift to Rust
slug: from-swift-to-rust
featured: false
tags:
  - Swift
  - Rust
  - Solana
  - blockchain
  - learning
description: "A look back at my experience learning the basics of Rust."
lang: "en"
translationKey: "from-swift-to-rust"
---

## Introduction

Over the past few months, I felt the need to learn something new. Using Claude Code a lot at work, I figured it was essential to put my brain cells back to work. Having only experience in iOS mobile development, I had told myself several times in the past that I should get into backend development, without any real ambition.

Recently, I got curious about blockchain. After briefly consulting AI (I have zero knowledge in the field), two options came up:

- Go the Ethereum route with the Solidity language.
- Go the Solana route with the Rust language.

Since Solidity only allows you to do blockchain and nothing else, I would have felt like I was shooting myself in the foot. Rust, on the other hand, seems versatile and could open doors in terms of career and personal projects. In short, I quickly understood that it could complement my iOS ecosystem.

## Learning phase

I spent my evenings over 2 to 3 weeks reading "[The Rust Book](https://doc.rust-lang.org/book/)" and I have to say, learning Rust can be disorienting, especially for someone who, let's be honest, uses a simple language (Swift) on a daily basis.

### What felt familiar

- Type inference.
- Enums with associated values.
- Optionals.
- Pattern matching.
- The concept of macros (I say "concept" since I've never actually created macros in Swift).

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
    print("Large transaction: \(amount) SOL")
case .failed(let reason):
    print("Failed: \(reason)")
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
        println!("Large transaction: {} SOL", amount);
    }
    Transaction::Failed { reason } => {
        println!("Failed: {}", reason);
    }
    _ => {}
}
```

### What was new to me

- The concepts of ownership, borrowing and references.
- Data race checks at compile time rather than runtime.
- Smart pointers (Box, Rc, Arc), knowing when to use which.

I promised myself to only use AI to explain and re-explain concepts that are still too fuzzy for me. Understanding which type allocates on the heap versus the stack, or which one becomes the "owner" of a variable, preventing its use further down in the same scope, isn't always straightforward.

To practice on the side, I built 3 basic scripts:

- A SOL <=> Lamport converter.
- A JSON file parser using the Serde crate.
- A Solana instruction simulator using structs and the Borsh crate.

Nothing groundbreaking, but getting my hands dirty felt good.

### Next steps

Now that I've understood (I think) the basics of Rust, I can move on to exploring Solana and Anchor. Namely:

1 - Understand the [core concepts](https://solana.com/docs/core):

- Account model
- Program
- Transaction
- Lamports
- Rent

2 - Get hands-on with the CLI to make transactions and explore them via the [Solana Explorer](https://explorer.solana.com/?cluster=devnet)

3 - Learn the [Anchor framework](https://www.anchor-lang.com/docs) which allows writing Solana programs in Rust.

4 - Create a basic [SPL token](https://www.solana-program.com/docs/token) and understand the concepts of Mint, Token Account, Mint Authority, Freeze Authority.

5 - With Anchor, create a program that interacts with the previously created token.

6 - Build an iOS app that serves as a Wallet and allows exploring the transactions made.

## Conclusion

Learning a new programming language isn't always easy, but I encourage anyone to give it a shot when a bit of boredom creeps into their daily life as a developer.

Being stuck in the same ecosystem, I felt like I was running out of ideas, and sometimes even a bit weary. I delegate my tasks to AI too often, which lets me move faster for sure, but on the flip side, takes away my ability to think. Losing my reasoning skills is something I fear. Because at the end of the day, coding is fun and that's why I got into it. By starting to learn Rust, I'm rediscovering that sense of fun I was missing.
