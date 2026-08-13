---
title: "QuickBooks Web Connector Explained"
date: "2026-08-13"
description: "A plain-English explanation of the QuickBooks Web Connector — what it is, how qbXML and .qwc files work, and what happens during a sync session."
product: "arbridge"
---

If you run QuickBooks Desktop and an integration provider has ever told you to "install the Web Connector," you've probably wondered what that actually is and why it exists at all. This is the plain-English version — what it is, why it's built the way it is, and what actually happens during a sync.

## What the Web Connector Is

The **QuickBooks Web Connector (QBWC)** is a small Windows application Intuit ships to let outside software exchange data with a QuickBooks Desktop company file. It's been part of QuickBooks Desktop for years, and it's typically already installed — most integrations just need it enabled and pointed at the right service.

The key thing to understand: **the Web Connector, not the outside service, initiates every sync.** QuickBooks Desktop has no listening server waiting for the internet to reach in — that would be a significant security exposure for software sitting on a company's accounting data. Instead, the Web Connector runs on the same computer as QuickBooks, and on a schedule (or on demand), it reaches *out* to whatever service it's configured for and asks, "anything for me to do?"

## The .qwc File: How a Connection Gets Configured

Every Web Connector integration starts with a **`.qwc` file** — a small XML file that tells the Web Connector three things:
1. The **URL** of the service it should talk to (a SOAP endpoint)
2. A generated **username** for that connection
3. An **application ID/name** so QuickBooks can show the user what's asking for access

You get this file from the integration provider (typically as a download at the end of a setup wizard), then double-click it. QuickBooks Desktop registers the connection, asks you to set a password for that username, and — critically — **asks you to explicitly approve the level of access** the connection gets before anything syncs.

## What Happens During a Sync Session

Once configured, here's the actual sequence when the Web Connector runs:

1. **Authenticate.** The Web Connector calls the service's `authenticate()` method with the username/password you set. The service returns a session ticket.
2. **Ask what to do.** The Web Connector asks the service for the next qbXML request to run.
3. **Send the request into QuickBooks.** The Web Connector passes that request to your open QuickBooks Desktop application, which executes it against the live company file.
4. **Return the response.** Whatever QuickBooks returns gets sent back to the service.
5. **Repeat** until the service has nothing further to request, then the session closes.

The requests themselves are written in **qbXML** — an XML dialect specific to QuickBooks Desktop, with distinct message types for different operations. `CustomerQueryRq` reads customer records. `InvoiceQueryRq` reads invoices. `ReceivePaymentQueryRq` reads payments. There are equivalent `*AddRq` and `*ModRq` messages for *writing* data — which is exactly the distinction that matters most if you're evaluating who gets to touch your books.

## The One Question Worth Asking Every QuickBooks Integration: Read or Write?

Because the Web Connector protocol supports both reading and writing, **not every integration that uses it behaves the same way** — and QuickBooks itself doesn't restrict this for you by default. Two integrations can both say "we use the Web Connector" while one only ever sends `Query` messages and the other sends `Add`/`Mod` messages that create or change records in your file.

This is worth checking explicitly with any vendor before you approve a `.qwc` file, because the honest answer is usually buried in a support doc, not the marketing page. **ARBridge for QuickBooks** was built specifically for the "read-only" side of that line: it only issues `Query`-type qbXML requests — structurally, not just by policy — so there's no code path that could write back into your company file even if something went wrong upstream. It pulls customers, invoices, and payments out into HubSpot and computes AR aging and credit-status there, without ever sending QuickBooks anything to act on. See [how that fits into the bigger picture of connecting QuickBooks to HubSpot](post.html?slug=how-to-connect-quickbooks-to-hubspot) if that's the specific problem you're solving.

## Common Web Connector Questions

**Does the Web Connector need QuickBooks open to run?**
Yes — QuickBooks Desktop needs to be running (and, depending on configuration, a specific user logged in) for the Web Connector to execute requests against the company file.

**Does this work with QuickBooks Online?**
No. QuickBooks Online uses a completely different, cloud-based API — the Web Connector is a QuickBooks *Desktop*-only mechanism. See our [Desktop vs. Online comparison](post.html?slug=quickbooks-desktop-vs-online-hubspot-integration) if you're not sure which one you're running.

**Is it safe to approve a .qwc file?**
The Web Connector itself is an official Intuit component, and QuickBooks shows you an explicit access-level prompt before anything syncs — but that prompt only limits access, it doesn't tell you whether a given service actually uses that access to read or to write. That's on you to verify with the vendor.

**Why does the sync run on a schedule instead of instantly?**
Because QuickBooks Desktop has to be the one to initiate contact (see above), most integrations poll on an interval — commonly every few minutes to every hour — rather than syncing the instant something changes, the way a cloud-to-cloud integration might.

If you're evaluating a QuickBooks Desktop integration and it can't clearly answer "does this only read, or can it also write," that's worth treating as a real gap in the vendor's own understanding of their product — not just an FAQ they haven't gotten to yet.
