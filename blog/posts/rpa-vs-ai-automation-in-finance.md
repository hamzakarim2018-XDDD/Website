---
title: "RPA vs. AI Automation in Finance: Which One Does What"
date: "2026-11-22"
description: "RPA follows rules. AI reads the messy stuff. A plain explanation of where each one belongs in a finance or client service process, and why most real projects use both."
product: "automation"
---

Every vendor in this space now says "AI-powered", which makes it hard to tell what you're actually buying. So here is the distinction we use with clients, in the terms a controller or an AP lead would use.

**RPA (robotic process automation) does what a person does at a keyboard, following fixed rules.** It logs into your ERP, opens a screen, copies a value from a spreadsheet, pastes it into a field, clicks Save. It does the same thing every time. It doesn't get tired at 5pm on day three of the close, and it doesn't fat-finger a vendor number.

**AI handles the parts of the job that aren't fixed.** Reading an invoice in a layout it hasn't seen before. Working out whether an email from a customer is asking for a statement, disputing a charge, or both. Matching a remittance that says "INV 4471 + 4478 less credit" to the right open items.

Neither one is better. They do different jobs, and most processes in finance need both.

## A worked example: one supplier invoice

Take a single invoice arriving in your AP inbox and follow it through.

1. **The email arrives with a PDF attached.** A rule can pick it up from the shared mailbox and save the attachment. That's RPA, or even a plain mailbox rule.
2. **Someone needs to read the PDF.** Supplier name, invoice number, date, PO number, line items, VAT, total. Every supplier lays this out differently, some send scans, some send three invoices in one file. This is where AI earns its place: a document model extracts the fields and tells you how confident it is about each one.
3. **The invoice gets matched to the PO and the goods receipt.** This is rules. Quantity matches or it doesn't. Price is within tolerance or it isn't. You want this to be boring and predictable, so it should be RPA or plain code, not a model making judgment calls.
4. **The invoice gets posted in the ERP.** Rules again. A bot (or an API call, if your ERP has a good one) creates the document with the right GL coding and attaches the PDF.
5. **Anything that doesn't match goes to a person**, with the reason attached: "PO 88213 was for 40 units, invoice is for 44."

Out of five steps, AI does one. That's typical, and it's how it should be. You want the model reading documents, not deciding what gets posted to the ledger.

## Where RPA alone falls over

Classic RPA projects from the late 2010s had a reputation for being brittle, and the reputation was earned. The usual failure points:

- **Unstructured inputs.** Bots were good at moving data between screens but couldn't read a PDF unless every supplier used the same template. So someone still had to key the invoice into a spreadsheet for the bot to pick up, which defeated the purpose.
- **Screen changes.** A bot that clicks on "the third button from the left" breaks when your ERP gets an update and the button moves. Good builds use stable selectors and APIs where they exist. Cheap builds don't.
- **No one owns it after go-live.** The consultant leaves, the bot breaks six months later, and the team quietly goes back to doing it by hand.

AI fixed the first problem. The second and third are about how the automation is built and maintained, which no amount of AI changes.

## Where AI alone falls over

The opposite mistake is now more common: pointing a language model at a process and asking it to "handle AP". The problems:

- **It's not deterministic.** Run the same input twice and you can get different outputs. That's fine for drafting an email. It isn't fine for a journal entry your auditor will sample.
- **It's hard to explain afterwards.** "The model decided" is not an answer an auditor accepts. A rule ("posted because PO, receipt and invoice matched within 2% tolerance") is.
- **Errors look confident.** A model that misreads a total doesn't flag it. You need validation rules around it anyway, which brings you back to RPA and plain logic.

## How we split it on real projects

A rule of thumb that holds up well:

| Step in the process | Use |
|---|---|
| Reading documents, emails, free text | AI, with confidence scores |
| Classifying requests by type | AI, with a fallback to a person |
| Matching, validating, calculating | Rules (RPA or code) |
| Posting to the ERP or sending money | Rules, always, with an audit log |
| Drafting a reply to a customer | AI, reviewed or within strict templates |
| Deciding what to do with exceptions | A person |

The result is a process where AI turns messy inputs into clean data, rules do the work, and people handle the cases that actually need judgment.

## Questions to ask any vendor

If someone is pitching you "AI automation" for finance, these questions separate the serious ones quickly:

- What happens when the model isn't sure? Where does that case go, and who sees it?
- Which steps are rule-based, and which use a model?
- Can I see a log of every action the automation took, and why?
- Who fixes it when our ERP is upgraded or a screen changes?
- What does it do with a document it has never seen before?

If the answers are vague, the build will be too.

## Where to start

If you're not sure which of your processes would suit RPA, AI or both, the [guide to choosing which finance processes to automate first](post.html?slug=which-finance-processes-to-automate-first) walks through a simple scoring method. Or book a free process audit and we'll look at one of your processes with you.
