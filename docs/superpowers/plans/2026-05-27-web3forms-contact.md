# Web3Forms Contact Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Netlify Forms with Web3Forms so contact form submissions are delivered directly to the owner's email — and replace the old mailto-redirect with a polished animated success card shown inline after submit.

**Architecture:** The form POSTs JSON to `https://api.web3forms.com/submit` with the owner's `access_key`. Web3Forms emails the submission to the registered address and returns `{ success: true }`. On success, the form is hidden and replaced with an animated success card. No redirect, no email app opening.

**Tech Stack:** Vanilla JS `fetch()`, Web3Forms API (free tier, 250/month), CSS animations, existing glassmorphism design system

---

## How Web3Forms Works (explanation)

1. Go to https://web3forms.com/ — enter your email, get a free `access_key`.
2. Add that key as a hidden input inside your form.
3. POST form data as JSON to `https://api.web3forms.com/submit`.
4. Web3Forms emails you the submission and returns `{ success: true, message: "..." }`.
5. No backend, no account dashboard needed — just email delivery.

**Free tier:** 250 submissions/month, unlimited forms, spam protection built-in.

---

## Files Modified

| File | Change |
|------|--------|
| `index.html:885–905` | Remove Netlify attrs/inputs; add Web3Forms hidden inputs; add success card HTML |
| `script.js:594–659` | Replace Netlify fetch with Web3Forms JSON POST; hide form + show success card on success |
| `style.css` | Add `.form-success-card` styles and entrance animation |

---

## Task 1: Update HTML form markup

**Files:**
- Modify: `index.html:885–905`

- [ ] **Step 1: Replace the `<form>` opening tag — remove Netlify, keep clean**

Change:
```html
<form id="contact-form" name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" class="contact-form glass-card p-6">
    <input type="hidden" name="form-name" value="contact">
    <input type="hidden" name="bot-field">
```
To:
```html
<form id="contact-form" class="contact-form glass-card p-6">
    <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
    <input type="hidden" name="subject" value="New portfolio message from">
    <input type="hidden" name="from_name" value="Portfolio Contact">
```

> **ACTION REQUIRED:** Replace `YOUR_WEB3FORMS_ACCESS_KEY` with your real key from https://web3forms.com/

- [ ] **Step 2: Add the success card HTML right after the closing `</form>` tag**

```html
<!-- Success card — shown after form submit -->
<div id="form-success" class="form-success-card glass-card p-8 hidden" aria-live="polite">
    <div class="form-success-card__icon">
        <svg viewBox="0 0 52 52" class="form-success-card__checkmark">
            <circle cx="26" cy="26" r="25" fill="none" class="form-success-card__circle"/>
            <path fill="none" d="M14 27l8 8 16-16" class="form-success-card__check"/>
        </svg>
    </div>
    <h3 class="form-success-card__title">Message Sent!</h3>
    <p class="form-success-card__sub" id="form-success-name"></p>
    <p class="form-success-card__body">Your message is on its way. I'll review it and get back to you within 24 hours.</p>
    <button id="form-success-reset" class="btn-secondary mt-6">
        <i data-feather="edit-2"></i>
        Send another message
    </button>
</div>
```

---

## Task 2: Update JS submit handler

**Files:**
- Modify: `script.js:594–659`

- [ ] **Step 1: Replace the entire fetch block (lines 594–659) with Web3Forms POST**

Replace from `const submitButton = form.querySelector('button[type="submit"]');` to the closing `});` of the submit listener with:

```javascript
const submitButton = form.querySelector('button[type="submit"]');
if (!submitButton) return;
const originalContent = submitButton.innerHTML;
const formData = new FormData(form);
const senderName = (formData.get('name') || '').toString().trim();
const senderEmail = (formData.get('email') || '').toString().trim();
const message = (formData.get('message') || '').toString().trim();

// Update subject to include sender name
const subjectInput = form.querySelector('input[name="subject"]');
if (subjectInput) subjectInput.value = `New portfolio message from ${senderName}`;

submitButton.innerHTML = `
    <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Sending...
