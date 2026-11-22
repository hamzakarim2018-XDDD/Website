---
title: "Automating the Shared Inbox: Order Status, Invoice Copies and Statement Requests"
date: "2026-11-22"
description: "Most emails to a B2B customer service team ask for something that already exists in your ERP. How to sort, answer and route them automatically, and keep people on the conversations that need them."
product: "automation"
---

Open any B2B customer service or credit control inbox and read the last hundred emails. You'll find the same handful of requests over and over:

- Where's my order?
- Can you resend invoice 40213?
- Can I have a statement of account?
- Please update our billing address.
- We were charged twice.
- When will our credit note be issued?

Most of these have an answer that already exists in your ERP. Someone on your team is reading the email, logging into the system, looking it up, and copying it back into a reply. That's the work automation should be doing.

## Step 1: Sort the inbox

Before you can answer anything automatically, you need to know what each email is asking for. This is a good job for an AI model, because customers don't write in consistent ways. "Can you send over the March paperwork", "need copy inv pls" and "our AP team can't find your bill from last month" are all the same request.

A classifier reads each incoming email and tags it:

- **Request type:** order status, invoice copy, statement, dispute, address change, complaint, other
- **Customer:** matched from the sender's email domain and any account numbers in the text
- **Documents referenced:** order numbers, invoice numbers, PO numbers
- **Urgency:** words like "overdue", "urgent", "stopped shipment", or a known key account

Even if you stopped here, it's useful. Emails land in the right queue, with the customer and order already identified, and urgent ones rise to the top.

## Step 2: Answer the routine ones

For request types where the answer is a lookup, the automation can do the lookup:

- **Invoice copies:** pull the PDF from the ERP and reply with it attached
- **Statements:** generate the statement of account as of today and send it
- **Order status:** look up the order and shipment, and reply with status and tracking
- **"Have you received our payment?":** check the account and confirm what's been applied

You decide how much runs without review. Many teams start with the automation drafting replies for a person to check and send, then switch the most reliable request types to send automatically once they trust them.

A few rules that make this work:

- Only send to known contacts on the account. Anything from an unknown address goes to a person.
- Never change data (addresses, bank details, contacts) automatically from an email. Those are common fraud routes. Draft the change and have a person confirm it.
- Keep the replies in your team's voice. Use your best agents' replies as the templates.

## Step 3: Route the rest, with context

Disputes, complaints and anything unusual go to a person. The difference is they arrive ready to work:

- The customer and account are identified
- The invoice, order and payment history are attached
- The request is summarised in a line at the top
- It's in the right person's queue, not the general pile

That alone saves several minutes per email, and it means the person spends those minutes on the actual problem.

## What to measure

- **First response time.** This usually drops the most, because routine requests are answered in minutes.
- **Emails handled per person per day.**
- **Share of emails resolved without a person.**
- **Reopen rate.** If customers are replying "that's not what I asked for", the classifier needs tuning.

## Where this fits with your other tools

If your team already uses a helpdesk like Zendesk, Freshdesk or HubSpot Service Hub, the automation sits alongside it: it reads tickets, adds tags and context, and posts replies through the helpdesk so everything stays in one history. If your team works straight out of Outlook or Gmail shared mailboxes, it works there too.

The ERP connection is what makes it valuable. Generic helpdesk AI can suggest a polite reply, but it can't attach invoice 40213 unless something is connected to the system that holds it.

## What stays with people

- Complaints and escalations
- Disputes about price, quality or delivery
- Anything involving a credit, refund or write-off above an agreed amount
- Relationships with key accounts

The aim isn't to stop customers from reaching a person. It's to make sure that when they do, the person has time to help.

## Related reading

- [Cash application and collections automation](post.html?slug=cash-application-and-collections-automation) uses the same email classification to route replies to payment reminders.
- [RPA vs. AI automation in finance](post.html?slug=rpa-vs-ai-automation-in-finance) explains why classification uses AI but the lookups and replies follow rules.
