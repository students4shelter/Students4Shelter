/* ==========================================================================
   Students4Shelter — interactions
   1. Mobile navigation
   2. Story accordions
   3. Donation amount picker
   4. Newsletter subscription
   5. Footer year
   ========================================================================== */

(function () {
  'use strict'

  /* ------------------------------------------------------------------ *
   * 1. Mobile navigation
   * ------------------------------------------------------------------ */

  var menuToggle = document.getElementById('menuToggle')
  var mobileNav = document.getElementById('mobileNav')

  function setMenu(open) {
    if (!menuToggle || !mobileNav) return
    mobileNav.hidden = !open
    menuToggle.setAttribute('aria-expanded', String(open))
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    var use = menuToggle.querySelector('use')
    if (use) use.setAttribute('href', open ? '#i-close' : '#i-menu')
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      setMenu(mobileNav.hidden)
    })

    // Close the menu after tapping any link inside it.
    mobileNav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false)
    })

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !mobileNav.hidden) {
        setMenu(false)
        menuToggle.focus()
      }
    })
  }

  /* ------------------------------------------------------------------ *
   * 2. Story accordions
   * ------------------------------------------------------------------ */

  var storyToggles = document.querySelectorAll('.story-toggle')

  Array.prototype.forEach.call(storyToggles, function (toggle) {
    toggle.addEventListener('click', function () {
      var panel = document.getElementById(toggle.dataset.target)
      if (!panel) return

      var willOpen = panel.hidden
      panel.hidden = !willOpen
      toggle.setAttribute('aria-expanded', String(willOpen))

      var label = toggle.querySelector('.story-toggle-label')
      if (label) {
        label.textContent = willOpen
          ? 'Collapse story'
          : 'Read ' + toggle.dataset.name + '\u2019s full story'
      }
    })
  })

  // Open the first story by default so the section never reads as empty.
  if (storyToggles.length) storyToggles[0].click()

  /* ------------------------------------------------------------------ *
   * 3. Donation amount picker
   * ------------------------------------------------------------------ */

  var IMPACT = {
    25: 'One winter care kit: thermal socks, gloves, hand warmers and hygiene items.',
    60: 'Three hot meals a day for a week at a partner drop-in centre.',
    120: 'A shelter bed, bedding and intake support for four nights.',
    300: 'A full day of outreach for a two-person shelter team in the cold.',
  }

  var amountButtons = document.querySelectorAll('.amount-btn')
  var customAmount = document.getElementById('customAmount')
  var impactText = document.getElementById('impactText')
  var donateBtnLabel = document.getElementById('donateBtnLabel')
  var donateBtn = document.getElementById('donateBtn')

  var selectedTier = 60

  function activeAmount() {
    if (customAmount && customAmount.value !== '') {
      return Number(customAmount.value) || 0
    }
    return selectedTier
  }

  function render() {
    var amount = activeAmount()
    var usingCustom = customAmount && customAmount.value !== ''

    Array.prototype.forEach.call(amountButtons, function (button) {
      var isActive = !usingCustom && Number(button.dataset.amount) === selectedTier
      button.classList.toggle('is-active', isActive)
      button.setAttribute('aria-pressed', String(isActive))
    })

    if (impactText) {
      if (IMPACT[amount]) {
        impactText.textContent = IMPACT[amount]
      } else if (amount > 0) {
        impactText.textContent =
          '$' + amount + ' goes straight to whichever partner shelter is shortest on supplies this week.'
      } else {
        impactText.textContent = 'Enter an amount to see where it goes.'
      }
    }

    if (donateBtnLabel) {
      donateBtnLabel.textContent = amount > 0 ? 'Donate $' + amount : 'Donate now'
    }
  }

  Array.prototype.forEach.call(amountButtons, function (button) {
    button.addEventListener('click', function () {
      selectedTier = Number(button.dataset.amount)
      if (customAmount) customAmount.value = ''
      render()
    })
  })

  if (customAmount) {
    customAmount.addEventListener('input', render)
  }

  if (donateBtn) {
    donateBtn.addEventListener('click', function () {
      var amount = activeAmount()
      if (amount <= 0) {
        if (customAmount) customAmount.focus()
        return
      }
      // Payment processing is not connected yet — this is where a Stripe
      // Checkout session (or similar) would be created for `amount`.
      window.alert(
        'Thank you! Card payments are not connected yet.\n\n' +
          'To give $' +
          amount +
          ' today, email hello@students4shelter.ca and a student organizer will send you a secure link.'
      )
    })
  }

  render()

  /* ------------------------------------------------------------------ *
   * 4. Newsletter subscription
   * ------------------------------------------------------------------ */

  var form = document.getElementById('newsletterForm')
  var emailInput = document.getElementById('newsletterEmail')
  var errorNote = document.getElementById('newsletterError')
  var success = document.getElementById('newsletterSuccess')

  if (form && emailInput && success) {
    form.addEventListener('submit', function (event) {
      event.preventDefault()

      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())

      if (!valid) {
        if (errorNote) errorNote.hidden = false
        emailInput.setAttribute('aria-invalid', 'true')
        emailInput.focus()
        return
      }

      if (errorNote) errorNote.hidden = true
      emailInput.removeAttribute('aria-invalid')

      // Subscriber storage is not connected yet — this is where the email
      // would be POSTed to a mailing-list endpoint.
      form.hidden = true
      success.hidden = false
    })

    emailInput.addEventListener('input', function () {
      if (errorNote && !errorNote.hidden) {
        errorNote.hidden = true
        emailInput.removeAttribute('aria-invalid')
      }
    })
  }

  /* ------------------------------------------------------------------ *
   * 5. Footer year
   * ------------------------------------------------------------------ */

  var year = document.getElementById('year')
  if (year) year.textContent = String(new Date().getFullYear())
})()
