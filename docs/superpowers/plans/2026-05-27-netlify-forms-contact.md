# Netlify Forms Contact Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current mailto-redirect contact form with a real Netlify Forms submission so messages land directly in the Netlify dashboard (and email inbox) without opening the user's email app.

**Architecture:** Netlify scans the deployed HTML for `data-netlify="true"` forms and auto-creates a submission endpoint. The JS submit handler POSTs form data via `fetch()` to the same page URL — Netlify intercepts it server-side. No backend code or API keys needed.

**Tech Stack:** Vanilla JS `fetch()`, `URLSearchParams`, Netlify Forms (zero-config), existing HTML/CSS form

---

## How Netlify Forms Works (explanation)

1. You add `data-netlify="true"` and `name="contact"` to your `<form>` tag.
2. When you deploy to Netlify, it scans your HTML and registers that form automatically.
3. On submit, you POST form data (including a hidden `form-name` field) to `/` (your own page).
4. Netlify intercepts the POST at the CDN edge — no server code needed.
5. Submissions appear in your Netlify dashboard → Forms, and Netlify emails you a notification.

Spam protection: adding `data-netlify-honeypot="bot-field"` tells Netlify to reject any submission where the hidden `bot-field` input is filled in (bots fill all fields; humans don't see it).

---

## Files Modified

| File | Change |
|------|--------|
| `index.html` (line 885) | Add `data-netlify`, `name`, honeypot attribute to `<form>`; add 2 hidden inputs; update status text |
| `script.js` (lines 597–638) | Replace mailto logic with `fetch()` POST, handle async success/error |

---

## Task 1: Update HTML form markup

**Files:**
- Modify: `index.html:885–902`

- [ ] **Step 1: Add Netlify attributes to `<form>` tag**

Change line 885 from:
```html
<form id="contact-form" class="contact-form glass-card p-6">
```
To:
```html
<form id="contact-form" name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" class="contact-form glass-card p-6">
```

- [ ] **Step 2: Add hidden inputs inside the form (after opening `<form>` tag)**

```html
<input type="hidden" name="form-name" value="contact">
<input type="hidden" name="bot-field">
```

- [ ] **Step 3: Update the status paragraph text (line 902)**

Change:
```html
<p id="form-status" class="text-sm text-gray-400 mt-3 text-center" aria-live="polite">Opens your email app with the message prefilled.</p>
```
To:
```html
<p id="form-status" class="text-sm text-gray-400 mt-3 text-center" aria-live="polite">I'll get back to you within 24 hours.</p>
```

---

## Task 2: Replace mailto handler with fetch submission

**Files:**
- Modify: `script.js:597–638`

- [ ] **Step 1: Replace the mailto block with a fetch POST**

Replace lines 597–638 (from `const formData = new FormData(form);` to the closing `}, 3000);`) with:

```javascript
const formData = new FormData(form);
const name = (formData.get('name') || '').toString().trim();
const email = (formData.get('email') || '').toString().trim();
const message = (formData.get('message') || '').toString().trim();

submitButton.innerHTML = `
    <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Sending...
`;
submitButton.disabled = true;

const body = new URLSearchParams({
    'form-name': 'contact',
    name,
    email,
    message
}).toString();

fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
})
.then(() => {
    submitButton.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Message Sent!
    `;
    submitButton.classList.add('success');
    if (status) {
        status.textContent = 'Thanks! I\'ll get back to you within 24 hours.';
        status.classList.add('text-emerald-400');
        status.classList.remove('text-gray-400', 'text-red-400');
    }
    form.reset();
    setTimeout(() => {
        submitButton.innerHTML = originalContent;
        submitButton.classList.remove('success');
        submitButton.disabled = false;
        refreshFeatherIcons();
        if (status) {
            status.textContent = 'I\'ll get back to you within 24 hours.';
            status.classList.remove('text-emerald-400');
            status.classList.add('text-gray-400');
        }
    }, 4000);
})
.catch(() => {
    submitButton.innerHTML = originalContent;
    submitButton.classList.remove('success');
    submitButton.disabled = false;
    refreshFeatherIcons();
    if (status) {
        status.textContent = `Something went wrong. Please email me directly at ${CONFIG.email}`;
        status.classList.add('text-red-400');
        status.classList.remove('text-gray-400', 'text-emerald-400');
    }
});
```

---

## Testing

After deploying to Netlify:
1. Submit the contact form with your name, email, and a test message
2. Check Netlify dashboard → **Forms** → **contact** — submission should appear within seconds
3. Check your email for Netlify's notification email
4. Confirm the form resets and shows the success state after submit
5. Confirm the error state: temporarily break the fetch URL and verify the error message appears