`;
submitButton.disabled = true;

fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
        access_key: form.querySelector('input[name="access_key"]').value,
        subject: `New portfolio message from ${senderName}`,
        from_name: 'Portfolio Contact',
        name: senderName,
        email: senderEmail,
        message
    })
})
.then(res => res.json())
.then(data => {
    if (data.success) {
        const successCard = document.getElementById('form-success');
        const successNameEl = document.getElementById('form-success-name');
        if (successNameEl) successNameEl.textContent = `Hi ${senderName}, thanks for reaching out!`;
        form.classList.add('hidden');
        if (successCard) {
            successCard.classList.remove('hidden');
            successCard.classList.add('form-success-card--visible');
        }
        form.reset();
        submitButton.innerHTML = originalContent;
        submitButton.disabled = false;
    } else {
        throw new Error(data.message || 'Submission failed');
    }
})
.catch(() => {
    submitButton.innerHTML = originalContent;
    submitButton.disabled = false;
    refreshFeatherIcons();
    if (status) {
        status.textContent = `Something went wrong. Email me directly at ${CONFIG.email}`;
        status.classList.add('text-red-400');
        status.classList.remove('text-gray-400', 'text-emerald-400');
    }
});
```

- [ ] **Step 2: Wire up the "Send another message" reset button**

Add this after the `if (form)` submit listener block (inside `initFormHandler`, after the closing `}`):

```javascript
const resetBtn = document.getElementById('form-success-reset');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        const successCard = document.getElementById('form-success');
        if (successCard) {
            successCard.classList.add('hidden');
            successCard.classList.remove('form-success-card--visible');
        }
        form.classList.remove('hidden');
        if (status) {
            status.textContent = "I'll get back to you within 24 hours.";
            status.classList.remove('text-emerald-400', 'text-red-400');
            status.classList.add('text-gray-400');
        }
        refreshFeatherIcons();
    });
}
```

---

## Task 3: Add success card CSS

**Files:**
- Modify: `style.css` (append at end of file)

- [ ] **Step 1: Append these styles to the end of `style.css`**

```css
/* ── Contact Form Success Card ───────────────────────────────── */
.form-success-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.4s ease, transform 0.4s ease;
}
.form-success-card.hidden { display: none !important; }
.form-success-card--visible {
    opacity: 1;
    transform: translateY(0);
}
.form-success-card__icon {
    width: 72px;
    height: 72px;
    margin-bottom: 0.5rem;
}
.form-success-card__checkmark {
    width: 72px;
    height: 72px;
}
.form-success-card__circle {
    stroke: var(--color-primary, #38bdf8);
    stroke-width: 2;
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    animation: stroke-circle 0.6s cubic-bezier(0.65,0,0.45,1) forwards;
}
.form-success-card__check {
    stroke: var(--color-primary, #38bdf8);
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: stroke-check 0.4s cubic-bezier(0.65,0,0.45,1) 0.6s forwards;
}
@keyframes stroke-circle {
    to { stroke-dashoffset: 0; }
}
@keyframes stroke-check {
    to { stroke-dashoffset: 0; }
}
.form-success-card__title {
    font-size: 1.5rem;
    font-weight: 700;
    background: var(--gradient-primary, linear-gradient(135deg, #38bdf8, #2dd4bf));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
.form-success-card__sub {
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-text-primary, #e2e8f0);
}
.form-success-card__body {
    font-size: 0.9rem;
    color: var(--color-text-secondary, #94a3b8);
    max-width: 320px;
    line-height: 1.6;
}
```

---

## Testing Checklist

1. Get access key from https://web3forms.com/ — enter your email, copy the key, paste into `input[name="access_key"]`
2. Open the portfolio locally — fill out the contact form and hit Send
3. The form should be replaced by the animated success card with your name
4. Check your inbox — Web3Forms sends a notification email within seconds
5. Click "Send another message" — form should reappear, success card hidden
6. Test the error path: temporarily set `access_key` to `"invalid"` — error message should appear inline
