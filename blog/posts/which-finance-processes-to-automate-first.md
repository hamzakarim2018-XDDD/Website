---
title: "Which Finance Processes Should You Automate First? A Simple Scoring Method"
date: "2026-11-22"
description: "Volume, rules, systems, pain and stability. A five-question scorecard for picking the finance or customer service process that will pay back fastest, and the ones to leave alone."
product: "automation"
---

The most common mistake in a first automation project isn't a technical one. It's picking the wrong process.

Teams usually start with whatever annoys the CFO most this month. Sometimes that's a good choice. Often it's a process that runs twelve times a year, depends on three people's judgment and changes every quarter, which is about the worst thing you can automate.

Here's the scorecard we use on process audits. It takes about ten minutes per process and it works for finance and customer service alike.

## The five questions

Score each process from 1 to 5 on each question.

### 1. How often does it happen?

Volume is the single biggest driver of payback. An automation costs roughly the same to build whether it runs 50 times a month or 5,000.

- **5:** Hundreds or thousands of times a month (invoices, payments, order lines, customer emails)
- **3:** Daily or weekly (bank recs, aging reports, vendor statement reviews)
- **1:** Monthly or less (most close tasks that only one person does)

### 2. Are the rules written down, or could they be?

If you can describe the process as "if this, then that" without saying "it depends" every second sentence, it's a good candidate.

- **5:** Clear rules. Match, tolerance, post. Reminder at 7, 14, 30 days.
- **3:** Mostly rules, with a handful of known exceptions
- **1:** Judgment calls throughout ("we look at the customer and decide")

Exceptions don't rule a process out. The automation can handle the 85% that follows the rules and route the rest to a person. But if *most* cases are exceptions, you're automating the wrong thing.

### 3. How many systems does it touch?

Counterintuitively, more systems often means a *better* candidate. The work that eats hours is usually the copying between them: the bank portal into Excel, Excel into the ERP, the ERP into an email.

- **5:** Three or more systems with copy-paste between them
- **3:** Two systems
- **1:** All inside one system that already has its own automation features you aren't using

That last point matters. Before building anything, check whether your ERP already does it. SAP, NetSuite, Dynamics and even QuickBooks all have built-in recurring entries, bank rules and approval workflows that teams often haven't switched on.

### 4. How much does it hurt when it goes wrong?

Pain is about errors and delays, not just hours.

- **5:** Errors cost real money (duplicate payments, missed early-payment discounts, late fees, customers on credit hold getting shipped)
- **3:** Errors cause rework and annoyed colleagues
- **1:** Errors are caught easily and don't matter much

### 5. Is the process stable?

If the process is about to change, automating it now means paying twice.

- **5:** It has worked the same way for a year or more and nothing is planned
- **3:** Minor changes expected
- **1:** ERP migration, new approval policy or restructure on the way

## Reading the score

Add up the five scores.

- **20 to 25:** Strong first candidate. This is usually AP invoice entry, cash application, bank reconciliation, order entry or shared-inbox triage.
- **14 to 19:** Worth doing, probably second or third. Often fine once a simpler process has proven the approach.
- **Under 14:** Leave it, or fix the process first. Automating a messy process gives you a fast messy process.

## The processes that usually score highest

From what we see in mid-sized finance and customer service teams, these come up near the top again and again:

- **Supplier invoice processing.** High volume, clear matching rules, multiple systems. See our [accounts payable automation guide](post.html?slug=accounts-payable-automation-guide).
- **Cash application.** Matching bank receipts to open invoices. Painful when remittances are vague, which is exactly where AI reading helps. See [cash application and collections automation](post.html?slug=cash-application-and-collections-automation).
- **Bank and card reconciliations.** Daily, rule-based, and they make the close faster when done continuously. See [how to automate bank reconciliations](post.html?slug=how-to-automate-bank-reconciliations).
- **Customer requests for invoice copies, statements and order status.** High volume, low judgment, and the answer already exists in your ERP. See [automating the shared inbox](post.html?slug=automating-the-customer-service-shared-inbox).
- **Sales order entry from emailed POs.** Same shape as AP, just on the other side of the ledger.

## The processes that usually score lowest

- Year-end tasks and anything annual
- Processes where the person doing it says "I just know" more than once
- Anything mid-migration
- Reporting that leadership asks for in a different format every month

## Do the maths before anyone builds anything

A rough payback number is worth having before you commit. The formula is simple:

> Monthly hours spent × fully loaded hourly cost × share of volume the automation can handle = monthly saving

Compare that against the build cost and the monthly support cost. If the saving doesn't cover the build within a year, it's either the wrong process or the wrong price.

Be honest about the "share of volume" number. Nobody automates 100%. If 30% of invoices arrive without a PO number, those still go to a person.

## If you'd rather not score it alone

This is exactly what our free process audit covers. You walk us through one process on a 30-minute call, we score it with you, and tell you straight whether it's worth automating. If it isn't, we'll say so.
